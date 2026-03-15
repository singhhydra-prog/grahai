/* ════════════════════════════════════════════════════════
   GrahAI — Annual Forecast 2026 Report Generator
   Code-based forecast entirely from calculation data
   NO AI API calls — pure Vedic astrology analysis
   ════════════════════════════════════════════════════════ */

import type { ReportData } from "../kundli-report-generator"
import {
  GeneratedReport, ReportSection, ReportRemedy,
  PLANET_MANTRAS, PLANET_GEMSTONES, DIGNITY_LABELS, HOUSE_LIFE_AREAS,
} from "./types"

/**
 * Generate a comprehensive Annual Forecast 2026 report.
 * Analysis based on:
 * - Current Mahadasha & Antardasha periods
 * - Dasha timeline filtered to 2026
 * - House strengths (Ashtakavarga SAV scores)
 * - Dosha effects (especially Sade Sati)
 * - Transit influences (SAV transit report)
 * - Planetary placements and dignities
 */
export function generateAnnualForecastReport(data: ReportData): GeneratedReport {
  const sections: ReportSection[] = []

  // Section 1: Yearly Overview & Themes
  sections.push(buildYearlyOverview(data))

  // Sections 2-5: Quarterly Forecasts (Q1-Q4 2026)
  sections.push(buildQ1Forecast(data))
  sections.push(buildQ2Forecast(data))
  sections.push(buildQ3Forecast(data))
  sections.push(buildQ4Forecast(data))

  // Section 6: Best Months for Major Actions
  sections.push(buildBestMonths(data))

  // Section 7: Caution Periods
  sections.push(buildCautionPeriods(data))

  // Section 8: Key Dates & Transitions
  sections.push(buildKeyDates(data))

  // Build summary
  const summary = buildForecastSummary(data)

  // Extract remedies for active planets/doshas
  const remedies = buildAnnualRemedies(data)

  return {
    summary,
    sections,
    remedies,
  }
}

// ═══════════════════════════════════════════════════════
// SECTION 1: YEARLY OVERVIEW & THEMES
// ═══════════════════════════════════════════════════════

function buildYearlyOverview(data: ReportData): ReportSection {
  const currentMD = data.dashaAnalysis.currentMahadasha
  const currentAD = data.dashaAnalysis.currentAntardasha

  // Find Mahadasha lord in natal chart
  const mdLordPlanet = data.natalChart.planets.find(p => p.name === currentMD.planet)
  const mdHouse = mdLordPlanet?.house || 0
  const mdSign = mdLordPlanet?.sign?.name || "Unknown"

  // Determine 2026 periods
  const periods2026 = data.dashaTimeline.filter(d => {
    const start = new Date(d.startDate)
    const end = new Date(d.endDate)
    const year2026Start = new Date("2026-01-01")
    const year2026End = new Date("2026-12-31")
    return start <= year2026End && end >= year2026Start
  })

  // Get all active Antardashas in 2026
  const antardashasInYear = new Set(periods2026.map(p => p.antardasha))
  const antardashaList = Array.from(antardashasInYear).join(", ")

  // Get house life area for Mahadasha lord
  const mdHouseArea = HOUSE_LIFE_AREAS[mdHouse] || "general life matters"

  // Determine if Mahadasha is favorable based on dignity
  const mdDignity = mdLordPlanet?.dignity || "neutral"
  const dignityDesc = DIGNITY_LABELS[mdDignity] || mdDignity
  const favorableNote =
    mdDignity === "exalted" || mdDignity === "moolatrikona" || mdDignity === "own"
      ? "This is a favorable placement, supporting constructive growth."
      : mdDignity === "debilitated" || mdDignity === "enemy"
        ? "This placement presents challenges requiring conscious effort."
        : "This placement provides balanced opportunities and lessons."

  const content = `2026 is dominated by the ${currentMD.planet} Mahadasha, which governs ${mdHouseArea}. The ${currentMD.planet} is currently ${dignityDesc}, positioned in ${mdSign} in the ${ordinalize(mdHouse)} house. ${favorableNote}

Throughout 2026, the sub-periods (Antardashas) shift between: ${antardashaList}. Each transition brings distinct thematic emphasis and opportunity. The year overall emphasizes themes of ${getThemeForPlanet(currentMD.planet)} with both expansive and consolidating phases.

Monitor the transitions between Antardasha periods carefully, as these junctures often bring events related to the planets in question. The overall tone of 2026 is one of ${getToneForDasha(currentMD.planet, mdDignity)}, with particular importance on the houses occupied by ${currentMD.planet} and its sub-period lords.`

  return {
    title: "Yearly Overview & Themes",
    content,
    highlights: [
      `Mahadasha: ${currentMD.planet} (${currentMD.planet} placement: ${mdSign}, ${ordinalize(mdHouse)} house)`,
      `Active Antardashas in 2026: ${antardashaList}`,
      `Mahadasha Lord Dignity: ${mdDignity}`,
      `Primary Life Theme: ${mdHouseArea}`,
    ],
  }
}

