/* ════════════════════════════════════════════════════════
   GrahAI — Career Blueprint Report Generator

   Generates a comprehensive career analysis entirely from
   calculation data — NO AI API calls required.

   Analyzes: 10th house, Saturn, Mercury, Dasamsa D10,
   Dasha career windows, yogas, and professional timing.
   ════════════════════════════════════════════════════════ */

import type { ReportData } from '../kundli-report-generator'
import {
  GeneratedReport, ReportSection, ReportRemedy,
  PLANET_MANTRAS, PLANET_GEMSTONES, DIGNITY_LABELS, HOUSE_LIFE_AREAS
} from './types'

// ─── Career Blueprint Generator ──────────────────────────

/**
 * Generate a comprehensive Career Blueprint report from natal chart data.
 * Analyzes 10th house, Saturn, Mercury, Dasamsa, yogas, and dasha timing.
 */
export function generateCareerReport(data: ReportData): GeneratedReport {
  const sections: ReportSection[] = []
  const remedies: ReportRemedy[] = []

  // Section 1: Professional Archetype
  sections.push(buildProfessionalArchetype(data))

  // Section 2: Best Industries & Career Paths
  sections.push(buildIndustriesAndPaths(data))

  // Section 3: Promotion Windows & Growth Timing
  sections.push(buildPromotionWindows(data))

  // Section 4: Leadership Style
  sections.push(buildLeadershipStyle(data))

  // Section 5: 5-Year Professional Outlook
  sections.push(buildProfessionalOutlook(data))

  // Build remedies for career enhancement
  buildCareerRemedies(data, remedies)

  // Build summary
  const summary = generateCareerSummary(data)

  return {
    summary,
    sections,
    remedies,
  }
}

// ─── Section 1: Professional Archetype ───────────────────

function buildProfessionalArchetype(data: ReportData): ReportSection {
  const house10 = data.houseAnalysis.find(h => h.house === 10)
  const saturn = data.natalChart.planets.find(p => p.name === 'Saturn')
  const dasamsa = data.dasamsaChart
  const d10AscSign = getSignFromDegree(dasamsa.ascendant)

  let content = ''

  // 10th House Analysis
  if (house10) {
    const lord10 = house10.lord
    const lordPlanet = data.natalChart.planets.find(p => p.name === lord10)

    content += `Your 10th house (Karma Sthana) is in ${house10.sign}, ruled by ${lord10}. `

    if (lordPlanet) {
      const dignity = DIGNITY_LABELS[lordPlanet.dignity] || lordPlanet.dignity
      content += `${lord10}, your career lord, is ${dignity} and placed in the ${getOrdinal(lordPlanet.house)} house `
      content += `in ${lordPlanet.sign.name}, ${lordPlanet.retrograde ? '(retrograde) ' : ''}indicating `

      if (lordPlanet.house === 10) {
        content += `strong personal involvement in career matters with direct authority and professional control.`
      } else if ([1, 5, 9, 11].includes(lordPlanet.house)) {
        content += `favorable positioning of career potential with growth and recognition.`
      } else if ([6, 8, 12].includes(lordPlanet.house)) {
        content += `challenges in career expression requiring sustained effort and strategic planning.`
      } else {
        content += `a blended influence where career evolves through relationships and external factors.`
      }
    }

    if (house10.planetsInHouse.length > 0) {
      content += ` Planets in the 10th: ${house10.planetsInHouse.join(', ')}. These bodies energize your career sector directly.`
    }
  }

  content += `\n\n**Saturn as Career Karakamsha (Karaka for profession)**\n\n`

  if (saturn) {
    const saturnDignity = DIGNITY_LABELS[saturn.dignity] || saturn.dignity
    const saturnRetro = saturn.retrograde ? ' (retrograde, internalized career drive)' : ''

    content += `Saturn, the natural significator of career, longevity, and structured achievement, is ${saturnDignity} `
    content += `in your chart, placed in ${saturn.sign.name} in the ${getOrdinal(saturn.house)} house${saturnRetro}. `

    if (saturn.dignity === 'exalted' || saturn.dignity === 'moolatrikona') {
      content += `Your Saturn is powerfully placed, indicating exceptional capacity for discipline, responsibility, `
      content += `and long-term career building. You thrive in structured environments and achieve success through `
      content += `persistent effort and methodical planning.`
    } else if (saturn.dignity === 'own' || saturn.dignity === 'friendly') {
      content += `Saturn operates effectively, suggesting steady career progress through hard work, maturity, and `
      content += `responsible stewardship. Your professional success comes from patience and strategic persistence.`
    } else if (saturn.dignity === 'debilitated') {
      content += `Saturn is debilitated, suggesting career challenges requiring conscious effort and discipline. `
      content += `Success comes through overcoming obstacles and developing resilience. Saturn's delays teach patience.`
    } else {
      content += `Saturn operates with neutral influence, requiring conscious effort to harness its disciplinary power.`
    }
  }

  content += `\n\n**Dasamsa (D10) Chart: The Career Destiny Blueprint**\n\n`
  content += `Your D10 Dasamsa chart reveals the career dimension of your destiny. The D10 Ascendant falls in `
  content += `${d10AscSign}, indicating a professional orientation toward `

  switch (d10AscSign) {
    case 'Aries':
      content += `pioneering roles, leadership, and independent ventures. You naturally take initiative in career matters.`
      break
    case 'Taurus':
      content += `stable, wealth-generating fields with tangible results. You build lasting professional foundations.`
      break
    case 'Gemini':
      content += `communication, networking, and intellectual pursuits. Versatility and adaptability define your path.`
      break
    case 'Cancer':
      content += `nurturing professions, public service, and emotionally connected work. You lead through compassion.`
      break
    case 'Leo':
      content += `leadership, authority, and prominent public roles. Your career involves visibility and recognition.`
      break
    case 'Virgo':
      content += `analysis, service, and practical expertise. You excel in technical and specialized fields.`
      break
    case 'Libra':
      content += `partnerships, mediation, and aesthetic fields. Collaboration enhances your professional success.`
      break
    case 'Scorpio':
      content += `research, transformation, and depth. You excel in hidden or intense professional environments.`
      break
    case 'Sagittarius':
      content += `expansion, education, and idealistic ventures. Your career involves vision and broader impact.`
      break
    case 'Capricorn':
      content += `structure, authority, and climbing professional hierarchies. You naturally assume responsibility.`
      break
    case 'Aquarius':
      content += `innovation, technology, and humanitarian fields. Your career breaks conventions and serves collective good.`
      break
    case 'Pisces':
      content += `spiritual, creative, and compassionate professions. Your career involves imagination and intuition.`
      break
  }

  content += `\n\n**D10 Planets: Career Destiny Markers**\n\n`
  const d10Planets = dasamsa.planets.slice(0, 9) // Exclude lunar nodes if present
  if (d10Planets.length > 0) {
    content += `In your Dasamsa chart: `
    const d10Placements = d10Planets.map(p => `${p.name} in ${p.sign.name}`).join(', ')
    content += `${d10Placements}. `
    content += `These placements refine your career archetype and professional talents.`
  }

  return {
    title: 'Professional Archetype',
    content,
    highlights: [
      `10th House Lord: ${house10?.lord || 'N/A'}`,
      `Saturn's Dignity: ${saturn?.dignity || 'N/A'}`,
      `D10 Ascendant: ${d10AscSign}`,
    ]
  }
}

// ─── Section 2: Best Industries & Career Paths ───────────

function buildIndustriesAndPaths(data: ReportData): ReportSection {
  const planets = data.natalChart.planets
  let content = ''

  // Analyze planets for career typing
  const sun = planets.find(p => p.name === 'Sun')
  const moon = planets.find(p => p.name === 'Moon')
  const mars = planets.find(p => p.name === 'Mars')
  const mercury = planets.find(p => p.name === 'Mercury')
  const jupiter = planets.find(p => p.name === 'Jupiter')
  const venus = planets.find(p => p.name === 'Venus')
  const saturn = planets.find(p => p.name === 'Saturn')

  content += `Your professional aptitudes emerge from how key planets are placed in your specific chart:\n\n`

  const industries: string[] = []

  // Sun — Government, Leadership, Authority
  if (sun) {
    content += `**Sun (Government, Leadership, Authority)**: `
    if (['Leo', 'Aries'].includes(sun.sign.name) && ['exalted', 'moolatrikona', 'own'].includes(sun.dignity)) {
      content += `Strong Sun suggests government service, executive roles, or authority positions. You lead through `
      content += `presence, vision, and responsibility. Consider: IAS/IPS, judiciary, business ownership, CEO roles.\n`
      industries.push('Government & Administration')
      industries.push('Leadership & Management')
    } else if (['Leo', 'Aries'].includes(sun.sign.name)) {
      content += `Well-placed Sun supports authority and recognition in professional spheres. Government, management, `
      content += `and leadership roles align with your nature.\n`
      industries.push('Leadership & Management')
    } else {
      content += `Sun indicates capacity for recognition and responsibility. Authority and public roles are accessible `
      content += `through steady effort.\n`
    }
  }

  // Moon — Public Service, Care Professions, Nurturing
  if (moon) {
    content += `**Moon (Public Service, Care, Nurturing)**: `
    if (['Cancer', 'Taurus'].includes(moon.sign.name) && ['exalted', 'moolatrikona', 'own'].includes(moon.dignity)) {
      content += `Excellent Moon for public service, psychology, education, healthcare, and counseling. You thrive in `
      content += `roles serving emotional and material wellbeing. Consider: social work, nursing, teaching, psychology.\n`
      industries.push('Healthcare & Wellness')
      industries.push('Education & Counseling')
      industries.push('Public Service')
    } else if (['Cancer', 'Taurus'].includes(moon.sign.name)) {
      content += `Supportive Moon for roles involving care, education, and public connection. Teaching, healthcare, and `
      content += `social domains benefit from your sensitivity.\n`
      industries.push('Education & Counseling')
    } else {
      content += `Moon supports professions requiring empathy and public interaction. Service-oriented roles align with `
      content += `your emotional intelligence.\n`
    }
  }

  // Mars — Engineering, Military, Defense, Entrepreneurship
  if (mars) {
    content += `**Mars (Engineering, Military, Defense, Entrepreneurship)**: `
    if (['Aries', 'Scorpio'].includes(mars.sign.name) && ['exalted', 'moolatrikona', 'own'].includes(mars.dignity)) {
      content += `Powerfully placed Mars supports engineering, military, police, construction, and entrepreneurship. `
      content += `You possess drive, courage, and technical aptitude. Consider: IIT fields, defence services, startups, `
      content += `construction, manufacturing.\n`
      industries.push('Engineering & Technology')
      industries.push('Military & Defence')
      industries.push('Entrepreneurship')
    } else if (['Aries', 'Scorpio'].includes(mars.sign.name)) {
      content += `Well-placed Mars supports dynamic, action-oriented professions. Engineering, military, and `
      content += `entrepreneurship leverage your energy effectively.\n`
      industries.push('Engineering & Technology')
    } else {
      content += `Mars suggests aptitude for action, courage, and initiative. Technical and entrepreneurial paths are `
      content += `accessible through focused effort.\n`
    }
  }

  // Mercury — Business, Communication, Trading, Accounting
  if (mercury) {
    content += `**Mercury (Business, Communication, Trading, Accounting)**: `
    if (['Gemini', 'Virgo'].includes(mercury.sign.name) && ['exalted', 'moolatrikona', 'own'].includes(mercury.dignity)) {
      content += `Excellent Mercury for business, trading, accounting, writing, journalism, and all communication fields. `
      content += `Your intellect and analytical skill shine. Consider: CA, management consulting, trading, media, IT.\n`
      industries.push('Business & Commerce')
      industries.push('Communication & Media')
      industries.push('Accounting & Finance')
      industries.push('IT & Software')
    } else if (['Gemini', 'Virgo'].includes(mercury.sign.name)) {
      content += `Well-placed Mercury supports business communication, analysis, and intellectual pursuits. Finance, `
      content += `commerce, and technical fields benefit from your clarity.\n`
      industries.push('Business & Commerce')
      industries.push('IT & Software')
    } else {
      content += `Mercury suggests communication aptitude and intellectual engagement. Business, analysis, and writing `
      content += `leverage your mental agility.\n`
    }
  }

  // Jupiter — Teaching, Finance, Law, Spirituality, Administration
  if (jupiter) {
    content += `**Jupiter (Teaching, Finance, Law, Spirituality, Administration)**: `
    if (['Sagittarius', 'Pisces'].includes(jupiter.sign.name) && ['exalted', 'moolatrikona', 'own'].includes(jupiter.dignity)) {
      content += `Powerful Jupiter indicates teaching, finance, law, spirituality, and administration. You inspire through `
      content += `wisdom and ethical leadership. Consider: law, academics, finance, banking, spirituality.\n`
      industries.push('Education & Academia')
      industries.push('Law & Legal Services')
      industries.push('Finance & Banking')
    } else if (['Sagittarius', 'Pisces'].includes(jupiter.sign.name)) {
      content += `Well-placed Jupiter supports teaching, law, finance, and wisdom-sharing roles. Your natural authority `
      content += `attracts mentoring and administrative opportunities.\n`
      industries.push('Education & Academia')
      industries.push('Law & Legal Services')
    } else {
      content += `Jupiter suggests aptitude for teaching, ethics, and broader perspectives. Law, education, and `
      content += `administrative roles leverage your wisdom.\n`
    }
  }

  // Venus — Arts, Luxury, Entertainment, Fashion, Interior Design
  if (venus) {
    content += `**Venus (Arts, Luxury, Entertainment, Fashion, Design)**: `
    if (['Taurus', 'Libra'].includes(venus.sign.name) && ['exalted', 'moolatrikona', 'own'].includes(venus.dignity)) {
      content += `Excellent Venus for arts, entertainment, fashion, luxury brands, interior design, and creativity. `
      content += `Your aesthetic sensibility and charm attract success. Consider: design, arts, entertainment, luxury.\n`
      industries.push('Arts & Entertainment')
      industries.push('Design & Fashion')
      industries.push('Luxury & Hospitality')
    } else if (['Taurus', 'Libra'].includes(venus.sign.name)) {
      content += `Well-placed Venus supports aesthetic and creative professions. Design, arts, and luxury sectors benefit `
      content += `from your refinement.\n`
      industries.push('Arts & Entertainment')
      industries.push('Design & Fashion')
    } else {
      content += `Venus suggests creative and aesthetic aptitudes. Arts, design, and relationship-based professions `
      content += `leverage your charm.\n`
    }
  }

  // Saturn — Service, Labor, Heavy Work, Agriculture, Structure
  if (saturn) {
    content += `**Saturn (Service, Structure, Labor, Agriculture, Heavy Industries)**: `
    if (['Capricorn', 'Aquarius'].includes(saturn.sign.name) && ['exalted', 'moolatrikona', 'own'].includes(saturn.dignity)) {
      content += `Well-placed Saturn supports structured professions: architecture, engineering management, real estate, `
      content += `heavy industries, and long-term building. Your discipline ensures lasting success.\n`
      industries.push('Architecture & Real Estate')
      industries.push('Heavy Industries')
    } else {
      content += `Saturn supports roles requiring discipline, patience, and systematic work. Infrastructure, agriculture, `
      content += `and service sectors benefit from your structure.\n`
    }
  }

  content += `\n**Recommended Domains**\n\n`
  const uniqueIndustries = [...new Set(industries)]
  content += uniqueIndustries.map(ind => `• ${ind}`).join('\n')

  // Analyze yogas for career boost
  const careerYogas = data.yogas.filter(y =>
    y.category === 'Raj Yoga' || y.category === 'Panch Mahapurush' || y.name.includes('Gajakesari')
  )
  if (careerYogas.length > 0) {
    content += `\n\n**Career-Elevating Yogas**\n\n`
    content += `Your chart contains ${careerYogas.length} auspicious formation(s):\n`
    careerYogas.forEach(yoga => {
      content += `• **${yoga.name}**: ${yoga.effects || 'Enhances overall prosperity and professional success.'}\n`
    })
  }

  return {
    title: 'Best Industries & Career Paths',
    content,
    highlights: uniqueIndustries.slice(0, 5),
  }
}

