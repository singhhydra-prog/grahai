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
import { analyzeChartStrength, analyzePlanetStrength } from "@/lib/ephemeris/planet-strength"
import { calculateAshtakavarga, getAshtakavargaSummary, getAllHouseStrengths } from "@/lib/ephemeris/ashtakavarga"
import { analyzeVargas } from "@/lib/ephemeris/varga-interpretation"
import { analyzeDoshaCancellations } from "@/lib/ephemeris/dosha-cancellations"
import { getSAVTransitReport, getEnhancedGocharPhal } from "@/lib/ephemeris/sav-transit-timing"
import { getBhavaChalitReport } from "@/lib/ephemeris/bhava-chalit"
import { synthesizeChart, calculateLifeDomainScores, getChartSignature } from "@/lib/ephemeris/chart-synthesis"
import type { BirthDetails, NatalChart, PlanetName } from "@/lib/ephemeris/types"
import { resolveTimezoneOffset } from "@/lib/timezone-utils"

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
    timezone: resolveTimezoneOffset(input.timezone, input.date as string),
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

// ─── Tool: Analyze Planet Strength (Shadbala + War + Combustion + Retrogression) ──

async function analyzePlanetStrengthTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const planetName = input.planet as PlanetName | undefined

  if (planetName) {
    // Single planet analysis
    const planetData = chart.planets.find(p => p.name === planetName)
    if (!planetData) {
      return { error: `Planet '${planetName}' not found in chart. Valid: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu` }
    }

    const report = analyzePlanetStrength(planetData, chart)
    return {
      planet: report.planet,
      compositeStrength: report.compositeStrength,
      shadbala: report.shadbala ? {
        totalShadbala: report.shadbala.totalShadbala,
        shadbalaRupa: report.shadbala.shadbalaRupa,
        isStrong: report.shadbala.isStrong,
        strengthLabel: report.shadbala.strengthLabel,
        percentile: report.shadbala.percentile,
      } : null,
      warStatus: report.warStatus,
      combustion: report.combustion,
      retrogression: report.retrogression,
      dignityAnalysis: report.dignityAnalysis,
      keyStrengths: report.keyStrengths,
      keyWeaknesses: report.keyWeaknesses,
      recommendations: report.recommendations,
      summary: report.summary,
      source: "BPHS Chapters 17, 27 (Shadbala & Graha Yuddha)",
    }
  }

  // Full chart strength analysis
  const analysis = analyzeChartStrength(chart)

  return {
    strongestPlanet: analysis.strongestPlanet,
    weakestPlanet: analysis.weakestPlanet,
    yogaKaraka: analysis.yogaKaraka,
    functionalBenefics: analysis.functionalBenefics,
    functionalMalefics: analysis.functionalMalefics,
    overallChartStrength: analysis.overallChartStrength,
    planets: analysis.planets.map(r => ({
      planet: r.planet,
      compositeStrength: r.compositeStrength,
      shadbalaRupa: r.shadbala?.shadbalaRupa ?? null,
      isStrong: r.shadbala?.isStrong ?? null,
      inWar: r.warStatus?.isInWar ?? false,
      warWinner: r.warStatus?.isWinner ?? false,
      isCombust: r.combustion.isCombust,
      isRetrograde: r.retrogression.isRetrograde,
      dignity: r.dignityAnalysis.dignity,
      keyStrengths: r.keyStrengths,
      keyWeaknesses: r.keyWeaknesses,
    })),
    summary: analysis.summary,
    source: "BPHS Chapters 17, 27 (Shadbala & Graha Yuddha)",
  }
}

// ─── Tool: Get Ashtakavarga ──────────────────────────────

async function getAshtakavargaTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const result = calculateAshtakavarga(chart)
  const summary = getAshtakavargaSummary(result)
  const houseStrengths = getAllHouseStrengths(result)

  return {
    sarvashtakavarga: result.sarvashtakavarga,
    totalSAV: result.totalSAV,
    strongHouses: result.strongHouses,
    weakHouses: result.weakHouses,
    houseStrengths: houseStrengths.map(h => ({
      house: h.house,
      sav: h.sav,
      strength: h.strength,
      meaning: h.meaning,
    })),
    planets: result.planetAshtakavargas.map(p => ({
      planet: p.planet,
      totalBindus: p.totalBindus,
      strongSigns: p.strongSigns,
      weakSigns: p.weakSigns,
    })),
    summary: {
      overallStrength: summary.overallStrength,
      bestHouses: summary.bestHouses,
      worstHouses: summary.worstHouses,
      planetRankings: summary.planetRankings,
      transitGuidance: summary.transitGuidance,
    },
    source: "BPHS Chapters 66-72 (Ashtakavarga)",
  }
}

