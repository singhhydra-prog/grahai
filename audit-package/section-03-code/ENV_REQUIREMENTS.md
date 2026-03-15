# Environment Variables

## Required (App Breaks Without These)

| Variable | Purpose | Impact if Missing |
|----------|---------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | All DB operations fail |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | All DB operations fail |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase access | Falls back to anon key (reduced permissions) |
| `ANTHROPIC_API_KEY` | Claude API for chat + AI reports | Chat returns 503, AI reports fail |

## Conditional (Feature Degrades Gracefully)

| Variable | Purpose | Impact if Missing |
|----------|---------|-------------------|
| `RAZORPAY_KEY_ID` | Payment processing | Payments enter test mode |
| `RAZORPAY_KEY_SECRET` | Payment verification | /verify returns 503 |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay SDK | Checkout modal won't open |
| `RESEND_API_KEY` | Transactional emails | Emails fall back to console.log |
| `CRON_SECRET` | Cron job auth | Falls back to Vercel header auth |

## Optional

| Variable | Purpose | Impact if Missing |
|----------|---------|-------------------|
| `ADMIN_EMAILS` | Admin dashboard access control | Defaults to singhhydra@gmail.com |
| `VAPID_PUBLIC_KEY` | Web push notifications | Push notifications disabled |
| `VAPID_PRIVATE_KEY` | Web push signing | Push notifications disabled |
| `NEXT_PUBLIC_VAPID_KEY` | Client-side push subscription | Push notifications disabled |

## Not Yet Implemented

| Variable | Purpose | Status |
|----------|---------|--------|
| `GA_MEASUREMENT_ID` | Google Analytics 4 | NOT IMPLEMENTED — no GA4 in codebase |
| `SENTRY_DSN` | Error tracking | NOT IMPLEMENTED |

**Note:** All actual values are redacted. See `.env.example` in repo root for template.
