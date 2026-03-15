/* ════════════════════════════════════════════════════════
   GrahAI — Marriage Timing Report Generator

   Generates a comprehensive Marriage Timing report entirely
   from calculation data — NO AI API calls.

   Sections:
   1. Marriage Readiness Assessment
   2. Timing Windows & Opportunities
   3. Delay Factors & Challenges
   4. Mangal Dosha Analysis
   5. Remedies for Timely Marriage
   ════════════════════════════════════════════════════════ */

import type { ReportData } from "../kundli-report-generator"
import {
  GeneratedReport,
  ReportSection,
  ReportRemedy,
  PLANET_MANTRAS,
  PLANET_GEMSTONES,
  DIGNITY_LABELS,
} from "./types"

// ─── Main Export ────────────────────────────────────────

/**
 * Generate a comprehensive Marriage Timing report from calculated data.
 * Includes readiness, timing windows, challenges, Mangal Dosha, and remedies.
 */
export function generateMarriageTimingReport(data: ReportData): GeneratedReport {
  const sections: ReportSection[] = [
    generateReadinessSection(data),
    generateTimingWindowsSection(data),
    generateDelayFactorsSection(data),
    generateMangalDoshaSection(data),
    generateRemediesSection(data),
  ]

  const summary = buildSummary(data)

  return {
    summary,
    sections,
    remedies: extractRemedies(data),
  }
}

// ─── Section 1: Marriage Readiness Assessment ───────────

function generateReadinessSection(data: ReportData): ReportSection {
  const house7 = data.houseAnalysis[6] // Index 6 = House 7
  const venus = data.natalChart.planets.find(p => p.name === "Venus")
  const jupiter = data.natalChart.planets.find(p => p.name === "Jupiter")
  const currentDasha = data.dashaAnalysis.currentMahadasha

  const houseStrength = data.houseStrengths.find(h => h.house === 7)
  const savScore = houseStrength?.sav ?? 0
  const strengthLevel =
    savScore >= 40 ? "exceptional" :
    savScore >= 30 ? "strong" :
    savScore >= 20 ? "moderate" :
    savScore >= 10 ? "weak" :
    "very weak"

  const highlights: string[] = []
  const contentLines: string[] = []

  // 7th House Analysis
  contentLines.push(
    `The 7th house is in ${house7.sign}, ruled by ${house7.lord}, which is placed in the ${getOrdinal(house7.lordPlacement)} house.`,
    ""
  )

  if (house7.planetsInHouse.length > 0) {
    contentLines.push(
      `Planets occupying the 7th house: ${house7.planetsInHouse.join(", ")}.`,
      ""
    )
  }

  // Venus Analysis (Significator of Marriage)
  if (venus) {
    const venusHouse = venus.house
    const venusDignity = DIGNITY_LABELS[venus.dignity || "neutral"] || venus.dignity
    contentLines.push(
      `Venus, the significator of marriage and partnerships, sits in ${venus.sign.name} at ${formatDegree(venus.degree)} in the ${getOrdinal(venusHouse)} house, ${venusDignity}.`,
      ""
    )
    highlights.push(`Venus is ${venusDignity}`)
  }

  // Jupiter Analysis (Wisdom & Marital Happiness)
  if (jupiter) {
    const jupiterHouse = jupiter.house
    const jupiterDignity = DIGNITY_LABELS[jupiter.dignity || "neutral"] || jupiter.dignity
    contentLines.push(
      `Jupiter, the planet of blessing and wisdom in marriage, is in ${jupiter.sign.name} in the ${getOrdinal(jupiterHouse)} house, ${jupiterDignity}. This indicates the nature of your marital happiness.`,
      ""
    )
  }

  // 7th House Strength
  contentLines.push(
    `The 7th house has an Ashtakavarga score of ${savScore}, indicating ${strengthLevel} readiness for marriage. This score reflects the inherent strength of the marriage house based on planetary support.`,
    ""
  )

  // Current Dasha
  const currentDashaStart = currentDasha.startDate
  const currentDashaEnd = currentDasha.endDate
  contentLines.push(
    `You are currently in the ${currentDasha.planet} Mahadasha from ${formatDate(currentDashaStart)} to ${formatDate(currentDashaEnd)}. `,
    `The current Antardasha is ${data.dashaAnalysis.currentAntardasha.planet}. This dasha configuration influences your marriage readiness during this period.`,
    ""
  )

  // Overall Assessment
  if (savScore >= 30) {
    contentLines.push(
      `Overall, your chart shows good readiness for marriage. The 7th house and its lord are reasonably well-placed, suggesting favorable conditions for a timely union.`
    )
  } else if (savScore >= 20) {
    contentLines.push(
      `Your chart shows moderate readiness for marriage. While there are some challenges, timing and remedial measures can significantly improve marriage prospects.`
    )
  } else {
    contentLines.push(
      `Your chart indicates challenges in the marriage sector that require attention through appropriate timing and remedial practices. Strategic patience and aligned choices will be important.`
    )
  }

  return {
    title: "Marriage Readiness Assessment",
    content: contentLines.join("\n"),
    highlights,
  }
}

