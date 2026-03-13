/* ════════════════════════════════════════════════════════
   GrahAI — Shadbala Calculation Engine
   Six-Fold Planetary Strength Analysis (BPHS Chapter 27)

   Implements classical Shadbala system from Brihat Parashara
   Hora Shastra with all 6 components: Sthana, Dig, Kala,
   Cheshta, Naisargika, and Drig Bala.
   ════════════════════════════════════════════════════════ */

import type {
  PlanetName, NatalChart, PlanetData, ZodiacSign, SignInfo,
} from "./types"
import {
  SIGNS, EXALTATION, DEBILITATION, OWN_SIGNS, MOOLATRIKONA,
  NATURAL_FRIENDSHIPS, SPECIAL_ASPECTS, KENDRA_HOUSES, TRIKONA_HOUSES,
  DASHA_YEARS, getSignFromLongitude, getDegreeInSign, getHouseNumber,
} from "./constants"

// ═══════════════════════════════════════════════════════════════════════════
// ─── Type Definitions ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export interface ShadBalaResult {
  planet: PlanetName
  sthanaBala: {
    uchchaBala: number           // Exaltation strength (0-60)
    saptavargajaBala: number     // Divisional dignity strength (0-30)
    ojhayugmaBala: number        // Odd-Even sign strength (0-15)
    kendradiBala: number         // House classification strength (0-60)
    drekkanaBala: number         // Decanate strength (0-15)
    total: number                // Sum of all Sthana components
  }
  digBala: number                // Directional strength (0-60)
  kalaBala: {
    nathonnataBala: number       // Day/Night strength (0-60)
    pakshaBala: number           // Lunar phase strength (0-60)
    tribhagaBala: number         // Time division strength (0-60)
    horaBala: number             // Hora strength (0-60)
    total: number                // Sum of all Kala components
  }
  cheshtaBala: number            // Motional strength (0-60)
  naisargikaBala: number         // Natural strength (fixed per planet)
  drigBala: number               // Aspectual strength (can be negative)
  totalShadbala: number          // Sum of all 6 Balas in Shashtiamsas
  shadbalaRupa: number           // totalShadbala / 60 (Rupas)
  isStrong: boolean              // Above minimum threshold for planet
  strengthLabel: "Very Strong" | "Strong" | "Average" | "Weak" | "Very Weak"
  percentile: number             // 0-100 relative strength
}

// ─── Minimum Required Shadbala (in Rupas) for Strength ──────────────────
const MINIMUM_SHADBALA_RUPAS: Record<PlanetName, number> = {
  Sun: 6.5,
  Moon: 6.0,
  Mars: 5.0,
  Mercury: 7.0,
  Jupiter: 6.5,
  Venus: 5.5,
  Saturn: 5.0,
  Rahu: 6.0,
  Ketu: 6.0,
}

// ─── Natural Strength Values (Naisargika Bala) ────────────────────────────
const NAISARGIKA_VALUES: Record<PlanetName, number> = {
  Sun: 60,      // Outermost position = highest natural strength
  Moon: 51.43,
  Mars: 17.14,
  Mercury: 25.71,
  Jupiter: 34.29,
  Venus: 42.86,
  Saturn: 8.57, // Innermost = lowest natural strength
  Rahu: 25.0,   // Approximate
  Ketu: 25.0,   // Approximate
}

