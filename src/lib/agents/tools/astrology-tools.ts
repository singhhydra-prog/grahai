import { createClient } from "@supabase/supabase-js"
import type { Tool } from "@anthropic-ai/sdk/resources/messages"

/* ════════════════════════════════════════════════════════
   ASTROLOGY TOOLS — Swiss Ephemeris Vedic Astrology Engine

   Jyotish Guru's computational capabilities powered by
   real Swiss Ephemeris calculations, complete Dasha system,
   50+ yogas, divisional charts, transit engine, PDF reports,
   and daily insights.
   ════════════════════════════════════════════════════════ */

import { generateNatalChart } from "@/lib/ephemeris/sweph-wrapper"
import { generateDivisionalChart, getVargottamaPlanets } from "@/lib/ephemeris/divisional-charts"
import { calculateFullDasha, getDashaTimeline, formatDashaPeriod } from "@/lib/ephemeris/dasha-engine"
import { getActiveYogas, analyzeAllYogas } from "@/lib/ephemeris/yogas"
import { getActiveDoshas, analyzeAllDoshas } from "@/lib/ephemeris/doshas"
import { analyzeTransits, getMoonTransit } from "@/lib/ephemeris/transit-engine"
import { calculatePanchang, getPanchangSummary } from "@/lib/ephemeris/panchang"
import { getPlanetRemedies, getDoshaRemedies, generateRemedySummary } from "@/lib/astrology-data/remedy-database"
import { getRelevantStories, getDailyStory } from "@/lib/astrology-data/vedic-stories"
import { generateDailyInsight } from "@/lib/daily-insights/insight-generator"
import type { BirthDetails, NatalChart, PlanetName } from "@/lib/ephemeris/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// ─── Helper: Parse Birth Details ────────────────────────

function parseBirthDetails(input: Record<string, unknown>): BirthDetails {
  return {
    date: input.date as string,
    time: (input.time as string) || "12:00",
    place: (input.place as string) || (input.location as string) || "Unknown",
    latitude: input.latitude as number,
    longitude: input.longitude as number,
    timezone: (input.timezone as number) || 5.5,
  }
}

// ─── Tool: Calculate Kundli (Upgraded) ──────────────────

