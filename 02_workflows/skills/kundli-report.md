# Skill: kundli-report

## Trigger
Use this skill when working on the full Kundli (birth chart) report assembly pipeline — from raw birth data to the final ReportData object that feeds all 7 generators.

## Outcome
A complete ReportData object containing all calculated chart data, ready to feed any generator.

## Dependencies
- `src/lib/reports/kundli-report-generator.ts` — Main assembler (`assembleReportData()`)
- `src/lib/ephemeris/sweph-wrapper.ts` — Planet positions, houses
- `src/lib/ephemeris/dasha-engine.ts` — Vimshottari Dasha calculation
- `src/lib/ephemeris/yogas.ts` — Yoga detection
- `src/lib/ephemeris/doshas.ts` — Dosha detection
- `src/lib/ephemeris/divisional-charts.ts` — D9, D10 charts
- `src/lib/ephemeris/ashtakavarga.ts` — SAV scores
- `src/lib/ephemeris/shadbala.ts` — Planet strength
- `src/lib/ephemeris/planet-strength.ts` — Composite strength
- `src/app/api/reports/generate-code/route.ts` — API entry point

## Steps
1. **Trace the pipeline**: Birth data → Julian Day → Planet positions → Houses → Divisional charts → Yogas → Doshas → Dasha → Ashtakavarga → Shadbala → ReportData
2. **Verify each stage** outputs correct types
3. **Test with known chart** — Use a birth date with known planetary positions to validate
4. **Check ReportData completeness** — All fields must be populated (natalChart, navamsaChart, dasamsaChart, yogas, doshas, houseAnalysis, dashaAnalysis, dashaTimeline, strengthAnalysis, houseStrengths, ashtakavargaSummary, vargaInterpretation, doshaCancellations, savTransitReport, bhavaChalitReport, chartSynthesis)
5. **Performance** — assembleReportData should complete in <1s

## Edge Cases
- **Missing birth time**: Default to 12:00 noon, flag in output
- **Unknown city**: Use provided lat/lng directly
- **sweph fallback**: Meeus fallback auto-activates, slightly less accurate but functional
- **Extreme dates**: Before 1900 or after 2100 — reduced precision warning
