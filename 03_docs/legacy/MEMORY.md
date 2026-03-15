# GrahAI — Project Memory

> Living document tracking project state, decisions made, issues resolved, and lessons learned.
> Updated after every significant change. Newest entries at the top.

---

## Current State (March 2026)

### What's Live
- **Production URL:** https://grahai.vercel.app (35 pages)
- **All 4 product pages:** /kundli, /horoscope, /compatibility, /astrologer — HTTP 200
- **Hero animations:** OrbitalRing (12 zodiac symbols) + PlanetaryOrbits (9 planets with 2-word labels)
- **Chat system:** SSE streaming with 17 tools across 4 verticals
- **Gamification:** XP, streaks, achievements, level progression
- **Reports:** PDF kundli report generation via PDFKit
- **Payments:** Razorpay integration with geo-pricing
- **Email:** Daily insights via Resend cron job

### What Needs Work
- GitHub → Vercel auto-deploy may be disconnected (use `npx vercel --prod`)
- Hero animations committed (b76e196) but may need redeployment
- No automated tests yet
- No CI/CD pipeline
- pgvector embeddings not yet active for semantic memory search
- Edge Functions not yet deployed (all AI logic in Next.js API routes)

---

## Decision Log

### D-001: Swiss Ephemeris as Optional Dependency (March 2026)
**Context:** sweph native C++ module cannot compile on Vercel serverless.
**Decision:** Move to `optionalDependencies` with indirect `require()` to prevent Webpack static analysis.
**Tradeoffs:** Server-side calculations only work where sweph compiles (local dev). Vercel uses fallback or pre-computed data.
**Files:** `package.json`, `.npmrc`, `src/lib/ephemeris/sweph-wrapper.ts`, `next.config.ts`

### D-002: Whole Sign House System (March 2026)
**Context:** Vedic astrology traditionally uses Whole Sign houses, not Placidus.
**Decision:** Default to "W" (Whole Sign) in `getAscendantAndCusps()`.
**Rationale:** Matches BPHS and Parashari tradition. Simpler calculations, no interception issues.

### D-003: Lahiri Ayanamsa (March 2026)
**Context:** Multiple ayanamsa systems exist (Lahiri, Raman, Krishnamurti, etc.).
**Decision:** Use Lahiri (Chitrapaksha) exclusively.
**Rationale:** Official Indian government standard, most widely used in North Indian Jyotish.

### D-004: CEO Orchestrator Agent Pattern (March 2026)
**Context:** Need to route user messages to correct vertical specialist.
**Decision:** Regex-based vertical detection in `detectVertical()`, not LLM-based routing.
**Rationale:** Zero latency, zero cost, deterministic. LLM routing adds 1-2s latency + token cost for every message.

### D-005: Ethics Guardrails as Middleware (March 2026)
**Context:** AI astrology can produce fatalistic, harmful, or manipulative content.
**Decision:** Post-processing filter on every AI response with hard blocks + soft transforms.
**Rationale:** Users trust astrology platforms deeply. Fatalistic predictions can cause real psychological harm.

### D-006: Moshier Mode Over Ephemeris Files (March 2026)
**Context:** Swiss Ephemeris can use either file-based ephemeris (.se1 files) or internal Moshier calculations.
**Decision:** Use Moshier mode exclusively (no ephemeris files).
**Rationale:** 0.1 arcsecond accuracy is far beyond Jyotish requirements. Eliminates file management on serverless.

### D-007: True Node for Rahu/Ketu (March 2026)
**Context:** Vedic astrology debates True Node vs Mean Node for Rahu/Ketu.
**Decision:** Use True Node (SE_TRUE_NODE).
**Rationale:** More astronomically accurate, increasingly preferred by modern Jyotishis.

### D-008: Manual Vercel Deployment (March 2026)
**Context:** GitHub auto-deploy silently failed after sweph build errors.
**Decision:** Deploy manually via `npx vercel --prod` from local machine.
**Rationale:** Reliable, immediate feedback, avoids stale deploy issues.

---

## Issues Resolved

### I-001: All Product Pages 404 on Vercel
**Date:** March 2026
**Symptom:** /kundli, /horoscope, /compatibility, /astrologer all returned 404 ("Cosmic Disturbance" error page).
**Root Cause:** `sweph` native C++ module in `dependencies` failed to compile on Vercel, aborting the build. Deployed version was 42+ hours stale.
**Fix:** Moved sweph to `optionalDependencies`, added `.npmrc`, used indirect `require()` in sweph-wrapper.ts, deployed manually.
**Lesson:** Native C++ npm modules must ALWAYS be optional for serverless deployment.

### I-002: Git Push Auth Failure from Dev VM
**Date:** March 2026
**Symptom:** `fatal: could not read Username for 'https://github.com': No such device or address`
**Root Cause:** Development VM has no GitHub credentials configured.
**Fix:** User pushes from local Windows machine via PowerShell.
**Lesson:** Always have user push from their local machine.

### I-003: Vercel CLI Token Error
**Date:** March 2026
**Symptom:** `Error: The specified token is not valid` when running `npx vercel --prod`.
**Fix:** `npx vercel logout` → `npx vercel login --github` for fresh OAuth token.
**Lesson:** Vercel CLI tokens expire. Re-authenticate with `--github` flag.

---

## Architecture Invariants

These rules must NEVER be violated:

1. **No white backgrounds.** The entire app lives in deep space (#0A0E1A).
2. **No hardcoded system prompts.** All prompts come from `agent_prompt_versions` table.
3. **No direct sweph import.** Always use the indirect require pattern in sweph-wrapper.ts.
4. **No `user_profiles` table.** The table is `profiles` with PK `id` = auth.uid().
5. **No external costs.** All services must remain on free tier.
6. **No localStorage.** Use React state or Supabase for persistence.
7. **Ethics guardrails on every AI response.** No fatalistic predictions reach users.
8. **Tailwind only.** No inline styles, no CSS modules, no styled-components.
9. **Hindi-English bilingual.** UI naturally blends both languages.
10. **Server Components by default.** `"use client"` only when interactivity is required.

---

## Performance Benchmarks

| Metric | Target | Current |
|--------|--------|---------|
| Build time | < 60s | ~45s (35 pages) |
| First Contentful Paint | < 1.5s | TBD |
| Largest Contentful Paint | < 2.5s | TBD |
| Bundle size (JS) | < 200KB gzipped | TBD |
| Chat first token | < 1s | ~0.8s (streaming) |
| Kundli calculation | < 500ms | ~200ms (sweph native) |

---

## Upcoming Priorities

1. Reconnect GitHub → Vercel auto-deploy
2. Add automated tests (ephemeris accuracy, tool execution, SSE streaming)
3. Activate pgvector for semantic memory search
4. Implement remaining Tarot spreads (Celtic Cross, Horseshoe)
5. Add Vastu compass/AR feature
6. Performance audit (Lighthouse, Core Web Vitals)
7. SEO optimization (meta tags, structured data, sitemap)
8. Mobile app consideration (React Native or PWA)
