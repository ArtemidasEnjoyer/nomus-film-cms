# Core Functions & APIs

This document outlines the critical functions driving the backend operations and frontend interactivity.

## Backend (Express API)

### Authentication Middleware
*   **`authenticate(req, res, next)`**
    *   Intercepts requests to protected routes (`/api/upload`, `POST/PUT/DELETE /api/articles`).
    *   Extracts the JWT from the `Authorization` header.
    *   Verifies the token against the `JWT_SECRET`.
    *   Returns `401 Unauthorized` if validation fails.

### Validation Middleware
*   **`validate(schema)`**
    *   A higher-order function that accepts a `Zod` schema.
    *   Parses `req.body` against the schema. If it fails, it throws an error that is caught by the Global Error Handler.

### Global Error Handler
*   Catches synchronous and asynchronous exceptions thrown by route handlers (supported natively by Express 5).
*   Specifically traps `MulterError` (e.g., `LIMIT_FILE_SIZE`) and custom file format errors, returning clean JSON error messages to the client instead of crashing the server.

### Key API Routes
*   `POST /api/auth/setup`: Initializes the admin account, hashes the password with bcrypt, and stores it in SQLite.
*   `POST /api/auth/login`: Compares the incoming password against the bcrypt hash and returns a signed 24h JWT.
*   `POST /api/upload`: Handles multipart form data. Limits uploads to 5MB and whitelists image MIME types (JPEG, PNG, GIF, WEBP).
*   `GET /api/articles`: Fetches articles from SQLite with pagination support (`?page=1&limit=100`).
*   `POST / PUT / DELETE /api/articles/:id`: Authenticated CRUD operations for articles.

---

## Frontend (Hooks & Utilities)

### `useArticles.js`
Manages the application's core content.
*   **`fetchArticles()`**: Pings `/api/articles`, populates the `articles` signal, and handles the `loading` state used by the `InitialLoader`.
*   **`saveArticle(articleData, id?)`**: Determines whether to `POST` (create) or `PUT` (update) based on the presence of an `id`. Refetches the list upon success.
*   **`deleteArticle(id)`**: Sends a `DELETE` request and optimistically updates the local `articles` signal to remove the item instantly from the UI.

### `useLanguage.js`
Handles multi-language support (i18n).
*   **`lang`**: A signal holding the current locale (`EN` or `IT`).
*   **`toggleLang()`**: Flips the current language and writes the preference to `localStorage`.
*   **`t`**: A computed translation object mapping keys (e.g., `t.contactTitle`) to their translated strings.

### `MarkdownViewer.jsx`
*   Takes raw Markdown strings from the API.
*   Passes the string through `marked.parse()`.
*   Passes the resulting HTML through `DOMPurify.sanitize()` to strip malicious `<script>` tags or inline event handlers.
*   Renders safely via `dangerouslySetInnerHTML`.
