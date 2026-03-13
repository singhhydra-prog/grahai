/*
═══════════════════════════════════════════════════════════════════════════════
GRAHA YUDDHA (Planetary War) Detection Module
GrahAI Vedic Astrology Platform
═══════════════════════════════════════════════════════════════════════════════

Classical references:
- Brihat Parashara Hora Shastra (BPHS) Chapter 17: Planetary War
- Saravali Chapter 7: Graha Yuddha
- Jataka Parijata: Planetary combinations and their effects

Graha Yuddha occurs when two eligible planets come within 1 degree of sidereal
longitude. Only the five Tara Grahas (Mars, Mercury, Jupiter, Venus, Saturn)
participate. The Sun, Moon, Rahu, and Ketu are excluded from warfare.

The winner determination follows a hierarchical system:
1. Higher latitude (ecliptic north) wins
2. If latitudes similar, brightness rank determines winner
3. Faster speed is a secondary consideration
*/

import type { PlanetName, NatalChart, PlanetData } from "./types"

/*
═══════════════════════════════════════════════════════════════════════════════
TYPE DEFINITIONS
═══════════════════════════════════════════════════════════════════════════════
*/

/**
 * Represents a single planetary war event with winner, loser, and effects
 * BPHS 17.1-25: Comprehensive planetary war determination
 */
export interface PlanetaryWar {
  planet1: PlanetName
  planet2: PlanetName
  winner: PlanetName
  loser: PlanetName
  separationDegrees: number     // Actual distance in degrees (0.0-1.0)
  winnerLatitude: number        // Ecliptic latitude of winner in degrees
  loserLatitude: number         // Ecliptic latitude of loser in degrees
  winReason: "latitude" | "brightness" | "speed"
  severity: "intense" | "moderate" | "mild"
  effects: {
    winner: string              // Enhanced effects description
    loser: string               // Adverse effects description
  }
  classicalReference: {
    source: string
    chapter: number
    translation: string
  }
}

/**
 * Container for all detected planetary wars in a chart
 */
export interface GrahaYuddhaResult {
  isPresent: boolean
  wars: PlanetaryWar[]
}

/**
 * Status of a specific planet regarding planetary wars
 */
export interface PlanetWarStatus {
  planet: PlanetName
  isInWar: boolean
  isWinner: boolean
  opponent?: PlanetName
  strengthModifier: number      // 1.25 for winner, 0.5 for loser, 1.0 for no war
  warDetails?: PlanetaryWar
}

/*
═══════════════════════════════════════════════════════════════════════════════
CONSTANTS & LOOKUP TABLES
═══════════════════════════════════════════════════════════════════════════════
*/

/**
 * The five Tara Grahas (wandering planets) eligible for planetary war
 * Sun, Moon, Rahu, Ketu are excluded (Saravali 7.1)
 */
const ELIGIBLE_PLANETS: PlanetName[] = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"]

/**
 * Brightness/luminosity ranking for winner determination
 * When latitudes are equal, brightest planet wins (BPHS 17.8)
 * Venus is brightest, Saturn is dimmest
 */
const BRIGHTNESS_RANK: Record<string, number> = {
  Venus: 1,      // Brightest, highest magnitude
  Jupiter: 2,    // Very bright
  Mars: 3,       // Moderate brightness (varies with aspect to Sun)
  Mercury: 4,    // Variable, often close to Sun
  Saturn: 5,     // Dimmest of the five
}

/**
 * Natural benefic and malefic classification
 * Saravali 7.3-4: Effects depend on benefic/malefic nature
 */
const NATURAL_BENEFICS = new Set<PlanetName>(["Jupiter", "Venus"])
const NATURAL_MALEFICS = new Set<PlanetName>(["Mars", "Saturn"])
// Mercury is neutral/benefic when alone, malefic when with malefics

/**
 * War separation threshold in degrees
 * BPHS 17.1: Planets within 1 degree of longitude are at war
 */
