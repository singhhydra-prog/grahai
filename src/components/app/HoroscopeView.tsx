"use client"

/* ════════════════════════════════════════════════════════
   Product 2 — Daily Horoscope (Personalized)

   Beautiful, punchy daily predictions with Vedic depth.
   Works for both logged-in (personalized) and anonymous
   (sign-based) users. Inspired by Co-Star's minimal
   aesthetic but with real Vedic astrology substance.
   ════════════════════════════════════════════════════════ */

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sun, Moon, Star, ArrowRight, ChevronDown, ChevronUp, ArrowLeft,
  Heart, Briefcase, Brain, Sparkles, TrendingUp, Shield,
  Clock, Zap, Eye, RefreshCw, Share2, MessageCircle
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────

interface SignData {
  id: number
  name: string
  sanskrit: string
  symbol: string
  element: "Fire" | "Earth" | "Air" | "Water"
  ruler: string
  dateRange: string
}

interface DailyPrediction {
  overall: string
  love: string
  career: string
  health: string
  spiritual: string
  luckyNumber: number
  luckyColor: string
  luckyTime: string
  overallScore: number   // 1-10
  loveScore: number
  careerScore: number
  healthScore: number
  spiritualScore: number
  mantra: string
  remedy: string
  avoid: string
  moonNakshatra: string
  planetaryInfluence: string
}

interface PanchangData {
  tithi: string
  nakshatra: string
  yoga: string
  karana: string
  vara: string
  sunRise: string
  sunSet: string
  moonSign: string
  rahukaal: string
}

// ─── Constants ──────────────────────────────────────────

const SIGNS: SignData[] = [
  { id: 1,  name: "Aries",       sanskrit: "मेष",    symbol: "♈", element: "Fire",  ruler: "Mars",    dateRange: "Mar 21 – Apr 19" },
  { id: 2,  name: "Taurus",      sanskrit: "वृषभ",   symbol: "♉", element: "Earth", ruler: "Venus",   dateRange: "Apr 20 – May 20" },
  { id: 3,  name: "Gemini",      sanskrit: "मिथुन",  symbol: "♊", element: "Air",   ruler: "Mercury", dateRange: "May 21 – Jun 20" },
  { id: 4,  name: "Cancer",      sanskrit: "कर्क",   symbol: "♋", element: "Water", ruler: "Moon",    dateRange: "Jun 21 – Jul 22" },
  { id: 5,  name: "Leo",         sanskrit: "सिंह",   symbol: "♌", element: "Fire",  ruler: "Sun",     dateRange: "Jul 23 – Aug 22" },
  { id: 6,  name: "Virgo",       sanskrit: "कन्या",  symbol: "♍", element: "Earth", ruler: "Mercury", dateRange: "Aug 23 – Sep 22" },
  { id: 7,  name: "Libra",       sanskrit: "तुला",   symbol: "♎", element: "Air",   ruler: "Venus",   dateRange: "Sep 23 – Oct 22" },
  { id: 8,  name: "Scorpio",     sanskrit: "वृश्चिक", symbol: "♏", element: "Water", ruler: "Mars",   dateRange: "Oct 23 – Nov 21" },
  { id: 9,  name: "Sagittarius", sanskrit: "धनु",    symbol: "♐", element: "Fire",  ruler: "Jupiter", dateRange: "Nov 22 – Dec 21" },
  { id: 10, name: "Capricorn",   sanskrit: "मकर",    symbol: "♑", element: "Earth", ruler: "Saturn",  dateRange: "Dec 22 – Jan 19" },
  { id: 11, name: "Aquarius",    sanskrit: "कुम्भ",  symbol: "♒", element: "Air",   ruler: "Saturn",  dateRange: "Jan 20 – Feb 18" },
  { id: 12, name: "Pisces",      sanskrit: "मीन",    symbol: "♓", element: "Water", ruler: "Jupiter", dateRange: "Feb 19 – Mar 20" },
]

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#E85454",
  Earth: "#4ADE80",
  Air: "#60A5FA",
  Water: "#8B8BCD",
}

// ─── Astronomical Helpers ─────────────────────────────────

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
]

const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
]

const YOGA_NAMES = [
  "Vishkambha", "Preeti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
]

const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti",
  "Shakuni", "Chatushpada", "Nagava", "Kimstughna",
]

const VARA_NAMES = [
  "Ravivara (Sunday)", "Somavara (Monday)", "Mangalavara (Tuesday)",
  "Budhavara (Wednesday)", "Guruvara (Thursday)", "Shukravara (Friday)",
  "Shanivara (Saturday)",
]

