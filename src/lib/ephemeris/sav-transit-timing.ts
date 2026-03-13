/* ════════════════════════════════════════════════════════
   GrahAI — Sarvashtakavarga-Based Transit Timing Engine

   Enhances standard transit analysis with Ashtakavarga scoring
   for precise transit timing and impact assessment.

   Key features:
   - SAV score calculation for transit planets
   - Transit window identification and rating
   - Kaksha (sub-division) analysis
   - Combined gochar-SAV impact assessment

   References:
   - BPHS Chapter 65: Gochar Phala (Transit Effects)
   - BPHS Chapter 67-68: Sarvashtakavarga (Combined Strength)
   - Phaladeepika: Kaksha analysis
   ════════════════════════════════════════════════════════ */

import type {
  NatalChart, PlanetName, PlanetData
} from "./types"
import {
  calculateAshtakavarga, type AshtakavargaResult
} from "./ashtakavarga"
import {
  SIGNS, getSignFromLongitude, getHouseNumber, PLANET_SANSKRIT
} from "./constants"
import {
  getCurrentTransitPositions
} from "./sweph-wrapper"

// ════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ════════════════════════════════════════════════════════

/**
 * Quality ratings for SAV and planetary bindus
 */
export type SAVQuality = "excellent" | "good" | "average" | "weak"

/**
 * Combined rating considering both traditional house effects and SAV
 */
export type CombinedRating =
  | "highly_favorable"
  | "favorable"
  | "neutral"
  | "unfavorable"
  | "highly_unfavorable"

/**
 * Transit window with SAV scoring
 */
export interface TransitWindow {
  sign: string
  signIndex: number
  savScore: number
  planetBindus: number
  quality: SAVQuality
  startDate: Date
  endDate: Date
  interpretation: string
}

/**
 * SAV transit score for a single planet
 */
export interface SAVTransitScore {
  planet: PlanetName
  transitSign: string
  transitSignIndex: number
  transitDegree: number
  houseFromMoon: number
  houseFromLagna: number
  savScore: number
  planetBindus: number
  savQuality: SAVQuality
  isGoodTransitHouse: boolean
  combinedRating: CombinedRating
  interpretation: string
  duration: string
}

/**
 * Complete SAV transit report
 */
export interface SAVTransitReport {
  date: Date
  overallSAVScore: number
  transitScores: SAVTransitScore[]
  bestTransits: string[]
  challengingTransits: string[]
  savGuidance: string
}

/**
 * Kaksha transit information
 */
export interface KakshaTransitInfo {
  planet: PlanetName
  sign: string
  signIndex: number
  kakshaNumber: number
  kakshaDegrees: { start: number; end: number }
  kakshaLord: PlanetName
  hasBindu: boolean
  effect: string
}

/**
 * Enhanced transit with SAV and traditional effects combined
 */
export interface EnhancedTransit {
  planet: PlanetName
  sign: string
  signIndex: number
  house: number
  traditionalEffect: string
  savScore: number
  savQuality: SAVQuality
  combinedEffect: string
  netBenefit: number // -5 to +5 scale
}

/**
 * Enhanced gochar result combining traditional and SAV analysis
 */
export interface EnhancedGocharResult {
  date: Date
  transits: EnhancedTransit[]
  overallPeriodRating: string
  summary: string
}

// ════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════

/**
 * Approximate transit speeds in degrees per day
 */
const TRANSIT_SPEEDS: Record<PlanetName, number> = {
  Sun: 1.0, // ~30 days per sign
  Moon: 13.2, // ~2.25 days per sign
  Mars: 0.53, // ~45 days per sign
  Mercury: 1.4, // ~25 days per sign (variable)
  Jupiter: 0.083, // ~365 days per sign (~4.9 years)
  Venus: 1.2, // ~30 days per sign
  Saturn: 0.033, // ~912 days per sign (~2.5 years)
  Rahu: -0.053, // retrograde ~18.6 years per revolution
  Ketu: -0.053, // retrograde ~18.6 years per revolution
}

/**
 * Good transit houses (from Moon sign) per BPHS Chapter 65
 */
