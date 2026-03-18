/* ════════════════════════════════════════════════════════
   GrahAI — Daily Insight Generator

   Produces a personalized daily horoscope for a user based
   on their natal chart, current transits, active Dasha
   period, and today's Panchang.

   Called by the daily cron job for premium users.
   ════════════════════════════════════════════════════════ */

import type {
  NatalChart, BirthDetails, PlanetName, Panchang,
} from "../ephemeris/types"
import { generateNatalChart } from "../ephemeris/sweph-wrapper"
import { calculateFullDasha, getDashaTimeline, formatDashaPeriod } from "../ephemeris/dasha-engine"
import { analyzeTransits, getMoonTransit } from "../ephemeris/transit-engine"
import { calculatePanchang, getPanchangSummary } from "../ephemeris/panchang"
import { PLANET_REMEDIES } from "../astrology-data/remedy-database"
import type { FullTransitAnalysis } from "../ephemeris/transit-engine"

// ─── Daily Insight Structure ────────────────────────────

export interface DailyInsight {
  userId: string
  date: string
  name: string

  // Panchang
  panchang: {
    tithi: string
    nakshatra: string
    yoga: string
    karana: string
    vara: string
    rahuKaal: string
    auspicious: string[]
    inauspicious: string[]
    summary: string
  }

  // Moon transit
  moonTransit: {
    currentSign: string
    houseFromMoon: number
    houseFromLagna: number
    effect: string
    nakshatra: string
  }

  // Transit snapshot (slow-moving planets only)
  keyTransits: Array<{
    planet: string
    sign: string
    houseFromMoon: number
    isBenefic: boolean
    effect: string
    significance: string
  }>

  // Overall transit trend
  overallTrend: string
  sadeSatiActive: boolean
  sadeSatiPhase: string | null
  sadeSatiAdvice: string | null

  // Active Dasha context
  dashaContext: {
    mahadasha: string
    antardasha: string
    pratyantardasha: string | null
    interpretation: string
  }

  // Daily remedy
  dailyRemedy: {
    planet: string
    type: string
    remedy: string
    reason: string
  }

  // BPHS verse of the day
  bphsVerse: {
    source: string
    chapter: number
    topic: string
    insight: string
  }

  // Favorable / unfavorable activities
  activities: {
    favorable: string[]
    unfavorable: string[]
  }

  // One-line summary
  headline: string
}

// ─── Dasha Interpretation ───────────────────────────────

const DASHA_THEMES: Record<string, string> = {
  Sun: "A period of authority, recognition, and self-expression. Focus on leadership roles, government matters, and health vitality. The soul's purpose is illuminated.",
  Moon: "An emotional and nurturing period. Mind is active, creativity flows, and relationships with mother/women are highlighted. Travel and public image matter.",
  Mars: "An energetic, action-oriented period. Courage increases, but watch for aggression. Good for property, sports, and competitive endeavors. Control anger.",
  Mercury: "An intellectual period focused on communication, business, and learning. Good for education, writing, and commerce. Maintain nervous system health.",
  Jupiter: "An expansive period of wisdom, prosperity, and spiritual growth. Marriage, children, and higher education are favored. Teachers and mentors appear.",
  Venus: "A period of luxury, romance, and artistic expression. Material comforts increase. Good for marriage, vehicles, and creative pursuits. Enjoy life's beauty.",
  Saturn: "A period of discipline, hard work, and karmic lessons. Patience is key. Career restructuring is possible. Long-term gains through perseverance.",
  Rahu: "An unconventional period of ambition and worldly desires. Foreign connections, technology, and breaking norms are themes. Avoid shortcuts and deception.",
  Ketu: "A spiritual and introspective period. Detachment from material desires. Past-life karmas surface. Good for meditation, research, and occult studies.",
}

