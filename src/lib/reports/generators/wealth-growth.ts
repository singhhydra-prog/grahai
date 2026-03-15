/* ════════════════════════════════════════════════════════
   GrahAI — Wealth & Growth Report Generator

   Generates personalized, data-driven wealth analysis:
   - Complete yoga detection (Dhan, Raj, lord involvement)
   - House-by-house wealth analysis with SAV scores
   - Planet-specific investment sector recommendations
   - Personalized dasha timing windows
   - Customized financial strategy based on actual chart
   ════════════════════════════════════════════════════════ */

import type { ReportData } from "../kundli-report-generator"
import {
  GeneratedReport, ReportSection, ReportRemedy,
  PLANET_MANTRAS, PLANET_GEMSTONES, DIGNITY_LABELS, HOUSE_LIFE_AREAS,
} from "./types"

// ─── Helper Functions ───────────────────────────────────

/**
 * Find a planet in the natal chart
 */
function getPlanet(data: ReportData, name: string) {
  return data.natalChart.planets.find((p) => p.name === name)
}

/**
 * Get planet strength from strengthAnalysis
 */
function getPlanetStrength(data: ReportData, planetName: string): number {
  const entry = data.strengthAnalysis?.planets?.find((p) => p.planet === planetName)
  return entry?.compositeStrength.adjusted ?? 0
}

/**
 * Check if planet is strong (exalted, own sign, or moolatrikona)
 */
function isPlanetStrong(planet: any): boolean {
  if (!planet) return false
  return (
    planet.dignity === "exalted" ||
    planet.dignity === "own" ||
    planet.dignity === "moolatrikona"
  )
}

/**
 * Get Ashtakavarga SAV score for a house
 */
function getHouseSAV(data: ReportData, houseNum: number): number | null {
  const house = data.houseStrengths.find((h) => h.house === houseNum)
  return house?.sav ?? null
}

/**
 * Interpret SAV strength with percentile language
 */
function interpretSAV(sav: number | null): string {
  if (sav === null) return "unanalyzed"
  const percent = ((sav / 337) * 100).toFixed(0)
  if (sav >= 32) return `very strong (${percent}%)`
  if (sav >= 25) return `strong (${percent}%)`
  if (sav >= 18) return `moderate (${percent}%)`
  if (sav >= 12) return `weak (${percent}%)`
  return `very weak (${percent}%)`
}

/**
 * Comprehensive wealth yoga detection:
 * - Direct Dhan/Raj yogas
 * - Named wealth yogas (Lakshmi, Kubera, Gajakesari, etc)
 * - Yogas involving lords of 2, 5, 9, 11 houses
 */
function getWealthYogas(data: ReportData): any[] {
  const house2Lord = data.houseAnalysis.find((h) => h.house === 2)?.lord
  const house5Lord = data.houseAnalysis.find((h) => h.house === 5)?.lord
  const house9Lord = data.houseAnalysis.find((h) => h.house === 9)?.lord
  const house11Lord = data.houseAnalysis.find((h) => h.house === 11)?.lord
  const wealthLords = [house2Lord, house5Lord, house9Lord, house11Lord].filter(Boolean)

  return data.yogas.filter((yoga) => {
    if (!yoga || !yoga.isPresent) return false

    // Direct category match
    if (yoga.category === "Dhan Yoga" || yoga.category === "Raj Yoga") return true

    // Wealth-specific names
    const wealthNames = ["Lakshmi", "Kubera", "Dhan", "Gajakesari", "Parivartana", "Raj", "Wealth"]
    if (wealthNames.some((name) => yoga.name?.includes(name))) return true

    // Check if yoga involves lords of wealth houses
    if (yoga.involvedPlanets && Array.isArray(yoga.involvedPlanets)) {
      return yoga.involvedPlanets.some((p) => wealthLords.includes(p))
    }

    return false
  })
}

/**
 * Get planets occupying a specific house
 */
function getPlanetsInHouse(data: ReportData, houseNum: number): any[] {
  return data.natalChart.planets.filter((p) => p.house === houseNum)
}

/**
 * Find dasha periods for a specific planet
 */
function getDashaPeriods(data: ReportData, planetName: string): any[] {
  return data.dashaTimeline.filter(
    (period) =>
      period.mahadasha === planetName || period.antardasha === planetName
  )
}

/**
 * Format remedy for a planet
 */
function formatRemedy(planetName: string): ReportRemedy | null {
  const mantra = PLANET_MANTRAS[planetName]
  const gem = PLANET_GEMSTONES[planetName]

  if (!mantra || !gem) return null

  return {
    type: `${planetName} Strengthening Remedy`,
    description: `Chant "${mantra.mantra}" ${mantra.count} on ${mantra.day}s. Wear ${gem.gem} in ${gem.metal} on ${gem.finger}.`,
  }
}

