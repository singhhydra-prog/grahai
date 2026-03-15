/* ════════════════════════════════════════════════════════
   GrahAI — Dasha Deep Dive Report Generator

   Generates a comprehensive Dasha analysis entirely from
   calculation data — NO AI API calls required.

   Analyzes: Current Mahadasha & Antardasha, planetary themes,
   dasha timeline, transitions, life phase analysis, and 5-10
   year roadmap based on Vimshottari Dasha system.
   ════════════════════════════════════════════════════════ */

import type { ReportData } from '../kundli-report-generator'
import {
  GeneratedReport, ReportSection, ReportRemedy,
  PLANET_MANTRAS, PLANET_GEMSTONES, DIGNITY_LABELS, HOUSE_LIFE_AREAS
} from './types'

// ─── Dasha Deep Dive Generator ────────────────────────────

/**
 * Generate a comprehensive Dasha Deep Dive report from natal chart data.
 * Analyzes current dasha periods, themes, transitions, and 5-10 year roadmap.
 */
export function generateDashaReport(data: ReportData): GeneratedReport {
  const sections: ReportSection[] = []
  const remedies: ReportRemedy[] = []

  // Section 1: Current Dasha Period Overview
  sections.push(buildCurrentDashaOverview(data))

  // Section 2: Current Life Themes & Focus
  sections.push(buildLifeThemesAndFocus(data))

  // Section 3: Sub-Period Analysis (Antardasha)
  sections.push(buildAntardashaAnalysis(data))

  // Section 4: Upcoming Dasha Transitions
  sections.push(buildUpcomingTransitions(data))

  // Section 5: Life Phase Analysis & Spiritual Growth
  sections.push(buildLifePhaseAnalysis(data))

  // Section 6: 5-10 Year Dasha Roadmap
  sections.push(buildDashaRoadmap(data))

  // Build remedies for dasha enhancement
  buildDashaRemedies(data, remedies)

  // Build summary
  const summary = generateDashaSummary(data)

  return {
    summary,
    sections,
    remedies,
  }
}

// ─── Section 1: Current Dasha Period Overview ─────────────

function buildCurrentDashaOverview(data: ReportData): ReportSection {
  const currentMD = data.dashaAnalysis.currentMahadasha
  const mdPlanet = data.natalChart.planets.find(p => p.name === currentMD.planet)
  const house = mdPlanet?.house || 0
  const sign = mdPlanet?.sign?.name || 'Unknown'
  const dignity = mdPlanet?.dignity || 'neutral'

  let content = ''

  content += `**You Are Running ${currentMD.planet} Mahadasha**\n\n`

  // Planetary placement
  content += `**Current Placement & Signification**\n\n`
  content += `${currentMD.planet} (${currentMD.sanskrit}) is the ruling planet of your current Mahadasha. `
  content += `In your natal chart, ${currentMD.planet} is positioned in ${sign} in the ${getOrdinal(house)} house, `
  content += `${DIGNITY_LABELS[dignity]}. `

  // Core significations of the planet
  const planetThemes = getDashaThemes(currentMD.planet)
  content += `\n${planetThemes.overview}\n\n`

  // House significance
  const houseArea = HOUSE_LIFE_AREAS[house] || 'various life areas'
  content += `**House Influence**\n\n`
  content += `Because ${currentMD.planet} is in the ${getOrdinal(house)} house, this Mahadasha emphasizes `
  content += `${houseArea}. The ${getOrdinal(house)} house themes blend with ${currentMD.planet}'s natural significations `
  content += `to create the focus of this period.\n\n`

  // Duration and timing
  const startDate = new Date(currentMD.startDate)
  const endDate = new Date(currentMD.endDate)
  const today = new Date()
  const remainingDays = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  const remainingYears = Math.floor(remainingDays / 365)
  const remainingMonths = Math.floor((remainingDays % 365) / 30)

  content += `**Duration & Timeline**\n\n`
  content += `This Mahadasha commenced on ${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} `
  content += `and will conclude on ${endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. `
  content += `Total duration: ${currentMD.durationYears} years.\n\n`
  content += `**Remaining Period: ${remainingYears} year${remainingYears !== 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}**\n\n`

  // Character themes
  content += `**Core Character & Life Themes**\n\n`
  content += `${planetThemes.themes}\n\n`

  // Dignity interpretation
  content += `**Strength of the Period**\n\n`
  if (dignity === 'exalted' || dignity === 'moolatrikona') {
    content += `Your ${currentMD.planet} is ${DIGNITY_LABELS[dignity]}, making this a powerfully positive dasha period. `
    content += `The natural strengths of ${currentMD.planet} are magnified, supporting success, clarity, and purposeful action. `
    content += `This is an auspicious time to pursue the planet's themes actively.`
  } else if (dignity === 'own' || dignity === 'friendly') {
    content += `Your ${currentMD.planet} is ${DIGNITY_LABELS[dignity]}, creating a harmonious and supportive dasha period. `
    content += `You can work effectively with ${currentMD.planet}'s energies to make meaningful progress in this phase.`
  } else if (dignity === 'debilitated') {
    content += `Your ${currentMD.planet} is ${DIGNITY_LABELS[dignity]}, creating a challenging dasha period. `
    content += `Success requires conscious effort, discipline, and deeper inner work. This period teaches important karmic lessons `
    content += `through the planet's shadow aspects.`
  } else {
    content += `Your ${currentMD.planet} is ${DIGNITY_LABELS[dignity]}, creating a mixed dasha period. `
    content += `Progress depends on how consciously you work with the planet's energies.`
  }

  return {
    title: 'Current Dasha Period Overview',
    content,
    highlights: [
      `Planet: ${currentMD.planet} (${currentMD.sanskrit})`,
      `Placement: ${sign} in ${getOrdinal(house)} house`,
      `Remaining: ${remainingYears}y ${remainingMonths}m`,
      `Dignity: ${DIGNITY_LABELS[dignity]}`,
    ]
  }
}

// ─── Section 2: Current Life Themes & Focus ──────────────

