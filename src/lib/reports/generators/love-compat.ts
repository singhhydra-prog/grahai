/* ════════════════════════════════════════════════════════
   GrahAI — Love & Compatibility Report Generator

   Generates a comprehensive relationship analysis based entirely on
   calculated birth chart data. NO AI API calls — pure Jyotish analysis.
   ════════════════════════════════════════════════════════ */

import type { ReportData } from "../kundli-report-generator"
import type { PlanetStrengthReport } from "../../ephemeris/planet-strength"
import {
  GeneratedReport,
  ReportSection,
  ReportRemedy,
  PLANET_MANTRAS,
  PLANET_GEMSTONES,
  DIGNITY_LABELS,
  HOUSE_LIFE_AREAS,
} from "./types"

/* ─── Main Report Generator ──────────────────────────────── */

export function generateLoveCompatReport(data: ReportData): GeneratedReport {
  const sections: ReportSection[] = []

  // Section 1: Love Language & Expression (Venus + Nakshatra)
  sections.push(generateLoveLanguageSection(data))

  // Section 2: Emotional Patterns (Moon + 4th House)
  sections.push(generateEmotionalPatternsSection(data))

  // Section 3: Ideal Partner Profile (7th House + D9 Navamsa)
  sections.push(generatePartnerProfileSection(data))

  // Section 4: Relationship Timeline (Dasha Periods)
  sections.push(generateRelationshipTimelineSection(data))

  // Section 5: Remedies for Love (Afflictions + Doshas)
  sections.push(generateRemedialsSection(data))

  // Generate remedies based on afflicted relationship planets
  const remedies = generateRelationshipRemedies(data)

  // Create summary
  const summary = generateSummary(data)

  return {
    summary,
    sections,
    remedies,
  }
}

/* ─── Section 1: Love Language & Expression ──────────────── */

function generateLoveLanguageSection(data: ReportData): ReportSection {
  const venusData = data.natalChart.planets.find(p => p.name === "Venus")!
  const venusTable = data.planetTable.find(p => p.planet === "Venus") || { retrograde: venusData.retrograde }
  const venusHouse = data.houseAnalysis.find(h => h.house === venusData.house)!
  const venusNakshatra = venusData.nakshatra!
  const venusYogas = data.yogas.filter(y => y.involvedPlanets?.includes("Venus"))
  const venusStrength = data.strengthAnalysis.planets.find((p: PlanetStrengthReport) => p.planet === "Venus")?.compositeStrength.adjusted || 5

  const dignityLabel = getDignityDescription(venusData.dignity || "neutral")
  const dignityQuality = getVenusDignityContext(venusData.dignity || "neutral")
  const nakshatraLoveQualities = getNakshatraLoveQualities(venusNakshatra.name)
  const houseVenusMeaning = getVenusHouseContext(venusData.house, venusData.sign.name)
  const signVenusTraits = getVenusSignTraits(venusData.sign.name)
  const houseMeaning = HOUSE_LIFE_AREAS[venusData.house]

  let content = `**Venus at ${venusData.longitude?.toFixed(1) || "?"} in ${venusData.sign.name} (${getOrdinal(venusData.house)} house, ${venusNakshatra.name})**\n\n`

  // Lead with data: dignity status dramatically changes interpretation
  if (venusData.dignity === "exalted") {
    content += `Your Venus is exalted in ${venusData.sign.name}, one of its most powerful placements. This is the signature of someone with natural romantic magnetism and the ability to attract and sustain love effortlessly. `
    content += `${dignityQuality} Your attraction is not superficial—it radiates from an aligned heart. `
  } else if (venusData.dignity === "moolatrikona") {
    content += `Venus in ${venusData.sign.name} is in its Moolatrikona, indicating you are deeply at home in matters of love and partnership. `
    content += `${dignityQuality} You express affection naturally and attract partners who feel at ease with your authentic romantic self. `
  } else if (venusData.dignity === "own") {
    content += `Venus in its own sign of ${venusData.sign.name} gives you direct ownership of romantic expression. `
    content += `${dignityQuality} You know what you want in love and pursue it with focus. `
  } else if (venusData.dignity === "debilitated") {
    content += `Venus is debilitated in ${venusData.sign.name}, suggesting romantic expression requires more conscious effort and refinement. `
    content += `${dignityQuality} Your challenge is not lack of capacity for love but rather learning to transmute relationship obstacles into spiritual wisdom. Remedies will significantly improve your outcomes. `
  } else if (venusData.dignity === "enemy") {
    content += `Venus in an enemy sign (${venusData.sign.name}) indicates friction between your love values and your baseline personality. `
    content += `${dignityQuality} This placement rewards deliberate relationship work—when you align your Venus energy consciously, you attract remarkably devoted partners. `
  } else {
    content += `Venus in ${venusData.sign.name} places you in a neutral position regarding romantic expression. `
    content += `${dignityQuality} Your love life develops through active engagement and intentional choices. `
  }
  content += `\n\n`

  // Sign-specific Venus traits
  content += `**${venusData.sign.name} Venus: Your Romantic Nature**\n\n`
  content += `${signVenusTraits} In your case, this shapes how you approach attraction, what qualities you seek in partners, and how you express affection. `
  content += `Your Venus in the ${getOrdinal(venusData.house)} house amplifies these ${venusData.sign.name} qualities through the lens of ${houseMeaning}.\n\n`

  // House-specific meaning
  content += `**Venus in the ${getOrdinal(venusData.house)} House: ${getHouseName(venusData.house)} Love**\n\n`
  content += `${houseVenusMeaning} This placement means your romantic destiny is most visible and active in this life domain. `
  content += `Partners you attract will also value these same areas, creating strong compatibility on this axis.\n\n`

  // Nakshatra
  content += `**${venusNakshatra.name} Influence (ruled by ${venusNakshatra.lord})**\n\n`
  content += `${nakshatraLoveQualities} Partners who share or complement this nakshatra energy understand your romantic language intuitively. `
  content += `The nakshatra lord ${venusNakshatra.lord} further colors your approach—seek those who resonate with ${venusNakshatra.lord}'s qualities for deepest alignment.\n\n`

  // Retrograde status
  if (venusTable.retrograde) {
    content += `**Venus Retrograde: Karmic Relationship Layers**\n\n`
    content += `Your Venus is retrograde, indicating you are reworking patterns from previous cycles—possibly past lives. `
    content += `You attract partners with whom you have unfinished business, relationships that feel fated and intense. `
    content += `Rather than casual romance, you seek soul-level connection. The remedy is honoring the depth you naturally seek.\n\n`
  }

  // Yogas
  if (venusYogas.length > 0) {
    content += `**Yogas Amplifying Your Venus**\n\n`
    for (const yoga of venusYogas.slice(0, 2)) {
      content += `• **${yoga.name}** (Strength: ${yoga.strength}): ${yoga.description}\n`
    }
    content += "\n"
  }

  // Closing unique to strength
  if (venusStrength >= 8) {
    content += `Your Venus is exceptionally strong. This is the birth chart signature of someone who will experience profound love—if they choose consciously and honor the depth love requires.\n`
  } else if (venusStrength >= 6) {
    content += `Your Venus has good foundational strength. Love comes naturally, though it deepens through practice and self-awareness in partnership.\n`
  } else {
    content += `Your Venus requires conscious cultivation. Like a garden, love will flourish with dedicated attention, but the potential is absolutely there.\n`
  }

  return {
    title: "Love Language & Expression",
    content: content.trim(),
    highlights: [
      `Venus in ${venusData.sign.name}`,
      `${getOrdinal(venusData.house)} house (${houseMeaning})`,
      `${venusNakshatra.name} (${venusNakshatra.lord})`,
      `${dignityLabel}`,
    ],
  }
}