// ═══════════════════════════════════════════════════════
// SECTIONS 2-5: QUARTERLY FORECASTS
// ═══════════════════════════════════════════════════════

function buildQ1Forecast(data: ReportData): ReportSection {
  return buildQuarterlySection(data, "Q1", "January–March 2026", "2026-01-01", "2026-03-31")
}

function buildQ2Forecast(data: ReportData): ReportSection {
  return buildQuarterlySection(data, "Q2", "April–June 2026", "2026-04-01", "2026-06-30")
}

function buildQ3Forecast(data: ReportData): ReportSection {
  return buildQuarterlySection(data, "Q3", "July–September 2026", "2026-07-01", "2026-09-30")
}

function buildQ4Forecast(data: ReportData): ReportSection {
  return buildQuarterlySection(data, "Q4", "October–December 2026", "2026-10-01", "2026-12-31")
}

function buildQuarterlySection(
  data: ReportData,
  label: string,
  dateRange: string,
  startStr: string,
  endStr: string,
): ReportSection {
  const startDate = new Date(startStr)
  const endDate = new Date(endStr)

  // Filter dashaTimeline for periods active during this quarter
  const quarterPeriods = data.dashaTimeline.filter(d => {
    const dStart = new Date(d.startDate)
    const dEnd = new Date(d.endDate)
    return dStart <= endDate && dEnd >= startDate
  })

  if (quarterPeriods.length === 0) {
    return {
      title: `${label} (${dateRange})`,
      content: "No active Dasha periods found for this quarter.",
      highlights: [],
    }
  }

  // Extract unique Antardashas active in this quarter
  const antardashas = Array.from(new Set(quarterPeriods.map(p => p.antardasha)))

  // Analyze each Antardasha
  const adAnalyses = antardashas.map(ad => {
    const adPlanet = data.natalChart.planets.find(p => p.name === ad)
    const adHouse = adPlanet?.house || 0
    const adSign = adPlanet?.sign?.name || "Unknown"
    const adDignity = adPlanet?.dignity || "neutral"

    const houseArea = HOUSE_LIFE_AREAS[adHouse] || "general matters"
    const periodData = quarterPeriods.find(p => p.antardasha === ad)
    const months = periodData?.durationMonths || 1

    return {
      planet: ad,
      house: adHouse,
      sign: adSign,
      dignity: adDignity,
      houseArea,
      months,
    }
  })

  // Check house strengths for active houses
  const activeHouses = new Set(adAnalyses.map(a => a.house))
  const houseStrengths = data.houseStrengths.filter(h => activeHouses.has(h.house))

  // Build narrative
  let narrative = `${label} (${dateRange}) features Antardasha lord(s): ${antardashas.join(", ")}. `

  narrative += adAnalyses
    .map(ad => {
      const strength = houseStrengths.find(h => h.house === ad.house)
      const strengthNote = strength
        ? `The ${ordinalize(ad.house)} house has a SAV score of ${strength.sav} (${strength.strength})`
        : `The ${ordinalize(ad.house)} house carries moderate influence`

      return `${ad.planet} (${ad.sign}, ${ordinalize(ad.house)} house) activates ${ad.houseArea}. ${strengthNote}.`
    })
    .join(" ")

  // Determine quarter tone
  const dominantDignity = adAnalyses[0]?.dignity || "neutral"
  const tone =
    dominantDignity === "exalted" || dominantDignity === "own"
      ? "This quarter favors initiating new projects and public initiatives."
      : dominantDignity === "debilitated"
        ? "Exercise caution with commitments; focus on consolidation."
        : "Balance new ventures with careful planning and review."

  narrative += ` ${tone}`

  const highlights = [
    `Active Antardasha(s): ${antardashas.join(", ")}`,
    ...adAnalyses.map(
      ad => `${ad.planet}: ${ad.sign}, ${ordinalize(ad.house)} house (${ad.houseArea})`
    ),
    `Quarter Emphasis: ${getQuarterTheme(label, adAnalyses[0]?.planet || "Unknown")}`,
  ]

  return {
    title: `${label} (${dateRange})`,
    content: narrative,
    highlights,
  }
}

