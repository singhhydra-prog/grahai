# GrahAI Folder Guide

> **Read this first** if you're unsure where something goes.
> Every file in this repo has a home. If it doesn't fit anywhere below, it probably doesn't belong here yet.

---

## Root — Config Only

The repo root contains **only build/deploy config** and the two brain files. Nothing else lives here.

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project brain — read first every session |
| `FOLDER_GUIDE.md` | This file — directory map and rules |
| `README.md` | Public-facing project description |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config |
| `eslint.config.mjs` | Linter config |
| `postcss.config.mjs` | PostCSS (Tailwind) |
| `vercel.json` | Deployment config |
| `vitest.config.ts` | Test runner config |
| `twa-manifest.json` | Android TWA (Play Store) config |
| `.env.example` | Template for env vars |
| `.env.local` | Local secrets (gitignored) |

**Rule:** No `.md` docs, no `.docx` files, no images, no scratch files at root level.

---

## 01_context/ — Project State (What Is True Now)

This is the **single source of truth** for what the project is, where it stands, and what's unresolved. Read at the start of every session.

```
01_context/
├── PROJECT_BRIEF.md          # What GrahAI is, who it's for, core thesis
├── CURRENT_STATE.md           # What's in progress, blocked, next 3 priorities
├── OPEN_QUESTIONS.md          # Unresolved decisions and unknowns
├── DECISIONS.md               # Architectural decisions and their rationale
├── OUTPUT_STANDARDS.md        # Quality bar for all outputs
└── product/                   # Product operating files (numbered for reading order)
    ├── 1_APP_MAP.md           # Complete route tree
    ├── 2_PAGE_INVENTORY.md    # Every page audited (status, content, gaps)
    ├── 3_USER_FLOWS.md        # 7 user journeys end-to-end
    ├── 4_COPY_SYSTEM.md       # Brand voice, tone, messaging framework
    ├── 5_PRICING_MODEL.md     # Pricing tiers, commitment levels, roadmap
    ├── 6_TRUST_PAGES_PLAN.md  # Legal pages plan + live deployment status
    └── 7_SUCCESS_METRICS.md   # KPIs, instrumentation status, targets
```

### Naming rules
- Root files: `UPPER_SNAKE_CASE.md`
- Product files: `{number}_{UPPER_NAME}.md` — number = reading order
- **When to add a new file here:** Only for persistent state that every session needs. If it's a one-time analysis, it goes in `03_docs/`.

### Future growth
- `01_context/product/8_COMPETITOR_MAP.md` — when competitor analysis is done
- `01_context/product/9_ANALYTICS_PLAN.md` — when GA4/event tracking is designed
- `01_context/infrastructure/` — if infra decisions (DB schema, CDN, caching) need their own subdir

---

## 02_workflows/ — How Work Gets Done

Skills (reusable task playbooks) and checklists (quality gates). This is the **operating manual**.

```
02_workflows/
├── skills/                    # Reusable task playbooks (18 skills)
│   ├── auto-research.md       #   Research + weekly improvement loop
│   ├── autonomous-optimizer.md#   Weekly optimization entry point
│   ├── competitor-synthesizer.md
│   ├── content-pipeline.md
│   ├── copy-architect.md
│   ├── daily-horoscope.md
│   ├── deploy-vercel.md
│   ├── ephemeris-engine.md
│   ├── eval-runner.md
│   ├── kundli-report.md
│   ├── legal-page-builder.md
│   ├── memory-updater.md
│   ├── page-auditor.md
│   ├── payment-flow.md
│   ├── pricing-analyst.md
│   ├── qa-reviewer.md
│   ├── report-generator.md
│   └── ux-wireframer.md
└── checklists/                # Quality gates (7 checklists)
    ├── pre-deploy.md          #   Before any Vercel push
    ├── report-quality.md      #   Before shipping a report generator
    ├── session-end.md         #   Before closing any session
    ├── page-launch.md         #   Before shipping a customer-facing page
    ├── legal-publishing.md    #   Before publishing a legal page
    ├── ux-review.md           #   Before shipping any UX change
    └── pricing-page.md        #   Before changing monetization surfaces
```

### Naming rules
- Skills: `lowercase-kebab-case.md`
- Checklists: `lowercase-kebab-case.md`
- Every skill has: Trigger, Context Inputs, Steps, Output, Checklist Enforcement section
- **When to add a new skill:** When a task has been done manually 2+ times and follows a repeatable pattern

### Future growth
- `02_workflows/skills/ga4-installer.md` — when analytics tracking is implemented
- `02_workflows/skills/landing-page-builder.md` — when marketing landing page is needed
- `02_workflows/skills/a-b-test-runner.md` — when conversion experiments start
- `02_workflows/skills/onboarding-optimizer.md` — when onboarding flow is tuned
- `02_workflows/checklists/api-launch.md` — when new API endpoints need a gate
- `02_workflows/templates/` — recreate when reusable output templates are needed (e.g., report layouts, email templates)

---

## 03_docs/ — Reference & Knowledge Base

Long-lived reference material, specs, research, and generated deliverables. **Not read every session** — pulled in when a skill or task needs it.

