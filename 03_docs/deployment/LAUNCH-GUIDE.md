# GrahAI — Launch Guide

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd grahai
npm install
```

### Step 2: Set Up Environment
Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://jkowflffshkebegtabxa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Launch
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

> First load takes ~60-90s (Turbopack cold compile). Subsequent loads are instant.

---

## Push to GitHub

```bash
cd grahai
git add -A
git commit -m "feat: Release 3 — full astrology engine + UI audit"
git push origin main
```

---

## Deploy to Vercel (Production)

1. Go to [vercel.com](https://vercel.com) → Import Project → Select `singhhydra-prog/grahai`
2. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RAZORPAY_KEY_ID` (optional — mock mode without it)
   - `RAZORPAY_KEY_SECRET` (optional)
   - `NEXT_PUBLIC_RAZORPAY_KEY` (optional)
3. Click Deploy

---

## Project Structure

```
grahai/
├── src/
│   ├── app/                    # 22 pages + 20 API routes
│   │   ├── page.tsx            # Landing page (cosmic theme)
│   │   ├── onboarding/         # Multi-step birth data collection
│   │   ├── kundli/             # Birth chart generator
│   │   ├── chat/               # AI astrology chat (4 verticals)
│   │   ├── dashboard/          # User dashboard
│   │   ├── daily/              # Daily horoscope
│   │   ├── horoscope/          # Monthly horoscope
│   │   ├── compatibility/      # Partner compatibility
│   │   ├── reports/            # PDF report generation
│   │   ├── pricing/            # Plans + Razorpay checkout
│   │   ├── product/            # Product showcase
│   │   ├── blog/               # Blog with [slug] routes
│   │   └── api/                # Backend API routes
│   │       ├── chat/           # AI chat (Anthropic Claude)
│   │       ├── payment/        # Razorpay create/verify
│   │       ├── reports/        # PDF generation
│   │       ├── gamification/   # XP, ratings, stats
│   │       ├── cron/           # Daily/weekly/monthly jobs
│   │       └── push/           # Push notification mgmt
│   ├── components/             # 46 React components
│   │   ├── LocationAutocomplete.tsx  # City search (200+ cities)
│   │   ├── AppHeader.tsx       # Navigation header
│   │   ├── app/BottomNav.tsx   # Mobile bottom navigation
│   │   └── chat/              # Chat UI components
│   └── lib/                    # 49 utility modules
│       ├── ephemeris/          # Vedic astrology engine
│       │   ├── ashtakavarga.ts
│       │   ├── bhava-chalit.ts
│       │   ├── chart-synthesis.ts
│       │   ├── dosha-cancellations.ts
│       │   ├── planet-strength.ts
│       │   ├── shadbala.ts
│       │   └── varga-interpretation.ts
│       ├── data/city-database.ts  # 200+ cities with coordinates
│       ├── supabase.ts         # Client + server helpers
│       └── astrology-tools.ts  # 17 AI tool definitions
├── tests/
│   └── grahai-accuracy.test.ts # 80 accuracy tests (all passing)
├── public/                     # PWA assets, manifest, SW
└── .env.example                # Environment template
```

## Key Features

| Feature | Status |
|---------|--------|
| Birth Chart (Kundli) | ✅ Swiss Ephemeris |
| Varga Charts (D9, D10) | ✅ Navamsa + Dasamsa |
| Dasha Periods | ✅ Vimshottari Dasha |
| Ashtakavarga | ✅ BAV + SAV |
| Yoga Detection | ✅ 20+ classical yogas |
| Dosha Analysis | ✅ With cancellation rules |
| AI Chat (4 verticals) | ✅ Astrology, Numerology, Tarot, Vastu |
| PDF Reports | ✅ PdfKit generation |
| Payments (Razorpay) | ✅ With test mode fallback |
| PWA / Mobile App | ✅ Installable, offline-ready |
| Push Notifications | ✅ Daily/weekly/monthly |
| Gamification | ✅ XP, streaks, achievements |
| Location Autocomplete | ✅ 200+ cities, fuzzy search |

## Tests

```bash
npx vitest run tests/grahai-accuracy.test.ts
```
80/80 tests covering all calculation modules.

## Tech Stack

- **Framework**: Next.js 16.1.6 (Turbopack)
- **UI**: React 19, Framer Motion, Tailwind CSS
- **Backend**: Supabase (Auth + DB), Anthropic Claude API
- **Astrology**: Swiss Ephemeris (sweph native module)
- **Payments**: Razorpay
- **Deployment**: Vercel