async function calculateKundli(
  input: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const name = (input.name as string) || "Native"

  const chart = await generateNatalChart(birthDetails, name)

  // Build structured response
  const result = {
    name,
    birthDetails: {
      date: birthDetails.date,
      time: birthDetails.time,
      place: birthDetails.place,
      latitude: birthDetails.latitude,
      longitude: birthDetails.longitude,
      timezone: birthDetails.timezone,
    },
    ascendant: {
      sign: chart.ascendantSign,
      degree: `${Math.floor(chart.ascendant % 30)}° ${Math.floor(((chart.ascendant % 30) % 1) * 60)}'`,
    },
    planets: chart.planets.map(p => ({
      name: p.name,
      sign: p.sign.name,
      degree: `${Math.floor(p.degree)}° ${Math.floor((p.degree % 1) * 60)}'`,
      nakshatra: p.nakshatra?.name,
      pada: p.nakshatra?.pada,
      house: p.house,
      dignity: p.dignity,
      retrograde: p.retrograde,
    })),
    houses: chart.houses.map(h => ({
      number: h.number,
      sign: h.sign,
      degree: h.degree.toFixed(2),
    })),
    ayanamsa: chart.ayanamsa.toFixed(4),
    calculationMethod: "Swiss Ephemeris (Moshier mode)",
  }

  // Save to Supabase if user is logged in
  if (userId) {
    try {
      const sb = getSupabase()
      await sb.from("kundlis").upsert({
        user_id: userId,
        name,
        birth_date: birthDetails.date,
        birth_place: birthDetails.place,
        latitude: birthDetails.latitude,
        longitude: birthDetails.longitude,
        timezone: birthDetails.timezone,
        chart_data: result,
        is_primary: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,name" })
    } catch (err) {
      console.warn("Failed to save kundli:", err)
    }
  }

  return result
}

// ─── Tool: Get Dasha Periods (Upgraded) ─────────────────

async function getDashaPeriods(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const dashaAnalysis = calculateFullDasha(chart)
  const years = (input.years as number) || 20
  const timeline = getDashaTimeline(chart, years)

  return {
    currentMahadasha: dashaAnalysis.currentMahadasha
      ? { planet: dashaAnalysis.currentMahadasha.planet, start: dashaAnalysis.currentMahadasha.startDate, end: dashaAnalysis.currentMahadasha.endDate }
      : null,
    currentAntardasha: dashaAnalysis.currentAntardasha
      ? { planet: dashaAnalysis.currentAntardasha.planet, start: dashaAnalysis.currentAntardasha.startDate, end: dashaAnalysis.currentAntardasha.endDate }
      : null,
    mahadashaSequence: dashaAnalysis.mahadashas.map(m => ({
      planet: m.planet,
      years: m.durationYears,
      start: m.startDate,
      end: m.endDate,
      isCurrent: m.planet === dashaAnalysis.currentMahadasha?.planet,
    })),
    timeline: timeline.slice(0, 30).map(t => ({
      mahadasha: t.mahadasha,
      antardasha: t.antardasha,
      start: t.startDate.toISOString().split("T")[0],
      end: t.endDate.toISOString().split("T")[0],
      durationMonths: t.durationMonths,
    })),
    system: "Vimshottari (120-year cycle)",
    source: "BPHS Chapter 46",
  }
}

// ─── Tool: Analyze Yogas (Upgraded) ─────────────────────

async function analyzeYogas(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const yogas = getActiveYogas(chart)

  return {
    totalYogasFound: yogas.length,
    yogas: yogas.map(y => ({
      name: y.name,
      sanskrit: y.sanskrit,
      category: y.category,
      description: y.description,
      involvedPlanets: y.involvedPlanets,
      involvedHouses: y.involvedHouses,
      strength: y.strength,
      effects: y.effects,
      classicalReference: y.classicalReference,
    })),
    summary: yogas.length > 5
      ? `${yogas.length} yogas detected — a chart rich with planetary combinations.`
      : yogas.length > 2
        ? `${yogas.length} yogas detected — notable planetary combinations present.`
        : `${yogas.length} yoga(s) detected.`,
  }
}

// ─── Tool: Get Divisional Chart ─────────────────────────

async function getDivisionalChart(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const chartType = (input.chart_type as string) || "D9"

  const divChart = generateDivisionalChart(chart, chartType as any)

  return {
    chartType,
    chartName: divChart.name,
    purpose: divChart.purpose,
    planets: divChart.planets.map(p => ({
      name: p.name,
      sign: p.sign?.name,
      degree: p.degree?.toFixed(2),
      house: p.house,
    })),
    vargottamaPlanets: chartType === "D9"
      ? getVargottamaPlanets(chart).map(String)
      : undefined,
  }
}

// ─── Tool: Get Transit Effects ──────────────────────────

async function getTransitEffects(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const date = input.date ? new Date(input.date as string) : new Date()

  const analysis = await analyzeTransits(chart, date)
  const moonTransit = await getMoonTransit(chart, date)

  return {
    date: analysis.date.toISOString().split("T")[0],
    moonSign: analysis.moonSign,
    lagnaSign: analysis.lagnaSign,
    overallTrend: analysis.overallTrend,
    keyHighlights: analysis.keyHighlights,
    transits: analysis.transits.map(t => ({
      planet: t.planet,
      transitSign: t.transitSign,
      houseFromMoon: t.houseFromMoon,
      houseFromLagna: t.houseFromLagna,
      isBeneficTransit: t.isBeneficTransit,
      isVedhaBlocked: t.isVedhaBlocked,
      vedhaBy: t.vedhaBy,
      effect: t.effect,
      duration: t.duration,
      significance: t.significance,
      isRetrograde: t.isRetrograde,
    })),
    moonTransit: {
      currentSign: moonTransit.currentSign,
      houseFromMoon: moonTransit.houseFromNatalMoon,
      effect: moonTransit.effect,
      nakshatra: moonTransit.nakshatra,
    },
    sadeSati: analysis.sadeSatiStatus,
    source: "BPHS Chapter 65 (Gochar Phala)",
  }
}

// ─── Tool: Get Remedies ─────────────────────────────────

async function getRemedies(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)

  // Find afflicted planets
  const afflicted: Array<{ planet: PlanetName, reason: string }> = []
  for (const p of chart.planets) {
    const reasons: string[] = []
    if (p.dignity === "debilitated") reasons.push("debilitated")
    if (p.dignity === "enemy") reasons.push("in enemy sign")
    if (p.retrograde) reasons.push("retrograde")
    // Combustion check: planet close to Sun (within ~6°)
    if (p.name !== "Sun" && p.name !== "Rahu" && p.name !== "Ketu") {
      const sun = chart.planets.find(pl => pl.name === "Sun")
      if (sun) {
        const diff = Math.abs(p.longitude - sun.longitude)
        const angDist = diff > 180 ? 360 - diff : diff
        if (angDist < 6) reasons.push("combust")
      }
    }
    if ([6, 8, 12].includes(p.house)) reasons.push(`in dusthana house ${p.house}`)
    if (reasons.length > 0) {
      afflicted.push({ planet: p.name as PlanetName, reason: reasons.join(", ") })
    }
  }

  // Get doshas for remedies
  const doshas = getActiveDoshas(chart)
  const doshaForRemedies = doshas.map(d => ({
    name: d.type as string,
    severity: (d.severity === "high" ? "severe" : d.severity === "low" ? "mild" : "moderate") as "mild" | "moderate" | "severe",
  }))

  const summary = generateRemedySummary(afflicted, doshaForRemedies)

  return {
    afflictedPlanets: afflicted,
    detectedDoshas: doshas.map(d => ({ name: d.type, severity: d.severity })),
    planetRemedies: summary.planetRemedies.map(pr => ({
      planet: pr.planet,
      reason: pr.reason,
      primaryRemedy: pr.primaryRemedy,
      gemstone: pr.gemstone,
      mantra: pr.mantra,
    })),
    doshaRemedies: summary.doshaRemedies.map(dr => ({
      dosha: dr.dosha,
      severity: dr.severity,
      primaryRitual: dr.primaryRitual,
      mantra: dr.mantra,
    })),
    generalGuidance: summary.generalGuidance,
    source: "BPHS Chapters 77-84 (Remedial Measures)",
  }
}

// ─── Tool: Generate Report ──────────────────────────────

async function generateReport(
  input: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  if (!userId) {
    return { error: "You must be logged in to generate a report. Please sign in first." }
  }

  const kundliId = input.kundli_id as string
  const birthDetails = input.date ? parseBirthDetails(input) : null

  // Trigger report generation via internal API
  return {
    action: "report_generation_requested",
    kundliId,
    message: "Report generation has been initiated. You will receive a download link once the PDF is ready (usually 15-30 seconds).",
    endpoint: "/api/reports/generate",
    note: "The report includes: planetary positions, charts (D1/D9/D10), Dasha timeline, yogas, doshas, remedies, and classical references.",
  }
}

// ─── Tool: Get Daily Insight ────────────────────────────

async function getDailyInsight(
  input: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const name = (input.name as string) || "Friend"
  const date = input.date ? new Date(input.date as string) : new Date()

  const insight = await generateDailyInsight(
    userId || "anonymous",
    birthDetails,
    name,
    date
  )

  return {
    date: insight.date,
    headline: insight.headline,
    overallTrend: insight.overallTrend,
    panchang: insight.panchang,
    moonTransit: insight.moonTransit,
    keyTransits: insight.keyTransits,
    dashaContext: insight.dashaContext,
    activities: insight.activities,
    dailyRemedy: insight.dailyRemedy,
    bphsVerse: insight.bphsVerse,
    sadeSatiActive: insight.sadeSatiActive,
    sadeSatiPhase: insight.sadeSatiPhase,
  }
}

// ─── Tool: Get Panchang ─────────────────────────────────

async function getPanchangTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const date = input.date ? new Date(input.date as string) : new Date()
  const lat = (input.latitude as number) || 28.6139  // Default: Delhi
  const lng = (input.longitude as number) || 77.2090

  const panchang = await calculatePanchang(date, lat, lng)

  return {
    date: date.toISOString().split("T")[0],
    location: { latitude: lat, longitude: lng },
    tithi: { name: panchang.tithi.name, number: panchang.tithi.number, paksha: panchang.tithi.paksha, lord: panchang.tithi.lord },
    nakshatra: { name: panchang.nakshatra.name, lord: panchang.nakshatra.lord, deity: panchang.nakshatra.deity },
    yoga: { name: panchang.yoga.name, number: panchang.yoga.number },
    karana: { name: panchang.karana.name, number: panchang.karana.number },
    vara: { name: panchang.var.name, lord: panchang.var.lord },
    sunrise: panchang.sunrise,
    sunset: panchang.sunset,
    rahuKaal: panchang.rahukaal,
    gulikaKaal: panchang.gulikakaal,
    auspicious: panchang.auspicious,
    inauspicious: panchang.inauspicious,
    summary: getPanchangSummary(panchang),
  }
}

