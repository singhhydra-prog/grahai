/* ════════════════════════════════════════════════════════
   GrahAI — Kundli Report Data Assembler

   Collects all chart data, yogas, doshas, dashas, remedies,
   and references into a single report structure for PDF rendering.
   ════════════════════════════════════════════════════════ */

import type {
  NatalChart, KundliReport, BirthDetails, DashaAnalysis,
  YogaResult, DoshaResult, DivisionalChart, PlanetName,
} from "../ephemeris/types"
import { generateNatalChart } from "../ephemeris/sweph-wrapper"
import { calculateFullDasha, getDashaTimeline, formatDashaPeriod } from "../ephemeris/dasha-engine"
import { generateDivisionalChart, getVargottamaPlanets } from "../ephemeris/divisional-charts"
import { analyzeAllYogas, getActiveYogas } from "../ephemeris/yogas"
import { analyzeAllDoshas, getActiveDoshas } from "../ephemeris/doshas"
import {
  getYogaReference, getDoshaReference, getHouseReference, getPlanetReference,
} from "../astrology-data/bphs-references"
import {
  PLANET_REMEDIES, getDoshaRemedies, generateRemedySummary,
  type ChartRemedySummary,
} from "../astrology-data/remedy-database"
import { SIGNS, HOUSE_SIGNIFICANCES } from "../ephemeris/constants"
import { analyzeChartStrength, type ChartStrengthAnalysis } from "../ephemeris/planet-strength"
import { calculateAshtakavarga, getAshtakavargaSummary, getAllHouseStrengths, type AshtakavargaResult, type AshtakavargaSummary } from "../ephemeris/ashtakavarga"
import { analyzeVargas, type VargaInterpretation } from "../ephemeris/varga-interpretation"
import { analyzeDoshaCancellations, type ComprehensiveDoshaAnalysis } from "../ephemeris/dosha-cancellations"
import { getSAVTransitReport, type SAVTransitReport } from "../ephemeris/sav-transit-timing"
import { getBhavaChalitReport, type BhavaChalitReport } from "../ephemeris/bhava-chalit"
import { synthesizeChart, type FullChartSynthesis } from "../ephemeris/chart-synthesis"

// ─── Report Data Structure ──────────────────────────────

export interface ReportData {
  // Header
  name: string
  birthDetails: BirthDetails
  generatedAt: Date

  // Charts
  natalChart: NatalChart
  navamsaChart: DivisionalChart
  dasamsaChart: DivisionalChart

  // Planet table
  planetTable: PlanetTableRow[]

  // Nakshatra
  nakshatraAnalysis: {
    name: string
    lord: string
    deity: string
    pada: number
    characteristics: string
  }

  // Dashas
  dashaAnalysis: DashaAnalysis
  dashaTimeline: Array<{
    mahadasha: PlanetName
    antardasha: PlanetName
    startDate: Date
    endDate: Date
    durationMonths: number
  }>

  // Yogas
  yogas: YogaResult[]

  // Doshas
  doshas: DoshaResult[]

  // Houses
  houseAnalysis: HouseAnalysisRow[]

  // Remedies
  remedies: ChartRemedySummary

  // Planet Strength Analysis (Shadbala + Combustion + Retrogression + Graha Yuddha)
  strengthAnalysis: ChartStrengthAnalysis

  // Vargottama
  vargottamaPlanets: PlanetName[]

  // Ashtakavarga (BPHS Ch.66-72)
  ashtakavarga: AshtakavargaResult
  ashtakavargaSummary: AshtakavargaSummary
  houseStrengths: Array<{ house: number; sav: number; strength: string; meaning: string }>

  // Varga Interpretation (D9 Navamsa + D10 Dasamsa)
  vargaInterpretation: VargaInterpretation

  // Dosha Cancellations (Dosha Bhanga)
  doshaCancellations: ComprehensiveDoshaAnalysis

  // SAV Transit Analysis (BPHS Ch.66-72 applied to Gochar)
  savTransitReport: SAVTransitReport

  // Bhava Chalit (Equal House System)
  bhavaChalitReport: BhavaChalitReport

  // Full Chart Synthesis (multi-factor analysis)
  chartSynthesis: FullChartSynthesis

