---
description: "Work with GrahAI's astronomical calculation engine — Swiss Ephemeris, Vedic chart calculations, Dasha, Yoga, Dosha, Panchang, Transit analysis"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
---

# GrahAI Ephemeris Engine Skill

## Overview

The ephemeris engine is a 3,324-line TypeScript library in `src/lib/ephemeris/` that wraps the Swiss Ephemeris for Vedic (sidereal) astronomical calculations. It powers all astrology features: birth charts, dashas, yogas, doshas, transits, divisional charts, and panchang.

## Architecture

```
src/lib/ephemeris/
├── types.ts              # 348 lines — all shared interfaces
├── constants.ts          # 403 lines — zodiac data, nakshatras, dignities, aspects
├── sweph-wrapper.ts      # 365 lines — Swiss Ephemeris C bridge
├── dasha-engine.ts       # 378 lines — Vimshottari Dasha (BPHS Ch.46)
├── yogas.ts              # 478 lines — 50+ yoga detection
├── doshas.ts             # 374 lines — Mangal/Kaal Sarp/Pitra/Grahan doshas
├── panchang.ts           # 398 lines — 5-limb Vedic calendar
├── transit-engine.ts     # 365 lines — transit analysis
└── divisional-charts.ts  # 215 lines — D9 Navamsa, D10 Dasamsa

Supporting data:
src/lib/astrology-data/
├── bphs-references.ts    # 205 lines — classical text citations
├── remedy-database.ts    # 1,205 lines — remedies per planet/dosha
└── vedic-stories.ts      # 548 lines — mythological narratives
```

## Critical: sweph Native Module Handling

The `sweph` npm package is a native C++ addon. It CANNOT compile on Vercel serverless.

### Rules (NEVER violate these):

1. sweph must be in `optionalDependencies` in package.json
2. `.npmrc` must contain `optional=true`
3. `next.config.ts` must include `serverExternalPackages: ["sweph"]`
4. Always use **indirect require** to prevent Webpack static analysis:
   ```typescript
   // CORRECT
   const moduleName = "sweph"
   sweph = require(moduleName)

   // WRONG — breaks Vercel build
   import sweph from "sweph"
   const sweph = require("sweph")
   ```
5. Always wrap in try/catch — `sweph` may be null at runtime
6. `isSwephAvailable()` checks if native module loaded

## Calculation Pipeline

```
BirthDetails { date, time, place, lat, lng, timezone }
  → birthDetailsToJD()
    → Julian Day Number (UT)
  → getAyanamsa(jd)
    → Lahiri Ayanamsa (~24.2° for current epoch)
  → sweph.calc_ut(jd, planet, flags)
    → Tropical Longitude (0-360°)
  → tropicalToSidereal(tropical, jd)
    → Sidereal Longitude = Tropical - Ayanamsa
  → getSignFromLongitude(sidereal)
    → Sign (0-11: Aries-Pisces)
  → getDegreeInSign(sidereal)
    → Degree within sign (0-30°)
  → getNakshatraFromLongitude(sidereal)
    → Nakshatra (0-26), pada (1-4), lord
  → getPlanetDignity(planet, sign, degree)
    → exalted | debilitated | own | mool_trikona | friendly | neutral | enemy
```

## Key Functions

### sweph-wrapper.ts (Primary API)

```typescript
// Julian Day conversion
dateToJulianDay(year, month, day, hour, minute, second?, timezoneOffset?) → number
birthDetailsToJD(birth: BirthDetails) → number

// Ayanamsa
getAyanamsa(jd: number) → number          // Lahiri, ~24.2° current epoch
tropicalToSidereal(tropical, jd) → number  // Subtract ayanamsa

// Planet positions
getPlanetPosition(jd, planet, ascendantLong?) → PlanetData
getAllPlanetPositions(jd, ascendantLong?) → PlanetData[]  // 9 planets
getCurrentTransitPositions(date?) → PlanetData[]

// House cusps
getAscendantAndCusps(jd, lat, lng, houseSystem?) → { ascendant, cusps[], mc }

// Full chart generation
generateNatalChart(birth: BirthDetails, name?) → NatalChart

// Panchang helpers
getSunMoonAngle(jd) → number  // For Tithi
getSunMoonSum(jd) → number    // For Yoga

// Module status
isSwephAvailable() → boolean
```

### dasha-engine.ts (Vimshottari Dasha)

Based on BPHS Chapter 46. 120-year cycle governed by Moon's nakshatra at birth.

```typescript
calculateDashaBalance(moonLongitude) → { nakshatraLord, balanceYears, ... }
calculateFullDasha(chart: NatalChart) → DashaAnalysis
getDashaTimeline(analysis, startYear?, endYear?) → DashaPeriod[]
getCurrentDasha(analysis) → { mahadasha, antardasha, pratyantardasha }
```

