# GrahAI Eval Suite - Quick Start Guide

## Installation

The eval suite is built into the GrahAI project. No additional installation needed.

## Running Your First Eval

### Step 1: Start the App

```bash
npm run dev
# App runs on http://localhost:3000
```

### Step 2: Run the Eval Suite

In a new terminal:

```bash
npx tsx src/lib/eval/run-eval.ts
```

This will:
1. Run all 160 test cases against the `/api/chat` endpoint
2. Print a summary table with scores by category
3. Save detailed results to `eval-results.json`
4. Exit with code 0 (pass) or 1 (fail based on 70% threshold)

### Step 3: Review Results

Terminal output shows quick summary:
```
Category             | Avg Score  | Pass Rate  | Weakest Case
---------------------------------------------------------------------
✓ career             | 78.3       | 85%        | career-05 (62.1)
✓ love               | 81.5       | 90%        | love-08 (68.3)
...
```

Full results in `eval-results.json` include response text, detailed scores, and error info.

## Understanding Scores

### Example Result
```
✓ career | 78.3 | 85% | career-05 (62.1)
```

- **78.3**: Average score across 20 career tests (0-100)
- **85%**: 17 out of 20 tests scored 70+ (pass threshold)
- **career-05 (62.1)**: Weakest test with score of 62.1

### Interpreting Scores

- **80+**: Excellent response quality
- **70-79**: Good, some room for improvement
- **60-69**: Needs work, likely missing key traits or too brief
- **<60**: Poor, response lacks substantive astrological content

## Common Patterns

### High-Scoring Response (90+)

```
Career question about promotion...

Your 10th house Jupiter is approaching a favorable transit in 14 months.
Currently in Saturn's mahadasha (challenging period for career advancement).
Specific timing: Work toward skill development through early 2025;
Jupiter's movement suggests breakthrough potential mid-2026.

Practical advice: Build relationships and document achievements now.
Avoid major job moves during this dasha but position yourself well.
```

✅ Includes: 10th house, dasha, specific timing, practical advice
✅ Avoids: False certainty, generic advice, fear
✅ Length: 250+ characters

### Low-Scoring Response (50-60)

```
Your career looks interesting. Try to work hard and be patient.
Good things will come to those who wait. The stars support your ambitions.
```

❌ Missing: 10th house, dasha, timing analysis, specificity
❌ Contains: Generic advice, vague promises
❌ Length: Only 140 characters (need ~300)

## Test Categories Overview

| Category | Tests | Focus | Example |
|----------|-------|-------|---------|
| Career | 20 | Job, promotion, business | "Will I get promoted?" |
| Love | 20 | Relationships, marriage | "When will I find love?" |
| Timing | 20 | Best time for events | "When should I invest?" |
| Daily | 20 | Daily/weekly guidance | "What should I focus on today?" |
| Unknown Birth | 20 | Questions without exact birth time | Same but no birth time |
| Citations | 20 | Classical references | "What does BPHS say?" |
| Remedy | 20 | Mantras, gems, practices | "What remedy for Saturn?" |
| Emotional | 20 | Emotionally charged | "My marriage is failing..." |

## Customization

### Test Only One Category

Edit `src/lib/eval/run-eval.ts`:

```typescript
import { careerTestCases } from "./test-cases"
const results = await runEvalTests(careerTestCases, apiEndpoint)
```

### Use Different API Endpoint

```bash
npx tsx src/lib/eval/run-eval.ts --api-endpoint http://production.example.com/api/chat
```

### Adjust Scoring Weights

Edit `src/lib/eval/runner.ts`:

```typescript
// Change from 50%, 30%, 20% to emphasize traits more
const overallScore = traitScore * 0.6 + forbiddenScore * 0.25 + lengthScore * 0.15
```

## Troubleshooting

### "API returned 500"
The app crashed or endpoint isn't responding:
```bash
# Check app is running
curl http://localhost:3000/api/chat -X POST -d '{"message":"test","user_id":"test"}'

# Check API logs for errors
npm run dev 2>&1 | grep -i error
```

### "Pass rate 40%"
Responses are likely too generic or missing expected traits:
1. Review a few failing tests in `eval-results.json`
2. Check if `/api/chat` is using astrology system prompt
3. Verify Claude API key is configured
4. Look for errors in response logic

### "Timeout"
Individual responses are too slow:
1. Check network speed
2. Review Claude API latency
3. Consider running fewer tests
4. Check for tool execution bottlenecks

## Integration into CI/CD

### GitHub Actions Example

```yaml
name: Eval Tests

on: [push]

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm run dev &
      - run: sleep 5  # Wait for app startup
      - run: npx tsx src/lib/eval/run-eval.ts
        timeout-minutes: 20

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: eval-results
          path: eval-results.json
```

## Programmatic Usage

### Use in Custom Tests

```typescript
import { careerTestCases } from '@/lib/eval/test-cases'
import { runEvalTests, groupResultsByCategory } from '@/lib/eval/runner'

async function checkQuality() {
  const results = await runEvalTests(careerTestCases)
  const categories = groupResultsByCategory(results)

  for (const cat of categories) {
    if (cat.avgScore < 75) {
      console.warn(`Low score for ${cat.category}: ${cat.avgScore}`)
    }
  }
}
```

### Custom Test Case

```typescript
import type { EvalTestCase } from '@/lib/eval/test-cases'
import { scoreResponse } from '@/lib/eval/runner'

const myTest: EvalTestCase = {
  id: 'custom-01',
  category: 'career',
  question: 'My custom question?',
  birthData: { date: '1990-06-15', time: '14:30', place: 'Mumbai' },
  expectedTraits: ['10th house', 'dasha'],
  forbiddenTraits: ['generic'],
  minLength: 300,
}

const response = "Your response text..."
const scores = scoreResponse(myTest, response)
console.log(`Score: ${scores.overallScore.toFixed(1)}/100`)
```

## Performance Baseline

Running all 160 tests takes approximately:
- **~1-3 minutes** with fast API (sub-1s per response)
- **~5-10 minutes** with normal API (1-2s per response)
- **~15-20 minutes** with slow API (2-3s per response)

This is expected since each test involves an API call with SSE streaming.

## Advanced: Custom Scoring

Extend the runner for custom metrics:

```typescript
// src/lib/eval/custom-scoring.ts
import { EvalTestCase } from './test-cases'

export function customScore(testCase: EvalTestCase, response: string) {
  // Add metrics for:
  // - Vedic terminology density
  // - Mantra/gem recommendations
  // - Personal relevance
  // - Confidence appropriateness
  // etc.
}
```

## Support & Resources

- **Questions?** Review `EVAL_SUITE.md` for full documentation
- **Issues?** Check `eval-results.json` for specific failures
- **Customize?** Edit `src/lib/eval/test-cases.ts` for your needs

## Key Files

- `src/lib/eval/test-cases.ts` - 160 test cases
- `src/lib/eval/runner.ts` - Scoring & execution logic
- `src/lib/eval/run-eval.ts` - CLI entry point
- `EVAL_SUITE.md` - Full documentation

Good luck with your evals! 🚀
