# AGENTS.md

## Project

"BookNook" online library app. This repository is the **Next.js client only**; the Express + MongoDB API described in `agent.md` lives in a separate server repo. Read `agent.md` before feature work — it is the graded product spec, not agent instructions. Its folder tree is pre-scaffold: adapt paths to this repo instead of creating a root `app/` directory.

## Commands

- `npm install` — required first; no `package-lock.json` or `node_modules` is committed.
- `npm run dev` — Turbopack dev server at http://localhost:3000.
- `npm run build` / `npm start` — production build and serve.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`). Lint one file with `npx eslint src/app/page.js`.
- No test runner, typecheck, CI, or formatter is configured; do not invent commands for them.

## Code layout and toolchain

- App Router entrypoints are in `src/app` (not root `app/`). `@/*` maps to `src/*` via `jsconfig.json`. The repo is JavaScript, so use `.js`, not the `.jsx` names in `agent.md`.
- Tailwind is v4, CSS-first: `src/app/globals.css` uses `@import "tailwindcss"` and `@theme inline`. There is no `tailwind.config.js`. Tailwind is wired through the `turbopack.rules` CSS loader in `next.config.mjs`, not PostCSS. Add DaisyUI via `@plugin "daisyui";` in `globals.css`.
- `next.config.mjs` enables React Compiler (`reactCompiler`) and `cacheComponents`. Don't add manual `useMemo`/`useCallback` by default, and don't assume classic full-route caching — explicitly opt into cached data and wrap uncached dynamic reads in Suspense.
- Spec dependencies not yet installed: `daisyui`, `swiper`, `better-auth`, `axios`, `sonner` or `react-hot-toast`, `framer-motion`. Install them when the relevant feature is built.
- No env files exist and `.env*` is gitignored. Use `NEXT_PUBLIC_API_URL` for the deployed server origin; keep secrets out of commits.

## Spec constraints that are easy to miss

- Never use `alert()`, `confirm()`, or `prompt()` — use toasts and custom modals. Never use Lorem ipsum; all copy must be real English.
- Auth is BetterAuth (MongoDB adapter, email/password + Google) with a JWT `Authorization: Bearer` header on private API calls. Private routes must resolve the session (spinner) before redirecting, so reloading while logged in does not bounce to login.
- Book covers upload through imgbb. `totalCopies` defaults to 1; borrowing must reject double borrows and zero availability, and decrement/increment `availableCopies` atomically — those rules belong to the server, not client-only state.
- Page titles follow `BookNook | <Page>`, include a custom 404 with "Back to Home", a responsive 3-column book grid, and equal-height cards.
- Commit after each `agent.md` phase (the spec expects 15+ client commits). Replace the boilerplate README with the BookNook name, live URL, and 5+ feature bullets.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
