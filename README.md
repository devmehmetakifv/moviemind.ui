# Moviemind UI

Next.js frontend for the Moviemind film recommendation platform.

## Features

- 🎬 Movie catalog with filtering, sorting, and search
- 🎯 Transparent recommendations with explanations
- ❤️ User favorites management
- 🔐 Supabase authentication
- 📱 Responsive design (mobile-first)
- 🎨 Modern dark theme with glassmorphism

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase Auth** - Authentication
- **Jest** - Unit testing
- **Playwright** - E2E testing

## Project Structure

```
moviemind.ui/
├── src/
│   ├── app/                  # Next.js pages
│   │   ├── page.tsx         # Home page
│   │   ├── movies/[id]/     # Movie detail
│   │   ├── favorites/       # Favorites (protected)
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   └── not-found.tsx    # 404 page
│   ├── components/          # React components
│   ├── contexts/            # Auth context
│   └── lib/                 # Utilities (API, types)
├── e2e/                     # Playwright tests
└── package.json
```

## Setup

1. **Create `.env.local`:**
   ```bash
   cp .env.local.example .env.local
   # Edit with your Supabase credentials
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:** http://localhost:3000

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Key Features

### Transparent Recommendations (KOG-05)
Every recommendation shows why it was suggested:
- "Same genres: Comedy, Drama"
- "Same director: Steven Spielberg"
- "Same decade: 1990s"

### 3-Click Rule (KOG-06)
Users can reach any movie in ≤3 clicks from home.

### Error Handling (KOG-07)
- 404 page for invalid routes
- Loading states for all async operations
- Error states with retry buttons

### Responsive Design (KOG-08)
- Mobile-first approach
- Tested at 375px viewport
- Hamburger menu for mobile

## Deployment (Vercel)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically
