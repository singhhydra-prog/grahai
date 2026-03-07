/* ════════════════════════════════════════════════════════
   GrahAI — Panchang (Hindu Calendar) Engine

   Calculates the five limbs (Panchangam) of the Vedic calendar:
   1. Tithi  — Lunar day (30 per month)
   2. Vara   — Weekday (7 days, each ruled by a planet)
   3. Nakshatra — Lunar mansion (27 nakshatras)
   4. Yoga   — Sun-Moon angular combination (27 yogas)
   5. Karana  — Half of a Tithi (60 per month, 11 types)

   Based on: Surya Siddhanta and BPHS Chapter 3
   ════════════════════════════════════════════════════════ */

import type { Panchang, PlanetName } from "./types"
import {
  getSunMoonAngle,
  getSunMoonSum,
  getCurrentTransitPositions,
} from "./sweph-wrapper"
import { birthDetailsToJD } from "./sweph-wrapper"
import { getNakshatraFromLongitude, NAKSHATRA_SPAN } from "./constants"

// ─── Tithi (Lunar Day) ──────────────────────────────────

const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
]

const TITHI_DEITIES = [
  "Agni", "Brahma", "Gauri", "Ganesha", "Naag",
  "Kartikeya", "Surya", "Shiva", "Durga", "Dharma",
  "Vishnu", "Hari", "Kamadeva", "Shiva", "Chandra",
  "Agni", "Brahma", "Gauri", "Ganesha", "Naag",
  "Kartikeya", "Surya", "Shiva", "Durga", "Dharma",
  "Vishnu", "Hari", "Kamadeva", "Shiva", "Pitru",
]

function calculateTithi(sunLong: number, moonLong: number): {
  name: string, number: number, paksha: string, deity: string, percentRemaining: number
} {
  // Tithi = (Moon - Sun) / 12°
  let diff = ((moonLong - sunLong) % 360 + 360) % 360
  const tithiNumber = Math.floor(diff / 12)
  const percentRemaining = ((tithiNumber + 1) * 12 - diff) / 12 * 100

  const paksha = tithiNumber < 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)"

  return {
    name: TITHI_NAMES[tithiNumber] || "Unknown",
    number: (tithiNumber % 15) + 1,
    paksha,
    deity: TITHI_DEITIES[tithiNumber] || "Unknown",
    percentRemaining: Math.round(percentRemaining * 10) / 10,
  }
}

// ─── Vara (Weekday) ─────────────────────────────────────

const VARA_DATA = [
  { name: "Ravivara (Sunday)",    lord: "Sun",     sanskrit: "रविवार" },
  { name: "Somavara (Monday)",    lord: "Moon",    sanskrit: "सोमवार" },
  { name: "Mangalavara (Tuesday)",lord: "Mars",    sanskrit: "मंगलवार" },
  { name: "Budhavara (Wednesday)",lord: "Mercury", sanskrit: "बुधवार" },
  { name: "Guruvara (Thursday)",  lord: "Jupiter", sanskrit: "गुरुवार" },
  { name: "Shukravara (Friday)",  lord: "Venus",   sanskrit: "शुक्रवार" },
  { name: "Shanivara (Saturday)", lord: "Saturn",  sanskrit: "शनिवार" },
]

function calculateVara(date: Date): { name: string, lord: string, sanskrit: string } {
  const dayIndex = date.getDay() // 0=Sunday
  return VARA_DATA[dayIndex]
}

// ─── Yoga (Sun + Moon combination) ──────────────────────

const YOGA_NAMES = [
  "Vishkambha", "Preeti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
]

const YOGA_AUSPICIOUSNESS: Record<string, "auspicious" | "inauspicious" | "mixed"> = {
  Vishkambha: "inauspicious", Preeti: "auspicious", Ayushman: "auspicious",
  Saubhagya: "auspicious", Shobhana: "auspicious", Atiganda: "inauspicious",
  Sukarma: "auspicious", Dhriti: "auspicious", Shoola: "inauspicious",
  Ganda: "inauspicious", Vriddhi: "auspicious", Dhruva: "auspicious",
  Vyaghata: "inauspicious", Harshana: "auspicious", Vajra: "mixed",
  Siddhi: "auspicious", Vyatipata: "inauspicious", Variyana: "auspicious",
  Parigha: "inauspicious", Shiva: "auspicious", Siddha: "auspicious",
  Sadhya: "auspicious", Shubha: "auspicious", Shukla: "auspicious",
  Brahma: "auspicious", Indra: "auspicious", Vaidhriti: "inauspicious",
}

function calculateYoga(sunLong: number, moonLong: number): {
  name: string, number: number, auspiciousness: string
} {
  // Yoga = (Sun + Moon sidereal longitudes) / 13°20'
  const sum = ((sunLong + moonLong) % 360 + 360) % 360
  const yogaNumber = Math.floor(sum / (800 / 60)) // 13°20' = 800' = 13.333°

  const name = YOGA_NAMES[yogaNumber] || "Unknown"

  return {
    name,
    number: yogaNumber + 1,
    auspiciousness: YOGA_AUSPICIOUSNESS[name] || "mixed",
  }
}