/* ─── Section 2: Emotional Patterns ──────────────────────── */

function generateEmotionalPatternsSection(data: ReportData): ReportSection {
  const moonData = data.natalChart.planets.find(p => p.name === "Moon")!
  const moonTable = data.planetTable.find(p => p.planet === "Moon") || { retrograde: moonData.retrograde }
  const moonNakshatra = moonData.nakshatra!
  const fourthHouse = data.houseAnalysis.find(h => h.house === 4)!
  const fourthLord = data.natalChart.planets.find(p => p.name === fourthHouse.lord)!
  const nakshatraAnalysis = data.nakshatraAnalysis

  const moonSignSecurityType = getEmotionalSecurityType(moonData.sign.name)
  const moonSignTraits = getMoonSignTraits(moonData.sign.name)
  const moonHouseMeaning = HOUSE_LIFE_AREAS[moonData.house]
  const moonDignityContext = getMoonDignityContext(moonData.dignity || "neutral")
  const attachmentStyle = getAttachmentStyle(moonData.sign.name, moonNakshatra.name)

  let content = `**Moon at ${moonData.longitude?.toFixed(1) || "?"} in ${moonData.sign.name} (${getOrdinal(moonData.house)} house, ${moonNakshatra.name})**\n\n`

  // Lead with data: emotional baseline
  content += `Your Moon in ${moonData.sign.name} is your emotional core—how you process feelings, seek nurturing, and build security in love. `
  content += `${moonDignityContext} This ${moonData.sign.name} Moon means your baseline emotional nature is: ${moonSignTraits}.\n\n`

  // House context
  content += `**Moon in the ${getOrdinal(moonData.house)} House: ${getHouseName(moonData.house)} Emotional Foundation**\n\n`
  content += `The ${getOrdinal(moonData.house)} house connects emotions to ${moonHouseMeaning}. `
  content += `Your emotional security is inseparable from stability in this life domain. `
  content += `Partners who honor your needs here create the safest ground for your feelings to open. `
  if (moonData.house === 4) {
    content += `With Moon in the 4th house (its own domain), emotional security and a sense of "home" with your partner is paramount. Invest in building a stable home base together.\n\n`
  } else {
    content += `\n\n`
  }

  // Nakshatra character
  content += `**${moonNakshatra.name} Moon (ruled by ${moonNakshatra.lord}): Emotional Temperament**\n\n`
  content += `Born under ${moonNakshatra.name}, your emotional character carries ${nakshatraAnalysis.characteristics.toLowerCase()}. `
  content += `In relationships, this manifests as: ${attachmentStyle}. `
  content += `Partners who understand ${moonNakshatra.name}'s needs for ${getNakshatraEmotionalNeeds(moonNakshatra.name)} will feel naturally compatible with you.\n\n`

  // Fourth house lord (emotional foundation reinforcement)
  content += `**Fourth House Lord (${fourthHouse.lord}): Roots & Nesting Instinct**\n\n`
  content += `The ${fourthHouse.lord} rules your 4th house of emotional roots and is placed in ${fourthLord.sign.name}. `
  content += `This tells us your emotional foundation comes through ${fourthLord.sign.name} qualities. `
  content += `Partners who share or support these ${fourthLord.sign.name} values will help you feel truly "at home" in the relationship.\n\n`

  // Attachment pattern
  content += `**Your Attachment Style**\n\n`
  content += `You need ${moonSignSecurityType} in partnerships. `
  if (moonTable.retrograde) {
    content += `Your Moon is retrograde, indicating you process emotions internally first and may take time to open fully. This is not coldness—it's discernment. `
  }
  content += `Emotionally mature partners who can honor this pace create the conditions where you genuinely flourish. `
  content += `Conversely, impatient or dismissive partners activate your Moon's fear response.\n`

  return {
    title: "Emotional Patterns & Security Needs",
    content: content.trim(),
    highlights: [
      `Moon in ${moonData.sign.name}`,
      `${getOrdinal(moonData.house)} house (${moonHouseMeaning})`,
      `${moonNakshatra.name} (${moonNakshatra.lord})`,
      `Needs: ${moonSignSecurityType}`,
    ],
  }
}

/* ─── Section 3: Ideal Partner Profile ──────────────────── */