// ─── Tool: Analyze Vargas (D9 + D10 Deep Interpretation) ──

async function analyzeVargasTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const interpretation = analyzeVargas(chart)

  return {
    navamsa: {
      lagna: interpretation.navamsa.navamsaLagna,
      dignityShifts: interpretation.navamsa.planetDignityShifts.map(d => ({
        planet: d.planet,
        d1Dignity: d.d1Dignity,
        d9Dignity: d.d9Dignity,
        shift: d.shift,
        interpretation: d.interpretation,
      })),
      vargottamaPlanets: interpretation.navamsa.vargottamaPlanets,
      pushkaraPlanets: interpretation.navamsa.pushkaraPlanets,
      spouseIndicators: interpretation.navamsa.spouseIndicators,
      karakamsha: interpretation.navamsa.karakamsha,
      dharmaStrength: interpretation.navamsa.overallDharmaStrength,
      summary: interpretation.navamsa.summary,
    },
    dasamsa: {
      lagna: interpretation.dasamsa.dasamsaLagna,
      tenthLordPlacement: interpretation.dasamsa.tenthLordPlacement,
      strongestCareerPlanet: interpretation.dasamsa.strongestCareerPlanet,
      planetsInKendra: interpretation.dasamsa.planetsInKendra,
      d10Yogas: interpretation.dasamsa.d10Yogas,
      careerIndicators: interpretation.dasamsa.careerIndicators,
      primaryCareerDirection: interpretation.dasamsa.primaryCareerDirection,
      careerStrength: interpretation.dasamsa.overallCareerStrength,
      summary: interpretation.dasamsa.summary,
    },
    combinedInsights: interpretation.combinedInsights,
    source: "BPHS Chapter 6 (Divisional Charts) & Jataka Parijata",
  }
}

// ─── Tool: Analyze Dosha Cancellations ───────────────────

async function analyzeDoshaCancellationsTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const analysis = analyzeDoshaCancellations(chart)

  return {
    activeDoshaCount: analysis.activeDoshaCount,
    effectiveDoshaCount: analysis.effectiveDoshaCount,
    overallAfflictionLevel: analysis.overallAfflictionLevel,
    doshas: analysis.doshas.map(d => ({
      type: d.doshaType,
      originalSeverity: d.originalSeverity,
      adjustedSeverity: d.adjustedSeverity,
      totalReduction: `${d.totalReduction}%`,
      isEffectivelyCancelled: d.isEffectivelyCancelled,
      activeCancellations: d.activeCancellations.map(c => ({
        name: c.name,
        description: c.description,
        reductionPercent: c.reductionPercent,
        source: c.source,
      })),
      interpretation: d.interpretation,
      remainingEffects: d.remainingEffects,
      adjustedRemedies: d.adjustedRemedies,
    })),
    summary: analysis.summary,
    keyFindings: analysis.keyFindings,
    source: "BPHS & Phaladeepika (Dosha Bhanga principles)",
  }
}

// ─── Tool: SAV-Enhanced Transit Report ───────────────────

async function getSAVTransitTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const date = input.transit_date ? new Date(input.transit_date as string) : new Date()

  const savReport = getSAVTransitReport(chart, date)
  const enhanced = getEnhancedGocharPhal(chart, date)

  return {
    date: savReport.date.toISOString().split("T")[0],
    overallSAVScore: savReport.overallSAVScore,
    transitScores: savReport.transitScores.map(t => ({
      planet: t.planet,
      transitSign: t.transitSign,
      houseFromMoon: t.houseFromMoon,
      savScore: t.savScore,
      planetBindus: t.planetBindus,
      savQuality: t.savQuality,
      combinedRating: t.combinedRating,
      interpretation: t.interpretation,
    })),
    bestTransits: savReport.bestTransits,
    challengingTransits: savReport.challengingTransits,
    savGuidance: savReport.savGuidance,
    enhancedGochar: {
      overallPeriodRating: enhanced.overallPeriodRating,
      transits: enhanced.transits.map(t => ({
        planet: t.planet,
        sign: t.sign,
        house: t.house,
        traditionalEffect: t.traditionalEffect,
        savScore: t.savScore,
        netBenefit: t.netBenefit,
        combinedEffect: t.combinedEffect,
      })),
      summary: enhanced.summary,
    },
    source: "BPHS Chapters 65-72 (Gochar + Ashtakavarga)",
  }
}

