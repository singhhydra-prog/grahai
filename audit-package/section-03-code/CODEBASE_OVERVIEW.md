# Section 3 — Codebase Overview

## Repo Structure

```
grahai/
├── CLAUDE.md                  # Project brain (read-first for any AI agent)
├── FOLDER_GUIDE.md            # Directory map + naming rules
├── 01_context/                # Project state (13 files)
│   ├── CURRENT_STATE.md       # What's in progress, blocked, priorities
│   ├── DECISIONS.md           # Architectural decision records
│   ├── OPEN_QUESTIONS.md      # Unresolved items
│   ├── OUTPUT_STANDARDS.md    # Quality bar
│   ├── PROJECT_BRIEF.md       # What GrahAI is
│   └── product/               # 7 numbered product operating files
├── 02_workflows/              # Operating manual (26 files)
│   ├── skills/                # 18 reusable task playbooks
│   └── checklists/            # 7 quality gates
├── 03_docs/                   # Reference & knowledge base (75 files)
│   ├── design/                # Design tokens, analysis
│   ├── evals/                 # Report quality evaluation
│   ├── legal/                 # 6 legal page specs
│   ├── payments/              # Razorpay docs
│   └── reports/               # Generated .docx deliverables
├── 04_logs/                   # Session history
├── src/                       # Application code (154 files)
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   ├── lib/                   # Core logic
│   └── types/                 # TypeScript types
├── tests/                     # Test suite (2 files)
├── public/                    # Static assets
└── [config files]             # tsconfig, package.json, vercel.json, etc.
```

## Key Directories

| Directory | Files | Purpose |
|-----------|-------|---------|
| `src/lib/ephemeris/` | 18 | Vedic astrology engine — Swiss Ephemeris wrapper, Dasha, yogas, doshas, ashtakavarga, shadbala |
| `src/lib/reports/generators/` | 9 | 7 report generators + types + dispatcher |
| `src/lib/reports/` | 2 | PDF renderer + kundli data assembler |
| `src/lib/agents/` | ~15 | 28-agent hierarchy, tool registry, memory system |
| `src/lib/astrology-data/` | ~10 | BPHS references, remedy DB, Vedic stories |
| `src/lib/gamification/` | ~5 | XP engine, achievements, streaks |
| `src/app/api/` | ~30 | All API route handlers |
| `src/components/app/tabs/` | 6 | Main app tab views |
| `src/components/app/legal/` | 6 | Legal page components |
| `src/components/ui/` | 14 | Shared UI components |

## Important Config Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts (`dev`, `build`, `start`, `lint`) |
| `tsconfig.json` | TypeScript strict mode, path aliases (`@/`) |
| `next.config.ts` | serverExternalPackages: ["sweph"], turbopack config |
| `vercel.json` | Cron schedules, function config |
| `.env.example` | Template for required env vars |
| `eslint.config.mjs` | Linter rules |
| `vitest.config.ts` | Test runner config |
| `twa-manifest.json` | Android TWA (Play Store wrapper) config |

## Known Technical Debt

1. **No CI/CD pipeline** — no GitHub Actions, no automated testing on push
2. **localStorage as primary state** — no server-side session persistence for app state
3. **Compatibility tab is fully mocked** — code exists but returns hardcoded data
4. **Library/Billing pages are mocked** — hardcoded data, no API integration
5. **No structured logging** — console.log/error only
6. **No error tracking** — no Sentry or equivalent
7. **No rate limiting** — API routes unprotected
8. **Agent seed endpoint unauthenticated** — /api/admin/agents/seed has no auth check
9. **Report catalog hardcodes Delhi coordinates** — user location not passed
10. **Price discrepancy** — PricingOverlay shows ₹199 but API charges ₹499 for Graha plan

## Known Broken Areas

| Area | Issue | Impact |
|------|-------|--------|
| Payment pricing | UI shows ₹199, API charges ₹499 | Users overcharged |
| Report coordinates | Hardcoded to Delhi | Wrong charts for non-Delhi users |
| /api/chat without API key | Returns 503, no fallback message | Chat completely broken |
| Admin dashboard auth | Only checks ADMIN_EMAIL env var | Accessible to anyone if not set |