function generatePartnerProfileSection(data: ReportData): ReportSection {
  const seventhHouse = data.houseAnalysis.find(h => h.house === 7)!
  const seventhLord = seventhHouse.lord
  const seventhLordPlanet = data.natalChart.planets.find(p => p.name === seventhLord)!
  const seventhLordHouse = seventhLordPlanet.house
  const seventhLordSign = seventhLordPlanet.sign.name
  const seventhLordDignity = seventhLordPlanet.dignity || "neutral"

  // Planets actually in the 7th house
  const planetsIn7th = data.houseAnalysis.find(h => h.house === 7)?.planetsInHouse || []

  const navamsaChart = data.navamsaChart
  const navamsaVenusPlanet = navamsaChart.planets.find(p => p.name === "Venus")
  const navamsaMoonPlanet = navamsaChart.planets.find(p => p.name === "Moon")

  const seventhLordContext = get7thLordContext(seventhLord, seventhLordSign, seventhLordDignity)
  const seventhSignContext = get7thHouseSignContext(seventhHouse.sign)

  let content = `**7th House: Partnership & Marriage (Cusp in ${seventhHouse.sign})**\n\n`

  // Lead with 7th house sign
  content += `Your 7th house of partnerships is in ${seventhHouse.sign}, ruled by ${seventhLord}. `
  content += `${seventhSignContext} This is the primary filter through which you attract and choose partners. `
  content += `Partners who embody these ${seventhHouse.sign} qualities—or who complement them—will feel naturally aligned with you.\n\n`

  // 7th Lord placement
  content += `**7th Lord ${seventhLord} in ${seventhLordSign} (${getOrdinal(seventhLordHouse)} house)**\n\n`
  content += `${seventhLordContext} `
  content += `This placement modifies where partnership energy activates in your life. If your 7th lord is in the 10th house, partnerships enhance career. In the 5th, they fuel creativity. In the 1st, they define your identity. `
  content += `In your case, the ${getOrdinal(seventhLordHouse)} house means partnership manifests most visibly through ${HOUSE_LIFE_AREAS[seventhLordHouse]}.\n\n`

  // Planets in 7th
  if (planetsIn7th.length > 0) {
    content += `**Planets in Your 7th House: Direct Partnership Influences**\n\n`
    for (const planetName of planetsIn7th) {
      const planet = data.natalChart.planets.find(p => p.name === planetName)
      if (planet) {
        content += `• **${planetName}** in ${planet.sign.name}: ${get7thPlanetContext(planetName, planet.sign.name)}\n`
      }
    }
    content += "\n"
  }

  // D9 Navamsa
  content += `**D9 Navamsa (Harmonic Divisional Chart): Spiritual Partnership Blueprint**\n\n`
  content += `In D9, Venus is in ${navamsaVenusPlanet?.sign.name || "?"} and Moon is in ${navamsaMoonPlanet?.sign.name || "?"}. `
  content += `These placements reveal the deeper spiritual and energetic match you need. `
  content += `The Navamsa describes marriage at the soul level—the qualities you recognize intuitively, even in people who don't fit your surface preferences. `
  content += `Partners whose own D9 placements resonate with yours create lasting, almost fated bonds.\n\n`

  // Partner profile synthesis
  content += `**Your Ideal Partner Blueprint**\n\n`
  content += `Based on your 7th house in ${seventhHouse.sign} and 7th lord in ${seventhLordSign}:\n\n`
  content += `• Possesses core ${seventhHouse.sign} qualities: ${getSignCoreQualities(seventhHouse.sign)}\n`
  content += `• Complements your Moon in ${data.natalChart.planets.find(p => p.name === "Moon")!.sign.name}\n`
  content += `• Values partnership as a path to growth in ${HOUSE_LIFE_AREAS[seventhLordHouse]}\n`
  if (planetsIn7th.length > 0) {
    content += `• Resonates with the ${planetsIn7th[0]} qualities active in your 7th house\n`
  }
  content += `• Has Navamsa placements that align with your D9 blueprint\n\n`

  content += `The strength of your 7th lord (${get7thLordQualityDesc(seventhLordDignity)}) determines the quality of partners you attract. `
  content += `A strong 7th lord brings devoted, aligned partners. A weak 7th lord requires you to be more discerning and intentional in partnership choices.\n`

  return {
    title: "Ideal Partner Profile & Marriage Prospects",
    content: content.trim(),
    highlights: [
      `7th house in ${seventhHouse.sign}`,
      `7th Lord: ${seventhLord} in ${seventhLordSign}`,
      `D9 Venus in ${navamsaVenusPlanet?.sign.name || "?"}`,
      planetsIn7th.length > 0 ? `${planetsIn7th[0]} in 7th` : "No planets in 7th",
    ],
  }
}

/* ─── Section 4: Relationship Timeline ─────────────────── */

function generateRelationshipTimelineSection(data: ReportData): ReportSection {
  const currentMahadasha = data.dashaAnalysis.currentMahadasha
  const currentAntardasha = data.dashaAnalysis.currentAntardasha
  const dashaTimeline = data.dashaTimeline || []

  // Find upcoming Venus, Jupiter, Moon periods
  const upcomingVenusPeriod = dashaTimeline.find(
    d => (d.mahadasha === "Venus" || d.antardasha === "Venus") && new Date(d.endDate) > new Date()
  )
  const upcomingJupiterPeriod = dashaTimeline.find(
    d => (d.mahadasha === "Jupiter" || d.antardasha === "Jupiter") && new Date(d.endDate) > new Date()
  )
  const upcomingMoonPeriod = dashaTimeline.find(
    d => (d.mahadasha === "Moon" || d.antardasha === "Moon") && new Date(d.endDate) > new Date()
  )

  const relationshipYogas = data.yogas.filter(y =>
    y.involvedPlanets?.some(p => ["Venus", "Moon", "7th", "5th"].includes(p)) ||
    y.description?.toLowerCase().includes("marriage") ||
    y.description?.toLowerCase().includes("relationship")
  )

  const currentDashaAdvice = getDashaRelationshipAdvice(currentMahadasha.planet, currentAntardasha.planet)
  const isCurrentlyFavorable = isCurrentDashaFavorableForLove(currentMahadasha.planet, currentAntardasha.planet)

  let content = `**Your Current Dasha Period: ${currentMahadasha.planet} Mahadasha (${formatDate(currentMahadasha.startDate)} → ${formatDate(currentMahadasha.endDate)})**\n\n`

  content += `You are currently in ${currentMahadasha.planet} Mahadasha, an ${currentDashaAdvice.toLowerCase()}. `
  content += `Within this period, your Antardasha is ${currentAntardasha.planet} (${formatDate(currentAntardasha.startDate)} → ${formatDate(currentAntardasha.endDate)}). `
  if (isCurrentlyFavorable) {
    content += `This is a naturally auspicious window for relationship developments. The cosmos is creating openings for love.\n\n`
  } else {
    content += `This is a more introspective period for relationships. Rather than pursuing externally, use this time for emotional clarity and self-refinement.\n\n`
  }

  // Upcoming periods
  content += `**Relationship Windows in Your Future Timeline**\n\n`

  if (upcomingVenusPeriod) {
    content += `• **Venus Period** (${formatDate(new Date(upcomingVenusPeriod.startDate))} to ${formatDate(new Date(upcomingVenusPeriod.endDate))}): `
    content += `Peak auspiciousness for romance, marriage, and deepening partnerships. This is your golden window for relationship commitments.\n`
  }

  if (upcomingJupiterPeriod) {
    content += `• **Jupiter Period** (${formatDate(new Date(upcomingJupiterPeriod.startDate))} to ${formatDate(new Date(upcomingJupiterPeriod.endDate))}): `
    content += `Expansive and fortunate for partnerships. Jupiter brings luck, growth, and auspicious meetings with aligned people.\n`
  }

  if (upcomingMoonPeriod) {
    content += `• **Moon Period** (${formatDate(new Date(upcomingMoonPeriod.startDate))} to ${formatDate(new Date(upcomingMoonPeriod.endDate))}): `
    content += `Emotionally receptive and tender. Excellent for emotional intimacy and establishing emotional depth in relationships.\n`
  }

  content += `\n`

  // Yogas
  if (relationshipYogas.length > 0) {
    content += `**Yogas Supporting Your Relationship Potential**\n\n`
    for (const yoga of relationshipYogas.slice(0, 3)) {
      content += `• **${yoga.name}** (${yoga.strength}/10): ${yoga.description}\n`
    }
    content += "\n"
  }

  content += `**Interpreting Timing & Free Will**\n\n`
  content += `Dasha periods show when cosmic support is available. But timing works in concert with your choices. `
  content += `During favorable periods, open your heart and say yes. During slower periods, invest in self-work. `
  content += `The universe gives you windows; you decide what to build in them.\n`

  return {
    title: "Relationship Timeline & Dasha Periods",
    content: content.trim(),
    highlights: [
      `Mahadasha: ${currentMahadasha.planet}`,
      `Antardasha: ${currentAntardasha.planet}`,
      `Current status: ${isCurrentlyFavorable ? "Favorable" : "Introspective"}`,
      upcomingVenusPeriod ? "Venus window upcoming" : "Check timeline for Venus period",
    ],
  }
}

