# GrahAI Astrology Eval Suite

Comprehensive test suite for evaluating the quality of GrahAI's astrology responses. Includes 160 test cases across 8 categories covering various astrology question types.

## Overview

The eval suite tests the `/api/chat` endpoint with diverse queries to measure:

- **Trait Coverage**: Does the response contain expected astrological concepts (10th house, dasha, Venus, etc.)?
- **Forbidden Content**: Does the response avoid generic, fear-based, or misleading statements?
- **Response Length**: Is the response substantive (meets minimum character requirement)?
- **Overall Score**: Weighted combination (traits 50%, forbidden 30%, length 20%)

## Test Categories (160 cases total)

### 1. Career (20 tests)
Questions about job changes, promotions, entrepreneurship, and professional growth.

**Expected traits**: 10th house, dasha, timing analysis, practical advice
**Forbidden**: generic statements, absolute guarantees, fear-based language

Examples:
- "Will I get a promotion this year?"
- "Should I switch jobs?"
- "Is business entrepreneurship right for me?"

### 2. Love & Relationships (20 tests)
Questions about finding love, marriage timing, relationship compatibility, and compatibility.

**Expected traits**: 7th house, Venus, specific guidance, emotional sensitivity
**Forbidden**: "you will never", guaranteed outcomes, doom predictions

Examples:
- "When will I find love?"
- "Is this person right for me?"
- "Will my marriage last forever?"

### 3. Timing & Auspiciousness (20 tests)
Questions about optimal timing for events, investments, travel, and life decisions.

**Expected traits**: transit analysis, dasha periods, time windows, classical references
**Forbidden**: exact date guarantees, fear of bad timing

Examples:
- "When is the best time to invest?"
- "Should I travel in April?"
- "What is the best month for my wedding?"

### 4. Daily Guidance (20 tests)
Questions about daily horoscopes, weekly themes, and current energy.

**Expected traits**: current transit, practical advice, positive framing
**Forbidden**: generic horoscope, newspaper-style predictions

Examples:
- "What should I focus on today?"
- "Any cautions for today?"
- "How is this week looking?"

### 5. Unknown Birth Time (20 tests)
Same questions as other categories but without exact birth time.

**Expected traits**: acknowledges limitation, uses moon/sun signs, still provides value
**Forbidden**: refuses to answer, demands exact time

Examples:
- "Can you read my birth chart? I don't know my exact birth time."
- "Will I get married?" (without birth time)
- "What's my personality?" (without birth time)

### 6. Source Citation (20 tests)
Questions asking for classical astrological references and textual basis.

**Expected traits**: BPHS, Saravali, Phaladeepika, chapter/verse, transliteration
**Forbidden**: made-up references, vague attribution

Examples:
- "What does Brihat Parashara Hora Shastra say about my Moon?"
- "Can you cite what classical texts say about Mangal Dosha?"
- "What's the classical basis for dasha periods?"

### 7. Remedies (20 tests)
Questions about remedies, mantras, gemstones, and spiritual practices.

**Expected traits**: specific remedy, mantra, gemstone/charity, classical basis
**Forbidden**: expensive commercial recommendations, fear-mongering, superstition

Examples:
- "What remedies for Mangal Dosha?"
- "How to strengthen weak Jupiter?"
- "Can gems really help? Which one for my chart?"

### 8. Emotional Tone (20 tests)
Emotionally charged questions requiring empathetic, constructive responses.

**Expected traits**: empathetic, acknowledges emotion, constructive, non-fearful, specific
**Forbidden**: dismissive, cold, preachy, generic comfort

Examples:
- "My marriage is falling apart. I'm devastated. Will it survive?"
- "I feel hopeless about my career. What's wrong with me?"
- "I've lost everything. Am I cursed?"

## File Structure

```
src/lib/eval/
├── test-cases.ts      # 160 test cases organized by category
├── runner.ts          # Test runner and scoring logic
└── run-eval.ts        # CLI entry point
```

## Running the Eval Suite

### Prerequisites
- Node.js 18+
- npm/yarn installed
- GrahAI app running on `http://localhost:3000`

### Basic Usage

```bash
# Run all tests with default endpoint
npx tsx src/lib/eval/run-eval.ts

# Run with custom API endpoint
npx tsx src/lib/eval/run-eval.ts --api-endpoint http://localhost:3001/api/chat
```

### Output

The script prints a summary table:

```
================================================================================
EVAL RESULTS SUMMARY
================================================================================

Category             | Avg Score  | Pass Rate  | Weakest Case
---------------------------------------------------------------------
✓ career             | 78.3       | 85%        | career-05 (62.1)
✓ daily              | 82.1       | 90%        | daily-12 (71.5)
✓ emotional-tone     | 75.2       | 80%        | emotional-tone-03 (55.2)
✓ love               | 81.5       | 90%        | love-08 (68.3)
✓ remedy             | 79.8       | 85%        | remedy-15 (64.2)
✓ source-citation    | 76.4       | 80%        | source-citation-07 (58.9)
✓ timing             | 80.2       | 90%        | timing-09 (69.1)
✓ unknown-birth-time | 77.1       | 85%        | unknown-birth-time-11 (61.5)

================================================================================
Overall Average Score: 79.0/100
Overall Pass Rate: 86% (137/160 tests)
Total Time: 142.3s

📊 Full results saved to: /path/to/eval-results.json
✅ All categories passed!
```