// ─── Section 3: Promotion Windows & Growth Timing ────────

function buildPromotionWindows(data: ReportData): ReportSection {
  let content = ''

  content += `Your Vimshottari Dasha timeline reveals when specific career growth periods activate in your chart:\n\n`

  // Current Dasha
  if (data.dashaAnalysis) {
    const currentMD = data.dashaAnalysis.currentMahadasha
    const currentAD = data.dashaAnalysis.currentAntardasha
    const mdEndDate = data.dashaAnalysis.currentMahadasha?.endDate
    const adEndDate = data.dashaAnalysis.currentAntardasha?.endDate

    content += `**Current Dasha Period**\n\n`
    content += `You are running ${currentMD.planet} Mahadasha with ${currentAD.planet} Antardasha. `

    // Interpret career significance
    const careerPlanets = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Saturn']
    if (careerPlanets.includes(currentMD.planet)) {
      content += `${currentMD.planet} is a significant career-activating planet in Vedic astrology. `
      switch (currentMD.planet) {
        case 'Sun':
          content += `This period favors leadership, authority, government service, and prominent positions. `
          content += `Expect visibility and recognition.`
          break
        case 'Mars':
          content += `This period supports action, entrepreneurship, initiative, and decisive leadership. `
          content += `Your drive accelerates professional growth.`
          break
        case 'Mercury':
          content += `This period favors business, communication, intellectual pursuits, and commerce. `
          content += `Trading, writing, and analysis flourish.`
          break
        case 'Jupiter':
          content += `This period brings expansion, wisdom-sharing, and higher learning opportunities. `
          content += `Teaching, mentoring, and administrative roles prosper.`
          break
        case 'Saturn':
          content += `This period demands persistent hard work and builds lasting structures. `
          content += `Long-term projects and responsible leadership advance.`
          break
      }
    } else {
      content += `This dasha period influences your professional environment and relationships at work. `
      content += `Career growth depends on planetary interactions.`
    }

    if (mdEndDate) {
      const endYear = new Date(mdEndDate).getFullYear()
      const endMonth = new Date(mdEndDate).toLocaleString('en-US', { month: 'long' })
      content += ` This period concludes in ${endMonth} ${endYear}.`
    }
  }

  // Upcoming Dasha Periods
  content += `\n\n**Upcoming Career Windows (Next 5 Years)**\n\n`

  const upcomingDashas = data.dashaTimeline
    .filter(d => new Date(d.startDate) > new Date() && new Date(d.startDate).getFullYear() <= new Date().getFullYear() + 5)
    .slice(0, 5)

  if (upcomingDashas.length > 0) {
    upcomingDashas.forEach((dasha, idx) => {
      const startYear = new Date(dasha.startDate).getFullYear()
      const startMonth = new Date(dasha.startDate).toLocaleString('en-US', { month: 'short' })
      const endYear = new Date(dasha.endDate).getFullYear()
      const endMonth = new Date(dasha.endDate).toLocaleString('en-US', { month: 'short' })

      content += `**${idx + 1}. ${dasha.antardasha} in ${dasha.mahadasha} (${startMonth} ${startYear} – ${endMonth} ${endYear})**\n`

      // Interpret career impact
      if (dasha.mahadasha === 'Sun' || dasha.antardasha === 'Sun') {
        content += `Sun influence: Leadership, authority, and visibility peak. Ideal for promotions and public roles.\n`
      } else if (dasha.mahadasha === 'Mars' || dasha.antardasha === 'Mars') {
        content += `Mars influence: Action, entrepreneurship, and decisive moves flourish. Launch new ventures or assert leadership.\n`
      } else if (dasha.mahadasha === 'Mercury' || dasha.antardasha === 'Mercury') {
        content += `Mercury influence: Communication, intellect, and business thrive. Negotiate, expand networks, or start projects.\n`
      } else if (dasha.mahadasha === 'Jupiter' || dasha.antardasha === 'Jupiter') {
        content += `Jupiter influence: Expansion, wisdom, and mentoring opportunities emerge. Teaching and advisory roles prosper.\n`
      } else if (dasha.mahadasha === 'Saturn' || dasha.antardasha === 'Saturn') {
        content += `Saturn influence: Long-term building and responsibility increase. Systematic progress and authority develop.\n`
      } else {
        content += `This period activates secondary career factors and supporting energies for growth.\n`
      }
    })
  } else {
    content += `Based on your current dasha position, the next major dasha shift will bring new professional opportunities `
    content += `and timing windows. Track these transitions for strategic career moves.`
  }

  // Ashtakavarga for Career House
  const house10Strength = data.houseStrengths.find(h => h.house === 10)
  if (house10Strength) {
    content += `\n\n**10th House Strength (Ashtakavarga)**\n\n`
    content += `Your 10th house Ashtakavarga score is ${house10Strength.sav}, indicating ${house10Strength.strength} `
    content += `career foundation. ${house10Strength.meaning}`
  }

  return {
    title: 'Promotion Windows & Growth Timing',
    content,
    highlights: [
      data.dashaAnalysis?.currentMahadasha?.planet || 'N/A',
      data.dashaAnalysis?.currentAntardasha?.planet || 'N/A',
      `10th House SAV: ${house10Strength?.sav || 'N/A'}`,
    ]
  }
}