/* ─── Section 5: Remedies & Support Practices ───────────── */

function generateRemedialsSection(data: ReportData): ReportSection {
  const venusData = data.natalChart.planets.find(p => p.name === "Venus")!
  const moonData = data.natalChart.planets.find(p => p.name === "Moon")!
  const seventhLordData = data.natalChart.planets.find(
    p => p.name === data.houseAnalysis.find(h => h.house === 7)!.lord
  )!

  const relationshipDoshas = data.doshas.filter(d =>
    d.description?.toLowerCase().includes("relationship") ||
    d.description?.toLowerCase().includes("marriage") ||
    d.type.toLowerCase().includes("mangal") ||
    d.involvedPlanets?.some(p => ["Venus", "7th", "Moon"].includes(p))
  )

  const needsVenusWork = venusData.dignity === "debilitated" || venusData.dignity === "enemy"
  const needsMoonWork = moonData.dignity === "debilitated" || moonData.dignity === "enemy"
  const needs7thLordWork = seventhLordData.dignity === "debilitated" || seventhLordData.dignity === "enemy"

  let content = `**Aligning With Love's Frequencies**\n\n`

  content += `Your chart reveals specific relationship strengths and obstacles. Vedic remedies (Upaya) work by resonating your energy with planetary frequencies, clearing blocks, and amplifying support. `
  content += `These are not magical—they are conscious alignment practices that attune you to love's natural rhythms.\n\n`

  // Specific needs
  if (needsVenusWork || needsMoonWork || needs7thLordWork) {
    content += `**Targeted Remedies for Your Chart**\n\n`

    if (needsVenusWork) {
      const venusRemedy = PLANET_MANTRAS["Venus"]
      content += `**Venus Strengthening** (Venus is ${venusData.dignity} in your chart)\n\n`
      content += `Recite the Venus mantra: *${venusRemedy.mantra}* — ${venusRemedy.count} repetitions on ${venusRemedy.day}s. `
      content += `This unlocks Venus's benevolence in your romantic life, softening obstacles and inviting love's expression.\n\n`

      const venusGem = PLANET_GEMSTONES["Venus"]
      content += `Wear a ${venusGem.gem} set in ${venusGem.metal} on the ${venusGem.finger}. `
      content += `This creates an energetic anchor, aligning your aura with Venus's frequency continuously. Many report shifts in attraction and receptivity within weeks.\n\n`
    }

    if (needsMoonWork) {
      const moonRemedy = PLANET_MANTRAS["Moon"]
      content += `**Moon Stabilization** (Moon is ${moonData.dignity} in your chart)\n\n`
      content += `Chant the Moon mantra: *${moonRemedy.mantra}* — ${moonRemedy.count} times on ${moonRemedy.day}s. `
      content += `This calms emotional turbulence, builds emotional resilience, and opens you to receive love without fear.\n\n`

      const moonGem = PLANET_GEMSTONES["Moon"]
      content += `A ${moonGem.gem} in ${moonGem.metal} on the ${moonGem.finger} stabilizes your emotional field, reducing reactive patterns that push partners away.\n\n`
    }

    if (needs7thLordWork) {
      const lordRemedy = PLANET_MANTRAS[seventhLordData.name]
      if (lordRemedy) {
        content += `**7th Lord Strengthening** (${seventhLordData.name} rules partnership in your chart)\n\n`
        content += `The ${seventhLordData.name} mantra: *${lordRemedy.mantra}* — ${lordRemedy.count} on ${lordRemedy.day}s. `
        content += `This directly harmonizes the planet governing partnerships, improving both opportunity and quality of connections.\n\n`
      }
    }
  }

  // Doshas
  if (relationshipDoshas.length > 0) {
    content += `**Dosha-Specific Remedies**\n\n`
    for (const dosha of relationshipDoshas.slice(0, 2)) {
      content += `**${dosha.type}** (Severity: ${dosha.severity || "moderate"})\n`
      content += `${dosha.description}\n`
      if (dosha.remedies && dosha.remedies.length > 0) {
        content += `Remedies: ${dosha.remedies[0]}\n`
      }
      content += "\n"
    }
  }

  // Universal practices
  content += `**Universal Love-Supporting Practices**\n\n`
  content += `1. **Monday Lunar Fasting**: Observe Mondays with fasting or simple vegetarian food, dedicating the day to emotional healing and Moon-Venus attunement.\n\n`
  content += `2. **Gratitude for Love Present**: Daily gratitude for love already in your life—family, friends, self-love—creates a magnetic field that attracts more.\n\n`
  content += `3. **Beauty Rituals**: Consciously create beauty around you—flowers, music, art, scent. This is Venus language. Your environment trains your energy.\n\n`
  content += `4. **Heart-Centered Meditation**: 10 minutes daily visualizing your heart as a glowing rose or emerald, opening inward. This rewires your attachment template.\n\n`
  content += `5. **Giving to Couples**: Witness and celebrate others' love. Attend weddings, support friends' relationships, celebrate anniversaries. This karmic action aligns you with partnership joy.\n\n`

  content += `Consistency matters more than perfection. A few minutes of genuine practice daily outweighs sporadic intensive effort. These remedies work by gradually reprogramming your relationship consciousness.\n`

  return {
    title: "Remedies for Love & Relationship Support",
    content: content.trim(),
    highlights: [
      needsVenusWork ? "Venus strengthening needed" : "Venus well-placed",
      needsMoonWork ? "Moon stabilization needed" : "Moon stable",
      relationshipDoshas.length > 0 ? `${relationshipDoshas.length} dosha(s) identified` : "No major doshas",
      "Universal practices included",
    ],
  }
}