function getDashaInterpretation(maha: string, antar: string, natalChart: NatalChart): string {
  // House signification mapping
  const houseSignifications: Record<number, string> = {
    1: "self/body", 2: "wealth/family", 3: "courage/siblings", 4: "home/mind",
    5: "creativity/children", 6: "health/enemies", 7: "partnership/marriage",
    8: "transformation/obstacles", 9: "fortune/dharma", 10: "career/status",
    11: "gains/aspirations", 12: "loss/spirituality"
  }

  // Find mahadasha planet in natal chart
  const mahaPlanet = natalChart.planets.find(p => p.name === maha)
  let mahaInterpretation = DASHA_THEMES[maha] || "A transformative period."

  if (mahaPlanet) {
    // Find which houses the mahadasha planet lords over
    const loredHouses = natalChart.houses.filter(h => h.lord === maha)
    const houseNumbers = loredHouses.map(h => h.number).join(", ")
    const houseSignifs = loredHouses.map(h => houseSignifications[h.number]).join(", ")

    const dignity = mahaPlanet.dignity || "neutral"
    mahaInterpretation = `${maha} as lord of house ${houseNumbers} (${houseSignifs}) in your ${dignity} placement — ${DASHA_THEMES[maha] || "a transformative period."}`
  }

  // Find antardasha planet and add its interpretation
  let antarTheme = ""
  const antarPlanet = natalChart.planets.find(p => p.name === antar)
  if (antarPlanet) {
    const antarLoredHouses = natalChart.houses.filter(h => h.lord === antar)
    const antarHouseNum = antarLoredHouses.length > 0 ? antarLoredHouses[0].number : 0
    const antarDignity = antarPlanet.dignity || "neutral"
    antarTheme = `Within this, ${antar} as ${antarDignity} ${antarHouseNum}th lord brings: ${DASHA_THEMES[antar]?.split(". ").slice(0, 2).join(". ") || "focused energy"}.`
  } else {
    antarTheme = DASHA_THEMES[antar]
      ? `Within this, ${antar}'s sub-period brings: ${DASHA_THEMES[antar].split(". ").slice(0, 2).join(". ")}.`
      : ""
  }

  return `${mahaInterpretation} ${antarTheme}`
}

// ─── Activity Recommendations ───────────────────────────

