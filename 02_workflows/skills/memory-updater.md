# Skill: Memory Updater

## Trigger
Run at the end of each work session to ensure all learning is captured across ALL workspace memory files.

## Outcome
All project memory files updated, session log written, CLAUDE.md kept in sync, product files refreshed. Nothing learned in this session is lost.

## Context Files
Update these (read each first to understand current state):
- `01_context/CURRENT_STATE.md` — What we're working on, blockers, next steps
- `01_context/DECISIONS.md` — Decisions made, rationale, trade-offs
- `01_context/OPEN_QUESTIONS.md` — Unresolved questions, assumptions to test
- `CLAUDE.md` — Project brain (skill taxonomy, reference files, codebase map)
- `04_logs/YYYY-MM-DD.md` — Session log (dated entry of work completed)
- `04_logs/weekly-YYYY-MM-DD.md` — Weekly improvement log (if weekly cycle session)

## Steps

### Core Memory (every session)
1. **Review session work**: What was accomplished? What was attempted but incomplete?
2. **Update CURRENT_STATE.md**:
   - Current focus (e.g., "Implementing refund API endpoint")
   - Current blockers (e.g., "Awaiting Razorpay webhook docs")
   - Next 3 priorities for tomorrow
   - Updated timeline/milestones if changed
3. **Update DECISIONS.md**:
   - Any decisions made this session (e.g., "Use React Query for chart caching")
   - Document rationale (why this decision? what was the alternative?)
   - Note any trade-offs (e.g., "Faster load times, but harder to invalidate cache")
4. **Update OPEN_QUESTIONS.md**:
   - New questions discovered (e.g., "Does Razorpay support recurring webhooks?")
   - Questions answered (remove from "open" list, add to DECISIONS.md with answer)
   - Assumptions we're making (e.g., "Assuming chart computation takes <5 seconds")
5. **Write session log** (`04_logs/YYYY-MM-DD.md`):
   - Date, start/end time
   - Work completed (bulleted list)
   - Blockers encountered
   - Files modified (git commit hashes if available)
   - Next session priorities

### CLAUDE.md Sync (if structural changes made)
6. **Update CLAUDE.md**:
   - Add/remove entries in Skill Taxonomy if skills were created/deleted
   - Update Skill Map if new routes/features were added
   - Update Reference Files table if new governing files were created
   - Update Codebase Architecture tree if new directories/modules added
   - Keep "What NOT To Do" list current with new learnings
   - Update Business OS domain tables if new files or skills assigned

### Product Memory (if product-facing changes made)
7. **Update product operating files**:
   - `01_context/product/1_APP_MAP.md` — new routes, removed routes, status changes
   - `01_context/product/2_PAGE_INVENTORY.md` — new pages, state coverage, audit status
   - `01_context/product/3_USER_FLOWS.md` — modified user journeys
   - `01_context/product/7_SUCCESS_METRICS.md` — new metric baselines, KPI status changes

### Weekly Cycle (if this is a weekly improvement session)
8. **Write weekly log** (`04_logs/weekly-YYYY-MM-DD.md`):
   - Bottleneck identified + domain
   - Top 3 candidates scored (impact/effort/risk)
   - What was approved and implemented
   - Before/after metrics
   - Cross-reference to SUCCESS_METRICS.md KPIs

### Validation
9. **Validate cross-references**:
   - If CURRENT_STATE.md references a decision, confirm it's in DECISIONS.md
   - If mentioning a file path, verify it exists
   - Check for dangling references
10. **Check for memory gaps**: Is there a feature/decision/blocker mentioned in code/commits that's not in memory files? Add it.
11. **Commit memory updates**: Describe what changed (e.g., "Update state after pricing tier redesign decision")

## Quality Gates
- All file paths referenced must exist in codebase (spot-check 3-5)
- DECISIONS.md entries must include rationale (not just what was decided)
- CURRENT_STATE.md must have at least 3 specific next steps, not vague goals
- Session log must include at least 5 items under "Work completed"
- No orphaned references (e.g., mentioning a file that doesn't exist)
- CLAUDE.md must reflect any new skills, routes, or files created this session

## Edge Cases
- **Session incomplete**: Document partial progress (e.g., "50% through refund API; hit blocker on webhooks")
- **Major blocker discovered**: Add to OPEN_QUESTIONS.md with context
- **Decision reversed**: Update DECISIONS.md with old decision, rationale, and new decision (keep history)
- **New context file needed**: If you discover memory is missing, flag it in OPEN_QUESTIONS.md
- **Multiple files in same domain changed**: Batch updates to product files, don't update one-by-one
