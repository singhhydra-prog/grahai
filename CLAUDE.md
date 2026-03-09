# GrahAI — Project Intelligence File

> The single source of truth for any AI agent or developer working on GrahAI.
> Read this BEFORE touching any code. Every architectural decision is documented here.

## Identity

GrahAI is an AI-powered Vedic astrology platform covering four verticals: Astrology, Numerology, Tarot, and Vastu Shastra. The design language is **cosmic luxury** — deep space backgrounds, saffron-gold accents, glass-morphic surfaces, and subtle 3D orbital animations. Think Apple's design precision meets ancient Indian mysticism.

**Production URL:** https://grahai.vercel.app
**Repository:** https://github.com/singhhydra-prog/grahai.git
**Supabase Project:** `jkowflffshkebegtabxa` (ap-south-1 Mumbai)

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 | App Router, TypeScript strict, Turbopack dev |
| Styling | Tailwind CSS v4 | CSS-based config with `@theme inline` |
| Backend | Supabase | Auth, PostgreSQL, Edge Functions, pgvector |
| AI | Anthropic Claude | Claude Opus 4.6 via API, streamed SSE |
| Ephemeris | Swiss Ephemeris (sweph) | Moshier mode, optional native C++ binding |
| Animations | Framer Motion | Page transitions, micro-interactions |
| 3D | Spline | @splinetool/react-spline, always lazy-loaded |
| Fonts | Inter + Noto Sans Devanagari | Loaded via next/font |
| Payments | Razorpay | INR payments, geo-pricing |
| Email | Resend | Transactional emails, daily insights |
| PDF | PDFKit | Kundli report generation |
| Deployment | Vercel | Manual deploy via `npx vercel --prod` |

---

## Design System — The Cosmic Language

### Color Palette (Tailwind classes only, never raw hex)

| Token | Hex | Usage |
|-------|-----|-------|
| `deep-space` | #0A0E1A | Primary background — never use white/light |
| `navy` | #121833 | Card backgrounds, elevated surfaces |
| `navy-light` | #1A2342 | Hover states on cards |
| `saffron` | #D4A843 | Primary accent, CTAs, active states |
| `gold-light` | #E8C668 | Hover states, highlights |
| `gold` | #C5973E | Secondary accent |
| `indigo` | #3B4C9B | Borders, secondary elements |
| `cosmic-white` | #E8E6F0 | Body text (never pure #FFFFFF) |

### Surface Treatment

```
Cards:         rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm
Inputs:        rounded-xl border border-indigo/30 bg-deep-space/50
Button (CTA):  rounded-xl bg-saffron text-deep-space font-semibold
Button (ghost): rounded-xl border border-indigo/30 text-cosmic-white/60
Glass:         bg-navy-light/30 backdrop-blur-xl border border-cosmic-white/10
```

### Typography

| Context | Classes |
|---------|---------|
| Hero heading | `text-5xl md:text-7xl font-bold` + gradient-text |
| Section heading | `text-3xl md:text-4xl font-bold text-cosmic-white` |
| Card title | `text-lg font-semibold text-cosmic-white` |
| Body | `text-sm text-cosmic-white/60` |
| Hindi subtitle | `font-[family-name:var(--font-devanagari)] text-cosmic-white/40` |
| Min touch target | 44px (h-11) |

### Animation Standards

- Page entrance: `fadeInUp` (opacity 0→1, y 20→0, 0.6s ease-out)
- Stagger children: 0.1s delay between items
- Hover states: `transition-all duration-300`
- Orbital animations: CSS `@keyframes spin-slow` (90s–120s linear infinite)
- 3D elements: lazy load with Suspense + branded skeleton
- Never animate below-the-fold on mobile

---

## Architecture Overview

### File Organization

