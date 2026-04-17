# Security Vulnerabilities

1. **Insecure Authentication Protocol & Plaintext Storage:**
   - **File:** `server.js`
   - **Details:** Passwords are saved as plaintext in `auth.json`. The "token" is generated as a simple Base64 encoded string of `username:password` rather than a cryptographically secure, signed token like a JWT. This exposes credentials and makes it vulnerable to replay attacks. 
   - **Recommendation:** Use standard authentication mechanisms such as JWTs and hash passwords using bcrypt or argon2.

2. **Hardcoded Default Credentials:**
   - **File:** `server.js`
   - **Details:** `DEFAULT_PASSWORD` is hardcoded as `'admin123'`. Default credentials are a common entry point for attackers if the setup process is skipped or exposed.

3. **Unrestricted File Upload:**
   - **File:** `server.js`
   - **Details:** The `/api/upload` endpoint uses `multer` without checking the file's MIME type or extension. Authenticated users (or an attacker who bypasses auth) could upload malicious files (e.g., HTML with XSS payloads, `.php` shells if hosted improperly, or large files leading to DoS).
   - **Recommendation:** Implement file type validation (whitelist only `image/png`, `image/jpeg`, etc.) and limit file size.

4. **Cross-Site Scripting (XSS) via Markdown:**
   - **Files:** `src/pages/Admin.jsx`, `src/pages/ArticleDetail.jsx`
   - **Details:** The application renders article content using `dangerouslySetInnerHTML={{ __html: marked.parse(content) }}` without any sanitization. If an attacker injects malicious `<script>` tags or `javascript:` links in the markdown content, it will execute in the browser of any user viewing the article.
   - **Recommendation:** Use a sanitizer like `DOMPurify` on the parsed HTML before injecting it into the DOM.
