/* ════════════════════════════════════════════════════════
   GrahAI — Transit (Gochar) Engine

   Calculates current planetary transits and their effects
   on a natal chart. Based on Brihat Parashara Hora Shastra
   Chapter 65 (Transit of Planets / Gochar Phala).

   Key concepts:
   - Vedha (obstruction) points cancel transit benefits
   - Ashtakavarga points determine transit strength
   - Moon sign-based transit houses determine effects
   ════════════════════════════════════════════════════════ */

import type {
  PlanetName, NatalChart, TransitData, PlanetData,
} from "./types"
import {
  getCurrentTransitPositions,
  getTransitPositionsForChart,
} from "./sweph-wrapper"
import { SIGNS, getSignFromLongitude, getHouseNumber } from "./constants"

// ─── Transit Effect Tables (BPHS Chapter 65) ───────────

/**
 * Beneficial houses for each planet when transiting from Moon sign.
 * BPHS Chapter 65, Verses 2-10.
 */
const TRANSIT_GOOD_HOUSES: Record<PlanetName, number[]> = {
  Sun:     [3, 6, 10, 11],
  Moon:    [1, 3, 6, 7, 10, 11],
  Mars:    [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus:   [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn:  [3, 6, 11],
  Rahu:    [3, 6, 10, 11],
  Ketu:    [3, 6, 10, 11],
}

/**
 * Vedha (obstruction) pairs — if a planet transiting in a good house
 * has another planet in the Vedha house, the benefit is cancelled.
 * BPHS Chapter 65, Verses 11-19.
 *
 * Format: { goodHouse: vedhaHouse }
 */
const VEDHA_POINTS: Record<PlanetName, Record<number, number>> = {
  Sun:     { 3: 9, 6: 12, 10: 4, 11: 5 },
  Moon:    { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  Mars:    { 3: 12, 6: 9, 11: 5 },
  Mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 },
  Jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  Venus:   { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
  Saturn:  { 3: 12, 6: 9, 11: 5 },
  Rahu:    { 3: 12, 6: 9, 10: 4, 11: 5 },
  Ketu:    { 3: 12, 6: 9, 10: 4, 11: 5 },
}

// ─── Transit Effect Descriptions ────────────────────────

const TRANSIT_HOUSE_EFFECTS: Record<number, { positive: string, negative: string }> = {
  1:  { positive: "New beginnings, enhanced self-image, vitality", negative: "Health issues, ego conflicts, physical discomfort" },
  2:  { positive: "Financial gains, family harmony, good food", negative: "Financial losses, speech problems, family disputes" },
  3:  { positive: "Courage, success in efforts, good relations with siblings", negative: "Obstacles in communication, conflicts with siblings" },
  4:  { positive: "Domestic happiness, new property, mother's blessings", negative: "Mental unrest, property issues, vehicle problems" },
  5:  { positive: "Romance, creativity, children's success, speculation gains", negative: "Emotional turmoil, children's problems, poor judgment" },
  6:  { positive: "Victory over enemies, debt clearance, health improvement", negative: "Health issues, legal troubles, enemy problems" },
  7:  { positive: "Partnership success, marriage prospects, travel", negative: "Relationship stress, business disputes, spouse health" },
  8:  { positive: "Transformation, inheritance, occult insight", negative: "Sudden problems, chronic illness, unexpected losses" },
  9:  { positive: "Fortune, spiritual growth, father's blessings, long travel", negative: "Loss of luck, father's health, dharmic confusion" },
  10: { positive: "Career success, recognition, authority, fame", negative: "Career setbacks, loss of position, reputation damage" },
  11: { positive: "Gains, profits, fulfillment of desires, social success", negative: "Loss of income, unfulfilled hopes, friend troubles" },
  12: { positive: "Spiritual liberation, foreign travel, inner peace", negative: "Expenses, losses, isolation, imprisonment feeling" },
}

// ─── Core Transit Analysis ──────────────────────────────

export interface TransitEffect {
  planet: PlanetName
  transitSign: string
  transitDegree: number
  houseFromMoon: number
  houseFromLagna: number
  isRetrograde: boolean
  isBeneficTransit: boolean
  isVedhaBlocked: boolean
  vedhaBy?: PlanetName
  effect: string
  duration: string
  significance: "high" | "medium" | "low"
}

export interface FullTransitAnalysis {
  date: Date
  moonSign: string
  lagnaSign: string
  transits: TransitEffect[]
  overallTrend: "favorable" | "mixed" | "challenging"
  keyHighlights: string[]
  sadeSatiStatus: SadeSatiStatus | null
}

export interface SadeSatiStatus {
  isActive: boolean
  phase: "rising" | "peak" | "setting" | null
  saturnSign: string
  moonSign: string
  startApproxDate?: string
  endApproxDate?: string
  advice: string
}

/**
 * Get the approximate transit duration for each planet through a sign.
 */
function getTransitDuration(planet: PlanetName): string {
  switch (planet) {
    case "Sun":     return "~1 month"
    case "Moon":    return "~2.5 days"
    case "Mars":    return "~1.5 months"
    case "Mercury": return "~1 month (varies with retrogression)"
    case "Jupiter": return "~13 months"
    case "Venus":   return "~1 month (varies with retrogression)"
    case "Saturn":  return "~2.5 years"
    case "Rahu":    return "~18 months"
    case "Ketu":    return "~18 months"
    default:        return "varies"
  }
}

/**
 * Determine transit significance based on planet and house.
 */
function getTransitSignificance(planet: PlanetName, house: number): "high" | "medium" | "low" {
  // Slow-moving planets in angular houses are always significant
  const slowPlanets: PlanetName[] = ["Saturn", "Jupiter", "Rahu", "Ketu"]
  const angularHouses = [1, 4, 7, 10]

  if (slowPlanets.includes(planet) && angularHouses.includes(house)) return "high"
  if (slowPlanets.includes(planet)) return "medium"
  if (planet === "Sun" || planet === "Mars") return "medium"
  return "low"
}

/**
 * Get natal-chart-aware transit house effects.
 * Checks for natal planets in the house and transiting planet's dignity.
 */
function getTransitHouseEffect(
  house: number,
  planet: PlanetName,
  natalChart: NatalChart
): { positive: string, negative: string } {
  // Start with base TRANSIT_HOUSE_EFFECTS text
  const baseEffect = TRANSIT_HOUSE_EFFECTS[house] || {
    positive: "Generally favorable",
    negative: "Requires caution and patience"
  }

  let enhancedPositive = baseEffect.positive
  let enhancedNegative = baseEffect.negative

  // Check if any natal planets sit in the house being transited
  const natalPlanetsInHouse = natalChart.houses && natalChart.houses[house - 1]?.planets
  if (natalPlanetsInHouse && natalPlanetsInHouse.length > 0) {
    const planetList = natalPlanetsInHouse.join(", ")
    enhancedPositive += `. Your natal ${planetList} in this house amplifies the positive effects`
    enhancedNegative += `. Natal ${planetList} here adds intensity — channel carefully`
  }

  // Check the transiting planet's dignity relative to the sign
  // (This would require dignity lookup; simplified for now)
  // In a full implementation, check if planet is exalted, in own sign, friendly, etc.

  return {
    positive: enhancedPositive,
    negative: enhancedNegative
  }
}

/**
 * Check Sade Sati status based on current Saturn transit, natal Moon, and overall chart strength.
 */
function checkSadeSati(
  saturnTransitSign: number,
  natalMoonSign: number,
  natalChart: NatalChart
): SadeSatiStatus | null {
  const diff = ((saturnTransitSign - natalMoonSign) % 12 + 12) % 12

  // Check Moon's dignity in natal chart
  const natalMoon = natalChart.planets.find(p => p.name === "Moon")
  const moonDignity = natalMoon?.dignity || "neutral"
  const isMoonStrong = ["exalted", "own sign", "friendly"].some(d => moonDignity.toLowerCase().includes(d))
  const isMoonWeak = ["debilitated", "enemy"].some(d => moonDignity.toLowerCase().includes(d))

  // Check for Gaja Kesari Yoga (Jupiter in kendra from Moon)
  const jupiter = natalChart.planets.find(p => p.name === "Jupiter")
  const jupiterSignIndex = jupiter ? Math.floor(((jupiter.longitude % 360 + 360) % 360) / 30) : -1
  const kendraHouses = [1, 4, 7, 10]
  let hasGajaKesari = false

  if (jupiterSignIndex >= 0) {
    const jupiterHouseFromMoon = ((jupiterSignIndex - natalMoonSign + 12) % 12) + 1
    hasGajaKesari = kendraHouses.includes(jupiterHouseFromMoon)
  }

  if (diff === 11) {
    // Saturn in 12th from Moon — Rising phase
    let advice = "Sade Sati Rising Phase: Saturn approaches your Moon sign. Increased expenses, mental restlessness, and need for patience. Focus on discipline and service. This is the preparatory phase — build resilience."

    if (isMoonStrong) {
      advice = "Sade Sati Rising Phase: Your strong natal Moon helps you navigate Saturn's approach. While expenses and restlessness may arise, your emotional resilience is your greatest asset. Focus on discipline and service to channel this period productively."
    } else if (isMoonWeak) {
      advice = "Sade Sati Rising Phase: Extra self-care is essential as Saturn approaches your Moon. Mental restlessness and financial pressures may feel more acute due to your Moon's vulnerability. Build a support system and lean on spiritual practices."
    }

    if (hasGajaKesari) {
      advice += " Jupiter's protective aspect on your Moon eases some of the harder edges — trust this grace."
    }

    return {
      isActive: true,
      phase: "rising",
      saturnSign: SIGNS[saturnTransitSign].name,
      moonSign: SIGNS[natalMoonSign].name,
      advice,
    }
  } else if (diff === 0) {
    // Saturn on natal Moon — Peak phase
    let advice = "Sade Sati Peak Phase: Saturn is transiting over your natal Moon. This is the most intense phase — emotional challenges, career restructuring, and karmic lessons. Stay grounded, avoid shortcuts, and trust the process of transformation."

    if (isMoonStrong) {
      advice = "Sade Sati Peak Phase: Saturn is transiting over your strong natal Moon. While this is the most intense phase, your inner emotional strength helps you transform challenges into wisdom. Career and life restructuring is profound but manageable with patience."
    } else if (isMoonWeak) {
      advice = "Sade Sati Peak Phase: This is the most challenging time for your natal Moon's vulnerability. Extra self-care, counseling, and spiritual support are essential. Emotional challenges and karmic lessons may feel overwhelming — be gentle with yourself."
    }

    if (hasGajaKesari) {
      advice += " Jupiter's presence eases the intensity — this is a period of transformation with grace."
    }

    return {
      isActive: true,
      phase: "peak",
      saturnSign: SIGNS[saturnTransitSign].name,
      moonSign: SIGNS[natalMoonSign].name,
      advice,
    }
  } else if (diff === 1) {
    // Saturn in 2nd from Moon — Setting phase
    let advice = "Sade Sati Setting Phase: Saturn is leaving your Moon sign area. Financial pressures ease, but watch speech and family matters. The lessons of Sade Sati are crystallizing — integrate what you have learned."

    if (isMoonStrong) {
      advice = "Sade Sati Setting Phase: Saturn is leaving your Moon sign area. Your strong natal Moon has carried you through — now integrate the wisdom gained. Financial and emotional relief begins, and you emerge stronger."
    } else if (isMoonWeak) {
      advice = "Sade Sati Setting Phase: Saturn is leaving your vulnerable Moon — relief is coming. Continue self-care practices and allow the integration of hard lessons. Healing accelerates now."
    }

    if (hasGajaKesari) {
      advice += " Jupiter's protective aspect blesses your exit from this cycle."
    }

    return {
      isActive: true,
      phase: "setting",
      saturnSign: SIGNS[saturnTransitSign].name,
      moonSign: SIGNS[natalMoonSign].name,
      advice,
    }
  }

  return null
}

/**
 * Analyze current transits against a natal chart.
 * Returns comprehensive transit effects with Vedha analysis.
 */
export async function analyzeTransits(
  natalChart: NatalChart,
  date?: Date
): Promise<FullTransitAnalysis> {
  const targetDate = date || new Date()

  // Get current planetary positions (sidereal)
  const transitPositions = await getCurrentTransitPositions(targetDate)

  // Find natal Moon and Lagna signs
  const natalMoon = natalChart.planets.find(p => p.name === "Moon")!
  const natalMoonSignIndex = Math.floor(((natalMoon.longitude % 360 + 360) % 360) / 30)
  const natalLagnaSignIndex = Math.floor(((natalChart.ascendant % 360 + 360) % 360) / 30)

  // Build transit house map (from Moon) for Vedha checking
  const transitHouseFromMoon: Record<PlanetName, number> = {} as any
  for (const tp of transitPositions) {
    const transitSignIndex = Math.floor(((tp.longitude % 360 + 360) % 360) / 30)
    const houseFromMoon = ((transitSignIndex - natalMoonSignIndex + 12) % 12) + 1
    transitHouseFromMoon[tp.name as PlanetName] = houseFromMoon
  }

  // Analyze each transit
  const transits: TransitEffect[] = []

  for (const tp of transitPositions) {
    const planet = tp.name as PlanetName
    const transitSignIndex = Math.floor(((tp.longitude % 360 + 360) % 360) / 30)
    const houseFromMoon = transitHouseFromMoon[planet]
    const houseFromLagna = ((transitSignIndex - natalLagnaSignIndex + 12) % 12) + 1

    // Check if this is a benefic transit
    const goodHouses = TRANSIT_GOOD_HOUSES[planet] || []
    const isBeneficTransit = goodHouses.includes(houseFromMoon)

    // Check Vedha
    let isVedhaBlocked = false
    let vedhaBy: PlanetName | undefined

    if (isBeneficTransit) {
      const vedhaMap = VEDHA_POINTS[planet] || {}
      const vedhaHouse = vedhaMap[houseFromMoon]

      if (vedhaHouse) {
        // Check if any planet is in the Vedha house
        for (const [otherPlanet, otherHouse] of Object.entries(transitHouseFromMoon)) {
          if (otherPlanet !== planet && otherHouse === vedhaHouse) {
            isVedhaBlocked = true
            vedhaBy = otherPlanet as PlanetName
            break
          }
        }
      }
    }

    // Generate effect description using natal-chart-aware function
    const houseEffect = getTransitHouseEffect(houseFromMoon, planet, natalChart)
    let effect: string

    if (isBeneficTransit && !isVedhaBlocked) {
      effect = `${planet} in ${houseFromMoon}th from Moon (${SIGNS[transitSignIndex].name}): ${houseEffect.positive}`
    } else if (isBeneficTransit && isVedhaBlocked) {
      effect = `${planet} in ${houseFromMoon}th from Moon (${SIGNS[transitSignIndex].name}): Benefits blocked by Vedha from ${vedhaBy} in ${transitHouseFromMoon[vedhaBy!]}th house`
    } else {
      effect = `${planet} in ${houseFromMoon}th from Moon (${SIGNS[transitSignIndex].name}): ${houseEffect.negative}`
    }

    if (tp.retrograde) {
      effect += " [RETROGRADE — effects intensified inward, delays possible]"
    }

    transits.push({
      planet,
      transitSign: SIGNS[transitSignIndex].name,
      transitDegree: tp.longitude % 30,
      houseFromMoon,
      houseFromLagna,
      isRetrograde: tp.retrograde,
      isBeneficTransit: isBeneficTransit && !isVedhaBlocked,
      isVedhaBlocked,
      vedhaBy,
      effect,
      duration: getTransitDuration(planet),
      significance: getTransitSignificance(planet, houseFromMoon),
    })
  }

  // Check Sade Sati
  const saturnTransit = transitPositions.find(p => p.name === "Saturn")
  let sadeSatiStatus: SadeSatiStatus | null = null
  if (saturnTransit) {
    const saturnSignIndex = Math.floor(((saturnTransit.longitude % 360 + 360) % 360) / 30)
    sadeSatiStatus = checkSadeSati(saturnSignIndex, natalMoonSignIndex, natalChart)
  }

  // Determine overall trend
  const beneficCount = transits.filter(t => t.isBeneficTransit).length
  const highSigBenefic = transits.filter(t => t.isBeneficTransit && t.significance !== "low").length
  const highSigMalefic = transits.filter(t => !t.isBeneficTransit && t.significance !== "low").length

  let overallTrend: "favorable" | "mixed" | "challenging"
  if (beneficCount >= 6) overallTrend = "favorable"
  else if (beneficCount <= 3) overallTrend = "challenging"
  else overallTrend = "mixed"

  // Generate key highlights
  const keyHighlights: string[] = []

  // Highlight slow-moving planet transits
  const slowPlanets: PlanetName[] = ["Saturn", "Jupiter", "Rahu", "Ketu"]
  for (const t of transits.filter(t => slowPlanets.includes(t.planet))) {
    if (t.isBeneficTransit) {
      keyHighlights.push(`${t.planet} transit in ${t.houseFromMoon}th house is favorable (${t.duration})`)
    } else {
      keyHighlights.push(`${t.planet} transit in ${t.houseFromMoon}th house requires caution (${t.duration})`)
    }
  }

  if (sadeSatiStatus?.isActive) {
    keyHighlights.push(`Sade Sati ${sadeSatiStatus.phase} phase is active`)
  }

  return {
    date: targetDate,
    moonSign: SIGNS[natalMoonSignIndex].name,
    lagnaSign: SIGNS[natalLagnaSignIndex].name,
    transits,
    overallTrend,
    keyHighlights,
    sadeSatiStatus,
  }
}

// ─── Moon Transit (changes every ~2.5 days) ──────────────

export interface MoonTransitInfo {
  currentSign: string
  houseFromNatalMoon: number
  houseFromLagna: number
  effect: string
  nextSignChange: string
  nakshatra: string
}

export async function getMoonTransit(
  natalChart: NatalChart,
  date?: Date
): Promise<MoonTransitInfo> {
  const transitPositions = await getCurrentTransitPositions(date || new Date())
  const moonTransit = transitPositions.find(p => p.name === "Moon")!

  const transitSignIndex = Math.floor(((moonTransit.longitude % 360 + 360) % 360) / 30)

  const natalMoon = natalChart.planets.find(p => p.name === "Moon")!
  const natalMoonSignIndex = Math.floor(((natalMoon.longitude % 360 + 360) % 360) / 30)
  const natalLagnaSignIndex = Math.floor(((natalChart.ascendant % 360 + 360) % 360) / 30)

  const houseFromMoon = ((transitSignIndex - natalMoonSignIndex + 12) % 12) + 1
  const houseFromLagna = ((transitSignIndex - natalLagnaSignIndex + 12) % 12) + 1

  const goodHouses = TRANSIT_GOOD_HOUSES.Moon
  const isBenefic = goodHouses.includes(houseFromMoon)
  const houseEffect = TRANSIT_HOUSE_EFFECTS[houseFromMoon]

  return {
    currentSign: SIGNS[transitSignIndex].name,
    houseFromNatalMoon: houseFromMoon,
    houseFromLagna,
    effect: isBenefic
      ? (houseEffect?.positive || "Favorable Moon transit")
      : (houseEffect?.negative || "Challenging Moon transit"),
    nextSignChange: "Moon changes sign approximately every 2.25 days",
    nakshatra: moonTransit.nakshatra?.name || "Calculating...",
  }
}
