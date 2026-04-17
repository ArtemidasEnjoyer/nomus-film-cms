# NomusFilm CMS 🎬

A minimalist, high-performance CMS for filmmakers and creative portfolios. Built with **Preact**, **Node.js**, and native **SQLite**.

![Version](https://img.shields.io/badge/version-1.0.0-pastelGreen)
![Node](https://img.shields.io/badge/node-%3E%3D22.5.0-blue)
![License](https://img.shields.io/badge/license-MIT-brown)

## ✨ Features

- **🚀 Performance:** Blazing fast frontend powered by Preact and Vite.
- **🛠 Native Stack:** Uses Node.js native `node:sqlite` (no external DB drivers required).
- **📝 Markdown Editor:** Full-featured article editor with live preview and syntax guide.
- **🔐 Secure by Design:** 
  - Automated one-time setup protocol.
  - JWT-based authentication with bcrypt password hashing.
  - Cryptographically secure filename randomization for uploads.
- **🎨 Modern UI:** 
  - Cinematic loading experience.
  - Dual-theme support (Dark/Light) with high-contrast accessibility.
  - Fully responsive layout for creators on the go.
- **📦 Single File Database:** SQLite storage makes backups and migrations as easy as copying a file.

## 🛠 Tech Stack

- **Frontend:** Preact, Tailwind CSS, @preact/signals
- **Backend:** Node.js, Express 5.x, `node:sqlite` (Native)
- **Validation:** Zod
- **Security:** Bcryptjs, JSON Web Tokens

## 🚀 Getting Started

### Prerequisites

- **Node.js v22.5.0 or higher** (required for native `node:sqlite`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArtemidasEnjoyer/nomus-film-cms.git
   cd nomus-film-cms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

### 🔐 First-Time Setup

1. On the first run, the server will generate a **Temporary Admin Password**.
2. Look at your terminal output to find it.
3. Visit `http://localhost:5173/admin`.
4. Log in using the temporary password (leave username blank).
5. Follow the prompts to create your permanent admin account.

## 📁 Project Structure

- `src/` - Preact frontend application
  - `components/` - Reusable UI components
  - `pages/` - Main view components
  - `hooks/` - Custom Preact hooks and state signals
- `server.js` - Express API server and native SQLite logic
- `data/` - SQLite database storage (automatically created)
- `public/uploads/` - Media storage for articles

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for filmmakers.*