```
grahai/
├── CLAUDE.md                  # THIS FILE — project intelligence
├── MEMORY.md                  # Project state, decisions, known issues
├── TOOLS.md                   # Complete tool & API reference
├── .npmrc                     # optional=true (for sweph native module)
├── next.config.ts             # serverExternalPackages: [sweph, pdfkit]
├── vercel.json                # Framework config, cron jobs
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing (hero + OrbitalRing + PlanetaryOrbits)
│   │   ├── error.tsx          # Global error boundary ("Cosmic Disturbance")
│   │   ├── not-found.tsx      # 404 page ("Lost in the Cosmos")
│   │   ├── layout.tsx         # Root layout (fonts, providers, navbar)
│   │   ├── middleware.ts      # Supabase session refresh
│   │   ├── kundli/            # Birth chart generator (Swiss Ephemeris)
│   │   ├── horoscope/         # Daily/weekly/monthly horoscope
│   │   ├── compatibility/     # Partner matching (Ashtakoot)
│   │   ├── astrologer/        # AI chat with vertical agents
│   │   ├── chat/              # Streaming chat interface
│   │   ├── dashboard/         # User dashboard + gamification
│   │   ├── daily/             # Daily cosmic snapshot
│   │   ├── reports/           # PDF kundli report generation
│   │   ├── onboarding/        # New user onboarding flow
│   │   ├── pricing/           # Plans + Razorpay checkout
│   │   ├── blog/              # Content CMS
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact form
│   │   ├── auth/              # Login + OAuth callback
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── api/
│   │       ├── chat/          # SSE streaming chat with tool-use loop
│   │       ├── ask-one-question/ # Single-question free reading
│   │       ├── cosmic-snapshot/  # Daily cosmic snapshot API
│   │       ├── contact/       # Contact form handler
│   │       ├── reports/generate/ # PDF report generation
│   │       ├── payment/       # Razorpay create-order + verify
│   │       ├── gamification/  # XP, ratings, stats, reading completion
│   │       └── cron/daily-insights/ # Scheduled email insights
│   ├── components/
│   │   ├── Navbar.tsx         # Main navigation
│   │   ├── Footer.tsx         # Site footer
│   │   ├── CosmicBackground.tsx # Animated star field background
│   │   ├── PageTransition.tsx # Framer Motion page wrappers
│   │   ├── AskOneQuestion.tsx # Free question widget
│   │   ├── CosmicSnapshot.tsx # Daily snapshot widget
│   │   ├── DecodeYourName.tsx # Numerology name decoder
│   │   ├── WeeklyTransitBrief.tsx # Transit summary
│   │   ├── VerseOfTheDay.tsx  # Sanskrit verse widget
│   │   ├── ExitIntentPopup.tsx # Exit-intent conversion popup
│   │   ├── WhatsAppCTA.tsx    # WhatsApp engagement
│   │   ├── PricingSection.tsx # Pricing cards
│   │   ├── astrology/        # RashiChart, DashaTimeline, PanchangWidget, RemedyCard
│   │   ├── chat/             # ToolIndicator, MarkdownRenderer
│   │   └── gamification/     # XP indicators, streaks, achievements, levels
│   ├── contexts/
│   │   └── GamificationContext.tsx # Global gamification state
│   └── lib/
│       ├── brand.ts           # Zodiac signs, brand constants
│       ├── geo-pricing.ts     # Regional price adaptation
│       ├── ethics-guardrails.ts # Content safety middleware
│       ├── supabase.ts        # Browser client
│       ├── supabase-server.ts # SSR client (@supabase/ssr)
│       ├── supabase-middleware.ts # Session refresh middleware
│       ├── ephemeris/         # 3,324 lines — astronomical engine
│       │   ├── types.ts       # 348 lines — all shared interfaces
│       │   ├── constants.ts   # 403 lines — zodiac data, nakshatras, dignities
│       │   ├── sweph-wrapper.ts # 365 lines — Swiss Ephemeris integration
│       │   ├── dasha-engine.ts  # 378 lines — Vimshottari Dasha (BPHS Ch.46)
│       │   ├── yogas.ts      # 478 lines — 50+ yoga detection
│       │   ├── doshas.ts     # 374 lines — Mangal/Kaal Sarp/Pitra/Grahan doshas
│       │   ├── panchang.ts   # 398 lines — 5-limb Vedic calendar
│       │   ├── transit-engine.ts # 365 lines — transit analysis
│       │   └── divisional-charts.ts # 215 lines — D9 Navamsa, D10 Dasamsa
│       ├── agents/            # AI agent system
│       │   ├── prompt-loader.ts # Dynamic DB prompts (5-min cache)
│       │   ├── memory.ts      # User memory + birth data extraction
│       │   ├── metrics.ts     # Agent performance tracking
│       │   └── tools/         # Vertical tool definitions + executors
│       │       ├── index.ts   # Central registry + dispatcher
│       │       ├── astrology-tools.ts # 7 tools (calculate_kundli, etc.)
│       │       ├── numerology-tools.ts # 4 tools
│       │       ├── tarot-tools.ts     # 3 tools (78-card RWS deck)
│       │       └── vastu-tools.ts     # 3 tools
│       ├── astrology-data/    # 1,958 lines — reference databases
│       │   ├── bphs-references.ts  # Classical text references
│       │   ├── remedy-database.ts  # 1,205 lines — remedies per planet/dosha
│       │   └── vedic-stories.ts    # 548 lines — mythological narratives
│       ├── gamification/      # 500 lines — engagement system
│       │   ├── engine.ts      # XP calculation, level progression
│       │   ├── achievements.ts # Achievement definitions + unlock logic
│       │   └── streaks.ts     # Daily streak tracking
│       ├── reports/           # PDF generation
│       │   ├── kundli-report-generator.ts # Data assembly
│       │   └── pdf-renderer.ts # PDFKit rendering
│       └── daily-insights/    # Scheduled email system
│           ├── insight-generator.ts # Content generation
│           └── email-template.ts    # HTML email template
└── .claude/
    └── skills/                # Development skills for AI assistants
        ├── grahai-agents/     # Agent development guide
        ├── grahai-deploy/     # Build + deploy procedures
        └── grahai-supabase/   # Database operations
```