/** Rahu Kaal is fixed per weekday (for a ~6AM sunrise city like Delhi) */
const RAHUKAAL_TABLE: Record<number, string> = {
  0: "4:30 PM – 6:00 PM",
  1: "7:30 AM – 9:00 AM",
  2: "3:00 PM – 4:30 PM",
  3: "12:00 PM – 1:30 PM",
  4: "1:30 PM – 3:00 PM",
  5: "10:30 AM – 12:00 PM",
  6: "9:00 AM – 10:30 AM",
}

/** Meeus-style Sun longitude (tropical, degrees) */
function computeSunLong(jde: number): number {
  const T = (jde - 2451545.0) / 36525.0
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360
  const M = ((357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360) * Math.PI / 180
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M) + 0.000290 * Math.sin(3 * M)
  let lon = (L0 + C) % 360
  if (lon < 0) lon += 360
  return lon
}

/** Simplified Moon longitude (tropical, degrees) — Brown model approx */
function computeMoonLong(jde: number): number {
  const T = (jde - 2451545.0) / 36525.0
  const Lp = (218.3165 + 481267.8813 * T) % 360
  const D = ((297.8502 + 445267.1115 * T) % 360) * Math.PI / 180
  const M = ((357.5291 + 35999.0503 * T) % 360) * Math.PI / 180
  const Mp = ((134.9634 + 477198.8676 * T) % 360) * Math.PI / 180
  const F = ((93.2720 + 483202.0175 * T) % 360) * Math.PI / 180
  let lon = Lp
    + 6.289 * Math.sin(Mp)
    - 1.274 * Math.sin(2 * D - Mp)
    + 0.658 * Math.sin(2 * D)
    + 0.214 * Math.sin(2 * Mp)
    - 0.186 * Math.sin(M)
    - 0.114 * Math.sin(2 * F)
    + 0.059 * Math.sin(2 * D - 2 * Mp)
    + 0.057 * Math.sin(2 * D - M - Mp)
  lon = lon % 360
  if (lon < 0) lon += 360
  return lon
}

/** Convert a YYYY-MM-DD string + noon IST → Julian Day Number */
function dateToJDE(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number)
  // noon IST = 06:30 UT
  const utHour = 6.5
  let Y = y, M = m
  if (M <= 2) { Y -= 1; M += 12 }
  const A = Math.floor(Y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + utHour / 24 + B - 1524.5
}

/** Lahiri ayanamsa approximation */
function lahiriAyanamsa(jde: number): number {
  const T = (jde - 2451545.0) / 36525.0
  return 23.85 + 0.0137 * (jde - 2451545.0) / 365.25
}

/** Tropical → Sidereal */
function toSidereal(tropical: number, jde: number): number {
  let s = tropical - lahiriAyanamsa(jde)
  if (s < 0) s += 360
  if (s >= 360) s -= 360
  return s
}

/** Approx sunrise/sunset in IST */
function approxSunrise(dateStr: string): { rise: string; set: string } {
  const jde = dateToJDE(dateStr)
  const sunLong = toSidereal(computeSunLong(jde), jde)
  const rise = ((5 + (sunLong / 60)) % 24).toFixed(1)
  const set = ((17.5 + (sunLong / 60)) % 24).toFixed(1)
  return { rise, set }
}

/** Simple seeded RNG for reproducible results */
function seedRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

/** Planetary Influence DB */
const PLANETARY_INFLUENCE_DB: Record<string, { mantras: string[]; remedies: string[]; colors: string[]; numbers: number[]; avoids: string[] }> = {
  Sun: {
    mantras: ["ॐ सूर्याय नमः — Om Suryaya Namah", "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः — Om Hraam Hreem Hraum Sah Suryaya Namah"],
    remedies: ["Offer water to the Sun at sunrise while chanting Gayatri mantra 11 times.", "Wear a ruby or garnet to strengthen the Sun's vitality in your chart."],
    colors: ["Gold", "Saffron", "Orange"],
    numbers: [1, 10, 19],
    avoids: ["Avoid ego conflicts with authority figures — the Sun intensifies pride today.", "Don't skip meals, especially breakfast — the Sun governs digestive fire."],
  },
  Jupiter: {
    mantras: ["ॐ बृहस्पतये नमः — Om Brihaspataye Namah", "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः — Om Graam Greem Graum Sah Gurave Namah"],
    remedies: ["Apply turmeric tilak and visit a temple on Thursday for Jupiter's blessings.", "Teach or mentor someone today — Jupiter rewards the sharing of knowledge."],
    colors: ["Yellow", "Gold", "Turmeric"],
    numbers: [3, 12, 21],
    avoids: ["Avoid dishonesty or exaggeration — Jupiter penalizes falsehood swiftly.", "Don't ignore the advice of elders or teachers today."],
  },
  Saturn: {
    mantras: ["ॐ शनैश्चराय नमः — Om Shanaishcharaya Namah", "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः — Om Praam Preem Praum Sah Shanaishcharaya Namah"],
    remedies: ["Feed the needy or donate black sesame seeds on Saturday for Saturn's grace.", "Light a sesame oil lamp under a Peepal tree in the evening."],
    colors: ["Blue", "Black", "Indigo"],
    numbers: [8, 17, 26],
    avoids: ["Avoid laziness and procrastination — Saturn rewards discipline, punishes sloth.", "Don't waste food or resources today — Saturn watches for extravagance."],
  },
}

