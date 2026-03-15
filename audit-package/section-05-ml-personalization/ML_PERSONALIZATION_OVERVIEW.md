# Section 5 — ML / Personalization / Astrology Audit

## What Is Rule-Based vs AI-Based

| Component | Type | Details |
|-----------|------|---------|
| Planet position calculation | **Deterministic (rule-based)** | Swiss Ephemeris — mathematical astronomy |
| Nakshatra/sign placement | **Deterministic** | Direct calculation from planetary longitude |
| Vimshottari Dasha periods | **Deterministic** | Formula from Moon's Nakshatra position |
| Yoga detection (35+) | **Deterministic** | Pattern matching: if planet A in house X and planet B in house Y |
| Dosha analysis (8+) | **Deterministic** | Rule-based: Mangal in 1/2/4/7/8/12 = Mangal Dosha |
| Ashtakavarga scores | **Deterministic** | Binary point system per classical BPHS rules |
| Shadbala (planet strength) | **Deterministic** | 6-fold calculation from position, direction, time |
| Code-based report generators | **Deterministic with templates** | Switch statements on actual chart data → narrative |
| AI-enhanced reports | **Probabilistic (LLM)** | Claude Sonnet 4 with chart data injection |
| Chat responses | **Probabilistic (LLM)** | Claude with agent routing + tool calls |
| Daily horoscope | **Hybrid** | Deterministic chart data + AI interpretation |
| Ethics guardrails | **Rule-based** | 13 blocked patterns + 10 soft replacements |

## Where LLMs Are Used

1. **Chat (/api/chat)** — Claude Sonnet 4 with streaming SSE. Agent system routes to specialist.
2. **AI-enhanced reports (/api/reports/generate-typed)** — Claude Sonnet 4 with max 4,096 tokens. Full chart data serialized into prompt.
3. **Daily horoscope (/api/daily-horoscope)** — May use AI for interpretation layer.
4. **Ask-one-question (/api/ask-one-question)** — Intentionally vague (lead magnet teaser).

LLMs are **NOT used** for: planet calculations, Dasha periods, yoga/dosha detection, ashtakavarga, PDF kundli reports, or code-based report generators.

## How Chart Data Transforms Into Output

```
Birth Details (date, time, place, lat, lng, tz)
    │
    ▼
assembleReportData() — Full chart assembly
    │
    ├── Natal chart: 9 planets × (house, sign, degree, nakshatra, dignity, retrograde)
    ├── Ascendant sign and degree
    ├── House lords (12 houses → ruling planet)
    ├── Vimshottari Dasha: Mahadasha/Antardasha/Pratyantar with dates
    ├── Divisional charts: D1, D9 (Navamsa), D10 (Dasamsa)
    ├── Yogas: 35+ combinations with strength rating
    ├── Doshas: 8+ with severity and cancellation check
    ├── Ashtakavarga: SAV scores per house
    ├── Shadbala: 6-fold strength per planet
    └── Additional: combustion, retrograde, graha yuddha
    │
    ▼
Code-based generator OR Claude API prompt
    │
    ▼
Structured report output (JSON sections + remedies)
```

## How Outputs Vary By Chart

**Proven by test:** 3 contrasting profiles generated 9 reports (3 types × 3 profiles). Average text similarity = 25.38%, meaning **~75% of content is unique per chart**.

| Comparison | Similarity |
|-----------|------------|
| Mumbai male vs London female | 16.89% |
| Mumbai male vs Delhi male | 50.68% |
| London female vs Delhi male | 8.57% |

**What varies:**
- Dasha lord changes forecast theme entirely (Mars vs Venus vs Rahu)
- Planet placements create different career/relationship narratives
- Yoga detection finds different combinations per chart
- SAV scores produce different house strength analyses
- Remedies tied to actual afflicted planets

**What stays similar:**
- Report structure (section headings, remedy format)
- Classical text references (BPHS chapter citations)
- General astrological principles in preambles

## Deterministic vs Probabilistic

| Path | Type | Cache? |
|------|------|--------|
| Code-based reports | Deterministic | Same input = same output. Could cache. Currently no caching. |
| AI-enhanced reports | Probabilistic | Same input ≠ same output (LLM temperature). No caching. |
| Chat | Probabilistic | Streaming, no caching. |
| Cosmic snapshot | Deterministic | Chart data fixed for given birth time. No caching. |

## Eval Pipeline

- **Uniqueness test:** `tests/test-uniqueness.ts` — compares report sections across 3 contrasting charts
- **Target:** <40% generic content (>60% chart-specific)
- **Current scores:** annual-forecast 35.4%, career-blueprint 39.5%, marriage-timing 40.3%, dasha-deep-dive 40.8%, love-compat 48.3%, kundli-match 53.3%, wealth-growth 54.6%
- **Methodology:** Generate same report for 3 different charts, compare section text, calculate overlap %
- **No automated CI integration** — runs manually via `npx tsx tests/test-uniqueness.ts`