// ═══════════════════════════════════════════════════════
// MAIN REPORT GENERATOR
// ═══════════════════════════════════════════════════════

export function generateWealthReport(data: ReportData): GeneratedReport {
  const sections: ReportSection[] = []
  const remedies: ReportRemedy[] = []

  // Extract key house data for consistent reference throughout
  const house2 = data.houseAnalysis.find((h) => h.house === 2)
  const house5 = data.houseAnalysis.find((h) => h.house === 5)
  const house9 = data.houseAnalysis.find((h) => h.house === 9)
  const house11 = data.houseAnalysis.find((h) => h.house === 11)

  // Extract planet data
  const jupiterPlanet = getPlanet(data, "Jupiter")
  const venusPlanet = getPlanet(data, "Venus")
  const mercuryPlanet = getPlanet(data, "Mercury")
  const saturnPlanet = getPlanet(data, "Saturn")
  const marsPlanet = getPlanet(data, "Mars")

  // ─── Section 1: Wealth Yogas & Financial Capacity ─────

  const wealthYogas = getWealthYogas(data)

  let yogasContent = ""
  if (wealthYogas.length > 0) {
    yogasContent = `Your chart contains ${wealthYogas.length} wealth-related yoga${wealthYogas.length > 1 ? "s" : ""}:\n\n`
    wealthYogas.forEach((yoga, idx) => {
      const strength = yoga.strength || "moderate"
      const effects = yoga.effects || yoga.description || "creates favorable conditions for wealth accumulation"
      yogasContent += `• **${yoga.name}** (${strength} strength): ${effects}\n`
    })
  } else {
    yogasContent = `Your chart does not currently contain major wealth yogas (Dhan Yoga or Raj Yoga combinations). However, this does not preclude financial success.\n\nYour wealth potential instead depends on: (1) The strength and placement of the 2nd house lord (${house2?.lord}) currently in house ${house2?.lordPlacement}; (2) The 11th house of gains (${house11?.sign}, ruled by ${house11?.lord}); and (3) Jupiter's protective influence and your disciplined financial effort.`
  }

  // Jupiter analysis
  let jupiterAnalysis = ""
  if (jupiterPlanet) {
    const jupiterDignity = DIGNITY_LABELS[jupiterPlanet.dignity] || jupiterPlanet.dignity
    jupiterAnalysis = `\n\nJupiter (Dhan Karaka—wealth significator) is positioned in ${jupiterPlanet.sign.name} at ${jupiterPlanet.degree?.toFixed(1) || "unknown"}° in house ${jupiterPlanet.house}, with ${jupiterDignity} dignity. ${
      isPlanetStrong(jupiterPlanet)
        ? `This strong placement grants exceptional financial wisdom, luck in investments, and natural prosperity. Jupiter's benefic rays amplify your ability to attract and manage wealth.`
        : `This placement requires conscious effort to unlock Jupiter's wealth-giving potential. Practices that strengthen Jupiter (remedies, knowledge-based work) will enhance financial outcomes.`
    }`
  } else {
    jupiterAnalysis = "\n\nJupiter's strength is a key factor in your wealth potential; see remedies below for ways to fortify this Dhan Karaka."
  }

  const wealthYogasSection: ReportSection = {
    title: "Wealth Yogas & Financial Capacity",
    content: yogasContent + jupiterAnalysis,
    highlights: [
      `Active wealth yogas: ${wealthYogas.length}`,
      `2nd house lord (${house2?.lord}) in house ${house2?.lordPlacement}`,
      `Jupiter dignity: ${jupiterPlanet ? DIGNITY_LABELS[jupiterPlanet.dignity] || jupiterPlanet.dignity : "unanalyzed"}`,
      `11th house lord: ${house11?.lord}`,
    ],
  }

  sections.push(wealthYogasSection)

  // ─── Section 2: Income Sources & Ashtakavarga Analysis ────

  const house6 = data.houseAnalysis.find((h) => h.house === 6)
  const sav2 = getHouseSAV(data, 2)
  const sav5 = getHouseSAV(data, 5)
  const sav6 = getHouseSAV(data, 6)
  const sav9 = getHouseSAV(data, 9)
  const sav11 = getHouseSAV(data, 11)

  // Planets in wealth houses
  const planetsIn2 = getPlanetsInHouse(data, 2)
  const planetsIn6 = getPlanetsInHouse(data, 6)
  const planetsIn10 = getPlanetsInHouse(data, 10)
  const planetsIn11 = getPlanetsInHouse(data, 11)

  const lord2Planet = getPlanet(data, house2?.lord || "")
  const lord6Planet = getPlanet(data, house6?.lord || "")
  const lord11Planet = getPlanet(data, house11?.lord || "")

  let incomeContent = ""

  // 2nd House Analysis
  incomeContent += `**2nd House of Accumulated Wealth**\nYour 2nd house is in ${house2?.sign}, ruled by ${house2?.lord}. This lord is currently placed in house ${house2?.lordPlacement} ${lord2Planet ? `(${DIGNITY_LABELS[lord2Planet.dignity] || lord2Planet.dignity} dignity)` : ""}. `

  if (planetsIn2.length > 0) {
    incomeContent += `The presence of ${planetsIn2.map((p) => p.name).join(", ")} in your 2nd house activates wealth accumulation directly, suggesting income through asset building, inheritances, or family resources. `
  } else {
    incomeContent += `No planets occupy this house, so wealth comes through the conscious effort and timing of the 2nd lord's dasha periods. `
  }

  incomeContent += `Ashtakavarga SAV score: ${sav2}/337 (${interpretSAV(sav2)}). ${
    sav2 && sav2 >= 25
      ? "This strong score indicates excellent asset accumulation capacity through disciplined saving and investment."
      : sav2 && sav2 >= 18
        ? "Moderate capacity requires consistent effort and favorable timing to build lasting wealth."
        : "A weaker score suggests slower accumulation; focus on long-term planning and dasha-favorable periods."
  }\n\n`

  // 6th House Analysis (Income, Service, Labor)
  incomeContent += `**6th House of Daily Income & Service**\nThe 6th house is in ${house6?.sign}, ruled by ${house6?.lord}. `
  if (planetsIn6.length > 0) {
    const serviceDetails = planetsIn6.map((p) => `${p.name} (${p.dignity})`).join(", ")
    incomeContent += `Planets here (${serviceDetails}) activate service-oriented income, suggesting earnings through employment, skilled work, or overcoming financial challenges. `
  } else {
    incomeContent += `Without planets here, income from service-based work depends on the 6th lord's strength and dasha periods. `
  }

  incomeContent += `SAV score: ${sav6}/337 (${interpretSAV(sav6)}). ${
    sav6 && sav6 >= 25
      ? "Strong capacity for steady income through dedicated work and professional growth."
      : sav6 && sav6 >= 18
        ? "Moderate income stability through service, requiring continuous skill development."
        : "Weaker score suggests irregular income; diversification is essential."
  }\n\n`

  // 11th House Analysis (Gains, Fulfillment)
  incomeContent += `**11th House of Gains & Fulfillment**\nThe 11th house is in ${house11?.sign}, ruled by ${house11?.lord} (${lord11Planet ? DIGNITY_LABELS[lord11Planet.dignity] || lord11Planet.dignity : "unanalyzed"} dignity). `
  if (planetsIn11.length > 0) {
    const gainsDetails = planetsIn11.map((p) => `${p.name}`).join(", ")
    incomeContent += `The placement of ${gainsDetails} here creates multiple income streams through networks, passive income, group ventures, and social connections. `
  } else {
    incomeContent += `Without planets, gains depend on the 11th lord's strength and timing. `
  }

  incomeContent += `Ashtakavarga SAV: ${sav11}/337 (${interpretSAV(sav11)}). ${
    sav11 && sav11 >= 32
      ? "Exceptional—wealth flows easily through synchronicities, fortuitous gains, and group partnerships."
      : sav11 && sav11 >= 25
        ? "Strong—desires manifest through social networks and passive income opportunities."
        : sav11 && sav11 >= 18
          ? "Moderate—gains require initiative and conscious networking."
          : "Weaker—gains require deliberate effort; focus on building communities and passive income sources."
  }\n\n`

  // 5th House (Speculation, Investments)
  if (sav5 !== null) {
    incomeContent += `**5th House of Speculation & Investments**\nSAV score: ${sav5}/337 (${interpretSAV(sav5)}). ${
      sav5 >= 25
        ? "Favorable for stock market, real estate, or creative ventures."
        : "Less favorable; approach speculation cautiously and prefer diversified long-term investments."
    }\n\n`
  }

  // Synthesize income pathways
  incomeContent += `**Your Primary Income Pathways**\n`
  const pathways: string[] = []
  if (sav2 && sav2 >= 20) pathways.push(`Direct wealth accumulation (2nd SAV: ${sav2})`)
  if (sav6 && sav6 >= 20) pathways.push(`Service-based steady income (6th SAV: ${sav6})`)
  if (sav11 && sav11 >= 20) pathways.push(`Network-driven gains (11th SAV: ${sav11})`)
  if (planetsIn10.length > 0)
    pathways.push(`Career advancement (${planetsIn10.map((p) => p.name).join(", ")} in 10th)`)
  if (jupiterPlanet && (jupiterPlanet.house === 2 || jupiterPlanet.house === 11))
    pathways.push(`Jupiter-blessed gains and expansion`)

  incomeContent += pathways.length > 0 ? pathways.join("; ") + "." : "Consistent effort across multiple sectors."

  const incomeSection: ReportSection = {
    title: "Income Sources & Ashtakavarga Analysis",
    content: incomeContent,
    highlights: [
      `2nd house (Wealth) SAV: ${sav2}/337 (${interpretSAV(sav2)})`,
      `6th house (Service) SAV: ${sav6}/337 (${interpretSAV(sav6)})`,
      `11th house (Gains) SAV: ${sav11}/337 (${interpretSAV(sav11)})`,
      `Planets in wealth houses: 2nd(${planetsIn2.length}), 6th(${planetsIn6.length}), 11th(${planetsIn11.length})`,
    ],
  }

  sections.push(incomeSection)

  // ─── Section 3: Investment Sectors & Opportunities ────

  // Determine which sectors are favored based on actual planet strength
  const jupiterStrength = getPlanetStrength(data, "Jupiter")
  const venusStrength = getPlanetStrength(data, "Venus")
  const mercuryStrength = getPlanetStrength(data, "Mercury")
  const saturnStrength = getPlanetStrength(data, "Saturn")
  const marsStrength = getPlanetStrength(data, "Mars")

  let investmentContent = `Different planets govern specific investment sectors. Based on your chart's actual planetary strengths, focus on sectors where your planets are strong:\n\n`

  const recommendedSectors: string[] = []

  // Jupiter - Finance, Gold, Banking
  if (jupiterPlanet) {
    investmentContent += `**Jupiter (Finance, Gold, Banking)**\n`
    if (isPlanetStrong(jupiterPlanet)) {
      recommendedSectors.push("Jupiter-governed finance")
      investmentContent += `Jupiter is ${DIGNITY_LABELS[jupiterPlanet.dignity] || jupiterPlanet.dignity} in your chart. This is EXCEPTIONALLY FAVORABLE for: `
      if (jupiterPlanet.house === 2 || jupiterPlanet.house === 5)
        investmentContent += `stock markets, mutual funds, gold investments, banking sector. Your natural wisdom makes you adept at financial decision-making. `
      else if (jupiterPlanet.house === 10 || jupiterPlanet.house === 11)
        investmentContent += `institutional investments, high-net-worth networks, passive income strategies, group ventures. Your professional stature attracts wealth. `
      else
        investmentContent += `financial planning, wealth management, and long-term abundance creation. `
      investmentContent += `Consider allocating a meaningful portion to gold or quality financial instruments.\n\n`
    } else {
      investmentContent += `Jupiter is in ${jupiterPlanet.dignity || "neutral"} dignity. Approach finance and gold investments with caution; stick to conservative, tried-and-tested vehicles. Strengthen Jupiter through remedies (see below).\n\n`
    }
  }

  // Venus - Real Estate, Luxury
  if (venusPlanet) {
    investmentContent += `**Venus (Real Estate, Luxury Assets)**\n`
    if (isPlanetStrong(venusPlanet)) {
      recommendedSectors.push("Venus-governed real estate")
      investmentContent += `Venus is ${DIGNITY_LABELS[venusPlanet.dignity] || venusPlanet.dignity} in your chart. This is STRONGLY FAVORABLE for: `
      if (venusPlanet.house === 4) investmentContent += `residential real estate, property in premium locations, home businesses. `
      else if (venusPlanet.house === 5 || venusPlanet.house === 7)
        investmentContent += `luxury assets, art, jewelry, real estate partnerships, hospitality ventures. `
      else if (venusPlanet.house === 11)
        investmentContent += `high-end real estate networks, luxury market investments, premium properties. `
      else investmentContent += `real estate and tangible asset appreciation. `
      investmentContent += `Your aesthetic sense makes property investment natural and profitable.\n\n`
    } else {
      investmentContent += `Venus is in ${venusPlanet.dignity || "neutral"} state. Real estate and luxury investments are possible but require careful due diligence. Avoid impulsive purchases.\n\n`
    }
  }

  // Mercury - Trading, IT, Communication
  if (mercuryPlanet) {
    investmentContent += `**Mercury (Trading, IT, Communication)**\n`
    if (isPlanetStrong(mercuryPlanet)) {
      recommendedSectors.push("Mercury-governed trading")
      investmentContent += `Mercury is well-placed in your chart. This is FAVORABLE for: `
      if (mercuryPlanet.house === 2 || mercuryPlanet.house === 3)
        investmentContent += `intraday trading, forex, commodities trading, e-commerce. `
      else if (mercuryPlanet.house === 6 || mercuryPlanet.house === 10)
        investmentContent += `IT sector, software startups, consulting ventures, tech investments. `
      else investmentContent += `commerce, intellectual properties, communication-based businesses. `
      investmentContent += `Your analytical mind excels in fast-moving markets.\n\n`
    } else {
      investmentContent += `Mercury is weak or neutral. Avoid speculative trading; prefer stable, long-term instruments instead.\n\n`
    }
  }

  // Saturn - Land, Property, Long-term
  if (saturnPlanet) {
    investmentContent += `**Saturn (Land, Property, Long-term Wealth)**\n`
    if (isPlanetStrong(saturnPlanet)) {
      recommendedSectors.push("Saturn-governed long-term assets")
      investmentContent += `Saturn is ${DIGNITY_LABELS[saturnPlanet.dignity] || saturnPlanet.dignity} in your chart—EXCELLENT for: agricultural land, industrial property, infrastructure projects, mining, long-term blue-chip stocks. Saturn creates lasting, compounding wealth through patience and discipline. This is your strongest sector for multi-decade wealth building.\n\n`
    } else {
      investmentContent += `Saturn is neutral or weak. Slow, steady wealth-building is possible but requires discipline and long time horizons. Avoid shortcuts.\n\n`
    }
  }

  // Mars - Manufacturing, Defense, Engineering
  if (marsPlanet && marsStrength > 0.5) {
    investmentContent += `**Mars (Manufacturing, Defense, Engineering)**\nMars shows moderate strength. Consider investments in: machinery, tools, defense stocks, engineering startups, or energy sectors. Your initiative and courage suit capital-intensive ventures.\n\n`
    recommendedSectors.push("Mars-governed industrial")
  }

  // Summary
  investmentContent += `**Sector Prioritization**\n`
  if (recommendedSectors.length > 0) {
    investmentContent += `Focus primary investments on: ${recommendedSectors.join(", ")}. Create a diversified portfolio using 2–3 of these strong sectors. This targeted approach leverages your chart's natural advantages.\n`
  } else {
    investmentContent += `No single planet is exceptionally strong. Build a balanced, diversified portfolio across sectors. Avoid concentration in any single area.\n`
  }

  const investmentSection: ReportSection = {
    title: "Investment Sectors & Opportunities",
    content: investmentContent,
    highlights: [
      `Jupiter strength: ${(jupiterStrength * 100).toFixed(0)}% — ${isPlanetStrong(jupiterPlanet) ? "Finance, gold favored" : "Caution advised"}`,
      `Venus strength: ${(venusStrength * 100).toFixed(0)}% — ${isPlanetStrong(venusPlanet) ? "Real estate favored" : "Selective approach"}`,
      `Mercury strength: ${(mercuryStrength * 100).toFixed(0)}% — ${isPlanetStrong(mercuryPlanet) ? "Trading favored" : "Avoid speculation"}`,
      `Saturn strength: ${(saturnStrength * 100).toFixed(0)}% — ${isPlanetStrong(saturnPlanet) ? "Long-term assets favored" : "Patience needed"}`,
    ],
  }

  sections.push(investmentSection)

  // ─── Section 4: Wealth Activation Windows & Dasha Timing ────

  const jupiterDashas = getDashaPeriods(data, "Jupiter")
  const lord2Dashas = getDashaPeriods(data, house2?.lord || "")
  const lord5Dashas = getDashaPeriods(data, house5?.lord || "")
  const lord9Dashas = getDashaPeriods(data, house9?.lord || "")
  const lord11Dashas = getDashaPeriods(data, house11?.lord || "")

  // Identify wealth-activating periods
  const wealthWindows: Array<{
    planet: string
    periods: any[]
    description: string
  }> = []

  if (jupiterDashas.length > 0) {
    wealthWindows.push({
      planet: "Jupiter",
      periods: jupiterDashas,
      description:
        "Jupiter expands prosperity, luck, and investment returns. Excellent for launching major wealth initiatives.",
    })
  }

  if (house2?.lord && lord2Dashas.length > 0) {
    wealthWindows.push({
      planet: house2.lord,
      periods: lord2Dashas,
      description: `As lord of your 2nd house (wealth/resources), ${house2.lord}'s dasha brings direct focus to asset building and financial accumulation.`,
    })
  }

  if (house11?.lord && lord11Dashas.length > 0) {
    wealthWindows.push({
      planet: house11.lord,
      periods: lord11Dashas,
      description: `As lord of your 11th house (gains/networks), ${house11.lord}'s dasha brings opportune gains, social prosperity, and fulfillment of desires.`,
    })
  }

  let timingContent = `Wealth timing depends critically on dasha periods. When planets governing wealth houses activate, prosperity flows naturally. Conversely, challenging periods require disciplined saving and avoiding excess.\n\n`

  if (wealthWindows.length > 0) {
    wealthWindows.forEach((window) => {
      const nextPeriod = window.periods[0]
      const allPeriods = window.periods.slice(0, 3)

      timingContent += `**${window.planet} Dasha/Antardasha**\n${window.description}\n`

      if (nextPeriod) {
        timingContent += `Next occurrence: ${
          nextPeriod.startDate ? new Date(nextPeriod.startDate).toLocaleDateString() : "See full timeline"
        } to ${nextPeriod.endDate ? new Date(nextPeriod.endDate).toLocaleDateString() : ""} (${nextPeriod.durationMonths} months). `
      }

      timingContent += `Use this window to: initiate major investments, launch businesses, sign contracts, or expand existing ventures.\n\n`
    })
  } else {
    timingContent += `No major wealth-activating dashas currently in timeline. Focus on consistent effort and disciplined saving through all periods. Even off-season periods, with good planning, yield steady progress.\n\n`
  }

  // Secondary timing insights
  timingContent += `**Strategic Timing Guidance**\n`
  if (sav2 && sav2 >= 25 && lord2Dashas.length === 0) {
    timingContent += `Your 2nd house has strong SAV (${sav2}) but the lord is not currently in a major dasha. Use this period for planning; execute major wealth moves when the 2nd lord's dasha arrives.\n`
  }
  if (sav11 && sav11 >= 25 && lord11Dashas.length === 0) {
    timingContent += `Your 11th house shows exceptional SAV (${sav11}) for manifesting gains. Even outside peak dasha periods, your network-based income and social connections can deliver results.\n`
  }
  if (wealthWindows.length === 0) {
    timingContent += `While major wealth-planet dashas are not currently active, Jupiter or other benefic periods may still be present. Review the complete dasha timeline in your account.\n`
  }

  timingContent += `Remember: Dasha timing is directional guidance, not destiny. Proactive effort during favorable periods yields exponential returns; disciplined consistency during challenging periods prevents loss.`

  const timingSection: ReportSection = {
    title: "Wealth Activation Windows & Dasha Timing",
    content: timingContent,
    highlights: [
      `Jupiter dasha: ${jupiterDashas.length > 0 ? `${jupiterDashas.length} period(s)` : "Not in current timeline"}`,
      `2nd house lord dasha: ${lord2Dashas.length > 0 ? `${lord2Dashas.length} period(s)` : "Not currently"}`,
      `11th house lord dasha: ${lord11Dashas.length > 0 ? `${lord11Dashas.length} period(s)` : "Not currently"}`,
      `Total wealth windows identified: ${wealthWindows.length}`,
    ],
  }

  sections.push(timingSection)

  // ─── Section 5: Personalized Financial Strategy ────────

  const strengthAnalysis = data.strengthAnalysis
  const allPlanets = strengthAnalysis?.planets || []
  const strongPlanets = allPlanets
    .filter((p) => p.compositeStrength.adjusted > 0.6)
    .sort((a, b) => b.compositeStrength.adjusted - a.compositeStrength.adjusted)
    .slice(0, 3)
  const weakPlanets = allPlanets.filter((p) => p.compositeStrength.adjusted < 0.4)

  let strategyContent = `Your chart reveals specific, actionable pathways to lasting wealth. Tailor your financial decisions to your actual strengths and timing.\n\n`

  // Identify actual bottlenecks
  strategyContent += `**Your Wealth Profile**\n`

  const bottlenecks: string[] = []
  if (sav2 && sav2 < 18) bottlenecks.push(`weak 2nd house wealth accumulation (SAV: ${sav2})`)
  if (sav11 && sav11 < 18) bottlenecks.push(`weak 11th house gains (SAV: ${sav11})`)
  if (lord2Planet && !isPlanetStrong(lord2Planet))
    bottlenecks.push(`2nd lord (${house2?.lord}) lacks strength; needs remedy`)
  if (lord11Planet && !isPlanetStrong(lord11Planet))
    bottlenecks.push(`11th lord (${house11?.lord}) is not optimally placed; strengthen through practices`)
  if (jupiterPlanet && !isPlanetStrong(jupiterPlanet))
    bottlenecks.push(`Jupiter is not strong; pursue Jupiter-strengthening remedies`)

  const strengths: string[] = []
  if (sav2 && sav2 >= 25) strengths.push(`strong asset accumulation (2nd SAV: ${sav2})`)
  if (sav11 && sav11 >= 25) strengths.push(`excellent gains potential (11th SAV: ${sav11})`)
  if (isPlanetStrong(jupiterPlanet)) strengths.push(`exalted/strong Jupiter for financial wisdom`)
  if (strongPlanets.length > 0)
    strengths.push(`${strongPlanets.map((p) => p.planet).join(", ")} are well-positioned`)
  if (wealthYogas.length > 0) strengths.push(`${wealthYogas.length} wealth yoga(s) present`)

  strategyContent += `**Strengths:** ${strengths.length > 0 ? strengths.join("; ") + "." : "Multiple planets in fair positions."}\n\n`

  strategyContent += `**Challenges:** ${bottlenecks.length > 0 ? bottlenecks.join("; ") + "." : "No critical bottlenecks; steady progress likely."}\n\n`

  // Core Strategy
  strategyContent += `**Your Customized Strategy**\n\n`

  strategyContent += `1. **Primary Wealth Driver:** `
  if (sav2 && sav2 >= 25) {
    strategyContent += `Your 2nd house is exceptionally strong (SAV: ${sav2}). Maximize asset building: automate savings, invest consistently, and focus on long-term portfolio growth. Every rupee saved compounds powerfully.\n\n`
  } else if (sav11 && sav11 >= 25) {
    strategyContent += `Your 11th house dominates (SAV: ${sav11}). Wealth flows through networks, passive income, and group ventures. Invest in relationships, passive income streams, and collaborative projects. Build multiple income channels.\n\n`
  } else if (lord2Planet && isPlanetStrong(lord2Planet)) {
    strategyContent += `Your 2nd house lord is strong. Activate its potential during its dasha periods. Plan major financial moves for then. Outside those periods, focus on foundational wealth building.\n\n`
  } else {
    strategyContent += `Balance is your approach. No single house dominates, so diversify across 3–4 income and investment sources. Specialization happens during favorable dasha periods.\n\n`
  }

  strategyContent += `2. **Investment Allocation:** Based on your planet strengths:\n`
  const allocationText: string[] = []
  if (isPlanetStrong(jupiterPlanet)) allocationText.push(`40% to Jupiter sectors (finance, gold, insurance, quality stocks)`)
  if (isPlanetStrong(saturnPlanet)) allocationText.push(`30% to Saturn sectors (real estate, long-term blue chips, infrastructure)`)
  if (isPlanetStrong(venusPlanet)) allocationText.push(`20% to Venus sectors (real estate, luxury goods, vehicles)`)
  if (isPlanetStrong(mercuryPlanet)) allocationText.push(`10% to Mercury sectors (short-term trading, startups, tech)`)
  if (allocationText.length === 0) allocationText.push(`Balanced portfolio: 25% each across four sectors (finance, real estate, business, long-term savings)`)

  allocationText.forEach((line) => {
    strategyContent += `   • ${line}\n`
  })

  strategyContent += `\n3. **Timing Action Items:** \n`
  if (jupiterDashas.length > 0) {
    const nextJupiter = jupiterDashas[0]
    strategyContent += `   • **Jupiter Period** (${new Date(nextJupiter.startDate || "").toLocaleDateString()} onward): Launch expansion plans, sign contracts, invest heavily.\n`
  }
  if (lord2Dashas.length > 0) {
    const next2Lord = lord2Dashas[0]
    strategyContent += `   • **2nd Lord Period** (${new Date(next2Lord.startDate || "").toLocaleDateString()} onward): Execute wealth-building projects, acquire assets, consolidate gains.\n`
  }
  if (wealthWindows.length === 0) {
    strategyContent += `   • No major favorable period currently active: Use this consolidation phase to build emergency reserves (6–12 months expenses), plan, and educate yourself.\n`
  }

  strategyContent += `\n4. **Remedy Priority (next 3 months):** \n`
  if (weakPlanets.length > 0) {
    const top2Weak = weakPlanets.slice(0, 2)
    top2Weak.forEach((p) => {
      strategyContent += `   • Strengthen ${p.planet} (current strength: ${(p.compositeStrength.adjusted * 100).toFixed(0)}%) — see remedies below.\n`
    })
  } else {
    strategyContent += `   • No critical planetary weaknesses; focus on Jupiter strengthening for enhanced results.\n`
  }

  strategyContent += `\n5. **Risk Management:** \n`
  strategyContent += `   • Emergency fund: Build 12–18 months expenses (your ${sav11 && sav11 < 20 ? "weaker 11th" : "moderate 11th"} house requires safety nets).\n`
  strategyContent += `   • Diversification: Avoid betting entire wealth on one sector. Use the allocation above as minimum diversity.\n`
  if (sav6 && sav6 >= 20) {
    strategyContent += `   • Service Income Stability: Your 6th house is strong (SAV: ${sav6}). Prioritize stable employment or service-based income as wealth foundation.\n`
  }

  strategyContent += `\n**Remember:** Your chart is a roadmap, not destiny. The strongest planets and favorable dashas amplify action taken wisely. Consistent, disciplined effort—even in off-season periods—builds unshakeable wealth. Ethics, knowledge, and timing together create lasting prosperity.`

  const strategySection: ReportSection = {
    title: "Personalized Financial Strategy",
    content: strategyContent,
    highlights: [
      `Wealth profile: ${strengths.length} strength(s), ${bottlenecks.length} challenge(s)`,
      `Strongest planets: ${strongPlanets.length > 0 ? strongPlanets.map((p) => `${p.planet} (${(p.compositeStrength.adjusted * 100).toFixed(0)}%)`).join(", ") : "Balanced"}`,
      `Primary wealth mechanism: ${sav2 && sav2 >= 25 ? "Asset accumulation" : sav11 && sav11 >= 25 ? "Network gains" : "Diversified approach"}`,
      `Next wealth window: ${wealthWindows.length > 0 ? wealthWindows[0].planet : "Consolidation phase"}`,
    ],
  }

  sections.push(strategySection)

  // ─── Build Remedies ─────────────────────────────────

  // Add remedies for weak wealth-governing planets
  const weakPlanetsNames = weakPlanets.map((p) => p.planet)
  weakPlanetsNames.slice(0, 3).forEach((planetName: string) => {
    const remedy = formatRemedy(planetName)
    if (remedy) remedies.push(remedy)
  })

  // Always include Jupiter remedy (Dhan Karaka)
  const jupiterRemedy = formatRemedy("Jupiter")
  if (jupiterRemedy && !remedies.find((r) => r.type.includes("Jupiter"))) {
    remedies.push(jupiterRemedy)
  }

  // If 2nd or 11th lord is weak, add remedy for them too
  if (house2?.lord && lord2Planet && !isPlanetStrong(lord2Planet)) {
    const lord2Remedy = formatRemedy(house2.lord)
    if (lord2Remedy && !remedies.find((r) => r.type.includes(house2.lord))) {
      remedies.push(lord2Remedy)
    }
  }

  if (house11?.lord && lord11Planet && !isPlanetStrong(lord11Planet)) {
    const lord11Remedy = formatRemedy(house11.lord)
    if (lord11Remedy && !remedies.find((r) => r.type.includes(house11.lord))) {
      remedies.push(lord11Remedy)
    }
  }

  // ─── Summary ─────────────────────────────────────────

  const wealthPotential = (() => {
    let score = 50
    if (sav2) score += Math.min(sav2 / 10, 15)
    if (sav11) score += Math.min(sav11 / 10, 15)
    if (isPlanetStrong(jupiterPlanet)) score += 15
    if (isPlanetStrong(lord2Planet) || isPlanetStrong(lord11Planet)) score += 10
    if (wealthYogas.length > 0) score += Math.min(wealthYogas.length * 5, 15)
    return Math.min(score, 100)
  })()

  const summaryText = (() => {
    if (wealthPotential > 75)
      return `exceptional financial potential. Your chart shows strong wealth-building yogas, favorable SAV scores, or well-placed planet lords. Strategic timing of major decisions during favorable dasha periods will unlock significant wealth.`
    else if (wealthPotential > 60)
      return `strong wealth potential with clear pathways to prosperity. Good house strengths and planet placements support consistent accumulation. Focus on the sectors and timing windows identified in this report.`
    else if (wealthPotential > 45)
      return `moderate wealth potential with opportunities in specific areas. Disciplined long-term planning, dasha-awareness, and focused effort in strong sectors will yield steady financial growth.`
    else
      return `developing wealth potential that improves through consistent effort and strategic timing. Your chart rewards patience, diversification, and alignment with favorable dasha periods. Every small step compounds over time.`
  })()

  const summary = `Your Wealth & Growth report reveals ${summaryText} Your most powerful wealth-building windows are ${wealthWindows.length > 0 ? "identified in Section 4" : "hidden in challenging periods—consistency is key"}. Prioritize: (1) The strongest planets (${strongPlanets.length > 0 ? strongPlanets.map((p) => p.planet).join(", ") : "see analysis"}) and their sectors; (2) House lords 2, 5, 9, 11 and their dasha periods; (3) Ashtakavarga scores as indicators of ease. Implement the remedies below to strengthen weak wealth planets. No chart guarantees wealth without disciplined action, ethical conduct, and knowledge—but your chart's design makes success achievable through aligned effort.`

  return {
    summary,
    sections,
    remedies: remedies.length > 0 ? remedies : undefined,
  }
}