// ─── Karana (Half-Tithi) ────────────────────────────────

const KARANA_NAMES = [
  // 4 fixed Karanas (occur once per month)
  "Kimstughna", // Before Shukla Pratipada
  // 7 repeating Karanas (repeat 8 times = 56)
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
  // 3 fixed Karanas at end
  "Shakuni", "Chatushpada", "Naag",
]

const REPEATING_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]

function calculateKarana(sunLong: number, moonLong: number): {
  name: string, number: number, isVishti: boolean
} {
  let diff = ((moonLong - sunLong) % 360 + 360) % 360
  const karanaNumber = Math.floor(diff / 6) // Each Karana = 6°

  let name: string
  if (karanaNumber === 0) {
    name = "Kimstughna"
  } else if (karanaNumber >= 57) {
    const fixedIndex = karanaNumber - 57
    name = ["Shakuni", "Chatushpada", "Naag"][fixedIndex] || "Unknown"
  } else {
    const repeatingIndex = (karanaNumber - 1) % 7
    name = REPEATING_KARANAS[repeatingIndex]
  }

  return {
    name,
    number: karanaNumber + 1,
    isVishti: name === "Vishti", // Vishti (Bhadra) is considered inauspicious
  }
}

// ─── Rahu Kaal Calculation ──────────────────────────────

/**
 * Rahu Kaal — inauspicious period of ~1.5 hours each day.
 * Based on the day of the week and sunrise/sunset times.
 * Order: Mon=2, Sat=3, Fri=4, Wed=5, Thu=6, Tue=7, Sun=8
 * (1-indexed position in the 8 equal parts of daytime)
 */
const RAHU_KAAL_SLOTS: Record<number, number> = {
  0: 8, // Sunday — 8th slot
  1: 2, // Monday — 2nd slot
  2: 7, // Tuesday — 7th slot
  3: 5, // Wednesday — 5th slot
  4: 6, // Thursday — 6th slot
  5: 4, // Friday — 4th slot
  6: 3, // Saturday — 3rd slot
}

function calculateRahuKaal(date: Date, sunriseHour: number = 6, sunsetHour: number = 18): {
  start: string, end: string
} {
  const dayIndex = date.getDay()
  const slot = RAHU_KAAL_SLOTS[dayIndex]

  const daytimeHours = sunsetHour - sunriseHour
  const slotDuration = daytimeHours / 8

  const startHour = sunriseHour + (slot - 1) * slotDuration
  const endHour = startHour + slotDuration

  const formatTime = (h: number) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return {
    start: formatTime(startHour),
    end: formatTime(endHour),
  }
}

// ─── Gulika Kaal ────────────────────────────────────────

const GULIKA_SLOTS: Record<number, number> = {
  0: 7, // Sunday
  1: 6, // Monday
  2: 5, // Tuesday
  3: 4, // Wednesday
  4: 3, // Thursday
  5: 2, // Friday
  6: 1, // Saturday
}

function calculateGulikaKaal(date: Date, sunriseHour: number = 6, sunsetHour: number = 18): {
  start: string, end: string
} {
  const dayIndex = date.getDay()
  const slot = GULIKA_SLOTS[dayIndex]

  const daytimeHours = sunsetHour - sunriseHour
  const slotDuration = daytimeHours / 8

  const startHour = sunriseHour + (slot - 1) * slotDuration
  const endHour = startHour + slotDuration

  const formatTime = (h: number) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return {
    start: formatTime(startHour),
    end: formatTime(endHour),
  }
}

// ─── Complete Panchang Calculation ──────────────────────

/**
 * Calculate the complete Panchang for a given date and location.
 *
 * @param date - The date to calculate Panchang for
 * @param latitude - Observer's latitude (for sunrise/sunset)
 * @param longitude - Observer's longitude
 * @returns Full Panchang with all 5 limbs + Rahu Kaal + Gulika Kaal
 */
