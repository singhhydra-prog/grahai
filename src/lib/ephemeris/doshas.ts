/* ════════════════════════════════════════════════════════
   GrahAI — Dosha Detection Engine
   Mangal, Kaal Sarp, Pitra, Sade Sati, Chandal, Grahan

   Each dosha includes severity, cancellation conditions,
   and BPHS classical references.
   ════════════════════════════════════════════════════════ */

import type {
  NatalChart, PlanetData, PlanetName, DoshaResult, DoshaType,
} from "./types"
import { SIGNS, getHouseNumber } from "./constants"
import { getDoshaReference } from "../astrology-data/bphs-references"

// ─── Helpers ───────────────────────────────────────────

function getPlanet(chart: NatalChart, name: PlanetName): PlanetData {
  return chart.planets.find(p => p.name === name)!
}

function makeDosha(
  type: DoshaType, isPresent: boolean,
  severity: "high" | "medium" | "low" | "none",
  planets: PlanetName[], houses: number[],
  description: string, effects: string,
  cancellations: string[], remedies: string[],
  subType?: string,
): DoshaResult {
  const ref = getDoshaReference(type)
  return {
    type, isPresent, severity, subType,
    involvedPlanets: planets, involvedHouses: houses,
    description, effects, cancellations, remedies,
    classicalReference: ref || {
      source: "BPHS", chapter: 77, translation: description,
    },
  }
}

// ─── Mangal Dosha (Kuja Dosha) ─────────────────────────

/**
 * Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus.
 * Severity: High if from all three, Medium if from two, Low if from one.
 */
function detectMangalDosha(chart: NatalChart): DoshaResult {
  const mars = getPlanet(chart, "Mars")
  const moon = getPlanet(chart, "Moon")
  const venus = getPlanet(chart, "Venus")

  const mangalHouses = [1, 2, 4, 7, 8, 12]

  // Check from Lagna
  const fromLagna = mangalHouses.includes(mars.house)

  // Check from Moon
  const marsFromMoon = ((mars.house - moon.house + 12) % 12) + 1
  const fromMoon = mangalHouses.includes(marsFromMoon)

  // Check from Venus
  const marsFromVenus = ((mars.house - venus.house + 12) % 12) + 1
  const fromVenus = mangalHouses.includes(marsFromVenus)

  const count = [fromLagna, fromMoon, fromVenus].filter(Boolean).length
  const isPresent = count > 0

  // Cancellation conditions
  const cancellations: string[] = []
  // Mars in own sign (Aries/Scorpio)
  if (mars.dignity === "own" || mars.dignity === "exalted") {
    cancellations.push("Mars in own/exalted sign reduces Mangal Dosha")
  }
  // Mars in Kendra from Jupiter
  const jupiter = getPlanet(chart, "Jupiter")
  const marsFromJup = ((mars.house - jupiter.house + 12) % 12) + 1
  if ([1, 4, 7, 10].includes(marsFromJup)) {
    cancellations.push("Jupiter's Kendra position from Mars cancels dosha")
  }
  // If both partners have Mangal Dosha, it cancels
  cancellations.push("Cancelled if both partners have Mangal Dosha")

  let severity: "high" | "medium" | "low" | "none" = "none"
  if (cancellations.length > 0 && isPresent) severity = "low"
  else if (count >= 3) severity = "high"
  else if (count >= 2) severity = "medium"
  else if (count >= 1) severity = "low"

  const sources: string[] = []
  if (fromLagna) sources.push("Lagna")
  if (fromMoon) sources.push("Moon")
  if (fromVenus) sources.push("Venus")

  return makeDosha(
    "Mangal Dosha", isPresent, severity,
    ["Mars"], [mars.house],
    `Mars in house ${mars.house} — ${isPresent ? `Dosha from ${sources.join(", ")}` : "No dosha"}`,
    isPresent ? "May cause delays or conflicts in marriage and partnerships" : "No Mangal Dosha",
    cancellations,
    ["Kumbh Vivah (symbolic marriage with a pot/tree)", "Wear Red Coral (Moonga) on ring finger", "Recite Mangal Beej Mantra: Om Kram Kreem Kroum Sah Bhaumaay Namah", "Hanuman Chalisa recitation on Tuesdays", "Donate red lentils on Tuesdays"],
  )
}