const GOOD_TRANSIT_HOUSES: Record<PlanetName, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [3, 6, 10, 11],
}

/**
 * Kaksha lords in order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Ascendant lord
 * Kakshas divide a 30° sign into 8 parts of 3°45' each
 */
const KAKSHA_LORDS: PlanetName[] = [
  "Saturn", "Jupiter", "Mars", "Sun",
  "Venus", "Mercury", "Moon", "Saturn", // Note: Saturn repeats as 8th is for ascendant calculation
]

// ════════════════════════════════════════════════════════
// SAV QUALITY DETERMINATION
// ════════════════════════════════════════════════════════

/**
 * Determine SAV quality based on score
 * 28+ = excellent, 25-27 = good, 22-24 = average, <22 = weak
 */
function determineSAVQuality(score: number): SAVQuality {
  if (score >= 28) return "excellent"
  if (score >= 25) return "good"
  if (score >= 22) return "average"
  return "weak"
}

/**
 * Determine planet bindu quality
 * 5+ = strong, 4 = good, 3 = average, 2 or less = weak
 */
function determineBinduQuality(bindus: number): SAVQuality {
  if (bindus >= 5) return "excellent"
  if (bindus === 4) return "good"
  if (bindus === 3) return "average"
  return "weak"
}

/**
 * Combine traditional transit house effect with SAV scoring
 */
function combinedRating(
  isGoodHouse: boolean,
  savQuality: SAVQuality
): CombinedRating {
  if (isGoodHouse && savQuality === "excellent") return "highly_favorable"
  if (isGoodHouse && (savQuality === "good" || savQuality === "average"))
    return "favorable"
  if (!isGoodHouse && savQuality === "weak") return "highly_unfavorable"
  if (!isGoodHouse && (savQuality === "good" || savQuality === "average"))
    return "unfavorable"
  return "neutral"
}

/**
 * Get house number from Moon sign (for traditional transit assessment)
 */
function getHouseFromMoon(longitude: number, moonLongitude: number): number {
  const moonSign = Math.floor(moonLongitude / 30)
  const planetSign = Math.floor(longitude / 30)
  return ((planetSign - moonSign + 12) % 12) + 1
}

// ════════════════════════════════════════════════════════
// CORE TRANSIT TIMING FUNCTIONS
// ════════════════════════════════════════════════════════

/**
 * Calculate SAV-enhanced transit score for a single planet at current position
 *
 * @param planet - Planet to analyze
 * @param chart - Natal chart with SAV calculated
 * @param transitPosition - Current transit position of planet
 * @param ashtakavargaResult - Pre-calculated SAV result
 * @returns SAVTransitScore with complete analysis
 */
export function calculateSAVTransitScore(
  planet: PlanetName,
  chart: NatalChart,
  transitPosition: PlanetData,
  ashtakavargaResult: AshtakavargaResult
): SAVTransitScore {
  const signIndex = Math.floor(transitPosition.longitude / 30) % 12
  const sign = SIGNS[signIndex].name

  // Get SAV score for this sign
  const savScore = ashtakavargaResult.sarvashtakavarga[signIndex]

  // Get planet's individual bindus in this sign from Prashtarakha
  const planetAv = ashtakavargaResult.planetAshtakavargas.find(
    (av) => av.planet === planet
  )
  const planetBindus = planetAv ? planetAv.bindus[signIndex] : 0

  const savQuality = determineSAVQuality(savScore)

  // House from Moon
  const moonData = chart.planets.find((p) => p.name === "Moon")!
  const houseFromMoon = getHouseFromMoon(transitPosition.longitude, moonData.longitude)

  // House from Lagna (traditional)
  const houseFromLagna = getHouseNumber(transitPosition.longitude, chart.ascendant)

  // Check if this is a good transit house
  const isGoodTransitHouse =
    GOOD_TRANSIT_HOUSES[planet]?.includes(houseFromMoon) || false

  // Combined rating
  const combined = combinedRating(isGoodTransitHouse, savQuality)

  // Duration estimate
  const speed = TRANSIT_SPEEDS[planet]
  const daysInSign = Math.abs(30 / speed)
  const durationStr =
    daysInSign < 7
      ? `${Math.round(daysInSign)} days`
      : daysInSign < 60
        ? `${Math.round(daysInSign / 7)} weeks`
        : `${Math.round(daysInSign / 30.5)} months`

  // Interpretation
  const interpretation = generateSAVInterpretation(
    planet,
    sign,
    houseFromMoon,
    combined,
    savQuality,
    planetBindus
  )

  return {
    planet,
    transitSign: sign,
    transitSignIndex: signIndex,
    transitDegree: transitPosition.degree,
    houseFromMoon,
    houseFromLagna,
    savScore,
    planetBindus,
    savQuality,
    isGoodTransitHouse,
    combinedRating: combined,
    interpretation,
    duration: durationStr,
  }
}