## Results File

Full results are saved to `eval-results.json` with:
- Detailed scores for each test case
- Category summaries
- Response text (first 500 chars)
- Any errors encountered

Example structure:
```json
{
  "timestamp": "2026-03-13T22:45:00.000Z",
  "apiEndpoint": "http://localhost:3000/api/chat",
  "summary": {
    "totalTests": 160,
    "overallAvgScore": 79.0,
    "overallPassRate": 86,
    "passCount": 137,
    "failCount": 23,
    "elapsedMs": 142300
  },
  "categories": [...],
  "details": [...]
}
```

## Scoring Logic

Each test response is scored on three dimensions:

### 1. Trait Score (50% weight)
- Checks if response contains expected astrological concepts
- Uses fuzzy matching to handle variations (e.g., "7th house" vs "seventh house")
- Score: `(traits_found / total_traits) * 100`

### 2. Forbidden Score (30% weight)
- Checks that response AVOIDS problematic language
- Penalizes generic, fear-based, or false guarantees
- Score: `((total_forbidden - forbidden_found) / total_forbidden) * 100`

### 3. Length Score (20% weight)
- Ensures responses are substantive (meet minimum character requirement)
- Binary: 100 if `response.length >= minLength`, 0 otherwise

### Overall Score
```
overall_score = (trait_score * 0.5) + (forbidden_score * 0.3) + (length_score * 0.2)
```

**Passing threshold**: 70+

## Key Traits by Category

### Career
Must include: "10th house", "dasha", "specific timing", "practical advice"

### Love
Must include: "7th house", "Venus", "specific guidance", "emotionally sensitive"

### Timing
Must include: "transit", "dasha", "timing window", "classical reference"

### Daily
Must include: "current transit", "practical", "positive framing"

### Unknown Birth Time
Must include: "acknowledges limitation", "moon sign", "still provides value"

### Source Citation
Must include: "BPHS/Saravali/Phaladeepika", "chapter/verse", "transliteration"

### Remedy
Must include: "specific remedy", "mantra or gem", "classical basis"

### Emotional Tone
Must include: "empathetic", "acknowledges emotion", "constructive", "non-fearful"

## Forbidden Language Patterns

All categories:
- ❌ "will definitely/definitely will" (false certainty)
- ❌ "generic/too generic/generic horoscope" (lacking specificity)
- ❌ "you will never/impossible" (doom predictions)

Category-specific forbidden patterns:
- Career: "fear-based", "generic advice"
- Love: "guaranteed match", "doom"
- Timing: "exact date guarantee"
- Daily: "newspaper style"
- Remedy: "expensive only", "fear-mongering"
- Emotional: "dismissive", "cold", "preachy"

## Interpreting Results

### Category Avg Score 80+
Strong performance. Response quality is high and consistent.

### Category Avg Score 70-79
Good performance with room for improvement. Check weakest cases.

### Category Avg Score 60-69
Needs work. Review responses for missing traits or forbidden content.

### Category Avg Score <60
Significant issues. Response likely too generic, too brief, or contains problematic language.

## Exit Codes

- **0**: Success - all categories passed (avg >= 70)
- **1**: Failure - one or more categories below 70%, or API error

## Development

### Adding New Test Cases

Edit `src/lib/eval/test-cases.ts`:

```typescript
{
  id: "category-01",
  category: "category-name",
  question: "Your question here?",
  birthData: { date: "1990-06-15", time: "14:30", place: "Mumbai, India" },
  expectedTraits: ["trait1", "trait2"],
  forbiddenTraits: ["bad1", "bad2"],
  minLength: 300,
}
```

### Customizing Scoring

Edit `src/lib/eval/runner.ts`:

```typescript
// Adjust weights (currently 50%, 30%, 20%)
const overallScore = traitScore * 0.6 + forbiddenScore * 0.25 + lengthScore * 0.15
```

## Common Issues

### API Connection Error
```
Error: API returned 500: Internal Server Error
```
- Ensure app is running on the endpoint
- Check `/api/chat` endpoint is accessible
- Review server logs for errors

### Timeout
```
Error: Fetch timeout
```
- Response is taking too long (>30s per request)
- Check API performance
- Reduce test count for debugging

### Low Pass Rate

Review:
1. Are responses using expected astrological terminology?
2. Are responses too generic/short?
3. Are responses making false guarantees?
4. Check `eval-results.json` for specific weaknesses

## Performance Targets

- **Trait Score**: 80%+ (most expected concepts present)
- **Forbidden Score**: 95%+ (very few problematic phrases)
- **Length Score**: 95%+ (responses substantive)
- **Overall Score**: 75%+ average across all tests

## Further Reading

- Brihat Parashara Hora Shastra (BPHS)
- Saravali - Kalyan Varma
- Phaladeepika - Mantreswar
- Classical astrology evaluation best practices

## Contact & Support

For questions about the eval suite, review `src/lib/eval/runner.ts` for scoring logic details.
