# Session-End Checklist

Run through this at the end of every work session:

- [ ] `npx tsc --noEmit` — zero errors
- [ ] All changes committed with descriptive messages
- [ ] Update `01_context/CURRENT_STATE.md` — what changed, what's working, what's broken
- [ ] Update `01_context/DECISIONS.md` — any new architectural decisions
- [ ] Update `01_context/OPEN_QUESTIONS.md` — any new questions that arose
- [ ] Write entry in `04_logs/YYYY-MM-DD.md`:
  ```
  # Session Log: YYYY-MM-DD
  ## What was done
  - [bullet list of changes]
  ## Metric changes
  - [before/after for any measured metrics]
  ## Next steps
  - [what should happen next session]
  ```
- [ ] If using RRL: log all iterations in `04_logs/rrl-YYYY-MM-DD.md`