function getActivityRecommendations(
  panchang: Panchang,
  transitAnalysis: FullTransitAnalysis,
  mahadasha: string,
  antardasha: string,
  moonSign: string,
  moonHouseFromMoon: number,
): { favorable: string[], unfavorable: string[] } {
  const favorable: string[] = []
  const unfavorable: string[] = []
  const moonHouse = moonHouseFromMoon || transitAnalysis.transits.find(t => t.planet === "Moon")?.houseFromMoon || 0

  // ── 1. Birth-chart-specific: Dasha lord activities ──
  const dashaActivities: Record<string, { good: string; bad: string }> = {
    Sun: { good: "Authority-related work, meeting elders or government officials", bad: "Ego conflicts, overexposure in public" },
    Moon: { good: "Nurturing relationships, creative expression, travel", bad: "Emotional decision-making, sleep deprivation" },
    Mars: { good: "Physical activity, property matters, competitive tasks", bad: "Arguments, risky physical activity, anger-driven decisions" },
    Mercury: { good: "Writing, business negotiations, learning new skills", bad: "Signing documents without review, multitasking excessively" },
    Jupiter: { good: "Teaching, spiritual practice, financial planning", bad: "Overcommitting, excessive spending on luxuries" },
    Venus: { good: "Creative projects, relationship building, self-care", bad: "Overindulgence, impulsive purchases" },
    Saturn: { good: "Disciplined long-term work, organizing, service to others", bad: "Shortcuts, procrastination on responsibilities" },
    Rahu: { good: "Technology, foreign connections, unconventional approaches", bad: "Deception, get-rich-quick schemes, addictive habits" },
    Ketu: { good: "Meditation, research, spiritual study, letting go", bad: "Attachment to outcomes, starting brand-new ventures" },
  }

  const dashaInfo = dashaActivities[mahadasha]
  if (dashaInfo) {
    favorable.push(`${mahadasha} Dasha favors: ${dashaInfo.good}`)
    unfavorable.push(`During ${mahadasha} period, avoid: ${dashaInfo.bad}`)
  }

  // ── 2. Birth-chart-specific: Moon house activities ──
  const houseActivities: Record<number, { good: string; bad: string }> = {
    1: { good: "Self-improvement, personal branding, health focus", bad: "Neglecting your appearance or health signals" },
    2: { good: "Financial review, family conversations, saving", bad: "Harsh speech, risky financial bets" },
    3: { good: "Communication, short trips, sibling bonding, writing", bad: "Gossip, unnecessary arguments with neighbors/siblings" },
    4: { good: "Home improvement, mother-related matters, rest", bad: "Real estate decisions without research, emotional eating" },
    5: { good: "Creative work, romance, children's matters, learning", bad: "Speculative investments, gambling" },
    6: { good: "Health checkup, defeating competition, service work", bad: "Lending money, ignoring health symptoms" },
    7: { good: "Partnership discussions, meeting new people, negotiation", bad: "Confrontation with spouse/partner, legal disputes" },
    8: { good: "Research, transformation work, insurance matters", bad: "Occult experimentation without guidance, risky ventures" },
    9: { good: "Spiritual pursuit, higher learning, father-related matters", bad: "Dismissing others' beliefs, dogmatic behavior" },
    10: { good: "Career advancement, public-facing work, leadership", bad: "Cutting corners at work, ego-driven decisions" },
    11: { good: "Networking, group activities, pursuing long-term goals", bad: "Trusting unreliable friends, overpromising" },
    12: { good: "Meditation, rest, charitable giving, foreign connections", bad: "Excessive spending, isolation from loved ones" },
  }

  const houseInfo = houseActivities[moonHouse]
  if (houseInfo) {
    favorable.push(`Moon in your ${moonHouse}th house: ${houseInfo.good}`)
    unfavorable.push(`With Moon in house ${moonHouse}: ${houseInfo.bad}`)
  }

  // ── 3. Transit trend + antardasha context ──
  if (transitAnalysis.overallTrend === "favorable") {
    favorable.push(`${antardasha} sub-period supports: starting new initiatives`)
  } else if (transitAnalysis.overallTrend === "challenging") {
    unfavorable.push(`${antardasha} sub-period cautions against: impulsive new starts`)
    favorable.push("Completing pending work, introspection, and planning")
  }

  // ── 4. Panchang-based (same for all — but location-specific via panchang calc) ──
  if (panchang.tithi.name.includes("Purnima")) {
    favorable.push("Spiritual practices, charity, starting auspicious work")
  }
  if (panchang.tithi.name.includes("Amavasya")) {
    unfavorable.push("Starting new work, travel")
    favorable.push("Ancestral rituals (Tarpan), meditation")
  }

  const auspiciousYogas = ["Siddha", "Shiva", "Sadhya", "Shubha", "Brahma", "Indra", "Priti", "Saubhagya"]
  const inauspiciousYogas = ["Vyaghata", "Vajra", "Atiganda", "Shoola", "Ganda", "Vishkumbha"]
  if (auspiciousYogas.includes(panchang.yoga.name)) {
    favorable.push(`${panchang.yoga.name} Yoga active: ceremonies and investments`)
  } else if (inauspiciousYogas.includes(panchang.yoga.name)) {
    unfavorable.push(`${panchang.yoga.name} Yoga active: delay signing contracts or ceremonies`)
  }

  if (panchang.rahukaal) {
    unfavorable.push(`Avoid important work during Rahu Kaal (${panchang.rahukaal.start} - ${panchang.rahukaal.end})`)
  }

  if (panchang.karana.name === "Vishti") {
    unfavorable.push("Auspicious ceremonies (Vishti/Bhadra Karana active)")
  }

  // Ensure at least 2 items each
  if (favorable.length < 2) favorable.push("Routine work aligned with your dasha rhythm")
  if (unfavorable.length < 2) unfavorable.push("Overexertion beyond your current energy cycle")

  return {
    favorable: favorable.slice(0, 5),
    unfavorable: unfavorable.slice(0, 4),
  }
}

