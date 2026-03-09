# GrahAI — Tools & API Reference

> Complete reference for all AI agent tools, API endpoints, and internal calculation functions.

---

## AI Agent Tools (17 Total)

All tools are registered in `src/lib/agents/tools/index.ts` and dispatched via `executeToolCall()`.

### Astrology Tools (7)

| Tool | Input | Output | Source |
|------|-------|--------|--------|
| `calculate_kundli` | `birth_date`, `birth_time`, `birth_city`, `latitude`, `longitude`, `timezone`, `name?` | Full natal chart: planets, houses, ascendant, nakshatras, dignities | `astrology-tools.ts` → `sweph-wrapper.generateNatalChart()` |
| `get_dasha_periods` | `birth_date`, `birth_time`, `latitude`, `longitude`, `timezone` | Vimshottari Dasha: Mahadasha → Antardasha → Pratyantar, current period highlighted | `dasha-engine.calculateFullDasha()` |
| `analyze_yogas` | `birth_date`, `birth_time`, `latitude`, `longitude`, `timezone` | Array of detected yogas (50+ types) with BPHS references, category, strength | `yogas.analyzeAllYogas()` |
| `get_divisional_chart` | `birth_date`, `birth_time`, `latitude`, `longitude`, `timezone`, `division` | D9 Navamsa or D10 Dasamsa chart with Vargottama detection | `divisional-charts.generateDivisionalChart()` |
| `get_transit_effects` | `birth_date`, `birth_time`, `latitude`, `longitude`, `timezone`, `transit_date?` | Current transits over natal positions, Saturn/Jupiter/Rahu-Ketu analysis | `transit-engine.ts` |
| `get_remedies` | `planet?`, `dosha?`, `issue?` | Gemstones, mantras, charities, rituals per planet/dosha from BPHS | `remedy-database.ts` |
| `generate_report` | `birth_date`, `birth_time`, `birth_city`, `latitude`, `longitude`, `timezone`, `name` | PDF report URL (Kundli chart + yogas + doshas + dashas + remedies) | `kundli-report-generator.ts` → `pdf-renderer.ts` |

### Numerology Tools (4)

| Tool | Input | Output |
|------|-------|--------|
| `calculate_life_path` | `birth_date` | Life path number, meaning, compatible numbers, lucky colors/days |
| `calculate_name_numbers` | `full_name` | Destiny number, soul urge number, personality number with Pythagorean reduction |
| `calculate_personal_year` | `birth_date`, `year?` | Personal year number for current/specified year with forecast |
| `save_numerology_profile` | `full_name`, `birth_date`, `user_id` | Saves computed profile to `numerology_profiles` table |

### Tarot Tools (3)

| Tool | Input | Output |
|------|-------|--------|
| `draw_tarot_cards` | `spread_type`, `question?` | Random card draw from 78-card RWS deck with orientation (upright/reversed) |
| `get_card_meaning` | `card_name`, `orientation?` | Full card meaning: keywords, description, element, zodiac association |
| `save_tarot_reading` | `user_id`, `spread_type`, `question`, `cards_drawn`, `interpretation` | Saves reading to `tarot_readings` table |

### Vastu Tools (3)

| Tool | Input | Output |
|------|-------|--------|
| `analyze_vastu` | `property_type`, `entrance_direction`, `rooms` | Directional scoring, element balance, overall Vastu score (0-100) |
| `get_vastu_remedies` | `direction?`, `issue?` | Remedies for directional imbalances, element corrections |
| `save_vastu_assessment` | `user_id`, `property_type`, `entrance_direction`, `rooms`, `score`, `assessment_data`, `remedies` | Saves to `vastu_assessments` table |

---

## API Endpoints

### Chat API
```
POST /api/chat
Content-Type: application/json
Response: text/event-stream (SSE)

Body: {
  message: string
  conversation_id?: string
  user_id?: string
}

SSE Events:
  meta         — { conversationId, vertical, agentName }
  text_delta   — { text: string }
  tool_start   — { toolName, toolInput }
  tool_result  — { toolName, result }
  message_stop — { usage: { input_tokens, output_tokens } }
  error        — { message: string }
```

### Ask One Question
```
POST /api/ask-one-question
Body: { question: string, vertical?: string }
Response: { answer: string, vertical: string }
```

### Cosmic Snapshot
```
GET /api/cosmic-snapshot
Response: { date, tithi, nakshatra, yoga, karana, vara, transits[], tip }
```

### Reports
```
POST /api/reports/generate
Body: { birth_date, birth_time, birth_city, latitude, longitude, timezone, name }
Response: { reportUrl: string } (PDF download URL)
```

### Payment
```
POST /api/payment/create-order
Body: { plan_id, amount, currency }
Response: { order_id, key_id, amount }

POST /api/payment/verify
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
Response: { verified: boolean }
```

### Gamification
```
POST /api/gamification/award-xp
Body: { user_id, vertical, message_count?, is_first_daily?, current_streak? }
Response: { xp_earned, total_xp, level, streak }

POST /api/gamification/complete-reading
Body: { user_id, vertical, conversation_id }

POST /api/gamification/rate-reading
Body: { user_id, conversation_id, rating: 1-5 }

GET /api/gamification/stats?user_id=...
Response: { xp, level, streak, achievements[], readings_count }
```