/**
 * Generate interpretation text for SAV transit
 */
function generateSAVInterpretation(
  planet: PlanetName,
  sign: string,
  houseFromMoon: number,
  rating: CombinedRating,
  savQuality: SAVQuality,
  planetBindus: number
): string {
  const planetName = PLANET_SANSKRIT[planet] || planet
  let text = `${planetName} in ${sign}`

  // Add house reference
  const houseName = getHouseName(houseFromMoon)
  text += ` (${houseName} from Moon) `

  // Add quality assessment
  if (rating === "highly_favorable") {
    text += `is very strongly placed with SAV score of ${savQuality} strength and ${planetBindus} bindus. Excellent period for advancement, prosperity, and favorable results.`
  } else if (rating === "favorable") {
    text += `is well-placed with ${savQuality} SAV strength and ${planetBindus} bindus. Generally favorable period with moderate positive effects.`
  } else if (rating === "neutral") {
    text += `is neutrally placed. Effects are mixed and depend on additional factors.`
  } else if (rating === "unfavorable") {
    text += `is weakly placed with ${savQuality} SAV strength. Some challenges expected, though not severe.`
  } else {
    text += `is very poorly placed with minimal SAV strength (${planetBindus} bindus). Challenging period requiring caution and care.`
  }

  return text
}

/**
 * Get house name from number
 */
function getHouseName(house: number): string {
  const names = [
    "", "First", "Second", "Third", "Fourth", "Fifth",
    "Sixth", "Seventh", "Eighth", "Ninth", "Tenth",
    "Eleventh", "Twelfth",
  ]
  return names[house] || ""
}

// ════════════════════════════════════════════════════════
// TRANSIT WINDOW FINDER
// ════════════════════════════════════════════════════════

/**
 * Find best transit windows for a planet within a date range
 *
 * @param chart - Natal chart with SAV calculated
 * @param planet - Planet to find windows for
 * @param startDate - Start of analysis period
 * @param endDate - End of analysis period
 * @returns Array of transit windows ranked by SAV quality
 */