/* ─── Remedy Generation ──────────────────────────────────── */

function generateRelationshipRemedies(data: ReportData): ReportRemedy[] {
  const remedies: ReportRemedy[] = []
  const venusData = data.natalChart.planets.find(p => p.name === "Venus")!
  const moonData = data.natalChart.planets.find(p => p.name === "Moon")!
  const seventhLordData = data.natalChart.planets.find(
    p => p.name === data.houseAnalysis.find(h => h.house === 7)!.lord
  )!

  // Venus remedy
  if (venusData.dignity === "debilitated" || venusData.dignity === "enemy") {
    const remedy = PLANET_MANTRAS["Venus"]
    remedies.push({
      type: "Venus Mantra",
      description: `Recite "${remedy.mantra}" ${remedy.count} on ${remedy.day}s to strengthen Venus and enhance love and attraction in your life.`,
    })

    const gem = PLANET_GEMSTONES["Venus"]
    remedies.push({
      type: "Venus Gemstone",
      description: `Wear a ${gem.gem} in ${gem.metal} on the ${gem.finger} to attune your energy to Venus's blessings on romance and partnership.`,
    })
  }

  // Moon remedy
  if (moonData.dignity === "debilitated" || moonData.dignity === "enemy") {
    const remedy = PLANET_MANTRAS["Moon"]
    remedies.push({
      type: "Moon Mantra",
      description: `Chant "${remedy.mantra}" ${remedy.count} on ${remedy.day}s to stabilize emotions and create emotional security in relationships.`,
    })

    const gem = PLANET_GEMSTONES["Moon"]
    remedies.push({
      type: "Moon Gemstone",
      description: `Adorn yourself with a ${gem.gem} in ${gem.metal} on the ${gem.finger} to enhance emotional clarity and receptivity in love.`,
    })
  }

  // 7th Lord remedy
  if (seventhLordData && (seventhLordData.dignity === "debilitated" || seventhLordData.dignity === "enemy")) {
    const lordRemedy = PLANET_MANTRAS[seventhLordData.name]
    if (lordRemedy) {
      remedies.push({
        type: `${seventhLordData.name} Mantra (7th Lord)`,
        description: `The lord of the 7th house requires strengthening. Recite "${lordRemedy.mantra}" ${lordRemedy.count} on ${lordRemedy.day}s to harmonize partnership.`,
      })
    }
  }

  // Dosha-specific remedies
  const relationshipDoshas = data.doshas.filter(d =>
    d.type.toLowerCase().includes("mangal") || d.type.toLowerCase().includes("marriage")
  )

  for (const dosha of relationshipDoshas) {
    if (dosha.remedies && dosha.remedies.length > 0) {
      remedies.push({
        type: `${dosha.type} Remedy`,
        description: dosha.remedies[0],
      })
    }
  }

  // Default if no specific afflictions
  if (remedies.length === 0) {
    remedies.push({
      type: "Heart-Centered Meditation",
      description: "Daily 10-minute meditation visualizing your heart chakra as an opening rose, cultivating emotional receptivity and magnetic love energy.",
    })
  }

  return remedies.slice(0, 3) // Return top 3 remedies
}

/* ─── Summary Generation ─────────────────────────────────── */

function generateSummary(data: ReportData): string {
  const venusData = data.natalChart.planets.find(p => p.name === "Venus")!
  const moonData = data.natalChart.planets.find(p => p.name === "Moon")!
  const seventhHouse = data.houseAnalysis.find(h => h.house === 7)!
  const currentMahadasha = data.dashaAnalysis.currentMahadasha

  const venusNakshatra = venusData.nakshatra!.name
  const moonNakshatra = moonData.nakshatra!.name
  const venusStrength = data.strengthAnalysis.planets.find((p: PlanetStrengthReport) => p.planet === "Venus")?.compositeStrength.adjusted || 5

  let summary = `Your love blueprint: Venus in ${venusData.sign.name} (${venusNakshatra}, ${getOrdinal(venusData.house)} house) shapes how you love. `
  summary += `Moon in ${moonData.sign.name} (${moonNakshatra}) governs your emotional needs. `
  summary += `7th house in ${seventhHouse.sign} defines who you attract. `
  summary += `You're currently in ${currentMahadasha.planet} Dasha (through ${formatDate(currentMahadasha.endDate)}). `
  summary += `With conscious attention to your chart patterns and aligned practices, you create conditions for profound, lasting love.`

  return summary
}

/* ─── Helper Functions ───────────────────────────────────── */

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function getHouseName(house: number): string {
  const names: Record<number, string> = {
    1: "Self & Identity",
    2: "Values & Resources",
    3: "Communication & Siblings",
    4: "Home & Roots",
    5: "Creativity & Children",
    6: "Work & Health",
    7: "Partnership & Marriage",
    8: "Transformation & Intimacy",
    9: "Spirituality & Travel",
    10: "Career & Status",
    11: "Friendships & Goals",
    12: "Spirituality & Solitude",
  }
  return names[house] || "Life Domain"
}

function getDignityDescription(dignity: string): string {
  const map: Record<string, string> = {
    exalted: "exalted (your strongest placement for love expression)",
    moolatrikona: "in Moolatrikona (very well-placed for romance)",
    own: "in own sign (comfortable and authentic)",
    friendly: "in a friendly sign (well-supported)",
    neutral: "in a neutral position",
    enemy: "in an enemy sign (requiring conscious effort to express love)",
    debilitated: "debilitated (needing specific remedies to strengthen)",
  }
  return map[dignity] || "in a neutral position"
}

function getVenusDignityContext(dignity: string): string {
  const map: Record<string, string> = {
    exalted:
      "This is one of the most auspicious placements. You naturally magnetize partners and express affection with grace.",
    moolatrikona:
      "Venus is deeply at home here. You operate from your authentic romantic self with ease and confidence.",
    own: "You own your romantic expression. You know what you want and pursue it with clarity.",
    friendly:
      "Venus is well-supported, making love expression relatively natural. You attract reasonably aligned partners.",
    neutral:
      "Love requires intentional cultivation. You're not blocked, but also not inherently favored—your choices matter most.",
    enemy:
      "Venus experiences friction here. Love demands conscious work, but the payoff is extraordinary depth and spiritual wisdom.",
    debilitated:
      "Venus is in its weakest sign. Love and attraction don't come easily, but remedies will transform this into a gift.",
  }
  return map[dignity] || "Venus sits in a complex position here"
}

