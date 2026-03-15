# SECTION 7 — Sample Outputs

**Status:** GENERATED — 9 reports from 3 contrasting profiles, raw output available

---

## Generation Methods Used in GrahAI

| Output Type | Generation Method | Status |
|-------------|-------------------|--------|
| Daily Insight (HomeTab) | **AI-generated** — Claude Sonnet via agent system | LIVE |
| Ask AI responses | **AI-generated** — Claude Sonnet via 28-agent routing | LIVE |
| Career Blueprint report | **Code-based** — `generateCareerReport()` | LIVE |
| Love & Compatibility report | **Code-based** — `generateLoveCompatReport()` | LIVE |
| Annual Forecast report | **Code-based** — `generateAnnualForecastReport()` | LIVE |
| Kundli Match report | **Code-based** — `generateKundliMatchReport()` | LIVE |
| Marriage Timing report | **Code-based** — `generateMarriageTimingReport()` | LIVE |
| Wealth & Growth report | **Code-based** — `generateWealthGrowthReport()` | LIVE |
| Dasha Deep Dive report | **Code-based** — `generateDashaDeepDiveReport()` | LIVE |
| Compatibility tab scores | **MOCKED** — hardcoded percentages | MOCKED |
| Report library/billing | **MOCKED** — UI only, no purchase flow | MOCKED |

---

## Sample Output: Career Blueprint — Profile A (Mumbai Male, Sagittarius Asc)

**Generation method:** Code-based (`src/lib/reports/generators/career-blueprint.ts`)
**Sections generated:** 5

**Summary excerpt (first 300 chars):**
> Career analysis for a Sagittarius ascendant with Mercury ruling the 10th house (Virgo). Mercury placed in 1st house in neutral dignity, retrograde. Career themes: communication, analysis, intellectual work. Mahadasha lord Mars influences 12th house — current period suggests behind-the-scenes work, foreign connections, or service-oriented career paths...

**Key personalization markers:**
- Ascendant-specific career archetype (Sagittarius = teaching, philosophy, travel)
- 10H lord Mercury retrograde → analytical, revisionary work style
- Mars Mahadasha → 12th house activation (foreign, spiritual, service)
- Ashtakavarga scores for 10th house inform career strength assessment

---

## Sample Output: Career Blueprint — Profile B (London Female, Gemini Asc)

**Summary excerpt (first 300 chars):**
> Career analysis for a Gemini ascendant with Jupiter ruling the 10th house (Pisces). Jupiter placed in 8th house, debilitated, retrograde. Career themes: transformation, research, hidden resources. Venus Mahadasha activates 2nd house — current period favors financial management, voice-related work, family business involvement...

**Key personalization markers:**
- Gemini ascendant career archetype (communication, media, commerce)
- 10H lord Jupiter debilitated in 8th → transformative but challenging career
- Venus Mahadasha → 2nd house (finance, speech, family resources)
- Completely different career narrative from Profile A despite same report structure

---

## Sample Output: Annual Forecast — Profile C (Delhi Male, Aquarius Asc)

**Summary excerpt (first 300 chars):**
> Annual forecast driven by Rahu Mahadasha activating 5th house themes. 2026 brings creative expansion, speculative gains, and unconventional approaches to personal expression. Rahu's influence suggests foreign connections, technology-driven opportunities, and breaking from traditional patterns. Month-by-month timing varies based on Antardasha transitions...

**Key personalization markers:**
- Rahu Mahadasha (unique to this profile — others have Mars and Venus)
- 5th house themes (creativity, speculation, children) — absent in A and B
- "Unconventional" and "foreign" language patterns specific to Rahu periods
- Monthly breakdown follows Antardasha sub-periods unique to this chart

---

## Sample Output: Love & Compatibility — Profile B (London Female, Scorpio Moon)

**Summary excerpt (first 300 chars):**
> Love analysis for Venus in Cancer — nurturing emotional style with deep need for security. Scorpio Moon creates intense emotional bonds with desire for transformative partnerships. 7th house analysis from Gemini ascendant reveals Sagittarius descendant — attracted to adventurous, philosophical, freedom-loving partners. Venus Mahadasha currently active...

**Key personalization markers:**
- Venus in Cancer (nurturing) vs Venus in Capricorn (structured) for Profile A
- Scorpio Moon (intense) vs Leo Moon (expressive) for Profile A
- Different 7th house lord → different partner archetype
- Female-specific relationship language patterns

---

## AI-Generated Outputs (Chat/Ask Tab)

**Generation method:** AI-generated via Claude Sonnet 4

**How it works:**
1. User types question in Ask tab
2. Question routed through 28-agent system (`src/lib/agents/`)
3. Agent selects appropriate vertical (astrology, numerology, tarot, vastu, general)
4. User's birth chart data injected as context
5. Claude generates personalized response with source citations
6. Response includes follow-up suggestions

**Sample interaction (reconstructed from code flow):**

> **User:** "Will I get a promotion this year?"
>
> **System context injected:** Birth chart, current Dasha period, 10th house analysis, career lord status, transit positions
>
> **Expected response pattern:** Analysis of 10th house lord's current transit, Mahadasha influence on career house, Ashtakavarga score for 10th house, specific timing windows based on Antardasha transitions, with source citations (e.g., "BPHS Ch.34 — Dasha Effects")

**Status:** LIVE — AI responses are genuinely personalized because birth chart data is injected into every prompt. However, actual response quality depends on Claude model availability and prompt engineering.

---

## Mocked Outputs

### Compatibility Tab Scores
- **Status:** MOCKED
- Compatibility percentages (e.g., "78% compatible") are hardcoded
- No actual Guna matching or Ashtakoot calculation for arbitrary partner input
- Kundli Match report (code-based) works for full reports, but the quick-score tab is placeholder

### Report Library/Billing
- **Status:** MOCKED
- Report cards display correctly with pricing
- "Buy" buttons in one-time packs have no onClick handler
- No purchase flow creates entitlement records
- Report generation works if triggered directly (code-based), but the commercial path is incomplete

---

## Raw Test Data

Full test execution output, similarity matrices, and text excerpts are available in:
- `audit-package/sample-outputs/test-run-output.txt` (16 KB — complete raw output)
- `audit-package/sample-outputs/RESULTS.md` (professional summary with tables)
- `audit-package/sample-outputs/TECHNICAL_NOTES.md` (implementation architecture)

---

## Verdict

| Output Type | Legitimate? | Evidence |
|-------------|------------|----------|
| Code-based reports (7 types) | **YES** | 9 reports generated, 75% unique content measured |
| AI chat responses | **YES** | Birth chart injected into every prompt, personalization verified in code |
| Daily insights | **YES** | AI-generated with user's chart context |
| Compatibility quick-scores | **NO** | Hardcoded percentages, no calculation |
| Report purchase flow | **NO** | UI-only, no backend purchase path |
