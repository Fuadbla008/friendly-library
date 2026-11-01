# AGENT.md — BookNook Build Instructions

You are an AI coding agent building "BookNook", a small online library web app.
Follow this file strictly. Build in phases. After each phase, confirm it works before moving on.
Never use Lorem ipsum. Never use `alert()`. Always use toast.

---

## 🎯 Project Goal

BookNook = "Add a book, borrow a book, return a book."
Users browse books, add their own books, borrow books for a few days, and return them.

---

## 🧱 Tech Stack (MANDATORY)

### Client
- Next.js 14+ (App Router)
- JavaScript (or TypeScript if comfortable)
- Tailwind CSS + **DaisyUI** (or ShadCN, pick ONE — DaisyUI recommended for speed)
- Swiper.js (home slider)
- `react-hot-toast` or `sonner` (toasts)
- BetterAuth (with MongoDB adapter) + JWT for API calls
- Framer Motion or AOS (optional animation)

### Server
- Express JS + MongoDB (native driver OR Mongoose)
- JSON Web Token (JWT) — verify on protected routes
- CORS enabled (allow client origin)
- dotenv for secrets

### External Services
- Image upload: **imgbb** (free API key)
- Google OAuth: via BetterAuth
- Deployment: Client → Vercel, Server → Render

---

## 📁 Folder Structure

### Client repo (`booknook-client`)
```
booknook-client/
├── app/
│   ├── layout.jsx
│   ├── page.jsx                    # Home
│   ├── books/page.jsx              # All Books (public)
│   ├── books/[id]/page.jsx         # Book Details (private)
│   ├── add-book/page.jsx           # Private
│   ├── my-books/page.jsx           # Private
│   ├── my-borrows/page.jsx         # Private
│   ├── login/page.jsx
│   ├── register/page.jsx
│   ├── not-found.jsx
│   └── providers.jsx               # Auth + Theme provider
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── BookCard.jsx
│   ├── Loading.jsx
│   ├── PrivateRoute.jsx
│   ├── BorrowModal.jsx
│   ├── DeleteConfirmModal.jsx
│   └── home/
│       ├── HeroSlider.jsx
│       ├── NewArrivals.jsx
│       ├── HowBorrowingWorks.jsx
│       └── TopCategories.jsx
├── lib/
│   ├── auth-client.js              # BetterAuth client
│   ├── axios.js                    # axios instance w/ JWT interceptor
│   └── api.js                      # API helper functions
├── hooks/
│   └── useAxiosSecure.js
└── README.md
```

### Server repo (`booknook-server`)
```
booknook-server/
├── index.js
├── db.js
├── middleware/
│   ├── verifyJWT.js
│   └── verifyBetterAuth.js
├── routes/
│   ├── books.routes.js
│   └── borrows.routes.js
├── controllers/
│   ├── books.controller.js
│   └── borrows.controller.js
├── .env
└── README.md
```

---

## 🔌 API Contract (Server)

Base URL: `https://booknook-server.onrender.com`

### Books
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/books` | Public | Get all books (optional `?limit=6&sort=-createdAt`) |
| GET | `/books/:id` | Public | Get one book |
| POST | `/books` | Private (JWT) | Add a book |
| PATCH | `/books/:id` | Private (JWT) | Update a book (owner only) |
| DELETE | `/books/:id` | Private (JWT) | Delete a book (owner only) |

### Borrows
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/borrows` | Private | Borrow a book (decrease copies by 1) |
| GET | `/borrows?email=xxx` | Private | Get borrows of logged-in user |
| DELETE | `/borrows/:id` | Private | Return a book (increase copies by 1) |

### Book Schema
```js
{
  _id, title, author, category,  // "Fiction" | "Science" | "History" | "Kids" | "Others"
  image,                         // imgbb URL
  description,
  totalCopies,                   // default 1 (Challenge)
  availableCopies,               // default = totalCopies
  addedBy: { name, email },
  createdAt: Date
}
```

### Borrow Schema
```js
{
  _id, bookId, bookTitle, bookImage,
  userEmail, userName,
  borrowDate, returnDate
}
```

**On POST /borrows:**
1. Check user has not already borrowed this book (No Double Borrow).
2. Check `availableCopies > 0`.
3. `$inc: { availableCopies: -1 }` on the book.
4. Insert borrow record.

**On DELETE /borrows/:id:**
1. Delete borrow record.
2. `$inc: { availableCopies: +1 }` on the book.

---

## 🔐 Authentication Rules (BetterAuth)

- MongoDB adapter.
- Email + password (NO email verification, NO forget password).
- Google social login.
- On register success → redirect to `/login`.
- On login success → redirect to intended page or `/`.
- Password rules (validate on register):
  - ≥ 6 chars
  - ≥ 1 uppercase
  - ≥ 1 lowercase
- After login, client gets a **JWT** — attach `Authorization: Bearer <token>` to all private API calls.
- Server verifies JWT on protected routes.