function getMoonDignityContext(dignity: string): string {
  const map: Record<string, string> = {
    exalted:
      "Your Moon is exalted, giving you exceptional emotional sensitivity, intuition, and the ability to deeply care.",
    moolatrikona:
      "Your Moon is very well-placed. Your emotions are clear and grounded. You know what you feel and why.",
    own: "Your Moon is in its own sign. You are emotionally self-aware and naturally nurturing to partners.",
    friendly:
      "Your Moon is reasonably supported. Emotions flow relatively smoothly; you're emotionally available and responsive.",
    neutral:
      "Your Moon sits in a neutral position. Emotional clarity comes through practice and self-reflection.",
    enemy:
      "Your Moon experiences tension here. Emotional processing requires extra awareness, but brings depth.",
    debilitated:
      "Your Moon is in its weakest sign. Emotional patterns may be confusing, but remedies bring remarkable clarity.",
  }
  return map[dignity] || "Your Moon occupies a complex emotional terrain"
}

function getVenusSignTraits(sign: string): string {
  const traits: Record<string, string> = {
    Aries:
      "Direct, passionate, and impulsive in romance. You express feelings boldly and prefer partners who match your intensity.",
    Taurus:
      "Sensual, steady, and devoted. You seek stable, physical, and comfortable love. Loyalty is your currency.",
    Gemini:
      "Communicative, curious, and mentally engaged. You need intellectual connection alongside attraction.",
    Cancer:
      "Tender, protective, and emotionally deep. You seek security and create nurturing love spaces.",
    Leo:
      "Proud, generous, and dramatic. You love with your whole heart and need admiration and loyalty in return.",
    Virgo:
      "Discerning, practical, and service-oriented. You show love through acts of care and devotion.",
    Libra:
      "Harmonious, diplomatic, and partnership-focused. You naturally seek balance and delight in shared aesthetics.",
    Scorpio:
      "Intense, magnetic, and transformative. Your love is deep, powerful, and often fated or karmic.",
    Sagittarius:
      "Optimistic, adventurous, and idealistic. You seek partners who inspire growth and shared philosophy.",
    Capricorn:
      "Reserved, loyal, and committed. Love is serious to you—you build long-term, lasting partnerships.",
    Aquarius:
      "Unconventional, cerebral, and freedom-loving. You seek mental resonance and space to be yourself.",
    Pisces:
      "Dreamy, empathetic, and spiritually attuned. You love compassionately and often merge with partners.",
  }
  return traits[sign] || "embodying unique romantic qualities"
}

function getMoonSignTraits(sign: string): string {
  const traits: Record<string, string> = {
    Aries: "pioneering emotionally, direct in feelings, sometimes impulsive in responding to situations",
    Taurus: "emotionally stable, sensual, seeking security and comfort in intimate connections",
    Gemini: "mentally active, intellectually engaged, communicative in expressing feelings",
    Cancer: "deeply emotional, nurturing, family-oriented, sensitive to relational nuances",
    Leo: "proud emotionally, generous in affection, seeking recognition and admiration",
    Virgo: "analytical of feelings, practical in approach, seeking service and improvement",
    Libra: "balanced in emotional expression, relationship-focused, seeking harmony above all",
    Scorpio: "intense emotionally, secretive, deeply transformative in relationships",
    Sagittarius: "optimistic, freedom-loving, philosophical about relationships and feelings",
    Capricorn: "reserved, emotionally steady, seeking responsibility and long-term security",
    Aquarius: "detached emotionally, unconventional, seeking intellectual connection",
    Pisces: "dreamy, empathetic, spiritually attuned, intuitive about others' needs",
  }
  return traits[sign] || "emotionally unique and deeply feeling"
}

function getEmotionalSecurityType(moonSign: string): string {
  const security: Record<string, string> = {
    Aries: "independence, adventure, and a partner who respects your autonomy",
    Taurus: "physical comfort, stability, sensuality, and reliable affection",
    Gemini: "intellectual engagement, stimulating conversation, and mental partnership",
    Cancer: "emotional depth, physical closeness, and tangible signs of being cared for",
    Leo: "admiration, attention, and a partner who celebrates your uniqueness",
    Virgo: "loyalty, practical support, and a partner who shares your values",
    Libra: "balance, peace, and a partner who prioritizes the relationship",
    Scorpio: "intensity, loyalty, and a partner who understands your hidden depths",
    Sagittarius: "freedom, shared growth, and a partner who inspires expansion",
    Capricorn: "reliability, commitment, and a partner with clear goals and direction",
    Aquarius: "independence, shared ideals, and intellectual partnership",
    Pisces: "spiritual connection, empathy, and a partner who honors emotions",
  }
  return security[moonSign] || "deep emotional attunement and mutual understanding"
}

function getAttachmentStyle(moonSign: string, moonNakshatra: string): string {
  const baseStyle = getMoonSignTraits(moonSign)
  const nakshatraContext = getNakshatraAttachmentContext(moonNakshatra)
  return `${baseStyle} With ${moonNakshatra} influence, you ${nakshatraContext}.`
}

function getNakshatraAttachmentContext(nakshatra: string): string {
  const map: Record<string, string> = {
    Ashwini: "form fast bonds and move decisively in partnerships",
    Bharani: "carry emotions with depth and transform through love",
    Krittika: "are selective and need respect; you purify relationships",
    Rohini: "are naturally magnetic and create beauty in partnerships",
    Mrigashira: "need mental stimulation alongside emotional connection",
    Ardra: "process feelings intensely; relationships help you transform",
    Punarvasu: "return to optimism in love, even after difficulties",
    Pushya: "nourish naturally; you create the most stable love",
    Ashlesha: "are intuitively perceptive of partners' unspoken needs",
    Magha: "command respect and seek equals in partnership",
    "Purva Phalguni": "express affection joyfully and enjoy sensuality",
    "Uttara Phalguni": "naturally support and lift up your partners",
    Hasta: "manage relationships skillfully and attend to details",
    Chitra: "create beauty and vision in your love partnerships",
    Swati: "need freedom while committed; independence matters",
    Vishakha: "push toward relationship goals with determination",
    Anuradha: "value deep spiritual resonance with partners",
    Jyeshtha: "lead and protect; you take responsibility seriously",
    Moola: "seek truth; surface attraction isn't enough for you",
    "Purva Ashadha": "declare love boldly; confidence is your strength",
    "Uttara Ashadha": "build lasting commitments with permanence in mind",
    Shravana: "listen deeply; you understand partners intuitively",
    Dhanishta: "bring generosity and joy to partnerships",
    Shatabhisha: "heal through love; you attract those who need you",
    "Purva Bhadrapada": "bring spiritual intensity to relationships",
    "Uttara Bhadrapada": "offer stability and occult understanding",
    Revati: "guide partnership with compassion and wisdom",
  }
  return map[nakshatra] || "bring unique qualities to emotional connection"
}