// ─── Section 4: Leadership Style ──────────────────────────

function buildLeadershipStyle(data: ReportData): ReportSection {
  const planets = data.natalChart.planets
  const sun = planets.find(p => p.name === 'Sun')
  const mars = planets.find(p => p.name === 'Mars')
  const jupiter = planets.find(p => p.name === 'Jupiter')
  const saturn = planets.find(p => p.name === 'Saturn')

  let content = ''

  content += `Your leadership archetype is defined by four planets in your chart—Sun in ${sun?.sign.name || 'N/A'} (authority), Mars in ${mars?.sign.name || 'N/A'} (initiative), Jupiter in ${jupiter?.sign.name || 'N/A'} (wisdom), and Saturn in ${saturn?.sign.name || 'N/A'} (responsibility):\n\n`

  // Sun-based leadership
  if (sun) {
    content += `**Solar Leadership (Confidence & Presence)**\n\n`
    if (['Leo', 'Aries'].includes(sun.sign.name)) {
      content += `Your Sun in ${sun.sign.name} creates natural charisma and command presence. `
      content += `You lead through confidence, vision, and personal magnetism. You inspire through example and conviction. `
      content += `Your authority is felt immediately; others look to you for direction.`
    } else if (['Sagittarius', 'Libra'].includes(sun.sign.name)) {
      content += `Your Sun in ${sun.sign.name} creates fair-minded, idealistic leadership. `
      content += `You lead through wisdom, ethical conviction, and inclusive vision. People trust your judgment and broad perspective.`
    } else if (sun.sign.name === 'Capricorn') {
      content += `Your Sun in Capricorn creates responsible, structured leadership. `
      content += `You lead through discipline, long-term planning, and steady achievement. Others respect your reliability.`
    } else {
      content += `Your Sun in ${sun.sign.name} colors your leadership with distinctive qualities. `
      content += `You lead through your unique perspective and authentic presence.`
    }
  }

  // Mars-based leadership
  if (mars) {
    content += `\n\n**Martial Leadership (Drive & Initiative)**\n\n`
    if (['Aries', 'Scorpio'].includes(mars.sign.name)) {
      content += `Mars in ${mars.sign.name} makes you a decisive, action-oriented leader. `
      content += `You initiate boldly, overcome obstacles with courage, and inspire through warrior energy. `
      content += `You thrive in competitive, fast-moving environments.`
    } else if (mars.sign.name === 'Capricorn') {
      content += `Mars in Capricorn creates strategic, ambitious leadership. `
      content += `You climb hierarchies methodically, combining drive with discipline. Your patience ensures sustainable success.`
    } else {
      content += `Mars in your chart strengthens your drive and willingness to assert leadership. `
      content += `You command respect through action and initiative.`
    }
  }

  // Jupiter-based leadership
  if (jupiter) {
    content += `\n\n**Jupiterian Leadership (Wisdom & Mentoring)**\n\n`
    if (['Sagittarius', 'Pisces'].includes(jupiter.sign.name)) {
      content += `Jupiter in ${jupiter.sign.name} makes you a visionary, mentoring leader. `
      content += `You lead through wisdom, ethics, and expansion of horizons. People turn to you for guidance and higher perspective. `
      content += `Your leadership uplifts others spiritually and intellectually.`
    } else {
      content += `Jupiter adds wisdom and generosity to your leadership. `
      content += `You inspire through faith, ethical standards, and belief in human potential.`
    }
  }

  // Saturn-based leadership
  if (saturn) {
    content += `\n\n**Saturnian Leadership (Structure & Responsibility)**\n\n`
    if (['Capricorn', 'Aquarius'].includes(saturn.sign.name)) {
      content += `Saturn in ${saturn.sign.name} makes you a structural, long-term builder. `
      content += `You lead through systems, accountability, and gradual, enduring progress. People respect your reliability and follow-through. `
      content += `You excel in managing organizations, implementing strategy, and bearing heavy responsibility.`
    } else {
      content += `Saturn adds gravitas and accountability to your leadership. `
      content += `You lead through discipline, realistic assessment, and sustainable systems.`
    }
  }

  // Authority indicators from other yogas
  const authorityYogas = data.yogas.filter(y =>
    y.name.includes('Raj') || y.name.includes('Panch Mahapurush')
  )
  if (authorityYogas.length > 0) {
    content += `\n\n**Authority-Enhancing Yogas**\n\n`
    content += `Your chart contains yogas that elevate your natural authority: `
    content += authorityYogas.map(y => y.name).join(', ')
    content += `. These formations amplify your leadership impact and professional standing.`
  }

  // Integration — data-driven synthesis
  const leaderPlanets = [sun, mars, jupiter, saturn].filter(Boolean)
  const strongLeaders = leaderPlanets.filter(p => p && ['exalted', 'moolatrikona', 'own'].includes(p.dignity))
  const weakLeaders = leaderPlanets.filter(p => p && ['debilitated', 'enemy'].includes(p.dignity))

  content += `\n\n**Integrated Leadership Profile**\n\n`
  if (strongLeaders.length >= 2) {
    content += `With ${strongLeaders.map(p => p!.name).join(' and ')} in strong dignity, your leadership is naturally commanding. `
    content += `You can assert authority confidently and others recognize your competence instinctively.`
  } else if (weakLeaders.length >= 2) {
    content += `With ${weakLeaders.map(p => p!.name).join(' and ')} in challenging dignity, your leadership develops through overcoming obstacles. `
    content += `Building credibility takes sustained effort, but the resilience gained becomes your greatest asset.`
  } else {
    content += `Your leadership planets show a mix of strengths, giving you versatility. `
    content += `You adapt your style to context—asserting when needed, collaborating when beneficial.`
  }

  return {
    title: 'Leadership Style & Authority',
    content,
    highlights: [
      `Sun Sign: ${sun?.sign.name || 'N/A'}`,
      `Mars Sign: ${mars?.sign.name || 'N/A'}`,
      `Jupiter Sign: ${jupiter?.sign.name || 'N/A'}`,
    ]
  }
}

