# AutoDrive AI — Setup Guide

## 1. Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This installs:
- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- Framer Motion 11
- Lucide React icons
- TypeScript 5

## 2. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 3. Project Structure

```
e-commerce/
├── app/
│   ├── globals.css       ← Design system (glassmorphism, animations)
│   ├── layout.tsx        ← Root layout with Google Fonts + SEO
│   └── page.tsx          ← Homepage (Navbar, Hero, Cards, Footer)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.cjs
└── next.config.mjs
```

## 4. What's in the UI

- **Navbar** — Glassmorphism blur, logo, nav links, mobile responsive hamburger menu
- **Hero** — Fullscreen dark with glowing orbs, "Drive the Future" heading, CTA buttons, stat grid, floating car image
- **Featured Vehicles** — 4 card grid with tab filter (All/Cars/Bikes), hover glow effects
- **Why Us** — 3-column feature highlights
- **Footer** — Clean minimal footer with links