// ─── Tool: Bhava Chalit Analysis ─────────────────────────

async function getBhavaChalitTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const report = getBhavaChalitReport(chart)

  return {
    chalitPlanets: report.chalitChart.planets.map(p => ({
      planet: p.name,
      rashiHouse: p.rashiHouse,
      bhavaHouse: p.bhavaHouse,
      hasShifted: p.hasShifted,
      shiftDirection: p.shiftDirection,
      isNearSandhi: p.isNearSandhi,
      interpretation: p.interpretation,
    })),
    houseShifts: {
      totalShifts: report.houseShifts.totalShifts,
      shiftedPlanets: report.houseShifts.shiftedPlanets,
      stablePlanets: report.houseShifts.stablePlanets,
      overallImpact: report.houseShifts.overallImpact,
      summary: report.houseShifts.summary,
    },
    bhavaBala: {
      strongestHouse: report.bhavaBala.strongestHouse,
      weakestHouse: report.bhavaBala.weakestHouse,
      houses: report.bhavaBala.houses.map(h => ({
        house: h.house,
        strength: h.strength,
        strengthLabel: h.strengthLabel,
        occupants: h.occupants,
        interpretation: h.interpretation,
      })),
      summary: report.bhavaBala.summary,
    },
    keyInsights: report.keyInsights,
    recommendation: report.recommendation,
    source: "BPHS & Saravali (Bhava Chalit System)",
  }
}

// ─── Tool: Full Chart Synthesis ──────────────────────────