// ─── Tool: Get User Kundli ──────────────────────────────

async function getUserKundli(
  input: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  if (!userId) {
    return { error: "Please sign in to retrieve your saved chart." }
  }

  const sb = getSupabase()
  const name = input.name as string | undefined

  let query = sb.from("kundlis").select("*").eq("user_id", userId)
  if (name) {
    query = query.eq("name", name)
  } else {
    query = query.eq("is_primary", true)
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return { error: "No saved chart found. Please provide your birth details to calculate a new chart." }
  }

  return {
    name: data.name,
    birthDate: data.birth_date,
    birthPlace: data.birth_place,
    chartData: data.chart_data,
    savedAt: data.updated_at,
  }
}

// ═══════════════════════════════════════════════════════
//  TOOL DEFINITIONS — Anthropic Tool Schema
// ═══════════════════════════════════════════════════════

const birthDetailsProperties = {
  date: { type: "string" as const, description: "Birth date and time in ISO format (e.g., '1990-05-15T14:30:00')" },
  latitude: { type: "number" as const, description: "Birth location latitude (e.g., 28.6139 for Delhi)" },
  longitude: { type: "number" as const, description: "Birth location longitude (e.g., 77.2090 for Delhi)" },
  timezone: { type: "number" as const, description: "Timezone offset in hours from UTC (e.g., 5.5 for IST). Default: 5.5" },
  location: { type: "string" as const, description: "Birth place name (e.g., 'New Delhi, India')" },
}

