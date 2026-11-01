# BookNook

A warm, bookish shared library. Browse the shelf, borrow a story for fourteen days, and pass it on when you are done.

**Live site:** https://booknook-client.vercel.app — update this line with the final Vercel URL after deployment.

## Features

- **An editorial home page** with a three-slide Swiper hero, new arrivals, a borrowing walkthrough, and browsable shelves.
- **A searchable catalogue** with category filters, sort options, and a responsive three-column grid of equal-height cards.
- **Full book details** including cover, category, description, owner, copy counter, and a guided borrow modal.
- **Borrow and return in two clicks** with duplicate-borrow and zero-availability guards, plus a nightstand view of every active loan.
- **Share your own books** with a live preview, imgbb-ready cover upload, and per-title copy counts.
- **Edit and delete your listings** through the same form and a custom confirmation modal — never a browser dialog.
- **Email and Google sign-in** built on a BetterAuth-shaped client, with private routes that resolve the session before redirecting.
- **Feedback everywhere** with Sonner toasts, custom modals, a custom 404, and page titles in the `BookNook | …` format.
- **Accessible by default:** keyboard-friendly navigation, visible focus rings, labelled controls, and WCAG AA colour contrast across the app.

## Design direction

BookNook is styled as a reading room rather than a dashboard. Fraunces carries the headlines, Geist keeps the interface quiet, and the palette stays close to paper: cream `#f6f0e4`, ink `#172621`, forest `#1d3b32`, and a deep terracotta `#a94a2b` for action. Tailwind v4 and DaisyUI provide the token layer through a custom `booknook` theme in `src/app/globals.css`.

## Tech stack

- Next.js 16 (App Router, React Compiler, Cache Components)
- React 19 and JavaScript
- Tailwind CSS v4 with DaisyUI 5
- Swiper, Sonner, Lucide, and Framer Motion
- BetterAuth, Axios, and imgbb integrations ready for the API

The Express + MongoDB service described in `agent.md` lives in a separate server repository. Until it is connected, the client runs on a local mock layer that mirrors the documented API contract.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint 9 flat config
```

No environment file is required for the mock experience. When the API is ready, set `NEXT_PUBLIC_API_URL` to the server origin.

## Demo account

Use **Enter as Ava** on the login page, or sign in with `ava@booknook.demo` and any password. Data is stored in `localStorage` so borrowing, adding, editing, and returning all survive a reload.

## Project structure

```text
src/
├── app/
│   ├── (main)/            # public shell with navbar and footer
│   ├── (auth)/            # split-screen login and register layout
│   ├── providers.js       # auth, library, and toast providers
│   ├── not-found.js       # custom 404
│   └── globals.css        # DaisyUI theme, tokens, and utilities
├── components/            # navbar, footer, cards, modals, forms, sections
└── lib/                   # mock auth, library store, seed data, helpers
```

## Deployment

Deploy the client to Vercel and point `NEXT_PUBLIC_API_URL` at the Render-hosted API. Add the Vercel origin to BetterAuth's `trustedOrigins` so Google sign-in can complete the redirect.
