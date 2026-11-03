"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const { user, ready: authReady } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [borrowError, setBorrowError] = useState(null);

  const refreshBooks = useCallback(async () => {
    const { data } = await api.get("/books");
    setBooks(data);
    setError(null);
    return data;
  }, []);

  const refreshBorrows = useCallback(async () => {
    if (!user) return [];
    const { data } = await api.get("/borrows");
    setBorrows(data);
    setBorrowError(null);
    return data;
  }, [user]);

  useEffect(() => {
    let alive = true;

    async function loadBooks() {
      try {
        const { data } = await api.get("/books");
        if (alive) setBooks(data);
      } catch (err) {
        if (alive) {
          setError(
            err?.response?.data?.message ||
              "Could not load the shelf. Is the API running?"
          );
        }
      } finally {
        if (alive) setReady(true);
      }
    }

    loadBooks();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;

    let alive = true;

    async function loadBorrows() {
      try {
        const { data } = await api.get("/borrows");
        if (alive) {
          setBorrows(data);
          setBorrowError(null);
        }
      } catch (err) {
        if (alive) {
          setBorrowError(
            err?.response?.data?.message || "Could not load your borrowed books."
          );
        }
      }
    }

    loadBorrows();
    return () => {
      alive = false;
    };
  }, [authReady, user]);

  async function getBook(id) {
    const { data } = await api.get(`/books/${encodeURIComponent(id)}`);
    return data;
  }

  async function addBook(data) {
    const { data: book } = await api.post("/books", data);
    setBooks((current) => [book, ...current]);
    return book;
  }

  async function updateBook(id, data) {
    const { data: book } = await api.patch(
      `/books/${encodeURIComponent(id)}`,
      data
    );
    setBooks((current) =>
      current.map((item) => (item.id === id ? book : item))
    );
    return book;
  }

  async function deleteBook(id) {
    await api.delete(`/books/${encodeURIComponent(id)}`);
    setBooks((current) => current.filter((item) => item.id !== id));
    setBorrows((current) => current.filter((item) => item.bookId !== id));
  }

  async function borrowBook(bookId) {
    const { data: borrow } = await api.post("/borrows", { bookId });
    setBorrows((current) => [borrow, ...current]);
    setBooks((current) =>
      current.map((item) =>
        item.id === bookId
          ? { ...item, availableCopies: Math.max(0, item.availableCopies - 1) }
          : item
      )
    );
    return borrow;
  }

  async function returnBorrow(borrowId) {
    const borrow = borrows.find((item) => item.id === borrowId);
    await api.delete(`/borrows/${encodeURIComponent(borrowId)}`);
    setBorrows((current) => current.filter((item) => item.id !== borrowId));

    if (borrow) {
      setBooks((current) =>
        current.map((item) =>
          item.id === borrow.bookId
            ? {
                ...item,
                availableCopies: Math.min(
                  item.totalCopies,
                  item.availableCopies + 1
                ),
              }
            : item
        )
      );
    }
  }

  const value = {
    books,
    borrows: user ? borrows : [],
    ready,
    error,
    borrowError: user ? borrowError : null,
    getBook,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBorrow,
    refreshBooks,
    refreshBorrows,
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