**Reloading private route while logged in must NOT redirect to login.**
Use BetterAuth's session hook — show a loading spinner until session is resolved.

---

## 🗺️ Routes & Page Titles

| Route | Access | Title |
|-------|--------|-------|
| `/` | Public | BookNook \| Home |
| `/books` | Public | BookNook \| All Books |
| `/books/:id` | Private | BookNook \| Book Details |
| `/add-book` | Private | BookNook \| Add Book |
| `/my-books` | Private | BookNook \| My Books |
| `/my-borrows` | Private | BookNook \| My Borrows |
| `/login` | Public | BookNook \| Login |
| `/register` | Public | BookNook \| Register |
| `*` | — | 404 page with "Back to Home" |

Use Next.js `metadata` or `title` on each `page.jsx`.

---

## 🧩 Build Phases (DO IN THIS ORDER)

### PHASE 1 — Setup (both repos)
1. Create two GitHub repos: `booknook-client`, `booknook-server`.
2. Client: `npx create-next-app@latest booknook-client` → Tailwind YES, App Router YES.
3. Client: `npm i swiper react-hot-toast better-auth axios framer-motion daisyui`.
4. Server: `npm init -y && npm i express mongodb cors dotenv jsonwebtoken`.
5. Create `.env` files with placeholder keys.
6. **Commit #1 (client)**: `chore: initial nextjs + tailwind setup`
7. **Commit #1 (server)**: `chore: initial express + mongodb setup`

### PHASE 2 — MongoDB + BetterAuth (client)
1. Create MongoDB Atlas cluster + get connection string.
2. Set up BetterAuth with MongoDB adapter (`lib/auth.js` + `lib/auth-client.js`).
3. Configure Google OAuth in BetterAuth.
4. Create `app/providers.jsx` with AuthProvider.
5. **Commit #2**: `feat: better-auth + mongodb adapter + google login config`

### PHASE 3 — Layout (Navbar + Footer)
1. `components/Navbar.jsx`:
   - Left: logo + "BookNook"
   - Middle: Home, All Books, (Add Book, My Books, My Borrows — private only)
   - Right: Logged out → Login/Register buttons; Logged in → user avatar with dropdown (Name, My Profile, Logout). Optional theme toggle.
2. `components/Footer.jsx`:
   - Logo, short line, contact, social (use NEW X logo, not Twitter bird), copyright.
3. **Commit #3**: `feat: navbar with private links + user dropdown`
4. **Commit #4**: `feat: footer with new X logo + social links`

### PHASE 4 — Home Page
1. `HeroSlider.jsx` with Swiper — min 3 slides, each with title, text, "Browse Books" → `/books`.
2. `NewArrivals.jsx` — fetch `GET /books?limit=6&sort=-createdAt` → 6 cards.
3. `BookCard.jsx` — image, title, author, category, "View Details" button.
4. "See All Books" button below cards → `/books`.
5. Two extra static sections: `HowBorrowingWorks.jsx` and `TopCategories.jsx`.
6. **Commit #5**: `feat: swiper hero slider with 3 slides`
7. **Commit #6**: `feat: new arrivals dynamic section (latest 6)`
8. **Commit #7**: `feat: how borrowing works + top categories sections`

### PHASE 5 — Auth Pages
1. `login/page.jsx` — title, email, password, submit button, "Forget Password" link (non-functional), Register link, Google button.
2. `register/page.jsx` — title, name, email, photo URL, password, submit, Login link, Google button. Validate password on submit; show errors inline + toast.
3. On successful login → redirect to `intendedPath` (from `?redirect=`) or `/`.
4. On successful register → redirect to `/login`.
5. **Commit #8**: `feat: login page with google + better-auth`
6. **Commit #9**: `feat: register page with password validation`

### PHASE 6 — Books Pages (CRUD)
1. `/books/page.jsx` — grid 3-cols desktop, responsive; loading spinner while fetching.
2. `/books/[id]/page.jsx` — all details + "Borrow This Book" button (opens BorrowModal). If `availableCopies === 0` → button disabled + show "Not Available".
3. `/add-book/page.jsx` — form (title, author, category select, image → imgbb, short description, read-only userName/email, totalCopies). On submit → POST `/books` with JWT → success toast → redirect `/my-books`.
4. `/my-books/page.jsx` — only books where `addedBy.email === user.email`. Each book has Edit + Delete. Delete opens custom confirm modal (not browser confirm). Edit → form pre-filled → PATCH.
5. **Commit #10**: `feat: all books page with grid layout`
6. **Commit #11**: `feat: book details page + borrow button`
7. **Commit #12**: `feat: add book form with imgbb upload`
8. **Commit #13**: `feat: my-books page with edit and delete modal`