/** Sign-specific overall prediction templates keyed by ruler planet */
function getOverallPrediction(sign: SignData, moonSignName: string, nakName: string, rand: () => number): string {
  const ruler = sign.ruler
  const templates: Record<string, string[]> = {
    Mars: [
      `The warrior spirit within ${sign.name} is awakened today. Mars drives you toward bold action and decisive leadership. Channel this fiery energy into constructive pursuits — competition, sports, or standing up for what you believe in. Passion runs high.`,
      `${sign.name}, Mars today gifts you courage and assertion. Break through obstacles that seemed insurmountable. This is a day for confident strides, not hesitation. Harness this force to pioneer new paths.`,
    ],
    Venus: [
      `Venus whispers to ${sign.name} today: beauty, charm, and connection are your superpowers. Whether in love or social dealings, your magnetism is enhanced. Nurture relationships. Enjoy life's pleasures without guilt.`,
      `The evening star shines favorably on you, ${sign.name}. Grace flows through your words and actions. Artistic endeavors flourish. Financial fortune may surprise you. Romance is in the air.`,
    ],
    Mercury: [
      `Mercury quickens your mind, ${sign.name}. Communication, travel, and intellectual pursuits thrive. Speak truthfully and persuasively. Networking opens doors. Quick thinking solves problems that seemed complex yesterday.`,
      `${sign.name}, the messenger planet aligns with your curiosity. Learning, writing, and short journeys bring joy. Connections deepen. Misunderstandings clear up if you listen as much as you speak.`,
    ],
    Moon: [
      `The Moon governs your emotions, ${sign.name}. Today brings introspection and emotional depth. Trust your intuition — it's extraordinarily sharp. Family and home matters come into focus. Care for yourself tenderly.`,
      `Your inner world is vivid, ${sign.name}. The Moon invites you to listen to your feelings without judgment. Creativity flows. Connection with loved ones deepens. A dream may surface with new meaning.`,
    ],
    Sun: [
      `The Sun emboldens you, ${sign.name}. This is your day to shine with authenticity and conviction. Leadership roles call. Your vitality is peak. Pursue what truly matters to you. Others follow your light.`,
      `${sign.name}, the Sun radiates through you. Confidence is your companion. Take charge. Visibility and recognition come naturally. This is a day to step into your power and claim your space.`,
    ],
    Jupiter: [
      `Benevolent Jupiter expands your horizons, ${sign.name}. Luck, optimism, and growth are yours to claim. A new opportunity or positive news may arrive. Generosity brings blessings. Think big.`,
      `${sign.name}, Jupiter's grace surrounds you. Wisdom grows. A mentor may offer guidance. Doors open that were closed. This is a blessed day — approach it with gratitude and vision.`,
    ],
    Saturn: [
      `Saturn teaches through discipline, ${sign.name}. Today calls for patience, hard work, and long-term thinking. Delays are not setbacks but wisdom. Build on solid ground. Respect tradition. Your maturity is your strength.`,
      `${sign.name}, Saturn reminds you: meaningful progress takes time. Focus on what lasts. Responsibility felt today becomes reward later. Persevere. Your integrity is your greatest asset.`,
    ],
  }

  const lines = templates[ruler] || ["A day of cosmic balance awaits you."]
  return lines[Math.floor(rand() * lines.length)]
}

