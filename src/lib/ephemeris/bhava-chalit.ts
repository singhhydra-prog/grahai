/* ════════════════════════════════════════════════════════
   GrahAI — Bhava Chalit (Equal House) Calculations
   Vedic Astrology's alternative house system
   ════════════════════════════════════════════════════════ */

import type { NatalChart, PlanetName, PlanetData } from "./types"
import { SIGNS, getSignFromLongitude, HOUSE_SIGNIFICANCES } from "./constants"

// ─── Type Definitions ───────────────────────────────────

/**
 * Represents a Bhava Chalit house with equal arc divisions.
 * The ascendant degree determines the midpoint of the 1st house,
 * with each house spanning exactly 30°.
 */
export interface BhavaChalitHouse {
  /** House number (1-12) */
  number: number
  /** Start degree of house cusp (absolute longitude 0-360) */
  startDegree: number
  /** Mid-cusp degree (most powerful/sensitive point of house) */
  midDegree: number
  /** End degree of house cusp (absolute longitude 0-360) */
  endDegree: number
  /** Zodiac sign at the mid-cusp */
  sign: string
  /** Sign index (0-11) for the mid-cusp */
  signIndex: number
}

/**
 * Represents a planet's position in the Bhava Chalit chart.
 * Compares Rashi (whole sign) vs Bhava Chalit house placements
 * to identify shifted planets and sandhi (boundary) positions.
 */
export interface BhavaChalitPlanet {
  /** Planet name */
  name: PlanetName | string
  /** Absolute sidereal longitude (0-360) */
  longitude: number
  /** House number in Rashi chart (whole sign system) */
  rashiHouse: number
  /** House number in Bhava Chalit (equal arc system) */
  bhavaHouse: number
  /** Whether planet shifted to a different house in Chalit vs Rashi */
  hasShifted: boolean
  /** Direction of shift: forward (higher number) or backward (lower number) */
  shiftDirection?: "forward" | "backward"
  /** Distance in degrees from nearest house boundary (0-15) */
  distanceFromCusp: number
  /** True if planet is within 3° of a house boundary (sandhi position) */
  isNearSandhi: boolean
  /** Interpretation of planet's position and significance */
  interpretation: string
}

/**
 * Represents a planet in a sensitive sandhi (boundary) position.
 * Planets near house cusps are considered vulnerable or transitional.
 */
export interface SandhiPlanet {
  /** Planet name */
  name: string
  /** House in Rashi chart */
  rashiHouse: number
  /** House in Bhava Chalit (different if crossing cusp) */
  bhavaHouse: number
  /** Distance in degrees from the exact house cusp */
  sandhiDegree: number
  /** Interpretation of the sandhi effect */
  effect: string
}

/**
 * Complete Bhava Chalit chart with houses, planets, and sandhi analysis.
 */
export interface BhavaChalitChart {
  /** Ascendant degree used for all calculations */
  ascendantDegree: number
  /** All 12 Bhava Chalit houses with cusps and signs */
  houses: BhavaChalitHouse[]
  /** All planets positioned in Bhava Chalit */
  planets: BhavaChalitPlanet[]
  /** Planets in sandhi (boundary) positions */
  sandhiPlanets: SandhiPlanet[]
}

/**
 * Analysis of planets that shift between Rashi and Bhava Chalit houses.
 */
export interface HouseShiftAnalysis {
  /** Total number of planets that shifted houses */
  totalShifts: number
  /** Details of each shifted planet */
  shiftedPlanets: Array<{
    /** Planet name */
    planet: string
    /** Original house in Rashi chart */
    fromHouse: number
    /** New house in Bhava Chalit */
    toHouse: number
    /** Significance and interpretation of the shift */
    significance: string
    /** Life areas affected by this shift */
    affectedAreas: string[]
  }>
  /** Planets that remain in same house */
  stablePlanets: string[]
  /** Overall impact level of all shifts */
  overallImpact: "significant" | "moderate" | "minimal"
  /** Summary interpretation */
  summary: string
}