// ═══════════════════════════════════════════════════════
// SECTION 6: BEST MONTHS FOR MAJOR ACTIONS
// ═══════════════════════════════════════════════════════

function buildBestMonths(data: ReportData): ReportSection {
  const monthScores: Record<string, number> = {}
  const monthReasons: Record<string, string[]> = {}

  // Months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  // Initialize
  months.forEach(m => {
    monthScores[m] = 0
    monthReasons[m] = []
  })

  // Score based on Antardasha lord placements
  for (const period of data.dashaTimeline) {
    const adLord = data.natalChart.planets.find(p => p.name === period.antardasha)
    if (!adLord) continue

    const startMonth = new Date(period.startDate).getMonth()
    const endMonth = new Date(period.endDate).getMonth()

    const dignity = adLord.dignity || "neutral"
    const score = { exalted: 3, moolatrikona: 3, own: 2, friendly: 1, neutral: 0, enemy: -1, debilitated: -2 }[dignity] || 0

    // Apply score to affected months
    for (let m = startMonth; m <= endMonth; m++) {
      if (m <= 11) {
        monthScores[months[m]] = (monthScores[months[m]] || 0) + score
        monthReasons[months[m]].push(`${period.antardasha} Antardasha (${dignity})`)
      }
    }
  }

  // Get house strengths
  const bestHouses = data.houseStrengths
    .filter(h => h.strength === "strong" || h.strength === "very strong")
    .map(h => h.house)

  // Score for career (house 10), finance (house 2, 11), relationships (house 7)
  const careerMonths: string[] = []
  const financeMonths: string[] = []
  const relationshipMonths: string[] = []

  // Add house strength bonuses to months based on active Antardasha lords
  for (const period of data.dashaTimeline) {
    const adPlanet = data.natalChart.planets.find(p => p.name === period.antardasha)
    if (!adPlanet) continue
    const adHouse = adPlanet.house
    if (bestHouses.includes(adHouse)) {
      const m = new Date(period.startDate).getMonth()
      if (m <= 11) {
        monthScores[months[m]] = (monthScores[months[m]] || 0) + 1
        monthReasons[months[m]].push(`${period.antardasha} activates strong house ${adHouse}`)
      }
    }
  }

  // Find top months
  const sortedMonths = months.sort((a, b) => monthScores[b] - monthScores[a])
  const topMonths = sortedMonths.slice(0, 3)

  const content = `Based on Antardasha lord placements and house strength analysis, the most auspicious months for major decisions and initiatives in 2026 are:

**${topMonths[0] || "—"}**: Highest overall planetary support for new ventures. ${monthReasons[topMonths[0]]?.join("; ") || ""}

**${topMonths[1] || "—"}**: Strong secondary period for completing significant projects. ${monthReasons[topMonths[1]]?.join("; ") || ""}

**${topMonths[2] || "—"}**: Favorable for relationship and partnership matters. ${monthReasons[topMonths[2]]?.join("; ") || ""}

${buildActionAdviceFromData(data)}`

  const h10Str = data.houseStrengths.find(h => h.house === 10)
  const h7Str = data.houseStrengths.find(h => h.house === 7)
  const h2Str = data.houseStrengths.find(h => h.house === 2)

  const highlights = [
    `Best Month(s): ${topMonths.join(", ")}`,
    `10th House (Career) SAV: ${h10Str?.sav || "N/A"} (${h10Str?.strength || "N/A"})`,
    `7th House (Relationships) SAV: ${h7Str?.sav || "N/A"} (${h7Str?.strength || "N/A"})`,
    `2nd House (Finance) SAV: ${h2Str?.sav || "N/A"} (${h2Str?.strength || "N/A"})`,
  ]

  return {
    title: "Best Months for Major Actions",
    content,
    highlights,
  }
}