/** Love life prediction */
function getLovePrediction(ruler: string, rand: () => number): string {
  const templates: Record<string, string[]> = {
    Mars: ["Passion ignites. If single, attraction is magnetic. If coupled, intimacy deepens — but mind sharp words.", "Romance sparks. Use this fiery energy to express desire, not aggression. Bold moves can succeed."],
    Venus: ["Love blossoms effortlessly. Attraction is mutual. Relationships deepen. Singles: expect a meaningful connection.", "Your heart is magnetic. Alone or together, affection flows. A romantic surprise may arrive."],
    Mercury: ["Witty banter sparks attraction. Communication is your superpower. Misunderstandings dissolve with honesty.", "Love thrives through conversation. A meaningful exchange deepens bonds. Laughter bonds you."],
    Moon: ["Emotions are heightened. Vulnerabilities shared deepen intimacy. Singles: an intuitive connection draws near.", "Your tender heart opens doors. Empathy wins hearts. Family bonds strengthen alongside romance."],
    Sun: ["Confidence attracts love. You shine. Relationships move forward boldly. Singles: visibility brings suitors.", "Your warmth is irresistible. Step into your power. Love responds to authentic presence."],
    Jupiter: ["Relationships expand. A proposal or new commitment may arrive. Luck favors romance. Generosity is returned.", "Love is abundant. A blessing arrives unexpectedly. Relationships mature into something deeper."],
    Saturn: ["Relationships deepen through commitment. Testing times reveal true connection. Build on what lasts.", "Love matures. Surface attractions fade; authentic bonds strengthen. If struggling, clarity comes."],
  }
  const lines = templates[ruler] || ["Love flows at its own pace."]
  return lines[Math.floor(rand() * lines.length)]
}

/** Career & finance prediction */
function getCareerPrediction(ruler: string, rand: () => number): string {
  const templates: Record<string, string[]> = {
    Mars: ["Ambition peaks. Seize opportunities to lead. Negotiate from strength. Competition sharpens your edge.", "Action moves your career forward. Take calculated risks. Leadership is recognized. Financial growth beckons."],
    Venus: ["Creative projects flourish. Partnerships prosper. Networking brings opportunities. Financial luck favors you.", "Beauty in your work attracts recognition. Collaboration succeeds. Income may increase unexpectedly."],
    Mercury: ["Communication skills open doors. Negotiation succeeds. Contracts signed today favor you. Travel for work prospers.", "Ideas become opportunities. Learning accelerates growth. A key connection is made. Success in communication-heavy tasks."],
    Moon: ["Intuition guides career moves. Working with the public succeeds. Financial intuition is sharp.", "Your empathy is a career asset. Nurturing roles thrive. A gut feeling about money is accurate."],
    Sun: ["Visibility brings opportunity. Take credit for your work. Leadership is yours. Career peaks.", "You are noticed and promoted. Authority comes naturally. Financial success follows authentic action."],
    Jupiter: ["Expansion is your theme. New roles, raises, or ventures succeed. Luck cascades. Invest wisely.", "A windfall or opportunity arrives. Your potential multiplies. Long-term plans gain traction."],
    Saturn: ["Steady progress through discipline. A promotion for sustained effort. Financial foundations solidify.", "Hard work yields real results. Responsibility is met with advancement. Build what lasts."],
  }
  const lines = templates[ruler] || ["Steady effort brings steady progress."]
  return lines[Math.floor(rand() * lines.length)]
}

/** Health prediction */
function getHealthPrediction(ruler: string, moonSign: string, rand: () => number): string {
  const templates: Record<string, string[]> = {
    Mars: ["Vitality peaks. Exercise brings joy. Channel restlessness into movement. Avoid overexertion.", "Energy flows. Physical activity suits you. Be mindful of inflammation; rest when needed."],
    Venus: ["Wellness through pleasure. Self-care feels luxurious. Skincare and relaxation restore balance.", "Harmony in your body. Indulgences are okay — balance them with mindfulness."],
    Mercury: ["Mental clarity peaks. Short walks aid thinking. Breathing exercises settle nerves.", "Your mind is sharp. Mental rest matters. Communication aids healing."],
    Moon: ["Emotional wellness is physical wellness. Nurture yourself. Hydration and rest are medicine.", "Listen to your body. Comfort matters. Emotional balance supports physical health."],
    Sun: ["Vitality radiates. Your immune system is strong. Sunlight heals. Confidence supports wellness.", "Strength is yours. Cardiovascular health excels. Inner light translates to outer glow."],
    Jupiter: ["Abundance of health. Prevention pays. Wellness practices thrive. Growth in strength.", "Healing accelerates. A health goal is within reach. Optimism itself is medicine."],
    Saturn: ["Build health habits now; they compound. Consistency matters. Chronic issues may need attention.", "Long-term wellness requires discipline. Invest in health today; reap benefits for years."],
  }
  const lines = templates[ruler] || ["Your body knows what it needs."]
  return lines[Math.floor(rand() * lines.length)]
}

