# NomusFilm Technical Documentation

## 1. Project Overview
NomusFilm is a modern, lightweight web application designed for a cinematic production house. It features a high-performance frontend built with **Preact**, a minimalist **Node.js/Express** backend for content management, and a custom design system focused on "Cinematic Essentialism."

---

## 2. Tech Stack
- **Frontend:** Preact (Lightweight React alternative)
- **State Management:** Preact Signals (Global reactive state)
- **Styling:** Tailwind CSS + PostCSS
- **Backend:** Node.js + Express
- **Build Tool:** Vite
- **Data Storage:** Local JSON files (`data/*.json`)
- **Fonts:** Playfair Display (Headings), Plus Jakarta Sans (Body), Dancing Script (Calligraphy)

---

## 3. Core Architectural Systems

### A. Theming Engine (`useTheme.js`)
- **Strategy:** Uses CSS Variables and a Tailwind `class` strategy.
- **Persistence:** Theme choice is saved in `localStorage`.
- **Transitions:** Implemented a global 0.4s smooth transition for background and border changes to eliminate "flicker" and provide a premium feel.
- **Palette:** 
  - Light: Deep Slate (#0f172a) on White.
  - Dark: Soft White (#f8fafc) on Deep Slate.

### B. Internationalization (`useLanguage.js`)
- **Supported Languages:** English (EN) and Italian (IT).
- **Implementation:** Centralized translation object managed by a reactive Signal.
- **Scope:** 100% of the site is translated, including navigation, hero text, story descriptions, and administrative alerts.

### C. Article Management System (`useArticles.js`)
- **Source of Truth:** Data is stored in `data/articles.json` (private, non-cached).
- **Sync:** All pages (Home, Articles, Admin) share a single global `articles` signal.
- **Cache Busting:** Every fetch request includes a timestamp parameter to prevent browser caching of static JSON data.
- **Optimistic UI:** Delete operations remove the item from the UI *instantly* before the server confirms, with automatic rollback if the network fails.

---

## 4. Security & Administration

### A. Two-Step Authentication Flow
1. **Initial Login:** Standard entry via default password (`admin123`).
2. **Account Setup:** On first entry, the user is prompted to create a unique **Username** and **Password**.
3. **Storage:** Credentials are saved in `data/auth.json`.
4. **Tokenization:** Subsequent requests use a Base64-encoded Bearer token for verification.

### B. Admin Dashboard (Creator Studio)
- **CRUD Capabilities:** Full Create, Read, Update, and Delete (CRUD) support.
- **Visual Editor:** Includes a "Canva-lite" live preview sidebar that shows exactly how the article will look on the site.
- **Firefox Compatibility:** Replaced all browser `confirm()` popups with custom in-page UI confirmation buttons (Yes/No) to bypass popup blockers.
- **Dynamic Navigation:** The "Admin" menu option only appears in the Navbar *after* a successful login.

---

## 5. Visual & Interaction Design
- **Cinematic Entrance:** Staggered fade-in animations for the hero section (Tagline -> Title -> Description -> CTA).
- **Background Reveal:** Hero background uses a slow 2s opacity reveal instead of distracting zoom effects.
- **Hover States:** Grayscale-to-color transitions on all cinematic images and portfolio cards.
- **Accessibility:** High-contrast text selection for the light theme to ensure readability on all devices.

---

## 6. Directory Structure
```text
/
├── data/               # Persistent JSON storage (Articles, Auth)
├── docs/               # Technical documentation and plans
├── public/             # Static assets (Favicon, articles.json backup)
├── src/
│   ├── assets/         # NomusFilm images, logos, and creator photos
│   ├── components/     # Reusable UI (Navbar, Layout, BackToTop)
│   ├── hooks/          # Core logic (useAuth, useArticles, useTheme, useLanguage)
│   ├── pages/          # View logic (Home, About, Articles, ArticleDetail, Admin)
│   ├── app.jsx         # Routing and layout initialization
│   └── main.jsx        # Entry point
├── server.js           # Express API server
└── tailwind.config.js  # Design system configuration
```

---

## 7. Operational Commands
- `npm run dev`: Starts the frontend (Vite) and backend (Express) concurrently.
- `npm run build`: Generates a production-ready optimized bundle.
- `npm run preview`: Previews the production build locally.

---
*Documented on April 16, 2026, by the Antigravity Assistant.*
