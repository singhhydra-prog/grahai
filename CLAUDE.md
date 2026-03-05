# GrahAI — Project Intelligence File

## Identity
GrahAI is an AI-powered Vedic astrology platform covering Astrology, Numerology, Tarot, and Vastu Shastra. The design language is cosmic luxury — deep space backgrounds, saffron-gold accents, glass-morphic surfaces, and subtle 3D elements. Think Apple's design precision meets ancient Indian mysticism.

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS v4 (CSS-based config with `@theme inline`)
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, pgvector)
- **Animations:** Framer Motion (page transitions, micro-interactions)
- **3D:** Spline (@splinetool/react-spline, always lazy-loaded)
- **Fonts:** Inter (body/UI), Noto Sans Devanagari (Hindi text)
- **Deployment:** Vercel (auto-deploy, preview branches)
- **AI Models:** All Claude Opus 4.6 via Supabase Edge Functions

## Design System — The Cosmic Language

### Colors (use Tailwind classes, never raw hex)
- `deep-space` #0A0E1A — primary background, never use white/light
- `navy` #121833 / `navy-light` #1A2342 — cards, elevated surfaces
- `saffron` #D4A843 — primary accent, CTAs, active states
- `gold-light` #E8C668 — hover states, highlights
- `indigo` #3B4C9B — borders, secondary elements
- `cosmic-white` #E8E6F0 — text (never pure white #FFFFFF)

### Surface Treatment
- Cards: `rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm`
- Inputs: `rounded-xl border border-indigo/30 bg-deep-space/50`
- Buttons primary: `rounded-xl bg-saffron text-deep-space font-semibold`
- Buttons ghost: `rounded-xl border border-indigo/30 text-cosmic-white/60`
- Glass effect: `bg-navy-light/30 backdrop-blur-xl border border-cosmic-white/10`

### Typography Scale
- Hero heading: `text-5xl md:text-7xl font-bold` + gradient-text class
- Section heading: `text-3xl md:text-4xl font-bold text-cosmic-white`
- Card title: `text-lg font-semibold text-cosmic-white`
- Body: `text-sm text-cosmic-white/60`
- Hindi subtitle: `font-[family-name:var(--font-devanagari)] text-cosmic-white/40`
- Minimum touch target: 44px (h-11)

### Animation Standards
- Page entrance: `fadeInUp` (opacity 0→1, y 20→0, 0.6s ease-out)
- Stagger children: 0.1s delay between items
- Hover states: `transition-all duration-300`
- 3D elements: lazy load with Suspense + branded skeleton loader
- Never use animation on elements below the fold on mobile (performance)

## Code Standards

### Component Architecture
- Server Components by default, `"use client"` only when needed
- All components strictly typed with TypeScript
- Named exports for components, default export for pages
- Co-locate component-specific types in the same file
- Always wrap `useSearchParams()` in `<Suspense>`

### Supabase Rules
- **Table is `profiles`** with primary key `id` (= auth.uid())
- NEVER reference `user_profiles` or `user_id` — those don't exist
- Server-side: use `@supabase/ssr` createServerClient from `supabase-server.ts`
- Middleware: use `supabase-middleware.ts` for session refresh
- Client-side: use browser client from `supabase.ts`
- Always check `onboarding_completed` boolean after auth callback

### File Organization
```
src/
  app/              # Next.js App Router pages
    (marketing)/    # Public pages (landing, pricing, blog)
    (app)/          # Authenticated app pages
    auth/           # Auth pages (login, callback)
  components/
    ui/             # Reusable UI primitives (Button, Card, Input)
    3d/             # Spline 3D components (always lazy-loaded)
    sections/       # Page sections (Hero, Features, CTA)
  lib/              # Utilities, Supabase clients, brand config
```

### Performance Rules
- Images: always use `next/image` with explicit width/height
- Spline: ALWAYS lazy load with `React.lazy()` + Suspense
- Fonts: only Inter + Noto Sans Devanagari (loaded via next/font)
- Bundle: no lodash, no moment.js, prefer native APIs
- CSS: prefer Tailwind utilities, never inline styles

## What NOT To Do
- ❌ White or light backgrounds anywhere — we live in deep space
- ❌ Pure white text (#FFFFFF) — use cosmic-white (#E8E6F0)
- ❌ Default Next.js blue/black theme colors
- ❌ Generic sans-serif — always specify Inter
- ❌ Unstyled HTML elements (raw buttons, inputs, selects)
- ❌ `user_profiles` table or `user_id` column (use `profiles` / `id`)
- ❌ Spline components without lazy loading
- ❌ useSearchParams without Suspense boundary
- ❌ Inline styles or CSS modules (Tailwind only)
- ❌ Importing full icon libraries (tree-shake from lucide-react)
- ❌ Any external cost — all services must be free tier
- ❌ localStorage/sessionStorage in components (use React state)
- ❌ Emojis in production UI (use custom icons or Lucide)

## The Four Verticals
1. **Vedic Astrology** (ज्योतिष) — Kundli, Dasha, Transit, Compatibility
2. **Numerology** (अंकशास्त्र) — Life Path, Name Number, Predictions
3. **Tarot** (टैरो) — Card readings, Spreads, Interpretations
4. **Vastu Shastra** (वास्तु) — Space analysis, Remedies, Compass

## Brand Voice
- Authoritative but accessible
- Blend English + Hindi naturally
- Never dismissive of traditional knowledge
- Scientific framing of ancient wisdom
- Premium but not exclusive