export async function calculatePanchang(
  date: Date,
  latitude: number = 28.6139, // Default: Delhi
  longitude: number = 77.2090,
): Promise<Panchang> {
  // Get current planet positions
  const transitPositions = await getCurrentTransitPositions(date)

  const sunData = transitPositions.find(p => p.name === "Sun")!
  const moonData = transitPositions.find(p => p.name === "Moon")!

  const sunLong = sunData.longitude
  const moonLong = moonData.longitude

  // Calculate all 5 limbs
  const tithi = calculateTithi(sunLong, moonLong)
  const vara = calculateVara(date)
  const nakshatra = getNakshatraFromLongitude(moonLong)
  const yoga = calculateYoga(sunLong, moonLong)
  const karana = calculateKarana(sunLong, moonLong)

  // Approximate sunrise/sunset (simplified — for production, use sweph rise/set)
  const sunriseHour = 6.0 // Approximate
  const sunsetHour = 18.0

  const rahuKaal = calculateRahuKaal(date, sunriseHour, sunsetHour)
  const gulikaKaal = calculateGulikaKaal(date, sunriseHour, sunsetHour)

  // Determine auspiciousness
  const isTithiGood = ![4, 8, 9, 14, 30].includes(tithi.number) // Avoid Chaturthi, Ashtami, Navami, Chaturdashi, Amavasya
  const isYogaGood = yoga.auspiciousness === "auspicious"
  const isKaranaGood = !karana.isVishti

  let overallAuspiciousness: "highly_auspicious" | "auspicious" | "neutral" | "inauspicious"
  const goodCount = [isTithiGood, isYogaGood, isKaranaGood].filter(Boolean).length
  if (goodCount === 3) overallAuspiciousness = "highly_auspicious"
  else if (goodCount === 2) overallAuspiciousness = "auspicious"
  else if (goodCount === 1) overallAuspiciousness = "neutral"
  else overallAuspiciousness = "inauspicious"

  // Build auspicious/inauspicious activity lists
  const auspiciousList: string[] = []
  const inauspiciousList: string[] = []
  if (overallAuspiciousness === "highly_auspicious" || overallAuspiciousness === "auspicious") {
    auspiciousList.push("Starting new ventures", "Religious ceremonies")
  }
  if (karana.isVishti) {
    inauspiciousList.push("Vishti Karana active — avoid auspicious work")
  }
  const special = getSpecialDay(tithi, vara, nakshatra)
  if (special) auspiciousList.push(special)

  return {
    date,
    var: {
      name: vara.name,
      lord: vara.lord as PlanetName,
    },
    tithi: {
      name: tithi.name,
      number: tithi.number,
      paksha: tithi.paksha as "Shukla" | "Krishna",
      lord: vara.lord as PlanetName, // tithi lord approximation
    },
    nakshatra: {
      name: nakshatra.name,
      lord: nakshatra.lord,
      pada: nakshatra.pada,
      deity: nakshatra.deity,
    } as any, // NakshatraInfo has additional fields
    yoga: {
      name: yoga.name,
      number: yoga.number,
    },
    karana: {
      name: karana.name,
      number: karana.number,
    },
    sunrise: formatApproxTime(sunriseHour),
    sunset: formatApproxTime(sunsetHour),
    moonrise: formatApproxTime(sunriseHour + 1), // approximate
    rahukaal: { start: rahuKaal.start, end: rahuKaal.end },
    gulikakaal: { start: gulikaKaal.start, end: gulikaKaal.end },
    auspicious: auspiciousList,
    inauspicious: inauspiciousList,
  }
}

// ─── Helper Utilities ───────────────────────────────────

function getSignName(longitude: number): string {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ]
  const index = Math.floor(((longitude % 360 + 360) % 360) / 30)
  return signs[index]
}

function formatApproxTime(hour: number): string {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  const period = h >= 12 ? "PM" : "AM"
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`
}

/**
 * Detect special Hindu days based on Tithi, Vara, Nakshatra.
 */
function getSpecialDay(
  tithi: { name: string, number: number, paksha: string },
  vara: { name: string, lord: string },
  nakshatra: { name: string }
): string | undefined {
  // Ekadashi fasting days
  if (tithi.number === 11) return "Ekadashi — Auspicious fasting day for Vishnu worship"

  // Amavasya (New Moon)
  if (tithi.name === "Amavasya") return "Amavasya — New Moon. Perform Pitra Tarpan."

  // Purnima (Full Moon)
  if (tithi.name === "Purnima") return "Purnima — Full Moon. Auspicious for worship and Satyanarayan Katha."

  // Chaturthi (Ganesha)
  if (tithi.number === 4) return "Chaturthi — Ganesha worship day. Avoid Moon sighting."

  // Pradosh Vrat (Trayodashi)
  if (tithi.number === 13) return "Trayodashi — Pradosh Vrat. Auspicious for Shiva worship."

  // Shivaratri (Chaturdashi of Krishna Paksha)
  if (tithi.number === 14 && tithi.paksha.includes("Krishna")) {
    return "Chaturdashi (Krishna Paksha) — Shivaratri energy. Night worship of Lord Shiva."
  }

  // Tuesday + Mars Nakshatra
  if (vara.lord === "Mars") return "Mangalvar — Hanuman worship day. Wear red."

  // Saturday
  if (vara.lord === "Saturn") return "Shanivara — Shani Dev worship. Donate mustard oil and black sesame."

  return undefined
}

// ─── Quick Panchang Summary ─────────────────────────────

/**
 * Get a quick one-line Panchang summary for display.
 */
export function getPanchangSummary(panchang: Panchang): string {
  return `${panchang.tithi.paksha} ${panchang.tithi.name} | ${panchang.nakshatra.name} Nakshatra | ${panchang.yoga.name} Yoga | ${panchang.karana.name} Karana | ${panchang.var.name}`
}