### Contact
```
POST /api/contact
Body: { name, email, subject, message }
```

### Cron
```
GET /api/cron/daily-insights
Header: Authorization: Bearer CRON_SECRET
Schedule: Daily (configured in vercel.json)
```

---

## Ephemeris Functions (Public API)

### sweph-wrapper.ts

```typescript
// Core calculations
dateToJulianDay(year, month, day, hour, minute, second?, timezoneOffset?) → number
birthDetailsToJD(birth: BirthDetails) → number
getAyanamsa(jd: number) → number  // Lahiri ayanamsa in degrees
tropicalToSidereal(tropicalLong: number, jd: number) → number

// Planet positions
getPlanetPosition(jd, planet, ascendantLong?) → PlanetData
getAllPlanetPositions(jd, ascendantLong?) → PlanetData[]  // 9 planets
getCurrentTransitPositions(date?) → PlanetData[]

// House cusps
getAscendantAndCusps(jd, latitude, longitude, houseSystem?) → { ascendant, cusps[], mc }

// Full chart
generateNatalChart(birth: BirthDetails, name?) → NatalChart

// Panchang helpers
getSunMoonAngle(jd) → number   // For Tithi
getSunMoonSum(jd) → number     // For Yoga

// Module status
isSwephAvailable() → boolean
```

### dasha-engine.ts

```typescript
calculateDashaBalance(moonLongitude) → { nakshatraLord, balanceYears, ... }
calculateFullDasha(chart: NatalChart) → DashaAnalysis
getDashaTimeline(analysis, startYear?, endYear?) → DashaPeriod[]
getCurrentDasha(analysis) → { mahadasha, antardasha, pratyantardasha }
formatDashaPeriod(period) → string
```

### yogas.ts

```typescript
analyzeAllYogas(chart: NatalChart) → YogaResult[]  // 50+ yogas
getActiveYogas(results) → YogaResult[]  // Only detected ones
// Yoga categories: raja, dhana, parivartana, dosha, special, pancha_mahapurusha
```

### doshas.ts

```typescript
analyzeAllDoshas(chart: NatalChart) → DoshaResult[]
getActiveDoshas(results) → DoshaResult[]
// Types: mangal_dosha, kaal_sarp_dosha, pitra_dosha, grahan_dosha
```

### panchang.ts

```typescript
calculatePanchang(date?: Date) → Panchang
// Returns: { tithi, vara, nakshatra, yoga, karana } with lords, deities, auspiciousness
```

### transit-engine.ts

```typescript
analyzeTransits(natalChart, date?) → TransitAnalysis
getSaturnTransit(natalChart, date?) → SaturnTransitResult  // Sade Sati detection
getJupiterTransit(natalChart, date?) → JupiterTransitResult
```

### divisional-charts.ts

```typescript
generateDivisionalChart(chart, division: 9|10) → DivisionalChart
getVargottamaPlanets(rashi: NatalChart, navamsa: DivisionalChart) → PlanetName[]
```

---

## Key Type Definitions

```typescript
interface BirthDetails {
  date: string       // "YYYY-MM-DD"
  time: string       // "HH:MM:SS"
  place: string      // City name
  latitude: number
  longitude: number
  timezone: number   // Offset in hours (IST = 5.5)
}

interface PlanetData {
  name: PlanetName
  sanskrit: string
  longitude: number  // Sidereal 0–360
  latitude: number
  speed: number
  retrograde: boolean
  sign: SignInfo
  degree: number     // Degree within sign (0–30)
  nakshatra: NakshatraInfo
  house: number      // 1–12
  dignity: "exalted" | "debilitated" | "own" | "mool_trikona" | "friendly" | "neutral" | "enemy" | null
  isExalted: boolean
  isDebilitated: boolean
  isCombust: boolean
  combustDistance?: number
}

interface NatalChart {
  name?: string
  birthDate: Date
  birthTime: string
  birthPlace: string
  latitude: number
  longitude: number
  timezone: number
  julianDay: number
  ayanamsa: number
  ascendant: number
  ascendantSign: SignInfo
  planets: PlanetData[]
  houses: HouseData[]
  moonSign: SignInfo
  sunSign: SignInfo
  lagna: SignInfo
  nakshatraLord: PlanetName
}
```

---

## Internal Utilities

| File | Purpose |
|------|---------|
| `src/lib/brand.ts` | zodiacSigns[], brand constants, color tokens |
| `src/lib/geo-pricing.ts` | Regional price adaptation based on IP geolocation |
| `src/lib/ethics-guardrails.ts` | Content safety filter (hard blocks + soft transforms) |
| `src/lib/astrology-data/bphs-references.ts` | Classical text citations for yogas, doshas, houses, planets |
| `src/lib/astrology-data/remedy-database.ts` | 1,205 lines of remedies per planet/dosha with gemstones, mantras, charities |
| `src/lib/astrology-data/vedic-stories.ts` | 548 lines of mythological narratives for AI responses |
