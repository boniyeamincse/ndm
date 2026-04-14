# Student Movement - NDM Frontend

A multilingual React web application for Student Movement - NDM Bangladesh.
The site presents organizational information, leadership, activities, news, publications, and membership/contact flows.

## Project Overview

This project is built as a responsive single-page application (SPA) using React and Vite.
It supports English and Bangla content with client-side routing and animated section reveals.

## Key Features

- Bilingual UI (English/Bangla) using a centralized translation context
- Multi-page experience with React Router
- Responsive layout for mobile, tablet, and desktop
- Scroll reveal effects for content sections
- Membership and contact forms with client-side submission flow
- Social links and embedded office map
- SPA rewrite setup for Vercel deployment

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Framer Motion
- Lucide React
- ESLint 9

## Project Structure

```text
.
├── public/
│   └── images/
├── src/
│   ├── components/          # Shared UI (Navbar, Footer, FloatingJoin)
│   ├── context/             # Language context and translations
│   ├── hooks/               # Reusable hooks (scroll reveal)
│   ├── pages/               # Route-level page components and styles
│   ├── App.jsx              # Route definitions and global layout
│   ├── index.css            # Global styles
│   └── main.jsx             # App bootstrap
├── vercel.json              # SPA rewrite config for Vercel
├── vite.config.js
└── package.json
```

## Routes

- `/` - Home
- `/about` - About Us
- `/leadership` - Leadership
- `/activities` - Activities
- `/news` - News
- `/publications` - Publications
- `/join` - Join Us
- `/contact` - Contact

## Getting Started

### 1. Prerequisites

- Node.js 18+ (recommended latest LTS)
- npm 9+

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build in `dist/`
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint checks

## Build and Deploy

### Build Locally

```bash
npm run build
```

### Deploy to Vercel

This project includes `vercel.json` with a rewrite rule so deep links (for example `/about` or `/news`) correctly resolve to `index.html` in production.

Typical Vercel settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

## Notes

- Current membership and contact forms simulate successful submission on the client side.
- If you want real form handling, connect them to a backend API or service and add validation, rate limiting, and spam protection.

## License

This repository currently has no explicit license file. Add a `LICENSE` file if public distribution is intended.
