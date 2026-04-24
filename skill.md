# Antigravity Coding Skill: NomusFilm Project Management

Specialized workflow for managing the NomusFilm CMS codebase and ensuring synchronization with the remote repository.

## Core Directives

### 1. Version Control & Synchronization
- **Repository Address:** `https://github.com/ArtemidasEnjoyer/nomus-film-cms`
- **Mandatory Action:** Every functional change or feature implementation **MUST** be followed by a push to the remote repository.
- **Commit Message Style:** Use conventional commits (e.g., `feat:`, `fix:`, `chore:`, `style:`, `refactor:`).

### 2. Versioning Strategy
- **Mandatory Action:** Before pushing any changes, increment the project version in `package.json`.
- **Naming Convention:** Follow the established `0.x.x-alpha` pattern. 
- **Procedure:**
    1. Read `package.json`.
    2. Increment the version (e.g., `0.0.6-alpha` -> `0.0.7-alpha`).
    3. Apply the edit.

### 3. Build Verification
- **Safety Rule:** Always run `npm run build` before committing to ensure no syntax errors or breaking changes are introduced.

## Typical Workflow Sequence

1.  **Implement** the requested feature or fix.
2.  **Verify** the implementation visually/logically.
3.  **Read** `package.json` to get current version.
4.  **Increment** version in `package.json`.
5.  **Run** `npm run build` to verify the build.
6.  **Stage & Commit** changes: `git add . && git commit -m "..."`.
7.  **Push** to remote: `git push origin master`.

## Project Context
- **Framework:** Preact (Vite)
- **Backend:** Express with SQLite (Node.js)
- **Key Files:** 
    - `server.js` (API & Security)
    - `src/app.jsx` (Routing)
    - `src/hooks/useLanguage.js` (Localization)
    - `src/components/Partners.jsx` (Global component)
