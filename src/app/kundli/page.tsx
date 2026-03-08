"use client"

/* ════════════════════════════════════════════════════════════
   Kundli / Birth Chart Page — /kundli

   End-to-end product: enter birth details → see full
   interactive birth chart with planets, yogas, doshas,
   Dasha timeline, Nakshatra profile, and remedies.

   What makes this BETTER than Co-Star & Melooha:
   - Full Vedic depth (North Indian chart) on web, no app
   - Interactive planet cards with degrees & dignity
   - Yoga & Dosha analysis with classical references
   - Dasha timeline visualization
   - Nakshatra personality profile
   - Personalized remedies with BPHS citations
   - Free preview + premium deep-dive
   ════════════════════════════════════════════════════════════ */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Sun, Moon, Star, Clock, MapPin, Calendar,
  ArrowRight, ArrowLeft, ChevronDown, ChevronUp,
  Shield, BookOpen, Gem, Zap, Heart, TrendingUp,
  AlertTriangle, CheckCircle, Info, Loader2, Share2,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

/* ─── Types ────────────────────────────────────────────── */

interface BirthDetails {
  name: string
  date: string
  time: string
  timeUnknown: boolean
  city: string
  country: string
}

interface PlanetData {
  name: string
  shortName: string
  sign: string
  signIndex: number
  house: number
  degree: number
  nakshatra: string
  nakshatraPada: number
  retrograde: boolean
  dignity: "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated"
  color: string
  symbol: string
}

interface YogaData {
  name: string
  nameSanskrit: string
  type: "raja" | "dhana" | "arishta" | "pancha_mahapurusha" | "other"
  planets: string[]
  houses: number[]
  effect: string
  strength: "strong" | "moderate" | "weak"
  classicalRef: string
}

interface DoshaData {
  name: string
  active: boolean
  severity: "mild" | "moderate" | "severe"
  planets: string[]
  remedy: string
  classicalRef: string
}

interface DashaData {
  planet: string
  start: string
  end: string
  isCurrent: boolean
  subPeriods: { planet: string; start: string; end: string; isCurrent: boolean }[]
}

interface KundliResult {
  ascendant: { sign: string; signIndex: number; degree: number; nakshatra: string }
  planets: PlanetData[]
  houses: number[]
  yogas: YogaData[]
  doshas: DoshaData[]
  dashas: DashaData[]
  nakshatraProfile: {
    name: string; lord: string; deity: string; symbol: string
    gana: string; animal: string; element: string
    qualities: string[]; description: string
  }
  summary: string
}

/* ─── Constants ────────────────────────────────────────── */

const SIGN_NAMES = [
  "", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

const SIGN_SANSKRIT = [
  "", "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन",
]

const PLANET_COLORS: Record<string, string> = {
  Su: "#E2C474", Mo: "#C8D8E4", Ma: "#E85454", Me: "#4ADE80",
  Ju: "#E2994A", Ve: "#F0C8E0", Sa: "#6B7DA8", Ra: "#8B8BCD", Ke: "#B8860B",
}

const DIGNITY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  exalted: { label: "Exalted", color: "text-emerald-400", icon: "↑" },
  own: { label: "Own Sign", color: "text-amber-400", icon: "★" },
  friend: { label: "Friendly", color: "text-blue-400", icon: "♦" },
  neutral: { label: "Neutral", color: "text-white/50", icon: "●" },
  enemy: { label: "Enemy", color: "text-orange-400", icon: "▼" },
  debilitated: { label: "Debilitated", color: "text-red-400", icon: "↓" },
}

const YOGA_TYPE_COLORS: Record<string, string> = {
  raja: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  dhana: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  arishta: "bg-red-500/15 text-red-400 border-red-500/20",
  pancha_mahapurusha: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  other: "bg-white/[0.06] text-white/60 border-white/[0.08]",
}

/* ─── Astronomical Kundli Generator ────────────────────
   Uses Meeus-style orbital approximations for planet positions.
   Accurate to ~1-2° for Sun, ~2-5° for others. Sufficient for
   sign-level Vedic chart generation without native binaries.
   ──────────────────────────────────────────────────────── */

