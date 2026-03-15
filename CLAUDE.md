# GrahAI — Project Intelligence (CLAUDE.md)

> The single source of truth for any AI agent working on GrahAI. Read this BEFORE touching code.
> **Prod URL:** https://grahai.vercel.app | **Repo:** https://github.com/singhhydra-prog/grahai.git | **Supabase:** `jkowflffshkebegtabxa`

### Cowork Runtime
This repository **is** the Claude Cowork workspace. Cowork is pointed at the repo root (`grahai/`).
- **Primary context inputs:** `01_context/` (base state) + `01_context/product/` (product operating files)
- **Product philosophy:** `01_context/product/PRODUCT_PHILOSOPHY.md` — The Five Questions, voice, feel
- **Product specs (9 docs):** `01_context/product/{PERSONALIZATION_RULES,SOURCE_REFERENCE_PATTERN,STORY_SYSTEM,OUTPUT_VOICE_RULES,EXPLANATION_LAYER_SPEC,UX_REDESIGN_SPEC,REPORT_STYLE_GUIDE,IMPLEMENTATION_BLUEPRINT}.md`
- **Folder guide:** `FOLDER_GUIDE.md` — where every file type belongs + future growth plan
- **Canonical weekly log:** `04_logs/weekly-YYYY-MM-DD.md` (written by `autonomous-optimizer` skill)
- **Session logs:** `04_logs/YYYY-MM-DD.md` (written by `memory-updater` skill at session end)
- **Weekly improvement cycle:** Run `autonomous-optimizer` once per week → writes to `04_logs/weekly-YYYY-MM-DD.md`

### Project Prime (Mandatory Session Start)
Every session MUST begin with this preflight before touching any code:
1. Read this file (`CLAUDE.md`) — understand the project map
2. Read `01_context/CURRENT_STATE.md` — what's in progress, what's blocked
3. Read `01_context/OPEN_QUESTIONS.md` — unresolved items to watch for
4. Summarize to the user: "Current state: [X]. Top priorities: [Y]. Blockers: [Z]."
5. Confirm what you're working on before making changes

Skip only if the user explicitly says "skip context" or gives a trivial one-shot task.

---

## WHAT — Map of GrahAI

### Codebase Architecture
```
src/
  app/              → Next.js App Router pages + API routes
    api/
      reports/      → Code-based report generation (primary)
      chat/         → Streaming AI chat with tool-use
      payment/      → Razorpay lifecycle
      gamification/ → XP/streaks/achievements
    app/            → Main authenticated app (tab layout)
    daily/          → Daily horoscope page
    weekly/         → Weekly guidance page
    billing/        → Billing history
    library/        → Saved reports library
    report/         → Report detail viewer
    auth/           → Login + OTP callback
    admin/          → Admin dashboard
    privacy-policy/ → Legal pages (6 total)
    terms/
    disclaimer/
    faq/
    support/
    refund-policy/
  lib/
    ephemeris/      → 3,324 lines — Swiss Ephemeris wrapper + 12 modules
    agents/         → 28-agent hierarchy, tool registry, memory system
    reports/        → PDF renderer + 7 report generators
    astrology-data/ → BPHS references, remedy database, Vedic stories
    gamification/   → XP engine, achievements, streaks
  components/
    app/tabs/       → HomeTab, AskTab, CompatibilityTab, MyChartTab, ProfileTab, ReportsTab
    app/            → OnboardingFlow, PricingOverlay, PaywallBanner, DailyInsightPage, etc.
    app/legal/      → DisclaimerPage, FAQPage, PrivacyPolicyPage, etc. (6 pages)
    ui/             → AppHeader, BottomNav, KundliChart, CosmicBackground, etc. (14 components)
```

### 7 Report Types
1. `love-compat` — Love & Compatibility
2. `kundli-match` — Kundli Matching (Ashtakoot)
3. `career-blueprint` — Career Blueprint
4. `marriage-timing` — Marriage Timing
5. `annual-forecast` — Annual Forecast 2026
6. `wealth-growth` — Wealth & Growth
7. `dasha-deep-dive` — Dasha Deep Dive

**Quality threshold:** >60% chart-specific content (no generic filler).