// ═══════════════════════════════════════════════════════
// SECTION 7: CAUTION PERIODS
// ═══════════════════════════════════════════════════════

function buildCautionPeriods(data: ReportData): ReportSection {
  const cautionPoints: string[] = []

  // Check for Sade Sati or other doshas
  const sadeSati = data.doshas.find(d => d.type === "Sade Sati")
  const kalaSarpa = data.doshas.find(d => d.type === "Kaal Sarp Dosha")
  const pitruDosha = data.doshas.find(d => d.type === "Pitra Dosha")

  if (sadeSati) {
    cautionPoints.push(`Sade Sati Active: Saturn's 7.5-year cycle brings testing of worldly foundations. This year may emphasize matters related to responsibility, discipline, and long-term consolidation. Avoid impulsive decisions; focus on stability.`)
  }

  if (kalaSarpa) {
    cautionPoints.push(`Kala Sarpa Yoga present: Rahu-Ketu axis creates intense karmic focus. Be cautious with speculative ventures and foreign dealings unless strongly supported by other factors.`)
  }

  if (pitruDosha) {
    cautionPoints.push(`Pitru Dosha indicated: Ancestral karma influences the chart. Perform appropriate rituals and avoid disputes with elders or family.`)
  }

  // Check for debilitated/enemy planets in Antardasha
  const weak2026Antardashas = data.dashaTimeline
    .filter(p => {
      const ad = data.natalChart.planets.find(pl => pl.name === p.antardasha)
      return ad && (ad.dignity === "debilitated" || ad.dignity === "enemy")
    })
    .map(p => p.antardasha)

  if (weak2026Antardashas.length > 0) {
    cautionPoints.push(`Debilitated/Enemy Antardashas: ${weak2026Antardashas.join(", ")} activate during 2026. During their periods, be cautious with matters ruled by these planets. Extra care needed for:
${weak2026Antardashas.map((p, i) => `  • ${p}: ${getPlantRemedialAdvice(p)}`).join("\n")}`)
  }

  // Weak houses in Ashtakavarga
  const weakHouses = data.houseStrengths
    .filter(h => h.strength === "weak" || h.strength === "very weak")
    .map(h => h.house)

  if (weakHouses.length > 0) {
    cautionPoints.push(`Weak House Periods: Houses ${weakHouses.join(", ")} have low Ashtakavarga strength. Avoid initiating major matters in these life areas until Ashtakavarga support improves. Focus instead on consolidation and defensive measures.`)
  }

  // Saturn/Rahu position-specific caution
  const saturn = data.natalChart.planets.find(p => p.name === "Saturn")
  const rahu = data.natalChart.planets.find(p => p.name === "Rahu")
  if (saturn) {
    const saturnHouse = saturn.house
    const saturnArea = HOUSE_LIFE_AREAS[saturnHouse] || "general matters"
    cautionPoints.push(`Saturn in your ${ordinalize(saturnHouse)} house: Saturn's restrictive energy affects ${saturnArea}. ${saturnHouse === 8 ? 'Be extra cautious with financial commitments and sudden changes.' : saturnHouse === 12 ? 'Watch for hidden expenses and energy drain.' : `Exercise patience in matters of ${saturnArea}.`}`)
  }
  if (rahu) {
    const rahuHouse = rahu.house
    const rahuArea = HOUSE_LIFE_AREAS[rahuHouse] || "general matters"
    cautionPoints.push(`Rahu in your ${ordinalize(rahuHouse)} house: Rahu creates illusion and obsession around ${rahuArea}. Avoid shortcuts and speculation in this area.`)
  }

  const content = cautionPoints.join("\n\n")

  const highlights = [
    ...(sadeSati ? [`Sade Sati Status: ${sadeSati.severity || "Active"}`] : []),
    ...(kalaSarpa ? [`Kala Sarpa Yoga present`] : []),
    `Weak Houses: ${weakHouses.length > 0 ? weakHouses.join(", ") : "None"}`,
    `Weak Antardashas in 2026: ${weak2026Antardashas.length > 0 ? weak2026Antardashas.join(", ") : "None"}`,
  ]

  return {
    title: "Caution Periods",
    content,
    highlights,
  }
}