// ─── Daily Remedy Selection ─────────────────────────────

function selectDailyRemedy(
  dayOfWeek: number,
  activeMahadasha: string,
  natalChart: NatalChart
): DailyInsight["dailyRemedy"] {
  // Find the weakest planet
  let weakestPlanet: string | null = null

  // 1. Check for debilitated planets (highest priority)
  const debilitatedPlanets = natalChart.planets.filter(p => p.isDebilitated === true)
  if (debilitatedPlanets.length > 0) {
    weakestPlanet = debilitatedPlanets[0].name
  }

  // 2. Check for planets in enemy dignity (second priority)
  if (!weakestPlanet) {
    const enemyPlanets = natalChart.planets.filter(p => p.dignity === "enemy")
    if (enemyPlanets.length > 0) {
      weakestPlanet = enemyPlanets[0].name
    }
  }

  // 3. Check for planets in houses 6, 8, or 12 (third priority)
  if (!weakestPlanet) {
    const afflictedPlanets = natalChart.planets.filter(p => [6, 8, 12].includes(p.house))
    if (afflictedPlanets.length > 0) {
      weakestPlanet = afflictedPlanets[0].name
    }
  }

  // Map weekdays to ruling planets
  const dayPlanets: PlanetName[] = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn",
  ]
  const dayPlanet = dayPlanets[dayOfWeek]

  // Use weakest planet on odd days, dasha lord on even days
  const planet = dayOfWeek % 2 === 1 && weakestPlanet
    ? (weakestPlanet as PlanetName)
    : (activeMahadasha as PlanetName)

  const remedySet = PLANET_REMEDIES[planet]
  if (!remedySet) {
    return {
      planet,
      type: "mantra",
      remedy: "Chant Om Namah Shivaya 108 times",
      reason: `General spiritual practice for ${planet} day`,
    }
  }

  // Rotate through remedy types based on day of month
  const dayOfMonth = new Date().getDate()
  const remedyTypes = ["mantra", "charity", "fasting", "gemstone"] as const
  const selectedType = remedyTypes[dayOfMonth % remedyTypes.length]

  switch (selectedType) {
    case "mantra":
      return {
        planet,
        type: "mantra",
        remedy: `Chant ${remedySet.mantra.beejMantra} ${remedySet.mantra.beejCount} times during ${remedySet.mantra.chantingTime}`,
        reason: `Today is ruled by ${dayPlanet}. Strengthen ${planet}'s energy through mantra.`,
      }
    case "charity":
      return {
        planet,
        type: "charity",
        remedy: `Donate ${remedySet.charity.items.slice(0, 2).join(" or ")} to ${remedySet.charity.donateToWhom}`,
        reason: `Charity for ${planet} helps mitigate afflictions and generate positive karma.`,
      }
    case "fasting":
      return {
        planet,
        type: "fasting",
        remedy: `Consider ${remedySet.fasting.type} fast. Eat: ${remedySet.fasting.allowedFoods.slice(0, 3).join(", ")}`,
        reason: `Fasting on ${remedySet.fasting.day} strengthens ${planet}'s blessings in your chart.`,
      }
    case "gemstone":
      return {
        planet,
        type: "gemstone",
        remedy: `Wearing ${remedySet.gemstone.name} (${remedySet.gemstone.caratRecommended} ct in ${remedySet.gemstone.metal}) on ${remedySet.gemstone.finger} strengthens ${planet}`,
        reason: `Gemstone therapy channels ${planet}'s cosmic energy. Consult an astrologer before wearing.`,
      }
  }
}

// ─── BPHS Verse of the Day ──────────────────────────────

