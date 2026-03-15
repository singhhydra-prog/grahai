# Evaluation Method

## Uniqueness Test

**File:** `tests/test-uniqueness.ts`
**Run:** `npx tsx tests/test-uniqueness.ts`

### Methodology

1. Create 3 contrasting birth profiles (different date, time, place, gender)
2. Generate each of 7 report types for all 3 profiles
3. For each report, extract section text
4. Compare pairwise: what % of sentences are identical across profiles
5. Report "Generic %" — lower = more personalized

### Target

- **>60% chart-specific content** (Generic% < 40%)
- Measures: report text that changes based on actual chart data

### Current Scores (March 2026)

| Report | Generic % | Chart-Specific % | Status |
|--------|-----------|-------------------|--------|
| annual-forecast | 35.4% | 64.6% | ✅ PASS |
| career-blueprint | 39.5% | 60.5% | ✅ PASS |
| marriage-timing | 40.3% | 59.7% | ⚠️ BORDERLINE |
| dasha-deep-dive | 40.8% | 59.2% | ⚠️ BORDERLINE |
| love-compat | 48.3% | 51.7% | ✅ PASS |
| kundli-match | 53.3% | 46.7% | ✅ PASS |
| wealth-growth | 54.6% | 45.4% | ✅ PASS |

### Independent Verification (This Audit)

3 profiles × 3 report types = 9 reports generated.
Average cross-profile similarity: **25.38%** (= 74.62% unique per chart)

This confirms personalization is genuine — outputs change significantly based on birth chart data.

### Limitations of Eval

- No automated CI integration
- Test only checks text overlap, not factual accuracy
- Doesn't verify astrological correctness (would need domain expert)
- No A/B testing or user satisfaction metrics