  // Classical references bibliography
  bibliography: Array<{ source: string, chapter: number, topic: string }>
}

export interface PlanetTableRow {
  planet: string
  sanskrit: string
  sign: string
  degree: string
  nakshatra: string
  pada: number
  house: number
  dignity: string
  retrograde: boolean
  combustion: boolean
  navamsaSign: string
}

export interface HouseAnalysisRow {
  house: number
  sign: string
  lord: string
  lordPlacement: number
  planetsInHouse: string[]
  significance: string
  interpretation: string
}

// ─── Nakshatra Characteristics ──────────────────────────

const NAKSHATRA_CHARS: Record<string, string> = {
  "Ashwini": "Swift, initiative, healing ability. The native is energetic and pioneering.",
  "Bharani": "Creative, transformative, bearing burdens with grace. Strong willpower.",
  "Krittika": "Sharp, purifying, critical thinking. The native is courageous and determined.",
  "Rohini": "Beautiful, creative, growth-oriented. The native is charming and prosperous.",
  "Mrigashira": "Searching, curious, gentle. The native is intellectual and restless.",
  "Ardra": "Intense, transformative, emotional depth. The native overcomes storms.",
  "Punarvasu": "Returning to light, optimistic, nurturing. The native is generous.",
  "Pushya": "Nourishing, most auspicious, supportive. The native is wise and caring.",
  "Ashlesha": "Mystical, serpentine energy, deep insight. The native is intuitive.",
  "Magha": "Royal, ancestral power, authority. The native commands respect.",
  "Purva Phalguni": "Creative, joyful, romantic. The native enjoys luxury and arts.",
  "Uttara Phalguni": "Patronage, helpful, charitable. The native is generous and reliable.",
  "Hasta": "Skillful, crafty, resourceful. The native is clever with hands.",
  "Chitra": "Brilliant, artistic, visionary. The native creates beautiful things.",
  "Swati": "Independent, flexible, scattering seeds. The native is adaptable.",
  "Vishakha": "Determined, goal-oriented, splitting paths. The native achieves goals.",
  "Anuradha": "Devoted, friendly, mystical. The native values deep connections.",
  "Jyeshtha": "Eldest, protective, chief. The native is authoritative and brave.",
  "Moola": "Root, investigative, destroying to rebuild. The native seeks truth.",
  "Purva Ashadha": "Invincible, purifying water, declarations. The native is confident.",
  "Uttara Ashadha": "Universal victory, permanent. The native achieves lasting success.",
  "Shravana": "Listening, learning, connection. The native is knowledgeable.",
  "Dhanishta": "Wealthy, musical, generous. The native accumulates resources.",
  "Shatabhisha": "Hundred healers, secretive, mystical. The native heals others.",
  "Purva Bhadrapada": "Scorching, passionate, spiritual fire. The native is intense.",
  "Uttara Bhadrapada": "Deep, occult, warrior of the deep. The native is wise and stable.",
  "Revati": "Nourishing, protective, final journey. The native is compassionate.",
}

// ─── Report Assembly ────────────────────────────────────

/**
 * Assemble all data for a complete Kundli report.
 */