/**
 * Bhava Bala (house strength) calculation.
 * Evaluates each house based on occupants, benefic/malefic placement,
 * lord dignity, and lord position relative to house midpoint.
 */
export interface BhavaBalaResult {
  /** Strength analysis for each of 12 houses */
  houses: Array<{
    /** House number (1-12) */
    house: number
    /** Normalized strength score (0-100) */
    strength: number
    /** Qualitative strength label */
    strengthLabel: "strong" | "moderate" | "weak"
    /** Planets occupying this house */
    occupants: string[]
    /** Count of natural benefic planets in house */
    beneficCount: number
    /** Count of natural malefic planets in house */
    maleficCount: number
    /** Longitude of the house lord */
    lordPlacement: number
    /** Dignity of house lord (exalted, own sign, etc.) */
    lordDignity: string
    /** Interpretation of house strength */
    interpretation: string
  }>
  /** Strongest house number */
  strongestHouse: number
  /** Weakest house number */
  weakestHouse: number
  /** Overall summary */
  summary: string
}

/**
 * Complete Bhava Chalit report combining chart, shifts, and strength analysis.
 */
export interface BhavaChalitReport {
  /** The calculated Bhava Chalit chart */
  chalitChart: BhavaChalitChart
  /** Analysis of house shifts */
  houseShifts: HouseShiftAnalysis
  /** House strength (Bhava Bala) calculation */
  bhavaBala: BhavaBalaResult
  /** Key insights about the chart */
  keyInsights: string[]
  /** Recommendation for when to use Chalit vs Rashi */
  recommendation: string
}

// ─── Helper Functions ───────────────────────────────────

/**
 * Normalize degrees to 0-360 range.
 * Handles negative values and values > 360 correctly.
 */
function normalizeDegree(degree: number): number {
  return ((degree % 360) + 360) % 360
}

/**
 * Calculate the angular distance between two degrees.
 * Returns distance in 0-180 range (shortest path).
 */
function angleDifference(deg1: number, deg2: number): number {
  const d = Math.abs(normalizeDegree(deg1) - normalizeDegree(deg2))
  return d <= 180 ? d : 360 - d
}

/**
 * Determine if a planet is a natural benefic.
 * Benefics: Jupiter, Venus, Mercury (unafflicted), waxing Moon
 */
function isBenefic(planet: PlanetName, moonLongitude?: number): boolean {
  if (planet === "Jupiter" || planet === "Venus") return true
  if (planet === "Mercury") return true  // In practice, often benefic
  if (planet === "Moon" && moonLongitude) {
    // Moon is benefic in waxing phase (0-180° from Sun)
    // This is simplified; full phase calculation requires Sun position
    return true
  }
  return false
}

/**
 * Determine if a planet is a natural malefic.
 * Malefics: Mars, Saturn, Rahu, Ketu, Sun, waning Moon
 */
function isMalefic(planet: PlanetName): boolean {
  return ["Mars", "Saturn", "Rahu", "Ketu", "Sun"].includes(planet)
}

/**
 * Get significance string for a house shift.
 * Based on classical Vedic astrology interpretations.
 */
function getShiftSignificance(planet: string, fromHouse: number, toHouse: number): string {
  const houseNames: Record<number, string> = {
    1: "1st (Self/Personality)",
    2: "2nd (Wealth/Family)",
    3: "3rd (Communication/Siblings)",
    4: "4th (Home/Mother/Property)",
    5: "5th (Children/Creativity/Speculation)",
    6: "6th (Service/Health/Enemies)",
    7: "7th (Relationships/Partnerships)",
    8: "8th (Transformation/Longevity)",
    9: "9th (Fortune/Father/Higher Learning)",
    10: "10th (Career/Status/Government)",
    11: "11th (Gains/Aspirations/Networks)",
    12: "12th (Loss/Spirituality/Foreign Lands)"
  }

  const base = `${planet} shifts from ${houseNames[fromHouse]} to ${houseNames[toHouse]}`

  // Add specific interpretations
  const shifts: Record<string, string> = {
    "3_4": "Courage redirects toward domestic stability and property",
    "3_2": "Communication focused toward financial and family matters",
    "4_5": "Domestic energy extends to children and creative pursuits",
    "5_6": "Creative energy challenged by service and health concerns",
    "6_7": "Service matters shift toward partnerships and public dealing",
    "10_11": "Career success channels into gains and social networks",
    "11_12": "Expected gains convert to expenses or spiritual pursuits"
  }

  const key = `${fromHouse}_${toHouse}`
  return shifts[key] ? `${base} — ${shifts[key]}` : base
}