function getNakshatraEmotionalNeeds(nakshatra: string): string {
  const map: Record<string, string> = {
    Ashwini: "action and forward momentum",
    Bharani: "emotional depth and transformation",
    Krittika: "respect and purification",
    Rohini: "growth and creative expression",
    Mrigashira: "intellectual stimulation",
    Ardra: "depth and transformation",
    Punarvasu: "optimism and renewal",
    Pushya: "nurturing and stability",
    Ashlesha: "intuition and understanding",
    Magha: "respect and partnership equality",
    "Purva Phalguni": "joy and sensuality",
    "Uttara Phalguni": "support and service",
    Hasta: "skill and attention to detail",
    Chitra: "beauty and vision",
    Swati: "freedom and flexibility",
    Vishakha: "progress and goals",
    Anuradha: "spiritual depth",
    Jyeshtha: "authority and responsibility",
    Moola: "truth and honesty",
    "Purva Ashadha": "confidence and boldness",
    "Uttara Ashadha": "permanence and success",
    Shravana: "listening and understanding",
    Dhanishta: "generosity and music",
    Shatabhisha: "healing and mysticism",
    "Purva Bhadrapada": "spiritual intensity",
    "Uttara Bhadrapada": "wisdom and stability",
    Revati: "compassion and guidance",
  }
  return map[nakshatra] || "emotional depth"
}

function getNakshatraLoveQualities(nakshatra: string): string {
  const qualities: Record<string, string> = {
    Ashwini: "swift and pioneering in romance, direct and courageous in expressing feelings",
    Bharani: "transformative, bearing emotional weight with grace and deep commitment",
    Krittika: "sharp-minded, selective in partnership, intense and purifying in love",
    Rohini: "beautiful and attractive, creative in relationships, seeks growth together",
    Mrigashira: "curious and intellectual, seeking mental connection alongside emotional bonds",
    Ardra: "intense and transformative, overcomes storms in relationships with depth",
    Punarvasu: "optimistic and nurturing, returning to light in troubled partnerships",
    Pushya: "nourishing and caring, the most auspicious for stable, supportive love",
    Ashlesha: "mystical and intuitive, deeply perceptive of partner's needs",
    Magha: "royal and commanding respect, seeks partnership of equals",
    "Purva Phalguni": "creative and joyful, enjoys sensuality and artistic expression",
    "Uttara Phalguni": "patronizing and helpful, naturally supportive and generous",
    Hasta: "skillful and resourceful, excellent at managing relationship details",
    Chitra: "visionary and artistic, creates beauty in relationships",
    Swati: "independent and flexible, seeks freedom within commitment",
    Vishakha: "determined and goal-oriented, achieving relationship milestones",
    Anuradha: "devoted and mystical, values deep spiritual connection",
    Jyeshtha: "authoritative and protective, leads with wisdom",
    Moola: "seeking truth and radical honesty, destroys illusions in partnership",
    "Purva Ashadha": "confident and invincible, declares feelings boldly",
    "Uttara Ashadha": "achieving permanent success, seeks lasting commitment",
    Shravana: "listening and learning, deeply attuned to partner's needs",
    Dhanishta: "musical and generous, wealthy in emotional expression",
    Shatabhisha: "healing and mystical, draws partnerships through healing presence",
    "Purva Bhadrapada": "passionate and intense, brings spiritual fire to love",
    "Uttara Bhadrapada": "deep and wise, offers stability and occult understanding",
    Revati: "nourishing and protective, guides partnership with compassion",
  }
  return qualities[nakshatra] || "possessing unique and transformative romantic qualities"
}

function getVenusHouseContext(house: number, venusSign: string): string {
  const contexts: Record<number, string> = {
    1: `Venus in the 1st house makes you naturally magnetic. People are drawn to your presence. Your love is expressed through your identity and personal radiance. Choose partners who admire who you are becoming.`,
    2: `Venus in the 2nd house anchors love in values and resources. You seek partners who share your financial ethics and material vision. Love becomes a shared nest-building project.`,
    3: `Venus in the 3rd house needs intellectual connection. Your love language is words, travel, and sibling-like ease. You thrive with partners who stimulate your mind and share ideas.`,
    4: `Venus in the 4th house roots love in home and family. You create beautiful domestic spaces. Your ideal partner values family, tradition, and building a sanctuary together.`,
    5: `Venus in the 5th house is the lover and creator. You love with romance, joy, and creative expression. Children and creative projects intertwine with your partnerships.`,
    6: `Venus in the 6th house channels love into service and health. You show affection through acts of care. Your ideal partner shares your wellness values and commitment to daily improvement.`,
    7: `Venus in the 7th house is the classic partnership placement. You are marriage-oriented and naturally diplomatic. Relationships are your primary life focus.`,
    8: `Venus in the 8th house brings intensity, mystery, and transformation to love. Your partnerships are deep, intimate, and often occult or taboo-breaking. You seek soul merging.`,
    9: `Venus in the 9th house seeks spiritual and philosophical resonance. Your ideal partner shares your beliefs or spiritual path. Love is your gateway to higher truth.`,
    10: `Venus in the 10th house places love in career and public life. Your partnerships enhance your status or are visible publicly. You attract partners aligned with your ambitions.`,
    11: `Venus in the 11th house makes you seek friendship within romance. You love freely and need intellectual and ideological compatibility. Community and like-minded circles matter deeply.`,
    12: `Venus in the 12th house hides love in spirituality, seclusion, or the subconscious. You may have secret or spiritual attractions. Your deepest love lessons come through retreat and inner work.`,
  }
  return contexts[house] || `Venus in the ${getOrdinal(house)} house brings unique love qualities through this life domain.`
}