// ═══════════════════════════════════════════════════════
// SECTION 8: KEY DATES & TRANSITIONS
// ═══════════════════════════════════════════════════════

function buildKeyDates(data: ReportData): ReportSection {
  const transitions: Array<{
    date: Date
    transition: string
    details: string
  }> = []

  // Extract Antardasha transitions within 2026
  const year2026Start = new Date("2026-01-01")
  const year2026End = new Date("2026-12-31")

  for (let i = 0; i < data.dashaTimeline.length - 1; i++) {
    const current = data.dashaTimeline[i]
    const next = data.dashaTimeline[i + 1]

    const endDate = new Date(current.endDate)

    // If transition happens in 2026
    if (endDate >= year2026Start && endDate <= year2026End) {
      const nextAD = next.antardasha
      const currentAD = current.antardasha

      // Get planet info
      const currentPlanet = data.natalChart.planets.find(p => p.name === currentAD)
      const nextPlanet = data.natalChart.planets.find(p => p.name === nextAD)

      const currentHouse = currentPlanet?.house || 0
      const nextHouse = nextPlanet?.house || 0

      const dateStr = formatDate(endDate)
      const transition = `${currentAD} → ${nextAD}`
      const details = `Transition from ${currentAD} Antardasha (${ordinalize(currentHouse)} house) to ${nextAD} Antardasha (${ordinalize(nextHouse)} house). Expect shift in focus from ${HOUSE_LIFE_AREAS[currentHouse] || "general matters"} to ${HOUSE_LIFE_AREAS[nextHouse] || "general matters"}.`

      transitions.push({ date: endDate, transition, details })
    }
  }

  // Sort by date
  transitions.sort((a, b) => a.date.getTime() - b.date.getTime())

  // Build content
  let content = "Key Antardasha transitions and important dates in 2026:\n\n"

  if (transitions.length > 0) {
    content += transitions
      .map((t, idx) => `**${formatDate(t.date)}** — *${t.transition}*\n${t.details}`)
      .join("\n\n")
  } else {
    content += "No major Antardasha transitions occur within 2026. The year maintains consistent Antardasha influence throughout."
  }

  // Data-driven timing notes
  const moon = data.natalChart.planets.find(p => p.name === "Moon")
  const mercury = data.natalChart.planets.find(p => p.name === "Mercury")
  const jupiter = data.natalChart.planets.find(p => p.name === "Jupiter")

  content += `\n\nChart-Specific Timing Notes:`
  if (moon) {
    content += `\n• Your Moon in ${moon.sign.name} (${ordinalize(moon.house)} house) means full/new Moons in ${moon.sign.name} or its opposite sign are especially impactful for you.`
  }
  if (mercury?.retrograde) {
    content += `\n• Your natal Mercury is already retrograde—Mercury retrograde transits may actually feel more natural to you, but still double-check contracts.`
  } else if (mercury) {
    content += `\n• With Mercury in ${mercury.sign.name}, Mercury retrograde periods particularly affect ${HOUSE_LIFE_AREAS[mercury.house] || "communication matters"}.`
  }
  if (jupiter) {
    content += `\n• Jupiter in your ${ordinalize(jupiter.house)} house amplifies ${HOUSE_LIFE_AREAS[jupiter.house] || "growth opportunities"} throughout 2026.`
  }

  const highlights = transitions.map(t => `${formatDate(t.date)}: ${t.transition}`)

  return {
    title: "Key Dates & Transitions",
    content,
    highlights: highlights.length > 0 ? highlights : ["No major transitions within 2026"],
  }
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function buildForecastSummary(data: ReportData): string {
  const md = data.dashaAnalysis.currentMahadasha.planet
  const ad = data.dashaAnalysis.currentAntardasha.planet

  return `The Annual Forecast 2026 for the Native is generated from precise calculation of Vimshottari Dasha periods, Ashtakavarga house strengths, and active doshas. The year is governed by ${md} Mahadasha with shifting Antardasha emphasis. Quarters present distinct opportunities and cautions based on Antardasha lord placements, house strength, and planetary dignity. This code-based forecast provides timing for major decisions in career, finance, relationships, and personal growth, grounded entirely in classical Vedic astrology principles without external AI interpretation.`
}

function buildAnnualRemedies(data: ReportData): ReportRemedy[] {
  const remedies: ReportRemedy[] = []

  // Remedy for current Mahadasha lord
  const mdLord = data.dashaAnalysis.currentMahadasha.planet
  if (PLANET_MANTRAS[mdLord]) {
    const mantra = PLANET_MANTRAS[mdLord]
    remedies.push({
      type: `${mdLord} Mantra (Mahadasha Support)`,
      description: `Recite "${mantra.mantra}" ${mantra.count} on ${mantra.day}s throughout 2026 to harmonize with the Mahadasha lord's influence.`,
    })
  }

  // Remedy for current Antardasha lord (if different)
  const adLord = data.dashaAnalysis.currentAntardasha.planet
  if (adLord !== mdLord && PLANET_MANTRAS[adLord]) {
    const mantra = PLANET_MANTRAS[adLord]
    remedies.push({
      type: `${adLord} Mantra (Antardasha Support)`,
      description: `Recite "${mantra.mantra}" ${mantra.count} on ${mantra.day}s to strengthen the Antardasha lord.`,
    })
  }

  // Remedies for active doshas
  for (const dosha of data.doshas) {
    if (dosha.type === "Sade Sati") {
      remedies.push({
        type: "Sade Sati Remediation",
        description: "Worship Lord Hanuman or Shani Dev on Saturdays. Donate to the poor, practice patience and discipline. Avoid hasty decisions.",
      })
    } else if (dosha.type === "Kaal Sarp Dosha") {
      remedies.push({
        type: "Kaal Sarp Dosha Remediation",
        description: "Perform regular Rahu/Ketu chanting (Om Rahave Namaha / Om Ketave Namaha). Respect ancestors and engage in charitable work.",
      })
    }
  }

  // Gemstone recommendations for afflicted planets
  for (const planet of ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]) {
    const p = data.natalChart.planets.find(pl => pl.name === planet)
    if (p && (p.dignity === "debilitated" || p.dignity === "enemy") && PLANET_GEMSTONES[planet]) {
      const gem = PLANET_GEMSTONES[planet]
      remedies.push({
        type: `${planet} Gemstone (Strengthening)`,
        description: `Wear a ${gem.gem} in ${gem.metal} on the ${gem.finger} to strengthen ${planet}'s beneficial influence. Have it energized by a qualified astrologer before wearing.`,
      })
    }
  }

  return remedies
}