---

## Ephemeris Engine (Swiss Ephemeris)

### The sweph Problem + Solution

The `sweph` npm package wraps the Swiss Ephemeris C library via a native Node.js addon (.node binary). This creates a deployment challenge:

**Problem:** Vercel's serverless environment cannot compile native C++ modules. If `sweph` is a production dependency, `npm install` fails → build aborts → no pages deploy.

**Solution (implemented):**

1. `package.json`: sweph in `optionalDependencies` (not `dependencies`)
2. `.npmrc`: `optional=true` — install continues if sweph fails
3. `sweph-wrapper.ts`: Indirect `require()` prevents Webpack static analysis
4. `next.config.ts`: `serverExternalPackages: ["sweph"]` — excludes from bundle

```typescript
// CORRECT — indirect require prevents Webpack resolution
const moduleName = "sweph"
sweph = require(moduleName)

// WRONG — Webpack resolves at build time, fails on Vercel
import sweph from "sweph"
```

### Calculation Pipeline

```
Birth Details → Julian Day (UT) → Swiss Ephemeris calc_ut()
  → Tropical Longitude → subtract Lahiri Ayanamsa → Sidereal Longitude
  → Sign (0–11) → Nakshatra (0–26) → Degree in Sign → Dignity
  → House placement (Whole Sign from Ascendant)
```

### Engine Modules

| Module | Lines | Purpose | Key Functions |
|--------|-------|---------|---------------|
| `types.ts` | 348 | All TypeScript interfaces | PlanetData, NatalChart, DashaPeriod, YogaResult |
| `constants.ts` | 403 | Static Vedic data | Signs, Nakshatras, Dignities, House lords, Aspects |
| `sweph-wrapper.ts` | 365 | Swiss Ephemeris bridge | generateNatalChart, getAllPlanetPositions, getAyanamsa |
| `dasha-engine.ts` | 378 | Vimshottari Dasha | calculateFullDasha, getDashaTimeline (BPHS Ch.46) |
| `yogas.ts` | 478 | 50+ yoga detection | analyzeAllYogas, getActiveYogas (BPHS/Saravali/Phaladeepika) |
| `doshas.ts` | 374 | Dosha analysis | Mangal, Kaal Sarp, Pitra, Grahan doshas |
| `panchang.ts` | 398 | Vedic calendar | Tithi, Vara, Nakshatra, Yoga, Karana (Surya Siddhanta) |
| `transit-engine.ts` | 365 | Transit effects | Saturn, Jupiter, Rahu/Ketu transits over natal positions |
| `divisional-charts.ts` | 215 | Varga charts | D9 Navamsa, D10 Dasamsa, Vargottama detection |

### Accuracy

- Swiss Ephemeris Moshier mode: ~0.1 arcsecond (far exceeds Jyotish requirements)
- Ayanamsa: Lahiri (Chitrapaksha) — the Indian government standard
- House system: Whole Sign (traditional Vedic, not Placidus)
- Node: True Node (not Mean Node) for Rahu/Ketu

---

## Agent System Architecture

### 28-Agent Hierarchy

