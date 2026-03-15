# Report Quality Checklist

Use after modifying any report generator:

- [ ] TypeScript check passes (`npx tsc --noEmit`)
- [ ] Uniqueness test passes (`npx tsx test-uniqueness.ts` — target <40% generic)
- [ ] Every section leads with chart-specific data (planet position, house, sign, dignity)
- [ ] No "textbook" sentences that would be identical for any chart
- [ ] Dasha timeline references include specific dates
- [ ] SAV/Ashtakavarga scores are mentioned with actual values
- [ ] Yogas and doshas from the chart are referenced (not generic lists)
- [ ] Remedies reference the specific afflicted planet and its placement
- [ ] Summary paragraph is chart-specific (not a template)
- [ ] Optional chaining used for all planet/house lookups (no crash risk)
- [ ] Generator registered in `src/lib/reports/generators/index.ts`
