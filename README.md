# NutriTrack — Personal Nutrition Tracker

A Progressive Web App (PWA) for tracking daily nutrition and weight.
Runs in mobile Safari, saveable to iPhone home screen.

## Features
- Daily food log with meal grouping (Breakfast, Lunch, Dinner, Snack)
- USDA FoodData Central API integration for packaged foods
- Pre-loaded fresh foods database (fruits, vegetables, proteins, grains)
- Running macro totals vs. daily goals
- Weight tracking with trend chart
- Works offline after first load (service worker caching)
- All data stored locally on device (IndexedDB)

## Setup & Deployment

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Test locally
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### Step 3 — Build for production
```bash
npm run build
```
This creates a `dist/` folder.

### Step 4 — Deploy to Netlify
1. Go to netlify.com → Add new site → Import from Git → Connect to GitHub
2. Select this repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy

### Step 5 — Add to iPhone home screen
1. Open your Netlify URL in Safari on iPhone
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. Tap Add

## Architecture
- React 18 + Vite
- IndexedDB for local persistence
- USDA FoodData Central API (free key required)
- Workbox service worker for offline support
- Zero backend — runs entirely client-side