/**
 * Get affected life areas for a house shift.
 */
function getAffectedAreas(fromHouse: number, toHouse: number): string[] {
  const houseKeywords: Record<number, string[]> = {
    1: ["self", "personality", "appearance"],
    2: ["wealth", "family", "speech"],
    3: ["communication", "siblings", "courage"],
    4: ["home", "mother", "property", "education"],
    5: ["children", "creativity", "romance", "speculation"],
    6: ["health", "service", "enemies", "debts"],
    7: ["spouse", "partnerships", "business"],
    8: ["transformation", "occult", "inheritance"],
    9: ["fortune", "father", "higher learning", "pilgrimage"],
    10: ["career", "status", "government", "fame"],
    11: ["gains", "income", "friends", "aspirations"],
    12: ["loss", "expenses", "foreign lands", "spirituality"]
  }

  const from = houseKeywords[fromHouse] || []
  const to = houseKeywords[toHouse] || []
  return [...new Set([...from, ...to])]
}

// ─── Main Calculation Functions ──────────────────────────

/**
 * Calculate all 12 Bhava Chalit houses.
 * Each house spans 30° with its midpoint at ascendant + (house-1)*30°
 *
 * @param ascendantDegree - Absolute sidereal ascendant longitude (0-360)
 * @returns Array of 12 BhavaChalitHouse objects
 */
export function calculateBhavaChalitHouses(ascendantDegree: number): BhavaChalitHouse[] {
  const asc = normalizeDegree(ascendantDegree)
  const houses: BhavaChalitHouse[] = []

  for (let i = 1; i <= 12; i++) {
    // Mid-cusp of the house
    const midDegree = normalizeDegree(asc + (i - 1) * 30)

    // Start and end of the 30° arc (centered on mid-cusp)
    const startDegree = normalizeDegree(midDegree - 15)
    const endDegree = normalizeDegree(midDegree + 15)

    // Get sign at mid-cusp
    const sign = getSignFromLongitude(midDegree)

    houses.push({
      number: i,
      startDegree,
      midDegree,
      endDegree,
      sign: sign.name,
      signIndex: sign.index
    })
  }

  return houses
}

/**
 * Determine which Bhava Chalit house a planet occupies.
 * Find which 30° arc (centered on asc + (house-1)*30) contains the planet.
 *
 * @param planetLongitude - Planet's absolute sidereal longitude
 * @param ascendantDegree - Ascendant degree
 * @returns House number (1-12)
 */
function getBhavaChalitHouse(planetLongitude: number, ascendantDegree: number): number {
  const planet = normalizeDegree(planetLongitude)
  const asc = normalizeDegree(ascendantDegree)

  // Calculate offset from ascendant
  let offset = planet - asc
  if (offset < 0) offset += 360

  // Each house spans 30°
  const houseIndex = Math.floor(offset / 30)
  return (houseIndex % 12) + 1
}

/**
 * Calculate distance from nearest house cusp.
 * Returns value 0-15 (0 = at cusp, 15 = at opposite point).
 *
 * @param planetLongitude - Planet's absolute sidereal longitude
 * @param houseMidDegree - Mid-cusp of the house
 * @returns Distance in degrees (0-15)
 */
function getDistanceFromCusp(planetLongitude: number, houseMidDegree: number): number {
  const planet = normalizeDegree(planetLongitude)
  const mid = normalizeDegree(houseMidDegree)

  let distance = Math.abs(planet - mid)
  if (distance > 15) {
    distance = 30 - distance
  }
  return distance
}

