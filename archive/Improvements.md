# Performance & Design Improvements

1. **Migrate to a Real Database:**
   - **Details:** Storing state in `articles.json` and `auth.json` is slow and lacks scalability. Reading and writing the entire array to the disk on every request is inefficient. 
   - **Recommendation:** Integrate a real database like SQLite (for simple setups) or PostgreSQL/MongoDB. This also eliminates the JSON file corruption bugs.

2. **API Pagination:**
   - **Details:** `GET /api/articles` currently returns the entire database array in memory and sends it to the client. This will cause severe performance degradation and memory bloat as the number of articles grows.
   - **Recommendation:** Implement offset or cursor-based pagination (e.g., `?page=1&limit=10`).

3. **Centralized Error Handling:**
   - **Details:** `server.js` repeats `try...catch` blocks for nearly every route and sends manual `res.status(500)` responses.
   - **Recommendation:** Implement an Express error-handling middleware to DRY up the code and improve debugging context.

4. **Input Validation Middleware:**
   - **Details:** The API currently assumes all payload structures sent to `/api/articles` and auth endpoints are correct.
   - **Recommendation:** Use an input validation library like `Zod` or `Joi` to sanitize and validate request payloads before processing.

5. **Reusable UI Components for Sanitized Markdown:**
   - **Details:** The `dangerouslySetInnerHTML` setup is repeated across multiple files (`Admin.jsx`, `ArticleDetail.jsx`).
   - **Recommendation:** Extract this into a reusable `<MarkdownViewer content={text} />` component that encapsulates both the `marked` parser and a sanitizer (`DOMPurify`), improving maintainability.