const WAR_THRESHOLD_DEGREES = 1.0

/**
 * Latitude similarity threshold for brightness comparison
 * Within this range, latitudes are considered equal for determining winner
 */
const LATITUDE_EQUALITY_THRESHOLD = 0.1

/*
═══════════════════════════════════════════════════════════════════════════════
HELPER FUNCTIONS
═══════════════════════════════════════════════════════════════════════════════
*/

/**
 * Normalize longitude to 0-360 range
 * Handles negative values and wrapping
 */
function normalizeLongitude(lon: number): number {
  let normalized = lon % 360
  if (normalized < 0) normalized += 360
  return normalized
}

/**
 * Calculate shortest distance between two longitudes (considering circular nature)
 * Ranges from 0 to 180 degrees
 */
function calculateLongitudinalDistance(lon1: number, lon2: number): number {
  const norm1 = normalizeLongitude(lon1)
  const norm2 = normalizeLongitude(lon2)

  let distance = Math.abs(norm1 - norm2)
  if (distance > 180) {
    distance = 360 - distance
  }

  return distance
}

/**
 * Determine planetary brightness rank (lower is brighter)
 * Used as tiebreaker when latitudes are similar
 */
function getBrightnessRank(planet: PlanetName): number {
  return BRIGHTNESS_RANK[planet] ?? 99
}

/**
 * Classify planet as benefic, malefic, or neutral
 * Mercury's nature depends on conjunctions (handled in caller)
 */
function getPlanetNature(planet: PlanetName): "benefic" | "malefic" | "neutral" {
  if (NATURAL_BENEFICS.has(planet)) return "benefic"
  if (NATURAL_MALEFICS.has(planet)) return "malefic"
  return "neutral" // Mercury
}

/**
 * Determine severity based on closeness (separation in degrees)
 * Closer conjunction = more intense warfare (BPHS 17.2)
 */
function determineSeverity(separationDegrees: number): "intense" | "moderate" | "mild" {
  if (separationDegrees < 0.25) return "intense"
  if (separationDegrees < 0.5) return "moderate"
  return "mild"
}

/**
 * Generate contextual effect description for winning planet
 */
function generateWinnerEffects(
  winner: PlanetName,
  loser: PlanetName,
  winnerHouse: number,
  severity: "intense" | "moderate" | "mild"
): string {
  const severityText = severity === "intense" ? "greatly enhanced" : severity === "moderate" ? "enhanced" : "somewhat enhanced"

  const baseEffect = `${winner} gains strength and produces ${severityText} results. `

  let specificEffect = ""
  switch (winner) {
    case "Mars":
      specificEffect = "Courage, initiative, and martial qualities are strengthened. "
      break
    case "Mercury":
      specificEffect = "Intellect, communication, and analytical abilities are sharpened. "
      break
    case "Jupiter":
      specificEffect = "Wisdom, expansion, and prosperity are enhanced. "
      break
    case "Venus":
      specificEffect = "Creativity, beauty, and relationship harmony are amplified. "
      break
    case "Saturn":
      specificEffect = "Discipline, perseverance, and karmic work gain potency. "
      break
  }

  const houseEffect = `Matters of house ${winnerHouse} are particularly benefited. `

  return baseEffect + specificEffect + houseEffect
}

/**
 * Generate contextual effect description for losing planet
 */