async function synthesizeChartTool(
  input: Record<string, unknown>
): Promise<unknown> {
  const birthDetails = parseBirthDetails(input)
  const chart = await generateNatalChart(birthDetails)
  const synthesis = synthesizeChart(chart)

  return {
    overallChartRating: synthesis.overallChartRating,
    overallLabel: synthesis.overallLabel,
    executiveSummary: synthesis.executiveSummary,
    chartSignature: {
      dominantElement: synthesis.chartSignature.dominantElement,
      dominantModality: synthesis.chartSignature.dominantModality,
      dominantPlanet: synthesis.chartSignature.dominantPlanet,
      chartPattern: synthesis.chartSignature.chartPattern,
      keyThemes: synthesis.chartSignature.keyThemes,
    },
    lifeDomains: {
      career: { score: synthesis.lifeDomainScores.career.score, label: synthesis.lifeDomainScores.career.label, summary: synthesis.lifeDomainScores.career.summary },
      wealth: { score: synthesis.lifeDomainScores.wealth.score, label: synthesis.lifeDomainScores.wealth.label, summary: synthesis.lifeDomainScores.wealth.summary },
      relationships: { score: synthesis.lifeDomainScores.relationships.score, label: synthesis.lifeDomainScores.relationships.label, summary: synthesis.lifeDomainScores.relationships.summary },
      health: { score: synthesis.lifeDomainScores.health.score, label: synthesis.lifeDomainScores.health.label, summary: synthesis.lifeDomainScores.health.summary },
      spirituality: { score: synthesis.lifeDomainScores.spirituality.score, label: synthesis.lifeDomainScores.spirituality.label, summary: synthesis.lifeDomainScores.spirituality.summary },
      education: { score: synthesis.lifeDomainScores.education.score, label: synthesis.lifeDomainScores.education.label, summary: synthesis.lifeDomainScores.education.summary },
      overallFortune: { score: synthesis.lifeDomainScores.overallFortune.score, label: synthesis.lifeDomainScores.overallFortune.label, summary: synthesis.lifeDomainScores.overallFortune.summary },
    },
    timingSynthesis: {
      periodRating: synthesis.timingSynthesis.periodRating,
      periodLabel: synthesis.timingSynthesis.periodLabel,
      keyOpportunities: synthesis.timingSynthesis.keyOpportunities,
      keyRisks: synthesis.timingSynthesis.keyRisks,
      guidance: synthesis.timingSynthesis.guidance,
    },
    strengthRankings: synthesis.strengthRankings,
    yogaImpact: synthesis.yogaImpact,
    doshaImpact: synthesis.doshaImpact,
    topStrengths: synthesis.topStrengths,
    topChallenges: synthesis.topChallenges,
    source: "Multi-factor synthesis: Shadbala, Ashtakavarga, Yogas, Doshas, Dasha, Varga",
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
  {
    name: "analyze_planet_strength",
    description: "Comprehensive planetary strength analysis combining Shadbala (six-fold strength from BPHS Chapter 27), Graha Yuddha (planetary war detection), combustion interpretation, retrogression effects, dignity analysis, and functional benefic/malefic classification. Returns composite strength scores, rankings, and personalized interpretations. Analyze a single planet by name, or omit planet for full chart strength analysis including strongest/weakest planet, Yoga Karaka identification, and overall chart strength assessment.",
    input_schema: {
      type: "object" as const,
      properties: {
        ...birthDetailsProperties,
        planet: { type: "string" as const, description: "Planet to analyze (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu). Omit for full chart analysis." },
      },
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "get_ashtakavarga",
    description: "Calculate complete Ashtakavarga analysis per BPHS Chapters 66-72. Returns Prashtarakha (individual bindu tables for 7 planets + Ascendant), Sarvashtakavarga (SAV — sum of all 8 tables, total 337 bindus), house strengths with SAV scores, planet rankings by bindu count, and transit guidance based on SAV scores. Use this for timing analysis and to identify strongest/weakest houses in the chart.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "analyze_vargas",
    description: "Deep interpretation of D9 Navamsa and D10 Dasamsa divisional charts. Navamsa analysis includes: spouse indicators (7th house), Pushkara Navamsa detection, Karakamsha (Atmakaraka in D9), dignity shifts (D1 → D9), Vargottama planets, and overall dharma strength. Dasamsa analysis includes: career planet mapping, 10th lord placement, D10 Raj Yogas, career type inference, and professional strength rating. Returns combined cross-chart insights.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "analyze_dosha_cancellations",
    description: "Advanced dosha analysis with cancellation detection (Dosha Bhanga). For each active dosha (Mangal, Kaal Sarp, Pitra, Sade Sati, Chandal, Grahan), checks 5-15 classical cancellation conditions from BPHS and Phaladeepika. Returns percentage-based severity reduction, adjusted severity rating, whether the dosha is effectively cancelled, remaining effects, and adjusted remedies. Provides a comprehensive view of actual dosha impact vs. raw detection.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
    },
  },
  // ─── Release 3 Tools ─────────────────────────────────
  {
    name: "get_sav_transit",
    description: "Advanced SAV-based transit analysis using Sarvashtakavarga scoring from BPHS Ch.66-72. Rates each current planetary transit by the SAV bindu score of the house it occupies, applies Kaksha (sub-sign division of 3°45' arcs) analysis for precision, and calculates enhanced Gochar results combining traditional Moon-sign transit rules with Ashtakavarga strength. Also finds the best upcoming transit windows across all 12 houses. Returns SAV transit scores, Kaksha details, enhanced transit effects, best transit windows, and overall period quality.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "get_bhava_chalit",
    description: "Calculates the Bhava Chalit (equal house) chart where each house spans exactly 30° centered on the ascendant degree. Detects planets that shift houses compared to the Rashi chart (sign-based houses), identifies Sandhi planets within 3° of house cusps, and computes Bhava Bala (house strength) based on occupants, aspects, and lord dignity. Provides interpretation of house shifts explaining where a planet's sign-based energy actually manifests.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
    },
  },
  {
    name: "synthesize_chart",
    description: "Comprehensive multi-factor chart synthesis combining all analytical engines: Shadbala (planet strength), Ashtakavarga (house strength), Yogas, Doshas with cancellations, Dasha timing, and Varga charts. Produces: (1) Overall chart rating 0-100 with label, (2) Seven life domain scores (career, wealth, relationships, health, spirituality, education, fortune) each 0-100, (3) Chart signature (dominant element, modality, planet, pattern), (4) Current timing synthesis with opportunities and risks, (5) Executive summary. The most comprehensive single-call analysis available.",
    input_schema: {
      type: "object" as const,
      properties: birthDetailsProperties,
      required: ["date", "latitude", "longitude"],
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
    case "analyze_planet_strength":
      return analyzePlanetStrengthTool(toolInput)
    case "get_ashtakavarga":
      return getAshtakavargaTool(toolInput)
    case "analyze_vargas":
      return analyzeVargasTool(toolInput)
    case "analyze_dosha_cancellations":
      return analyzeDoshaCancellationsTool(toolInput)
    case "get_sav_transit":
      return getSAVTransitTool(toolInput)
    case "get_bhava_chalit":
      return getBhavaChalitTool(toolInput)
    case "synthesize_chart":
      return synthesizeChartTool(toolInput)
    default:
      return { error: `Unknown astrology tool: ${toolName}` }
  }
}
