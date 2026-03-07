/* ════════════════════════════════════════════════════════
   GrahAI — Vedic Astrology Type Definitions
   Shared interfaces for the entire calculation engine
   ════════════════════════════════════════════════════════ */

// ─── Zodiac Signs ──────────────────────────────────────
export type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces"

export interface SignInfo {
  name: ZodiacSign
  index: number          // 0-11
  sanskrit: string       // Mesha, Vrishabha, etc.
  lord: PlanetName
  element: "Fire" | "Earth" | "Air" | "Water"
  quality: "Cardinal" | "Fixed" | "Mutable"
  gender: "Male" | "Female"
}

// ─── Planets ───────────────────────────────────────────
export type PlanetName =
  | "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter"
  | "Venus" | "Saturn" | "Rahu" | "Ketu"

export type GrahaName =
  | "Surya" | "Chandra" | "Mangal" | "Budha" | "Guru"
  | "Shukra" | "Shani" | "Rahu" | "Ketu"

export type Dignity =
  | "exalted" | "moolatrikona" | "own" | "friendly"
  | "neutral" | "enemy" | "debilitated"

export interface PlanetData {
  name: PlanetName
  sanskrit: GrahaName
  longitude: number           // sidereal, 0-360
  latitude: number
  speed: number               // deg/day
  retrograde: boolean
  sign: SignInfo
  degree: number              // 0-30 within sign
  nakshatra: NakshatraInfo
  house: number               // 1-12
  dignity: Dignity
  isExalted: boolean
  isDebilitated: boolean
  isCombust: boolean          // too close to Sun
  combustDistance?: number
}

// ─── Nakshatras ────────────────────────────────────────
export interface NakshatraInfo {
  index: number               // 0-26
  name: string                // Ashwini, Bharani, etc.
  sanskrit: string
  lord: PlanetName            // Vimshottari lord
  deity: string               // Presiding deity
  pada: number                // 1-4
  startDegree: number         // absolute sidereal degree
  symbol: string
  shakti: string              // power/energy
  animal: string              // yoni animal
  gana: "Deva" | "Manushya" | "Rakshasa"
  guna: "Sattva" | "Rajas" | "Tamas"
}

// ─── Houses ────────────────────────────────────────────
export interface HouseData {
  number: number              // 1-12
  sign: SignInfo
  degree: number              // cusp degree (sidereal)
  lord: PlanetName
  planets: PlanetName[]       // planets in this house
  significances: string[]     // what this house governs
}

// ─── Natal Chart ───────────────────────────────────────
export interface NatalChart {
  // Birth details
  name?: string
  birthDate: Date
  birthTime: string           // "HH:MM:SS"
  birthPlace: string
  latitude: number
  longitude: number
  timezone: number            // offset in hours
  julianDay: number

  // Calculations
  ayanamsa: number            // Lahiri ayanamsa value used
  ascendant: number           // sidereal degree of Lagna
  ascendantSign: SignInfo
  planets: PlanetData[]       // all 9 planets
  houses: HouseData[]         // 12 houses

  // Derived data
  moonSign: SignInfo          // Rashi (Moon sign)
  sunSign: SignInfo           // Sun sign
  lagna: SignInfo             // Ascendant sign (same as ascendantSign)
  nakshatraLord: PlanetName   // Moon's nakshatra lord (for Dasha)
}

// ─── Divisional Charts ─────────────────────────────────
export type DivisionalChartType =
  | "D1"   // Rashi (natal)
  | "D2"   // Hora (wealth)
  | "D3"   // Drekkana (siblings/courage)
  | "D4"   // Chaturthamsa (fortune/property)
  | "D7"   // Saptamsha (children)
  | "D9"   // Navamsa (marriage/dharma)
  | "D10"  // Dasamsa (career)
  | "D12"  // Dwadasamsa (parents)
  | "D16"  // Shodasamsa (vehicles/happiness)
  | "D20"  // Vimsamsa (spiritual)
  | "D24"  // Chaturvimsamsa (education)
  | "D27"  // Saptavimsamsa (strength)
  | "D30"  // Trimshamsa (misfortune/arishta)
  | "D40"  // Khavedamsa (auspicious/inauspicious)
  | "D45"  // Akshavedamsa (general well-being)
  | "D60"  // Shashtiamsa (past karma)

export interface DivisionalChart {
  type: DivisionalChartType
  name: string
  sanskrit: string
  purpose: string
  planets: Array<{
    name: PlanetName
    longitude: number       // divisional longitude
    sign: SignInfo
    degree: number
    house: number
  }>
  ascendant: number
  ascendantSign: SignInfo
}

// ─── Dasha System ──────────────────────────────────────
export interface DashaPeriod {
  planet: PlanetName
  sanskrit: GrahaName
  startDate: Date
  endDate: Date
  durationYears: number
  isActive: boolean
  level: "mahadasha" | "antardasha" | "pratyantardasha"
  subPeriods?: DashaPeriod[]
}

export interface DashaAnalysis {
  system: "Vimshottari"
  totalYears: 120
  birthNakshatra: NakshatraInfo
  moonDegreeInNakshatra: number    // 0-13.333
  balanceAtBirth: number           // years remaining of first Mahadasha
  mahadashas: DashaPeriod[]
  currentMahadasha: DashaPeriod
  currentAntardasha: DashaPeriod
  currentPratyantar: DashaPeriod
}

