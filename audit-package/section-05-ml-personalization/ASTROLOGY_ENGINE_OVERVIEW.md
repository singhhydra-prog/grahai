# Astrology Engine Overview

## Architecture

18 files in `src/lib/ephemeris/`:

| File | Purpose | Lines |
|------|---------|-------|
| `sweph-wrapper.ts` | Swiss Ephemeris + Meeus fallback | ~400 |
| `dasha-engine.ts` | Vimshottari 120-year Dasha system | ~300 |
| `divisional-charts.ts` | D1, D9, D10 chart calculations | ~200 |
| `yogas.ts` | 35+ yoga pattern detection | ~500 |
| `doshas.ts` | 8+ dosha analysis with severity | ~300 |
| `ashtakavarga.ts` | SAV binary point system | ~250 |
| `shadbala.ts` | 6-fold planetary strength | ~200 |
| `graha-yuddha.ts` | Planetary war detection | ~100 |
| `dosha-cancellations.ts` | Yoga bhanga (cancellation) rules | ~150 |
| `chart-synthesis.ts` | Multi-factor analysis | ~200 |
| `bhava-chalit.ts` | Equal house analysis | ~150 |
| `varga-interpretation.ts` | Divisional chart meanings | ~200 |
| `sav-transit-timing.ts` | Transit timing via SAV | ~150 |
| (+ 5 utility/helper files) | | |

## Swiss Ephemeris Integration

**Primary mode:** sweph native module (C++ compiled)
- Accuracy: ~0.1 arcsecond
- Uses Moshier internal ephemeris (no external data files)
- Loaded via indirect require to avoid Webpack bundling

**Fallback mode:** Meeus approximation (pure JS)
- Accuracy: ~1-2 degrees
- Sufficient for sign-level analysis
- Used when native module unavailable (some dev environments)

**Detection:** Automatic — tries sweph first, falls back silently

```typescript
let sweph: any = null
try {
  const moduleName = "sweph"
  sweph = require(moduleName) // Indirect require bypasses Webpack
} catch {
  console.warn("[GrahAI] sweph not available — using fallback")
}
```

## Calculation Pipeline

1. **Julian Day conversion** — birthDetailsToJD(date, time, tz)
2. **Planet positions** — 9 Vedic planets (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke) in tropical
3. **Sidereal conversion** — subtract Lahiri ayanamsa (~24°)
4. **House cusps** — Whole Sign system (standard for North Indian Jyotish)
5. **Nakshatra** — 27 stars, each 13°20', with pada (quarter)
6. **Dignity** — Own sign, exaltation, debilitation, Moolatrikona
7. **Retrograde check** — negative daily motion = retrograde
8. **Combustion** — planet within specific degrees of Sun

## What Is NOT Mocked

All of the above calculations are real mathematical computations. There are zero hardcoded planetary positions or mock chart data in the ephemeris engine. Every output depends on the specific birth time and location provided.

## Known Limitations

1. **Fallback accuracy** — 1-2° when sweph unavailable (not flagged to user)
2. **Pratyantar Dasha** — Only calculated for current Mahadasha (optimization, not bug)
3. **No Ayanamsa options** — Lahiri only (most common, but some users prefer Raman or KP)
4. **No transit calculations** — Current transits not computed (only natal chart)
