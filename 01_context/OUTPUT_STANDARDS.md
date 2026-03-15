# GrahAI — Output Standards

## Report Quality Standards
- **Uniqueness**: >60% of sentences must be chart-specific (not identical across different birth charts)
- **Data-first**: Every paragraph must lead with actual chart data (planet positions, house lords, dasha periods)
- **No filler**: Remove phrases like "Vedic astrology teaches..." or "The ancient wisdom suggests..."
- **Accuracy**: Planet positions within 2° of Swiss Ephemeris reference values
- **Generation time**: <3 seconds for any report type
- **Completeness**: Every section must have at least 3 data-driven sentences

## Code Standards
- **TypeScript strict**: `npx tsc --noEmit` must pass with zero errors before any commit
- **No `any` types**: Use proper typing from `src/lib/ephemeris/types.ts`
- **Null safety**: Always use optional chaining (`?.`) and fallbacks for planet lookups
- **Imports**: Use relative paths within the same module, absolute paths across modules

## API Standards
- **Auth**: All user-facing routes must validate Supabase session
- **Error handling**: Return structured JSON errors with appropriate HTTP status codes
- **Logging**: Include `[route-name]` prefix in all console.log statements
- **CORS**: Include OPTIONS handler for cross-origin requests

## UI Standards
- **Dark mode only**: Never use white/light backgrounds
- **Color tokens**: Use Tailwind classes (deep-space, navy, saffron, etc.), never raw hex
- **Typography**: Inter for Latin, Noto Sans Devanagari for Hindi
- **Animations**: Framer Motion, max 300ms transitions, no layout shift
- **Mobile-first**: All components must work at 320px width
- **Accessibility**: All interactive elements need aria labels

## Testing Standards
- **Report uniqueness**: Run `npx tsx test-uniqueness.ts` after any generator change
- **TypeScript**: Run `npx tsc --noEmit` before every commit
- **Eval suite**: Run `npx vitest` for regression testing
- **Manual**: Check at least one generated report visually after generator changes

## Session-End Checklist
After every work session:
1. ✅ Run `npx tsc --noEmit` — zero errors
2. ✅ Update `01_context/CURRENT_STATE.md`
3. ✅ Update `01_context/DECISIONS.md` if any decisions were made
4. ✅ Update `01_context/OPEN_QUESTIONS.md` if new questions arose
5. ✅ Write log entry in `04_logs/YYYY-MM-DD.md`