const BPHS_DAILY_VERSES = [
  { source: "BPHS", chapter: 1, topic: "Creation", insight: "The Supreme Being, in the form of Time (Kala), creates and dissolves all beings through the grahas (planets). Understanding this cosmic dance is the essence of Jyotish." },
  { source: "BPHS", chapter: 3, topic: "Nature of Planets", insight: "The Sun is the soul, Moon the mind, Mars the strength, Mercury the speech, Jupiter the wisdom, Venus the desire, and Saturn the sorrow. Each planet reflects an aspect of our being." },
  { source: "BPHS", chapter: 6, topic: "Divisional Charts", insight: "Just as a seed contains the entire tree, the natal chart contains all divisional charts. Navamsa (D9) reveals the fruit of dharma and the nature of the spouse." },
  { source: "BPHS", chapter: 11, topic: "House Meanings", insight: "The 1st house is the self, the 7th is the other. The 10th house represents one's karma in the world — the actions by which one is remembered." },
  { source: "BPHS", chapter: 15, topic: "Raj Yoga", insight: "When lords of Kendra (1,4,7,10) and Trikona (1,5,9) houses associate, Raj Yoga is formed — promising power, position, and prosperity to the native." },
  { source: "BPHS", chapter: 25, topic: "Pancha Mahapurusha", insight: "When Mars, Mercury, Jupiter, Venus, or Saturn occupy their own or exaltation sign in a Kendra house, the native becomes a great person (Mahapurusha)." },
  { source: "BPHS", chapter: 34, topic: "Yogas", insight: "Gajakesari Yoga (Jupiter in Kendra from Moon) gives wisdom, wealth, and fame — like the elephant among animals, the native commands respect." },
  { source: "BPHS", chapter: 41, topic: "Dosha", insight: "Doshas are not curses but karmic indicators. They point to areas of life requiring conscious effort and spiritual practice for transformation." },
  { source: "BPHS", chapter: 46, topic: "Vimshottari Dasha", insight: "The Vimshottari Dasha unfolds karma through 120 years of planetary periods. The Dasha lord's dignity and house determine the quality of that period." },
  { source: "BPHS", chapter: 65, topic: "Transit (Gochar)", insight: "Planets in transit activate different houses from the natal Moon. Saturn's transit through the 12th, 1st, and 2nd from Moon is Sade Sati — a period of karmic pruning." },
  { source: "BPHS", chapter: 77, topic: "Remedies", insight: "Remedies are not about changing fate but aligning with cosmic rhythm. Mantras, gemstones, fasting, and charity create resonance with planetary energies." },
  { source: "BPHS", chapter: 80, topic: "Ishta Devata", insight: "The 12th lord from Karakamsha (Atmakaraka in Navamsa) indicates one's Ishta Devata — the personal deity that guides the soul's spiritual evolution." },
  { source: "Saravali", chapter: 2, topic: "Hora", insight: "The Hora chart (D2) reveals wealth potential. Planets in Sun's Hora give wealth through authority; in Moon's Hora, through public service and nurturing." },
  { source: "Phaladeepika", chapter: 6, topic: "Bhava Results", insight: "A strong 9th house brings fortune not by luck but by dharma — righteous actions in past lives bearing fruit in this one." },
  { source: "BPHS", chapter: 3, topic: "Rahu-Ketu", insight: "Rahu amplifies worldly desires while Ketu detaches from them. Together they represent the axis of karmic evolution — what the soul craves versus what it must release." },
  { source: "BPHS", chapter: 28, topic: "Neecha Bhanga", insight: "Even debilitated planets can produce Raj Yoga through cancellation (Neecha Bhanga). Adversity transformed into strength is the highest form of yoga." },
  { source: "Jataka Parijata", chapter: 4, topic: "Dignity", insight: "A planet in its own sign is like a king in his own kingdom — confident and powerful. In exaltation, it reaches its highest potential." },
  { source: "BPHS", chapter: 50, topic: "Dasha Effects", insight: "During Jupiter's Dasha, wisdom dawns naturally. During Saturn's Dasha, patience becomes the greatest teacher. Each period serves the soul's growth." },
  { source: "BPHS", chapter: 7, topic: "Nakshatras", insight: "The 27 Nakshatras are the cosmic mansions of the Moon. Your Janma Nakshatra reveals your emotional nature, instinctive responses, and karmic patterns." },
  { source: "Saravali", chapter: 30, topic: "Female Horoscopy", insight: "The 7th and 8th houses, Venus, Jupiter, and Moon together paint the picture of married life. A well-placed Jupiter protects marriage through wisdom." },
]