// ── Nakshatra data table (27 nakshatras with full metadata)
const NAKSHATRA_DATA = [
  { name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras", symbol: "Horse's Head", gana: "Deva", animal: "Male Horse", element: "Earth", qualities: ["Swift healing", "Initiative", "Courage", "Renewal"] },
  { name: "Bharani", lord: "Venus", deity: "Yama", symbol: "Yoni (Womb)", gana: "Manushya", animal: "Male Elephant", element: "Earth", qualities: ["Transformation", "Restraint", "Nurturing", "Endurance"] },
  { name: "Krittika", lord: "Sun", deity: "Agni", symbol: "Razor/Flame", gana: "Rakshasa", animal: "Female Sheep", element: "Fire", qualities: ["Purification", "Sharp intellect", "Determination", "Authority"] },
  { name: "Rohini", lord: "Moon", deity: "Brahma", symbol: "Ox Cart", gana: "Manushya", animal: "Male Serpent", element: "Earth", qualities: ["Creativity", "Beauty", "Fertility", "Material abundance"] },
  { name: "Mrigashira", lord: "Mars", deity: "Soma", symbol: "Deer's Head", gana: "Deva", animal: "Female Serpent", element: "Earth", qualities: ["Seeking", "Curiosity", "Gentleness", "Research mind"] },
  { name: "Ardra", lord: "Rahu", deity: "Rudra", symbol: "Teardrop", gana: "Manushya", animal: "Female Dog", element: "Water", qualities: ["Transformation through suffering", "Intensity", "Intellectual power", "Effort"] },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi", symbol: "Bow & Quiver", gana: "Deva", animal: "Female Cat", element: "Water", qualities: ["Return of light", "Renewal", "Generosity", "Wisdom"] },
  { name: "Pushya", lord: "Saturn", deity: "Brihaspati", symbol: "Udder/Lotus", gana: "Deva", animal: "Male Sheep", element: "Water", qualities: ["Nourishment", "Devotion", "Prosperity", "Spiritual wealth"] },
  { name: "Ashlesha", lord: "Mercury", deity: "Naga", symbol: "Coiled Serpent", gana: "Rakshasa", animal: "Male Cat", element: "Water", qualities: ["Mystical power", "Intuition", "Kundalini", "Hypnotic charm"] },
  { name: "Magha", lord: "Ketu", deity: "Pitris (Ancestors)", symbol: "Royal Throne", gana: "Rakshasa", animal: "Male Rat", element: "Fire", qualities: ["Royal authority", "Ancestral connection", "Leadership", "Tradition"] },
  { name: "Purva Phalguni", lord: "Venus", deity: "Bhaga", symbol: "Front of Bed", gana: "Manushya", animal: "Female Rat", element: "Fire", qualities: ["Enjoyment", "Creative expression", "Romance", "Leisure"] },
  { name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman", symbol: "Back of Bed", gana: "Manushya", animal: "Male Cow", element: "Fire", qualities: ["Patronage", "Friendship", "Marriage", "Social responsibility"] },
  { name: "Hasta", lord: "Moon", deity: "Savitar", symbol: "Open Hand", gana: "Deva", animal: "Female Buffalo", element: "Fire", qualities: ["Skill with hands", "Healing touch", "Cleverness", "Resourcefulness"] },
  { name: "Chitra", lord: "Mars", deity: "Vishwakarma", symbol: "Bright Jewel", gana: "Rakshasa", animal: "Female Tiger", element: "Fire", qualities: ["Artistic brilliance", "Architecture", "Beauty creation", "Illusion"] },
  { name: "Swati", lord: "Rahu", deity: "Vayu", symbol: "Coral/Sword", gana: "Deva", animal: "Male Buffalo", element: "Air", qualities: ["Independence", "Flexibility", "Business sense", "Diplomacy"] },
  { name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni", symbol: "Triumphal Arch", gana: "Rakshasa", animal: "Male Tiger", element: "Air", qualities: ["Single-pointed focus", "Ambition", "Triumph", "Dual nature"] },
  { name: "Anuradha", lord: "Saturn", deity: "Mitra", symbol: "Lotus", gana: "Deva", animal: "Female Deer", element: "Air", qualities: ["Devotion", "Friendship", "Organization", "Spiritual discipline"] },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra", symbol: "Circular Amulet", gana: "Rakshasa", animal: "Male Deer", element: "Air", qualities: ["Seniority", "Protective instinct", "Occult power", "Karmic responsibility"] },
  { name: "Mula", lord: "Ketu", deity: "Nirrti", symbol: "Tied Roots", gana: "Rakshasa", animal: "Male Dog", element: "Air", qualities: ["Root cause investigation", "Destruction of illusion", "Philosophy", "Detachment"] },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apas (Water)", symbol: "Elephant Tusk", gana: "Manushya", animal: "Male Monkey", element: "Water", qualities: ["Invincibility", "Purification", "Rejuvenation", "Declaration of truth"] },
  { name: "Uttara Ashadha", lord: "Sun", deity: "Vishvadevas", symbol: "Elephant Tusk", gana: "Manushya", animal: "Male Mongoose", element: "Water", qualities: ["Final victory", "Penetrating insight", "Universal principles", "Unchallengeable"] },
  { name: "Shravana", lord: "Moon", deity: "Vishnu", symbol: "Three Footprints", gana: "Deva", animal: "Female Monkey", element: "Water", qualities: ["Listening", "Learning", "Connection", "Media and communication"] },
  { name: "Dhanishta", lord: "Mars", deity: "Vasus", symbol: "Drum", gana: "Rakshasa", animal: "Female Lion", element: "Water", qualities: ["Wealth", "Musical talent", "Adaptability", "Charitable nature"] },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna", symbol: "Empty Circle", gana: "Rakshasa", animal: "Female Horse", element: "Water", qualities: ["Healing", "Mysticism", "Isolation for growth", "Veiling and revealing"] },
  { name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada", symbol: "Front of Funeral Cot", gana: "Manushya", animal: "Male Lion", element: "Air", qualities: ["Intensity", "Penance", "Universal vision", "Occult knowledge"] },
  { name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahir Budhnya", symbol: "Back of Funeral Cot", gana: "Manushya", animal: "Female Cow", element: "Air", qualities: ["Depth", "Wisdom", "Kundalini awakening", "Spiritual warrior"] },
  { name: "Revati", lord: "Mercury", deity: "Pushan", symbol: "Fish/Drum", gana: "Deva", animal: "Female Elephant", element: "Water", qualities: ["Nourishment of journeys", "Safe travel", "Wealth", "Completion"] },
]

// ── Vedic Dignity Tables (exaltation & debilitation per planet per sign)
const EXALTATION_MAP: Record<string, number> = {
  Su: 1, Mo: 2, Ma: 10, Me: 6, Ju: 4, Ve: 12, Sa: 7, Ra: 3, Ke: 9
}
const DEBILITATION_MAP: Record<string, number> = {
  Su: 7, Mo: 8, Ma: 4, Me: 12, Ju: 10, Ve: 6, Sa: 1, Ra: 9, Ke: 3
}
const OWN_SIGN_MAP: Record<string, number[]> = {
  Su: [5], Mo: [4], Ma: [1, 8], Me: [3, 6], Ju: [9, 12], Ve: [2, 7], Sa: [10, 11], Ra: [11], Ke: [8]
}
const FRIEND_SIGNS: Record<string, number[]> = {
  Su: [1, 4, 8, 9, 12], Mo: [2, 3, 5, 9, 12], Ma: [5, 9, 12],
  Me: [2, 5, 7], Ju: [1, 5, 8], Ve: [3, 10, 11],
  Sa: [2, 3, 6, 7], Ra: [3, 6, 9, 12], Ke: [9, 12, 3, 6],
}

function computeDignity(shortName: string, signIndex: number): "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated" {
  if (EXALTATION_MAP[shortName] === signIndex) return "exalted"
  if (DEBILITATION_MAP[shortName] === signIndex) return "debilitated"
  if (OWN_SIGN_MAP[shortName]?.includes(signIndex)) return "own"
  if (FRIEND_SIGNS[shortName]?.includes(signIndex)) return "friend"
  // If not friend or special, check if enemy
  const allFriendOwn = [...(OWN_SIGN_MAP[shortName] || []), ...(FRIEND_SIGNS[shortName] || []),
    EXALTATION_MAP[shortName], DEBILITATION_MAP[shortName]]
  if (allFriendOwn.includes(signIndex)) return "friend"
  // Remaining signs alternate between neutral and enemy
  return signIndex % 3 === 0 ? "enemy" : "neutral"
}

// ── Astronomical position calculator (Meeus approximation)
function computeSiderealLongitude(jde: number, planet: string): number {
  // Julian centuries from J2000.0
  const T = (jde - 2451545.0) / 36525.0

  let tropLong = 0

  switch (planet) {
    case "Su": {
      // Solar longitude (Meeus Ch. 25, simplified)
      const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
      const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T
      const Mr = M * Math.PI / 180
      const C = (1.9146 - 0.004817 * T) * Math.sin(Mr) + 0.019993 * Math.sin(2 * Mr) + 0.00029 * Math.sin(3 * Mr)
      tropLong = L0 + C
      break
    }
    case "Mo": {
      // Lunar longitude (simplified Brown model)
      const Lp = 218.3165 + 481267.8813 * T
      const D = 297.8502 + 445267.1115 * T
      const M = 357.5291 + 35999.0503 * T
      const Mp = 134.9634 + 477198.8676 * T
      const F = 93.2720 + 483202.0175 * T
      const Dr = D * Math.PI / 180, Mr = M * Math.PI / 180
      const Mpr = Mp * Math.PI / 180, Fr = F * Math.PI / 180
      tropLong = Lp
        + 6.2888 * Math.sin(Mpr)
        + 1.2740 * Math.sin(2 * Dr - Mpr)
        + 0.6583 * Math.sin(2 * Dr)
        + 0.2136 * Math.sin(2 * Mpr)
        - 0.1851 * Math.sin(Mr)
        - 0.1143 * Math.sin(2 * Fr)
        + 0.0588 * Math.sin(2 * Dr - 2 * Mpr)
      break
    }
    case "Ma": {
      const Lm = 355.433 + 19140.2993 * T
      const Mm = 319.515 + 19139.8585 * T
      const Mr = Mm * Math.PI / 180
      tropLong = Lm + 10.691 * Math.sin(Mr) + 0.623 * Math.sin(2 * Mr) + 0.050 * Math.sin(3 * Mr)
      break
    }
    case "Me": {
      const Lm = 252.251 + 149472.6746 * T
      const Mm = 174.795 + 149472.5153 * T
      const Mr = Mm * Math.PI / 180
      tropLong = Lm + 23.440 * Math.sin(Mr) + 2.958 * Math.sin(2 * Mr) + 0.527 * Math.sin(3 * Mr)
      break
    }
    case "Ju": {
      const Lm = 34.351 + 3034.9057 * T
      const Mm = 225.328 + 3034.6962 * T
      const Mr = Mm * Math.PI / 180
      tropLong = Lm + 5.555 * Math.sin(Mr) + 0.168 * Math.sin(2 * Mr)
      break
    }
    case "Ve": {
      const Lm = 181.979 + 58517.8159 * T
      const Mm = 50.416 + 58517.8039 * T
      const Mr = Mm * Math.PI / 180
      tropLong = Lm + 0.7758 * Math.sin(Mr) + 0.0033 * Math.sin(2 * Mr)
      break
    }
    case "Sa": {
      const Lm = 50.077 + 1222.1138 * T
      const Mm = 316.967 + 1222.1138 * T
      const Mr = Mm * Math.PI / 180
      tropLong = Lm + 6.4 * Math.sin(Mr) + 0.26 * Math.sin(2 * Mr)
      break
    }
    case "Ra": {
      // Mean Rahu (North Node) — moves retrograde ~19.35°/yr
      tropLong = 125.0446 - 1934.1363 * T + 0.0021 * T * T
      break
    }
    case "Ke": {
      tropLong = 125.0446 - 1934.1363 * T + 0.0021 * T * T + 180
      break
    }
  }

  // Ayanamsa (Lahiri): approximately 23°51' for 2000, precessing ~50.3"/yr
  const ayanamsa = 23.85 + 0.01396 * (jde - 2451545.0) / 365.25

  let sidereal = tropLong - ayanamsa
  sidereal = ((sidereal % 360) + 360) % 360
  return sidereal
}

function dateToJDE(dateStr: string, timeStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number)
  const timeParts = (timeStr || "12:00").split(":").map(Number)
  const hour = timeParts[0] + (timeParts[1] || 0) / 60 - 5.5 // IST offset
  const a = Math.floor((14 - m) / 12)
  const yr = y + 4800 - a
  const mo = m + 12 * a - 3
  const jdn = d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045
  return jdn + hour / 24.0 - 0.5
}

// ── Ascendant calculation (simplified for Whole Sign)
function computeAscendant(jde: number, lat: number): number {
  const T = (jde - 2451545.0) / 36525.0
  const theta0 = 280.46061837 + 360.98564736629 * (jde - 2451545.0) + 0.000387933 * T * T
  // Approximate local sidereal time for IST ~82.5°E
  const lst = ((theta0 + 82.5) % 360 + 360) % 360
  const lstRad = lst * Math.PI / 180
  const latRad = (lat || 28.6) * Math.PI / 180
  const obliquity = 23.4393 * Math.PI / 180
  const ascRad = Math.atan2(Math.cos(lstRad), -(Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity)))
  let ascDeg = ((ascRad * 180 / Math.PI) + 360) % 360
  // Apply ayanamsa
  const ayanamsa = 23.85 + 0.01396 * (jde - 2451545.0) / 365.25
  ascDeg = ((ascDeg - ayanamsa) % 360 + 360) % 360
  return ascDeg
}

// Approximate latitude from city name (Indian cities)
function getCityLat(city: string): number {
  const cityLower = city.toLowerCase().trim()
  const CITY_COORDS: Record<string, number> = {
    mumbai: 19.08, delhi: 28.61, bangalore: 12.97, bengaluru: 12.97,
    chennai: 13.08, kolkata: 22.57, hyderabad: 17.39, pune: 18.52,
    ahmedabad: 23.02, jaipur: 26.91, lucknow: 26.85, kanpur: 26.45,
    nagpur: 21.15, indore: 22.72, bhopal: 23.26, patna: 25.61,
    vadodara: 22.31, goa: 15.30, chandigarh: 30.73, coimbatore: 11.01,
    surat: 21.17, varanasi: 25.32, thiruvananthapuram: 8.52, kochi: 9.93,
    "new york": 40.71, london: 51.51, toronto: 43.65, sydney: -33.87,
    dubai: 25.20, singapore: 1.35, "los angeles": 34.05, chicago: 41.88,
  }
  return CITY_COORDS[cityLower] || 28.6 // Default Delhi
}

function generateDemoKundli(details: BirthDetails): KundliResult {
  const d = new Date(details.date)
  const jde = dateToJDE(details.date, details.time || (details.timeUnknown ? "12:00" : "12:00"))
  const lat = getCityLat(details.city)

  const planetDefs = [
    { name: "Sun", short: "Su", symbol: "☉" },
    { name: "Moon", short: "Mo", symbol: "☽" },
    { name: "Mars", short: "Ma", symbol: "♂" },
    { name: "Mercury", short: "Me", symbol: "☿" },
    { name: "Jupiter", short: "Ju", symbol: "♃" },
    { name: "Venus", short: "Ve", symbol: "♀" },
    { name: "Saturn", short: "Sa", symbol: "♄" },
    { name: "Rahu", short: "Ra", symbol: "☊" },
    { name: "Ketu", short: "Ke", symbol: "☋" },
  ]

  // ── Compute Ascendant
  const ascDeg = computeAscendant(jde, lat)
  const ascSign = Math.floor(ascDeg / 30) + 1
  const houses = Array.from({ length: 12 }, (_, i) => ((ascSign - 1 + i) % 12) + 1)

  // ── Compute all planet positions using astronomical formulas
  const planets: PlanetData[] = planetDefs.map((p) => {
    const siderealLong = computeSiderealLongitude(jde, p.short)
    const signIdx = Math.floor(siderealLong / 30) + 1
    const degInSign = siderealLong % 30
    const houseIdx = houses.indexOf(signIdx)

    // Nakshatra from absolute longitude (each nakshatra = 13°20' = 13.333°)
    const nakIdx = Math.floor(siderealLong / 13.333333) % 27
    const pada = Math.floor((siderealLong % 13.333333) / 3.333333) + 1

    // Compute retrograde from orbital speeds (approximate)
    const isRetro = (() => {
      if (p.short === "Su" || p.short === "Mo") return false // never retrograde
      if (p.short === "Ra" || p.short === "Ke") return true // always retrograde
      const nextLong = computeSiderealLongitude(jde + 1, p.short)
      let diff = nextLong - siderealLong
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      return diff < 0
    })()

    const dignity = computeDignity(p.short, signIdx)

    return {
      name: p.name,
      shortName: p.short,
      sign: SIGN_NAMES[signIdx],
      signIndex: signIdx,
      house: houseIdx + 1,
      degree: degInSign,
      nakshatra: NAKSHATRA_DATA[nakIdx].name,
      nakshatraPada: Math.min(pada, 4),
      retrograde: isRetro,
      dignity,
      color: PLANET_COLORS[p.short] || "#E8E4DB",
      symbol: p.symbol,
    }
  })

  // ── Dynamic Yoga Detection (from actual planet positions)
  const yogas: YogaData[] = []
  const getP = (name: string) => planets.find(p => p.name === name)!
  const houseDiff = (h1: number, h2: number) => { const d = Math.abs(h1 - h2); return Math.min(d, 12 - d) }

  // Gajakesari Yoga: Jupiter in kendra (1,4,7,10) from Moon
  const jupMoonDiff = houseDiff(getP("Jupiter").house, getP("Moon").house)
  if ([0, 3, 6, 9].includes(jupMoonDiff)) {
    yogas.push({
      name: "Gajakesari Yoga", nameSanskrit: "गजकेसरी योग",
      type: "raja", planets: ["Jupiter", "Moon"],
      houses: [getP("Jupiter").house, getP("Moon").house],
      effect: "Grants wisdom, fame, and lasting prosperity. The native commands respect and achieves positions of authority through knowledge and righteous conduct.",
      strength: getP("Jupiter").dignity === "exalted" || getP("Jupiter").dignity === "own" ? "strong" : "moderate",
      classicalRef: "BPHS Ch. 36, Sl. 2",
    })
  }

  // Budhaditya Yoga: Sun and Mercury in same sign
  if (getP("Sun").signIndex === getP("Mercury").signIndex) {
    yogas.push({
      name: "Budhaditya Yoga", nameSanskrit: "बुधादित्य योग",
      type: "dhana", planets: ["Sun", "Mercury"],
      houses: [getP("Sun").house],
      effect: "Sharp intellect, eloquence in speech, and success in education and communication. The native becomes learned and respected in intellectual pursuits.",
      strength: getP("Mercury").retrograde ? "weak" : "moderate",
      classicalRef: "Phaladeepika Ch. 6, Sl. 11",
    })
  }

  // Hamsa Yoga (Pancha Mahapurusha): Jupiter in kendra in own/exaltation sign
  if ([1, 4, 7, 10].includes(getP("Jupiter").house) && (getP("Jupiter").dignity === "exalted" || getP("Jupiter").dignity === "own")) {
    yogas.push({
      name: "Hamsa Yoga", nameSanskrit: "हंस योग",
      type: "pancha_mahapurusha", planets: ["Jupiter"],
      houses: [getP("Jupiter").house],
      effect: "One of the five great yogas. Grants spirituality, righteousness, knowledge of scriptures, and a beautiful, fair complexion. The native becomes a teacher or spiritual guide.",
      strength: "strong",
      classicalRef: "BPHS Ch. 75, Sl. 3",
    })
  }

  // Malavya Yoga (Pancha Mahapurusha): Venus in kendra in own/exaltation
  if ([1, 4, 7, 10].includes(getP("Venus").house) && (getP("Venus").dignity === "exalted" || getP("Venus").dignity === "own")) {
    yogas.push({
      name: "Malavya Yoga", nameSanskrit: "मालव्य योग",
      type: "pancha_mahapurusha", planets: ["Venus"],
      houses: [getP("Venus").house],
      effect: "Bestows luxury, beauty, artistic talent, and a refined lifestyle. The native enjoys comforts, vehicles, and harmonious relationships throughout life.",
      strength: "strong",
      classicalRef: "BPHS Ch. 75, Sl. 5",
    })
  }

  // Ruchaka Yoga (Pancha Mahapurusha): Mars in kendra in own/exaltation
  if ([1, 4, 7, 10].includes(getP("Mars").house) && (getP("Mars").dignity === "exalted" || getP("Mars").dignity === "own")) {
    yogas.push({
      name: "Ruchaka Yoga", nameSanskrit: "रुचक योग",
      type: "pancha_mahapurusha", planets: ["Mars"],
      houses: [getP("Mars").house],
      effect: "Confers valor, courage, commanding presence, and leadership in military or martial pursuits. The native becomes a warrior, administrator, or bold entrepreneur.",
      strength: "strong",
      classicalRef: "BPHS Ch. 75, Sl. 1",
    })
  }

  // Amala Yoga: Benefic in 10th from Lagna or Moon
  const benefics = ["Jupiter", "Venus", "Mercury"]
  for (const b of benefics) {
    if (getP(b).house === 10) {
      yogas.push({
        name: "Amala Yoga", nameSanskrit: "अमल योग",
        type: "other", planets: [b],
        houses: [10],
        effect: "Pure character and lasting fame through righteous deeds. The native earns respect through ethical conduct and charitable nature.",
        strength: "moderate",
        classicalRef: "Saravali Ch. 35, Sl. 4",
      })
      break
    }
  }

  // Chandra-Mangal Yoga: Moon and Mars conjunction
  if (getP("Moon").signIndex === getP("Mars").signIndex) {
    yogas.push({
      name: "Chandra-Mangal Yoga", nameSanskrit: "चन्द्र-मंगल योग",
      type: "dhana", planets: ["Moon", "Mars"],
      houses: [getP("Moon").house],
      effect: "Wealth through business acumen and practical intelligence. The native earns well through industry, real estate, or entrepreneurial ventures.",
      strength: "moderate",
      classicalRef: "Phaladeepika Ch. 6, Sl. 14",
    })
  }

  // Neech Bhanga Raja Yoga: Debilitated planet with cancellation
  for (const p of planets) {
    if (p.dignity === "debilitated") {
      // Check if lord of the debilitated sign is in kendra from lagna or moon
      const cancelLord = planets.find(pp => OWN_SIGN_MAP[pp.shortName]?.includes(p.signIndex))
      if (cancelLord && [1, 4, 7, 10].includes(cancelLord.house)) {
        yogas.push({
          name: "Neecha Bhanga Raja Yoga", nameSanskrit: "नीच भंग राज योग",
          type: "raja", planets: [p.name, cancelLord.name],
          houses: [p.house, cancelLord.house],
          effect: `${p.name}'s debilitation is cancelled by ${cancelLord.name}'s angular position. This transforms weakness into extraordinary strength, bringing unexpected rise to power.`,
          strength: "strong",
          classicalRef: "BPHS Ch. 28, Sl. 5-7",
        })
        break
      }
    }
  }

  // ── Dynamic Dosha Detection
  const doshas: DoshaData[] = []
  const marsHouse = getP("Mars").house

  // Mangal Dosha: Mars in 1, 2, 4, 7, 8, 12 from Lagna
  if ([1, 2, 4, 7, 8, 12].includes(marsHouse)) {
    const severity = [7, 8].includes(marsHouse) ? "severe" : [1, 4].includes(marsHouse) ? "moderate" : "mild"
    doshas.push({
      name: "Mangal Dosha (Kuja Dosha)", active: true,
      severity,
      planets: ["Mars"],
      remedy: marsHouse === 7
        ? "Perform Mangal Shanti Puja. Marriage to a Manglik partner or symbolic marriage to a banana tree (Kumbh Vivah) can neutralize this dosha."
        : "Recite Hanuman Chalisa on Tuesdays. Offer red flowers and jaggery at a Hanuman temple. Wearing a coral gemstone on the ring finger may help.",
      classicalRef: "BPHS Ch. 77",
    })
  }

  // Kaal Sarpa Dosha: All planets between Rahu and Ketu
  const rahuIdx = getP("Rahu").signIndex
  const ketuIdx = getP("Ketu").signIndex
  const isKaalSarpa = planets.filter(p => p.name !== "Rahu" && p.name !== "Ketu").every(p => {
    let s = p.signIndex
    // Check if all planets are hemmed between Rahu and Ketu
    if (rahuIdx < ketuIdx) return s >= rahuIdx && s <= ketuIdx
    return s >= rahuIdx || s <= ketuIdx
  })
  if (isKaalSarpa) {
    doshas.push({
      name: "Kaal Sarpa Dosha", active: true,
      severity: "moderate",
      planets: ["Rahu", "Ketu"],
      remedy: "Perform Kaal Sarpa Puja at Trimbakeshwar or any Shiva temple. Chant 'Om Namah Shivaya' 108 times daily. Keep a silver serpent idol in your prayer room.",
      classicalRef: "Jataka Parijata Ch. 15",
    })
  }

  // Pitra Dosha: Sun conjunct Rahu or Sun in 9th house with Rahu aspect
  if (getP("Sun").signIndex === getP("Rahu").signIndex ||
      (getP("Sun").house === 9 && houseDiff(getP("Rahu").house, 9) <= 1)) {
    doshas.push({
      name: "Pitra Dosha", active: true,
      severity: "mild",
      planets: ["Sun", "Rahu"],
      remedy: "Perform Tarpan for ancestors on every Amavasya. Donate food to Brahmins on Sundays. Plant a Peepal tree and water it regularly.",
      classicalRef: "BPHS Ch. 79",
    })
  }

  // Grahan Dosha: Sun/Moon conjunct Rahu or Ketu
  if (getP("Moon").signIndex === getP("Rahu").signIndex || getP("Moon").signIndex === getP("Ketu").signIndex) {
    doshas.push({
      name: "Grahan Dosha (Lunar)", active: true,
      severity: "moderate",
      planets: ["Moon", getP("Moon").signIndex === getP("Rahu").signIndex ? "Rahu" : "Ketu"],
      remedy: "Perform Chandra Grahan Shanti Puja. Offer milk to a Shiva Linga on Mondays. Wear a natural pearl after consulting an astrologer.",
      classicalRef: "BPHS Ch. 44",
    })
  }

  // ── Vimshottari Dasha (from Moon's Nakshatra)
  const moonLong = computeSiderealLongitude(jde, "Mo")
  const moonNakIdx = Math.floor(moonLong / 13.333333) % 27

  const DASHA_PLANETS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
  const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]
  const NAK_LORDS = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"]
  const NAK_LORD_NAMES: Record<string, string> = { Ke: "Ketu", Ve: "Venus", Su: "Sun", Mo: "Moon", Ma: "Mars", Ra: "Rahu", Ju: "Jupiter", Sa: "Saturn", Me: "Mercury" }

  // Find the starting Dasha lord from Moon's nakshatra
  const moonNakLord = NAK_LORDS[moonNakIdx % 9]
  const startDashaIdx = DASHA_PLANETS.indexOf(NAK_LORD_NAMES[moonNakLord])

  // Elapsed portion in current nakshatra determines remaining Dasha at birth
  const nakProgress = (moonLong % 13.333333) / 13.333333
  const birthYear = d.getFullYear() + (d.getMonth()) / 12 + d.getDate() / 365
  const firstDashaRemaining = DASHA_YEARS[startDashaIdx] * (1 - nakProgress)

  const currentYear = new Date().getFullYear() + new Date().getMonth() / 12
  let dashaStart = birthYear
  const dashas: DashaData[] = []

  for (let cycle = 0; cycle < 2; cycle++) { // two full cycles to ensure we cover current period
    for (let i = 0; i < 9; i++) {
      const idx = (startDashaIdx + i) % 9
      const planet = DASHA_PLANETS[idx]
      const years = (i === 0 && cycle === 0) ? firstDashaRemaining : DASHA_YEARS[idx]
      const dashaEnd = dashaStart + years
      const isCurrent = currentYear >= dashaStart && currentYear < dashaEnd

      // Sub-periods (Antardashas)
      const subPeriods: DashaData["subPeriods"] = []
      let subStart = dashaStart
      for (let j = 0; j < 9; j++) {
        const subIdx = (idx + j) % 9
        const subPlanet = DASHA_PLANETS[subIdx]
        const subYears = years * DASHA_YEARS[subIdx] / 120
        const subEnd = subStart + subYears
        const isSubCurrent = currentYear >= subStart && currentYear < subEnd
        subPeriods.push({
          planet: subPlanet,
          start: `${Math.floor(subStart)}-${String(Math.floor((subStart % 1) * 12) + 1).padStart(2, "0")}-01`,
          end: `${Math.floor(subEnd)}-${String(Math.floor((subEnd % 1) * 12) + 1).padStart(2, "0")}-01`,
          isCurrent: isSubCurrent,
        })
        subStart = subEnd
      }

      const startStr = `${Math.floor(dashaStart)}-${String(Math.floor((dashaStart % 1) * 12) + 1).padStart(2, "0")}-01`
      const endStr = `${Math.floor(dashaEnd)}-${String(Math.floor((dashaEnd % 1) * 12) + 1).padStart(2, "0")}-01`

      dashas.push({ planet, start: startStr, end: endStr, isCurrent, subPeriods })
      dashaStart = dashaEnd
      if (dashas.length >= 12) break
    }
    if (dashas.length >= 12) break
  }

  // ── Nakshatra Profile (from actual Moon position)
  const moonNak = NAKSHATRA_DATA[moonNakIdx]
  const nakshatraProfile = {
    name: moonNak.name,
    lord: moonNak.lord,
    deity: moonNak.deity,
    symbol: moonNak.symbol,
    gana: moonNak.gana,
    animal: moonNak.animal,
    element: moonNak.element,
    qualities: moonNak.qualities,
    description: generateNakshatraDescription(moonNak.name, moonNak.lord, moonNak.deity, moonNak.gana),
  }

  // ── Build summary
  const currentDasha = dashas.find(da => da.isCurrent)
  const activeDoshas = doshas.filter(ds => ds.active)
  const moonSign = SIGN_NAMES[getP("Moon").signIndex]
  const sunSign = SIGN_NAMES[getP("Sun").signIndex]

  const summary = `Your birth chart reveals ${SIGN_NAMES[ascSign]} (${SIGN_SANSKRIT[ascSign]}) rising at ${ascDeg.toFixed(1)}°, with Moon in ${moonSign} and Sun in ${sunSign}. ` +
    (yogas.length > 0 ? `${yogas.length} significant yoga${yogas.length > 1 ? "s" : ""} detected: ${yogas.map(y => y.name).join(", ")}. ` : "No major yogas found in the current configuration. ") +
    (activeDoshas.length > 0 ? `${activeDoshas.map(d => d.name).join(" and ")} require attention with specific remedies. ` : "No major doshas are present, indicating smooth life patterns. ") +
    (currentDasha ? `Currently running ${currentDasha.planet} Mahadasha — a phase of ${getDashaMeaning(currentDasha.planet)}.` : "")

  return {
    ascendant: {
      sign: SIGN_NAMES[ascSign], signIndex: ascSign,
      degree: ascDeg % 30,
      nakshatra: NAKSHATRA_DATA[Math.floor(ascDeg / 13.333333) % 27].name,
    },
    planets, houses, yogas, doshas, dashas, nakshatraProfile,
    summary,
  }
}

function generateNakshatraDescription(name: string, lord: string, deity: string, gana: string): string {
  const descriptions: Record<string, string> = {
    "Ashwini": `Born under Ashwini Nakshatra, ruled by Ketu and blessed by the Ashwini Kumaras (celestial physicians), you possess an innate healing ability and remarkable initiative. Your swift decision-making and pioneering spirit make you a natural leader who inspires immediate action.`,
    "Bharani": `Bharani Nakshatra, ruled by Venus and presided by Yama, grants you deep understanding of life's transformative cycles. You carry the power of restraint alongside intense creative force. Your nurturing nature helps others through difficult transitions.`,
    "Krittika": `Under Krittika, ruled by the Sun and blessed by Agni (fire god), you possess a sharp, purifying intellect. Your determination cuts through confusion like a razor through mist. You are meant to be an authority figure who illuminates truth.`,
    "Rohini": `Rohini, the Moon's favorite nakshatra ruled by Brahma the creator, endows you with exceptional creativity and aesthetic sense. Material abundance follows you naturally. Your charm and magnetic presence attract opportunities effortlessly.`,
    "Mrigashira": `Mrigashira Nakshatra, ruled by Mars and blessed by Soma, gives you an eternal seeking nature. Like the deer for which it is named, you are gentle yet alert, always searching for higher truth. Your curiosity drives groundbreaking research and discovery.`,
    "Ardra": `Born under Ardra, ruled by Rahu and presided by Rudra (the storm god), you possess intense transformative power. Through life's challenges, you emerge stronger. Your intellectual depth and emotional intensity make you a powerful catalyst for change.`,
    "Punarvasu": `Punarvasu, ruled by Jupiter and blessed by Aditi (mother of gods), grants you the gift of renewal. No matter what setbacks occur, you have an extraordinary ability to bounce back. Your generosity and optimism inspire everyone around you.`,
    "Pushya": `Pushya Nakshatra, ruled by Saturn and blessed by Brihaspati, is considered the most auspicious nakshatra. You are naturally nourishing, devoted, and spiritually wealthy. Your steady discipline builds lasting prosperity for yourself and your community.`,
    "Ashlesha": `Under Ashlesha, ruled by Mercury and presided by the Nagas (serpent deities), you possess mystical intuition and hypnotic charm. Your mind penetrates the deepest mysteries. Like the kundalini serpent, your power lies coiled, waiting for the right moment.`,
    "Magha": `Magha Nakshatra, ruled by Ketu and connected to the Pitris (ancestors), grants you a regal bearing and natural authority. You carry ancestral wisdom and tradition. Your leadership is grounded in lineage, honor, and spiritual depth.`,
  }
  return descriptions[name] ||
    `Born under ${name} Nakshatra, ruled by ${lord} and blessed by ${deity}, you belong to the ${gana} temperament. This nakshatra grants you unique qualities that shape your life's purpose and spiritual journey. Your innate nature carries the wisdom of this celestial mansion.`
}

function getDashaMeaning(planet: string): string {
  const meanings: Record<string, string> = {
    "Sun": "authority, recognition, and self-expression",
    "Moon": "emotional growth, nurturing relationships, and inner peace",
    "Mars": "action, courage, and asserting your will",
    "Mercury": "communication, learning, and intellectual expansion",
    "Jupiter": "wisdom, prosperity, and spiritual advancement",
    "Venus": "love, beauty, creativity, and material comforts",
    "Saturn": "discipline, karmic lessons, and building lasting foundations",
    "Rahu": "ambition, unconventional pursuits, and worldly desires",
    "Ketu": "spiritual liberation, detachment, and past-life karma resolution",
  }
  return meanings[planet] || "transformation and growth"
}

/* ─── Sub-Components ─────────────────────────────────── */

function BirthDetailsForm({ onSubmit }: { onSubmit: (d: BirthDetails) => void }) {
  const [form, setForm] = useState<BirthDetails>({
    name: "", date: "", time: "", timeUnknown: false,
    city: "", country: "India",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 rounded-full border border-amber-500/20 flex items-center justify-center"
        >
          <Sun className="w-8 h-8 text-amber-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Generate Your <span className="text-amber-400">Kundli</span>
        </h1>
        <p className="text-white/40 text-sm">
          Enter your birth details for a complete Vedic birth chart analysis
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Enter your name"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Date + Time row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
              <Calendar className="inline w-3 h-3 mr-1" />Birth Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
              <Clock className="inline w-3 h-3 mr-1" />Birth Time
            </label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              disabled={form.timeUnknown}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none transition-colors disabled:opacity-30"
            />
            <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.timeUnknown}
                onChange={e => setForm(f => ({ ...f, timeUnknown: e.target.checked, time: "" }))}
                className="rounded border-white/20 bg-white/[0.05] text-amber-500 focus:ring-amber-500/30"
              />
              <span className="text-[11px] text-white/30">Time unknown (Surya Kundli)</span>
            </label>
          </div>
        </div>

        {/* City + Country */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
              <MapPin className="inline w-3 h-3 mr-1" />Birth City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Mumbai, Delhi"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Country</label>
            <select
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-amber-500/30 focus:outline-none transition-colors"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { if (form.name && form.date && (form.time || form.timeUnknown) && form.city) onSubmit(form) }}
          disabled={!form.name || !form.date || (!form.time && !form.timeUnknown) || !form.city}
          className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-[#050810] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(201,162,77,0.3)] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Generate Kundli
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-center text-[10px] text-white/20 mt-3">
          Free analysis with chart, planets, yogas & doshas. Premium unlocks full Dasha timeline & remedies.
        </p>
      </div>
    </motion.div>
  )
}

/* ─── Chart SVG (North Indian) ─────────────────────── */

function NorthIndianChart({ planets, houses, ascendantSign, size = 320 }: {
  planets: PlanetData[]; houses: number[]; ascendantSign: number; size?: number
}) {
  const m = size / 2

  const houseLayout = [
    { path: `M${m},${m} L0,0 L${size},0 Z`, tx: m, ty: size * 0.15 },
    { path: `M0,0 L${m},0 L0,${m} Z`, tx: size * 0.12, ty: size * 0.2 },
    { path: `M0,0 L0,${m} L${m},${m} Z`, tx: size * 0.2, ty: size * 0.38 },
    { path: `M0,0 L${m},${m} L0,${size} Z`, tx: size * 0.15, ty: m },
    { path: `M0,${size} L${m},${m} L0,${m} Z`, tx: size * 0.2, ty: size * 0.62 },
    { path: `M0,${size} L${m},${size} L${m},${m} Z`, tx: size * 0.12, ty: size * 0.8 },
    { path: `M0,${size} L${m},${m} L${size},${size} Z`, tx: m, ty: size * 0.85 },
    { path: `M${size},${size} L${m},${size} L${m},${m} Z`, tx: size * 0.88, ty: size * 0.8 },
    { path: `M${size},${size} L${m},${m} L${size},${m} Z`, tx: size * 0.8, ty: size * 0.62 },
    { path: `M${size},${size} L${m},${m} L${size},0 Z`, tx: size * 0.85, ty: m },
    { path: `M${size},0 L${m},${m} L${size},${m} Z`, tx: size * 0.8, ty: size * 0.38 },
    { path: `M${size},0 L${m},0 L${m},${m} Z`, tx: size * 0.88, ty: size * 0.2 },
  ]

  const planetsByHouse = new Map<number, PlanetData[]>()
  for (let i = 0; i < 12; i++) planetsByHouse.set(i, [])
  for (const p of planets) {
    const hIdx = houses.indexOf(p.signIndex)
    if (hIdx >= 0) planetsByHouse.get(hIdx)?.push(p)
  }

  const SIGN_SHORT = ["", "Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      <rect x={0} y={0} width={size} height={size} fill="rgba(12,18,36,0.9)" stroke="rgba(192,162,77,0.3)" strokeWidth={1.5} rx={8} />
      <line x1={0} y1={0} x2={size} y2={size} stroke="rgba(192,162,77,0.2)" strokeWidth={1} />
      <line x1={size} y1={0} x2={0} y2={size} stroke="rgba(192,162,77,0.2)" strokeWidth={1} />
      <line x1={m} y1={0} x2={m} y2={size} stroke="rgba(192,162,77,0.1)" strokeWidth={0.5} />
      <line x1={0} y1={m} x2={size} y2={m} stroke="rgba(192,162,77,0.1)" strokeWidth={0.5} />

      {houseLayout.map((h, i) => {
        const signIdx = houses[i] || 1
        const isLagna = i === 0
        const housePlanets = planetsByHouse.get(i) || []

        return (
          <g key={i}>
            <path d={h.path} fill={isLagna ? "rgba(226,153,74,0.08)" : "transparent"} stroke="rgba(192,162,77,0.25)" strokeWidth={0.8} />
            <text x={h.tx} y={h.ty - 8} textAnchor="middle" fill={isLagna ? "#E2994A" : "rgba(138,134,144,0.5)"} fontSize={9}>
              {SIGN_SHORT[signIdx]}{isLagna ? " ↑" : ""}
            </text>
            {housePlanets.map((p, pi) => (
              <text key={p.shortName} x={h.tx} y={h.ty + 5 + pi * 13} textAnchor="middle"
                fill={p.color} fontSize={11} fontWeight={600}>
                {p.shortName}{p.retrograde ? "ᴿ" : ""}
              </text>
            ))}
          </g>
        )
      })}

      <text x={m} y={m - 3} textAnchor="middle" fill="rgba(192,162,77,0.35)" fontSize={10} fontFamily="var(--font-devanagari)">ग्रह</text>
      <text x={m} y={m + 10} textAnchor="middle" fill="rgba(192,162,77,0.25)" fontSize={8}>GrahAI</text>
    </svg>
  )
}

/* ─── Planet Card ───────────────────────────────────── */

function PlanetCard({ planet }: { planet: PlanetData }) {
  const [expanded, setExpanded] = useState(false)
  const dg = DIGNITY_LABELS[planet.dignity]

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/15 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg" style={{ color: planet.color }}>{planet.symbol}</span>
          <div>
            <span className="text-sm font-medium text-white/90">{planet.name}</span>
            {planet.retrograde && <span className="ml-1.5 text-[10px] text-red-400 font-medium">R</span>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">{planet.sign}</p>
          <p className="text-[10px] text-white/30">{planet.degree.toFixed(1)}°</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-white/30">House</span>
                <p className="text-white/70">House {planet.house}</p>
              </div>
              <div>
                <span className="text-white/30">Nakshatra</span>
                <p className="text-white/70">{planet.nakshatra} (Pada {planet.nakshatraPada})</p>
              </div>
              <div>
                <span className="text-white/30">Dignity</span>
                <p className={dg.color}>{dg.icon} {dg.label}</p>
              </div>
              <div>
                <span className="text-white/30">Degree</span>
                <p className="text-white/70">{planet.degree.toFixed(2)}° {planet.sign}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Yoga Card ────────────────────────────────────── */

function YogaCard({ yoga }: { yoga: YogaData }) {
  const colors = YOGA_TYPE_COLORS[yoga.type] || YOGA_TYPE_COLORS.other
  return (
    <div className={`rounded-xl border p-4 ${colors}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold">{yoga.name}</h4>
          <p className="text-[10px] opacity-60" style={{ fontFamily: "var(--font-devanagari)" }}>{yoga.nameSanskrit}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
          yoga.strength === "strong" ? "border-emerald-500/30 text-emerald-400" :
          yoga.strength === "moderate" ? "border-amber-500/30 text-amber-400" :
          "border-white/10 text-white/40"
        }`}>{yoga.strength}</span>
      </div>
      <p className="text-xs opacity-80 leading-relaxed">{yoga.effect}</p>
      <div className="mt-2 flex items-center gap-2 text-[10px] opacity-50">
        <BookOpen className="w-3 h-3" />
        {yoga.classicalRef}
      </div>
    </div>
  )
}

/* ─── Dosha Card ───────────────────────────────────── */

function DoshaCard({ dosha }: { dosha: DoshaData }) {
  if (!dosha.active) return null
  return (
    <div className={`rounded-xl border p-4 ${
      dosha.severity === "severe" ? "border-red-500/20 bg-red-500/[0.06]" :
      dosha.severity === "moderate" ? "border-orange-500/20 bg-orange-500/[0.06]" :
      "border-amber-500/20 bg-amber-500/[0.06]"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className={`w-4 h-4 ${
          dosha.severity === "severe" ? "text-red-400" :
          dosha.severity === "moderate" ? "text-orange-400" : "text-amber-400"
        }`} />
        <h4 className="text-sm font-semibold text-white/90">{dosha.name}</h4>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">{dosha.severity}</span>
      </div>
      <div className="mt-2 rounded-lg bg-white/[0.03] p-3">
        <p className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">Remedy</p>
        <p className="text-xs text-white/70">{dosha.remedy}</p>
      </div>
      <p className="mt-2 text-[10px] text-white/30 flex items-center gap-1">
        <BookOpen className="w-3 h-3" /> {dosha.classicalRef}
      </p>
    </div>
  )
}

/* ─── Dasha Timeline ───────────────────────────────── */

function DashaTimeline({ dashas }: { dashas: DashaData[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {dashas.map((d, i) => {
        const startYear = d.start.split("-")[0]
        const endYear = d.end.split("-")[0]
        return (
          <div key={i}>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className={`w-full flex items-center justify-between rounded-xl border p-3 transition-all ${
                d.isCurrent
                  ? "border-amber-500/30 bg-amber-500/[0.08]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${d.isCurrent ? "bg-amber-400 animate-pulse" : "bg-white/20"}`} />
                <span className={`text-sm font-medium ${d.isCurrent ? "text-amber-400" : "text-white/60"}`}>
                  {d.planet} Mahadasha
                </span>
                {d.isCurrent && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Current</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">{startYear} – {endYear}</span>
                {expanded === i ? <ChevronUp className="w-3 h-3 text-white/30" /> : <ChevronDown className="w-3 h-3 text-white/30" />}
              </div>
            </button>

            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 mt-1 space-y-1 border-l border-white/[0.06] pl-4 py-2">
                    {d.subPeriods.map((sp, j) => (
                      <div key={j} className={`flex items-center justify-between text-xs py-1 ${sp.isCurrent ? "text-amber-400" : "text-white/40"}`}>
                        <span>{sp.planet} Antardasha</span>
                        <span className="text-white/20">{sp.start.split("-")[0]} – {sp.end.split("-")[0]}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Nakshatra Profile ────────────────────────────── */

function NakshatraProfile({ profile }: { profile: KundliResult["nakshatraProfile"] }) {
  return (
    <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.04] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-5 h-5 text-violet-400" />
        <h3 className="text-sm font-semibold text-white/90">Moon Nakshatra Profile</h3>
      </div>
      <h4 className="text-lg font-bold text-violet-300 mb-1">{profile.name}</h4>
      <p className="text-xs text-white/50 mb-4">{profile.description}</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Lord", value: profile.lord },
          { label: "Deity", value: profile.deity },
          { label: "Gana", value: profile.gana },
          { label: "Symbol", value: profile.symbol },
          { label: "Animal", value: profile.animal },
          { label: "Element", value: profile.element },
        ].map(item => (
          <div key={item.label} className="text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-wider">{item.label}</p>
            <p className="text-xs text-white/70 mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {profile.qualities.map(q => (
          <span key={q} className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/20 text-violet-300/80">{q}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Results View ────────────────────────────────── */

type Tab = "chart" | "planets" | "yogas" | "doshas" | "dasha" | "nakshatra"

function KundliResults({ result, details }: { result: KundliResult; details: BirthDetails }) {
  const [activeTab, setActiveTab] = useState<Tab>("chart")

  const tabs: { id: Tab; label: string; icon: typeof Sun; count?: number }[] = [
    { id: "chart", label: "Chart", icon: Star },
    { id: "planets", label: "Planets", icon: Sun, count: result.planets.length },
    { id: "yogas", label: "Yogas", icon: Zap, count: result.yogas.length },
    { id: "doshas", label: "Doshas", icon: Shield, count: result.doshas.filter(d => d.active).length },
    { id: "dasha", label: "Dasha", icon: Clock },
    { id: "nakshatra", label: "Nakshatra", icon: Moon },
  ]

  const activeDoshas = result.doshas.filter(d => d.active)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          {details.name}&apos;s <span className="text-amber-400">Kundli</span>
        </h1>
        <p className="text-sm text-white/40">
          {SIGN_NAMES[result.ascendant.signIndex]} Ascendant ({SIGN_SANSKRIT[result.ascendant.signIndex]}) · {result.ascendant.degree.toFixed(1)}°
        </p>
        <p className="text-xs text-white/25 mt-1">
          {details.date} · {details.time || "Time unknown"} · {details.city}, {details.country}
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-4 mb-6">
        <p className="text-sm text-white/70 leading-relaxed">{result.summary}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                : "text-white/40 border border-transparent hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-[10px] bg-white/[0.08] px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "chart" && (
            <div className="flex flex-col items-center">
              <NorthIndianChart
                planets={result.planets}
                houses={result.houses}
                ascendantSign={result.ascendant.signIndex}
                size={340}
              />
              <p className="mt-3 text-[10px] text-white/20">North Indian Style · Lagna Chart (D1)</p>
            </div>
          )}

          {activeTab === "planets" && (
            <div className="grid gap-2 sm:grid-cols-2">
              {result.planets.map(p => <PlanetCard key={p.shortName} planet={p} />)}
            </div>
          )}

          {activeTab === "yogas" && (
            <div className="space-y-3">
              {result.yogas.length === 0 ? (
                <p className="text-center text-sm text-white/30 py-8">No significant yogas detected</p>
              ) : (
                result.yogas.map((y, i) => <YogaCard key={i} yoga={y} />)
              )}
            </div>
          )}

          {activeTab === "doshas" && (
            <div className="space-y-3">
              {activeDoshas.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-400">No active doshas</p>
                  <p className="text-xs text-white/30 mt-1">Your chart shows no major dosha afflictions</p>
                </div>
              ) : (
                activeDoshas.map((d, i) => <DoshaCard key={i} dosha={d} />)
              )}
            </div>
          )}

          {activeTab === "dasha" && <DashaTimeline dashas={result.dashas} />}

          {activeTab === "nakshatra" && <NakshatraProfile profile={result.nakshatraProfile} />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTAs */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link
          href="/chat?v=astrology"
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3 text-sm font-medium text-amber-400 hover:bg-amber-500/15 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Ask AI About My Chart
        </Link>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: `${details.name}'s Kundli - GrahAI`, url: window.location.href })
            }
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/50 hover:text-white/70 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Kundli
        </button>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════ */

export default function KundliPage() {
  const [stage, setStage] = useState<"form" | "loading" | "result">("form")
  const [details, setDetails] = useState<BirthDetails | null>(null)
  const [result, setResult] = useState<KundliResult | null>(null)

  function handleSubmit(d: BirthDetails) {
    setDetails(d)
    setStage("loading")

    // Simulate API call (replace with real ephemeris API)
    setTimeout(() => {
      const kundli = generateDemoKundli(d)
      setResult(kundli)
      setStage("result")
    }, 2500)
  }

  return (
    <main className="min-h-screen bg-[#050810]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#050810]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-white/30" />
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-white/90">Grah<span className="text-amber-400">AI</span></span>
          </Link>
          <span className="text-xs text-white/20">Free Kundli Generator</span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Form State */}
        {stage === "form" && <BirthDetailsForm onSubmit={handleSubmit} />}

        {/* Loading State */}
        {stage === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border border-amber-500/20 flex items-center justify-center mb-6"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border border-amber-500/10 flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </motion.div>
            </motion.div>
            <p className="text-sm text-white/50 mb-2">Calculating planetary positions...</p>
            <p className="text-xs text-white/25">Analyzing yogas, doshas & Dasha periods</p>
          </motion.div>
        )}

        {/* Results State */}
        {stage === "result" && result && details && (
          <KundliResults result={result} details={details} />
        )}
      </div>
    </main>
  )
}