// ─── Section 5: 5-Year Professional Outlook ──────────────

function buildProfessionalOutlook(data: ReportData): ReportSection {
  let content = ''

  content += `Your professional trajectory over the next five years, shaped by your ${data.dashaAnalysis?.currentMahadasha?.planet || 'current'} Mahadasha and 10th house configuration:\n\n`

  // Current phase assessment
  content += `**Year 1: Foundation & Current Trajectory**\n\n`

  const currentDasha = data.dashaAnalysis?.currentMahadasha?.planet || 'N/A'
  const house10SAV = data.houseStrengths.find(h => h.house === 10)?.sav || 0

  content += `You are operating under ${currentDasha} Mahadasha influence. `

  if (house10SAV >= 30) {
    content += `Your 10th house strength is excellent (SAV: ${house10SAV}), indicating stable, productive professional conditions. `
    content += `This is an ideal year to consolidate gains, seek promotions, and plan medium-term career advancement.`
  } else if (house10SAV >= 20) {
    content += `Your 10th house moderate strength (SAV: ${house10SAV}) suggests stable progress. `
    content += `Career growth is steady; plan strategically and build professional capital.`
  } else {
    content += `Your 10th house requires attention (SAV: ${house10SAV}). `
    content += `Focus on skill development, networking, and strategic positioning. Patience yields results.`
  }

  // Year-by-year dasha progression
  content += `\n\n**Year 2-5: Dasha Progression & Opportunities**\n\n`

  const nextDashas = data.dashaTimeline
    .filter(d => new Date(d.startDate) > new Date() && new Date(d.startDate).getFullYear() <= new Date().getFullYear() + 5)
    .slice(0, 4)

  if (nextDashas.length > 0) {
    nextDashas.forEach((dasha, idx) => {
      const year = new Date(dasha.startDate).getFullYear() - new Date().getFullYear() + 2
      content += `**Year ${year}: ${dasha.antardasha} in ${dasha.mahadasha}**\n`

      // Career interpretation
      if (dasha.mahadasha === 'Sun' || dasha.antardasha === 'Sun') {
        content += `Sun dominance: Expect leadership opportunities, visibility, and authority expansion. Pursue advancement aggressively.\n`
      } else if (dasha.mahadasha === 'Mars' || dasha.antardasha === 'Mars') {
        content += `Mars activation: Action-oriented period. Launch ventures, assert yourself, and take decisive leadership steps.\n`
      } else if (dasha.mahadasha === 'Mercury' || dasha.antardasha === 'Mercury') {
        content += `Mercury period: Intellectual growth, communication opportunities, and business expansion. Network actively.\n`
      } else if (dasha.mahadasha === 'Jupiter' || dasha.antardasha === 'Jupiter') {
        content += `Jupiter expansion: Wisdom, mentoring, and higher positions open. Advance spiritually and professionally.\n`
      } else if (dasha.mahadasha === 'Saturn' || dasha.antardasha === 'Saturn') {
        content += `Saturn building: Long-term projects mature. Focus on systems, accountability, and enduring structures.\n`
      } else if (dasha.mahadasha === 'Venus' || dasha.antardasha === 'Venus') {
        content += `Venus grace: Relationship and luxury sectors activate. Partnerships and aesthetically-oriented work prosper.\n`
      } else {
        content += `This period influences supporting factors in career growth and professional relationships.\n`
      }
    })
  }

  // Varga-based outlook
  if (data.vargaInterpretation) {
    content += `\n**D10 Dasamsa Guidance**\n\n`
    content += `Your D10 chart indicates career destiny themes. Career decisions aligned with your D10 signatures `
    content += `(planet and house placements in the divisional chart) yield the strongest results.`
  }

  // Strength analysis
  const strongPlanets = data.strengthAnalysis?.planets
    ?.filter((p: any) => p.strength >= 6)
    ?.map((p: any) => p.planet) || []

  if (strongPlanets.length > 0) {
    content += `\n**Strong Planets Supporting Your Career**\n\n`
    content += `Planets with high Shadbala strength (${strongPlanets.join(', ')}) provide consistent support. `
    content += `They sustain your professional efforts and amplify your capabilities.`
  }

  // Data-driven strategic advice
  const house10Lord = data.houseAnalysis.find(h => h.house === 10)?.lord || 'N/A'
  const h10LordPlanet = data.natalChart.planets.find(p => p.name === house10Lord)
  const needsLordStrengthening = h10LordPlanet && ['debilitated', 'enemy', 'neutral'].includes(h10LordPlanet.dignity)
  const h10Mantra = PLANET_MANTRAS[house10Lord]

  content += `\n\n**Strategic Recommendations Based on Your Chart**\n\n`
  content += `1. **Timing**: Your next favorable career window is the ${nextDashas[0]?.antardasha || 'upcoming'} Antardasha—prepare major moves for that period.\n`
  if (needsLordStrengthening && h10Mantra) {
    content += `2. **Strengthen ${house10Lord} (your 10th lord)**: Recite "${h10Mantra.mantra}" ${h10Mantra.count} on ${h10Mantra.day}s.\n`
  } else {
    content += `2. **Maintain ${house10Lord} (your 10th lord)**: Already well-placed; keep leveraging its natural strength.\n`
  }
  content += `3. **SAV Focus**: Your 10th house SAV of ${house10SAV} ${house10SAV >= 28 ? 'is strong—act on career opportunities confidently' : 'needs bolstering—prioritize skill development and networking'}.\n`
  content += `4. **Dasha Awareness**: ${currentDasha} Mahadasha shapes your career environment until it concludes—align long-term plans accordingly.\n`

  return {
    title: '5-Year Professional Outlook',
    content,
    highlights: [
      `Current Dasha: ${currentDasha}`,
      `10th House SAV: ${house10SAV}`,
      `Outlook: Dasha-based timing`,
    ]
  }
}

