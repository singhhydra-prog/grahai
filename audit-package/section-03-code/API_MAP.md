# API Route Map

## Auth
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/auth/otp` | POST | N/A | LIVE | Supabase phone OTP |

## Chat
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/chat` | POST | Required | LIVE | Claude Sonnet 4 streaming SSE. Requires ANTHROPIC_API_KEY |

## Reports
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/reports/generate` | POST | Mixed | LIVE | PDF kundli → Supabase storage |
| `/api/reports/generate-typed` | POST | Mixed | LIVE | AI-enhanced via Claude. 1,153 lines |
| `/api/reports/generate-code` | POST | Mixed | LIVE | Pure code generators, no AI dependency |

## Astrology
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/cosmic-snapshot` | POST | None | LIVE | Birth chart overview |
| `/api/ask-one-question` | POST | None | MOCKED | Intentional teaser — vague answers |
| `/api/daily-horoscope` | POST | None | LIVE | Real calculations |

## Payments
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/payment/create-order` | POST | None⚠️ | PARTIAL | No auth! Mock if env vars missing |
| `/api/payment/verify` | POST | Partial | LIVE | Real HMAC-SHA256 verification |

## Gamification
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/gamification/award-xp` | POST | Required | LIVE | Real XP tracking |
| `/api/gamification/stats` | GET | Required | LIVE | Stats + achievements |
| `/api/gamification/daily-challenge` | GET | Required | LIVE | Daily challenges |
| `/api/gamification/achievements` | GET | Required | LIVE | Achievement list |

## User
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/user/profile` | GET/POST | Required | LIVE | Supabase profiles table |
| `/api/user/history` | GET/POST | Required | LIVE | Q&A history |
| `/api/user/preferences` | GET/POST | Required | LIVE | Notification prefs |
| `/api/user/saved` | GET/POST | Required | LIVE | Saved items |

## Admin
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/admin/agents` | GET | Partial | LIVE | Agent list |
| `/api/admin/agents/seed` | POST | None⚠️ | LIVE | No auth — security risk |
| `/api/admin/dashboard` | GET | ADMIN_EMAIL | LIVE | Founder metrics |

## Other
| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/analytics` | POST | Optional | LIVE | 24 event types |
| `/api/contact` | POST | None | LIVE | Resend email (fallback: console) |
| `/api/push/subscribe` | POST | Required | LIVE | VAPID web push |
| `/api/cron/*` | GET | Bearer | LIVE | 4 scheduled jobs |