// ─── Yogas ─────────────────────────────────────────────
export type YogaCategory =
  | "Raj Yoga" | "Dhan Yoga" | "Vipreet Raj Yoga"
  | "Panch Mahapurush" | "Solar Yoga" | "Lunar Yoga"
  | "Nabhas Yoga" | "Nabhasa Yoga" | "Parivartana Yoga"
  | "Neecha Bhanga" | "Other Auspicious" | "Inauspicious"

export interface YogaResult {
  name: string
  sanskrit: string
  category: YogaCategory
  isPresent: boolean
  strength: "strong" | "moderate" | "weak"
  involvedPlanets: PlanetName[]
  involvedHouses: number[]
  description: string
  effects: string
  classicalReference: ClassicalReference
}

// ─── Doshas ────────────────────────────────────────────
export type DoshaType =
  | "Mangal Dosha" | "Kaal Sarp Dosha" | "Pitra Dosha"
  | "Sade Sati" | "Chandal Yoga" | "Grahan Yoga"
  | "Kemdrum Yoga" | "Shakat Yoga"

export interface DoshaResult {
  type: DoshaType
  isPresent: boolean
  severity: "high" | "medium" | "low" | "none"
  subType?: string             // e.g., Kaal Sarp type
  involvedPlanets: PlanetName[]
  involvedHouses: number[]
  description: string
  effects: string
  cancellations: string[]      // conditions that reduce effect
  classicalReference: ClassicalReference
  remedies: string[]           // brief remedy pointers
}

// ─── Classical References ──────────────────────────────
export interface ClassicalReference {
  source: "BPHS" | "Saravali" | "Phaladeepika" | "Jataka Parijata" | "Brihat Jataka" | "Uttara Kalamrita" | "Lal Kitab" | "Hora Ratnam"
  chapter: number
  verse?: number
  sanskrit?: string            // original verse
  translation: string          // English translation
}

// ─── Remedies ──────────────────────────────────────────
export type RemedyType =
  | "gemstone" | "mantra" | "fasting" | "daan"
  | "rudraksha" | "yantra" | "puja" | "lifestyle"

export interface Remedy {
  id: string
  planet?: PlanetName
  dosha?: DoshaType
  type: RemedyType
  name: string
  details: Record<string, unknown>
  whyItWorks: string
  benefits: string[]
  classicalReference: ClassicalReference
  priority: "essential" | "recommended" | "optional"
}

// ─── Transit / Gochar ──────────────────────────────────
export interface TransitData {
  planet: PlanetName
  currentSign: SignInfo
  currentDegree: number
  currentNakshatra: NakshatraInfo
  natalHouseTransiting: number    // which natal house is this transit in
  speed: number
  retrograde: boolean
  effects: string
  favorableActivities: string[]
  unfavorableActivities: string[]
}

export interface TransitAnalysis {
  date: Date
  transits: TransitData[]
  activeSadeSati?: {
    phase: "rising" | "peak" | "setting"
    startDate: Date
    endDate: Date
    effects: string
  }
  moonTransit: {
    currentHouse: number
    effects: string
    duration: string
  }
}

// ─── Panchang ──────────────────────────────────────────
export interface Panchang {
  date: Date
  var: { name: string, lord: PlanetName }              // day of week
  tithi: { name: string, number: number, paksha: "Shukla" | "Krishna", lord: PlanetName }
  nakshatra: NakshatraInfo
  yoga: { name: string, number: number }               // panchang yoga (not same as chart yoga)
  karana: { name: string, number: number }
  sunrise: string
  sunset: string
  moonrise: string
  rahukaal: { start: string, end: string }
  gulikakaal: { start: string, end: string }
  auspicious: string[]
  inauspicious: string[]
}

// ─── Reports ───────────────────────────────────────────
export interface KundliReport {
  id: string
  userId: string
  kundliId: string
  natalChart: NatalChart
  divisionalCharts: DivisionalChart[]
  dashaAnalysis: DashaAnalysis
  yogas: YogaResult[]
  doshas: DoshaResult[]
  transits: TransitAnalysis
  remedies: Remedy[]
  houseInterpretations: Array<{
    house: number
    sign: SignInfo
    lord: PlanetName
    planets: PlanetName[]
    interpretation: string
    classicalRef: ClassicalReference
  }>
  generatedAt: Date
}

// ─── Daily Insight ─────────────────────────────────────
export interface DailyInsight {
  date: Date
  userId: string
  panchang: Panchang
  moonTransit: TransitData
  activeDasha: {
    mahadasha: PlanetName
    antardasha: PlanetName
    pratyantar: PlanetName
    interpretation: string
  }
  favorableActivities: string[]
  unfavorableActivities: string[]
  remedyOfTheDay: Remedy
  bphsVerse: ClassicalReference
  story?: VedicStory
}

// ─── Vedic Stories ─────────────────────────────────────
export interface VedicStory {
  id: string
  title: string
  concept: string             // yoga/dosha/planet it teaches
  narrative: string           // 200-400 words
  moral: string
  relatedTexts: ClassicalReference[]
  readTimeMinutes: number
}

// ─── Utility Types ─────────────────────────────────────
export interface BirthDetails {
  date: string               // "YYYY-MM-DD"
  time: string               // "HH:MM" or "HH:MM:SS"
  place: string
  latitude: number
  longitude: number
  timezone: number           // offset hours (e.g., 5.5 for IST)
}

export interface SwephPlanetPosition {
  longitude: number          // tropical ecliptic longitude
  latitude: number           // ecliptic latitude
  distance: number           // AU
  speedLong: number          // deg/day longitude speed
  speedLat: number           // deg/day latitude speed
  speedDist: number          // AU/day
}