// ─── Helper: Build Career Remedies ───────────────────────

function buildCareerRemedies(data: ReportData, remedies: ReportRemedy[]): void {
  const house10 = data.houseAnalysis.find(h => h.house === 10)
  const saturn = data.natalChart.planets.find(p => p.name === 'Saturn')
  const mercury = data.natalChart.planets.find(p => p.name === 'Mercury')

  // Saturn remedies
  if (saturn && ['debilitated', 'enemy'].includes(saturn.dignity)) {
    remedies.push({
      type: 'Saturn Strengthening',
      description: `Recite ${PLANET_MANTRAS.Saturn.mantra} ${PLANET_MANTRAS.Saturn.count} on ${PLANET_MANTRAS.Saturn.day}. `
        + `Wear ${PLANET_GEMSTONES.Saturn.gem} in ${PLANET_GEMSTONES.Saturn.finger}. `
        + `Serve the elderly and donate to workers. Feed black sesame to ants on Saturdays.`,
    })
  }

  // Mercury remedies for communication/business
  if (mercury && !['exalted', 'moolatrikona', 'own'].includes(mercury.dignity)) {
    remedies.push({
      type: 'Mercury Enhancement for Business',
      description: `Recite ${PLANET_MANTRAS.Mercury.mantra} ${PLANET_MANTRAS.Mercury.count} on ${PLANET_MANTRAS.Mercury.day}. `
        + `Wear ${PLANET_GEMSTONES.Mercury.gem} in ${PLANET_GEMSTONES.Mercury.finger}. `
        + `Practice clear, honest communication. Feed green vegetables to cows.`,
    })
  }

  // 10th house lord remedies
  if (house10) {
    const lordName = house10.lord as any
    const lordPlanet = data.natalChart.planets.find(p => p.name === lordName)

    if (lordPlanet && !['exalted', 'moolatrikona', 'own'].includes(lordPlanet.dignity)) {
      const mantra = PLANET_MANTRAS[lordName] || { mantra: 'Vedic mantra', count: '108 times', day: 'respective day' }
      const gem = PLANET_GEMSTONES[lordName] || { gem: 'appropriate gemstone', metal: 'appropriate metal', finger: 'ring finger' }

      remedies.push({
        type: `${lordName} (10th House Lord) Strengthening`,
        description: `Recite ${mantra.mantra} ${mantra.count} on ${mantra.day}. `
          + `Wear ${gem.gem} in ${gem.finger}. `
          + `Perform regular charity related to ${lordName}'s significations.`,
      })
    }
  }

  // General career remedies
  remedies.push({
    type: 'Career Foundation Ritual',
    description: `Perform Hanuman Chalisa recitation (40 days or ongoing) to strengthen Mars/career drive. `
      + `Light ghee lamp to Saturn on Saturday evenings. Meditate on your 10th house purpose.`,
  })

  remedies.push({
    type: 'Astrological Timing',
    description: `Initiate major career moves during favorable dasha periods (see Section 3). `
      + `Launch projects on Thursday (Mercury/Jupiter) or Tuesday (Mars) for business/action ventures.`,
  })
}

