# Technical Notes: Personalization Audit Methodology

## Script Architecture

### Phase 1: Chart Assembly
- Calls `assembleReportData()` from `src/lib/reports/kundli-report-generator.ts`
- Returns complete `ReportData` object containing:
  - Natal chart with all 9 planets
  - Nakshatra analysis (Janma Nakshatra from Moon)
  - Dasha timeline (Vimshottari, 20 years)
  - Yoga detection (active yogas in chart)
  - Dosha analysis (afflictions like Kuja Dosha, etc.)
  - House analysis (all 12 houses with lords and significances)
  - Ashtakavarga calculations
  - Varga interpretation (D9, D10)
  - Remedy suggestions

### Phase 2: Report Generation
- Calls `generateReport(reportType, reportData)` from `src/lib/reports/generators/index.ts`
- Routes to specific generators:
  - `generateCareerReport()` → career-blueprint
  - `generateLoveCompatReport()` → love-compat
  - `generateAnnualForecastReport()` → annual-forecast
- Returns `GeneratedReport` with:
  - `summary`: Key overview (300-600 chars)
  - `sections`: Array of titled content blocks
  - `remedies`: Optional dosha/planet remedies

### Phase 3: Similarity Analysis
- Extracts first 500 characters from each section
- Compares across profiles using character-by-character matching
- Calculates similarity percentage: (matching_chars / total_chars) × 100
- Aggregates by:
  - Individual section pairs
  - Entire report types
  - All reports combined

## Key Findings

### Ephemeris System
- **Swiss Ephemeris available:** Working without fallback mode
- **Accuracy:** ~0.1 arcsecond (Moshier internal tables)
- **Ayanamsa:** Lahiri (standard for Vedic astrology)
- **No warnings:** No fallback to Meeus calculations triggered

### Report Generator Interface

The `generateReport()` function dispatches to specialized generators:

```typescript
function generateReport(
  reportType: ReportType,
  data: ReportData,
  partnerData?: ReportData
): GeneratedReport
```

**ReportType options:**
- `career-blueprint` (5 sections)
- `love-compat` (5 sections)
- `annual-forecast` (8 sections)
- `kundli-match` (requires partner data)
- `marriage-timing` (5 sections)
- `wealth-growth` (5 sections)
- `dasha-deep-dive` (6 sections)

### ReportData Structure

Core components passed to generators:

```typescript
interface ReportData {
  name: string
  birthDetails: BirthDetails
  natalChart: NatalChart
  navamsaChart: DivisionalChart
  dasamsaChart: DivisionalChart
  planetTable: PlanetTableRow[]
  nakshatraAnalysis: NakshatraAnalysis
  dashaAnalysis: DashaAnalysis
  dashaTimeline: Array<{...}>
  yogas: YogaResult[]
  doshas: DoshaResult[]
  houseAnalysis: HouseAnalysisRow[]
  remedies: ChartRemedySummary
  strengthAnalysis: ChartStrengthAnalysis
  vargottamaPlanets: PlanetName[]
  ashtakavarga: AshtakavargaResult
  vargaInterpretation: VargaInterpretation
  doshaCancellations: ComprehensiveDoshaAnalysis
  savTransitReport: SAVTransitReport
  bhavaChalitReport: BhavaChalitReport
  chartSynthesis: FullChartSynthesis
  bibliography: Array<{source, chapter, topic}>
}
```

## Personalization Vectors

### 1. Dasha-Driven Variation
Different Mahadasha lords produce different thematic content:
- **Mars Dasha:** Themes of action, passion, 12th house energies
- **Venus Dasha:** Themes of relationships, aesthetics, resources
- **Rahu Dasha:** Themes of innovation, illusion, growth

### 2. Planetary Dignity-Driven Variation
Dignity states create entirely different interpretations:
- **Exalted/Own Sign:** Positive, empowered narratives
- **Neutral:** Balanced, conditional narratives
- **Debilitated/Enemy:** Challenging, effort-required narratives

### 3. House Lord Placement-Driven Variation
Career lord placement changes career analysis:
- **1st house:** Self-focused, independent career
- **8th house:** Transformation, hidden work, research
- **12th house:** Spiritual work, foreign lands, service

### 4. Nakshatra-Driven Variation
Moon's nakshatra generates unique personality analysis:
- Each nakshatra has distinct deity, lord, characteristics
- Affects emotional patterns, security needs, relationship style

### 5. Ashtakavarga-Driven Variation
House strength scores differ significantly:
- High SAV (8+): Strong, supported houses
- Low SAV (3-5): Challenged, requiring effort
- Informs forecast timing and remedies

## Similarity Metrics Interpretation

- **<15%:** Highly personalized (minimal template reuse)
- **15-25%:** Well personalized (some structural templates)
- **25-40%:** Moderately personalized (balanced template+custom)
- **40%+:** Template-heavy (limited chart-specific analysis)

This audit found **25.38% average**, indicating healthy balance:
- Enough template for consistency and readability
- Enough customization for genuine personalization

## Test Limitations

1. **Only 3 profiles:** Limited sample size for statistical rigor
2. **Same reporting date:** All generated 2026-03-15 (affects transit aspects)
3. **Chosen profiles:** Intentionally contrasting, not random
4. **Section-level comparison:** Doesn't capture semantic variation (different words, same meaning)
5. **Character-based similarity:** Primitive metric; doesn't understand language

## Validation Approach

The audit relies on:
- **Code inspection:** Verified generator routing in index.ts
- **Data flow:** Confirmed ReportData assembly includes all necessary inputs
- **Output sampling:** Reviewed first 500 chars (typical paragraph length)
- **Cross-profile comparison:** Different Dashas, planets, houses guarantees difference
- **Absence of evidence:** No identical "template" blocks in sampled content

## Files Generated

1. **test-personalization.ts** (435 lines)
   - Master test script
   - Phase 1-5 execution
   - Similarity calculations
   - Output aggregation

2. **test-run-output.txt** (278 lines, 16KB)
   - Phase 1: Chart assembly with details
   - Phase 2: Report generation with previews
   - Phase 3: Detailed similarity matrix
   - Phase 4: Summary and conclusions
   - Phase 5: Full text excerpts from all reports

3. **RESULTS.md** (Summary document)
   - Executive summary
   - Profile comparison table
   - Aggregate statistics
   - Per-report-type analysis

4. **TECHNICAL_NOTES.md** (This file)
   - Implementation details
   - Data structure reference
   - Interpretation guidance