function generateLoserEffects(
  loser: PlanetName,
  winner: PlanetName,
  loserHouse: number,
  severity: "intense" | "moderate" | "mild"
): string {
  const severityText = severity === "intense" ? "severely weakened (≈50% strength loss)" : severity === "moderate" ? "weakened (≈40% strength loss)" : "slightly weakened (≈30% strength loss)"

  const baseEffect = `${loser} is ${severityText} by ${winner}. `

  let specificEffect = ""
  switch (loser) {
    case "Mars":
      specificEffect = "Courage may falter, confidence diminishes, physical vitality compromised. "
      break
    case "Mercury":
      specificEffect = "Communication suffers, intellect becomes clouded, calculation abilities impaired. "
      break
    case "Jupiter":
      specificEffect = "Wisdom and judgment are obscured, prosperity faces obstacles. "
      break
    case "Venus":
      specificEffect = "Charm fades, relationships may suffer, creative expression is restricted. "
      break
    case "Saturn":
      specificEffect = "Delays multiply, obstacles increase, karmic debts become heavier. "
      break
  }

  const amplifiedWarning = NATURAL_BENEFICS.has(loser) && NATURAL_MALEFICS.has(winner)
    ? `The defeat of ${loser} by ${winner} amplifies negative results. `
    : ""

  const houseEffect = `Significations of house ${loserHouse} are particularly affected. `

  return baseEffect + specificEffect + amplifiedWarning + houseEffect
}

/**
 * Determine winner between two planets in war
 * Applies hierarchy: latitude > brightness > speed (BPHS 17.5-8)
 */
function determineWarWinner(
  planet1Data: PlanetData,
  planet2Data: PlanetData
): { winner: PlanetName; loser: PlanetName; reason: "latitude" | "brightness" | "speed" } {
  const lat1 = planet1Data.latitude ?? 0
  const lat2 = planet2Data.latitude ?? 0

  // Rule 1: Higher latitude (more northern) wins
  const latitudeDiff = Math.abs(lat1 - lat2)
  if (latitudeDiff > LATITUDE_EQUALITY_THRESHOLD) {
    if (lat1 > lat2) {
      return {
        winner: planet1Data.name,
        loser: planet2Data.name,
        reason: "latitude"
      }
    } else {
      return {
        winner: planet2Data.name,
        loser: planet1Data.name,
        reason: "latitude"
      }
    }
  }

  // Rule 2: If latitudes similar, brighter planet wins
  const brightness1 = getBrightnessRank(planet1Data.name)
  const brightness2 = getBrightnessRank(planet2Data.name)

  if (brightness1 !== brightness2) {
    if (brightness1 < brightness2) {
      return {
        winner: planet1Data.name,
        loser: planet2Data.name,
        reason: "brightness"
      }
    } else {
      return {
        winner: planet2Data.name,
        loser: planet1Data.name,
        reason: "brightness"
      }
    }
  }

  // Rule 3: If brightness equal (shouldn't happen), faster planet wins
  const speed1 = planet1Data.speed ?? 0
  const speed2 = planet2Data.speed ?? 0

  if (speed1 >= speed2) {
    return {
      winner: planet1Data.name,
      loser: planet2Data.name,
      reason: "speed"
    }
  } else {
    return {
      winner: planet2Data.name,
      loser: planet1Data.name,
      reason: "speed"
    }
  }
}

/**
 * Create classical reference for the war
 * Based on BPHS Chapter 17 and Saravali Chapter 7
 */
function createClassicalReference(severity: "intense" | "moderate" | "mild"): PlanetaryWar["classicalReference"] {
  const translations: Record<string, string> = {
    intense: "When two planets are very close in longitude, the one with superior position vanquishes the other, producing powerful effects.",
    moderate: "Planets within similar degrees of longitude engage in warfare, with victory determined by latitude and brightness.",
    mild: "Planets approaching within one degree of longitude begin their warfare, with effects proportional to their separation.",
  }

  return {
    source: "Brihat Parashara Hora Shastra & Saravali",
    chapter: 17, // BPHS Chapter 17 on Planetary War
    translation: translations[severity],
  }
}

/*
═══════════════════════════════════════════════════════════════════════════════
MAIN DETECTION FUNCTION
═══════════════════════════════════════════════════════════════════════════════
*/