// ─── Section 2: Timing Windows & Opportunities ──────────

function generateTimingWindowsSection(data: ReportData): ReportSection {
  const contentLines: string[] = []
  const highlights: string[] = []

  // Identify marriage-favorable periods from dashaTimeline
  const favorablePeriods: Array<{
    period: string
    startDate: Date
    endDate: Date
    reason: string
  }> = []

  // Venus, Jupiter, and 7th house lord dashas are favorable
  const house7Lord = data.houseAnalysis[6].lord
  const favorablePlanets = ["Venus", "Jupiter", house7Lord]

  for (const period of data.dashaTimeline) {
    const isMahaDashaFavorable = favorablePlanets.includes(period.mahadasha)
    const isAntarDashaFavorable = favorablePlanets.includes(period.antardasha)

    if (isMahaDashaFavorable || isAntarDashaFavorable) {
      const reason =
        isMahaDashaFavorable && isAntarDashaFavorable
          ? `Both ${period.mahadasha} Mahadasha and ${period.antardasha} Antardasha favor marriage`
          : isMahaDashaFavorable
            ? `${period.mahadasha} Mahadasha is highly favorable for marriage`
            : `${period.antardasha} Antardasha (under ${period.mahadasha} Mahadasha) supports marriage prospects`

      favorablePeriods.push({
        period: `${period.mahadasha}/${period.antardasha}`,
        startDate: period.startDate,
        endDate: period.endDate,
        reason,
      })
    }
  }

  contentLines.push(
    "Based on the Vimshottari Dasha system, the following periods present favorable windows for marriage:",
    ""
  )

  if (favorablePeriods.length > 0) {
    // Sort by date
    favorablePeriods.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    // Take the next 3-4 favorable periods
    const nextFavorable = favorablePeriods.slice(0, 4)

    for (const period of nextFavorable) {
      const duration = Math.round(
        (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
      contentLines.push(
        `• ${period.period} (${formatDate(period.startDate)} to ${formatDate(period.endDate)}, ~${duration} months): ${period.reason}.`
      )
      highlights.push(`${period.period}: ${formatDate(period.startDate)}–${formatDate(period.endDate)}`)
    }

    contentLines.push("")
    contentLines.push(
      "These periods represent astrologically optimal windows for marriage. During these times, the planetary combinations align to support marital happiness and a stable partnership. "
    )
    contentLines.push(
      "While marriage is never guaranteed in any one period, initiating engagement or marriage ceremonies during these windows significantly enhances prospects for success."
    )
  } else {
    contentLines.push(
      "The dasha timeline shows that while no period is exclusively \"free\" from challenges, certain periods offer better planetary support than others. "
    )
    contentLines.push(
      "Consult your dasha periods: Venus Dasha, Jupiter Dasha, or periods ruled by your 7th house lord are generally more auspicious. "
    )
    contentLines.push(
      "Even challenging periods can yield marriage if matched with strong personal effort and proper astrological timing."
    )
  }

  return {
    title: "Timing Windows & Opportunities",
    content: contentLines.join("\n"),
    highlights,
  }
}

// ─── Section 3: Delay Factors & Challenges ───────────────

function generateDelayFactorsSection(data: ReportData): ReportSection {
  const contentLines: string[] = []
  const highlights: string[] = []

  // Check for Saturn influence on 7th house
  const saturn = data.natalChart.planets.find(p => p.name === "Saturn")
  const rahu = data.natalChart.planets.find(p => p.name === "Rahu")
  const ketu = data.natalChart.planets.find(p => p.name === "Ketu")
  const venus = data.natalChart.planets.find(p => p.name === "Venus")
  const house7 = data.houseAnalysis[6]

  contentLines.push(
    "The following factors may delay or complicate marriage prospects. Understanding these allows for strategic mitigation:",
    ""
  )

  const challenges: string[] = []

  // Saturn in 7th or aspecting 7th
  if (saturn && (saturn.house === 7 || saturn.house === 1 || saturn.house === 10)) {
    challenges.push(
      `Saturn's influence on the marriage house (via position in house ${saturn.house}) suggests delays or serious, mature marriage dynamics. Saturn often brings delays but ensures long-lasting partnerships.`
    )
    highlights.push("Saturn influence on 7th house")
  }

  // Rahu/Ketu axis on 7th
  if (rahu && rahu.house === 7) {
    challenges.push(
      `Rahu in the 7th house creates confusion, obsession, or unconventional romantic dynamics. This may delay conventional marriage but can indicate unusual or fated unions.`
    )
    highlights.push("Rahu in 7th house")
  }

  if (ketu && ketu.house === 7) {
    challenges.push(
      `Ketu in the 7th house suggests detachment or past-life patterns affecting marriage. The native may feel spiritually called away from marriage, or face karmic marriage tests.`
    )
    highlights.push("Ketu in 7th house")
  }

  // Retrograde planets in 7th or affecting 7th lord
  const house7LordPlanet = data.natalChart.planets.find(
    p => p.name === house7.lord
  )
  if (house7LordPlanet?.retrograde) {
    challenges.push(
      `The 7th house lord, ${house7.lord}, is retrograde. This often delays marriage but enhances the depth and karmic significance of the eventual union.`
    )
    highlights.push(`${house7.lord} retrograde`)
  }

  // Check for malefic planets in 7th
  const maleficIn7th = data.natalChart.planets.filter(
    p => p.house === 7 && ["Sun", "Mars", "Saturn", "Rahu"].includes(p.name)
  )
  if (maleficIn7th.length > 0) {
    challenges.push(
      `Malefic planets (${maleficIn7th.map(p => p.name).join(", ")}) occupy the 7th house, suggesting friction or challenges in partnerships. These require conscious effort to overcome.`
    )
    highlights.push(`Malefic in 7th: ${maleficIn7th.map(p => p.name).join(", ")}`)
  }

  // Check for weak Venus or 7th lord
  if (venus && (venus.dignity === "debilitated" || venus.dignity === "enemy")) {
    challenges.push(
      `Venus is ${DIGNITY_LABELS[venus.dignity] || venus.dignity}, weakening marriage signification. This suggests emotional blocks, unrealistic expectations, or past romantic disappointments to heal.`
    )
    highlights.push(`Venus ${venus.dignity}`)
  }

  if (house7LordPlanet && (house7LordPlanet.dignity === "debilitated" || house7LordPlanet.dignity === "enemy")) {
    challenges.push(
      `The 7th house lord is ${DIGNITY_LABELS[house7LordPlanet.dignity] || house7LordPlanet.dignity}, suggesting obstacles in manifesting a stable marriage. Extra effort in compatibility and timing is needed.`
    )
    highlights.push(`7th lord ${house7LordPlanet.dignity}`)
  }

  if (challenges.length === 0) {
    contentLines.push(
      "Your chart shows relatively few delay factors in the marriage house. While all charts have some challenges, yours appears clear of major obstructions to timely marriage."
    )
  } else {
    contentLines.push(challenges.join("\n\n"))
    contentLines.push("")
    contentLines.push(
      "These factors are not deterministic—they represent tendencies that can be managed through awareness, maturity, and aligned choices. Proper remedial measures and favorable timing can significantly mitigate these challenges."
    )
  }

  return {
    title: "Delay Factors & Challenges",
    content: contentLines.join("\n"),
    highlights,
  }
}

// ─── Section 4: Mangal Dosha Analysis ────────────────────

function generateMangalDoshaSection(data: ReportData): ReportSection {
  const contentLines: string[] = []
  const highlights: string[] = []

  // Find Mangal Dosha in doshas array
  const mangalDosha = data.doshas.find(d => d.type === "Mangal Dosha")

  const mars = data.natalChart.planets.find(p => p.name === "Mars")
  const marsHouse = mars?.house || 0
  const marsSign = mars?.sign?.name || "Unknown"
  const mangalHouses = [1, 4, 7, 8, 12]

  contentLines.push(
    `Mars is placed in ${marsSign} in your ${getOrdinal(marsHouse)} house. Mangal Dosha applies when Mars occupies the 1st, 4th, 7th, 8th, or 12th house. In your chart, Mars ${mangalHouses.includes(marsHouse) ? `IS in one of these houses (${getOrdinal(marsHouse)})` : `is NOT in any of these houses`}.`,
    ""
  )

  if (!mangalDosha) {
    contentLines.push(
      "Your chart does NOT have Mangal Dosha. This is highly favorable for marriage. You can marry anyone without concern for their Mangal Dosha status, and your prospects for a harmonious marriage are significantly enhanced."
    )
    highlights.push("Mangal Dosha: Absent")
  } else {
    contentLines.push(
      `Mangal Dosha is PRESENT in your chart with severity: ${mangalDosha.severity.toUpperCase()}.`,
      ""
    )

    // Check for cancellations
    const cancellations = data.doshaCancellations?.doshas.find(
      (d: any) => d.doshaType === "Mangal Dosha"
    )

    if (cancellations && cancellations.isEffectivelyCancelled) {
      contentLines.push(
        `However, this Mangal Dosha is CANCELLED due to the following factors: ${cancellations.interpretation}.`,
        ""
      )
      contentLines.push(
        "A cancelled Mangal Dosha is not considered problematic. You can marry anyone, though the partner should still ideally have Mangal Dosha for best compatibility."
      )
      highlights.push("Mangal Dosha: Cancelled")
    } else {
      contentLines.push(
        "Mangal Dosha is active in your chart. This means: ",
        "",
        "1. You should ideally marry someone who also has Mangal Dosha (to neutralize its effects), or someone with an exceptionally strong horoscope.",
        "2. There may be delays in marriage, friction in partnerships, or the need for extra effort in maintaining harmony.",
        "3. Marriage in later age can be more stable than hasty unions.",
        ""
      )

      highlights.push(`Mangal Dosha: ${mangalDosha.severity}`)

      const severity = mangalDosha.severity
      if (severity === "high") {
        contentLines.push(
          "Given the high severity, seeking a partner with compatible Mangal Dosha or consulting a Vedic astrologer for detailed compatibility analysis (Kundli Matching) is strongly recommended."
        )
      } else if (severity === "medium") {
        contentLines.push(
          "The moderate severity suggests flexibility in matching—a partner with some Mangal Dosha or other compensating strengths can work well. Detailed compatibility analysis is advisable."
        )
      } else {
        contentLines.push(
          "The mild severity is less restrictive. Compatibility based on overall chart strength and personal values is more important than rigid Mangal Dosha matching."
        )
      }
    }
  }

  return {
    title: "Mangal Dosha Analysis",
    content: contentLines.join("\n"),
    highlights,
  }
}

// ─── Section 5: Remedies for Timely Marriage ────────────

function generateRemediesSection(data: ReportData): ReportSection {
  const contentLines: string[] = []
  const highlights: string[] = []

  // Get relevant planets for marriage remedies
  const venus = data.natalChart.planets.find(p => p.name === "Venus")
  const jupiter = data.natalChart.planets.find(p => p.name === "Jupiter")
  const house7 = data.houseAnalysis[6]
  const house7Lord = data.natalChart.planets.find(p => p.name === house7.lord)

  contentLines.push(
    `Based on your 7th house in ${house7.sign} (lord: ${house7.lord}) and Venus in ${venus?.sign.name || "Unknown"} (${DIGNITY_LABELS[venus?.dignity || "neutral"] || venus?.dignity}), the following remedies target your specific chart weaknesses:`,
    ""
  )

  const remedialPlanets: string[] = []

  // Venus (primary significator)
  if (venus && (venus.dignity === "debilitated" || venus.dignity === "enemy" || venus.retrograde)) {
    remedialPlanets.push("Venus")
  }

  // Jupiter (blessing, wisdom in marriage)
  if (jupiter && (jupiter.dignity === "debilitated" || jupiter.dignity === "enemy")) {
    remedialPlanets.push("Jupiter")
  }

  // 7th house lord if afflicted
  if (house7Lord && (house7Lord.dignity === "debilitated" || house7Lord.dignity === "enemy" || house7Lord.retrograde)) {
    remedialPlanets.push(house7Lord.name)
  }

  // Add Saturn if it's heavily influencing the 7th
  const saturn = data.natalChart.planets.find(p => p.name === "Saturn")
  if (saturn && saturn.house === 7) {
    remedialPlanets.push("Saturn")
  }

  // Build remedy text
  contentLines.push("RECOMMENDED REMEDIES:")
  contentLines.push("")

  if (remedialPlanets.length === 0) {
    contentLines.push(
      "While your chart shows strength in the marriage house, the following universal remedies enhance marriage prospects for anyone:"
    )
    remedialPlanets.push("Venus")
  } else {
    contentLines.push(
      `The following planets require strengthening in your chart: ${remedialPlanets.join(", ")}.`
    )
    contentLines.push("")
  }

  // Mantra remedies
  contentLines.push("1. MANTRA CHANTING (Japa)")
  contentLines.push("")

  for (const planet of remedialPlanets) {
    const mantra = PLANET_MANTRAS[planet]
    if (mantra) {
      contentLines.push(`   ${planet}:`)
      contentLines.push(
        `   Chant "${mantra.mantra}" ${mantra.count} on ${mantra.day}s for 40 days.`
      )
      contentLines.push("")
      highlights.push(`Chant ${mantra.mantra}`)
    }
  }

  // Gemstone remedies
  contentLines.push("2. GEMSTONE WEARING (Ratna Dharan)")
  contentLines.push("")

  for (const planet of remedialPlanets) {
    const gem = PLANET_GEMSTONES[planet]
    if (gem) {
      contentLines.push(`   ${planet}:`)
      contentLines.push(
        `   Wear ${gem.gem} set in ${gem.metal} on your ${gem.finger}. Minimum 4 carats, energized before wearing.`
      )
      contentLines.push("")
      highlights.push(`Wear ${gem.gem}`)
    }
  }

  // Ritual remedies
  contentLines.push("3. RITUAL REMEDIES (Puja & Homa)")
  contentLines.push("")
  contentLines.push("   • Perform a Venus Puja (Shukra Puja) on Fridays for 9 or 16 weeks.")
  contentLines.push("   • Conduct a Marriage Blessing ritual (performed by qualified priest) during a favorable Dasha period or lunar timing.")
  contentLines.push("   • Light a ghee lamp (diya) on Fridays in your puja room and offer flowers to Lakshmi or the deity associated with your marriage house lord.")
  contentLines.push("")

  // Timing remedies
  contentLines.push("4. TIMING REMEDIES (Muhurat & Auspicious Periods)")
  contentLines.push("")

  // Find next Venus or Jupiter dasha
  const nextVenus = data.dashaTimeline.find(p => p.mahadasha === "Venus")
  const nextJupiter = data.dashaTimeline.find(p => p.mahadasha === "Jupiter")

  if (nextVenus) {
    contentLines.push(
      `   • Venus Dasha from ${formatDate(nextVenus.startDate)} to ${formatDate(nextVenus.endDate)} is highly auspicious for marriage. Prioritize engagement or marriage ceremonies during this period.`
    )
  }

  if (nextJupiter) {
    contentLines.push(
      `   • Jupiter Dasha from ${formatDate(nextJupiter.startDate)} to ${formatDate(nextJupiter.endDate)} brings blessing and wisdom to marriage. This is an ideal window.`
    )
  }

  contentLines.push("")
  contentLines.push(
    "   • Schedule engagement or marriage muhurat (auspicious moment) with the guidance of a qualified Vedic astrologer."
  )
  contentLines.push("")

  // Data-driven practice remedies based on Venus placement
  contentLines.push("5. LIFE PRACTICE REMEDIES (Upaya)")
  contentLines.push("")
  if (venus && venus.house === 12) {
    contentLines.push("   • Your Venus in the 12th suggests love flourishes through spiritual connection—meditate daily and seek partners in spiritual communities.")
  } else if (venus && venus.house === 6) {
    contentLines.push("   • Your Venus in the 6th suggests partnerships improve through service—volunteer work and helping others strengthens your Venus.")
  } else if (venus && [1, 5, 7, 9, 11].includes(venus.house)) {
    contentLines.push(`   • Your Venus in the ${getOrdinal(venus.house)} is well-positioned—focus on expressing your natural charm and warmth actively.`)
  } else {
    contentLines.push("   • Strengthen Venus through acts of generosity, artistic expression, and cultivating beauty in your environment.")
  }

  const venusDay = PLANET_MANTRAS.Venus?.day || "Friday"
  contentLines.push(`   • Wear white or pastel clothing on ${venusDay}s to align with Venus energy.`)

  if (house7Lord && house7Lord.retrograde) {
    contentLines.push(`   • Your 7th lord ${house7.lord} is retrograde—be patient; marriage may come later but with deeper karmic purpose.`)
  }

  contentLines.push(`   • Focus on the ${getOrdinal(house7.lordPlacement)} house themes (where your 7th lord sits) to attract the right partner.`)
  contentLines.push("")

  return {
    title: "Remedies for Timely Marriage",
    content: contentLines.join("\n"),
    highlights,
  }
}

// ─── Summary Builder ────────────────────────────────────

function buildSummary(data: ReportData): string {
  const house7 = data.houseAnalysis[6]
  const houseStrength = data.houseStrengths.find(h => h.house === 7)
  const savScore = houseStrength?.sav ?? 0

  const strengthLevel =
    savScore >= 30 ? "strong" :
    savScore >= 20 ? "moderate" :
    "requires support"

  const mangalDosha = data.doshas.find(d => d.type === "Mangal Dosha")
  const mangalStatus = mangalDosha ? "present with specific implications" : "absent, which is highly favorable"

  return (
    `This Marriage Timing Report provides a comprehensive astrological analysis of your marriage prospects, timing, and remedies. ` +
    `Your 7th house (marriage) is in ${house7.sign} with ${strengthLevel} planetary support (Ashtakavarga score: ${savScore}). ` +
    `Mangal Dosha is ${mangalStatus}. ` +
    `This report identifies optimal timing windows from your Dasha periods, highlights challenges that may delay marriage, and provides specific Vedic remedies to strengthen marriage prospects. ` +
    `Marriage timing depends not only on planetary periods but also on personal readiness, conscious choices, and aligned action.`
  )
}

// ─── Extract Remedies for Report ────────────────────────

function extractRemedies(data: ReportData): ReportRemedy[] {
  const remedies: ReportRemedy[] = []

  // Identify planets needing remedies
  const venus = data.natalChart.planets.find(p => p.name === "Venus")
  const jupiter = data.natalChart.planets.find(p => p.name === "Jupiter")
  const house7 = data.houseAnalysis[6]
  const house7Lord = data.natalChart.planets.find(p => p.name === house7.lord)

  const affectedPlanets: string[] = []

  if (venus && (venus.dignity === "debilitated" || venus.dignity === "enemy" || venus.retrograde)) {
    affectedPlanets.push("Venus")
  }
  if (jupiter && (jupiter.dignity === "debilitated" || jupiter.dignity === "enemy")) {
    affectedPlanets.push("Jupiter")
  }
  if (house7Lord && (house7Lord.dignity === "debilitated" || house7Lord.dignity === "enemy" || house7Lord.retrograde)) {
    affectedPlanets.push(house7Lord.name)
  }

  // If no specific afflictions, still recommend Venus strengthening
  if (affectedPlanets.length === 0) {
    affectedPlanets.push("Venus")
  }

  // Build remedies from affected planets
  for (const planet of affectedPlanets) {
    const mantra = PLANET_MANTRAS[planet]
    if (mantra) {
      remedies.push({
        type: "Mantra",
        description: `Chant "${mantra.mantra}" ${mantra.count} on ${mantra.day}s for strengthening ${planet}.`,
      })
    }

    const gem = PLANET_GEMSTONES[planet]
    if (gem) {
      remedies.push({
        type: "Gemstone",
        description: `Wear ${gem.gem} set in ${gem.metal} on ${gem.finger} to enhance ${planet}'s positive influence.`,
      })
    }
  }

  // Add Mangal Dosha remedy if present
  const mangalDosha = data.doshas.find(d => d.type === "Mangal Dosha")
  if (mangalDosha) {
    remedies.push({
      type: "Dosha Management",
      description: "Mangal Dosha is present. Seek a compatible partner with Mangal Dosha, or perform Mars Pacification rituals.",
    })
  }

  // Add dasha-based remedy
  const nextVenus = data.dashaTimeline.find(p => p.mahadasha === "Venus")
  if (nextVenus) {
    remedies.push({
      type: "Timing",
      description: `Prioritize marriage during Venus Mahadasha (${formatDate(nextVenus.startDate)} to ${formatDate(nextVenus.endDate)}).`,
    })
  }

  return remedies
}

// ─── Utility Functions ──────────────────────────────────

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDegree(degree: number): string {
  const d = Math.floor(degree)
  const m = Math.floor((degree % 1) * 60)
  return `${d}°${m}'`
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
