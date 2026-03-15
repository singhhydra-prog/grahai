# Skill: ephemeris-engine

## Trigger
Use this skill when working with Swiss Ephemeris calculations, planetary positions, house cusps, divisional charts, dashas, yogas, doshas, Ashtakavarga, or any astronomical computation.

## Outcome
Correct, tested Vedic astrology calculations that match classical references and pass TypeScript checks.

## Dependencies
- `src/lib/ephemeris/sweph-wrapper.ts` — Core wrapper (native sweph + Meeus fallback)
- `src/lib/ephemeris/types.ts` — All type definitions
- `src/lib/ephemeris/constants.ts` — Ayanamsa values, planet data
- All other ephemeris modules: dasha-engine, yogas, doshas, divisional-charts, ashtakavarga, shadbala, planet-strength, bhava-chalit, chart-synthesis, sav-transit-timing, panchang, transit-engine, varga-interpretation, graha-yuddha, dosha-cancellations

## Steps
1. **Understand the calculation** — Read the relevant ephemeris module and types.ts
2. **Check Vedic accuracy** — Verify against classical Jyotish rules (BPHS, etc.)
3. **Implement with fallback awareness** — If modifying sweph-wrapper, maintain both native and Meeus paths
4. **Type safety** — Use types from types.ts, never `any`
5. **Test with known charts** — Use at least 2 different birth dates to verify output
6. **TypeScript check** — `npx tsc --noEmit`

## Edge Cases
- **Vercel environment**: sweph native binary unavailable — Meeus fallback activates automatically via `USE_FALLBACK` flag
- **Rahu/Ketu**: Always computed as mean nodes (not true nodes) for Vedic
- **Ayanamsa**: Lahiri is default — never change without explicit user request
- **House system**: Whole-sign houses for Vedic (not Placidus)
- **Retrograde detection**: Based on speed < 0, not sign position
- **Julian Day edge cases**: Dates before 1900 or after 2100 may have reduced accuracy with Meeus
