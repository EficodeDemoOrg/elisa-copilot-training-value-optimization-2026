# 🤖 GitHub Copilot Value Optimization - Exercise Repo

This repository is a hands-on playground for **GitHub Copilot exercises**.

The exercises can be found in the [exercises directory](exercises/):

- [01-getting-started.md](exercises/01-getting-started.md)
- [02-chat-panel.md](exercises/02-chat-panel.md)
- [03-agent-mode.md](exercises/03-agent-mode.md)
- [04-plan-mode.md](exercises/04-plan-mode.md)

The exercises are performed against the small full-stack **Team Skills Matrix Platform** web app included in this repo. The app is intentionally simple so you can focus on practicing Copilot workflows rather than learning a complex codebase.

> No prior knowledge of TypeScript or Node.js is required for the exercises.

---

# Kanban Board App

A full-stack Kanban board app for organizing tasks across columns, used as the playground for the exercises above.

## 🛠️ Technology stack

- **Web** — React 18, Vite, TypeScript, Tailwind CSS, Radix UI, TanStack Query, Zustand, dnd-kit, React Router
- **Server** — Node.js, Express 4, Zod, lowdb (JSON file storage), nanoid
- **Shared** — TypeScript types in `@kanban/shared`
- **Tooling** — npm workspaces, tsx, Vitest, Testing Library, ESLint

## ✅ Requirements

- Node.js >= 20
- npm (workspaces support)

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5890. The API runs on http://localhost:5891 and is proxied via `/api` from the web app. Override with the `WEB_PORT` and `API_PORT` env vars.

## 📁 Project layout

```
apps/
  server/   Express API + lowdb persistence (data/db.json)
  web/      React + Vite client
packages/
  shared/   Shared TypeScript types
INSTRUCTOR/ Demo playbook and instructor notes
```

## 📜 Scripts

Run from the repository root:

- `npm run dev` — start server and web app concurrently
- `npm run build` — build shared, server, then web
- `npm test` — run web unit tests (Vitest)
- `npm run lint` — lint the web app

## 🧪 Tests

Vitest + Testing Library run in the `@kanban/web` workspace:

```bash
npm test                   # one-off run
npm test -w @kanban/web -- --watch   # watch mode
```

## 🗑️ Resetting the data

The server persists state to `apps/server/data/db.json`, seeded from `db.seed.json` on first start. To reset to the seed:

```bash
rm apps/server/data/db.json
```

The file is recreated from the seed on the next server start.