export function findBestTransitWindows(
  chart: NatalChart,
  planet: PlanetName,
  startDate: Date,
  endDate: Date
): TransitWindow[] {
  const ashtakavargaResult = calculateAshtakavarga(chart)
  const windows: TransitWindow[] = []

  // Get current transit position
  const currentTransit = getCurrentTransitPositions(new Date())
  const currentPlanet = currentTransit.find((p) => p.name === planet)

  if (!currentPlanet) return windows

  let currentDate = new Date(startDate)
  let currentSign = Math.floor(currentPlanet.longitude / 30) % 12
  let degreeInSign = currentPlanet.longitude % 30

  // Iterate through date range and detect sign changes
  while (currentDate < endDate) {
    const transitData = getCurrentTransitPositions(currentDate)
    const planetData = transitData.find((p: PlanetData) => p.name === planet)

    if (!planetData) {
      currentDate.setDate(currentDate.getDate() + 1)
      continue
    }

    const newSign = Math.floor(planetData.longitude / 30) % 12
    const newDegree = planetData.longitude % 30

    // Detect sign ingress
    if (newSign !== currentSign) {
      const signIndex = currentSign
      const sign = SIGNS[signIndex]
      const savScore = ashtakavargaResult.sarvashtakavarga[signIndex]
      const planetAv = ashtakavargaResult.planetAshtakavargas.find(
        (av) => av.planet === planet
      )
      const planetBindus = planetAv ? planetAv.bindus[signIndex] : 0

      const quality = determineSAVQuality(savScore)

      // Calculate sign duration based on speed
      const speed = TRANSIT_SPEEDS[planet]
      const daysInSign = Math.abs(30 / speed)

      // Estimate window dates (simplified)
      const windowStart = new Date(currentDate)
      const windowEnd = new Date(windowStart)
      windowEnd.setDate(windowEnd.getDate() + Math.round(daysInSign))

      windows.push({
        sign: sign.name,
        signIndex,
        savScore,
        planetBindus,
        quality,
        startDate: windowStart,
        endDate: windowEnd,
        interpretation: `${sign.name}: SAV ${quality} (${savScore} pts, ${planetBindus} bindus)`,
      })

      currentSign = newSign
    }

    degreeInSign = newDegree
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Sort by SAV quality (excellent first)
  windows.sort((a, b) => {
    const qualityOrder = { excellent: 0, good: 1, average: 2, weak: 3 }
    return qualityOrder[a.quality] - qualityOrder[b.quality]
  })

  return windows
}

// ════════════════════════════════════════════════════════
// SAV TRANSIT REPORT GENERATION
// ════════════════════════════════════════════════════════

/**
 * Generate comprehensive SAV transit report for all 7 planets
 *
 * @param chart - Natal chart
 * @param date - Analysis date (default: today)
 * @returns SAVTransitReport with scores for all planets
 */
export function getSAVTransitReport(
  chart: NatalChart,
  date: Date = new Date()
): SAVTransitReport {
  const ashtakavargaResult = calculateAshtakavarga(chart)
  const transitPositions = getCurrentTransitPositions(date)

  const planets: PlanetName[] = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn",
  ]

  const transitScores: SAVTransitScore[] = []

  // Calculate SAV score for each planet
  for (const planet of planets) {
    const transitPlanet = transitPositions.find((p: PlanetData) => p.name === planet)
    if (!transitPlanet) continue

    const score = calculateSAVTransitScore(
      planet,
      chart,
      transitPlanet,
      ashtakavargaResult
    )
    transitScores.push(score)
  }

  // Calculate overall SAV score
  const overallSAVScore =
    transitScores.reduce((sum, score) => sum + score.savScore, 0) /
    transitScores.length

  // Find best and challenging transits
  const bestTransits = transitScores
    .filter((s) => s.combinedRating === "highly_favorable" || s.combinedRating === "favorable")
    .map(
      (s) =>
        `${s.planet} in ${s.transitSign}: ${s.interpretation}`
    )

  const challengingTransits = transitScores
    .filter(
      (s) =>
        s.combinedRating === "highly_unfavorable" || s.combinedRating === "unfavorable"
    )
    .map(
      (s) =>
        `${s.planet} in ${s.transitSign}: ${s.interpretation}`
    )

  // Generate guidance
  const savGuidance = generateSAVGuidance(overallSAVScore, transitScores)

  return {
    date,
    overallSAVScore,
    transitScores,
    bestTransits,
    challengingTransits,
    savGuidance,
  }
}

/**
 * Generate SAV-based guidance text
 */
function generateSAVGuidance(
  overallScore: number,
  scores: SAVTransitScore[]
): string {
  let guidance = ""

  if (overallScore >= 28) {
    guidance =
      "Overall transit period is very favorable with strong SAV support. This is an excellent time to initiate new ventures, make important decisions, and pursue meaningful goals."
  } else if (overallScore >= 25) {
    guidance =
      "Transit period shows good SAV support. Most planets are well-placed; focus on capitalizing on favorable transits while managing challenges from weaker ones."
  } else if (overallScore >= 22) {
    guidance =
      "Transit period shows average SAV strength. Results will be mixed. Patience and strategic planning are essential during this period."
  } else {
    guidance =
      "Transit period shows weak SAV support overall. This is a time for consolidation and defensive measures rather than aggressive expansion. Seek guidance before major decisions."
  }

  // Add personal recommendations
  const favorablePlanets = scores.filter((s) => s.combinedRating === "highly_favorable")
  if (favorablePlanets.length > 0) {
    guidance += ` Focus on ${favorablePlanets
      .map((s) => s.planet)
      .join(", ")} related areas for best results.`
  }

  return guidance
}

