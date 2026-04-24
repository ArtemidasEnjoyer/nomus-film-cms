# NomusFilm CMS 🎬

A minimalist, high-performance CMS for filmmakers and creative portfolios. Built with **Preact**, **Node.js**, and **PostgreSQL**.

![Version](https://img.shields.io/badge/version-0.1.6-alpha-pastelGreen)
![Node](https://img.shields.io/badge/node-%3E%3D22.5.0-blue)
![License](https://img.shields.io/badge/license-MIT-brown)

## ✨ Features

- **🚀 Performance:** Blazing fast frontend powered by Preact and Vite.
- **🛠 Enterprise Ready:** Migrated to **PostgreSQL** for robust data management and scalability.
- **📝 Markdown Editor:** Full-featured article editor with live preview and syntax guide.
- **🔐 Secure by Design:** 
  - Automated one-time setup protocol.
  - JWT-based authentication with bcrypt password hashing.
  - Cryptographically secure filename randomization for uploads.
  - Rate limiting and security headers (Helmet).
- **🎨 Modern UI:** 
  - Cinematic loading experience.
  - Dual-theme support (Dark/Light) with high-contrast accessibility.
  - Fully responsive layout for creators on the go.

## 🛠 Tech Stack

- **Frontend:** Preact, Tailwind CSS, @preact/signals
- **Backend:** Node.js, Express 5.x, PostgreSQL
- **Database Logic:** JSONB storage for flexible article schemas
- **Validation:** Zod
- **Security:** Bcryptjs, JSON Web Tokens

## 🚀 Getting Started

### Prerequisites

- **Node.js v22.5.0 or higher**
- **Docker & Docker Compose** (recommended for local database)
- **PostgreSQL Instance** (for production deployment)

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

3. **Set up Local Database:**
   Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/nomusfilm
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=*
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

### 🔐 First-Time Setup

1. On the first run with a fresh database, the server will generate a **Temporary Admin Password**.
2. Look at your terminal output (or cloud logs) to find it.
3. Visit `http://localhost:5173/admin` (local) or your deployment URL.
4. Log in using the temporary password (leave username blank).
5. Follow the prompts to create your permanent admin account.

## 📁 Project Structure

- `src/` - Preact frontend application
- `server.js` - Express API server and PostgreSQL integration
- `public/uploads/` - Media storage for articles
- `docker-compose.yml` - Local database provisioning

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for filmmakers.*