function getDailyBPHSVerse(dayOfYear: number, mahadasha: string, nakshatraName: string): DailyInsight["bphsVerse"] {
  // Topic priority based on mahadasha
  const topicPriorities: Record<string, string[]> = {
    Saturn: ["Doshas", "Remedies", "Dasha Effects", "Transit"],
    Rahu: ["Doshas", "Remedies", "Dasha Effects", "Transit"],
    Ketu: ["Doshas", "Remedies", "Dasha Effects", "Transit"],
    Jupiter: ["Raj Yoga", "Pancha Mahapurusha", "Yogas", "Nature of Planets"],
    Venus: ["Raj Yoga", "Pancha Mahapurusha", "Yogas", "Nature of Planets"],
    Sun: ["House Meanings", "Nature of Planets", "Dignity", "Dasha Effects"],
    Mars: ["House Meanings", "Nature of Planets", "Dignity", "Dasha Effects"],
    Moon: ["Nakshatras", "Hora", "Divisional Charts", "Nature of Planets"],
    Mercury: ["Nakshatras", "Hora", "Divisional Charts", "Nature of Planets"],
  }

  const priorities = topicPriorities[mahadasha] || []

  // Filter verses by topic priority
  let filtered = BPHS_DAILY_VERSES
  if (priorities.length > 0) {
    filtered = BPHS_DAILY_VERSES.filter(v => priorities.includes(v.topic))
  }

  // If no matches, fall back to full pool with hash including nakshatra
  if (filtered.length === 0) {
    filtered = BPHS_DAILY_VERSES
    const hash = Array.from(mahadasha + nakshatraName).reduce((acc, char) => acc + char.charCodeAt(0), dayOfYear)
    return BPHS_DAILY_VERSES[hash % BPHS_DAILY_VERSES.length]
  }

  return filtered[dayOfYear % filtered.length]
}

// ─── Headline Generator ─────────────────────────────────

function generateHeadline(
  transitAnalysis: FullTransitAnalysis,
  panchang: Panchang,
  mahadasha: string,
  birthDate: string
): string {
  const trend = transitAnalysis.overallTrend
  const tithiName = panchang.tithi.name
  const yogaName = panchang.yoga.name
  const dateStr = new Date().toISOString().split("T")[0]

  // Check for special days (Purnima, Amavasya, Ekadashi)
  const isSpecial = tithiName.includes("Purnima") || tithiName.includes("Amavasya") || tithiName.includes("Ekadashi")

  if (isSpecial) {
    return `${tithiName} — a sacred day during your ${mahadasha} Mahadasha.`
  }

  // Create a hash from dateStr + birthDate + mahadasha for user-specific headline rotation
  const hashInput = dateStr + birthDate + mahadasha
  const hash = Array.from(hashInput).reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Use hash to rotate templates so different users get different headlines
  if (trend === "favorable") {
    const pool = [
      `${mahadasha} Dasha aligns with today's transits — favorable energy for action.`,
      `Strong day ahead — ${mahadasha} period amplifies today's ${yogaName} Yoga.`,
      `Positive transit window during your ${mahadasha} Mahadasha — make it count.`,
    ]
    return pool[hash % pool.length]
  }

  if (trend === "challenging") {
    const pool = [
      `${mahadasha} Dasha meets resistance today — patience is your strength.`,
      `Today's transits test your ${mahadasha} period — move thoughtfully.`,
      `${yogaName} Yoga + ${mahadasha} Dasha: a day for inner work over outer action.`,
    ]
    return pool[hash % pool.length]
  }

  const pool = [
    `${mahadasha} Dasha meets mixed signals — selective action wins.`,
    `Balanced energy today during ${mahadasha} period — trust your rhythm.`,
    `${yogaName} Yoga in your ${mahadasha} phase — read before you leap.`,
  ]
  return pool[hash % pool.length]
}

// ─── Main Generator ─────────────────────────────────────