/** Spiritual prediction */
function getSpiritualPrediction(nakName: string, rand: () => number): string {
  const templates = [
    "Your inner light is visible. Meditation deepens today. A spiritual insight arrives unbidden.",
    "The sacred stirs within. Dharma calls. Inner work bears fruit. Trust the process.",
    "Spirituality and daily life merge. A small ritual has profound impact. You are more than the physical.",
    "The divine speaks through your intuition. Listen. Gratitude opens doors to grace.",
    "Your soul seeks growth. Study, reflection, and practice nourish the spirit today.",
    "Transcendence whispers. A moment of clarity may arrive. You are part of something greater.",
  ]
  return templates[Math.floor(rand() * templates.length)]
}

/** Planetary influence summary */
function getPlanetaryInfluence(sign: SignData, moonSignName: string, sunSignIdx: number, rand: () => number): string {
  const planets = [sign.ruler, "Jupiter", "Saturn"]
  const chosen = planets[Math.floor(rand() * planets.length)]
  const db = PLANETARY_INFLUENCE_DB[chosen]
  if (!db) return "The planets align in your favor."
  return `${chosen} is prominent: ${db.remedies[Math.floor(rand() * db.remedies.length)]}`
}

/** Main prediction generator */
function generatePrediction(signId: number, dateStr: string): DailyPrediction {
  const sign = SIGNS.find((s) => s.id === signId)!
  const jde = dateToJDE(dateStr)
  const sunLong = toSidereal(computeSunLong(jde), jde)
  const moonLong = toSidereal(computeMoonLong(jde), jde)
  const sunSignIdx = Math.floor((sunLong + 15) / 30) % 12
  const moonSignIdx = Math.floor((moonLong + 15) / 30) % 12
  const moonSign = SIGNS[moonSignIdx]
  const nakIdx = Math.floor((moonLong + 6.67) / 13.33) % 27
  const nakName = NAKSHATRA_NAMES[nakIdx]

  // Seed for deterministic output
  const seed = signId * 10000 + parseInt(dateStr.replace(/-/g, ""))
  const rand = seedRandom(seed)

  return {
    overall: getOverallPrediction(sign, moonSign.name, nakName, rand),
    love: getLovePrediction(sign.ruler, rand),
    career: getCareerPrediction(sign.ruler, rand),
    health: getHealthPrediction(sign.ruler, moonSign.name, rand),
    spiritual: getSpiritualPrediction(nakName, rand),
    luckyNumber: Math.floor(rand() * 27) + 1,
    luckyColor: ELEMENT_COLORS[sign.element] === "#E85454" ? "Red" : ELEMENT_COLORS[sign.element] === "#4ADE80" ? "Green" : ELEMENT_COLORS[sign.element] === "#60A5FA" ? "Blue" : "Purple",
    luckyTime: ["6:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"][Math.floor(rand() * 4)],
    overallScore: Math.floor(rand() * 3) + 6,
    loveScore: Math.floor(rand() * 3) + 6,
    careerScore: Math.floor(rand() * 3) + 6,
    healthScore: Math.floor(rand() * 3) + 6,
    spiritualScore: Math.floor(rand() * 3) + 6,
    mantra: PLANETARY_INFLUENCE_DB[sign.ruler]?.mantras[Math.floor(rand() * 2)] || "ॐ शान्तिः शान्तिः शान्तिः — Om Shanti, Shanti, Shanti",
    remedy: PLANETARY_INFLUENCE_DB[sign.ruler]?.remedies[Math.floor(rand() * 2)] || "Meditate on the present moment.",
    avoid: PLANETARY_INFLUENCE_DB[sign.ruler]?.avoids[Math.floor(rand() * 2)] || "Avoid hasty decisions.",
    moonNakshatra: nakName,
    planetaryInfluence: getPlanetaryInfluence(sign, moonSign.name, sunSignIdx, rand),
  }
}

/** Panchang generator */
function generatePanchang(dateStr: string): PanchangData {
  const jde = dateToJDE(dateStr)
  const d = new Date(dateStr)
  const vara = VARA_NAMES[d.getDay()]
  const tithiIdx = Math.floor((toSidereal(computeMoonLong(jde), jde) - toSidereal(computeSunLong(jde), jde) + 360) % 360 / 12)
  const tithi = TITHI_NAMES[tithiIdx]
  const nakIdx = Math.floor((toSidereal(computeMoonLong(jde), jde) + 6.67) / 13.33) % 27
  const nakshatra = NAKSHATRA_NAMES[nakIdx]
  const yogaIdx = Math.floor((toSidereal(computeSunLong(jde), jde) + toSidereal(computeMoonLong(jde), jde)) / 13.33) % 27
  const yoga = YOGA_NAMES[yogaIdx]
  const karanaIdx = (tithiIdx * 2) % KARANA_NAMES.length
  const karana = KARANA_NAMES[karanaIdx]
  const sunrise = approxSunrise(dateStr)

  return {
    tithi,
    nakshatra,
    yoga,
    karana,
    vara,
    sunRise: sunrise.rise,
    sunSet: sunrise.set,
    moonSign: SIGNS[Math.floor((toSidereal(computeMoonLong(jde), jde) + 15) / 30) % 12].name,
    rahukaal: RAHUKAAL_TABLE[new Date(dateStr).getDay()],
  }
}