export async function assembleReportData(
  birthDetails: BirthDetails,
  name?: string
): Promise<ReportData> {
  // 1. Generate natal chart
  const natalChart = await generateNatalChart(birthDetails, name)

  // 2. Generate key divisional charts
  const navamsaChart = generateDivisionalChart(natalChart, "D9")
  const dasamsaChart = generateDivisionalChart(natalChart, "D10")

  // 3. Planet table
  const planetTable = natalChart.planets.map(p => {
    const navPlanet = navamsaChart.planets.find(np => np.name === p.name)
    return {
      planet: p.name,
      sanskrit: getSanskritName(p.name),
      sign: p.sign.name,
      degree: `${Math.floor(p.degree)}° ${Math.floor((p.degree % 1) * 60)}'`,
      nakshatra: p.nakshatra?.name || "—",
      pada: p.nakshatra?.pada || 0,
      house: p.house,
      dignity: p.dignity || "neutral",
      retrograde: p.retrograde,
      combustion: false, // computed separately if needed
      navamsaSign: navPlanet?.sign?.name || "—",
    }
  })

  // 4. Nakshatra analysis (Janma Nakshatra = Moon's Nakshatra)
  const moonPlanet = natalChart.planets.find(p => p.name === "Moon")!
  const janmaNak = moonPlanet.nakshatra!
  const nakshatraAnalysis = {
    name: janmaNak.name,
    lord: janmaNak.lord,
    deity: janmaNak.deity,
    pada: janmaNak.pada,
    characteristics: NAKSHATRA_CHARS[janmaNak.name] || "A unique nakshatra with special qualities.",
  }

  // 5. Dasha analysis
  const dashaAnalysis = calculateFullDasha(natalChart)
  const dashaTimeline = getDashaTimeline(natalChart, 20)

  // 6. Yoga detection
  const yogas = getActiveYogas(natalChart)

  // 7. Dosha detection
  const doshas = getActiveDoshas(natalChart)

  // 8. House analysis
  const houseAnalysis = buildHouseAnalysis(natalChart)

  // 9. Remedies — build from afflicted planets and doshas
  const afflictedPlanets = findAfflictedPlanets(natalChart)
  const doshaForRemedies = doshas.map(d => ({
    name: d.type,
    severity: (d.severity === "high" ? "severe" : d.severity === "medium" ? "moderate" : "mild") as "mild" | "moderate" | "severe",
  }))
  const remedies = generateRemedySummary(afflictedPlanets, doshaForRemedies)

  // 10. Planet Strength Analysis (Shadbala + Combustion + Retrogression + Graha Yuddha)
  const strengthAnalysis = analyzeChartStrength(natalChart)

  // 11. Vargottama
  const vargottamaPlanets = getVargottamaPlanets(natalChart)

  // 12. Ashtakavarga (BPHS Ch.66-72)
  const ashtakavarga = calculateAshtakavarga(natalChart)
  const ashtakavargaSummary = getAshtakavargaSummary(ashtakavarga)
  const houseStrengths = getAllHouseStrengths(ashtakavarga)

  // 13. Varga Interpretation (D9 + D10)
  const vargaInterpretation = analyzeVargas(natalChart)

  // 14. Dosha Cancellations (Dosha Bhanga)
  const doshaCancellations = analyzeDoshaCancellations(natalChart)

  // 15. SAV Transit Report (Ashtakavarga-enhanced transits)
  const savTransitReport = await getSAVTransitReport(natalChart)

  // 16. Bhava Chalit Report (Equal house system)
  const bhavaChalitReport = getBhavaChalitReport(natalChart)

  // 17. Full Chart Synthesis (multi-factor analysis)
  const chartSynthesis = synthesizeChart(natalChart)

  // 18. Bibliography
  const bibliography = buildBibliography(yogas, doshas)

  return {
    name: name || "Native",
    birthDetails,
    generatedAt: new Date(),
    natalChart,
    navamsaChart,
    dasamsaChart,
    planetTable,
    nakshatraAnalysis,
    dashaAnalysis,
    dashaTimeline,
    yogas,
    doshas,
    houseAnalysis,
    remedies,
    strengthAnalysis,
    vargottamaPlanets,
    ashtakavarga,
    ashtakavargaSummary,
    houseStrengths,
    vargaInterpretation,
    doshaCancellations,
    savTransitReport,
    bhavaChalitReport,
    chartSynthesis,
    bibliography,
  }
}

// ─── Helper: Sanskrit Names ─────────────────────────────

function getSanskritName(planet: string): string {
  const map: Record<string, string> = {
    Sun: "सूर्य (Surya)", Moon: "चन्द्र (Chandra)", Mars: "मंगल (Mangal)",
    Mercury: "बुध (Budh)", Jupiter: "गुरु (Guru)", Venus: "शुक्र (Shukra)",
    Saturn: "शनि (Shani)", Rahu: "राहु (Rahu)", Ketu: "केतु (Ketu)",
  }
  return map[planet] || planet
}

// ─── Helper: House Analysis ─────────────────────────────

