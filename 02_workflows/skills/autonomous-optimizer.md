# Skill: Autonomous Optimizer

## Trigger
Weekly improvement cycle (every Friday end-of-week, or on-demand). This skill is the **execution entry point** for the 5-phase weekly improvement loop defined in `auto-research.md`.

**Cowork execution:** Run this skill once per week. Output goes to `04_logs/weekly-YYYY-MM-DD.md`.
To automate: configure a Cowork scheduled task that invokes this skill every Friday.

## Outcome
Prioritized fix list (3–5 items) with impact/effort/risk scoring, implementation plan, and approval gate before execution.

## Context Files
Read first:
- `01_context/product/7_SUCCESS_METRICS.md` — Weekly KPIs, conversion rates, LTV, churn
- `02_workflows/skills/qa-reviewer.md` (Run this first) — Outstanding QA issues
- `01_context/CURRENT_STATE.md` — Known blockers
- `04_logs/weekly-YYYY-MM-DD.md` — Previous weekly improvement logs

## Steps
1. **Identify bottlenecks** from SUCCESS_METRICS.md:
   - Lowest conversion step (e.g., 40% drop-off at checkout)
   - Slowest path (e.g., chart computation takes 8 seconds)
   - Highest churn (e.g., 30% cancel after 7 days)
   - Weakest segment performance (e.g., tier-2 city users have 50% lower LTV)
2. **Run QA review**: Execute qa-reviewer.md to surface critical issues
3. **Extract top 3 bottlenecks**: Rank by estimated revenue/user impact
4. **Score each bottleneck** (1–5 scale):
   - **Impact**: How much will fixing this improve metrics? (revenue, conversion, churn, speed)
   - **Effort**: Engineering days to fix (1 = quick fix, 5 = redesign)
   - **Risk**: Chance of breaking something else (1 = none, 5 = high)
   - **Combined score**: (Impact × 3 + Risk × -1) / Effort (higher = fix first)
5. **Propose atomic fixes**:
   - Each fix must be completable in 1–2 days
   - Must have measurable success metric (e.g., "Reduce cart abandonment from 60% to 50%")
   - Must not break other features
6. **Plan A/B test** (if applicable):
   - Which users see the fix? (% of traffic, segment, region)
   - How long to measure? (# of conversions, days)
   - What's the success threshold? (e.g., 5% improvement in conversion)
7. **Output improvement plan**:
   - Bottleneck, why it matters, current metric, target metric
   - Proposed fix, effort estimate, risk assessment
   - A/B test plan and success metric
   - Approval gate: Ask user to confirm fix before implementation
8. **APPROVAL GATE**: Require explicit user confirmation before proceeding to fix
9. **Implement fix**: Code the change, test locally
10. **Run QA**: Execute qa-reviewer.md on the fixed code
11. **Deploy**: Roll out fix (A/B if planned, else 100%)
12. **Monitor**: Check SUCCESS_METRICS.md after 48 hours for improvement
13. **Update memory**: Record fix, result, and next priorities in CURRENT_STATE.md
14. **Iterate**: Go back to step 3 for next bottleneck (max 10 iterations per cycle)

## Quality Gates
- Each bottleneck must be tied to a specific metric in SUCCESS_METRICS.md
- Proposed fix must be atomic (completable in 1–2 days)
- A/B test plan must include specific success criteria (not "see if users like it")
- No fix shipped without explicit user approval
- QA must pass after every fix before moving to next bottleneck
- Every fix must be logged in CURRENT_STATE.md with result

## Safety Limits
- **Max 10 fixes per weekly cycle**: Prevents over-optimization
- **Rollback plan**: If any metric regresses >2% after fix, revert immediately
- **Approval gate required**: Never ship without user confirmation
- **Monitor before next fix**: Wait 48 hours after deployment before optimizing next item

## Edge Cases
- **Conflicting metrics**: If fix improves conversion but increases CAC, document trade-off and ask user to choose priority
- **User segment variance**: If fix helps tier-2 cities but hurts tier-1, test only on tier-2 first
- **External dependency**: If bottleneck is Razorpay API latency, document as external and propose workaround (caching, timeout handling)
- **No measurable improvement**: If fix ships but metric doesn't budge, investigate why (possibly wrong root cause; don't iterate blindly)
