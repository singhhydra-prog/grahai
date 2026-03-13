import type { PlanetName, NatalChart, PlanetData, Dignity } from "./types"
import { calculateShadbala, type ShadBalaResult } from "./shadbala"
import { detectGrahaYuddha, getAllPlanetWarStatuses, type PlanetWarStatus } from "./graha-yuddha"
import {
  COMBUSTION_DEGREES,
  NATURAL_FRIENDSHIPS,
  SIGNS,
  getHouseNumber,
  getHouseLord,
  KENDRA_HOUSES,
  TRIKONA_HOUSES,
  DUSTHANA_HOUSES,
} from "./constants"

// ═══════════════════════════════════════════════════════════════════════════
// TYPES AND INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface PlanetStrengthReport {
  planet: PlanetName

  // Individual strength components
  shadbala?: ShadBalaResult // undefined for Rahu/Ketu
  warStatus?: PlanetWarStatus // undefined for Sun/Moon/Rahu/Ketu

  // Combustion analysis
  combustion: {
    isCombust: boolean
    distance?: number
    severity: "none" | "mild" | "moderate" | "severe"
    strengthLoss: number // percentage 0-100
    interpretation: string // what it means for this planet
  }

  // Retrogression analysis
  retrogression: {
    isRetrograde: boolean
    speed: number
    interpretation: string
    strengthModifier: number // multiplier (1.0 = normal, 1.25 = stronger in some contexts)
  }

  // Dignity assessment
  dignityAnalysis: {
    dignity: Dignity
    dignityScore: number // 0-100
    lordRelationship: string // "The Sun is in enemy sign Libra, ruled by Venus"
    interpretation: string
  }

  // House position analysis
  houseAnalysis: {
    house: number
    houseType: "kendra" | "trikona" | "upachaya" | "dusthana" | "maraka" | "neutral"
    isWellPlaced: boolean
    interpretation: string
  }

  // Composite scores
  compositeStrength: {
    raw: number // 0-100 base score
    adjusted: number // after all modifiers
    label: "Exceptional" | "Strong" | "Above Average" | "Average" | "Below Average" | "Weak" | "Very Weak"
    rank: number // 1 = strongest planet in chart
  }

  // Human-readable summary
  summary: string // 2-3 sentence summary
  keyStrengths: string[] // what this planet does well
  keyWeaknesses: string[] // what this planet struggles with
  recommendations: string[] // brief remedy pointers
}