// ─── Sub-Components ─────────────────────────────────────

function ScoreBar({ score, label, icon: Icon, color }: { score: number; label: string; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <span className="text-xs font-medium text-text/60 min-w-24">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.05]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-xs font-semibold text-text/80">{score}/10</span>
    </div>
  )
}

function PanchangWidget({ panchang }: { panchang: PanchangData }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-5 space-y-4"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-text/80">📅 Today's Panchang</h3>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs"
          >
            {[
              { label: "Tithi", value: panchang.tithi },
              { label: "Nakshatra", value: panchang.nakshatra },
              { label: "Yoga", value: panchang.yoga },
              { label: "Karana", value: panchang.karana },
              { label: "Vara", value: panchang.vara },
              { label: "Moon Sign", value: panchang.moonSign },
              { label: "Sunrise", value: panchang.sunRise },
              { label: "Sunset", value: panchang.sunSet },
              { label: "Rahu Kaal", value: panchang.rahukaal },
            ].map((item) => (
              <div key={item.label} className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <p className="text-[10px] text-text-dim/50 uppercase mb-0.5">{item.label}</p>
                <p className="font-semibold text-text/80">{item.value}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function InsightCard({ title, icon: Icon, content, color, delay }: { title: string; icon: React.ElementType; content: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 flex items-start gap-3"
    >
      <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}15`, borderColor: `${color}30`, border: "1px solid" }}>
        <Icon className="h-3 w-3" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-semibold text-text/80 mb-2">{title}</h3>
        <p className="text-xs text-text/70 leading-relaxed">{content}</p>
      </div>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────

export default function HoroscopeView({ onBack, onAskAI, onUpgrade }: { onBack: () => void; onAskAI: () => void; onUpgrade: () => void }) {
  const [selectedSign, setSelectedSign] = useState<SignData | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)

  const today = new Date()
  const dateStr = today.toISOString().split("T")[0]
  const displayDate = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  const prediction = useMemo(() => {
    if (!selectedSign) return null
    return generatePrediction(selectedSign.id, dateStr)
  }, [selectedSign, dateStr])

  const panchang = useMemo(() => generatePanchang(dateStr), [dateStr])

  const handleSignSelect = (sign: SignData) => {
    setSelectedSign(sign)
    setShowResult(false)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowResult(true)
    }, 1200)
  }

  const handleBackClick = () => {
    setShowResult(false)
    setSelectedSign(null)
    onBack()
  }

  // ─── Sign Selector View ─────────────────────────────

  if (!showResult || loading) {
    return (
      <div className="min-h-screen bg-bg">
        {/* Sticky Back Header */}
        <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-bg/80 backdrop-blur-md px-6 py-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs text-text-dim/60 hover:text-gold/60 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-3">
              {displayDate}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              <span className="gold-text">Today's Horoscope</span>
            </h1>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto">
              आज का राशिफल
            </p>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto mt-2">
              Select your zodiac sign and see what the stars have in store for you today.
            </p>
          </motion.div>

          {/* Panchang Quick View */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <PanchangWidget panchang={panchang} />
          </motion.div>

          {/* Sign Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-text-dim/50 text-center mb-6 tracking-wide">
              Select your Moon Sign (Rashi) for personalized predictions
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {SIGNS.map((sign, i) => {
                const isSelected = selectedSign?.id === sign.id
                const elColor = ELEMENT_COLORS[sign.element]

                return (
                  <motion.button
                    key={sign.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSignSelect(sign)}
                    className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? "border-gold/40 bg-gold/[0.08]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-2xl">{sign.symbol}</span>
                    <span className="text-xs font-semibold text-text/80">{sign.name}</span>
                    <span className="text-[9px] text-text-dim/40 font-hindi">{sign.sanskrit}</span>
                    <span
                      className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                      style={{ background: elColor }}
                    />
                  </motion.button>
                )
              })}
            </div>

            {/* Element legend */}
            <div className="flex items-center justify-center gap-5 mt-5">
              {Object.entries(ELEMENT_COLORS).map(([el, color]) => (
                <div key={el} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] text-text-dim/40">{el}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm"
              >
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border border-gold/20 animate-[spin-slow_3s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-indigo/15 animate-[spin-reverse_4s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl">{selectedSign?.symbol}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-dim/60 tracking-[0.2em] uppercase">
                    Reading the stars for {selectedSign?.name}...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // ─── Result View ────────────────────────────────────

  if (!prediction || !selectedSign) return null

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky Back Header */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-bg/80 backdrop-blur-md px-6 py-4">
        <button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 text-xs text-text-dim/60 hover:text-gold/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Change Sign
        </button>
      </div>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.015] blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-6 py-12 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{selectedSign.symbol}</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {selectedSign.name} <span className="text-text-dim/40 font-hindi text-lg">{selectedSign.sanskrit}</span>
              </h1>
              <p className="text-[10px] text-text-dim/50 tracking-[0.2em] uppercase">{displayDate}</p>
            </div>
          </div>

          {/* Element + Ruler */}
          <div className="flex items-center justify-center gap-4">
            <span className="planet-badge" style={{ borderColor: `${ELEMENT_COLORS[selectedSign.element]}30`, color: ELEMENT_COLORS[selectedSign.element] }}>
              {selectedSign.element}
            </span>
            <span className="planet-badge">
              Ruler: {selectedSign.ruler}
            </span>
          </div>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 space-y-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/[0.08] flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gold/80 mb-1">Today&apos;s Cosmic Outlook</h2>
              <p className="text-sm text-text/80 leading-relaxed">{prediction.overall}</p>
            </div>
          </div>

          {/* Scores */}
          <div className="space-y-3 pt-2 border-t border-white/[0.04]">
            <ScoreBar score={prediction.overallScore} label="Overall" icon={Star} color="#E2C474" />
            <ScoreBar score={prediction.loveScore} label="Love ❤️" icon={Heart} color="#F0C8E0" />
            <ScoreBar score={prediction.careerScore} label="Career 💼" icon={Briefcase} color="#4ADE80" />
            <ScoreBar score={prediction.healthScore} label="Health 🏃" icon={Shield} color="#60A5FA" />
            <ScoreBar score={prediction.spiritualScore} label="Spiritual 🕉️" icon={Brain} color="#8B8BCD" />
          </div>

          {/* Lucky items */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-gold/50" />
              <span className="text-[10px] text-text-dim/50">Lucky #:</span>
              <span className="text-xs font-semibold text-gold/80">{prediction.luckyNumber}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-3 w-3 text-gold/50" />
              <span className="text-[10px] text-text-dim/50">Color:</span>
              <span className="text-xs font-semibold text-gold/80">{prediction.luckyColor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-gold/50" />
              <span className="text-[10px] text-text-dim/50">Time:</span>
              <span className="text-xs font-semibold text-gold/80">{prediction.luckyTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Planetary Influence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5 flex items-start gap-3"
        >
          <TrendingUp className="h-4 w-4 text-indigo shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-indigo/70 tracking-[0.15em] uppercase font-semibold mb-1">Planetary Transit</p>
            <p className="text-xs text-text/70 leading-relaxed">{prediction.planetaryInfluence}</p>
          </div>
        </motion.div>

        {/* Area Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InsightCard title="Love & Relationships" icon={Heart} content={prediction.love} color="#F0C8E0" delay={0.3} />
          <InsightCard title="Career & Finance" icon={Briefcase} content={prediction.career} color="#4ADE80" delay={0.35} />
          <InsightCard title="Health & Vitality" icon={Shield} content={prediction.health} color="#60A5FA" delay={0.4} />
          <InsightCard title="Spiritual Growth" icon={Brain} content={prediction.spiritual} color="#8B8BCD" delay={0.45} />
        </div>

        {/* Mantra & Remedy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 space-y-4"
        >
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-gold/60">🙏 Daily Mantra & Remedy</h3>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gold/[0.04] border border-gold/[0.08]">
              <p className="text-[10px] text-gold/50 uppercase tracking-wider mb-1">Mantra</p>
              <p className="text-sm text-gold-light/90 font-hindi leading-relaxed">{prediction.mantra}</p>
            </div>

            <div className="p-3 rounded-lg bg-green/[0.04] border border-green/[0.08]">
              <p className="text-[10px] text-green/50 uppercase tracking-wider mb-1">Remedy</p>
              <p className="text-xs text-text/70 leading-relaxed">{prediction.remedy}</p>
            </div>

            <div className="p-3 rounded-lg bg-red/[0.04] border border-red/[0.08]">
              <p className="text-[10px] text-red/50 uppercase tracking-wider mb-1">Avoid Today</p>
              <p className="text-xs text-text/70 leading-relaxed">{prediction.avoid}</p>
            </div>
          </div>
        </motion.div>

        {/* Panchang */}
        <PanchangWidget panchang={panchang} />

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] to-transparent p-6 text-center"
        >
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-gold/10 blur-[60px]" />
          <div className="relative z-10">
            <Sparkles className="w-5 h-5 text-gold mx-auto mb-2" />
            <p className="text-sm font-semibold text-text mb-1">
              Want personalized predictions?
            </p>
            <p className="text-xs text-text/50 mb-4 max-w-xs mx-auto">
              Get daily horoscopes based on your exact birth chart with Dasha analysis and remedies
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={onUpgrade}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-semibold text-black hover:bg-gold/90 transition-all"
              >
                <Star className="h-3.5 w-3.5" />
                Start Free, Upgrade Anytime
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onBack}
                className="text-xs text-gold/50 hover:text-gold/70 transition-colors"
              >
                Create free Kundli
              </button>
            </div>
          </div>
        </motion.div>

        {/* Personalized Reading Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mx-auto max-w-xl px-4 py-8">
            <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.03] overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-amber-500/10 blur-[60px]" />

              <div className="relative p-6">
                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" /> 10x More Accurate
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight mb-1">
                  Sun signs are just the surface
                </h3>
                <p className="text-sm text-white/50 mb-5">
                  Your Vedic birth chart has 9 planets, 12 houses, and 27 nakshatras — each telling a unique story. Get your real reading.
                </p>

                {/* Quick birth detail capture */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1 block">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-amber-500/30 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1 block">Birth City</label>
                    <input
                      type="text"
                      placeholder="e.g., Mumbai, Delhi, Bangalore"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-500/30"
                    />
                  </div>
                </div>

                <button
                  onClick={onUpgrade}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0e1a] font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  Get My Vedic Reading — Free
                </button>
                <p className="text-center text-[10px] text-white/25 mt-2">No credit card required · Takes 2 minutes</p>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-white/[0.05]">
                  <div className="flex -space-x-1.5">
                    {["🧑‍💼", "👩‍🦰", "👨‍🎓"].map((emoji, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-white/10 border border-[#0E1538] flex items-center justify-center text-[9px]">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40">
                    <span className="text-amber-400 font-bold">50,000+</span> Kundlis generated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Vedic Astrology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mx-auto max-w-xl px-4 pb-8"
        >
          <h3 className="text-sm font-bold text-white mb-3">Why Vedic is different from Western</h3>
          <div className="space-y-2.5">
            {[
              { title: "Sidereal vs Tropical", desc: "Vedic uses the actual position of stars, not the shifted Western zodiac. Your real sign may be different.", icon: "🌟" },
              { title: "Moon Sign Priority", desc: "Western focuses on Sun sign. Vedic prioritizes your Moon sign — the seat of your mind and emotions.", icon: "🌙" },
              { title: "Nakshatra System", desc: "27 lunar mansions provide granularity Western astrology can't match. Each nakshatra has a ruling deity and nature.", icon: "⭐" },
              { title: "Dasha Timing", desc: "Vedic uniquely predicts WHEN events happen using the Vimshottari Dasha system — not just what.", icon: "⏳" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white/80">{item.title}</p>
                  <p className="text-[11px] text-white/40 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 pt-4"
        >
          <button
            onClick={onAskAI}
            className="flex-1 flex items-center justify-center gap-2 glow-btn text-sm py-3"
          >
            <MessageCircle className="h-4 w-4" />
            Ask AI About Today
          </button>
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gold/15 bg-gold/[0.03] px-6 py-3 text-sm font-semibold text-gold/70 hover:border-gold/30 hover:bg-gold/[0.06] transition-all"
          >
            Get Full Birth Chart
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Share */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={() => {
              const text = `My ${selectedSign.name} horoscope today on GrahAI`
              const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/horoscope?sign=${selectedSign.name.toLowerCase()}`
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: text, url }).catch(() => {})
              } else if (typeof navigator !== 'undefined') {
                navigator.clipboard?.writeText(url)
              }
            }}
            className="flex items-center gap-2 text-xs text-text-dim/40 hover:text-gold/50 transition-colors"
          >
            <Share2 className="h-3 w-3" />
            Share today&apos;s reading
          </button>
        </div>
      </div>
    </div>
  )
}