export async function generateDailyInsight(
  userId: string,
  birthDetails: BirthDetails,
  name: string,
  date?: Date
): Promise<DailyInsight> {
  const targetDate = date || new Date()
  const dayOfYear = Math.floor(
    (targetDate.getTime() - new Date(targetDate.getFullYear(), 0, 0).getTime()) /
    (1000 * 60 * 60 * 24)
  )

  // 1. Generate natal chart
  const natalChart = await generateNatalChart(birthDetails, name)

  // 2. Calculate Panchang
  const panchang = await calculatePanchang(
    targetDate,
    birthDetails.latitude,
    birthDetails.longitude
  )

  // 3. Analyze transits
  const transitAnalysis = await analyzeTransits(natalChart, targetDate)

  // 4. Moon transit
  const moonTransit = await getMoonTransit(natalChart, targetDate)

  // 5. Active Dasha
  const dashaAnalysis = calculateFullDasha(natalChart)
  const currentMaha = dashaAnalysis.currentMahadasha?.planet || "Saturn"
  const currentAntar = dashaAnalysis.currentAntardasha?.planet || "Mercury"

  // Try to find pratyantar from timeline
  const timeline = getDashaTimeline(natalChart, 1)
  const now = targetDate.getTime()
  const currentPeriod = timeline.find(
    t => t.startDate.getTime() <= now && t.endDate.getTime() >= now
  )

  // 6. Build key transits (slow-moving only)
  const keyTransits = transitAnalysis.transits
    .filter(t => ["Saturn", "Jupiter", "Rahu", "Ketu"].includes(t.planet))
    .map(t => ({
      planet: t.planet,
      sign: t.transitSign,
      houseFromMoon: t.houseFromMoon,
      isBenefic: t.isBeneficTransit,
      effect: t.effect,
      significance: t.significance,
    }))

  // 7. Activities (personalized with dasha + moon house)
  const activities = getActivityRecommendations(
    panchang,
    transitAnalysis,
    currentMaha,
    currentAntar,
    moonTransit.currentSign,
    moonTransit.houseFromNatalMoon,
  )

  // 8. Daily remedy
  const dailyRemedy = selectDailyRemedy(targetDate.getDay(), currentMaha, natalChart)

  // 9. BPHS verse
  const bphsVerse = getDailyBPHSVerse(dayOfYear, currentMaha, panchang.nakshatra.name)

  // 10. Headline
  const headline = generateHeadline(transitAnalysis, panchang, currentMaha, birthDetails.date)

  return {
    userId,
    date: targetDate.toISOString().split("T")[0],
    name,

    panchang: {
      tithi: panchang.tithi.name,
      nakshatra: panchang.nakshatra.name,
      yoga: panchang.yoga.name,
      karana: panchang.karana.name,
      vara: panchang.var.name,
      rahuKaal: panchang.rahukaal
        ? `${panchang.rahukaal.start} - ${panchang.rahukaal.end}`
        : "N/A",
      auspicious: panchang.auspicious,
      inauspicious: panchang.inauspicious,
      summary: getPanchangSummary(panchang),
    },

    moonTransit: {
      currentSign: moonTransit.currentSign,
      houseFromMoon: moonTransit.houseFromNatalMoon,
      houseFromLagna: moonTransit.houseFromLagna,
      effect: moonTransit.effect,
      nakshatra: moonTransit.nakshatra,
    },

    keyTransits,

    overallTrend: transitAnalysis.overallTrend,
    sadeSatiActive: transitAnalysis.sadeSatiStatus?.isActive || false,
    sadeSatiPhase: transitAnalysis.sadeSatiStatus?.phase || null,
    sadeSatiAdvice: transitAnalysis.sadeSatiStatus?.advice || null,

    dashaContext: {
      mahadasha: currentMaha,
      antardasha: currentAntar,
      pratyantardasha: null, // Would need deeper dasha calculation
      interpretation: getDashaInterpretation(currentMaha, currentAntar, natalChart),
    },

    dailyRemedy,
    bphsVerse,
    activities,
    headline,
  }
}
