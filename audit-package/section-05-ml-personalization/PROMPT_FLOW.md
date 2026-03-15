# Prompt Flow

## Chat Flow

```
User message
    ↓
CEO Orchestrator system prompt (loaded from agent_prompt_versions table)
    ↓
Vertical detection: astrology / numerology / tarot / vastu / general
    ↓
Specialist agent prompt loaded from DB
    ↓
Tool calls executed:
  - getNatalChart(birthData) → planet positions
  - calculateDasha(birthData) → current periods
  - getDailyHoroscope(sign) → today's guidance
  - getCompatibility(chart1, chart2) → matching
  - (17 tools total across verticals)
    ↓
Claude Sonnet 4 generates response
    ↓
Streamed as SSE text_delta events
    ↓
Frontend regex parser extracts 7 sections:
  Direct Answer | Why | Do | Avoid | Timing | Reflection | Source
```

## Report Generation Prompt Flow

For each of 7 report types, the /api/reports/generate-typed endpoint:

1. Assembles full chart data via `assembleReportData()`
2. Serializes into `buildChartSummary()` — text block with:
   - Full planetary table (9 planets)
   - Ascendant and Moon sign
   - Current Dasha periods
   - All yogas found
   - All doshas
   - 12 house lords
   - Partner data (if applicable)
3. Builds system prompt (500-1000 chars) specific to report type
4. Sends to Claude Sonnet 4 with:
   - `max_tokens: 4096`
   - System prompt defining expert domain + analysis focus
   - Chart summary as user content
   - JSON output structure specification
5. Parses JSON response into TypedReport

**Example system prompt (Career Blueprint):**
```
You are a Vedic astrology expert specializing in career and professional analysis.
YOUR ANALYSIS SHOULD FOCUS ON:
1. 10th house (career/public life) — lord, strength, aspects
2. Saturn (karaka for career) — placement, dignity, Dasha influence
3. Dasamsa (D10) — professional direction and timing
4. Mercury (communication/commerce) — business aptitude
ANALYSIS REQUIREMENTS:
- Use ACTUAL chart data provided — do NOT generate generic content
- Reference specific planetary placements from the chart data
- Cite classical text chapters where relevant (BPHS, Jataka Parijata)
```

## Ethics Guardrails

Applied to all AI outputs:
- **13 hard-blocked patterns:** fatalism ("you will die"), medical claims, specific date predictions, etc.
- **10 soft replacements:** "prediction" → "indication", "guarantee" → "tendency"
- **Auto-disclaimers:** Appended to health/legal/financial topics