// ─── Kaal Sarp Dosha ───────────────────────────────────

/**
 * All 7 planets hemmed between Rahu and Ketu.
 * 12 types based on Rahu-Ketu axis houses.
 */
function detectKaalSarpDosha(chart: NatalChart): DoshaResult {
  const rahu = getPlanet(chart, "Rahu")
  const ketu = getPlanet(chart, "Ketu")
  const others = chart.planets.filter(p => p.name !== "Rahu" && p.name !== "Ketu")

  // Check if all planets are on one side of the Rahu-Ketu axis
  const rahuLong = rahu.longitude
  const ketuLong = ketu.longitude

  // Planets between Rahu and Ketu (going clockwise)
  let allBetween = true
  for (const planet of others) {
    const pLong = planet.longitude
    // Check if planet is between Rahu and Ketu (in the shorter arc)
    let between: boolean
    if (rahuLong < ketuLong) {
      between = pLong > rahuLong && pLong < ketuLong
    } else {
      between = pLong > rahuLong || pLong < ketuLong
    }
    if (!between) {
      allBetween = false
      break
    }
  }

  // Also check the reverse direction
  let allBetweenReverse = true
  for (const planet of others) {
    const pLong = planet.longitude
    let between: boolean
    if (ketuLong < rahuLong) {
      between = pLong > ketuLong && pLong < rahuLong
    } else {
      between = pLong > ketuLong || pLong < rahuLong
    }
    if (!between) {
      allBetweenReverse = false
      break
    }
  }

  const isPresent = allBetween || allBetweenReverse

  // Determine the type (12 types based on Rahu's house)
  const kaalSarpTypes: Record<number, string> = {
    1: "Anant Kaal Sarp (1-7 axis)",
    2: "Kulik Kaal Sarp (2-8 axis)",
    3: "Vasuki Kaal Sarp (3-9 axis)",
    4: "Shankhpal Kaal Sarp (4-10 axis)",
    5: "Padma Kaal Sarp (5-11 axis)",
    6: "Mahapadma Kaal Sarp (6-12 axis)",
    7: "Takshak Kaal Sarp (7-1 axis)",
    8: "Karkotak Kaal Sarp (8-2 axis)",
    9: "Shankhchud Kaal Sarp (9-3 axis)",
    10: "Ghatak Kaal Sarp (10-4 axis)",
    11: "Vishdhar Kaal Sarp (11-5 axis)",
    12: "Sheshnag Kaal Sarp (12-6 axis)",
  }

  const subType = isPresent ? kaalSarpTypes[rahu.house] || "Unknown type" : undefined

  // Partial Kaal Sarp: if most planets are hemmed but 1-2 escape
  const escapeCount = allBetween ? 0 : others.filter(p => {
    const pLong = p.longitude
    if (rahuLong < ketuLong) return !(pLong > rahuLong && pLong < ketuLong)
    return !(pLong > rahuLong || pLong < ketuLong)
  }).length

  return makeDosha(
    "Kaal Sarp Dosha", isPresent, isPresent ? "high" : "none",
    ["Rahu", "Ketu"], [rahu.house, ketu.house],
    isPresent ? `${subType} — All planets between Rahu-Ketu axis` : "No Kaal Sarp Dosha",
    isPresent ? "Obstacles, delays, and karmic struggles requiring persistent effort to overcome" : "Not present",
    isPresent ? [
      "Partial cancellation if any planet conjoins Rahu or Ketu",
      "Jupiter's aspect on Rahu or Ketu reduces intensity",
      "Lessens after age 36-42 for most types",
    ] : [],
    ["Trimbakeshwar Puja (Nashik)", "Nagbali and Nag Puja", "Recite Rahu Beej Mantra: Om Bhram Bhreem Bhroum Sah Rahave Namah", "Visit Kaal Sarp temples on Nag Panchami", "Donate black sesame seeds on Saturdays"],
    subType,
  )
}

// ─── Pitra Dosha ───────────────────────────────────────

/**
 * Sun afflicted in 9th house, or 9th lord with Rahu/Saturn/Ketu.
 * Indicates ancestral karmic debts.
 */
