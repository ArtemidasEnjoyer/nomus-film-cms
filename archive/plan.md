# Project Plan - Modern Lightweight Web App

## Tech Stack
- **Framework:** Preact (with Signals for state)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend:** Node.js/Express (for Admin Panel data persistence)
- **Deployment:** Vercel (Frontend) / Railway (Backend)

## Development Timeline

### Week 1: Scaffolding & Asset Processing (CURRENT)
- [ ] Init Git repository and folder structure
- [ ] Scaffold Preact + Vite + Tailwind CSS
- [ ] Asset processing: Extract PDF portfolio to PNGs
- [ ] Documentation: `structure.md` and `theme.md`

### Week 2: Core UI & Theme Engine
- [ ] Sticky Navbar & Mobile Hamburger Menu
- [ ] Light/Dark mode with CSS Variables & `localStorage`
- [ ] Home Page: Hero section with CSS Parallax
- [ ] About Page: Content and creator profiles

### Week 3: Articles & News Section
- [ ] Define `articles.json` schema
- [ ] Articles Grid with slide-in animations
- [ ] Responsive audit and ARIA accessibility updates

### Week 4: Admin Panel & Backend
- [ ] Express API for reading/writing `articles.json`
- [ ] Password-protected `/admin` route
- [ ] Canva-style user-friendly form for non-technical users

### Week 5: QA & Deployment
- [ ] Cross-browser testing and mobile validation
- [ ] Final optimization and asset compression
- [ ] CI/CD setup and live deployment