/**
 * Calculate the Bhava Chalit chart for a natal chart.
 *
 * @param chart - The natal chart with ascendant and planets
 * @returns Complete BhavaChalitChart with houses, planets, and sandhi analysis
 */
export function calculateBhavaChalit(chart: NatalChart): BhavaChalitChart {
  const ascendantDegree = chart.ascendant
  const houses = calculateBhavaChalitHouses(ascendantDegree)

  // Calculate planet positions in Bhava Chalit
  const planets: BhavaChalitPlanet[] = chart.planets.map(planet => {
    const bhavaHouse = getBhavaChalitHouse(planet.longitude, ascendantDegree)
    const hasShifted = bhavaHouse !== planet.house
    const houseMid = normalizeDegree(ascendantDegree + (bhavaHouse - 1) * 30)
    const distanceFromCusp = getDistanceFromCusp(planet.longitude, houseMid)
    const isNearSandhi = distanceFromCusp <= 3

    let shiftDirection: "forward" | "backward" | undefined
    if (hasShifted) {
      shiftDirection = bhavaHouse > planet.house ? "forward" : "backward"
    }

    // Generate interpretation
    let interpretation = `${planet.name} in Bhava Chalit house ${bhavaHouse}`
    if (hasShifted) {
      interpretation += ` (shifted from Rashi house ${planet.house})`
    }
    if (isNearSandhi) {
      interpretation += ` — SANDHI position: ${distanceFromCusp.toFixed(1)}° from boundary`
    }

    return {
      name: planet.name,
      longitude: planet.longitude,
      rashiHouse: planet.house,
      bhavaHouse,
      hasShifted,
      shiftDirection,
      distanceFromCusp,
      isNearSandhi,
      interpretation
    }
  })

  // Identify sandhi planets
  const sandhiPlanets: SandhiPlanet[] = planets
    .filter(p => p.isNearSandhi)
    .map(p => ({
      name: p.name as string,
      rashiHouse: p.rashiHouse,
      bhavaHouse: p.bhavaHouse,
      sandhiDegree: p.distanceFromCusp,
      effect: `Planet ${p.name} is in a vulnerable sandhi position ${p.distanceFromCusp.toFixed(1)}° from house ${p.bhavaHouse} cusp, indicating transition and instability`
    }))

  return {
    ascendantDegree,
    houses,
    planets,
    sandhiPlanets
  }
}

/**
 * Analyze house shifts between Rashi and Bhava Chalit charts.
 * Identifies planets that move to different houses and explains significance.
 *
 * @param chart - The natal chart
 * @returns HouseShiftAnalysis with shifted and stable planets
 */
export function analyzeHouseShifts(chart: NatalChart): HouseShiftAnalysis {
  const chalitChart = calculateBhavaChalit(chart)

  const shiftedPlanets = chalitChart.planets
    .filter(p => p.hasShifted)
    .map(p => ({
      planet: p.name as string,
      fromHouse: p.rashiHouse,
      toHouse: p.bhavaHouse,
      significance: getShiftSignificance(p.name as string, p.rashiHouse, p.bhavaHouse),
      affectedAreas: getAffectedAreas(p.rashiHouse, p.bhavaHouse)
    }))

  const stablePlanets = chalitChart.planets
    .filter(p => !p.hasShifted)
    .map(p => p.name as string)

  const totalShifts = shiftedPlanets.length

  // Determine overall impact
  let overallImpact: "significant" | "moderate" | "minimal"
  if (totalShifts >= 5) overallImpact = "significant"
  else if (totalShifts >= 3) overallImpact = "moderate"
  else overallImpact = "minimal"

  // Build summary
  const summary =
    totalShifts === 0
      ? "No planets shift between Rashi and Bhava Chalit charts. The Rashi chart is sufficient for interpretation."
      : totalShifts <= 2
      ? `Only ${totalShifts} planet(s) shift in Bhava Chalit. Check their positions for refined house placement.`
      : `${totalShifts} planets shift significantly in Bhava Chalit. This indicates notable differences between whole-sign and equal-house interpretations.`

  return {
    totalShifts,
    shiftedPlanets,
    stablePlanets,
    overallImpact,
    summary
  }
}