function buildHouseAnalysis(chart: NatalChart): HouseAnalysisRow[] {
  const analysis: HouseAnalysisRow[] = []

  for (let h = 1; h <= 12; h++) {
    const signIndex = ((Math.floor(chart.ascendant / 30) + h - 1) % 12)
    const sign = SIGNS[signIndex]
    const lord = sign.lord

    // Find where the house lord is placed
    const lordPlanet = chart.planets.find(p => p.name === lord)
    const lordPlacement = lordPlanet?.house || 0

    // Find planets in this house
    const planetsInHouse = chart.planets
      .filter(p => p.house === h)
      .map(p => p.name)

    const significance = HOUSE_SIGNIFICANCES[h]?.keywords?.join(", ") || ""

    // Generate interpretation
    let interpretation = `${sign.name} on the ${getOrdinal(h)} house cusp, ruled by ${lord}.`
    if (planetsInHouse.length > 0) {
      interpretation += ` Occupied by: ${planetsInHouse.join(", ")}.`
    }
    if (lordPlacement > 0) {
      interpretation += ` ${lord} (lord) is in the ${getOrdinal(lordPlacement)} house.`
    }

    analysis.push({
      house: h,
      sign: sign.name,
      lord,
      lordPlacement,
      planetsInHouse,
      significance,
      interpretation,
    })
  }

  return analysis
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// ─── Helper: Find Afflicted Planets ─────────────────────

function findAfflictedPlanets(chart: NatalChart): Array<{ planet: PlanetName, reason: string }> {
  const afflicted: Array<{ planet: PlanetName, reason: string }> = []

  for (const p of chart.planets) {
    const reasons: string[] = []

    if (p.dignity === "debilitated") reasons.push("debilitated")
    if (p.dignity === "enemy") reasons.push("in enemy sign")
    if (p.retrograde) reasons.push("retrograde")
    // Check combustion via angular distance from Sun
    if (p.name !== "Sun" && p.name !== "Rahu" && p.name !== "Ketu") {
      const sun = chart.planets.find(pl => pl.name === "Sun")
      if (sun) {
        const diff = Math.abs(p.longitude - sun.longitude)
        const angDist = diff > 180 ? 360 - diff : diff
        if (angDist < 6) reasons.push("combust")
      }
    }

    // In dusthana houses (6, 8, 12)
    if ([6, 8, 12].includes(p.house)) {
      reasons.push(`in ${getOrdinal(p.house)} house (dusthana)`)
    }

    if (reasons.length > 0) {
      afflicted.push({
        planet: p.name as PlanetName,
        reason: reasons.join(", "),
      })
    }
  }

  return afflicted
}

// ─── Helper: Bibliography ───────────────────────────────

function buildBibliography(
  yogas: YogaResult[],
  doshas: DoshaResult[]
): Array<{ source: string, chapter: number, topic: string }> {
  const refs: Array<{ source: string, chapter: number, topic: string }> = []
  const seen = new Set<string>()

  // Add yoga references
  for (const y of yogas) {
    const ref = getYogaReference(y.name)
    if (ref) {
      const key = `${ref.source}-${ref.chapter}`
      if (!seen.has(key)) {
        seen.add(key)
        refs.push({ source: ref.source, chapter: ref.chapter || 0, topic: y.name })
      }
    }
  }

  // Add dosha references
  for (const d of doshas) {
    const ref = getDoshaReference(d.type)
    if (ref) {
      const key = `${ref.source}-${ref.chapter}`
      if (!seen.has(key)) {
        seen.add(key)
        refs.push({ source: ref.source, chapter: ref.chapter || 0, topic: d.type })
      }
    }
  }

  // Always include BPHS core chapters
  const coreRefs = [
    { source: "BPHS", chapter: 3, topic: "Nature of Planets" },
    { source: "BPHS", chapter: 6, topic: "Divisional Charts (Varga)" },
    { source: "BPHS", chapter: 11, topic: "House Significations" },
    { source: "BPHS", chapter: 46, topic: "Vimshottari Dasha System" },
    { source: "BPHS", chapter: 65, topic: "Transit (Gochar) Effects" },
    { source: "BPHS", chapter: 66, topic: "Ashtakavarga System" },
  ]

  for (const r of coreRefs) {
    const key = `${r.source}-${r.chapter}`
    if (!seen.has(key)) {
      seen.add(key)
      refs.push(r)
    }
  }

  return refs.sort((a, b) => {
    if (a.source !== b.source) return a.source.localeCompare(b.source)
    return a.chapter - b.chapter
  })
}