function buildActionAdviceFromData(data: ReportData): string {
  const h10 = data.houseStrengths.find(h => h.house === 10)
  const h2 = data.houseStrengths.find(h => h.house === 2)
  const h7 = data.houseStrengths.find(h => h.house === 7)
  const h11 = data.houseStrengths.find(h => h.house === 11)

  let advice = ""
  if (h10) {
    advice += `For career: Your 10th house SAV is ${h10.sav} (${h10.strength})—${h10.sav >= 28 ? "pursue promotions and leadership opportunities aggressively" : "focus on building skills and credibility before making big moves"}. `
  }
  if (h2 && h11) {
    advice += `For finances: Houses 2 and 11 score ${h2.sav} and ${h11.sav} respectively—${(h2.sav + h11.sav) >= 56 ? "a strong year for wealth accumulation and new income streams" : "manage expenses carefully and avoid speculative investments"}. `
  }
  if (h7) {
    advice += `For relationships: 7th house SAV of ${h7.sav} (${h7.strength})—${h7.sav >= 28 ? "favorable for commitments and partnerships" : "take time to build trust before major relationship decisions"}.`
  }

  // Find retrograde planets
  const retrogrades = data.natalChart.planets.filter(p => p.retrograde).map(p => p.name)
  if (retrogrades.length > 0) {
    advice += ` Note: ${retrogrades.join(", ")} ${retrogrades.length === 1 ? "is" : "are"} retrograde in your chart—exercise extra care in matters ruled by ${retrogrades.length === 1 ? "this planet" : "these planets"}.`
  }

  return advice
}