GrahAI operates a **CEO Orchestrator** pattern with 5 departments and 28 total agents, all registered in `agent_hierarchy` and `agent_prompt_versions` Supabase tables.

### Routing Flow

```
User Message → CEO Orchestrator (detectVertical() regex routing)
  → Vertical: astrology | numerology | tarot | vastu | general
  → Load System Prompt (from agent_prompt_versions, 5-min cache)
  → Inject Memory Context (from memories table, importance DESC)
  → Anthropic API (claude-sonnet-4, streaming, with vertical tools)
  → Tool Execution Loop (tool_use → execute → return → continue)
  → Stream Response (SSE: meta, text_delta, tool_start, tool_result, message_stop, error)
  → Save to DB + Track Metrics (fire-and-forget)
```

### Tool Registry (17 total)

**Astrology (7):** `calculate_kundli`, `get_dasha_periods`, `analyze_yogas`, `get_divisional_chart`, `get_transit_effects`, `get_remedies`, `generate_report`

**Numerology (4):** `calculate_life_path`, `calculate_name_numbers`, `calculate_personal_year`, `save_numerology_profile`

**Tarot (3):** `draw_tarot_cards`, `get_card_meaning`, `save_tarot_reading`

**Vastu (3):** `analyze_vastu`, `get_vastu_remedies`, `save_vastu_assessment`

### Adding a New Tool

1. Define schema in `src/lib/agents/tools/{vertical}-tools.ts`
2. Implement executor function in same file
3. Register in `src/lib/agents/tools/index.ts` (VERTICAL_TOOLS + switch case)
4. Tool names: `snake_case`, globally unique across all verticals
5. Always return structured JSON (never plain strings)

### System Prompts

NEVER hardcode prompts. Update via `agent_prompt_versions` table with `is_active = true`. Prompts are cached 5 minutes in `prompt-loader.ts`. Fallback prompts exist for DB outages.

### Memory System

- Auto birth data extraction on every message (fire-and-forget)
- Types: `birth_data`, `preference`, `reading_history`, vertical-specific
- Retrieved by `importance DESC`, injected into system prompt context
- Stored in `memories` table with optional pgvector embeddings

### Ethics Guardrails

`src/lib/ethics-guardrails.ts` filters every AI response before delivery:

- **Hard blocks:** Fatalistic doom predictions, medical misinformation, financial manipulation, relationship coercion, caste discrimination
- **Soft transforms:** "you will never" → "current patterns suggest challenges in"
- **Severity levels:** none, low, medium, high

---

## Gamification System

### XP Engine (`src/lib/gamification/engine.ts`)

- Base XP: 40 per interaction
- Vertical multipliers: Astrology 1.25x, Vastu 1.15x, Numerology 1.1x, Tarot 1.0x, General 0.8x
- Streak bonuses: 3-day 1.15x → 7-day 1.25x → 14-day 1.35x → 30-day 1.5x
- First daily interaction: +20 bonus XP

### Components

- `CosmicScoreWidget` — XP display + level indicator
- `StreakCalendar` — Visual streak tracking
- `AchievementShowcase` — Unlocked achievement grid
- `LevelUpCelebration` — Animated level-up overlay
- `ChatXPIndicator` — Real-time XP gain in chat
- `SatisfactionRating` — Post-reading feedback

---

## Supabase Database

### Critical Rules

- Table is `profiles` with PK `id` = `auth.uid()`
- NEVER reference `user_profiles` or `user_id` — those don't exist
- All tables have RLS enabled
- Service role key bypasses RLS (server-side API routes only)
- Project ID: `jkowflffshkebegtabxa`

### Client Patterns

```typescript
// API Routes (bypasses RLS)
import { createClient } from "@supabase/supabase-js"
const sb = createClient(url, SUPABASE_SERVICE_ROLE_KEY)

// Server Components (respects RLS, uses cookies)
import { createServerClient } from "@/lib/supabase-server"
const sb = await createServerClient()

// Client Components (browser, respects RLS)
import { createClient } from "@/lib/supabase"
const sb = createClient()
```

### Key Tables (22+)

Core: `profiles`, `conversations`, `messages`, `memories`
Astrology: `kundlis`, `daily_horoscopes`, `compatibility_reports`
Numerology: `numerology_profiles`, `numerology_readings`
Tarot: `tarot_cards` (78-card RWS deck), `tarot_readings`
Vastu: `vastu_assessments`
Agents: `agent_hierarchy`, `agent_prompt_versions`, `agent_metrics`, `agent_learnings`, `agent_tasks`
Business: `pricing_plans`, `subscriptions`, `puja_bookings`, `blog_posts`, `testimonials`, `contact_submissions`