function buildLifeThemesAndFocus(data: ReportData): ReportSection {
  const currentMD = data.dashaAnalysis.currentMahadasha
  const currentAD = data.dashaAnalysis.currentAntardasha
  const mdPlanet = data.natalChart.planets.find(p => p.name === currentMD.planet)
  const adPlanet = data.natalChart.planets.find(p => p.name === currentAD.planet)

  const mdHouse = mdPlanet?.house || 1
  const adHouse = adPlanet?.house || 1

  let content = ''

  content += `**Mahadasha Focus: ${HOUSE_LIFE_AREAS[mdHouse]}**\n\n`
  content += `Your ${currentMD.planet} Mahadasha activates the ${getOrdinal(mdHouse)} house—the sphere of `
  content += `${HOUSE_LIFE_AREAS[mdHouse]}. This is where the primary focus of your current life phase lies. `
  content += `Major events, growth, and learning tend to concentrate in this domain.\n\n`

  // House-specific themes
  const houseThemes = getHouseThemes(mdHouse, currentMD.planet)
  content += `${houseThemes}\n\n`

  // Antardasha modification
  content += `**Antardasha Modification: ${currentAD.planet} Tinting**\n\n`
  content += `Within the broader ${currentMD.planet} Mahadasha, you are currently running ${currentAD.planet} Antardasha, `
  content += `which modifies and refines the expression. ${currentAD.planet} in the ${getOrdinal(adHouse)} house brings `
  content += `${HOUSE_LIFE_AREAS[adHouse]} into the spotlight—a secondary focus layered atop the Mahadasha themes.\n\n`

  // Relationship between the two
  const antardashaPlanet = data.natalChart.planets.find(p => p.name === currentAD.planet)
  const relationship = getPlanetRelationship(currentMD.planet, currentAD.planet, data.natalChart)
  content += `**Mahadasha-Antardasha Relationship**\n\n`
  content += `${relationship}\n\n`

  // Key life areas now
  content += `**Immediate Focus Areas (Next 6-12 Months)**\n\n`
  const adEndDate = new Date(currentAD.endDate)
  const adRemainingDays = Math.max(0, Math.floor((adEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  const adRemainingMonths = Math.ceil(adRemainingDays / 30)

  content += `Your ${currentAD.planet} Antardasha continues for approximately ${adRemainingMonths} month${adRemainingMonths !== 1 ? 's' : ''}. `
  content += `Focus your energy on:\n\n`

  const focusAreas = getAntardashaFocus(currentMD.planet, currentAD.planet)
  focusAreas.forEach(area => {
    content += `• ${area}\n`
  })

  content += `\nThis is a natural window for action, learning, and development in these specific areas.`

  return {
    title: 'Current Life Themes & Focus',
    content,
    highlights: [
      `Mahadasha House: ${getOrdinal(mdHouse)} (${HOUSE_LIFE_AREAS[mdHouse]})`,
      `Antardasha Planet: ${currentAD.planet}`,
      `Antardasha Duration Remaining: ~${adRemainingMonths} months`,
    ]
  }
}

// ─── Section 3: Sub-Period Analysis (Antardasha) ─────────

function buildAntardashaAnalysis(data: ReportData): ReportSection {
  const currentMD = data.dashaAnalysis.currentMahadasha
  const currentAD = data.dashaAnalysis.currentAntardasha
  const currentPD = data.dashaAnalysis.currentPratyantar

  let content = ''

  content += `**Current Antardasha: ${currentAD.planet} in ${currentMD.planet}**\n\n`

  // Basic info
  const adStartDate = new Date(currentAD.startDate)
  const adEndDate = new Date(currentAD.endDate)
  const adDurationMonths = Math.round((adEndDate.getTime() - adStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const adElapsedDays = Math.floor((new Date().getTime() - adStartDate.getTime()) / (1000 * 60 * 60 * 24))
  const adElapsedMonths = Math.floor(adElapsedDays / 30)
  const adRemainingMonths = adDurationMonths - adElapsedMonths

  content += `${currentAD.planet} Antardasha began on ${adStartDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} `
  content += `and will end on ${adEndDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}. `
  content += `Total duration: ${adDurationMonths} months (~${(adDurationMonths / 12).toFixed(1)} years).\n\n`

  content += `**Progress: ${adElapsedMonths} month${adElapsedMonths !== 1 ? 's' : ''} elapsed, ${adRemainingMonths} month${adRemainingMonths !== 1 ? 's' : ''} remaining**\n\n`

  // The planet's nature in this sub-period
  const adThemes = getDashaThemes(currentAD.planet)
  content += `**${currentAD.planet}'s Role as Sub-Lord**\n\n`
  content += `${currentAD.planet} acts as the sub-lord (Antardasha lord) within ${currentMD.planet}'s overall rulership. `
  content += `It refines and channels the Mahadasha energy. ${adThemes.subDescription}\n\n`

  // Relationship to Mahadasha lord
  const mdPlanet = data.natalChart.planets.find(p => p.name === currentMD.planet)
  const adPlanet = data.natalChart.planets.find(p => p.name === currentAD.planet)

  if (mdPlanet && adPlanet) {
    content += `**Antardasha Planet's Placement**\n\n`
    const adDignity = DIGNITY_LABELS[adPlanet.dignity] || adPlanet.dignity
    const adHouse = HOUSE_LIFE_AREAS[adPlanet.house] || 'various life areas'
    content += `${currentAD.planet} is positioned in ${adPlanet.sign.name} in the ${getOrdinal(adPlanet.house)} house (${adDignity}), `
    content += `bringing focus to ${adHouse}. This placement colors how the Antardasha manifests.\n\n`
  }

  // Specific current focus
  content += `**Specific Antardasha Impact**\n\n`
  const antardashaImpact = getAntardashaImpact(currentMD.planet, currentAD.planet, data)
  content += `${antardashaImpact}\n\n`

  // Pratyantardasha context
  content += `**Micro-Periods: Pratyantardasha Influence**\n\n`
  content += `Within the Antardasha, even smaller Pratyantardasha (micro-period) cycles shift every 2-3 months. `
  content += `You are currently under ${currentPD.planet} Pratyantardasha. These brief cycles add fine-tuning to daily experiences `
  content += `while the larger Antardasha theme prevails over months.`

  return {
    title: 'Sub-Period Analysis (Antardasha)',
    content,
    highlights: [
      `Antardasha Planet: ${currentAD.planet}`,
      `Duration: ${adDurationMonths} months`,
      `Progress: ${adElapsedMonths} of ${adDurationMonths} months`,
      `Next Transition: ${adEndDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`,
    ]
  }
}

// ─── Section 4: Upcoming Dasha Transitions ────────────────

function buildUpcomingTransitions(data: ReportData): ReportSection {
  let content = ''

  const currentAD = data.dashaAnalysis.currentAntardasha
  const currentMD = data.dashaAnalysis.currentMahadasha

  content += `**Upcoming Antardasha Changes (Next 12-24 Months)**\n\n`

  // Find next antardasha changes within 2 years
  const today = new Date()
  const twoYearsOut = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate())

  const upcomingAntardashas = data.dashaTimeline
    .filter(d => {
      const startDate = new Date(d.startDate)
      return startDate > today && startDate <= twoYearsOut && d.mahadasha === currentMD.planet
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5)

  if (upcomingAntardashas.length > 0) {
    upcomingAntardashas.forEach((dasha, idx) => {
      const startDate = new Date(dasha.startDate)
      const endDate = new Date(dasha.endDate)
      const monthsFromNow = Math.round((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))

      content += `**${idx + 1}. ${dasha.antardasha} Antardasha** (in ~${monthsFromNow} month${monthsFromNow !== 1 ? 's' : ''})\n\n`
      content += `Begins: ${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`
      content += `Ends: ${endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`
      content += `Duration: ${dasha.durationMonths} months (~${(dasha.durationMonths / 12).toFixed(1)} years)\n\n`

      const transitionThemes = getTransitionThemes(currentMD.planet, dasha.antardasha)
      content += `${transitionThemes}\n\n`
    })
  } else {
    content += `You are near the end of your ${currentMD.planet} Mahadasha. Major Antardasha transitions within the next 2 years `
    content += `are limited; check the upcoming Mahadasha change below.`
  }

  content += `\n**Next Mahadasha Change**\n\n`

  // Find the next Mahadasha
  const currentMDEndDate = new Date(currentMD.endDate)
  const nextMahaDasha = data.dashaAnalysis.mahadashas.find(md => {
    const startDate = new Date(md.startDate)
    return startDate >= currentMDEndDate && startDate > today
  })

  if (nextMahaDasha) {
    const nextMDStartDate = new Date(nextMahaDasha.startDate)
    const monthsUntilChange = Math.round((nextMDStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const yearMonths = `${Math.floor(monthsUntilChange / 12)} year${Math.floor(monthsUntilChange / 12) !== 1 ? 's' : ''} and ${monthsUntilChange % 12} month${(monthsUntilChange % 12) !== 1 ? 's' : ''}`

    content += `**${nextMahaDasha.planet} Mahadasha** begins in approximately ${yearMonths}.\n\n`
    content += `Transition Date: ${nextMDStartDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`
    content += `Duration: ${nextMahaDasha.durationYears} years\n\n`

    const nextMDThemes = getDashaThemes(nextMahaDasha.planet)
    content += `**Nature of the Coming Period**\n\n`
    content += `${nextMahaDasha.planet} Mahadasha will shift focus from ${currentMD.planet}'s themes toward `
    content += `${nextMDThemes.overview}\n\n`

    content += `This transition marks a significant pivot point in your life trajectory. The 6-12 months before the change `
    content += `are natural completion periods for ${currentMD.planet} Mahadasha matters.`
  }

  return {
    title: 'Upcoming Dasha Transitions',
    content,
    highlights: [
      upcomingAntardashas.length > 0 ? `Next Antardasha: ${upcomingAntardashas[0].antardasha}` : 'Approaching Mahadasha change',
      nextMahaDasha ? `Coming Mahadasha: ${nextMahaDasha.planet}` : 'Within 3-5 years',
    ]
  }
}

// ─── Section 5: Life Phase Analysis & Spiritual Growth ────

function buildLifePhaseAnalysis(data: ReportData): ReportSection {
  const currentMD = data.dashaAnalysis.currentMahadasha

  let content = ''

  content += `**Karmic Phase: ${getLifePhaseTitle(currentMD.planet)}**\n\n`

  const lifecycleAnalysis = getLifecycleAnalysis(currentMD.planet)
  content += `${lifecycleAnalysis.introduction}\n\n`

  content += `**Karmic Lessons & Growth Themes**\n\n`
  content += `${lifecycleAnalysis.lessons}\n\n`

  content += `**Spiritual Development**\n\n`
  content += `${lifecycleAnalysis.spiritual}\n\n`

  // Planet-specific shadow and light
  content += `**The Shadow & Light of This Period**\n\n`
  const shadowLight = getShadowLight(currentMD.planet)
  content += `${shadowLight}\n\n`

  // Integration into larger cycles
  const currentBalance = data.dashaAnalysis.balanceAtBirth
  const yearsPassed = currentMD.durationYears * (1 - (currentBalance / 120))
  const totalYears = 120

  content += `**Progress in the 120-Year Cycle**\n\n`
  content += `You are ${Math.round((yearsPassed / totalYears) * 100)}% through your complete Vimshottari Dasha cycle. `
  content += `This puts you in the middle chapters of your incarnational story. The lessons you learn now contribute to the `
  content += `larger karmic unfoldment of your life.`

  return {
    title: 'Life Phase Analysis & Spiritual Growth',
    content,
    highlights: [
      `Phase: ${getLifePhaseTitle(currentMD.planet)}`,
      `Core Lesson: ${lifecycleAnalysis.lesson}`,
      `Spiritual Focus: ${lifecycleAnalysis.spiritualKeyword}`,
    ]
  }
}

// ─── Section 6: 5-10 Year Dasha Roadmap ──────────────────

function buildDashaRoadmap(data: ReportData): ReportSection {
  let content = ''

  content += `**Your Dasha Timeline: Next 5-10 Years**\n\n`
  content += `This roadmap shows how major Dasha periods will unfold, helping you plan, prepare, and align with natural cycles.\n\n`

  const today = new Date()
  const tenYearsOut = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate())

  // Group timeline by Mahadasha
  const timelineGroups: Record<string, typeof data.dashaTimeline> = {}
  for (const entry of data.dashaTimeline) {
    if (new Date(entry.startDate) >= today && new Date(entry.startDate) <= tenYearsOut) {
      if (!timelineGroups[entry.mahadasha]) {
        timelineGroups[entry.mahadasha] = []
      }
      timelineGroups[entry.mahadasha].push(entry)
    }
  }

  const currentMD = data.dashaAnalysis.currentMahadasha

  // Show current Mahadasha completion
  content += `**${currentMD.planet} Mahadasha (Current Phase)**\n\n`
  const currentMDRemaining = Math.round((new Date(currentMD.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365))
  const currentMDRemainMonths = Math.round((new Date(currentMD.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
  content += `Concludes: ${new Date(currentMD.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`
  content += ` (~${currentMDRemainMonths} months remaining)\n\n`
  content += `Your current Mahadasha period is in its final phase. Use this time to complete ${currentMD.planet} lessons, `
  content += `resolve pending matters in relevant life areas, and prepare for the transition ahead.\n\n`

  // Upcoming Mahadashas
  const upcomingMDs = data.dashaAnalysis.mahadashas
    .filter(md => new Date(md.startDate) >= today && new Date(md.startDate) <= tenYearsOut && md.planet !== currentMD.planet)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3)

  if (upcomingMDs.length > 0) {
    content += `**Coming Mahadashas**\n\n`

    upcomingMDs.forEach((md, idx) => {
      const startDate = new Date(md.startDate)
      const endDate = new Date(md.endDate)
      const monthsFromNow = Math.round((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
      const yearMonths = `${Math.floor(monthsFromNow / 12)}y ${monthsFromNow % 12}m`

      content += `**${idx + 1}. ${md.planet} Mahadasha** (in ~${yearMonths})\n\n`
      content += `Period: ${startDate.getFullYear()} – ${endDate.getFullYear()} | Duration: ${md.durationYears} years\n\n`

      const mdThemes = getDashaThemes(md.planet)
      content += `**Focus Areas**: ${mdThemes.shortSummary}\n\n`

      const antardashesInMD = (timelineGroups[md.planet] || [])
        .map(t => t.antardasha)
        .filter((v, i, a) => a.indexOf(v) === i)
      if (antardashesInMD.length > 0) {
        content += `**Sub-periods**: ${antardashesInMD.slice(0, 4).join(', ')}${antardashesInMD.length > 4 ? ', ...' : ''}\n\n`
      }
    })
  }

  // Summary and navigation tips
  content += `\n**How to Navigate This Roadmap**\n\n`
  content += `1. **Align Major Decisions**: Schedule important life events (career moves, relationships, investments) during favorable dasha periods.\n`
  content += `2. **Prepare for Transitions**: The 2-3 months before a dasha shift are completion windows; wrap up loose ends.\n`
  content += `3. **Activate Current Themes**: Dive deeply into ${currentMD.planet} Mahadasha work while it lasts; the window won't reopen for decades.\n`
  content += `4. **Plan Ahead**: Use dasha timing to structure 5-10 year goals that align with planetary cycles.\n`
  content += `5. **Seek Remedies**: Strengthen challenging dasha lords through mantras, gems, and rituals during their periods.\n\n`

  content += `Your dasha timeline is a celestial map. The more you align your choices with these cycles, the more effortlessly `
  content += `you flow with your destiny.`

  return {
    title: '5-10 Year Dasha Roadmap',
    content,
    highlights: [
      `Current Phase Ends: ${new Date(currentMD.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`,
      upcomingMDs.length > 0 ? `Next Mahadasha: ${upcomingMDs[0].planet}` : 'Check transitions above',
      `Planning Horizon: 10 years`,
    ]
  }
}

// ──── Helper: Build Dasha Remedies ──────────────────────

function buildDashaRemedies(data: ReportData, remedies: ReportRemedy[]): void {
  const currentMD = data.dashaAnalysis.currentMahadasha
  const currentAD = data.dashaAnalysis.currentAntardasha
  const mdPlanet = data.natalChart.planets.find(p => p.name === currentMD.planet)
  const adPlanet = data.natalChart.planets.find(p => p.name === currentAD.planet)

  // Remedy for Mahadasha lord if weak
  if (mdPlanet && !['exalted', 'moolatrikona', 'own'].includes(mdPlanet.dignity)) {
    const mantra = PLANET_MANTRAS[currentMD.planet] || { mantra: 'Vedic mantra', count: '108 times', day: 'respective day' }
    const gem = PLANET_GEMSTONES[currentMD.planet] || { gem: 'appropriate gemstone', metal: 'appropriate metal', finger: 'ring finger' }

    remedies.push({
      type: `${currentMD.planet} (Mahadasha Lord) Strengthening`,
      description: `To harmonize with the current ${currentMD.planet} Mahadasha period, recite ${mantra.mantra} `
        + `${mantra.count} on ${mantra.day}. Wear ${gem.gem} in ${gem.finger}. `
        + `This strengthens the Mahadasha lord and smooths the transition.`,
    })
  }

  // Remedy for Antardasha lord if weak
  if (adPlanet && !['exalted', 'moolatrikona', 'own'].includes(adPlanet.dignity)) {
    const mantra = PLANET_MANTRAS[currentAD.planet] || { mantra: 'Vedic mantra', count: '108 times', day: 'respective day' }
    const gem = PLANET_GEMSTONES[currentAD.planet] || { gem: 'appropriate gemstone', metal: 'appropriate metal', finger: 'ring finger' }

    remedies.push({
      type: `${currentAD.planet} (Antardasha Lord) Support`,
      description: `To activate the current ${currentAD.planet} Antardasha themes, recite ${mantra.mantra} `
        + `${mantra.count} on ${mantra.day}. Wear ${gem.gem} in ${gem.finger}. `
        + `This enhances the sub-period's positive manifestations.`,
    })
  }

  // General dasha ritual
  remedies.push({
    type: 'Dasha Transition Ritual',
    description: `Perform Navagraha Homa (worship of all nine planets) during dasha transitions to smooth the shift. `
      + `Meditate on your current Mahadasha lord's qualities to deepen understanding and absorption of this phase's lessons.`,
  })

  // Dasha-specific mantra
  if (PLANET_MANTRAS[currentMD.planet]) {
    remedies.push({
      type: 'Daily Dasha Mantra',
      description: `Recite the mantra of your Mahadasha lord daily: "${PLANET_MANTRAS[currentMD.planet].mantra}" `
        + `(${PLANET_MANTRAS[currentMD.planet].count}). This attunes your consciousness to the Dasha cycle and invokes the planet's blessing.`,
    })
  }
}

// ─── Summary ──────────────────────────────────────────────

function generateDashaSummary(data: ReportData): string {
  const currentMD = data.dashaAnalysis.currentMahadasha
  const mdPlanet = data.natalChart.planets.find(p => p.name === currentMD.planet)
  const house = mdPlanet?.house || 1
  const houseArea = HOUSE_LIFE_AREAS[house] || 'various life areas'

  let summary = `You are currently navigating the ${currentMD.planet} Mahadasha, `
  summary += `a ${currentMD.durationYears}-year cycle emphasizing ${houseArea}. `
  summary += `This is a significant period for growth, learning, and karmic unfoldment in the themes governed by ${currentMD.planet}. `

  if (mdPlanet && ['exalted', 'moolatrikona', 'own'].includes(mdPlanet.dignity)) {
    summary += `Your ${currentMD.planet} is well-placed, making this a naturally supportive period where your effort aligns with cosmic timing. `
  } else if (mdPlanet && ['debilitated'].includes(mdPlanet.dignity)) {
    summary += `While your ${currentMD.planet} is challenged, this dasha teaches resilience and deeper understanding of the planet's shadow aspects. `
  } else {
    summary += `Your ${currentMD.planet} offers a balanced mix of opportunity and challenge, requiring conscious engagement. `
  }

  summary += `By understanding the specific themes, timing, and transitions outlined in this report, you can align your major decisions with `
  summary += `natural cosmic cycles and accelerate your spiritual and material evolution. The Dasha system reveals the invisible architecture `
  summary += `of your destiny—work with it consciously, and you will flow effortlessly toward your highest potential.`

  return summary
}

// ──── Data & Helpers ────────────────────────────────────

/**
 * Get core themes and significations for each planet in dasha.
 */
function getDashaThemes(planet: string): {
  overview: string
  themes: string
  shortSummary: string
  subDescription: string
} {
  const themes: Record<string, any> = {
    Sun: {
      overview: "Sun Dasha brings themes of leadership, authority, confidence, and self-expression. The focus turns to your personal power, health (especially heart), and public recognition.",
      themes: "Sun rules ego, will, vitality, and authority. During this period, you naturally step into leadership roles, seek visibility and recognition, and work on cultivating confidence and inner power. Health matters, especially cardiovascular, come into focus. Your father's influence or father-figures become significant.",
      shortSummary: "Leadership, confidence, health (heart), authority, public recognition, father figures",
      subDescription: "As the sub-lord, Sun amplifies leadership and visibility themes within the broader Mahadasha. It brings moments of clarity, confidence surges, and opportunities to shine publicly."
    },
    Moon: {
      overview: "Moon Dasha brings themes of emotions, mind, mother, public life, and emotional nurturing. The focus turns to relationships, travel, and the realm of feelings.",
      themes: "Moon rules mind, emotions, mother, and the public realm. During this period, emotional sensitivity heightens; family, mother, and home matters become central. Travel increases. Your relationship with the public strengthens. Mental clarity and peace are important goals.",
      shortSummary: "Emotions, mind, mother, home, travel, public life, nurturing",
      subDescription: "As the sub-lord, Moon brings emotional depth and intuitive clarity within the broader Mahadasha. It adds sensitivity, care, and connection to people and places."
    },
    Mars: {
      overview: "Mars Dasha brings themes of energy, courage, action, and enterprise. The focus turns to initiative, conflict resolution, property, and courage-requiring situations.",
      themes: "Mars rules energy, will, courage, action, and property. During this period, your drive and ambition intensify. You naturally take bold action, assert yourself, and engage in competitive situations. Siblings, property matters, and surgical health issues may arise. Courage to overcome obstacles is key.",
      shortSummary: "Energy, courage, action, enterprise, property, competitive drive, siblings",
      subDescription: "As the sub-lord, Mars accelerates action and brings dynamism within the broader Mahadasha. It catalyzes movement, assertion, and courageous decisions."
    },
    Mercury: {
      overview: "Mercury Dasha brings themes of intelligence, business, communication, and learning. The focus turns to intellectual pursuits, trade, writing, and mental acuity.",
      themes: "Mercury rules intelligence, commerce, communication, and learning. During this period, your intellect sharpens, business and trading opportunities arise. Writing, speaking, and all communication flourish. Skin health and nervous system issues may surface. Curiosity and learning drive your growth.",
      shortSummary: "Intelligence, business, communication, learning, trade, writing, analysis",
      subDescription: "As the sub-lord, Mercury brings intellectual sharpness and communicative flow within the broader Mahadasha. It enhances clarity, negotiation, and detail-oriented work."
    },
    Jupiter: {
      overview: "Jupiter Dasha brings themes of wisdom, expansion, wealth, and dharma. The focus turns to teaching, children, fortune, and higher learning.",
      themes: "Jupiter rules wisdom, expansion, children, wealth, and dharma (righteousness). During this period, expansion and growth are natural. Teaching and mentoring emerge as paths. Children and their welfare become significant. Financial growth occurs through ethical means. Spiritual understanding deepens.",
      shortSummary: "Wisdom, expansion, wealth, children, teaching, dharma, fortune",
      subDescription: "As the sub-lord, Jupiter brings expansion, optimism, and good fortune within the broader Mahadasha. It magnifies opportunities and brings blessings in connected areas."
    },
    Venus: {
      overview: "Venus Dasha brings themes of love, marriage, luxury, creativity, and pleasure. The focus turns to relationships, arts, comfort, and sensual experience.",
      themes: "Venus rules love, marriage, beauty, luxury, and arts. During this period, romantic and relationship matters come alive. Creative and artistic pursuits flourish. Luxury, comfort, and sensual pleasures are emphasized. Vehicles and fine things may manifest. The opposite sex becomes significant.",
      shortSummary: "Love, marriage, arts, luxury, beauty, creativity, relationships",
      subDescription: "As the sub-lord, Venus brings grace, attraction, and harmony within the broader Mahadasha. It softens situations, enhances relationships, and brings creative flow."
    },
    Saturn: {
      overview: "Saturn Dasha brings themes of discipline, structure, responsibility, and karma. The focus turns to hard work, delays, maturation, and enduring building.",
      themes: "Saturn rules discipline, responsibility, time, and karma. During this period, serious work and responsibility increase. Delays and obstacles teach patience; success comes through persistent effort. Chronic health issues may emerge, demanding long-term management. This period matures you spiritually and practically.",
      shortSummary: "Discipline, hard work, responsibility, delays, karma, structure, maturation",
      subDescription: "As the sub-lord, Saturn brings gravity, discipline, and realistic assessment within the broader Mahadasha. It slows things down for careful, lasting building."
    },
    Rahu: {
      overview: "Rahu Dasha brings themes of obsession, innovation, foreign interests, and desires. The focus turns to unconventional paths, sudden rises, and karmic desires.",
      themes: "Rahu rules obsession, innovation, foreign interests, and material desires. During this period, unconventional opportunities arise. Foreign lands, technology, and innovation become significant. Sudden rises and falls are possible. Ambitions become consuming. Spiritual seekers often experience profound inner transformations.",
      shortSummary: "Innovation, foreign interests, obsession, unconventional paths, sudden rises",
      subDescription: "As the sub-lord, Rahu brings obsessive intensity and breakthrough potential within the broader Mahadasha. It disrupts conventional patterns and opens new frontiers."
    },
    Ketu: {
      overview: "Ketu Dasha brings themes of detachment, spirituality, liberation, and past-life karma. The focus turns to letting go, mystical experiences, and karmic completion.",
      themes: "Ketu rules detachment, spirituality, and past-life karma. During this period, detachment from material concerns increases naturally. Spiritual seeking and mystical experiences deepen. Losses and sacrifices often lead to spiritual gains. You release what no longer serves, creating space for transformation. Isolation may accompany deep inner work.",
      shortSummary: "Detachment, spirituality, liberation, past karma, mysticism, letting go",
      subDescription: "As the sub-lord, Ketu brings mystical depth and spiritual clarity within the broader Mahadasha. It moves you inward and opens portals to subtle dimensions."
    },
  }

  return themes[planet] || {
    overview: `${planet} Dasha brings its characteristic themes.`,
    themes: `${planet} rules its natural significations. This period emphasizes these areas.`,
    shortSummary: `${planet} themes`,
    subDescription: `As the sub-lord, ${planet} refines the broader themes with its qualities.`
  }
}

/**
 * Get house-specific themes based on house number and dasha planet.
 */
function getHouseThemes(house: number, planet: string): string {
  const baseArea = HOUSE_LIFE_AREAS[house]
  const planetTheme = getDashaThemes(planet).shortSummary

  const themes: Record<number, string> = {
    1: `Your identity, physical body, and overall life direction come alive. Personal growth and self-discovery are paramount. This is a time to embody ${planet}'s qualities at the core level.`,
    2: `Wealth, family relationships, and resources become the arena for ${planet}'s expression. Financial gains or management of resources dominate. Family dynamics shift.`,
    3: `Communication, courage, and short travels activate. Siblings and neighbors become significant. Your voice and self-expression strengthen. Intellectual pursuits flourish.`,
    4: `Home, mother, emotional peace, and property come into focus. Domestic life transforms. Real estate, vehicles, and inner happiness are worked with. Family roots matter greatly.`,
    5: `Children, creativity, romance, and learning shine brightly. Speculative gains are possible. Romantic encounters and creative projects flourish. Intellectual development accelerates.`,
    6: `Health challenges and daily work routines occupy attention. Service, enemies, and debts become arenas for growth. Physical health requires care. This period teaches resilience.`,
    7: `Marriage, partnerships, and public dealings transform. The opposite gender becomes very significant. Business partnerships activate. Your public image and relationships shift.`,
    8: `Sudden changes, transformation, inheritance, and hidden matters emerge. Longevity concerns may surface. Occult and mystical interests deepen. Sexual energy and power dynamics transform.`,
    9: `Spirituality, higher learning, and father-figures become central. Travel to distant places is likely. Fortune and luck increase. Spiritual practices deepen. Teachers appear.`,
    10: `Career, profession, and public reputation explode into focus. Authority and leadership opportunities manifest. Professional growth accelerates. Your vocation transforms.`,
    11: `Gains, income, networks, and fulfillment of desires manifest. Social circles expand. Friendships deepen. Wishes come true. Elder siblings and social standing benefit.`,
    12: `Expenses, losses, and foreign residence become possible. Spiritual seeking and liberation become natural. Isolation and inner work dominate. Hidden enemies and chronic issues surface.`,
  }

  return themes[house] || `This house brings the themes of ${baseArea} into the arena of ${planet}'s expression.`
}

/**
 * Get the relationship between Mahadasha and Antardasha planets.
 */
function getPlanetRelationship(mdPlanet: string, adPlanet: string, chart: any): string {
  if (mdPlanet === adPlanet) {
    return `${mdPlanet} both as Mahadasha and Antardasha lord creates a unified, intensified focus on this planet's themes. The energy is concentrated and unopposed.`
  }

  const naturalFriendships: Record<string, string[]> = {
    Sun: ['Moon', 'Mars', 'Jupiter'],
    Moon: ['Sun', 'Mercury'],
    Mars: ['Sun', 'Moon', 'Jupiter'],
    Mercury: ['Sun', 'Venus'],
    Jupiter: ['Sun', 'Moon', 'Mars'],
    Venus: ['Mercury', 'Saturn'],
    Saturn: ['Mercury', 'Venus'],
    Rahu: [],
    Ketu: [],
  }

  const isFriendly = naturalFriendships[mdPlanet]?.includes(adPlanet) || false
  const isEnemy = naturalFriendships[mdPlanet] && !isFriendly && adPlanet !== mdPlanet

  if (isFriendly) {
    return `${mdPlanet} (Mahadasha) and ${adPlanet} (Antardasha) are natural friends. Their energies flow harmoniously together. ${adPlanet} refines and supports ${mdPlanet}'s expression, creating a smooth, productive sub-period.`
  } else if (isEnemy) {
    return `${mdPlanet} (Mahadasha) and ${adPlanet} (Antardasha) have a neutral or challenging relationship. This creates interesting tensions that accelerate learning and growth. You must consciously balance their different qualities.`
  } else {
    return `${mdPlanet} (Mahadasha) and ${adPlanet} (Antardasha) have a complex interplay. This unique combination brings its own lessons and opportunities for integration.`
  }
}

/**
 * Get focus areas for Antardasha period.
 */
function getAntardashaFocus(mdPlanet: string, adPlanet: string): string[] {
  const mdThemes: Record<string, string[]> = {
    Sun: ['leadership', 'authority roles', 'health optimization', 'father relationships', 'public visibility'],
    Moon: ['emotional healing', 'family bonding', 'travel and movement', 'public engagement', 'maternal relationships'],
    Mars: ['action projects', 'assertiveness', 'property deals', 'competitive situations', 'physical training'],
    Mercury: ['business ventures', 'communication skills', 'intellectual learning', 'trading activities', 'writing projects'],
    Jupiter: ['wisdom pursuit', 'teaching opportunities', 'wealth expansion', "children's welfare", 'spiritual practice'],
    Venus: ['relationship nurturing', 'creative expression', 'luxury experiences', 'artistic pursuits', 'romantic engagement'],
    Saturn: ['responsibility assumption', 'long-term projects', 'discipline building', 'health management', 'career consolidation'],
    Rahu: ['innovation projects', 'foreign ventures', 'unconventional paths', 'technology adoption', 'desire fulfillment'],
    Ketu: ['spiritual practice', 'detachment cultivation', 'mystical study', 'inner reflection', 'karmic completion'],
  }

  return mdThemes[mdPlanet] || ['personal development']
}

/**
 * Get Antardasha-specific impact description.
 */
function getAntardashaImpact(mdPlanet: string, adPlanet: string, data: ReportData): string {
  const mdTheme = getDashaThemes(mdPlanet).shortSummary
  const adTheme = getDashaThemes(adPlanet).shortSummary

  return `${adPlanet} refines the ${mdPlanet} Mahadasha themes (${mdTheme}) by adding ${adTheme}. `
    + `This combination creates a secondary focus layer. Major events and breakthroughs often occur when `
    + `Mahadasha and Antardasha themes overlap or when Antardasha activates new dimensions of the Mahadasha lord's influence.`
}

/**
 * Get transition themes when moving to next Antardasha.
 */
function getTransitionThemes(mdPlanet: string, nextAdPlanet: string): string {
  return `The shift to ${nextAdPlanet} within ${mdPlanet} Mahadasha brings a change in focus and emphasis. `
    + `While ${mdPlanet}'s overall themes continue, ${nextAdPlanet} brings fresh opportunities and challenges. `
    + `This is a natural moment for new initiatives within the same broader life arena.`
}

/**
 * Get life phase title based on planet.
 */
function getLifePhaseTitle(planet: string): string {
  const titles: Record<string, string> = {
    Sun: "Self-Actualization & Personal Power",
    Moon: "Emotional Mastery & Heart Opening",
    Mars: "Will Activation & Courage Building",
    Mercury: "Intellectual Development & Clarity",
    Jupiter: "Wisdom Expansion & Blessing",
    Venus: "Grace & Relationship Refinement",
    Saturn: "Character Forging & Karmic Maturation",
    Rahu: "Breaking Boundaries & Breakthrough",
    Ketu: "Spiritual Deepening & Release",
  }
  return titles[planet] || `${planet} Life Phase`
}

/**
 * Get comprehensive lifecycle analysis.
 */
function getLifecycleAnalysis(planet: string): {
  introduction: string
  lessons: string
  spiritual: string
  lesson: string
  spiritualKeyword: string
} {
  const analyses: Record<string, any> = {
    Sun: {
      introduction: "Sun Dasha is fundamentally about discovering and embodying your authentic power, will, and purpose. It's the hero's journey inward—establishing yourself as the author of your life.",
      lessons: "The central lesson is: your power lies in your will, not in external control. This period teaches you to distinguish between ego (false power) and authentic authority (true power). You learn to lead from your center, take responsibility for your life, and radiate confidence without arrogance. Challenges teach humility alongside self-worth.",
      spiritual: "Spiritually, Sun Dasha invites you to realize your inner light—the immortal self or Atman. Through practices like Sun breathing (Surya Pranayama) or meditation on the heart center, you connect with your innermost essence. This is a time to burn away illusions and clarify your true purpose.",
      lesson: "Authentic power comes from within; lead with clarity and conviction.",
      spiritualKeyword: "Self-realization"
    },
    Moon: {
      introduction: "Moon Dasha is about emotional mastery and heart opening. It's a period of deep feeling, nurturing, and connection to the realm of emotions and the subconscious mind.",
      lessons: "The central lesson is: your feelings are information, not weakness. This period teaches emotional intelligence, the ability to feel deeply without being overwhelmed, and to nurture yourself and others wisely. You learn that security comes from inner peace, not external circumstances. Relationships deepen as you become emotionally available.",
      spiritual: "Spiritually, Moon Dasha invites you to activate the heart chakra (Anahata) and open the pathways of devotion (Bhakti). Through mantra, meditation on the heart, and self-care rituals, you access deeper layers of consciousness. This is a time when intuition and inner knowing flourish.",
      lesson: "Emotional sensitivity is a gift; cultivate inner peace and nurture connection.",
      spiritualKeyword: "Heart opening"
    },
    Mars: {
      introduction: "Mars Dasha is about will activation, courage cultivation, and dynamic action. It's a period where you develop your warrior spirit and learn to assert yourself effectively.",
      lessons: "The central lesson is: your power lies in courageous, directed action. This period teaches you to overcome fear, assert boundaries, and take bold steps toward your goals. You learn the difference between aggression (destructive) and assertion (creative). Challenges teach you resilience and inner courage.",
      spiritual: "Spiritually, Mars Dasha invites you to activate your manipura (solar plexus) and tap into your warrior consciousness. Through practices like dynamic pranayama, martial arts, or fire rituals, you cultivate inner fire. This is a time to burn away passivity and fear.",
      lesson: "Courage is acting in alignment with your truth despite fear.",
      spiritualKeyword: "Will activation"
    },
    Mercury: {
      introduction: "Mercury Dasha is about intellectual development, clear communication, and mental mastery. It's a period where learning accelerates and your thinking becomes sharper.",
      lessons: "The central lesson is: clarity and communication are gateways to success. This period teaches you to think clearly, speak truthfully, and listen deeply. You learn that knowledge without application is empty, and application without knowledge is blind. Challenges teach you discernment.",
      spiritual: "Spiritually, Mercury Dasha invites you to activate the vishuddhi (throat chakra) and open the channels of clear seeing. Through mantra, study of scriptures, and contemplative practices, you access deeper intelligence. This is a time when intuitive knowing becomes articulate.",
      lesson: "Clear thinking and honest communication create harmony and success.",
      spiritualKeyword: "Mental clarity"
    },
    Jupiter: {
      introduction: "Jupiter Dasha is about wisdom expansion, abundance cultivation, and dharmic living. It's a period of natural blessings and the flowering of goodness.",
      lessons: "The central lesson is: prosperity comes through righteous living and generosity. This period teaches you to expand your vision, share your gifts, and live in alignment with dharma (divine law). You learn that true wealth includes wisdom, good health, and meaningful relationships. Blessings multiply when you give.",
      spiritual: "Spiritually, Jupiter Dasha invites you to activate your higher self and connection to divine grace. Through prayer, meditation, acts of service, and study of wisdom teachings, you open to blessing and guidance. This is a time when your potential to become a teacher and guide awakens.",
      lesson: "True prosperity flows from wisdom, virtue, and generosity.",
      spiritualKeyword: "Wisdom expansion"
    },
    Venus: {
      introduction: "Venus Dasha is about grace, beauty, relationships, and the refinement of your experience of pleasure and love.",
      lessons: "The central lesson is: love is the ultimate power. This period teaches you to appreciate beauty, deepen relationships, and align your desires with your values. You learn that true pleasure comes from alignment, not indulgence. Challenges teach you discernment in relationships and the difference between attachment and love.",
      spiritual: "Spiritually, Venus Dasha invites you to activate the anahata (heart chakra) and open to divine love. Through devotional practices, art, beauty appreciation, and service to others, you access the heart's wisdom. This is a time when your capacity for unconditional love expands.",
      lesson: "Love and beauty refine the soul; choose wisely what you invite into your heart.",
      spiritualKeyword: "Love refinement"
    },
    Saturn: {
      introduction: "Saturn Dasha is about character forging through discipline, karmic maturation, and the building of lasting structures. It's a period of serious work and deep learning through challenges.",
      lessons: "The central lesson is: lasting achievement comes through persistent effort over time. This period teaches you patience, responsibility, and the value of slow, steady work. You learn that obstacles are not punishments but opportunities for growth. Challenges forge character and wisdom.",
      spiritual: "Spiritually, Saturn Dasha invites you to activate your capacity for renunciation and acceptance of what is. Through meditation, service without expectation, and acceptance of limitations, you access profound peace. This is a time when your faith in divine timing deepens.",
      lesson: "Patience, discipline, and acceptance of karma create lasting transformation.",
      spiritualKeyword: "Spiritual maturation"
    },
    Rahu: {
      introduction: "Rahu Dasha is about breaking through boundaries, pursuing unconventional paths, and following obsessive desires toward transformation. It's a period of intensity and breakthrough.",
      lessons: "The central lesson is: desires and obsessions can lead to growth if channeled wisely. This period teaches you to pursue unconventional paths, embrace innovation, and push through fear toward new frontiers. You learn that what you obsess over reveals your deepest hunger. Challenges teach discernment between ego-desire and soul-desire.",
      spiritual: "Spiritually, Rahu Dasha invites you to transcend conventional thinking and access higher realms. Through meditation, exploration of the shadow, and embracing the unknown, you access transformation. This is a time when you may experience radical shifts in understanding and identity.",
      lesson: "Use obsessive energy as fuel for spiritual breakthrough and innovation.",
      spiritualKeyword: "Breakthrough"
    },
    Ketu: {
      introduction: "Ketu Dasha is about detachment, spiritual deepening, and the completion of karmic cycles. It's a period of mystical experiences and letting go.",
      lessons: "The central lesson is: liberation comes through release. This period teaches you to detach from material concerns, complete karmic patterns, and access deeper dimensions of consciousness. You learn that losses often precede spiritual gains. Challenges teach you that you are not your possessions or roles.",
      spiritual: "Spiritually, Ketu Dasha invites you to activate your spiritual heart and connection to transcendence. Through meditation, mystical practices, solitude, and inner exploration, you access liberation. This is a time when the veils between worlds grow thin and spiritual insights deepen.",
      lesson: "Detachment from illusion reveals the eternal nature of the self.",
      spiritualKeyword: "Spiritual liberation"
    },
  }

  return analyses[planet] || {
    introduction: `${planet} Dasha brings its distinctive lessons and spiritual opportunities.`,
    lessons: `This period teaches lessons related to ${planet}'s natural themes and significations.`,
    spiritual: `Spiritually, this phase invites you to deepen your connection to ${planet}'s higher dimensions.`,
    lesson: `${planet}'s core teaching.`,
    spiritualKeyword: `${planet} growth`
  }
}

/**
 * Get shadow and light aspects of a dasha planet.
 */
function getShadowLight(planet: string): string {
  const descriptions: Record<string, string> = {
    Sun: "Light: Confidence, authenticity, leadership, vitality. Shadow: Arrogance, pride, stubbornness, excessive need for recognition. Growth comes from balancing self-expression with humility.",
    Moon: "Light: Emotional depth, nurturing, intuition, compassion. Shadow: Emotional instability, dependency, oversensitivity, moodiness. Growth comes from emotional steadiness and healthy boundaries.",
    Mars: "Light: Courage, initiative, dynamic energy, protection. Shadow: Aggression, impulsiveness, anger, destructiveness. Growth comes from channeling force into purposeful action.",
    Mercury: "Light: Clarity, intelligence, communication, adaptability. Shadow: Superficiality, deception, restlessness, overthinking. Growth comes from truthfulness and depth.",
    Jupiter: "Light: Wisdom, expansion, benevolence, faith. Shadow: Excess, overconfidence, arrogance, rigidity. Growth comes from discerning true wisdom from false abundance.",
    Venus: "Light: Beauty, love, harmony, pleasure. Shadow: Attachment, indulgence, codependency, lust. Growth comes from refining desire and choosing love wisely.",
    Saturn: "Light: Discipline, responsibility, structure, lasting achievement. Shadow: Fear, limitation, coldness, oppression. Growth comes from accepting boundaries while transcending needless fear.",
    Rahu: "Light: Innovation, breakthrough, unconventional path, ambition. Shadow: Obsession, delusion, excess, shadow pursuits. Growth comes from channeling intense desire toward spiritual goals.",
    Ketu: "Light: Detachment, spirituality, wisdom, liberation. Shadow: Dissociation, loss, isolation, escapism. Growth comes from detachment without denial of beauty.",
  }

  return descriptions[planet] || `This planet brings both light and shadow aspects that invite conscious integration.`
}

// ─── Utility Helpers ──────────────────────────────────────

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