function getThemeForPlanet(planet: string): string {
  const themes: Record<string, string> = {
    Sun: "leadership, authority, and self-expression",
    Moon: "emotional growth, family, and inner peace",
    Mars: "courage, initiative, and assertive action",
    Mercury: "communication, learning, and mental clarity",
    Jupiter: "expansion, wisdom, and good fortune",
    Venus: "relationships, arts, and material comfort",
    Saturn: "discipline, responsibility, and long-term building",
    Rahu: "ambition, unconventional paths, and transformation",
    Ketu: "spirituality, detachment, and past-life resolution",
  }
  return themes[planet] || "life events"
}

function getToneForDasha(planet: string, dignity: string): string {
  if (dignity === "exalted" || dignity === "moolatrikona" || dignity === "own") {
    return "expansion and positive momentum"
  }
  if (dignity === "debilitated" || dignity === "enemy") {
    return "challenge and necessary restructuring"
  }
  return "balanced growth and learning"
}

function getQuarterTheme(quarter: string, planet: string): string {
  const themes: Record<string, string> = {
    Q1: "initiation and fresh starts",
    Q2: "growth and expansion",
    Q3: "consolidation and harvest",
    Q4: "completion and preparation",
  }
  return themes[quarter] || "development"
}

function getPlantRemedialAdvice(planet: string): string {
  const advice: Record<string, string> = {
    Sun: "Avoid disputes with authority; maintain integrity",
    Moon: "Nurture emotional stability; avoid excessive travel",
    Mars: "Control anger; be cautious with machinery/weapons",
    Mercury: "Double-check contracts; avoid misunderstandings",
    Jupiter: "Don't overextend; be realistic in expectations",
    Venus: "Avoid luxury indulgence; maintain relationship harmony",
    Saturn: "Accept delays; work steadily without shortcuts",
    Rahu: "Avoid shortcuts and speculation",
    Ketu: "Release attachments; focus on spiritual growth",
  }
  return advice[planet] || "exercise caution"
}

function ordinalize(n: number): string {
  if (n === 0) return "unknown"
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString("en-US", options)
}