function get7thHouseSignContext(sign: string): string {
  const contexts: Record<string, string> = {
    Aries:
      "Your 7th house in Aries means you attract dynamic, independent, direct partners. You seek someone with initiative and courage.",
    Taurus:
      "Your 7th house in Taurus seeks stable, loyal, sensual partnerships. You attract devoted partners who value security.",
    Gemini:
      "Your 7th house in Gemini seeks mental connection, communication, variety. You attract witty, communicative partners.",
    Cancer:
      "Your 7th house in Cancer prioritizes emotional security and family values. You attract nurturing, protective partners.",
    Leo:
      "Your 7th house in Leo seeks partnerships of pride, loyalty, and drama. You attract generous, confident partners.",
    Virgo:
      "Your 7th house in Virgo seeks practical, service-oriented partnerships. You attract detail-focused, helpful partners.",
    Libra:
      "Your 7th house in Libra is the classic romance position. You attract aesthetically refined, diplomatic partners.",
    Scorpio:
      "Your 7th house in Scorpio attracts intense, transformative, mysterious partnerships. You seek depth and power dynamics.",
    Sagittarius:
      "Your 7th house in Sagittarius attracts expansive, philosophical, freedom-loving partners. You seek growth together.",
    Capricorn:
      "Your 7th house in Capricorn attracts responsible, ambitious, committed partners. You seek long-term, structured partnerships.",
    Aquarius:
      "Your 7th house in Aquarius attracts unconventional, intellectual, independent partners. You need freedom in relationships.",
    Pisces:
      "Your 7th house in Pisces attracts compassionate, spiritual, empathetic partners. You seek soul connection above all.",
  }
  return contexts[sign] || "Your 7th house draws partners with particular qualities."
}

function get7thLordContext(lord: string, sign: string, dignity: string): string {
  const base = `Your 7th lord ${lord} (in ${sign}, ${getDignityDescription(dignity)}) reveals partnership style.`

  const lordContexts: Record<string, string> = {
    Sun: "Sun as 7th lord attracts confident, authoritative partners who command respect. Partnerships often center on mutual growth and shared purpose.",
    Moon:
      "Moon as 7th lord attracts emotional, intuitive, nurturing partners. Partnerships thrive on emotional attunement and care.",
    Mars:
      "Mars as 7th lord attracts passionate, energetic, direct partners. Partnerships are sexually vibrant and dynamic.",
    Mercury:
      "Mercury as 7th lord attracts communicative, intellectual, adaptable partners. Partnerships thrive on conversation and mental engagement.",
    Jupiter:
      "Jupiter as 7th lord attracts generous, philosophical, expansive partners. Partnerships often grow beyond initial expectations.",
    Venus:
      "Venus as 7th lord attracts beautiful, harmonious, affectionate partners. Partnerships are naturally romantic.",
    Saturn:
      "Saturn as 7th lord attracts responsible, committed, serious partners. Partnerships are built on duty and long-term vision.",
    Rahu: "Rahu as 7th lord attracts unconventional, ambitious, sometimes foreign partners. Partnerships involve karmic themes and growth.",
    Ketu: "Ketu as 7th lord attracts spiritual, intuitive, sometimes detached partners. Partnerships have karmic depth and liberation focus.",
  }

  return base + " " + (lordContexts[lord] || "")
}

function get7thPlanetContext(planet: string, sign: string): string {
  const contexts: Record<string, string> = {
    Sun: `${planet} in ${sign} in the 7th brings authoritative, confident energy to partnerships. Your partner may be prominent or successful.`,
    Moon: `${planet} in ${sign} in the 7th brings emotional warmth and nurturing to partnerships. Your partner is emotionally available and caring.`,
    Mars: `${planet} in ${sign} in the 7th brings passionate, sometimes combative energy to partnerships. Expect intensity and sexual chemistry.`,
    Mercury: `${planet} in ${sign} in the 7th brings communication and humor to partnerships. Your partner is verbal and intellectually engaging.`,
    Jupiter: `${planet} in ${sign} in the 7th brings growth and luck to partnerships. Partnerships expand and become fortunate.`,
    Venus: `${planet} in ${sign} in the 7th is the most romantic placement. Your partnership is naturally harmonious and beautiful.`,
    Saturn: `${planet} in ${sign} in the 7th brings seriousness and commitment to partnerships. Growth comes through responsibility and patience.`,
    Rahu: `${planet} in ${sign} in the 7th brings obsession and intensity to partnerships. Your partner may be foreign or unconventional.`,
    Ketu: `${planet} in ${sign} in the 7th brings spiritual depth and past-life connections. Partnerships feel fated and transformative.`,
  }
  return contexts[planet] || `${planet} in ${sign} in the 7th shapes partnership dynamics.`
}

function getSignCoreQualities(sign: string): string {
  const qualities: Record<string, string> = {
    Aries: "courage, directness, initiative, pioneering spirit",
    Taurus: "loyalty, sensuality, stability, steadfastness",
    Gemini: "communication, curiosity, versatility, intellect",
    Cancer: "nurturing, emotional depth, loyalty, protective instincts",
    Leo: "confidence, generosity, loyalty, creative power",
    Virgo: "service, discernment, practicality, loyalty",
    Libra: "harmony, diplomacy, aesthetic sense, balance-seeking",
    Scorpio: "intensity, mystery, loyalty, transformative power",
    Sagittarius: "optimism, philosophy, expansion, honesty",
    Capricorn: "responsibility, ambition, reliability, discipline",
    Aquarius: "independence, idealism, intellectual connection, uniqueness",
    Pisces: "compassion, spirituality, empathy, intuition",
  }
  return qualities[sign] || "unique archetypal qualities"
}

function get7thLordQualityDesc(dignity: string): string {
  const quality: Record<string, string> = {
    exalted: "exceptional—you naturally attract aligned, devoted partners",
    moolatrikona: "very high—partnerships come naturally and feel secure",
    own: "strong and authentic—you attract partners who resonate with your values",
    friendly: "well-supported—partnerships develop smoothly",
    neutral: "balanced—you attract reasonably compatible partners",
    enemy: "challenging but growthful—partnerships require conscious work",
    debilitated: "requiring intentional effort—but remedies transform this",
  }
  return quality[dignity] || "of balanced quality"
}

function isCurrentDashaFavorableForLove(mahadasha: string, antardasha: string): boolean {
  const favorablePlanets = ["Venus", "Jupiter", "Moon"]
  return favorablePlanets.includes(mahadasha) || favorablePlanets.includes(antardasha)
}

function getDashaRelationshipAdvice(mahadasha: string, antardasha: string): string {
  const adviceMap: Record<string, string> = {
    Venus: "highly auspicious period for romance, marriage, and deepening existing relationships",
    Jupiter: "fortunate and expansive period creating opportunities for meeting compatible partners",
    Moon: "emotionally receptive period favorable for emotional deepening and family commitments",
    Mercury: "communicative period ideal for expressing feelings and resolving misunderstandings",
    Sun: "individualistic period—balance personal growth with relationship needs",
    Mars: "passionate but potentially volatile period requiring constructive channeling",
    Saturn: "serious testing period that deepens commitment if navigated with patience",
    Rahu: "unpredictable period with sudden opportunities or confusion—trust intuition",
    Ketu: "spiritually introspective period favoring inner work and karmic understanding",
  }

  return adviceMap[mahadasha] || "unique period with specific opportunities for relationship growth"
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