function detectPitraDosha(chart: NatalChart): DoshaResult {
  const sun = getPlanet(chart, "Sun")
  const saturn = getPlanet(chart, "Saturn")
  const rahu = getPlanet(chart, "Rahu")
  const ketu = getPlanet(chart, "Ketu")
  const ninthLord = chart.planets.find(p => {
    const ninthSignIndex = (chart.ascendantSign.index + 8) % 12
    return SIGNS[ninthSignIndex].lord === p.name
  })!

  const conditions: string[] = []

  // Sun in 9th with malefics
  if (sun.house === 9) {
    if (saturn.house === 9 || rahu.house === 9) {
      conditions.push("Sun afflicted in 9th house")
    }
  }

  // 9th lord conjoined with Rahu
  if (ninthLord.house === rahu.house) {
    conditions.push("9th lord conjoined with Rahu")
  }

  // 9th lord conjoined with Saturn
  if (ninthLord.house === saturn.house) {
    conditions.push("9th lord conjoined with Saturn")
  }

  // Sun-Saturn conjunction
  if (sun.house === saturn.house) {
    conditions.push("Sun-Saturn conjunction")
  }

  // Sun-Rahu conjunction
  if (sun.house === rahu.house) {
    conditions.push("Sun-Rahu conjunction (Grahan on father karaka)")
  }

  const isPresent = conditions.length > 0
  const severity = conditions.length >= 3 ? "high" : conditions.length >= 2 ? "medium" : conditions.length === 1 ? "low" : "none"

  return makeDosha(
    "Pitra Dosha", isPresent, severity,
    ["Sun", "Saturn", "Rahu"].filter(p => conditions.some(c => c.includes(p))) as PlanetName[],
    [9, sun.house],
    isPresent ? `Pitra Dosha: ${conditions.join("; ")}` : "No Pitra Dosha detected",
    isPresent ? "Ancestral karmic debt — may affect family prosperity, father's health, or progeny" : "Not present",
    ["Performing Shraddha rituals regularly reduces Pitra Dosha", "Feeding Brahmins on Amavasya", "Worship of Lord Vishnu for 9th house blessings"],
    ["Perform Shraddha and Tarpan on Amavasya", "Donate food and clothes on father's death anniversary", "Pind Daan at Gaya or Varanasi", "Recite Pitru Suktam or Garuda Purana chapters", "Plant a Peepal tree and water it regularly"],
  )
}

// ─── Sade Sati ─────────────────────────────────────────

/**
 * Saturn transiting through 12th, 1st, and 2nd from natal Moon.
 * Lasts approximately 7.5 years (2.5 years per sign).
 *
 * Note: This checks the natal chart (if Saturn is in those positions at birth).
 * For transit-based Sade Sati, use the transit engine.
 */
function detectSadeSatiNatal(chart: NatalChart): DoshaResult {
  const saturn = getPlanet(chart, "Saturn")
  const moon = getPlanet(chart, "Moon")

  const satFromMoon = ((saturn.house - moon.house + 12) % 12) + 1
  // 12th, 1st, 2nd from Moon = houses 12, 1, 2 relative to Moon
  const inSadeSati = satFromMoon === 12 || satFromMoon === 1 || satFromMoon === 2

  let phase = ""
  if (satFromMoon === 12) phase = "Rising (12th from Moon)"
  if (satFromMoon === 1) phase = "Peak (conjunct Moon)"
  if (satFromMoon === 2) phase = "Setting (2nd from Moon)"

  return makeDosha(
    "Sade Sati", inSadeSati, inSadeSati ? "medium" : "none",
    ["Saturn", "Moon"], [saturn.house, moon.house],
    inSadeSati ? `Saturn in ${phase} at birth — born during Sade Sati` : "Not born during Sade Sati",
    inSadeSati ? "Karmic lessons through challenges — period of deep transformation and maturity" : "Not applicable at birth",
    inSadeSati ? [
      "Jupiter's aspect on Saturn or Moon reduces severity",
      "Saturn in own or exalted sign makes Sade Sati more productive",
      "Strong Moon (bright, in good dignity) handles Sade Sati better",
    ] : [],
    ["Recite Shani Beej Mantra: Om Pram Preem Proum Sah Shanaye Namah", "Donate mustard oil on Saturdays", "Wear Blue Sapphire (Neelam) only after proper consultation", "Light sesame oil lamp under Peepal tree on Saturdays", "Hanuman Chalisa recitation for Saturn's grace"],
  )
}