/**
 * Detect all planetary wars in the natal chart
 * BPHS 17.1-25: Complete planetary war analysis
 *
 * Process:
 * 1. Filter eligible planets (Mars, Mercury, Jupiter, Venus, Saturn)
 * 2. Compare all pairs for longitudinal proximity (< 1 degree)
 * 3. Determine winner based on latitude, brightness, speed
 * 4. Generate context-aware effect descriptions
 * 5. Classify severity based on separation
 */
export function detectGrahaYuddha(chart: NatalChart): GrahaYuddhaResult {
  const wars: PlanetaryWar[] = []

  // Extract only eligible planets
  const eligibleData = chart.planets.filter((p) =>
    ELIGIBLE_PLANETS.includes(p.name)
  )

  if (eligibleData.length < 2) {
    return { isPresent: false, wars: [] }
  }

  // Check all pairs for war conditions
  for (let i = 0; i < eligibleData.length; i++) {
    for (let j = i + 1; j < eligibleData.length; j++) {
      const planet1 = eligibleData[i]
      const planet2 = eligibleData[j]

      // Calculate longitudinal separation
      const separation = calculateLongitudinalDistance(
        planet1.longitude,
        planet2.longitude
      )

      // Check if within war threshold (1 degree)
      if (separation > WAR_THRESHOLD_DEGREES) {
        continue
      }

      // Determine winner
      const { winner: winnerName, loser: loserName, reason } = determineWarWinner(
        planet1,
        planet2
      )

      const winnerData = winnerName === planet1.name ? planet1 : planet2
      const loserData = loserName === planet1.name ? planet1 : planet2

      const severity = determineSeverity(separation)

      // Create war record
      const war: PlanetaryWar = {
        planet1: planet1.name,
        planet2: planet2.name,
        winner: winnerName,
        loser: loserName,
        separationDegrees: separation,
        winnerLatitude: winnerData.latitude ?? 0,
        loserLatitude: loserData.latitude ?? 0,
        winReason: reason,
        severity,
        effects: {
          winner: generateWinnerEffects(
            winnerName,
            loserName,
            winnerData.house ?? 1,
            severity
          ),
          loser: generateLoserEffects(
            loserName,
            winnerName,
            loserData.house ?? 1,
            severity
          ),
        },
        classicalReference: createClassicalReference(severity),
      }

      wars.push(war)
    }
  }

  return {
    isPresent: wars.length > 0,
    wars,
  }
}

/*
═══════════════════════════════════════════════════════════════════════════════
PLANET STATUS FUNCTIONS
═══════════════════════════════════════════════════════════════════════════════
*/

/**
 * Get planetary war status for a specific planet
 * Returns strength modifier and war details if applicable
 */
export function getPlanetWarStatus(
  planet: PlanetName,
  chart: NatalChart
): PlanetWarStatus {
  // Check if planet is eligible for war
  if (!ELIGIBLE_PLANETS.includes(planet)) {
    return {
      planet,
      isInWar: false,
      isWinner: false,
      strengthModifier: 1.0,
    }
  }

  // Detect all wars in the chart
  const result = detectGrahaYuddha(chart)

  // Find if this planet is involved in any war
  const relevantWar = result.wars.find(
    (w) => w.planet1 === planet || w.planet2 === planet
  )

  if (!relevantWar) {
    return {
      planet,
      isInWar: false,
      isWinner: false,
      strengthModifier: 1.0,
    }
  }

  const isWinner = relevantWar.winner === planet

  return {
    planet,
    isInWar: true,
    isWinner,
    opponent: isWinner ? relevantWar.loser : relevantWar.winner,
    strengthModifier: isWinner ? 1.25 : 0.5,
    warDetails: relevantWar,
  }
}

/**
 * Get planetary war status for all eligible planets
 * Provides comprehensive strength modification for all five Tara Grahas
 */
export function getAllPlanetWarStatuses(chart: NatalChart): PlanetWarStatus[] {
  return ELIGIBLE_PLANETS.map((planet) => getPlanetWarStatus(planet, chart))
}