// ════════════════════════════════════════════════════════
// KAKSHA TRANSIT ANALYSIS
// ════════════════════════════════════════════════════════

/**
 * Analyze kaksha (sub-division) of transit
 *
 * Each sign is divided into 8 kakshas of 3°45' each.
 * Kaksha lords: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Ascendant (repeating)
 *
 * @param chart - Natal chart
 * @param planet - Transiting planet
 * @param longitude - Current longitude of planet
 * @returns KakshaTransitInfo with favorable/unfavorable assessment
 */
export function getKakshaTransit(
  chart: NatalChart,
  planet: PlanetName,
  longitude: number
): KakshaTransitInfo {
  const ashtakavargaResult = calculateAshtakavarga(chart)
  const signIndex = Math.floor(longitude / 30) % 12
  const degreeInSign = longitude % 30

  // Kaksha span = 30° / 8 = 3°45' (3.75°)
  const kakshaSpan = 30 / 8
  const kakshaNumber = Math.floor(degreeInSign / kakshaSpan)

  // Kaksha degree range
  const kakshaStart = kakshaNumber * kakshaSpan
  const kakshaEnd = (kakshaNumber + 1) * kakshaSpan

  // Get kaksha lord
  const kakshaLord = KAKSHA_LORDS[kakshaNumber] as PlanetName

  // Check if this kaksha lord contributes a bindu for the planet in this sign
  const planetAv = ashtakavargaResult.planetAshtakavargas.find(
    (av) => av.planet === planet
  )
  const totalBindus = planetAv ? planetAv.bindus[signIndex] : 0

  // Simplified: if planet has 4+ bindus in sign, consider kaksha favorable
  const hasBindu = totalBindus >= 4

  const effect = hasBindu
    ? `Kaksha of ${kakshaLord} is favorable for ${planet}. Benefit from ${kakshaLord}'s influence during this transit.`
    : `Kaksha of ${kakshaLord} is neutral/weak for ${planet}. Exercise caution and avoid major decisions during this kaksha.`

  const sign = SIGNS[signIndex]

  return {
    planet,
    sign: sign.name,
    signIndex,
    kakshaNumber: kakshaNumber + 1, // 1-indexed for user display
    kakshaDegrees: { start: kakshaStart, end: kakshaEnd },
    kakshaLord,
    hasBindu,
    effect,
  }
}

// ════════════════════════════════════════════════════════
// ENHANCED GOCHAR WITH SAV
// ════════════════════════════════════════════════════════

/**
 * Get enhanced gochar (transit) analysis combining traditional effects with SAV
 *
 * @param chart - Natal chart
 * @param date - Analysis date (default: today)
 * @returns Enhanced gochar result with SAV integration
 */