// ─── Chandal Yoga (Guru-Chandal) ──────────────────────

/**
 * Jupiter conjoined with Rahu or Ketu.
 * Affects wisdom, dharma, and guru relationships.
 */
function detectChandalYoga(chart: NatalChart): DoshaResult {
  const jupiter = getPlanet(chart, "Jupiter")
  const rahu = getPlanet(chart, "Rahu")
  const ketu = getPlanet(chart, "Ketu")

  const withRahu = jupiter.house === rahu.house
  const withKetu = jupiter.house === ketu.house
  const isPresent = withRahu || withKetu
  const node = withRahu ? "Rahu" : "Ketu"

  return makeDosha(
    "Chandal Yoga", isPresent,
    isPresent ? (jupiter.dignity === "exalted" || jupiter.dignity === "own" ? "low" : "medium") : "none",
    isPresent ? ["Jupiter", node] : [],
    [jupiter.house],
    isPresent ? `Jupiter conjoined with ${node} in house ${jupiter.house}` : "No Chandal Yoga",
    isPresent ? "Unconventional beliefs, challenges with teachers or religion, but can give material gains through unorthodox means" : "Not present",
    isPresent ? [
      "Jupiter in own/exalted sign reduces negativity significantly",
      "Aspected by benefics provides further relief",
    ] : [],
    ["Recite Guru Beej Mantra: Om Gram Greem Groum Sah Gurave Namah", "Donate yellow items on Thursdays (turmeric, yellow cloth, bananas)", "Worship at Jupiter/Brihaspati temples on Thursdays", "Wear Yellow Sapphire (Pukhraj) after consultation"],
  )
}

// ─── Grahan Yoga (Eclipse) ─────────────────────────────

/**
 * Sun or Moon conjoined with Rahu or Ketu.
 * Eclipse of the luminary's significations.
 */
function detectGrahanYoga(chart: NatalChart): DoshaResult {
  const sun = getPlanet(chart, "Sun")
  const moon = getPlanet(chart, "Moon")
  const rahu = getPlanet(chart, "Rahu")
  const ketu = getPlanet(chart, "Ketu")

  const conditions: string[] = []
  const planets: PlanetName[] = []

  if (sun.house === rahu.house) { conditions.push("Sun-Rahu conjunction (Surya Grahan)"); planets.push("Sun", "Rahu") }
  if (sun.house === ketu.house) { conditions.push("Sun-Ketu conjunction"); planets.push("Sun", "Ketu") }
  if (moon.house === rahu.house) { conditions.push("Moon-Rahu conjunction (Chandra Grahan)"); planets.push("Moon", "Rahu") }
  if (moon.house === ketu.house) { conditions.push("Moon-Ketu conjunction"); planets.push("Moon", "Ketu") }

  const isPresent = conditions.length > 0

  return makeDosha(
    "Grahan Yoga", isPresent,
    conditions.length >= 2 ? "high" : isPresent ? "medium" : "none",
    [...new Set(planets)],
    [...new Set([sun.house, moon.house, rahu.house, ketu.house])],
    isPresent ? `Grahan Yoga: ${conditions.join("; ")}` : "No Grahan Yoga",
    isPresent ? "Eclipsed luminary affects vitality (Sun) or emotional well-being (Moon)" : "Not present",
    ["Strong luminary in good dignity reduces impact", "Jupiter's aspect provides protection"],
    ["Chandra Grahan: Donate white items on Mondays, worship Lord Shiva", "Surya Grahan: Donate wheat, jaggery on Sundays, Surya Namaskar", "Recite Rahu mantra for Rahu-related Grahan", "Perform Grahan Dosha Nivaran Puja"],
  )
}

// ─── Master Dosha Detection ────────────────────────────

/**
 * Run all dosha detection algorithms on a natal chart.
 */
export function analyzeAllDoshas(chart: NatalChart): DoshaResult[] {
  return [
    detectMangalDosha(chart),
    detectKaalSarpDosha(chart),
    detectPitraDosha(chart),
    detectSadeSatiNatal(chart),
    detectChandalYoga(chart),
    detectGrahanYoga(chart),
  ]
}

/**
 * Get only active (present) doshas.
 */
export function getActiveDoshas(chart: NatalChart): DoshaResult[] {
  return analyzeAllDoshas(chart).filter(d => d.isPresent)
}
