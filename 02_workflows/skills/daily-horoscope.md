# Skill: daily-horoscope

## Trigger
Use this skill when working on daily, weekly, or monthly horoscope/insight generation, cron jobs, or the insight email system.

## Outcome
A functioning insight generator that produces personalized daily/weekly/monthly content based on user's chart data and current transits.

## Dependencies
- `src/lib/daily-insights/insight-generator.ts` — Core generator
- `src/lib/daily-insights/email-template.ts` — Email formatting
- `src/app/api/daily-horoscope/route.ts` — API endpoint
- `src/app/api/cron/daily-insights/route.ts` — Cron trigger
- `src/app/api/cron/daily-push/route.ts` — Push notification cron
- `src/lib/push/sender.ts` — Push notification delivery
- `src/lib/push/content-templates.ts` — Notification templates
- Supabase tables: user profiles with birth data

## Steps
1. **Read current generator** — Understand the insight-generator.ts structure
2. **Check transit engine** — Verify `src/lib/ephemeris/transit-engine.ts` produces current planetary positions
3. **Generate content** — Insights should reference user's natal chart + today's transits
4. **Personalize** — Each user's insight must differ based on their ascendant, Moon sign, and active dasha
5. **Test endpoint** — Hit /api/daily-horoscope with test birth data
6. **Verify cron** — Check that cron route iterates users and generates per-user

## Edge Cases
- **No birth time**: Fall back to Sun-sign-only horoscope
- **Cron timeout**: Vercel functions have 10s limit — batch users if many
- **Push permission denied**: Gracefully skip users without push tokens
- **Email bounce**: Don't retry failed emails, log and continue