```
03_docs/
├── backlog/                   # Parked ideas not yet prioritized
│   └── trading-scanner.md     #   (parked — misaligned with core product)
├── deployment/                # Deploy guides and scripts
│   ├── LAUNCH-GUIDE.md
│   ├── PLAYSTORE-GUIDE.md
│   └── scripts/
│       ├── deploy.bat
│       └── start.bat
├── design/                    # Design system, tokens, research
│   ├── DESIGN_TOKENS.md
│   ├── DESIGN_IMPLEMENTATION_CHECKLIST.md
│   ├── DESIGN_RESEARCH_INDEX.md
│   ├── GRAHAI_PREMIUM_DESIGN_ANALYSIS.md
│   └── onboarding-mockup.html
├── evals/                     # Report quality evaluation system
│   ├── EVAL_SUITE.md
│   ├── EVAL_QUICK_START.md
│   ├── EVAL_IMPLEMENTATION_SUMMARY.md
│   └── eval-results.json
├── legal/                     # Legal page content specs
│   ├── disclaimer-spec.md
│   ├── faq-spec.md
│   ├── privacy-spec.md
│   ├── refund-spec.md
│   ├── support-spec.md
│   └── terms-spec.md
├── legacy/                    # Old docs kept for reference (pre-restructuring)
│   ├── INTEGRATION_SUMMARY.md
│   ├── MEMORY.md
│   └── TOOLS.md
├── payments/                  # Razorpay integration docs
│   ├── RAZORPAY_SETUP.md
│   ├── RAZORPAY_REFERENCE.md
│   └── RAZORPAY_QUICKSTART.md
├── reference/                 # Source materials (gitignored binaries)
│   ├── images/                #   WhatsApp design references
│   └── legal-source/          #   Original legal .docx files
├── reports/                   # Generated .docx deliverables (gitignored)
│   ├── GrahAI_Full_Audit_Report.docx
│   ├── GrahAI_Restructuring_Changelog.docx
│   └── ... (other generated reports)
└── supabase-email-templates/  # Email HTML templates
    ├── confirmation.html
    └── magic-link.html
```

### Naming rules
- Subdirectories: `lowercase-kebab-case/`
- Spec files: `{topic}-spec.md`
- Guide files: `UPPER_CASE.md`
- Generated reports: `GrahAI_{Title}.docx`
- **When to add a new subdirectory:** When 3+ files share a clear topic that doesn't fit existing folders

### Future growth
- `03_docs/api/` — API documentation when public API is considered
- `03_docs/analytics/` — GA4 event catalog, dashboard specs, funnel definitions
- `03_docs/onboarding/` — onboarding flow research, A/B test results
- `03_docs/i18n/` — translation guides, language coverage status
- `03_docs/design/components/` — component library documentation
- `03_docs/postmortems/` — incident writeups if/when production issues occur

---

## 04_logs/ — Session History

Canonical record of what happened, when, and what changed. Written by the `memory-updater` skill at session end and the `autonomous-optimizer` skill for weekly cycles.

```
04_logs/
└── 2026-03-15.md              # Today's session log
```

### Naming rules
- Session logs: `YYYY-MM-DD.md`
- Weekly optimization logs: `weekly-YYYY-MM-DD.md`
- **One file per session day, one file per weekly cycle**

### Future growth
- Logs accumulate naturally. No structural changes needed.
- Consider monthly rollup (`monthly-YYYY-MM.md`) if daily logs exceed 20 files.

---

## src/ — Application Code

Standard Next.js App Router structure. **No documentation files here** — all docs live in `01_context/` through `04_logs/`.

```
src/
├── app/                       # Next.js App Router pages
│   ├── layout.tsx             # Root layout (fonts, metadata, scripts)
│   ├── page.tsx               # Landing redirect → /app
│   ├── globals.css            # Global styles + Tailwind
│   ├── app/                   # Main app shell (5-tab PWA)
│   ├── admin/                 # Founder dashboard
│   ├── auth/                  # Login (OTP + OAuth)
│   ├── api/                   # 30 API routes
│   └── {legal-pages}/         # disclaimer, terms, privacy-policy, etc.
├── components/                # React components
│   ├── app/                   # App-specific (tabs, overlays)
│   └── ui/                    # Shared UI (BottomNav, GlobalFooter, etc.)
├── lib/                       # Core logic
│   ├── ephemeris/             # Vedic astrology engine (18 files)
│   ├── reports/               # Report generators (7 types)
│   ├── agents/                # AI agent system
│   └── ...                    # Utils, contexts, i18n
└── types/                     # TypeScript type definitions
```

**Rule:** Component code only. No `.md` docs, no test files, no scripts inside `src/`.

---

## tests/ — Test Suite

```
tests/
├── grahai-accuracy.test.ts    # Vitest accuracy tests
└── test-uniqueness.ts         # Report uniqueness scorer
```

**Rule:** All test files here, not in `src/`. Named `{feature}.test.ts` or `test-{feature}.ts`.

---

## public/ — Static Assets

PWA manifest, icons, images. Standard Next.js `public/` folder.

---

## Decision Tree: Where Does This File Go?

```
Is it about the current state of the project?
  → YES → 01_context/
  → NO ↓

Is it a reusable process, skill, or quality gate?
  → YES → 02_workflows/skills/ or 02_workflows/checklists/
  → NO ↓

Is it reference material, a spec, or a generated deliverable?
  → YES → 03_docs/{appropriate-subfolder}/
  → NO ↓

Is it a session log or weekly cycle record?
  → YES → 04_logs/
  → NO ↓

Is it application code?
  → YES → src/
  → NO ↓

Is it a test?
  → YES → tests/
  → NO ↓

Is it build/deploy config?
  → YES → Root level
  → NO → It probably doesn't belong in this repo.
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Drop files in repo root | Use the decision tree above |
| Create `New folder/` or `temp/` | Use `/sessions/` scratch space, then move to proper location |
| Put docs inside `src/` | All docs go in `01_context/` through `03_docs/` |
| Create unnumbered files in `01_context/product/` | Always number them for reading order |
| Name skills with spaces or caps | Use `lowercase-kebab-case.md` |
| Add binary assets directly to repo | Put in `03_docs/reference/` (gitignored) |
| Duplicate info across multiple files | Single source of truth, link to it |
