# Skill: auto-research (Karpathy RRL)

## Trigger
Use this skill when the user wants to systematically improve a specific metric through autonomous experimentation — report quality, performance, uniqueness scores, test pass rates, or any measurable outcome.

## Outcome
A measurable improvement in the target metric through a series of atomic, verified changes. Each change is committed if it improves the metric, reverted if it doesn't.

## Dependencies
- Target metric command (e.g., `npx tsx test-uniqueness.ts`, `npx tsc --noEmit`, `npx vitest`)
- Git for commit/revert
- The specific files being optimized

## The RRL Cycle
```
Hypothesize → Experiment → Measure → Iterate
```

## Steps
1. **Define the metric**:
   - Choose ONE mechanical metric (must be computable, not subjective)
   - Examples: "career-blueprint generic % must go below 30%", "tsc errors must be 0", "report generation time < 2s"
   - Record baseline measurement

2. **Hypothesize**:
   - Identify ONE specific change that should improve the metric
   - Write hypothesis in `04_logs/rrl-YYYY-MM-DD.md`: "Replacing static sentence X with data-driven sentence Y should reduce generic % by ~5%"

3. **Experiment**:
   - Make ONE atomic change (single file, single concept)
   - Keep changes small and reversible

4. **Measure**:
   - Run the metric command
   - Record result in the RRL log

5. **Decide**:
   - If metric improved or held steady → `git add . && git commit -m "RRL: [description]"`
   - If metric worsened → `git checkout -- .` (revert)

6. **Iterate**:
   - Return to step 2 with a new hypothesis
   - Continue until target is met or diminishing returns
   - Stop after 10 iterations per session (prevent runaway)

## Example RRL Session
```
Target: career-blueprint generic % < 30% (currently 39.5%)
Iteration 1: Replace static summary sentence → 37.2% ✓ commit
Iteration 2: Data-drive leadership section intro → 35.1% ✓ commit
Iteration 3: Add planet-specific career paths → 33.8% ✓ commit
Iteration 4: Remove template remedy text → 31.2% ✓ commit
Iteration 5: Rewrite integrated style paragraph → 29.8% ✓ commit ← TARGET MET
```

## Safety Rules
- Maximum 10 iterations per session
- Never change more than 1 file per iteration
- Always measure BEFORE deciding to keep/revert
- Log every iteration (even failures) in `04_logs/rrl-YYYY-MM-DD.md`
- If 3 consecutive iterations show no improvement → stop and reassess approach

## Applicable Metrics
| Metric | Command | Target |
|--------|---------|--------|
| Report uniqueness | `npx tsx test-uniqueness.ts` | <40% generic per generator |
| TypeScript errors | `npx tsc --noEmit 2>&1 \| grep error \| wc -l` | 0 |
| Report generation time | Custom timer in generate-code route | <2s |
| Test pass rate | `npx vitest --reporter=json` | 100% |
| Bundle size | `npm run build 2>&1 \| grep "First Load"` | <500KB per route |

---

## Weekly Improvement Loop (Formalized)

A structured operating cycle that runs weekly (or on-demand). Distinct from ad-hoc RRL above — this is a **governance-grade** improvement process.

### Phase 1: Diagnose (Read-Only)
1. Read `01_context/product/7_SUCCESS_METRICS.md` for current KPI targets
2. Run `qa-reviewer` skill to get fresh QA report
3. Read latest `04_logs/` session log for recent changes
4. Identify the **single biggest bottleneck** across 5 domains:
   - Product (page completeness, UX gaps)
   - Quality (report uniqueness, tsc errors, test failures)
   - Revenue (conversion rate, ARPU, refund rate)
   - Trust (legal page gaps, support resolution time)
   - Performance (bundle size, generation time, Lighthouse score)

### Phase 2: Prioritize
5. List top 3 improvement candidates
6. Score each on a 1-5 scale:
   - **Impact**: How much does this move a KPI?
   - **Effort**: How many files / how much time?
   - **Risk**: Could this break existing functionality?
7. Rank by `(Impact × 2) - Effort - Risk`
8. Write proposal in `04_logs/weekly-YYYY-MM-DD.md`

### Phase 3: Approval Gate
9. Present ranked proposals to user with:
   - What changes
   - Which files
   - Expected KPI movement
   - Rollback plan
10. **Do NOT proceed without explicit approval**

### Phase 4: Implement (RRL)
11. Execute approved fix using the RRL cycle above (atomic, measured, committed-or-reverted)
12. Maximum 10 iterations per fix
13. Run `qa-reviewer` after each fix to confirm no regressions

### Phase 5: Document
14. Run `memory-updater` skill
15. Update `01_context/CURRENT_STATE.md` with improvement results
16. Log in `04_logs/weekly-YYYY-MM-DD.md` with before/after metrics

### Safety
- One improvement cycle per week maximum (prevents churn)
- Never skip the approval gate
- If 2 consecutive weekly cycles show no KPI improvement → escalate to user for strategic re-evaluation
- All changes must pass `npx tsc --noEmit` before and after
