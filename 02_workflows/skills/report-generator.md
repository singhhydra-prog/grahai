# Skill: report-generator

## Trigger
Use this skill when the user asks to generate, fix, improve, audit, or create any of the 7 GrahAI report types (love-compat, kundli-match, career-blueprint, marriage-timing, annual-forecast, wealth-growth, dasha-deep-dive).

## Outcome
A TypeScript report generator function in `src/lib/reports/generators/` that:
- Takes `ReportData` as input (from `kundli-report-generator.ts`)
- Returns `GeneratedReport` with summary, sections[], and remedies[]
- Produces >60% unique content across different charts
- Passes `npx tsc --noEmit` with zero errors

## Dependencies
- `src/lib/reports/generators/types.ts` — Shared types (GeneratedReport, ReportSection, etc.)
- `src/lib/reports/generators/index.ts` — Generator dispatcher (must register new generators here)
- `src/lib/reports/kundli-report-generator.ts` — ReportData type definition
- `src/lib/ephemeris/types.ts` — NatalChart, DivisionalChart, etc.
- `test-uniqueness.ts` — Sentence-level comparison test

## Steps
1. **Read existing generator** — Read the target generator file and `types.ts` to understand the interface
2. **Identify generic content** — Run `npx tsx test-uniqueness.ts` and note which sentences are identical across charts
3. **Plan changes** — Write specific fixes for each generic sentence (data-driven replacement)
4. **Implement** — Edit the generator, replacing generic text with chart-specific interpolations:
   - Lead every sentence with actual data: planet sign, house, dignity, SAV score
   - Use conditional branches for different dignities/houses/signs
   - Reference dasha timeline with specific dates
   - Use yogas/doshas/cancellations when present
5. **TypeScript check** — Run `npx tsc --noEmit`, fix any errors
6. **Uniqueness test** — Run `npx tsx test-uniqueness.ts`, verify target generator shows <40% generic
7. **Update state** — Update `01_context/CURRENT_STATE.md` with what changed

## Edge Cases
- **Missing planet data**: Always use optional chaining (`planet?.sign?.name || "Unknown"`)
- **Empty arrays**: Check `.length > 0` before iterating yogas, doshas, dasha timeline
- **planetTable vs natalChart.planets**: Some generators use `data.planetTable` which may be empty — fallback to `natalChart.planets`
- **DivisionalChart lacks houses**: Navamsa/Dasamsa charts don't have `.houses` property — only `.planets` and `.ascendant`
- **Retrograde status**: Check `planet.retrograde` boolean, not string
- **Sign degree calculation**: Use `getSignFromDegree(fullDegree)` not `degree % 30` then `getSignFromDegree()`