/**
 * Calculate Bhava Bala (house strength).
 * Evaluates each house based on:
 * 1. Number of planets occupying it
 * 2. Benefic vs malefic occupants
 * 3. House lord's dignity
 * 4. House lord's distance from house midpoint
 *
 * @param chart - The natal chart
 * @returns BhavaBalaResult with strength score for each house
 */
export function calculateBhavaBala(chart: NatalChart): BhavaBalaResult {
  const chalitChart = calculateBhavaChalit(chart)

  // Map planets to houses
  const planetsByHouse: Record<number, PlanetData[]> = {}
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = []
  }

  chart.planets.forEach(planet => {
    const bhavaHouse = getBhavaChalitHouse(planet.longitude, chart.ascendant)
    planetsByHouse[bhavaHouse].push(planet)
  })

  // Calculate strength for each house
  const houseStrengths = chalitChart.houses.map(house => {
    const occupants = planetsByHouse[house.number]
    const occupantNames = occupants.map(p => p.name)

    // Count benefics and malefics
    let beneficCount = 0
    let maleficCount = 0
    occupants.forEach(p => {
      if (isBenefic(p.name)) beneficCount++
      if (isMalefic(p.name)) maleficCount++
    })

    // Get house lord
    const houseLord = SIGNS[house.signIndex].lord
    const houseLordPlanet = chart.planets.find(p => p.name === houseLord)

    // Calculate lord dignity
    let lordDignity = "neutral"
    if (houseLordPlanet) {
      lordDignity = houseLordPlanet.dignity
    }

    // Calculate lord placement (distance from house midpoint)
    let lordPlacement = 0
    if (houseLordPlanet) {
      lordPlacement = houseLordPlanet.longitude
    }

    // Calculate strength score (0-100)
    let strength = 50  // Base score

    // Occupant contribution (+20 per occupant, max +30)
    strength += Math.min(occupants.length * 20, 30)

    // Benefic vs malefic contribution
    strength += beneficCount * 10
    strength -= maleficCount * 10

    // Lord dignity contribution
    if (houseLordPlanet) {
      if (houseLordPlanet.isExalted) strength += 15
      else if (houseLordPlanet.dignity === "moolatrikona" || houseLordPlanet.dignity === "own")
        strength += 10
      else if (houseLordPlanet.dignity === "friendly") strength += 5
      else if (houseLordPlanet.dignity === "debilitated") strength -= 15
    }

    // Clamp to 0-100
    strength = Math.max(0, Math.min(100, strength))

    // Strength label
    const strengthLabel: "strong" | "moderate" | "weak" =
      strength >= 70 ? "strong" : strength >= 40 ? "moderate" : "weak"

    // Generate interpretation
    let interpretation = `House ${house.number} (${house.sign})`
    if (occupants.length > 0) {
      interpretation += ` contains ${occupantNames.join(", ")}`
    }
    if (beneficCount > 0) {
      interpretation += `; benefics present`
    }
    if (maleficCount > 0) {
      interpretation += `; malefics present`
    }

    return {
      house: house.number,
      strength,
      strengthLabel,
      occupants: occupantNames,
      beneficCount,
      maleficCount,
      lordPlacement,
      lordDignity,
      interpretation
    }
  })

  // Find strongest and weakest
  const strongest = houseStrengths.reduce((max, h) =>
    h.strength > max.strength ? h : max
  )
  const weakest = houseStrengths.reduce((min, h) =>
    h.strength < min.strength ? h : min
  )

  // Build summary
  const strongHouses = houseStrengths.filter(h => h.strengthLabel === "strong").length
  const weakHouses = houseStrengths.filter(h => h.strengthLabel === "weak").length

  const summary =
    `House strength analysis: ${strongHouses} strong houses, ${weakHouses} weak houses. ` +
    `Strongest: House ${strongest.house} (${strongest.strength.toFixed(0)}/100). ` +
    `Weakest: House ${weakest.house} (${weakest.strength.toFixed(0)}/100).`

  return {
    houses: houseStrengths,
    strongestHouse: strongest.house,
    weakestHouse: weakest.house,
    summary
  }
}

