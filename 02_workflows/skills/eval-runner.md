# Skill: eval-runner

## Trigger
Use this skill when running quality evaluations on report generators, testing report accuracy, or benchmarking output quality.

## Outcome
Evaluation results showing per-generator quality metrics: uniqueness %, accuracy, completeness.

## Dependencies
- `test-uniqueness.ts` — Sentence-level uniqueness comparison
- `src/lib/eval/run-eval.ts` — Evaluation runner
- `src/lib/eval/test-cases.ts` — Predefined test cases
- `src/lib/eval/runner.ts` — Test execution engine
- `eval-results.json` — Previous results for comparison

## Steps
1. **Run uniqueness test**: `npx tsx test-uniqueness.ts`
   - Target: <40% generic per generator
   - Uses 3 different mock charts (Aries/Libra/Capricorn ascendants)
2. **Run eval suite**: `npx vitest`
   - Checks report generation doesn't crash
   - Validates output structure matches GeneratedReport type
3. **Compare with baseline**: Check against previous `eval-results.json`
4. **Report findings**: Which generators improved, which regressed
5. **Update eval-results.json**: Save new results as baseline

## Interpreting Results
- **<20% generic**: Excellent — highly personalized
- **20-40% generic**: Good — structural template text is expected
- **40-60% generic**: Needs work — too much boilerplate
- **>60% generic**: Critical — rewrite needed

## After Evaluation
- If any generator >40% generic → create RRL session to improve it (see auto-research skill)
- If TypeScript errors found → fix immediately
- Update `01_context/CURRENT_STATE.md` with latest scores