export interface ChartStrengthAnalysis {
  planets: PlanetStrengthReport[]
  strongestPlanet: PlanetName
  weakestPlanet: PlanetName
  yogaKaraka?: PlanetName // best planet for this ascendant
  functionalBenefics: PlanetName[]
  functionalMalefics: PlanetName[]
  overallChartStrength: "Strong" | "Above Average" | "Average" | "Below Average" | "Weak"
  summary: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const DIGNITY_SCORES: Record<Dignity, number> = {
  exalted: 100,
  moolatrikona: 85,
  own: 75,
  friendly: 60,
  neutral: 40,
  enemy: 25,
  debilitated: 10,
}

const STRENGTH_LABEL_THRESHOLDS = [
  { min: 85, label: "Exceptional" as const },
  { min: 70, label: "Strong" as const },
  { min: 60, label: "Above Average" as const },
  { min: 45, label: "Average" as const },
  { min: 30, label: "Below Average" as const },
  { min: 15, label: "Weak" as const },
  { min: 0, label: "Very Weak" as const },
]

// ═══════════════════════════════════════════════════════════════════════════
// COMBUSTION ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

function analyzeCombustion(planet: PlanetData): PlanetStrengthReport["combustion"] {
  if (!planet.isCombust || planet.combustDistance === undefined) {
    return {
      isCombust: false,
      severity: "none",
      strengthLoss: 0,
      interpretation: "This planet is not combust and operates at full strength.",
    }
  }

  const distance = planet.combustDistance
  let severity: "mild" | "moderate" | "severe"
  let strengthLoss: number

  if (distance < 3) {
    severity = "severe"
    strengthLoss = 75
  } else if (distance < 6) {
    severity = "moderate"
    strengthLoss = 50
  } else {
    severity = "mild"
    strengthLoss = 25
  }

  const interpretations: Record<PlanetName, string> = {
    Sun: "This planet is the Sun itself, so combustion analysis does not apply.",
    Moon: "Emotional sensitivity and inner peace are clouded by the solar ego. Your mind feels pressured by authority and personal will. Mother's influence or emotional nurturing may feel diminished.",
    Mars: "Your initiative and courage are suppressed by solar ego. Physical energy is directed through willpower rather than spontaneous action. Direct confrontation feels difficult.",
    Mercury:
      "Your intellect is very close to the soul. When within 1°, this creates Budha-Aditya Yoga (powerful intellectual fusion). Otherwise, communication is filtered through ego; you may intellectualize rather than connect.",
    Jupiter:
      "Your wisdom and expansion are curtailed by the authority of ego. Guru energy and teacher influence are weakened. Your dharmic and philosophical inclinations feel subdued.",
    Venus: "Relationship harmony is affected. Your aesthetic sense is refined but suppressed. Material comforts may come with ego attachment or conditional love.",
    Saturn:
      "Discipline and structure are challenged by authority. You face karmic lessons around power, humility, and the proper use of authority. Your inner strength may feel constrained.",
    Rahu: "Rahu cannot be combust (it has no day/night significance).",
    Ketu: "Ketu cannot be combust (it has no day/night significance).",
  }

  return {
    isCombust: true,
    distance,
    severity,
    strengthLoss,
    interpretation: interpretations[planet.name],
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RETROGRESSION ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

function analyzeRetrogression(planet: PlanetData): PlanetStrengthReport["retrogression"] {
  let strengthModifier = 1.0
  let interpretation = ""

  if (!planet.retrograde) {
    return {
      isRetrograde: false,
      speed: planet.speed,
      interpretation: "This planet is direct and operates in the normal forward manner.",
      strengthModifier: 1.0,
    }
  }

  // In Vedic astrology, retrograde planets are NOT weak
  // They gain Cheshta Bala (60 Shashtiamsas, maximum)
  // They deliver results of the previous house and are intensified
  const interpretations: Record<PlanetName, string> = {
    Sun: "Direct motion only (the Sun never retrograde in Vedic astrology).",
    Moon: "Direct motion only (the Moon never retrograde in Vedic astrology).",
    Mars: "Your inner fire is intensified. Past-life warrior energy surfaces. You may struggle with direct confrontation, but you have deep reserves of courage and determination building within.",
    Mercury:
      "Your intelligence is introspective and reflective. You revisit past communications and learning patterns. Strong analytical and research abilities, though you may second-guess decisions.",
    Jupiter:
      "Your wisdom is internalized and personally sought. You follow a spiritual path based on internal realization rather than institutional authority. Non-traditional guru energy.",
    Venus:
      "Your approach to love and beauty is deep and unconventional. Past-life relationship karma is being actively resolved. Your values are internally defined; you love in your own unique way.",
    Saturn:
      "Your karmic debts are being actively resolved. Inner discipline is stronger than external structures. You are working through past-life authority issues; your limitations teach.",
    Rahu: "This node is always retrograde in classical reckoning.",
    Ketu: "This node is always retrograde in classical reckoning.",
  }

  // Slight strength boost for retrograde (they gain maximum Cheshta Bala)
  // But NOT for luminaries which never retrograde
  if (planet.name !== "Sun" && planet.name !== "Moon") {
    strengthModifier = 1.1 // 10% boost from Cheshta Bala
  }

  interpretation = interpretations[planet.name]

  return {
    isRetrograde: planet.retrograde,
    speed: Math.abs(planet.speed),
    interpretation,
    strengthModifier,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DIGNITY ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

function analyzeDignity(planet: PlanetData, chart: NatalChart): PlanetStrengthReport["dignityAnalysis"] {
  const dignity = planet.dignity
  const dignityScore = DIGNITY_SCORES[dignity]

  const signLord = planet.sign.lord
  const lordName = signLord || "Unknown"

  const dignityTexts: Record<Dignity, string> = {
    exalted:
      "This planet is exalted, operating at peak power in this sign. It brings exceptional results and overcomes obstacles.",
    moolatrikona:
      "This planet rules its own special region. It delivers its natural significations powerfully and with consistent strength.",
    own: "In its own sign, this planet operates according to its nature. It is comfortable and delivers good results.",
    friendly: "In a friendly sign, this planet operates fairly well. Its significations are supported by the sign lord.",
    neutral:
      "In a neutral sign, this planet operates without particular help or hindrance. Results are mixed and contextual.",
    enemy: "In an enemy sign, this planet faces obstacles. Its significations are challenged and results come with difficulty.",
    debilitated:
      "Debilitated in this sign, this planet struggles. Its natural significations are compromised; remedies are beneficial.",
  }

  const lordRelationship = `The ${planet.name} is in ${planet.sign.name} (${dignity}), ruled by ${lordName}.`

  return {
    dignity,
    dignityScore,
    lordRelationship,
    interpretation: dignityTexts[dignity],
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOUSE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

function analyzeHousePlacement(
  planet: PlanetData,
  chart: NatalChart,
): PlanetStrengthReport["houseAnalysis"] {
  const house = planet.house
  let houseType: "kendra" | "trikona" | "upachaya" | "dusthana" | "maraka" | "neutral"
  let isWellPlaced = false

  // Determine house type
  if (KENDRA_HOUSES.includes(house)) {
    houseType = "kendra"
    isWellPlaced = ["Venus", "Mercury"].includes(planet.name) // Beneficial in Kendras
  } else if (TRIKONA_HOUSES.includes(house)) {
    houseType = "trikona"
    isWellPlaced = true // All planets benefit from Trikona
  } else if (DUSTHANA_HOUSES.includes(house)) {
    houseType = "dusthana"
    isWellPlaced = ["Mars", "Saturn"].includes(planet.name) // Mars, Saturn can do well here
  } else if (house === 3) {
    houseType = "upachaya"
    isWellPlaced = ["Mars", "Saturn"].includes(planet.name)
  } else if (house === 11) {
    houseType = "upachaya"
    isWellPlaced = true // All planets do well in 11th (gains house)
  } else if (house === 2 || house === 7) {
    houseType = "maraka"
    isWellPlaced = false // Maraka houses (death-dealing)
  } else {
    houseType = "neutral"
    isWellPlaced = false
  }

  const houseInterpretations: Record<number, string> = {
    1: "In the Ascendant, this planet strongly impacts personality and life direction.",
    2: "In the 2nd house of wealth and family, this planet affects material security and values.",
    3: "In the 3rd house of courage and communication, this planet drives initiative and speech.",
    4: "In the 4th house of home and mother, this planet influences domestic stability.",
    5: "In the 5th house of creativity and children, this planet brings creative expression.",
    6: "In the 6th house of health and enemies, this planet addresses conflicts and service.",
    7: "In the 7th house of partnership, this planet shapes relationship dynamics.",
    8: "In the 8th house of transformation, this planet brings hidden strength and occult study.",
    9: "In the 9th house of dharma, this planet guides spiritual growth and higher learning.",
    10: "In the 10th house of career, this planet directs professional achievement.",
    11: "In the 11th house of gains, this planet brings friendships and prosperity.",
    12: "In the 12th house of losses, this planet addresses spirituality, liberation, and solitude.",
  }

  const interpretation = houseInterpretations[house] || `This planet is placed in house ${house}.`

  return {
    house,
    houseType,
    isWellPlaced,
    interpretation,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCTIONAL BENEFIC/MALEFIC DETERMINATION
// ═══════════════════════════════════════════════════════════════════════════

function determineFunctionalNature(
  planet: PlanetName,
  chart: NatalChart,
): { isBenefic: boolean; isYogaKaraka: boolean } {
  const ascendantIndex = Math.floor(((chart.ascendant % 360) + 360) % 360 / 30)

  // Determine which houses each planet rules
  const planetHouses = new Map<PlanetName, number[]>()

  // All 9 planets
  for (const sign of SIGNS) {
    const ruler = sign.lord as PlanetName
    if (!planetHouses.has(ruler)) {
      planetHouses.set(ruler, [])
    }
    const houses = planetHouses.get(ruler)
    if (houses) {
      const houseNumber = (sign.index - ascendantIndex + 12) % 12 || 12
      houses.push(houseNumber)
    }
  }

  const ruledHouses = planetHouses.get(planet) || []
  const kendraCounts = ruledHouses.filter((h) => KENDRA_HOUSES.includes(h)).length
  const trikonaCount = ruledHouses.filter((h) => TRIKONA_HOUSES.includes(h)).length
  const dusthanaCount = ruledHouses.filter((h) => DUSTHANA_HOUSES.includes(h)).length

  // Yoga Karaka: owns both Kendra and Trikona
  const isYogaKaraka = kendraCounts > 0 && trikonaCount > 0

  // Functional benefic/malefic logic
  const isBenefic = trikonaCount > 0 || (kendraCounts === 0 && dusthanaCount === 0)

  return { isBenefic, isYogaKaraka }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE STRENGTH SCORING
// ═══════════════════════════════════════════════════════════════════════════

function calculateCompositeStrength(
  planet: PlanetData,
  chart: NatalChart,
  shadbala: ShadBalaResult | undefined,
  warStatus: PlanetWarStatus | undefined,
  isRetrograde: boolean,
  combustionLoss: number,
  dignityScore: number,
  houseScore: number,
): number {
  let rawScore = 0

  // Component 1: Shadbala (35% weight) — only for planets that have it
  let shadBalaComponent = 0
  if (shadbala) {
    // Assume shadbala gives a score 0-100
    shadBalaComponent = (shadbala.percentile ?? 50) * 0.35
  } else {
    // For Rahu/Ketu, use a neutral contribution
    shadBalaComponent = 50 * 0.35
  }

  // Component 2: Dignity (25% weight)
  const dignityComponent = dignityScore * 0.25

  // Component 3: House placement (15% weight)
  const houseComponent = houseScore * 0.15

  rawScore = shadBalaComponent + dignityComponent + houseComponent

  // Apply modifiers
  let adjusted = rawScore

  // Combustion loss (percentage reduction)
  adjusted = adjusted * (1 - combustionLoss / 100)

  // War modifier
  if (warStatus && warStatus.isInWar) {
    adjusted = adjusted * warStatus.strengthModifier
  }

  // Retrogression boost (only for non-luminaries)
  if (isRetrograde && planet.name !== "Sun" && planet.name !== "Moon") {
    adjusted = adjusted * 1.1
  }

  return Math.max(0, Math.min(100, adjusted))
}

function getHouseScore(houseType: string): number {
  const scores: Record<string, number> = {
    kendra: 85,
    trikona: 90,
    upachaya: 60,
    dusthana: 30,
    maraka: 40,
    neutral: 50,
  }
  return scores[houseType] || 50
}

function getStrengthLabel(score: number): PlanetStrengthReport["compositeStrength"]["label"] {
  for (const threshold of STRENGTH_LABEL_THRESHOLDS) {
    if (score >= threshold.min) {
      return threshold.label
    }
  }
  return "Very Weak"
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE SUMMARY AND RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════

function generateSummary(
  planet: PlanetData,
  report: Omit<PlanetStrengthReport, "summary" | "keyStrengths" | "keyWeaknesses" | "recommendations">,
): { summary: string; keyStrengths: string[]; keyWeaknesses: string[]; recommendations: string[] } {
  const { compositeStrength, houseAnalysis, dignityAnalysis, retrogression, combustion } = report

  const keyStrengths: string[] = []
  const keyWeaknesses: string[] = []
  const recommendations: string[] = []

  // Analyze strengths
  if (compositeStrength.label === "Exceptional" || compositeStrength.label === "Strong") {
    if (dignityAnalysis.dignity === "exalted") {
      keyStrengths.push("Exalted position brings peak power")
    }
    if (houseAnalysis.houseType === "trikona") {
      keyStrengths.push(`Trikona placement (house ${houseAnalysis.house}) amplifies natural qualities`)
    }
  }

  // Analyze weaknesses
  if (combustion.isCombust) {
    keyWeaknesses.push(`Combustion by the Sun reduces strength by ${combustion.strengthLoss}%`)
  }
  if (dignityAnalysis.dignity === "debilitated") {
    keyWeaknesses.push("Debilitated position compromises significations")
  }
  if (houseAnalysis.houseType === "dusthana") {
    keyWeaknesses.push(`Dusthana placement (house ${houseAnalysis.house}) creates obstacles`)
  }

  // Retrograde interpretation
  if (retrogression.isRetrograde && planet.name !== "Sun" && planet.name !== "Moon") {
    keyStrengths.push("Retrograde status brings internalized, intense expression")
  }

  // Recommendations
  if (combustion.severity === "severe") {
    recommendations.push("Consider Surya-related remedies (Sun worship, yellow items)")
  }
  if (dignityAnalysis.dignity === "debilitated") {
    recommendations.push(`Strengthen through gemstone/mantra for ${planet.name}`)
  }
  if (houseAnalysis.houseType === "dusthana") {
    recommendations.push("Perform charitable acts to mitigate negative house effects")
  }

  // Build summary
  const rank =
    compositeStrength.label === "Exceptional"
      ? "exceptional"
      : compositeStrength.label === "Strong"
        ? "strong"
        : "moderate"

  const retroText = retrogression.isRetrograde ? " (retrograde)" : ""
  const combustText = combustion.isCombust ? ` combust by ${combustion.strengthLoss}%,` : ""

  const summary =
    `${planet.name} in your chart is ${compositeStrength.label} (rank #${compositeStrength.rank}). ` +
    `Placed in house ${houseAnalysis.house} (${houseAnalysis.houseType}),${combustText} ` +
    `${planet.name} is ${dignityAnalysis.dignity}${retroText}. ` +
    `This placement ${houseAnalysis.isWellPlaced ? "supports" : "challenges"} your growth.`

  return {
    summary,
    keyStrengths: keyStrengths.length > 0 ? keyStrengths : ["Stable planetary function"],
    keyWeaknesses: keyWeaknesses.length > 0 ? keyWeaknesses : ["Minor challenges"],
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ["Regular meditation on planetary energy"],
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ANALYSIS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

export function analyzePlanetStrength(planet: PlanetData, chart: NatalChart): PlanetStrengthReport {
  // Calculate individual components
  const allShadbala =
    planet.name === "Rahu" || planet.name === "Ketu" ? undefined : calculateShadbala(chart)
  const shadbala = allShadbala?.find((s) => s.planet === planet.name)

  const warStatuses = getAllPlanetWarStatuses(chart)
  const warStatus =
    planet.name === "Sun" || planet.name === "Moon" || planet.name === "Rahu" || planet.name === "Ketu"
      ? undefined
      : warStatuses.find((w) => w.planet === planet.name)

  const combustion = analyzeCombustion(planet)
  const retrogression = analyzeRetrogression(planet)
  const dignityAnalysis = analyzeDignity(planet, chart)
  const houseAnalysis = analyzeHousePlacement(planet, chart)

  // Calculate composite strength
  const houseScore = getHouseScore(houseAnalysis.houseType)
  const compositeRaw = calculateCompositeStrength(
    planet,
    chart,
    shadbala,
    warStatus,
    retrogression.isRetrograde,
    combustion.strengthLoss,
    dignityAnalysis.dignityScore,
    houseScore,
  )

  const report: Omit<PlanetStrengthReport, "summary" | "keyStrengths" | "keyWeaknesses" | "recommendations"> =
    {
      planet: planet.name,
      shadbala,
      warStatus,
      combustion,
      retrogression,
      dignityAnalysis,
      houseAnalysis,
      compositeStrength: {
        raw: compositeRaw,
        adjusted: compositeRaw, // Will be ranked after all planets analyzed
        label: getStrengthLabel(compositeRaw),
        rank: 0, // Will be set during chart analysis
      },
    }

  const { summary, keyStrengths, keyWeaknesses, recommendations } = generateSummary(planet, report)

  return {
    ...report,
    summary,
    keyStrengths,
    keyWeaknesses,
    recommendations,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART STRENGTH ANALYSIS (MAIN EXPORTED FUNCTION)
// ═══════════════════════════════════════════════════════════════════════════

export function analyzeChartStrength(chart: NatalChart): ChartStrengthAnalysis {
  // Analyze all planets
  const planetReports = chart.planets.map((planet) => analyzePlanetStrength(planet, chart))

  // Rank planets by adjusted strength
  const sortedByStrength = [...planetReports].sort((a, b) => b.compositeStrength.adjusted - a.compositeStrength.adjusted)

  // Assign ranks
  for (let i = 0; i < sortedByStrength.length; i++) {
    const report = planetReports.find((p) => p.planet === sortedByStrength[i].planet)
    if (report) {
      report.compositeStrength.rank = i + 1
    }
  }

  const strongestPlanet = sortedByStrength[0].planet
  const weakestPlanet = sortedByStrength[sortedByStrength.length - 1].planet

  // Determine functional benefics and malefics
  const functionalBenefics: PlanetName[] = []
  const functionalMalefics: PlanetName[] = []
  let yogaKaraka: PlanetName | undefined

  const allPlanets = chart.planets.map((p) => p.name)

  for (const planetName of allPlanets) {
    const { isBenefic, isYogaKaraka } = determineFunctionalNature(planetName, chart)

    if (isYogaKaraka) {
      yogaKaraka = planetName
      functionalBenefics.push(planetName)
    } else if (isBenefic) {
      functionalBenefics.push(planetName)
    } else {
      functionalMalefics.push(planetName)
    }
  }

  // Calculate overall chart strength
  const averageStrength =
    planetReports.reduce((sum, p) => sum + p.compositeStrength.adjusted, 0) / planetReports.length

  let overallChartStrength: "Strong" | "Above Average" | "Average" | "Below Average" | "Weak"
  if (averageStrength >= 70) {
    overallChartStrength = "Strong"
  } else if (averageStrength >= 60) {
    overallChartStrength = "Above Average"
  } else if (averageStrength >= 45) {
    overallChartStrength = "Average"
  } else if (averageStrength >= 30) {
    overallChartStrength = "Below Average"
  } else {
    overallChartStrength = "Weak"
  }

  // Generate chart summary
  const chartSummary =
    `Your natal chart shows ${overallChartStrength} overall strength. ` +
    `${strongestPlanet} is your strongest planet (rank #1), ` +
    `while ${weakestPlanet} requires the most support. ` +
    (yogaKaraka ? `${yogaKaraka} is your Yoga Karaka (best planet for your ascendant). ` : "") +
    `Focus on strengthening ${weakestPlanet} through remedies and conscious work.`

  return {
    planets: planetReports,
    strongestPlanet,
    weakestPlanet,
    yogaKaraka,
    functionalBenefics,
    functionalMalefics,
    overallChartStrength,
    summary: chartSummary,
  }
}
