# LibreTune 🎵

A free music discovery app built with React, Vite, Tailwind CSS, TanStack Query, and Zustand, powered by the Deezer public API. Tracks play Deezer's 30-second previews.

---

## 🚀 Features

- **100% Free & Open**: No accounts, no subscriptions, no paywalls, and no upsell prompts anywhere.
- **Accurate Figma Implementation**: Strictly follows the LibreTune design system, tokens, typography (Inter), and layout rhythm.
- **Deezer previews**: Discover tracks and listen to available 30-second previews, with a direct link to Deezer.
- **Persistent Player Bar**: Playback state, track controls, seeker, volume, and queue continue smoothly across page navigation.
- **Expanded Now Playing View**: Full overlay with artwork, preview status, Deezer link, playback controls, and upcoming queue list.
- **Local Storage Persistence**: Favorites, custom playlists, and recently played metadata are stored locally. Expiring preview URLs are fetched again when a saved track is played.
- **Responsive Layout**: Dedicated desktop sidebar and sleek mobile bottom navigation bar with WCAG AA compliance (44px min touch targets, visible focus rings).
- **Theme Support**: Seamless Dark mode (`#101014`) and Light mode (`#F7F6FA`) with instant toggle.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6 (lazy-loaded routes)
- **Data Fetching & Cache**: TanStack Query (React Query v5)
- **State Management**: Zustand (with localStorage persistence)
- **Audio Playback**: Custom `useAudio` hook wrapping HTML5 Audio API & OS MediaSession API
- **Styling**: Tailwind CSS configured with exact Figma style guide design tokens
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 📦 Project Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Clone / Open the Project
```bash
cd LibreTune
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.
Vite proxies `/api/deezer/*` to `https://api.deezer.com` to avoid browser CORS restrictions.

---

## 🧪 Completed Stages

- [x] **Stage 1**: Project setup, Tailwind config with design tokens, routing, layout shell, Deezer service, and track normalization.
- [x] **Stage 2**: Home page with Deezer chart and genre data, Trending Now, track discovery, and Recently Played.
- [x] **Stage 3**: Audio player for Deezer previews, autoplay next track, queue, volume, seek, and expired-preview refresh.
- [x] **Stage 4**: Search page with debounced input (400ms), live typeahead suggestions, and grouped results (Tracks, Artists, Albums).
- [x] **Stage 5**: Favorites and Playlists with full local storage CRUD, reorder drag handles, rename/delete modals, and Play All.
- [x] **Stage 6**: Expanded Now Playing view with preview status, Deezer link, and queue list; responsive mobile polish, accessibility pass, and offline banner.

---

## 🚢 Deployment to Vercel

### Option 1: Deploy with Vercel CLI
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Run deployment:
   ```bash
   vercel
   ```
3. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Git Integration
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Vite**.
4. Root Directory: `./` (or project root).
5. The `/api/deezer/[...path].js` serverless function proxies Deezer requests in production. No API key or environment variable is needed.
6. The included `vercel.json` automatically handles single-page app (SPA) routing rewrites.
7. Click **Deploy**.

The application footer displays: “Music data and previews provided by Deezer,”