### Design Language
"Cosmic luxury": deep-space (#0A0E1A), saffron-gold accents (#D4A843), glass-morphic surfaces, cosmic-white text (#E8E6F0). See `03_docs/design/DESIGN_TOKENS.md` for full palette.

---

## WHY — Business Purpose

**Market:** $163M (2024) → $1.8B (2030) — 49% CAGR in India + NRI Vedic astrology market.

**Differentiation:** "3-click clarity" — code-based instant readings vs. Astrotalk's human-expert marketplace model.

**Revenue:** Free kundli (lead magnet) → paid reports (₹199-₹999) → subscriptions.

**Core bet:** Accurate code-generated Vedic analysis (no AI API dependency for core product). Backup: Claude API for premium interpretations.

**Success metric:** Users trust the platform for real decisions. >60% chart-specific per report.

---

## HOW — Commands & Workflows

### Essential Commands
```bash
npx tsc --noEmit           # TypeScript strict check (MUST pass before any deploy)
npm run dev                # Local dev (Turbopack)
npx vercel --prod          # Manual production deploy
npx vitest                 # Run test suite
npx tsx tests/test-uniqueness.ts # Report uniqueness test (target: <40% generic)
```

### Plan-First Workflow (MANDATORY for non-trivial changes)
1. **Explore** — Read-only context gathering from `01_context/` files + codebase. No changes.
2. **Plan** — Write `task_plan.md` in `04_logs/` describing what will change and why. Get approval.
3. **Implement** — Execute plan. One atomic change at a time. Commit after each logical unit.
4. **Verify** — Run `npx tsc --noEmit`. Run tests. Run uniqueness test if reports changed.

### Recursive Research Loop (RRL) — Self-Improving Quality
```
Hypothesize → Experiment → Measure → Iterate
```
1. Define metric (uniqueness %, TypeScript errors, generation time).
2. Make ONE atomic change.
3. Run verification (`npx tsc --noEmit && npx tsx tests/test-uniqueness.ts`).
4. If improved → keep + commit. If not → revert.
5. Repeat until plateau. Max 10 iterations per session.

### Weekly Improvement Loop
Formalized in `02_workflows/skills/auto-research.md`:
Diagnose (read KPIs + QA) → Prioritize (top 3, scored by impact/effort/risk) → **Approval Gate** → Implement (RRL) → Document (memory-updater). One cycle per week max.

### Session-End Protocol
After every non-trivial session, run `memory-updater` skill:
1. Update `01_context/CURRENT_STATE.md`
2. Update `01_context/DECISIONS.md` (if architectural changes made)
3. Update `01_context/OPEN_QUESTIONS.md` (new blockers)
4. Write log in `04_logs/YYYY-MM-DD.md`

### Governance — Hooks & Safety
- NEVER edit `.env.local` without explicit user approval
- NEVER force-push to main
- Always run `npx tsc --noEmit` before committing
- Report generators MUST produce >60% unique content
- All API routes validate auth via Supabase middleware
- Payments verify via Razorpay signature check
- **Checklist enforcement:** Page work → `page-launch.md`, legal work → `legal-publishing.md`, UX work → `ux-review.md`, pricing work → `pricing-page.md`. Work is NOT done until the relevant checklist passes.

### Multi-Clauding Strategy
Parallelize independent modules across sessions:
- **Session A:** Ephemeris engine (`src/lib/ephemeris/`)
- **Session B:** Report generators (`src/lib/reports/`)
- **Session C:** Frontend components (`src/components/`)
- **Session D:** API routes (`src/app/api/`)

Never let two sessions edit the same file.

---

## Business OS — Five Operating Domains

### 1. Product System
Governs the user-facing app surface: pages, routes, UX flows, onboarding, feature gating.
| File | Purpose |
|------|---------|
| `01_context/product/1_APP_MAP.md` | Complete route tree (public, app, API) with status |
| `01_context/product/2_PAGE_INVENTORY.md` | Every page audited: states, SEO, mobile, design compliance |
| `01_context/product/3_USER_FLOWS.md` | All user journeys with state transitions |
| `01_context/product/4_COPY_SYSTEM.md` | Brand voice, copy patterns, DO/DON'T examples |
| Skills | `page-auditor`, `ux-wireframer`, `copy-architect` |

### 2. Design System
Governs visual identity, component library, and design tokens.
| File | Purpose |
|------|---------|
| `03_docs/design/DESIGN_TOKENS.md` | Full palette, spacing, typography |
| `03_docs/design/GRAHAI_PREMIUM_DESIGN_ANALYSIS.md` | Premium design patterns |
| `03_docs/design/DESIGN_IMPLEMENTATION_CHECKLIST.md` | Design compliance tracking |
| Skills | `page-auditor` (design dimension), `ux-wireframer` |

### 3. Content System
Governs reports, horoscopes, copy, and SEO content.
| File | Purpose |
|------|---------|
| `01_context/product/4_COPY_SYSTEM.md` | Voice/tone guide |
| `01_context/OUTPUT_STANDARDS.md` | Quality bars for reports |
| Skills | `report-generator`, `daily-horoscope`, `content-pipeline`, `copy-architect`, `eval-runner` |

### 4. Revenue System
Governs pricing, payments, conversion funnels, and financial sustainability.
| File | Purpose |
|------|---------|
| `01_context/product/5_PRICING_MODEL.md` | Current pricing, subscription plans, projections |
| `01_context/product/7_SUCCESS_METRICS.md` | Revenue KPIs and targets |
| `03_docs/payments/RAZORPAY_SETUP.md` | Payment integration guide |
| Skills | `payment-flow`, `pricing-analyst`, `competitor-synthesizer` |

### 5. Operations System
Governs deployment, QA, legal compliance, session continuity, and autonomous improvement.
| File | Purpose |
|------|---------|
| `01_context/product/6_TRUST_PAGES_PLAN.md` | Legal/trust page audit and compliance |
| `03_docs/legal/*` | 6 legal page specs (privacy, terms, disclaimer, refund, FAQ, support) |
| `01_context/CURRENT_STATE.md` | Living project snapshot |
| `01_context/DECISIONS.md` | Architectural decision records |
| Skills | `deploy-vercel`, `legal-page-builder`, `qa-reviewer`, `memory-updater`, `autonomous-optimizer`, `auto-research` |

---

## Skill Taxonomy (18 Skills)

### Engine Skills (astrology core)
- `report-generator.md` — Generate/improve any of 7 report types
- `ephemeris-engine.md` — Swiss Ephemeris calculations
- `daily-horoscope.md` — Daily/weekly/monthly insights
- `kundli-report.md` — Full Kundli assembly pipeline

### Product Skills (user-facing)
- `page-auditor.md` — Audit any page for design, a11y, SEO, states, performance
- `ux-wireframer.md` — Plan new pages or redesigns
- `copy-architect.md` — Write/rewrite copy for any surface
- `legal-page-builder.md` — Create/audit legal pages for compliance

### Revenue Skills (monetization)
- `payment-flow.md` — Razorpay lifecycle
- `pricing-analyst.md` — Pricing strategy and conversion modeling
- `competitor-synthesizer.md` — Competitive intelligence briefs

### Quality Skills (verification)
- `eval-runner.md` — Quality evaluations
- `qa-reviewer.md` — End-to-end quality review with severity ratings
- `auto-research.md` — RRL + weekly improvement loop

### Operations Skills (continuity)
- `deploy-vercel.md` — Deployment process
- `content-pipeline.md` — SEO content + marketing automation
- `memory-updater.md` — Session-end memory updates
- `autonomous-optimizer.md` — Weekly bottleneck identification and improvement

### Backlog
- `03_docs/backlog/trading-scanner.md` — NSE gap-reversal scanner (future, not blocking)

### Operational Checklists (`02_workflows/checklists/`)

**Engineering:**
- `pre-deploy.md` — Pre-deployment verification (tsc, tests, bundle size, env vars)
- `session-end.md` — Session-end documentation protocol (state files + log)
- `report-quality.md` — Report generator quality gates (uniqueness, data-driven %, formatting)

**Customer-facing:**
- `page-launch.md` — New/redesigned page ship checklist (copy, design, a11y, SEO, performance)
- `legal-publishing.md` — Legal page publishing (content vs spec, cross-linking, compliance, trust signals)
- `ux-review.md` — UX audit checklist (states coverage, navigation, forms, mobile, consistency)
- `pricing-page.md` — Monetization surface checklist (pricing accuracy, trust, payment flow, analytics)

---

## Skill Map — Routes & Features → Skills

| Route / Feature | Primary Skill(s) |
|----------------|-------------------|
| `/app` (HomeTab, tabs) | `page-auditor`, `ux-wireframer` |
| `/daily`, `/weekly` | `daily-horoscope`, `copy-architect` |
| `/report/:id` | `report-generator`, `eval-runner` |
| `/billing` | `payment-flow`, `pricing-analyst` |
| `/auth/login` | `page-auditor` (onboarding flow) |
| `/privacy-policy`, `/terms`, `/disclaimer` | `legal-page-builder` |
| `/faq`, `/support`, `/refund-policy` | `legal-page-builder`, `copy-architect` |
| `api/reports/generate-code` | `report-generator`, `ephemeris-engine` |
| `api/payment/*` | `payment-flow` |
| `api/daily-horoscope` | `daily-horoscope` |
| `api/chat` | `ephemeris-engine` (tool calls) |
| Weekly improvement cycle | `autonomous-optimizer`, `qa-reviewer`, `memory-updater` |
| Deployment | `deploy-vercel`, `pre-deploy` checklist |
| SEO / marketing | `content-pipeline`, `competitor-synthesizer` |
| Pricing changes | `pricing-analyst`, `competitor-synthesizer` |

---

## Key Technical Decisions

### Swiss Ephemeris on Vercel
**Problem:** Vercel can't compile C++ native modules. Direct `import sweph` fails at build.

**Solution (implemented):**
```typescript
const moduleName = "sweph"
const sweph = require(moduleName)  // Indirect require — no Webpack resolution
```

Config: `package.json` (optional), `.npmrc` (`optional=true`), `next.config.ts` (`serverExternalPackages: ["sweph"]`).

### Agent System
- **28 agents** across 5 departments (astrology, numerology, tarot, vastu, general)
- **CEO Orchestrator** routes user messages → detects vertical → loads DB prompt → executes 17 tools
- **Tool registry:** 7 astrology + 4 numerology + 3 tarot + 3 vastu
- **Memory:** Auto-extract birth data on every message. Inject context via `memories` table (importance DESC).
- **Ethics:** `src/lib/ethics-guardrails.ts` filters hard blocks (fatalism, medical misinformation) + soft transforms.

### Supabase Database
- Table: `profiles` (PK = `auth.uid()`). NOT `user_profiles` or `user_id`.
- 22+ tables: core (profiles, conversations, messages, memories), astrology (kundlis, horoscopes, compatibility), agents (hierarchy, prompts, metrics).
- RLS enforced. Service role key for server API routes only.

---

## Reference Files

| Purpose | Path |
|---------|------|
| Report generators | `src/lib/reports/generators/*.ts` |
| Ephemeris wrapper | `src/lib/ephemeris/sweph-wrapper.ts` |
| Agent tools | `src/lib/agents/tools/{vertical}-tools.ts` |
| App map | `01_context/product/1_APP_MAP.md` |
| Page inventory | `01_context/product/2_PAGE_INVENTORY.md` |
| User flows | `01_context/product/3_USER_FLOWS.md` |
| Copy system | `01_context/product/4_COPY_SYSTEM.md` |
| Pricing model | `01_context/product/5_PRICING_MODEL.md` |
| Trust pages plan | `01_context/product/6_TRUST_PAGES_PLAN.md` |
| Success metrics | `01_context/product/7_SUCCESS_METRICS.md` |
| Design tokens | `03_docs/design/DESIGN_TOKENS.md` |
| Razorpay setup | `03_docs/payments/RAZORPAY_SETUP.md` |
| Legal specs | `03_docs/legal/*.md` |
| Project brief | `01_context/PROJECT_BRIEF.md` |
| Current state | `01_context/CURRENT_STATE.md` |

---

## Tech Stack (TL;DR)

Next.js 16 (App Router) | TypeScript strict | Tailwind v4 | Supabase (auth/db) | Swiss Ephemeris | Claude Sonnet 4 | Razorpay | Vercel

---

## What NOT To Do

- White/light backgrounds — live in deep space
- Pure white text (#FFFFFF) — use cosmic-white (#E8E6F0)
- Default Next.js colors
- Spline without lazy loading
- useSearchParams without Suspense
- Direct `import sweph` — use sweph-wrapper.ts
- Hardcoded system prompts — use `agent_prompt_versions` table
- localStorage/sessionStorage in components
- `user_profiles` table or `user_id` column
- Emojis in production UI
- Force-push to main
- Skipping `npx tsc --noEmit` before commit
- Creating pages without checking `PAGE_INVENTORY.md` first
- Writing copy without reading `COPY_SYSTEM.md`
- Changing pricing without reading `PRICING_MODEL.md`
- Deploying without running `qa-reviewer` skill
- Dropping files in repo root (see `FOLDER_GUIDE.md` decision tree)
- Creating `temp/` or unnamed folders (use scratch space, then move properly)
- Putting docs inside `src/` (all docs go in `01_context/` → `03_docs/`)
