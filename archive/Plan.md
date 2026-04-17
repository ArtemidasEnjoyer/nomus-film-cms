# Action Plan: Security, Bugs, and Improvements

This document outlines a phased execution plan to resolve all identified vulnerabilities, bugs, and architectural limitations in the application.

## Phase 1: Critical Security Fixes
*Goal: Secure the application from immediate threats (XSS, arbitrary file execution, and unauthorized access).*

1. **Fix Cross-Site Scripting (XSS) Vulnerabilities**
   - Install `dompurify` (and `jsdom` if doing SSR/backend parsing, but frontend is fine).
   - Create a reusable `MarkdownViewer` component in `src/components/`.
   - Update `Admin.jsx` and `ArticleDetail.jsx` to use this component instead of raw `dangerouslySetInnerHTML`.

2. **Secure File Uploads**
   - Update `multer` configuration in `server.js`.
   - Add a `fileFilter` to strictly allow only image MIME types (e.g., `image/jpeg`, `image/png`, `image/webp`).
   - Limit file upload size (e.g., 5MB limit).

3. **Overhaul Authentication Security**
   - Replace the plaintext `auth.json` system.
   - Implement `bcrypt` to hash the admin password upon setup.
   - Replace the Base64 "token" system with JSON Web Tokens (JWT) using the `jsonwebtoken` package.
   - Use `crypto.timingSafeEqual` or JWT verification for validating tokens to prevent timing attacks.

## Phase 2: Database & Architecture Migration
*Goal: Fix concurrency bugs and improve backend scalability.*

1. **Migrate from JSON to a Database (SQLite)**
   - Install `sqlite3` or an ORM/query builder like `better-sqlite3` or `Prisma`.
   - Create schemas/tables for `articles` and `admin_users`.
   - Migrate existing data from `articles.json` and `auth.json` to the new database.
   - **Solves Bug:** Eliminates race conditions and JSON corruption caused by asynchronous `fs` read/writes.

2. **Implement API Pagination**
   - Update the `GET /api/articles` endpoint to accept `page` and `limit` query parameters.
   - Update the database query to use `LIMIT` and `OFFSET`.
   - Adjust the frontend `useArticles` hook to support infinite scrolling or paginated fetching.

## Phase 3: API Standards & Code Refactoring
*Goal: Ensure code maintainability, standardization, and resilience.*

1. **RESTful API Corrections**
   - Change the deletion route in `server.js` from `POST /api/articles/delete/:id` to `DELETE /api/articles/:id`.
   - Update the corresponding frontend API call in `useArticles.js` to use the `DELETE` method.

2. **Input Validation**
   - Install a validation library like `zod`.
   - Create validation schemas for article creation (`POST /api/articles`) and auth (`POST /api/auth/setup`, `POST /api/auth/login`).
   - Reject invalid payloads with `400 Bad Request`.

3. **Centralized Error Handling**
   - Create an Express error-handling middleware function in `server.js`.
   - Replace repetitive `try...catch` blocks with an async wrapper or pass errors directly to `next()`.
   - Ensure the frontend handles API error responses gracefully, clearing loading states properly on failures.

## Phase 4: Frontend UI/UX Polish
*Goal: Enhance the user experience and address minor frontend bugs.*

1. **Upload Error State Handling**
   - Update `Admin.jsx` to clear the `status` and `image` preview if an upload fails.
   - Show descriptive toast notifications or error messages to the user instead of silent failures.
2. **Component Cleanup**
   - Refactor large files like `Admin.jsx` by splitting forms and lists into smaller, dedicated sub-components.