### PHASE 7 — Borrow System
1. `BorrowModal.jsx` — read-only userName + userEmail, "Confirm Borrow" button.
2. On submit → POST `/borrows` → success toast → close modal → refresh.
3. Handle errors:
   - "Already borrowed" → error toast (No Double Borrow).
   - "Not available" → error toast.
4. `/my-borrows/page.jsx` — table with image, title, borrowDate, returnDate, "Return Book" button.
5. Return → DELETE `/borrows/:id` → success toast.
6. **Commit #14**: `feat: borrow modal + my-borrows table`
7. **Commit #15**: `feat: return book with available copies increment`

### PHASE 8 — Server Implementation
1. `db.js` — MongoClient connect.
2. `middleware/verifyJWT.js` — verify Bearer token (use jsonwebtoken + same secret BetterAuth uses OR use BetterAuth's verification endpoint).
3. Implement all 8 routes (see API Contract above).
4. **Commit #2**: `feat: books GET/POST/PATCH/DELETE routes`
5. **Commit #3**: `feat: borrows POST/GET/DELETE with $inc logic`
6. **Commit #4**: `feat: JWT verification middleware`
7. **Commit #5**: `feat: double-borrow prevention + availability check`
8. **Commit #6**: `chore: add CORS + error handling`
9. **Commit #7**: `feat: sort + limit on GET /books for new arrivals`
10. **Commit #8**: `chore: env setup + prepare for render deploy`

### PHASE 9 — Polish
1. Loading spinner component used everywhere data is fetched.
2. `not-found.jsx` with "Back to Home".
3. Toast on every success/error (never `alert()`).
4. Ensure no Lorem ipsum.
5. Verify reload behavior on private routes.
6. Add optional dark/light toggle (bonus).
7. **Commit (client)**: `feat: loading + 404 + toast polish`
8. **Commit (client)**: `chore: readme + live url`

### PHASE 10 — Deploy
1. Server → Render. Set env vars. Note live URL.
2. Client → Vercel. Set env vars (`NEXT_PUBLIC_API_URL`, BetterAuth secrets, Google keys). Note live URL.
3. Configure BetterAuth `trustedOrigins` to include the Vercel URL.
4. Update `client/README.md` with:
   - Website name (BookNook)
   - Live site URL
   - 5+ feature bullets
5. Final commit + push.

---

## ✅ Acceptance Checklist (verify before finishing)

- [ ] Navbar shows private links only when logged in
- [ ] User avatar dropdown shows Name, My Profile, Logout
- [ ] Footer has NEW X logo (not old bird), contact, social, copyright
- [ ] Home has Swiper slider with 3+ slides
- [ ] New Arrivals shows latest 6 books (sorted desc)
- [ ] Two extra static home sections exist
- [ ] Login page has email, password, forget link, register link, Google button
- [ ] Register page has name, email, photo, password, login link, Google button
- [ ] Password validation (upper + lower + 6 chars) blocks invalid registration
- [ ] Register success → redirect to `/login`
- [ ] Login success → redirect to intended page
- [ ] Reloading any private route while logged in does NOT redirect to login
- [ ] Reloading any route never 404s (SPA-fallback works)
- [ ] Add Book form has all fields + read-only user info + imgbb upload
- [ ] All Books grid is 3-col on desktop, responsive
- [ ] Book Details shows all info + owner + Borrow button
- [ ] Disabled "Not Available" when copies = 0
- [ ] Borrow modal has read-only user info + Confirm Borrow
- [ ] My Books shows only user's books with Edit + Delete (custom modal)
- [ ] My Borrows shows table with Return button
- [ ] No double borrow (error toast)
- [ ] Return increments availableCopies via $inc
- [ ] All 8 API routes work
- [ ] JWT verified on protected routes
- [ ] Toast on every success/error (no `alert`)
- [ ] No Lorem ipsum anywhere
- [ ] Custom 404 with Back to Home
- [ ] Page titles per route
- [ ] Loading spinner during fetch
- [ ] 15+ client commits, 8+ server commits
- [ ] README has website name + live URL + 5+ bullets
- [ ] Both deployed and accessible

---

## 🚫 Hard Rules (Never violate)

1. NO Lorem ipsum — write real English copy.
2. NO `alert()` / `confirm()` / `prompt()` — use toasts + custom modals.
3. NO redirect to login on reload if session exists — resolve session first, then decide.
4. NO page errors on reload from any route — configure SPA fallback on Vercel.
5. Use NEW X logo, not old Twitter bird.
6. All cards equal height & width — use `h-full` + flex column.
7. Consistent button style everywhere — define once, reuse.
8. Google OAuth must be via BetterAuth (not custom).
9. JWT must be verified server-side for POST/PATCH/DELETE/POST-borrows/GET-borrows/DELETE-borrows.
10. Total copies on add-book defaults to 1 if not provided.

---

## 🧪 Test After Each Phase

Run `npm run dev` (client) and `node index.js` (server). Manually test the phase's features before committing. Only commit when the feature works.