export const ASTROLOGY_TOOL_DEFINITIONS: Tool[] = [
  {
    name: "calculate_kundli",
    description: "Generate a complete Vedic birth chart (Kundli) using Swiss Ephemeris precision. Calculates all 9 planetary positions (Sun through Ketu), 12 house cusps, nakshatras, planetary dignities, retrograde status, and combustion. Uses Lahiri ayanamsa for sidereal conversion. Saves chart to database if user is logged in.",
    input_schema: {
      type: "object" as const,
      properties: {
        ...birthDetailsProperties,
        name: { type: "string" as const, description: "Name of the person (optional, default: 'Native')" },
      },
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "get_dasha_periods",
    description: "Calculate complete Vimshottari Dasha periods including Mahadasha (major), Antardasha (sub), and timeline for the next N years. Based on Moon's Nakshatra position at birth. Returns current active period at all levels with start/end dates.",
    input_schema: {
      type: "object" as const,
      properties: {
        ...birthDetailsProperties,
        years: { type: "number" as const, description: "Number of years for timeline (default: 20)" },
      },
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "analyze_yogas",
    description: "Detect all active Vedic yogas in the birth chart. Identifies 50+ yogas including: Raj Yogas, Dhan Yogas, Pancha Mahapurusha, Gajakesari, Budhaditya, Vipreet Raj, Neecha Bhanga, and more. Each yoga includes classical BPHS reference, strength assessment, and effects.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "get_divisional_chart",
    description: "Generate a specific divisional chart (Varga). Supported: D1 (Rashi), D2 (Hora/wealth), D3 (Drekkana/siblings), D7 (Saptamsha/children), D9 (Navamsa/marriage+dharma), D10 (Dasamsa/career), D12 (Dwadasamsa/parents), D30 (Trimshamsa), D60 (Shashtiamsa). D9 Navamsa also returns Vargottama planets.",
    input_schema: {
      type: "object" as const,
      properties: {
        ...birthDetailsProperties,
        chart_type: { type: "string" as const, description: "Divisional chart type (D1, D2, D3, D7, D9, D10, D12, D30, D60). Default: D9" },
      },
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "get_transit_effects",
    description: "Analyze current planetary transits against the natal chart. Based on BPHS Chapter 65 (Gochar Phala). Includes beneficial/malefic classification, Vedha (obstruction) analysis, Sade Sati detection, Moon transit, and overall trend assessment. Each transit includes house from Moon, sign, and specific effects.",
    input_schema: {
      type: "object" as const,
      properties: {
        ...birthDetailsProperties,
        date: { type: "string" as const, description: "Transit date in ISO format (default: today)" },
      },
      required: ["latitude", "longitude"],
    },
  },
  {
    name: "get_remedies",
    description: "Get personalized Vedic remedies based on chart afflictions and doshas. Returns gemstone, mantra (Beej + Gayatri), fasting, charity (Daan), Rudraksha, and Yantra recommendations for each afflicted planet. Also provides dosha-specific remedial protocols with severity-appropriate prescriptions. All references from BPHS Chapters 77-84.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "generate_report",
    description: "Generate a professional downloadable PDF Kundli report (12+ pages). Includes: title page, planetary positions, D1/D9/D10 charts, nakshatra analysis, 20-year Dasha timeline, yoga analysis with BPHS refs, dosha analysis, house interpretation, remedies, and bibliography. Requires user to be logged in.",
    input_schema: {
      type: "object" as const,
      properties: {
        kundli_id: { type: "string" as const, description: "ID of saved Kundli to generate report for" },
        ...birthDetailsProperties,
        name: { type: "string" as const, description: "Name for the report" },
      },
      required: [],
    },
  },
  {
    name: "get_daily_insight",
    description: "Get today's personalized daily horoscope based on natal chart. Includes: today's Panchang, Moon transit effects, key slow-planet transits, active Dasha interpretation, favorable/unfavorable activities, daily remedy suggestion, and a BPHS verse of the day.",
    input_schema: {
      type: "object" as const,
      properties: {
        ...birthDetailsProperties,
        name: { type: "string" as const, description: "Person's name" },
      },
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "get_panchang",
    description: "Calculate today's Panchang (Hindu calendar) for a given location. Returns all 5 limbs: Tithi (lunar day), Nakshatra (Moon's mansion), Yoga (Sun+Moon combination), Karana (half-tithi), and Vara (weekday with planetary lord). Also includes Rahu Kaal, Gulika Kaal, special day detection (Ekadashi, Purnima, etc.), and overall auspiciousness rating.",
    input_schema: {
      type: "object" as const,
      properties: {
        date: { type: "string" as const, description: "Date in ISO format (default: today)" },
        latitude: { type: "number" as const, description: "Location latitude (default: 28.6139 / Delhi)" },
        longitude: { type: "number" as const, description: "Location longitude (default: 77.2090 / Delhi)" },
      },
      required: [],
    },
  },
  {
    name: "get_user_kundli",
    description: "Retrieve a user's saved birth chart from the database. Returns the stored chart data including all planetary positions, house cusps, and chart metadata. Use this before other analysis tools if the user has already saved their chart.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string" as const, description: "Name of the chart to retrieve (optional — defaults to primary chart)" },
      },
      required: [],
    },
  },
]

// ═══════════════════════════════════════════════════════
//  TOOL EXECUTOR — Routes tool calls to functions
// ═══════════════════════════════════════════════════════

export async function executeAstrologyTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId?: string
): Promise<unknown> {
  switch (toolName) {
    case "calculate_kundli":
      return calculateKundli(toolInput, userId)
    case "get_dasha_periods":
      return getDashaPeriods(toolInput)
    case "analyze_yogas":
      return analyzeYogas(toolInput)
    case "get_divisional_chart":
      return getDivisionalChart(toolInput)
    case "get_transit_effects":
      return getTransitEffects(toolInput)
    case "get_remedies":
      return getRemedies(toolInput)
    case "generate_report":
      return generateReport(toolInput, userId)
    case "get_daily_insight":
      return getDailyInsight(toolInput, userId)
    case "get_panchang":
      return getPanchangTool(toolInput)
    case "get_user_kundli":
      return getUserKundli(toolInput, userId)
    default:
      return { error: `Unknown astrology tool: ${toolName}` }
  }
}
