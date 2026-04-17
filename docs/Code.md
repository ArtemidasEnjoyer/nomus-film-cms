# Code Architecture & Conventions

This project utilizes a highly efficient, lightweight stack designed for performance and a cinematic user experience.

## Stack Overview
*   **Frontend Library:** Preact (A fast, 3kB alternative to React with identical APIs).
*   **State Management:** `@preact/signals`. Provides deep reactivity without relying on the React Context API or excessive re-renders.
*   **Styling:** Tailwind CSS. Used heavily for responsive design, dark mode (`dark:` variant), and complex keyframe animations.
*   **Backend:** Node.js + Express 5.
*   **Database:** SQLite (`better-sqlite3` for synchronous, high-performance local data storage).
*   **Bundler:** Vite.

## State Management Approach
Global state is managed via Signals rather than Context providers. 
Hooks like `useLanguage.js` export signals directly:
```javascript
const lang = signal(localStorage.getItem('lang') || 'EN');
```
Components that read `.value` from a signal automatically subscribe to updates. This drastically reduces boilerplate and avoids unnecessary re-renders in higher-order components.

## UI & Animation Conventions
*   **Cinematic Animations:** Tailwind keyframes (`animate-fade-in-up`, `animate-slide-in-right`) are used extensively for element entrances.
*   **Intersection Observers:** The `Home.jsx` and `Articles.jsx` pages use native `IntersectionObserver` to trigger Tailwind CSS transitions when elements scroll into the viewport.
*   **Loading States:** To prevent UI flashing and ensure observers fire correctly, `app.jsx` utilizes an `InitialLoader` splash screen that blocks mounting until `useArticles` finishes its initial API fetch.

## Security & Validation
*   **Sanitization:** Markdown content written in the `Admin.jsx` dashboard is rendered safely using `DOMPurify` inside the `<MarkdownViewer />` component.
*   **Backend Validation:** Express endpoints use `zod` schema validation to ensure malformed requests are rejected with a `400 Bad Request` before hitting the SQLite database.
*   **Authentication:** 
    *   Passwords are hashed via `bcryptjs`.
    *   Sessions are completely stateless, using `jsonwebtoken` (JWT). The frontend passes this token via the `Authorization: Bearer <token>` header.

## Routing
Preact Router is not used. Instead, a lightweight, custom history-based router is implemented in `app.jsx` that listens to `popstate` and intercepts `<a>` clicks to prevent full page reloads, maintaining the SPA (Single Page Application) feel.
