# Skill: QA Reviewer

## Trigger
Before shipping any feature or fixing a reported bug; also useful as a weekly quality check.

## Outcome
QA report (markdown) with severity ratings (critical, high, medium, low) and a pass/fail recommendation.

## Context Files
Read first:
- `01_context/product/2_PAGE_INVENTORY.md` - All routes and their status
- `/sessions/great-funny-brahmagupta/mnt/AstraAI/grahai/01_context/CURRENT_STATE.md` - What feature is being QA'd
- Git log (last 5 commits to understand what changed)

## Steps
1. **TypeScript check**: Run `tsc --noEmit` on the entire project
   - Flag any type errors (critical if in shipping code)
   - Note unused variables or imports
2. **Check report uniqueness**: If auditing a page or feature report:
   - Verify no two reports make contradictory claims
   - Flag if a report references the same issue multiple times
3. **Audit PAGE_INVENTORY.md**:
   - Are all routes listed?
   - Is the status accurate (draft, in-progress, shipped)?
   - Are all new pages added to inventory before QA?
4. **Validate API routes** (`app/api/**`):
   - Do all endpoints return proper error shapes (code, message, details)?
   - Check 404 (route not found), 400 (bad input), 401 (auth required), 500 (server error)
   - Verify Razorpay endpoints handle failed payment scenarios
5. **Check auth guards**:
   - Does `/dashboard`, `/profile`, `/account` require `user` context?
   - Does `/login` redirect to `/dashboard` if already logged in?
   - Are public pages (`, /pricing`, `/about`) accessible without auth?
6. **Review recent commits**:
   - Read commit messages (last 5); do they align with CURRENT_STATE.md?
   - Spot-check: Did any commit break existing functionality? (Test integration points)
   - Flag if any commit removes logging or error handling
7. **Spot-check feature flow**:
   - Walk through the happy path (e.g., sign up → enter birth details → compute chart → view result)
   - Test error scenarios (wrong date format, missing field, API failure)
   - Test mobile (375px) and desktop (1024px) layouts
8. **Performance check**:
   - Is chart computation cached? (Check for redundant API calls)
   - Are API responses paginated if lists >20 items?
9. **Output QA report**:
   - TypeScript status (pass/fail with count of errors)
   - API error handling (pass/fail with examples)
   - Auth guards (pass/fail with checked routes)
   - Page inventory alignment (pass/fail with orphaned pages)
   - Feature flow (pass/fail with broken steps)
   - Critical/high/medium/low severity issues
   - Recommendation: Ship / Ship with cautions / Do not ship

## Quality Gates
- TypeScript must have zero errors in shipping code (warnings OK)
- All API endpoints must handle at least 3 error scenarios (bad input, auth, server error)
- Every page with a form must have both success and error states tested
- Report must cite line numbers and file paths for every issue

## Edge Cases
- **Payment flow**: Test both successful payment (Razorpay webhook received) and failed payment (timeout, user cancels)
- **Chart computation**: Verify caching prevents duplicate computations for same birth details within session
- **User deletion**: Ensure deleting user removes their data from Supabase and any cached computations
- **Offline behavior**: If feature claims offline support, test with DevTools network throttling