// ─── Average Daily Planetary Motions (degrees/day) ──────────────────────
const AVERAGE_MOTION: Record<PlanetName, number> = {
  Sun: 1.0,
  Moon: 13.176,
  Mars: 0.524,
  Mercury: 1.383,
  Jupiter: 0.083,
  Venus: 1.2,
  Saturn: 0.033,
  Rahu: 0.0330,  // ~3.17 minutes of arc per day (retrograde)
  Ketu: 0.0330,
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Helper Functions ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Find planet in chart by name
 */
function getPlanet(chart: NatalChart, name: PlanetName): PlanetData {
  const planet = chart.planets.find(p => p.name === name)
  if (!planet) {
    throw new Error(`Planet ${name} not found in chart`)
  }
  return planet
}

/**
 * Get shortest arc distance between two longitudes
 * Returns value 0-180 degrees
 */
function getShortestArcDistance(long1: number, long2: number): number {
  let distance = Math.abs(long1 - long2)
  if (distance > 180) {
    distance = 360 - distance
  }
  return distance
}

/**
 * Get absolute longitude from sign index + degree within sign
 */
function getLongitudeFromSignDegree(signIndex: number, degreeInSign: number): number {
  return signIndex * 30 + degreeInSign
}

/**
 * Extract time components from "HH:MM:SS" format
 */
function parseTime(timeStr: string): { hours: number, minutes: number, seconds: number } {
  const [h, m, s] = timeStr.split(":").map(Number)
  return { hours: h || 0, minutes: m || 0, seconds: s || 0 }
}

/**
 * Get time in hours from midnight (0-24)
 */
function getHoursFromMidnight(timeStr: string): number {
  const { hours, minutes, seconds } = parseTime(timeStr)
  return hours + minutes / 60 + seconds / 3600
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Sthana Bala (Positional Strength) ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Uchcha Bala: Strength based on distance from exaltation point
 * Max 60 at exact exaltation, 0 at debilitation (opposite)
 *
 * Formula: (180 - |planet_long - exaltation_long|) / 3
 * where distance is shortest arc
 *
 * BPHS 27.7-8
 */
function calculateUchchaBala(planet: PlanetData, planetName: PlanetName): number {
  // Skip for Rahu/Ketu
  if (planetName === "Rahu" || planetName === "Ketu") {
    return 0
  }

  const exaltation = EXALTATION[planetName]
  const exaltationLong = getLongitudeFromSignDegree(exaltation.sign, exaltation.degree)
  const distance = getShortestArcDistance(planet.longitude, exaltationLong)

  // Max at exaltation (distance 0) = 60
  // Min at debilitation (distance 180) = 0
  // Linear interpolation
  const uchcha = Math.max(0, (180 - distance) / 3)
  return Math.round(uchcha * 100) / 100
}

/**
 * Saptavargaja Bala: Strength from divisional chart dignity
 * Simplified to D1 (Rashi) chart only
 *
 * Scores (max 30):
 * - Exalted: 30
 * - Moolatrikona: 22.5
 * - Own sign: 20
 * - Friend's sign: 15
 * - Neutral: 10
 * - Enemy: 7.5
 * - Debilitated: 3.75
 *
 * BPHS 27.9-10
 */
function calculateSaptavargajaBala(planet: PlanetData): number {
  const dignity = planet.dignity

  const scoreMap: Record<string, number> = {
    exalted: 30,
    moolatrikona: 22.5,
    own: 20,
    friendly: 15,
    neutral: 10,
    enemy: 7.5,
    debilitated: 3.75,
  }

  return scoreMap[dignity] || 10
}

/**
 * Ojhayugma Bala: Strength from sign gender matching
 * Male planets gain strength in odd-numbered signs (which have male gender)
 * Female planets in even-numbered signs
 *
 * Male planets: Sun, Mars, Jupiter (prefer signs 0,2,4,6,8,10 = odd Aries, Gemini, Leo, etc.)
 * Female planets: Moon, Venus (prefer signs 1,3,5,7,9,11 = even Taurus, Cancer, Virgo, etc.)
 * Mercury: Neutral = always 0 in this calculation
 * Saturn: Neutral = always 0 in this calculation
 *
 * Award: 15 Shashtiamsas if matched, else 0
 *
 * BPHS 27.11-12
 */
function calculateOjhayugmaBala(planet: PlanetData, planetName: PlanetName): number {
  const signIndex = planet.sign.index

  // Male planets: Sun, Mars, Jupiter prefer odd Aries, Gemini, Leo... (signs 0,2,4,6,8,10)
  const maleOddSigns = [0, 2, 4, 6, 8, 10]
  // Female planets: Moon, Venus prefer even Taurus, Cancer... (signs 1,3,5,7,9,11)
  const femaleEvenSigns = [1, 3, 5, 7, 9, 11]

  const maleplanets: PlanetName[] = ["Sun", "Mars", "Jupiter"]
  const femalePlanets: PlanetName[] = ["Moon", "Venus"]

  if (maleplanets.includes(planetName)) {
    return maleOddSigns.includes(signIndex) ? 15 : 0
  } else if (femalePlanets.includes(planetName)) {
    return femaleEvenSigns.includes(signIndex) ? 15 : 0
  } else {
    // Mercury, Saturn are neutral
    return 0
  }
}

/**
 * Kendradi Bala: Strength from house classification
 *
 * Kendra houses (1,4,7,10): 60 Shashtiamsas
 * Panapara houses (2,5,8,11): 30 Shashtiamsas
 * Apoklima houses (3,6,9,12): 15 Shashtiamsas
 *
 * BPHS 27.13-14
 */
function calculateKendradiBala(planet: PlanetData): number {
  const house = planet.house

  if (KENDRA_HOUSES.includes(house)) {
    return 60
  } else if ([2, 5, 8, 11].includes(house)) {
    return 30  // Panapara
  } else {
    return 15  // Apoklima (3,6,9,12)
  }
}

/**
 * Drekkana Bala: Strength from decanate position
 * Each sign has 3 decanates of 10 degrees each
 *
 * First decanate (0-10°): Male planets gain 15
 * Second decanate (10-20°): Neutral
 * Third decanate (20-30°): Female planets gain 15
 *
 * Male: Sun, Mars, Jupiter
 * Female: Moon, Venus
 * Neutral: Mercury, Saturn, Rahu, Ketu
 *
 * BPHS 27.15-16
 */
function calculateDrekkanaBala(planet: PlanetData, planetName: PlanetName): number {
  const degreeInSign = planet.degree
  const maleplanets: PlanetName[] = ["Sun", "Mars", "Jupiter"]
  const femalePlanets: PlanetName[] = ["Moon", "Venus"]

  if (degreeInSign < 10) {
    // First decanate
    return maleplanets.includes(planetName) ? 15 : 0
  } else if (degreeInSign >= 10 && degreeInSign < 20) {
    // Second decanate
    return 0
  } else {
    // Third decanate
    return femalePlanets.includes(planetName) ? 15 : 0
  }
}

/**
 * Calculate total Sthana Bala (5 components)
 */
function calculateSthanaBala(planet: PlanetData, planetName: PlanetName) {
  const uchcha = calculateUchchaBala(planet, planetName)
  const saptavargaja = calculateSaptavargajaBala(planet)
  const ojhayugma = calculateOjhayugmaBala(planet, planetName)
  const kendradi = calculateKendradiBala(planet)
  const drekkana = calculateDrekkanaBala(planet, planetName)

  const total = uchcha + saptavargaja + ojhayugma + kendradi + drekkana

  return {
    uchchaBala: uchcha,
    saptavargajaBala: saptavargaja,
    ojhayugmaBala: ojhayugma,
    kendradiBala: kendradi,
    drekkanaBala: drekkana,
    total: Math.round(total * 100) / 100,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Dig Bala (Directional Strength) ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dig Bala: Strength from planetary position in best directional house
 *
 * Each planet has a direction of maximum strength:
 * - Sun & Mars: 10th house (South/Zenith) — max 60
 * - Jupiter & Mercury: 1st house (East/Ascendant) — max 60
 * - Moon & Venus: 4th house (North/Nadir) — max 60
 * - Saturn: 7th house (West/Descendant) — max 60
 *
 * Formula: Based on distance from weakest house (opposite).
 * Simplified: (house_distance_from_weak) / 6 * 60, capped at 60
 *
 * BPHS 27.17-21
 */
function calculateDigBala(planet: PlanetData, planetName: PlanetName): number {
  const house = planet.house
  let strongestHouse: number
  let weakestHouse: number

  // Determine strongest and weakest houses
  switch (planetName) {
    case "Sun":
    case "Mars":
      strongestHouse = 10
      weakestHouse = 4
      break
    case "Jupiter":
    case "Mercury":
      strongestHouse = 1
      weakestHouse = 7
      break
    case "Moon":
    case "Venus":
      strongestHouse = 4
      weakestHouse = 10
      break
    case "Saturn":
      strongestHouse = 7
      weakestHouse = 1
      break
    case "Rahu":
    case "Ketu":
      // No specific direction; treat as neutral
      return 30  // Mid-range
    default:
      return 30
  }

  // Calculate distance from weakest house (on a 12-house circle)
  // Distance is measured as minimum arc: max 6 houses
  let distance = Math.abs(house - weakestHouse)
  if (distance > 6) {
    distance = 12 - distance
  }

  // Formula: (distance / 6) * 60, capped at 60
  const digBala = (distance / 6) * 60
  return Math.round(Math.min(digBala, 60) * 100) / 100
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Kala Bala (Temporal Strength) ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Nathonnatha Bala: Diurnal/Nocturnal strength
 *
 * Diurnal planets (Sun, Jupiter, Venus): Gain strength during day (6 AM - 6 PM)
 * Nocturnal planets (Moon, Mars, Saturn): Gain strength during night
 * Mercury: Neutral = always 60
 *
 * Simplified: If birth time is between 6 AM and 6 PM, diurnal get 60, nocturnal get 0.
 * Otherwise, reverse.
 *
 * BPHS 27.22-23
 */
function calculateNathonnataBala(chart: NatalChart, planetName: PlanetName): number {
  const hoursFromMidnight = getHoursFromMidnight(chart.birthTime)
  const isDaylight = hoursFromMidnight >= 6 && hoursFromMidnight < 18

  const diurnalPlanets: PlanetName[] = ["Sun", "Jupiter", "Venus"]
  const nocturnalPlanets: PlanetName[] = ["Moon", "Mars", "Saturn"]

  if (planetName === "Mercury" || planetName === "Rahu" || planetName === "Ketu") {
    return 60  // Neutral
  }

  if (diurnalPlanets.includes(planetName)) {
    return isDaylight ? 60 : 0
  } else if (nocturnalPlanets.includes(planetName)) {
    return isDaylight ? 0 : 60
  }

  return 60
}

/**
 * Paksha Bala: Lunar phase strength
 *
 * Determined by Sun-Moon elongation (angular distance).
 * Shukla Paksha (Waxing): Moon ahead of Sun by 0-180°
 * Krishna Paksha (Waning): Moon ahead of Sun by 180-360° (or behind by 0-180°)
 *
 * Benefics (Jupiter, Venus, Mercury when benefic, waxing Moon): Gain strength in Shukla Paksha
 * Malefics (Mars, Saturn, waning Moon): Gain strength in Krishna Paksha
 *
 * Formula:
 * - In Shukla: benefic = elongation/3, malefic = (360-elongation)/3
 * - In Krishna: malefic = (360-elongation)/3, benefic = (360-elongation)/3
 * Capped at 60
 *
 * BPHS 27.24-25
 */
function calculatePakshaBala(chart: NatalChart, planetName: PlanetName): number {
  const sun = getPlanet(chart, "Sun")
  const moon = getPlanet(chart, "Moon")

  // Calculate elongation: Moon ahead of Sun
  let elongation = moon.longitude - sun.longitude
  if (elongation < 0) {
    elongation += 360
  }
  elongation = elongation % 360

  // Determine lunar phase
  const isShukla = elongation >= 0 && elongation <= 180

  // Classify planets
  const benefics: PlanetName[] = ["Jupiter", "Venus", "Mercury"]
  const malefics: PlanetName[] = ["Mars", "Saturn"]

  let paksha = 0

  if (benefics.includes(planetName)) {
    // Benefic: Strong in Shukla
    if (isShukla) {
      paksha = elongation / 3
    } else {
      paksha = (360 - elongation) / 3
    }
  } else if (malefics.includes(planetName)) {
    // Malefic: Strong in Krishna
    if (isShukla) {
      paksha = (360 - elongation) / 3
    } else {
      paksha = elongation / 3
    }
  } else if (planetName === "Sun") {
    return 30  // Sun is neutral
  } else if (planetName === "Moon") {
    // Moon's own strength depends on waxing/waning
    return isShukla ? 60 : 30
  } else {
    // Rahu, Ketu: Neutral
    return 30
  }

  return Math.round(Math.min(paksha, 60) * 100) / 100
}

/**
 * Tribhaga Bala: Strength from time division
 *
 * Day (sunrise to sunset) divided into 3 equal parts:
 * - First third: Jupiter rules — gets 60
 * - Second third: Mercury rules — gets 60
 * - Third third: Saturn rules — gets 60
 *
 * Night (sunset to sunrise) divided into 3 equal parts:
 * - First third: Moon rules — gets 60
 * - Second third: Venus rules — gets 60
 * - Third third: Mars rules — gets 60
 *
 * Other planets get 0 unless they are rulers.
 *
 * For simplified calculation, we'll approximate using hour of day.
 * Sunrise ~ 6 AM, Sunset ~ 6 PM
 *
 * BPHS 27.26-27
 */
function calculateTribhagaBala(chart: NatalChart, planetName: PlanetName): number {
  const hoursFromMidnight = getHoursFromMidnight(chart.birthTime)

  // Simplified: Day is 6 AM - 6 PM, Night is 6 PM - 6 AM
  let hourInDay: number
  let isDay: boolean

  if (hoursFromMidnight >= 6 && hoursFromMidnight < 18) {
    // Daytime: 12 hours
    isDay = true
    hourInDay = hoursFromMidnight - 6
  } else {
    // Nighttime: 12 hours
    isDay = false
    hourInDay = hoursFromMidnight < 6
      ? hoursFromMidnight + (24 - 6)  // e.g., 2 AM = 2 + 18 = 20 hours from 6 PM
      : hoursFromMidnight - 18        // e.g., 8 PM = 8 - 18 = -10 ... wait
    // Fix: 6 PM (18:00) = 0, midnight (0:00) = 6, 6 AM (6:00) = 12
    hourInDay = hoursFromMidnight < 6
      ? hoursFromMidnight + 18  // 0 AM to 6 AM
      : hoursFromMidnight - 6   // 6 PM to midnight
  }

  // Divide into thirds
  const thirdDuration = 4  // 12 hours / 3
  const third = Math.floor(hourInDay / thirdDuration)

  if (isDay) {
    // Day: Jupiter (0), Mercury (1), Saturn (2)
    const dayRulers: PlanetName[] = ["Jupiter", "Mercury", "Saturn"]
    return dayRulers[third % 3] === planetName ? 60 : 0
  } else {
    // Night: Moon (0), Venus (1), Mars (2)
    const nightRulers: PlanetName[] = ["Moon", "Venus", "Mars"]
    return nightRulers[third % 3] === planetName ? 60 : 0
  }
}

/**
 * Hora Bala: Strength from Hora lord (hourly lord)
 *
 * The day is divided into 24 Horas, each ruled by a planet in sequence:
 * Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars (repeating)
 *
 * Hora lord at birth time gets 60 Shashtiamsas.
 *
 * Each Hora is 1 hour (60 minutes).
 * Hour 0 (midnight to 1 AM): Depends on day lord
 * For simplification: Calculate hour of day, then map to planeta
 *
 * BPHS 27.28-29
 */
function calculateHoraBala(chart: NatalChart, planetName: PlanetName): number {
  // Hora sequence starting from Sunrise (or use a standard sequence)
  // Classical sequence (simplified): Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
  const horaLords: PlanetName[] = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"]

  const hoursFromMidnight = getHoursFromMidnight(chart.birthTime)
  const horaIndex = Math.floor(hoursFromMidnight) % 24
  const horaPosition = horaIndex % horaLords.length
  const currentHoraLord = horaLords[horaPosition]

  return currentHoraLord === planetName ? 60 : 0
}

/**
 * Calculate total Kala Bala (4 components)
 */
function calculateKalaBala(chart: NatalChart, planetName: PlanetName) {
  const nathonnatha = calculateNathonnataBala(chart, planetName)
  const paksha = calculatePakshaBala(chart, planetName)
  const tribhaga = calculateTribhagaBala(chart, planetName)
  const hora = calculateHoraBala(chart, planetName)

  const total = nathonnatha + paksha + tribhaga + hora

  return {
    nathonnataBala: nathonnatha,
    pakshaBala: paksha,
    tribhagaBala: tribhaga,
    horaBala: hora,
    total: Math.round(total * 100) / 100,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Cheshta Bala (Motional Strength) ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cheshta Bala: Strength based on planetary speed and motion
 *
 * For planets Mars-Saturn:
 * - Retrograde: 60 Shashtiamsas
 * - Stationary (speed near 0): 45
 * - Moving slower than average: proportional (speed / averageSpeed * 30), capped at 60
 * - Moving faster than average: proportional, capped at 60
 *
 * For Sun: Fixed at 30 (mid-range)
 * For Moon: Based on speed relative to average. (speed / 13.176) * 60, capped at 60
 * For Rahu/Ketu: Fixed at 30
 *
 * BPHS 27.30-31
 */
function calculateChestaBala(planet: PlanetData, planetName: PlanetName): number {
  // For Rahu and Ketu, fixed value
  if (planetName === "Rahu" || planetName === "Ketu") {
    return 30
  }

  // For Sun, fixed value
  if (planetName === "Sun") {
    return 30
  }

  // Retrograde: max strength
  if (planet.retrograde) {
    return 60
  }

  // For other planets, speed-based
  const speed = Math.abs(planet.speed)
  const avgSpeed = AVERAGE_MOTION[planetName] || 1

  // Stationary (near zero speed)
  if (speed < 0.01) {
    return 45
  }

  // Standard formula: (speed / avgSpeed) * 30, capped at 60
  const cheshta = (speed / avgSpeed) * 30
  return Math.round(Math.min(cheshta, 60) * 100) / 100
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Naisargika Bala (Natural Strength) ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Naisargika Bala: Fixed natural strength based on orbital distance
 * Planets farther from Sun have higher natural strength.
 *
 * Pre-calculated values (in Shashtiamsas):
 * Sun=60, Moon=51.43, Mars=17.14, Mercury=25.71, Jupiter=34.29,
 * Venus=42.86, Saturn=8.57, Rahu=25, Ketu=25
 *
 * BPHS 27.32-34
 */
function calculateNaisargikaBala(planetName: PlanetName): number {
  return NAISARGIKA_VALUES[planetName] || 30
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Drig Bala (Aspectual Strength) ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Drig Bala: Strength from aspects received from benefics and malefics
 *
 * Each planet that aspects the target planet contributes:
 * - Full aspect (benefic): +60
 * - 3/4 aspect (partial benefic): +45
 * - 1/2 aspect: +30
 * - 1/4 aspect: +15
 * - And negative values for malefics
 *
 * Benefics: Jupiter (full), Venus (3/4), Mercury (1/2), waxing Moon (1/4)
 * Malefics: Saturn (full), Mars (3/4), Sun (1/2), waning Moon (1/4)
 *
 * Final Drig Bala = (sum of aspects) / 4
 *
 * BPHS 27.35-38
 */
function calculateDrigBala(chart: NatalChart, targetPlanet: PlanetData, targetName: PlanetName): number {
  let drigBalaRaw = 0

  const sun = getPlanet(chart, "Sun")
  const moon = getPlanet(chart, "Moon")

  // Check aspects from each planet
  for (const aspectingPlanet of chart.planets) {
    const aspectingName = aspectingPlanet.name

    // Skip self-aspects
    if (aspectingName === targetName) {
      continue
    }

    // Check if this planet aspects the target using house-based aspects
    const aspectHouses = SPECIAL_ASPECTS[aspectingName] || [7]

    // Calculate target house from aspecting planet
    const distanceInHouses = Math.abs(targetPlanet.house - aspectingPlanet.house)
    const normalizedDistance = Math.min(distanceInHouses, 12 - distanceInHouses)

    // Check if it's a full aspect (house-based)
    const isAspecting = aspectHouses.includes(normalizedDistance)

    if (!isAspecting) {
      continue
    }

    // Determine benefic or malefic and aspect strength
    const benefics: PlanetName[] = ["Jupiter", "Venus", "Mercury"]
    const malefics: PlanetName[] = ["Saturn", "Mars", "Sun"]

    let aspectStrength = 0
    let isBenefic = false

    if (benefics.includes(aspectingName)) {
      isBenefic = true
      if (aspectingName === "Jupiter") {
        aspectStrength = 60  // Full
      } else if (aspectingName === "Venus") {
        aspectStrength = 45  // 3/4
      } else if (aspectingName === "Mercury") {
        aspectStrength = 30  // 1/2
      }
    } else if (malefics.includes(aspectingName)) {
      isBenefic = false
      if (aspectingName === "Saturn") {
        aspectStrength = 60  // Full
      } else if (aspectingName === "Mars") {
        aspectStrength = 45  // 3/4
      } else if (aspectingName === "Sun") {
        aspectStrength = 30  // 1/2
      }
    } else if (aspectingName === "Moon") {
      // Check if waxing or waning
      const elongation = moon.longitude - sun.longitude
      const isWaxing = (elongation >= 0 && elongation <= 180) || elongation < -180
      if (isWaxing) {
        isBenefic = true
        aspectStrength = 15  // 1/4
      } else {
        isBenefic = false
        aspectStrength = 15  // 1/4
      }
    } else if (aspectingName === "Rahu" || aspectingName === "Ketu") {
      // Treat as malefic
      isBenefic = false
      aspectStrength = 30  // Moderate
    }

    // Add or subtract based on benefic/malefic
    drigBalaRaw += isBenefic ? aspectStrength : -aspectStrength
  }

  // Final Drig Bala = raw sum / 4, capped at reasonable range
  const drigBala = drigBalaRaw / 4
  return Math.round(drigBala * 100) / 100
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Main Calculation Function ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Shadbala for all 7 planets (excluding Rahu/Ketu from classical count)
 *
 * BPHS Chapter 27: Shadbala Pariksha
 *
 * Returns array of ShadBalaResult for Sun through Saturn
 */
export function calculateShadbala(chart: NatalChart): ShadBalaResult[] {
  const planets: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
  const results: ShadBalaResult[] = []

  for (const planetName of planets) {
    const planet = getPlanet(chart, planetName)

    // Calculate all 6 Balas
    const sthanaBala = calculateSthanaBala(planet, planetName)
    const digBala = calculateDigBala(planet, planetName)
    const kalaBala = calculateKalaBala(chart, planetName)
    const cheshtaBala = calculateChestaBala(planet, planetName)
    const naisargikaBala = calculateNaisargikaBala(planetName)
    const drigBala = calculateDrigBala(chart, planet, planetName)

    // Total Shadbala in Shashtiamsas (sum of all 6)
    const totalShadbala = sthanaBala.total + digBala + kalaBala.total + cheshtaBala + naisargikaBala + drigBala

    // Convert to Rupas
    const shadbalaRupa = totalShadbala / 60

    // Determine if planet is strong
    const minRequired = MINIMUM_SHADBALA_RUPAS[planetName]
    const isStrong = shadbalaRupa >= minRequired

    // Determine strength label
    let strengthLabel: "Very Strong" | "Strong" | "Average" | "Weak" | "Very Weak"
    if (shadbalaRupa >= minRequired + 2) {
      strengthLabel = "Very Strong"
    } else if (shadbalaRupa >= minRequired) {
      strengthLabel = "Strong"
    } else if (shadbalaRupa >= minRequired - 1) {
      strengthLabel = "Average"
    } else if (shadbalaRupa >= minRequired - 2) {
      strengthLabel = "Weak"
    } else {
      strengthLabel = "Very Weak"
    }

    // Calculate percentile (0-100 relative to max possible ~360 Shashtiamsas)
    // But more realistically, cap at ~300 for reference
    const percentile = Math.round((totalShadbala / 300) * 100)

    const result: ShadBalaResult = {
      planet: planetName,
      sthanaBala,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargikaBala,
      drigBala,
      totalShadbala: Math.round(totalShadbala * 100) / 100,
      shadbalaRupa: Math.round(shadbalaRupa * 100) / 100,
      isStrong,
      strengthLabel,
      percentile: Math.min(percentile, 100),
    }

    results.push(result)
  }

  return results
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Utility Functions ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get human-readable strength description for a planet
 */
export function getShadBalaStrength(planet: PlanetName, result: ShadBalaResult): string {
  const { shadbalaRupa, strengthLabel, isStrong } = result

  const descriptions: Record<string, string> = {
    "Very Strong": `${planet} is very strong (${shadbalaRupa.toFixed(2)} Rupas). Extremely auspicious position with full capacity to deliver results.`,
    "Strong": `${planet} is strong (${shadbalaRupa.toFixed(2)} Rupas). Well-positioned to deliver positive results.`,
    "Average": `${planet} has average strength (${shadbalaRupa.toFixed(2)} Rupas). Will deliver results with some limitations.`,
    "Weak": `${planet} is weak (${shadbalaRupa.toFixed(2)} Rupas). Results may be delayed or diminished.`,
    "Very Weak": `${planet} is very weak (${shadbalaRupa.toFixed(2)} Rupas). Significantly hampered in delivering results. Remedies recommended.`,
  }

  return descriptions[strengthLabel] || "Unknown strength"
}

/**
 * Get the strongest planet from Shadbala results
 */
export function getStrongestPlanet(results: ShadBalaResult[]): PlanetName {
  return results.reduce((strongest, current) =>
    current.totalShadbala > strongest.totalShadbala ? current : strongest,
  ).planet
}

/**
 * Get the weakest planet from Shadbala results
 */
export function getWeakestPlanet(results: ShadBalaResult[]): PlanetName {
  return results.reduce((weakest, current) =>
    current.totalShadbala < weakest.totalShadbala ? current : weakest,
  ).planet
}

/**
 * Get summary of planetary strengths
 */
export function getShadBalaSummary(results: ShadBalaResult[]): {
  strong: PlanetName[],
  average: PlanetName[],
  weak: PlanetName[]
} {
  const strong: PlanetName[] = []
  const average: PlanetName[] = []
  const weak: PlanetName[] = []

  for (const result of results) {
    if (result.isStrong) {
      strong.push(result.planet)
    } else if (result.strengthLabel === "Average") {
      average.push(result.planet)
    } else {
      weak.push(result.planet)
    }
  }

  return { strong, average, weak }
}