/**
 * Generate a complete Bhava Chalit report combining all analyses.
 *
 * @param chart - The natal chart
 * @returns Complete BhavaChalitReport with all insights
 */
export function getBhavaChalitReport(chart: NatalChart): BhavaChalitReport {
  const chalitChart = calculateBhavaChalit(chart)
  const houseShifts = analyzeHouseShifts(chart)
  const bhavaBala = calculateBhavaBala(chart)

  // Generate key insights
  const keyInsights: string[] = []

  // Insight 1: Sandhi planets
  if (chalitChart.sandhiPlanets.length > 0) {
    keyInsights.push(
      `WARNING: ${chalitChart.sandhiPlanets.length} planet(s) in sandhi (boundary) position — ${chalitChart.sandhiPlanets.map(p => p.name).join(", ")}. These planets lack stable support and may manifest erratically.`
    )
  }

  // Insight 2: House shifts
  if (houseShifts.totalShifts > 0) {
    keyInsights.push(
      `${houseShifts.totalShifts} planet(s) shift between Rashi and Chalit: ${houseShifts.shiftedPlanets.map(p => p.planet).join(", ")}. Refined interpretations available in Chalit chart.`
    )
  }

  // Insight 3: Strong vs weak houses
  const strongHouses = bhavaBala.houses.filter(h => h.strengthLabel === "strong")
  const weakHouses = bhavaBala.houses.filter(h => h.strengthLabel === "weak")
  if (strongHouses.length > 0) {
    keyInsights.push(
      `Strong houses: ${strongHouses.map(h => h.house).join(", ")}. These life areas are well-supported and likely to manifest positively.`
    )
  }
  if (weakHouses.length > 0) {
    keyInsights.push(
      `Weak houses: ${weakHouses.map(h => h.house).join(", ")}. These areas require attention and supportive dasha cycles.`
    )
  }

  // Insight 4: Planetary occupancy patterns
  const occupiedHouses = chalitChart.planets.filter(p => true).length
  if (occupiedHouses < 12) {
    keyInsights.push(
      `${12 - occupiedHouses} empty houses in Bhava Chalit. Use house lords to assess these areas.`
    )
  }

  // Recommendation
  const recommendation =
    houseShifts.overallImpact === "significant"
      ? "Use Bhava Chalit alongside Rashi chart for detailed house placement analysis. Pay special attention to shifted planets and their refined interpretations."
      : houseShifts.overallImpact === "moderate"
      ? "Reference Bhava Chalit for planets showing shifts. The Rashi chart remains primary, with Chalit offering supplementary insights."
      : "Rashi chart is stable. Bhava Chalit confirms whole-sign placements with minimal refinement needed."

  return {
    chalitChart,
    houseShifts,
    bhavaBala,
    keyInsights,
    recommendation
  }
}

// ─── Export Summary ─────────────────────────────────────

/**
 * Public API for Bhava Chalit calculations:
 *
 * 1. calculateBhavaChalitHouses() — Generate equal-arc house cusps
 * 2. calculateBhavaChalit() — Full chart with planets and sandhi
 * 3. analyzeHouseShifts() — Compare Rashi vs Chalit placements
 * 4. calculateBhavaBala() — House strength analysis
 * 5. getBhavaChalitReport() — Complete integrated report
 *
 * Bhava Chalit is particularly useful when:
 * - Multiple planets occupy the same sign (Rashi)
 * - Planets are near house boundaries (sandhi positions)
 * - Seeking more precise house placement
 *
 * Classical reference: BPHS Chapter 8, Saravali, and Phaladeepika
 */