export function getEnhancedGocharPhal(
  chart: NatalChart,
  date: Date = new Date()
): EnhancedGocharResult {
  const ashtakavargaResult = calculateAshtakavarga(chart)
  const transitPositions = getCurrentTransitPositions(date)

  const planets: PlanetName[] = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn",
  ]

  const transits: EnhancedTransit[] = []

  // Process each planet
  for (const planet of planets) {
    const transitPlanet = transitPositions.find((p: PlanetData) => p.name === planet)
    if (!transitPlanet) continue

    const signIndex = Math.floor(transitPlanet.longitude / 30) % 12
    const sign = SIGNS[signIndex]

    // Get house from Moon
    const moonData = chart.planets.find((p) => p.name === "Moon")!
    const houseFromMoon = getHouseFromMoon(transitPlanet.longitude, moonData.longitude)

    // SAV score
    const savScore = ashtakavargaResult.sarvashtakavarga[signIndex]
    const savQuality = determineSAVQuality(savScore)

    // Traditional transit effect
    const isGoodHouse = GOOD_TRANSIT_HOUSES[planet]?.includes(houseFromMoon) || false
    const traditionalEffect = isGoodHouse
      ? `Positive transit in house ${houseFromMoon}`
      : `Challenging transit in house ${houseFromMoon}`

    // Net benefit calculation (-5 to +5)
    let netBenefit = 0

    if (isGoodHouse) {
      if (savQuality === "excellent") netBenefit = 5
      else if (savQuality === "good") netBenefit = 3
      else if (savQuality === "average") netBenefit = 1
      else netBenefit = -1
    } else {
      if (savQuality === "excellent") netBenefit = 2
      else if (savQuality === "good") netBenefit = 0
      else if (savQuality === "average") netBenefit = -2
      else netBenefit = -5
    }

    // Combined effect description
    const combinedEffect = generateCombinedEffect(
      planet,
      sign.name,
      houseFromMoon,
      isGoodHouse,
      savQuality,
      netBenefit
    )

    transits.push({
      planet,
      sign: sign.name,
      signIndex,
      house: houseFromMoon,
      traditionalEffect,
      savScore,
      savQuality,
      combinedEffect,
      netBenefit,
    })
  }

  // Calculate overall period rating
  const avgBenefit = transits.reduce((sum, t) => sum + t.netBenefit, 0) / transits.length

  let overallRating = "Mixed"
  if (avgBenefit >= 3) overallRating = "Highly Favorable"
  else if (avgBenefit >= 1) overallRating = "Favorable"
  else if (avgBenefit >= -1) overallRating = "Neutral"
  else if (avgBenefit >= -3) overallRating = "Challenging"
  else overallRating = "Highly Challenging"

  // Generate summary
  const summary = generateEnhancedGocharSummary(overallRating, transits, avgBenefit)

  return {
    date,
    transits,
    overallPeriodRating: overallRating,
    summary,
  }
}

/**
 * Generate combined effect description
 */
function generateCombinedEffect(
  planet: PlanetName,
  sign: string,
  house: number,
  goodHouse: boolean,
  savQuality: SAVQuality,
  netBenefit: number
): string {
  const planetName = PLANET_SANSKRIT[planet] || planet
  const houseName = getHouseName(house)

  let text = `${planetName} in ${sign} (${houseName} from Moon): `

  if (netBenefit >= 3) {
    text += `Excellent period. Strong SAV support (${savQuality}) combined with favorable house placement creates strong positive momentum. Ideal for advancement and growth.`
  } else if (netBenefit >= 1) {
    text += `Favorable period. Good SAV strength (${savQuality}) supports transit benefits. Fair conditions for productive action.`
  } else if (netBenefit >= -1) {
    text += `Mixed period. SAV strength (${savQuality}) balances house effects. Proceed with balance and caution.`
  } else if (netBenefit >= -3) {
    text += `Challenging period. Weak SAV (${savQuality}) amplifies transit challenges. Avoid major decisions; focus on consolidation.`
  } else {
    text += `Highly challenging. Both weak SAV and difficult house placement suggest defensive approach. Seek expert guidance.`
  }

  return text
}

/**
 * Generate enhanced gochar summary
 */
function generateEnhancedGocharSummary(
  rating: string,
  transits: EnhancedTransit[],
  avgBenefit: number
): string {
  let summary = `Overall Transit Period Rating: ${rating}\n\n`

  const favorable = transits.filter((t) => t.netBenefit >= 2)
  const challenging = transits.filter((t) => t.netBenefit <= -2)

  if (favorable.length > 0) {
    summary += `Favorable planets: ${favorable.map((t) => t.planet).join(", ")}\n`
  }

  if (challenging.length > 0) {
    summary += `Challenging planets: ${challenging.map((t) => t.planet).join(", ")}\n`
  }

  summary += `\nAverage Transit Strength: ${avgBenefit.toFixed(1)}/5.0\n`
  summary += `This reflects the combined influence of traditional house effects and SAV scoring.`

  return summary
}

// All types and functions exported inline above.