---

## Deployment

### Build Command

```bash
npm run build  # Next.js production build (35 pages)
```

### Deploy to Vercel

```bash
# From local project directory (C:\Users\vijas\OneDrive\Desktop\AstraAI\grahai)
npx vercel --prod
```

**Note:** GitHub auto-deploy may be disconnected. Always verify via manual deploy. Check Vercel dashboard: https://vercel.com/singhhydra-3616s-projects/grahai

### Required Environment Variables (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
RESEND_API_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

### Known Deployment Pitfalls

1. **sweph native module**: Must be in `optionalDependencies`, not `dependencies`. Vercel cannot compile C++ addons.
2. **`.npmrc`**: Must contain `optional=true` so npm doesn't abort on optional dep failure.
3. **`next.config.ts`**: Must include `serverExternalPackages: ["sweph", "pdfkit"]` to prevent bundling native modules.
4. **Stale deploys**: If auto-deploy stops working, use `npx vercel --prod` from local machine.

---

## Code Standards

### Component Architecture

- Server Components by default, `"use client"` only when needed
- All components strictly typed with TypeScript
- Named exports for components, default export for pages
- Co-locate component-specific types in the same file
- Always wrap `useSearchParams()` in `<Suspense>`

### Performance Rules

- Images: always use `next/image` with explicit width/height
- Spline: ALWAYS lazy load with `React.lazy()` + Suspense
- Fonts: only Inter + Noto Sans Devanagari (loaded via next/font)
- Bundle: no lodash, no moment.js, prefer native APIs
- CSS: prefer Tailwind utilities, never inline styles

---

## What NOT To Do

- White or light backgrounds anywhere — we live in deep space
- Pure white text (#FFFFFF) — use cosmic-white (#E8E6F0)
- Default Next.js blue/black theme colors
- Generic sans-serif — always specify Inter
- Unstyled HTML elements (raw buttons, inputs, selects)
- `user_profiles` table or `user_id` column (use `profiles` / `id`)
- Spline without lazy loading
- useSearchParams without Suspense boundary
- Inline styles or CSS modules (Tailwind only)
- Import full icon libraries (tree-shake from lucide-react)
- Any external cost — all services must be free tier
- localStorage/sessionStorage in components (use React state)
- Emojis in production UI (use custom icons or Lucide)
- Direct `import sweph from "sweph"` — use indirect require via sweph-wrapper.ts
- Hardcoded system prompts — always use agent_prompt_versions table

---

## The Four Verticals

1. **Vedic Astrology** (ज्योतिष) — Kundli, Dasha, Transit, Compatibility, Yogas, Doshas, Panchang
2. **Numerology** (अंकशास्त्र) — Life Path, Destiny, Soul Urge, Personality, Personal Year
3. **Tarot** (टैरो) — 78-card RWS deck, Celtic Cross, Past-Present-Future spreads
4. **Vastu Shastra** (वास्तु) — Space analysis, Direction scoring, Remedies

## Brand Voice

- Authoritative but accessible
- Blend English + Hindi naturally (bilingual UI)
- Never dismissive of traditional knowledge
- Scientific framing of ancient wisdom ("astronomical calculations" not "magic")
- Premium but not exclusive

---

## Testing Checklist

- [ ] `npm run build` passes with zero errors (35 pages)
- [ ] Each vertical detects correctly from user messages
- [ ] System prompts load from `agent_prompt_versions` (not hardcoded)
- [ ] All 17 tools execute correctly and return structured data
- [ ] Streaming renders token-by-token (no flash of complete text)
- [ ] Tool indicators show/hide correctly during execution
- [ ] Conversation history persists across messages
- [ ] Memories save and retrieve for returning users
- [ ] Metrics tracked in `agent_metrics` table
- [ ] Ethics guardrails block fatalistic predictions
- [ ] Gamification XP awards correctly per vertical
- [ ] Kundli PDF report generates without sweph (graceful fallback)
- [ ] All 4 product pages return HTTP 200 on Vercel
- [ ] Hero orbital animations render on desktop (hidden on mobile)
- [ ] Razorpay payment flow completes end-to-end
