# Friendly Library

Friendly Library is a shared online library. Readers browse the shelf, add books from
their own collection, borrow a copy for 14 days, and return it for the next
person.

**Live site:** https://YOUR-CLIENT.vercel.app (replace after deployment)

The client is a Next.js 16 App Router app. It talks to a separate Express +
MongoDB API and uses BetterAuth for email/password and Google sign-in.

## Features

- Editorial home page with a Swiper hero, new arrivals from the API, and
  category shelves.
- Searchable catalogue with category filters, sorting, and a responsive
  three-column grid.
- Full book detail pages with cover, description, owner, and live copy counts.
- Borrow and return flows with duplicate-borrow and zero-availability errors
  shown as toasts.
- Add, edit, and delete your own listings, with cover uploads through imgbb.
- BetterAuth email/password and Google sign-in on top of MongoDB.
- JWT bearer tokens on private API calls, with private routes that wait for the
  session before redirecting.
- Custom 404, page titles in the `Friendly Library | Page` format, Sonner toasts, and
  custom modals instead of browser dialogs.
- Accessible controls, keyboard-friendly navigation, and WCAG AA colour
  contrast.

## Tech stack

- Next.js 16 (App Router, React Compiler, Cache Components)
- React 19 and JavaScript
- Tailwind CSS v4 with DaisyUI 5
- BetterAuth with the MongoDB adapter and JWT plugin
- Axios, Swiper, Sonner, Lucide, and Framer Motion
- Express + MongoDB API in a separate repository

## Environment

Copy `.env.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-key

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=at-least-32-random-characters
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/
MONGODB_DB=friendly_library

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

`BETTER_AUTH_URL` is the client origin, not the API origin. The Express server
reads the public keys from `<BETTER_AUTH_URL>/api/auth/jwks`, so the two values
must match.

Google Cloud Console needs this redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

Add the deployed callback as a second URI when you go live.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API should be running
on [http://localhost:5000](http://localhost:5000).

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint 9 flat config
```

## API contract

The client uses these routes from the separate API:

| Method | Route | Access |
|---|---|---|
| GET | `/books` | Public |
| GET | `/books/:id` | Public |
| POST | `/books` | JWT |
| PATCH | `/books/:id` | JWT + owner |
| DELETE | `/books/:id` | JWT + owner |
| POST | `/borrows` | JWT |
| GET | `/borrows` | JWT |
| DELETE | `/borrows/:id` | JWT + borrower |

New arrivals call `GET /books?limit=6&sort=-createdAt`, so MongoDB does the sort
and limit. The owner and borrower identity always come from the verified JWT,
not from the request body.

## Deployment

Client on Vercel:

```env
NEXT_PUBLIC_API_URL=https://YOUR-SERVER.onrender.com
NEXT_PUBLIC_IMGBB_API_KEY=...
BETTER_AUTH_URL=https://YOUR-CLIENT.vercel.app
BETTER_AUTH_SECRET=...
MONGODB_URI=...
MONGODB_DB=friendly_library
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Server on Render:

```env
NODE_ENV=production
MONGODB_URI=...
MONGODB_DB=friendly_library
BETTER_AUTH_URL=https://YOUR-CLIENT.vercel.app
CLIENT_ORIGINS=https://YOUR-CLIENT.vercel.app
LOAN_DAYS=14
```

After deploying, register a real account, load `/my-books` and `/my-borrows`
again, and test borrow, double borrow, return, and the last-copy state.