// ─── Career Summary ──────────────────────────────────────

function generateCareerSummary(data: ReportData): string {
  const house10 = data.houseAnalysis.find(h => h.house === 10)
  const saturn = data.natalChart.planets.find(p => p.name === 'Saturn')
  const d10Sign = getSignFromDegree(data.dasamsaChart.ascendant)

  let summary = ``

  if (house10) {
    summary += `With ${house10.sign} on your 10th house ruled by ${house10.lord}, `
  }

  if (saturn && ['exalted', 'moolatrikona', 'own'].includes(saturn.dignity)) {
    summary += `and Saturn ${DIGNITY_LABELS[saturn.dignity]} in ${saturn.sign.name}, your chart strongly supports disciplined career achievement. `
  } else if (saturn) {
    summary += `Saturn in ${saturn.sign.name} (${saturn.dignity}) shapes your career path through effort and persistence. `
  }

  summary += `Your D10 Dasamsa Ascendant in ${d10Sign} points to a ${d10Sign}-oriented professional identity. `

  const currentDashaP = data.dashaAnalysis?.currentMahadasha?.planet
  if (currentDashaP) {
    summary += `Currently running ${currentDashaP} Mahadasha, `
    summary += currentDashaP === 'Jupiter' ? 'a period favoring expansion and mentoring opportunities. '
      : currentDashaP === 'Saturn' ? 'a period demanding structure and long-term commitment. '
      : currentDashaP === 'Mercury' ? 'a period activating business and intellectual growth. '
      : currentDashaP === 'Venus' ? 'a period enhancing creative and partnership-based careers. '
      : `a period activating ${currentDashaP}-ruled career themes. `
  }

  return summary
}

// ─── Helpers ─────────────────────────────────────────────

function getSignFromDegree(degree: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]
  const signIndex = Math.floor(degree / 30) % 12
  return signs[signIndex]
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
