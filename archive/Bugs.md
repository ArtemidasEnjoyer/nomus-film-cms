# Potential Bugs

1. **Race Conditions / Data Corruption (Concurrency):**
   - **File:** `server.js`
   - **Details:** The API endpoints (`POST`, `PUT`, `POST .../delete`) read from and write to `articles.json` using asynchronous `fs.readJson` and `fs.writeJson`. Since node.js is non-blocking, two concurrent requests modifying articles can result in a race condition where one overwrites the other's changes or causes JSON file corruption.

2. **Non-Standard HTTP Methods:**
   - **File:** `server.js`
   - **Details:** The deletion route is defined as `POST /api/articles/delete/:id`. While functional, this violates REST API standards, which could lead to unexpected behavior with proxy caching or middleware. It should use the `DELETE` method.

3. **Loose Token Comparisons:**
   - **File:** `server.js`
   - **Details:** Login compares `inputPass` or base64 token natively without timing-safe string comparison. This could theoretically open up timing attacks to guess the token/password character by character.

4. **State Desync on Frontend Upload Failures:**
   - **File:** `src/pages/Admin.jsx`
   - **Details:** If the image upload fails or throws an exception, the UI may not handle the error gracefully or provide fallback mechanisms to clear the corrupted uploaded state.