Dasha order: Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury
Total: 120 years (7+20+6+10+7+18+16+19+17)

### yogas.ts (50+ Yoga Detection)

Based on BPHS, Saravali, Phaladeepika.

```typescript
analyzeAllYogas(chart: NatalChart) → YogaResult[]
getActiveYogas(results) → YogaResult[]
```

Yoga categories: `raja`, `dhana`, `parivartana`, `dosha`, `special`, `pancha_mahapurusha`

Key yogas detected: Gaja Kesari, Budhaditya, Chandra Mangala, Neechabhanga Raja, Pancha Mahapurusha (Hamsa/Malavya/Ruchaka/Bhadra/Shasha), Parivartana, Viparita Raja, and more.

### doshas.ts (Dosha Analysis)

```typescript
analyzeAllDoshas(chart: NatalChart) → DoshaResult[]
getActiveDoshas(results) → DoshaResult[]
```

Types: `mangal_dosha`, `kaal_sarp_dosha`, `pitra_dosha`, `grahan_dosha`
Each includes: type, severity (low/medium/high), affected houses, cancellation conditions, remedies.

### panchang.ts (Vedic Calendar)

Based on Surya Siddhanta and BPHS Chapter 3.

```typescript
calculatePanchang(date?) → Panchang
```

Five limbs:
1. **Tithi** — Lunar day (30 per month, Moon-Sun angle / 12°)
2. **Vara** — Weekday (7 days, each ruled by a planet)
3. **Nakshatra** — Lunar mansion (27 nakshatras)
4. **Yoga** — Sun+Moon sum / 13.333° (27 yogas)
5. **Karana** — Half-tithi (11 types rotating in 60 per month)

### transit-engine.ts

```typescript
analyzeTransits(natalChart, date?) → TransitAnalysis
getSaturnTransit(natalChart, date?) → SaturnTransitResult  // Sade Sati detection
getJupiterTransit(natalChart, date?) → JupiterTransitResult
```

### divisional-charts.ts

```typescript
generateDivisionalChart(chart, division: 9|10) → DivisionalChart
getVargottamaPlanets(rashi, navamsa) → PlanetName[]
```

D9 Navamsa: Primary for marriage/dharma analysis
D10 Dasamsa: Primary for career analysis

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Ayanamsa | Lahiri (Chitrapaksha) | Indian government standard |
| House system | Whole Sign ("W") | Traditional Vedic, BPHS-based |
| Node type | True Node (SE_TRUE_NODE) | More astronomically accurate |
| Ephemeris mode | Moshier (internal) | No file dependencies, ~0.1 arcsec accuracy |
| Ketu calculation | Rahu + 180° | Standard Vedic convention |
| Combustion | Planet-specific orbs from BPHS | Moon 12°, Mars 17°, Mercury 14°/12°, Jupiter 11°, Venus 10°/8°, Saturn 15° |

## Key Types

```typescript
type PlanetName = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu"
type ZodiacSign = "Aries" | "Taurus" | ... | "Pisces"
type Dignity = "exalted" | "debilitated" | "own" | "mool_trikona" | "friendly" | "neutral" | "enemy" | null

interface BirthDetails {
  date: string       // "YYYY-MM-DD"
  time: string       // "HH:MM:SS"
  place: string
  latitude: number
  longitude: number
  timezone: number   // Offset hours (IST = 5.5)
}

interface PlanetData {
  name: PlanetName
  sanskrit: string
  longitude: number  // Sidereal 0-360°
  retrograde: boolean
  sign: SignInfo
  degree: number     // 0-30° within sign
  nakshatra: NakshatraInfo
  house: number      // 1-12
  dignity: Dignity
  isCombust: boolean
}
```

## Common Operations

### Generate a natal chart
```typescript
import { generateNatalChart } from "@/lib/ephemeris/sweph-wrapper"
const chart = generateNatalChart({
  date: "1995-03-15",
  time: "10:30:00",
  place: "Mumbai",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: 5.5
}, "Harendra")
```

### Get current panchang
```typescript
import { calculatePanchang } from "@/lib/ephemeris/panchang"
const panchang = calculatePanchang() // defaults to now
```

### Check if sweph is available
```typescript
import { isSwephAvailable } from "@/lib/ephemeris/sweph-wrapper"
if (!isSwephAvailable()) {
  // Use pre-computed data or client-side approximations
}
```

## Testing

Test any ephemeris function with known reference charts:
- Verify planet positions against established Jyotish software (Jagannatha Hora, etc.)
- Ayanamsa should be ~24.2° for 2025 epoch
- Aries starts at sidereal 0°, Taurus at 30°, etc.
- Ketu is always exactly 180° from Rahu
