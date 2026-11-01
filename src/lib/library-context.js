"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SEED_BOOKS, SEED_BORROWS } from "@/lib/seed";

const BOOKS_KEY = "booknook:v1:books";
const BORROWS_KEY = "booknook:v1:borrows";
const LOAN_DAYS = 14;

const LibraryContext = createContext(null);

function makeId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

function readStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(SEED_BOOKS);
  const [borrows, setBorrows] = useState(SEED_BORROWS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the mock library once from localStorage
    setBooks(readStored(BOOKS_KEY, SEED_BOOKS));
    setBorrows(readStored(BORROWS_KEY, SEED_BORROWS));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
      window.localStorage.setItem(BORROWS_KEY, JSON.stringify(borrows));
    } catch {
      // A very large cover image can exceed localStorage; the in-memory library still works.
    }
  }, [books, borrows, ready]);

  function getBook(id) {
    return books.find((book) => book.id === id);
  }

  function addBook(data, user) {
    const totalCopies = Math.max(1, Number(data.totalCopies) || 1);
    const book = {
      id: makeId("book"),
      title: data.title.trim(),
      author: data.author.trim(),
      category: data.category,
      image: data.image || "",
      description: data.description.trim(),
      totalCopies,
      availableCopies: totalCopies,
      addedBy: { name: user.name, email: user.email },
      createdAt: new Date().toISOString(),
    };
    setBooks((current) => [book, ...current]);
    return book;
  }

  function updateBook(id, data) {
    setBooks((current) =>
      current.map((book) => {
        if (book.id !== id) return book;
        const totalCopies = Math.max(1, Number(data.totalCopies) || 1);
        const onLoan = Math.max(0, book.totalCopies - book.availableCopies);
        return {
          ...book,
          title: data.title.trim(),
          author: data.author.trim(),
          category: data.category,
          image: data.image || "",
          description: data.description.trim(),
          totalCopies,
          availableCopies: Math.max(0, totalCopies - onLoan),
        };
      })
    );
  }

  function deleteBook(id) {
    setBooks((current) => current.filter((book) => book.id !== id));
    setBorrows((current) => current.filter((borrow) => borrow.bookId !== id));
  }

  function borrowBook(bookId, user) {
    const book = getBook(bookId);
    if (!book) return { ok: false, error: "That book is no longer on the shelf." };
    if (book.availableCopies <= 0) {
      return { ok: false, error: "No copies are available right now." };
    }
    const alreadyBorrowed = borrows.some(
      (borrow) =>
        borrow.bookId === bookId && borrow.userEmail === user.email
    );
    if (alreadyBorrowed) {
      return { ok: false, error: "You already have this book borrowed." };
    }

    const now = new Date();
    const due = new Date(now.getTime() + LOAN_DAYS * 86400000);
    const borrow = {
      id: makeId("borrow"),
      bookId: book.id,
      bookTitle: book.title,
      bookImage: book.image,
      userEmail: user.email,
      userName: user.name,
      borrowDate: now.toISOString(),
      returnDate: due.toISOString(),
    };

    setBooks((current) =>
      current.map((item) =>
        item.id === bookId
          ? { ...item, availableCopies: Math.max(0, item.availableCopies - 1) }
          : item
      )
    );
    setBorrows((current) => [borrow, ...current]);
    return { ok: true, borrow };
  }

  function returnBorrow(borrowId) {
    const borrow = borrows.find((item) => item.id === borrowId);
    if (!borrow) return { ok: false, error: "That loan could not be found." };
    setBorrows((current) => current.filter((item) => item.id !== borrowId));
    setBooks((current) =>
      current.map((book) =>
        book.id === borrow.bookId
          ? {
              ...book,
              availableCopies: Math.min(
                book.totalCopies,
                book.availableCopies + 1
              ),
            }
          : book
      )
    );
    return { ok: true };
  }

  const value = {
    books,
    borrows,
    ready,
    getBook,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBorrow,
  };

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used inside LibraryProvider");
  }
  return context;
}
