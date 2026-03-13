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
  Sun, Moon, Star, ArrowRight, ChevronDown, ChevronUp,
  Heart, Briefcase, Brain, Sparkles, TrendingUp, Shield,
  Clock, Zap, Eye, RefreshCw, Share2, MessageCircle
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"

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

/** Approximate sunrise for Indian latitudes (~28°N) */
function approxSunrise(dateStr: string): { rise: string; set: string } {
  const [y, m] = dateStr.split("-").map(Number)
  // Simple sinusoidal model for Delhi-ish latitude
  const dayOfYear = Math.floor((Date.UTC(y, m - 1, parseInt(dateStr.split("-")[2])) - Date.UTC(y, 0, 0)) / 86400000)
  const riseBase = 6.0 + 0.6 * Math.cos(2 * Math.PI * (dayOfYear - 172) / 365)
  const setBase = 18.0 + 0.8 * Math.cos(2 * Math.PI * (dayOfYear - 172) / 365)
  const fmt = (h: number) => {
    const hr = Math.floor(h)
    const mn = Math.round((h - hr) * 60)
    const ampm = hr >= 12 ? "PM" : "AM"
    const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr
    return `${h12}:${mn.toString().padStart(2, "0")} ${ampm}`
  }
  return { rise: fmt(riseBase), set: fmt(setBase) }
}

// ─── Deterministic PRNG for stable text selection ─────────

function seedRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Ruler-Aware Prediction Content ──────────────────────

/** Each sign ruler gets specific flavour for predictions */
const RULER_CONTENT: Record<string, {
  mantras: string[];
  remedies: string[];
  colors: string[];
  numbers: number[];
  avoids: string[];
}> = {
  Mars: {
    mantras: ["ॐ अं अंगारकाय नमः — Om Ang Angarakaya Namah", "ॐ क्रां क्रीं क्रौं सः भौमाय नमः — Om Kraam Kreem Kraum Sah Bhaumaya Namah"],
    remedies: ["Offer red flowers at a Hanuman temple. Recite Hanuman Chalisa for Mars's blessings.", "Donate blood or red lentils on Tuesday to strengthen Mars's positive influence."],
    colors: ["Red", "Saffron", "Coral"],
    numbers: [9, 18, 27],
    avoids: ["Avoid losing your temper before noon — Mars amplifies aggression today.", "Do not start construction or demolition work today."],
  },
  Venus: {
    mantras: ["ॐ शुक्राय नमः — Om Shukraya Namah", "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः — Om Draam Dreem Draum Sah Shukraya Namah"],
    remedies: ["Offer white flowers or rice to a temple. Venus responds to beauty and devotion.", "Wear white or cream clothing today to harmonize with Venus's energy."],
    colors: ["White", "Cream", "Pink"],
    numbers: [6, 15, 24],
    avoids: ["Avoid arguments with your partner — Venus makes conflicts linger today.", "Skip heavy, oily foods to keep Venus's digestive influence balanced."],
  },
  Mercury: {
    mantras: ["ॐ बुं बुधाय नमः — Om Bum Budhaya Namah", "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः — Om Braam Breem Braum Sah Budhaya Namah"],
    remedies: ["Donate green vegetables or moong dal on Wednesday for Mercury's blessings.", "Write down your goals today — Mercury rewards clarity of thought and intention."],
    colors: ["Green", "Emerald", "Light Green"],
    numbers: [5, 14, 23],
    avoids: ["Avoid signing important documents without thorough review.", "Don't multitask excessively — Mercury wants focused attention today."],
  },
  Moon: {
    mantras: ["ॐ चन्द्राय नमः — Om Chandraya Namah", "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः — Om Shraam Shreem Shraum Sah Chandraya Namah"],
    remedies: ["Offer milk or water to a Shiva lingam. The Moon responds to acts of devotion.", "Wear pearl or moonstone to strengthen the Moon's calming influence."],
    colors: ["Silver", "White", "Pearl"],
    numbers: [2, 11, 20],
    avoids: ["Avoid emotional decisions this evening — the Moon amplifies reactivity.", "Do not travel over water bodies during evening hours today."],
  },
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
      `Mars, your ruling planet, activates your house of ambition today. The Moon in ${moonSignName} under ${nakName} nakshatra channels raw energy into purposeful action. Trust your instincts — your decisiveness is your superpower right now.`,
      `With Mars energizing your sector, today rewards bold moves and physical activity. The ${nakName} nakshatra adds a layer of strategic precision. Channel aggression into competitive drive rather than conflict.`,
    ],
    Venus: [
      `Venus graces your sign with beauty and harmony today. The Moon transiting ${moonSignName} through ${nakName} nakshatra enhances your creative and relational magnetism. Express yourself through art, music, or heartfelt conversation.`,
      `Your ruling planet Venus softens today's cosmic intensity. Under ${nakName} nakshatra's influence, relationships deepen through vulnerability. Financial decisions made today carry Venus's blessing of growth.`,
    ],
    Mercury: [
      `Mercury sharpens your intellect today. With the Moon in ${moonSignName} and ${nakName} nakshatra active, your communication skills peak. This is ideal for writing, negotiations, and learning something new.`,
      `Your ruling Mercury aligns with the day's ${nakName} nakshatra energy, creating exceptional mental clarity. Conversations you initiate today could open doors that remain closed to others.`,
    ],
    Moon: [
      `The Moon, your ruling luminary, transits ${moonSignName} through ${nakName} nakshatra today, making you especially intuitive and emotionally perceptive. Trust the subtle feelings — they carry genuine intelligence.`,
      `Today's lunar energy through ${nakName} nakshatra resonates deeply with your Cancerian nature. Home, family, and emotional security are highlighted. Nurture yourself before nurturing others.`,
    ],
    Sun: [
      `The Sun, your ruling star, illuminates your path with confidence and authority today. ${nakName} nakshatra adds a spiritual dimension — lead with both power and compassion. Others look to you for direction.`,
      `Solar energy is at its peak in your chart today. The Moon in ${moonSignName} under ${nakName} activates your creative house. Express your authentic self without apology — the cosmos rewards genuine radiance.`,
    ],
    Jupiter: [
      `Jupiter, your expansive ruler, opens doors of opportunity today. The Moon in ${moonSignName} through ${nakName} nakshatra amplifies wisdom and spiritual growth. Generosity attracts abundance in return.`,
      `With Jupiter guiding your day, ${nakName} nakshatra's energy supports philosophical inquiry and higher learning. Travel, teaching, and spiritual practices are especially favored right now.`,
    ],
    Saturn: [
      `Saturn, your disciplined ruler, rewards patience and persistence today. The Moon transiting ${moonSignName} under ${nakName} nakshatra asks you to build slowly but surely. What you create now will endure.`,
      `Today's ${nakName} nakshatra energy aligns with Saturn's demand for structure. Focus on long-term planning over quick wins. The karmic rewards of discipline compound over time.`,
    ],
  }
  const arr = templates[ruler] || templates["Jupiter"]
  return arr[Math.floor(rand() * arr.length)]
}

function getLovePrediction(ruler: string, rand: () => number): string {
  const templates: Record<string, string[]> = {
    Mars: ["Passion runs high today. Express desire with confidence but temper it with tenderness. Mars can overwhelm — balance intensity with listening.", "Physical chemistry is amplified by Mars's fire. Plan an active date or adventurous outing with your partner for maximum connection."],
    Venus: ["Venus wraps your love life in warmth and beauty today. Small romantic gestures carry enormous weight. A heartfelt compliment or surprise gift deepens bonds.", "Your natural charm peaks today. If single, attend social gatherings — Venus ensures you radiate magnetic attraction."],
    Mercury: ["Communication is the key to love today. An honest, witty conversation builds more intimacy than grand gestures. Text that person you've been thinking about.", "Mercury makes you articulate in matters of the heart. Write a letter, share your thoughts openly — words become love language today."],
    Moon: ["Emotional depth defines your romantic energy today. Share your vulnerabilities and create space for your partner's. Tears can heal as much as laughter.", "The Moon heightens romantic sensitivity. Candlelight, music, and gentle touch speak louder than words. Nurture love through presence."],
    Sun: ["Confidence makes you irresistible today. Express your feelings boldly — the Sun favors those who lead in love. Don't wait for signals; create them.", "Your authentic radiance attracts genuine admiration. Step into the spotlight and let your partner (or a new connection) see the real you."],
    Jupiter: ["Love expands through shared wisdom and laughter today. Deep philosophical conversations build romantic foundations that last. Seek meaning together.", "Jupiter blesses commitment and long-term partnership today. If considering marriage or engagement, the cosmic timing is favorable."],
    Saturn: ["Patience in love pays dividends today. Don't rush emotional conversations. Saturn rewards those who build relationships on trust and consistency.", "Practical expressions of love — reliability, support, keeping promises — matter more than grand romance today. Show up consistently."],
  }
  const arr = templates[ruler] || templates["Venus"]
  return arr[Math.floor(rand() * arr.length)]
}

function getCareerPrediction(ruler: string, rand: () => number): string {
  const templates: Record<string, string[]> = {
    Mars: ["Mars drives career ambition to a peak. Take initiative on stalled projects — your decisive energy inspires teams. Avoid power struggles with colleagues.", "Physical and professional stamina combine today. Tackle the most challenging tasks first when your Mars-fueled energy is highest."],
    Venus: ["Creativity and diplomacy advance your career today. Venus favors artistic projects, client relationships, and financial negotiations. Dress well for important meetings.", "Financial opportunities arise through partnerships. Venus rewards collaboration over competition — seek win-win arrangements."],
    Mercury: ["Mercury supercharges professional communication. Presentations, emails, and negotiations flow with unusual clarity. This is your day to pitch ideas.", "Analytical skills peak today. Data-driven decisions yield the best results. Mercury also favors learning new tools or taking a quick course."],
    Moon: ["Workplace intuition is your hidden advantage today. Trust your gut about team dynamics and project timing. Emotional intelligence outperforms raw IQ.", "Nurture professional relationships today. A supportive word to a colleague returns as unexpected career advancement later."],
    Sun: ["Leadership energy peaks. Step up and take charge of important projects. The Sun rewards those who accept responsibility and inspire others.", "Authority figures notice your work today. Shine in presentations and meetings — the Sun highlights your competence and vision."],
    Jupiter: ["Jupiter opens doors for career expansion. New opportunities arrive through mentors, education, or international connections. Think bigger than usual.", "Financial wisdom guides investments and business decisions today. Jupiter's abundance flows toward those who operate with integrity."],
    Saturn: ["Discipline and structure are your career allies today. Organize, plan, and execute methodically — Saturn rewards thoroughness over shortcuts.", "Long-term career foundations strengthen today. Certifications, skill development, and strategic networking create lasting professional advantages."],
  }
  const arr = templates[ruler] || templates["Jupiter"]
  return arr[Math.floor(rand() * arr.length)]
}

function getHealthPrediction(ruler: string, moonSign: string, rand: () => number): string {
  const elem = SIGNS.find(s => s.name === moonSign)?.element || "Fire"
  const elemAdvice: Record<string, string> = {
    Fire: "Your fire element is active — stay hydrated and avoid spicy foods. Morning exercise boosts vitality.",
    Earth: "Ground yourself with walks in nature and warm, nourishing meals. Stability supports healing today.",
    Air: "Your nervous system needs calming. Practice pranayama and avoid overstimulation from screens.",
    Water: "Emotional energy affects physical health today. Warm teas, baths, and gentle stretching restore balance.",
  }
  const base = elemAdvice[elem]
  const extras: string[] = [
    ` ${ruler === "Mars" ? "Channel physical energy through vigorous exercise — Mars needs an outlet." : ""}`,
    ` ${ruler === "Saturn" ? "Pay attention to joints and bones. Gentle stretching and calcium-rich foods are beneficial." : ""}`,
    ` ${ruler === "Mercury" ? "Mental fatigue is possible — take breaks every 90 minutes for cognitive recovery." : ""}`,
    ` ${ruler === "Moon" ? "Sleep quality directly impacts tomorrow's energy. Create a calming bedtime ritual." : ""}`,
  ]
  return base + (extras[Math.floor(rand() * extras.length)] || "")
}

function getSpiritualPrediction(nakName: string, rand: () => number): string {
  const templates = [
    `${nakName} nakshatra's energy today deepens meditation and inner inquiry. The veil between conscious and unconscious thins — pay attention to dreams and sudden insights.`,
    `Today's ${nakName} nakshatra supports mantra practice and devotional activities. Any sincere prayer during Brahma Muhurta (4:00-5:30 AM) carries amplified potency.`,
    `The ${nakName} nakshatra invites you to practice non-attachment. Hold loosely what you wish to keep — true spiritual growth comes through surrender, not control.`,
    `Gratitude is your spiritual practice today. ${nakName}'s energy transmutes challenges into wisdom when viewed through the lens of appreciation and acceptance.`,
  ]
  return templates[Math.floor(rand() * templates.length)]
}

function getPlanetaryInfluence(sign: SignData, moonSignName: string, sunSignIdx: number, rand: () => number): string {
  const signIdx = sign.id - 1
  const transitHouse = ((sunSignIdx - signIdx + 12) % 12) + 1
  const moonHouse = ((SIGNS.findIndex(s => s.name === moonSignName) - signIdx + 12) % 12) + 1
  const houseNames: Record<number, string> = {
    1: "Lagna (self/personality)", 2: "Dhana (wealth/speech)", 3: "Sahaja (courage/siblings)",
    4: "Sukha (home/happiness)", 5: "Putra (creativity/children)", 6: "Ripu (health/enemies)",
    7: "Kalatra (partnerships)", 8: "Ayu (transformation)", 9: "Dharma (fortune/philosophy)",
    10: "Karma (career/status)", 11: "Labha (gains/aspirations)", 12: "Vyaya (liberation/expenses)",
  }
  return `The Sun transits your ${transitHouse}${transitHouse === 1 ? "st" : transitHouse === 2 ? "nd" : transitHouse === 3 ? "rd" : "th"} house — ${houseNames[transitHouse] || ""}. The Moon illuminates your ${moonHouse}${moonHouse === 1 ? "st" : moonHouse === 2 ? "nd" : moonHouse === 3 ? "rd" : "th"} house of ${houseNames[moonHouse] || ""}, shaping today's emotional landscape. ${sign.ruler}'s influence anchors your experience.`
}

// ─── Computed Prediction Generator ──────────────────────

function generatePrediction(signId: number, dateStr: string): DailyPrediction {
  const jde = dateToJDE(dateStr)
  const sunTropical = computeSunLong(jde)
  const moonTropical = computeMoonLong(jde)
  const sunSid = toSidereal(sunTropical, jde)
  const moonSid = toSidereal(moonTropical, jde)

  // Moon nakshatra & sign from actual position
  const moonNakIdx = Math.floor(moonSid / (360 / 27))
  const moonSignIdx = Math.floor(moonSid / 30)
  const moonSignName = SIGNS[moonSignIdx].name
  const nakName = NAKSHATRA_NAMES[moonNakIdx]
  const sunSignIdx = Math.floor(sunSid / 30)

  const sign = SIGNS[signId - 1]
  const ruler = sign.ruler
  const rulerContent = RULER_CONTENT[ruler] || RULER_CONTENT["Jupiter"]

  // Deterministic seed for stable text selection per sign+date
  const dateSeed = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0)
  const rand = seedRandom(signId * 1000 + dateSeed * 7)

  // Scores influenced by relationship between sign and current Moon/Sun
  const signIdx = signId - 1
  const moonDist = ((moonSignIdx - signIdx + 12) % 12)
  const sunDist = ((sunSignIdx - signIdx + 12) % 12)
  // Favourable houses: 1,4,5,7,9,10,11 → higher scores
  const favourable = [0, 3, 4, 6, 8, 9, 10]
  const moonBoost = favourable.includes(moonDist) ? 1.5 : 0
  const sunBoost = favourable.includes(sunDist) ? 1 : 0
  const baseScore = () => {
    const raw = 5 + moonBoost + sunBoost + rand() * 2.5
    return Math.min(10, Math.max(4, Math.round(raw)))
  }

  const idx = (arr: string[]) => arr[Math.floor(rand() * arr.length)]

  return {
    overall: getOverallPrediction(sign, moonSignName, nakName, rand),
    love: getLovePrediction(ruler, rand),
    career: getCareerPrediction(ruler, rand),
    health: getHealthPrediction(ruler, moonSignName, rand),
    spiritual: getSpiritualPrediction(nakName, rand),
    luckyNumber: rulerContent.numbers[Math.floor(rand() * rulerContent.numbers.length)],
    luckyColor: idx(rulerContent.colors),
    luckyTime: `${Math.floor(rand() * 12) + 1}:${rand() > 0.5 ? "00" : "30"} ${rand() > 0.5 ? "AM" : "PM"}`,
    overallScore: baseScore(),
    loveScore: baseScore(),
    careerScore: baseScore(),
    healthScore: baseScore(),
    spiritualScore: baseScore(),
    mantra: idx(rulerContent.mantras),
    remedy: idx(rulerContent.remedies),
    avoid: idx(rulerContent.avoids),
    moonNakshatra: nakName,
    planetaryInfluence: getPlanetaryInfluence(sign, moonSignName, sunSignIdx, rand),
  }
}

// ─── Computed Panchang ───────────────────────────────────

function generatePanchang(dateStr: string): PanchangData {
  const jde = dateToJDE(dateStr)
  const sunTropical = computeSunLong(jde)
  const moonTropical = computeMoonLong(jde)
  const sunSid = toSidereal(sunTropical, jde)
  const moonSid = toSidereal(moonTropical, jde)

  // Tithi = Sun-Moon angular distance / 12°
  let sunMoonAngle = moonSid - sunSid
  if (sunMoonAngle < 0) sunMoonAngle += 360
  const tithiIdx = Math.floor(sunMoonAngle / 12) % 30

  // Nakshatra from Moon position
  const nakIdx = Math.floor(moonSid / (360 / 27)) % 27

  // Yoga = (Sun + Moon sidereal longitudes) / (360/27)
  const yogaAngle = (sunSid + moonSid) % 360
  const yogaIdx = Math.floor(yogaAngle / (360 / 27)) % 27

  // Karana = half-tithi
  const karanaIdx = Math.floor(sunMoonAngle / 6) % 11

  // Vara
  const dayOfWeek = new Date(dateStr).getDay()

  // Moon sign
  const moonSignIdx = Math.floor(moonSid / 30) % 12

  // Sunrise/sunset
  const { rise, set } = approxSunrise(dateStr)

  return {
    tithi: (tithiIdx < 15 ? "Shukla " : "Krishna ") + TITHI_NAMES[tithiIdx],
    nakshatra: NAKSHATRA_NAMES[nakIdx],
    yoga: YOGA_NAMES[yogaIdx],
    karana: KARANA_NAMES[karanaIdx],
    vara: VARA_NAMES[dayOfWeek] || VARA_NAMES[0],
    sunRise: rise,
    sunSet: set,
    moonSign: SIGNS[moonSignIdx].name,
    rahukaal: RAHUKAAL_TABLE[dayOfWeek] || "1:30 PM – 3:00 PM",
  }
}

// ─── Sub-components ─────────────────────────────────────

function ScoreBar({ score, label, icon: Icon, color }: { score: number; label: string; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <span className="text-xs text-text-dim w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}66, ${color})` }}
        />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  )
}

function PanchangWidget({ panchang }: { panchang: PanchangData }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-5 space-y-3"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gold/60" />
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-gold/70">Today&apos;s Panchang</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-text-dim/50" /> : <ChevronDown className="h-4 w-4 text-text-dim/50" />}
      </button>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div><span className="text-text-dim/50">Tithi:</span> <span className="text-text/80 ml-1">{panchang.tithi}</span></div>
        <div><span className="text-text-dim/50">Nakshatra:</span> <span className="text-text/80 ml-1">{panchang.nakshatra}</span></div>
        <div><span className="text-text-dim/50">Vara:</span> <span className="text-text/80 ml-1">{panchang.vara}</span></div>
        <div><span className="text-text-dim/50">Moon Sign:</span> <span className="text-text/80 ml-1">{panchang.moonSign}</span></div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/[0.04]">
              <div><span className="text-text-dim/50">Yoga:</span> <span className="text-text/80 ml-1">{panchang.yoga}</span></div>
              <div><span className="text-text-dim/50">Karana:</span> <span className="text-text/80 ml-1">{panchang.karana}</span></div>
              <div><span className="text-text-dim/50">Sunrise:</span> <span className="text-text/80 ml-1">{panchang.sunRise}</span></div>
              <div><span className="text-text-dim/50">Sunset:</span> <span className="text-text/80 ml-1">{panchang.sunSet}</span></div>
              <div className="col-span-2">
                <span className="text-red/70">⚠ Rahu Kaal:</span> <span className="text-text/80 ml-1">{panchang.rahukaal}</span>
              </div>
            </div>
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
      className="glass-card p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="text-xs font-semibold tracking-[0.1em] uppercase" style={{ color: `${color}cc` }}>{title}</span>
      </div>
      <p className="text-sm text-text/80 leading-relaxed">{content}</p>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────

export default function HoroscopePage() {
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

  // ─── Sign Selector View ─────────────────────────────

  if (!showResult || loading) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        <Navbar />
        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
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
        <Footer />
      </div>
    )
  }

  // ─── Result View ────────────────────────────────────

  if (!prediction || !selectedSign) return null

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20">
      <Navbar />
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.015] blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-6">
        {/* Back + Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
          <button
            onClick={() => { setShowResult(false); setSelectedSign(null) }}
            className="text-xs text-text-dim/40 hover:text-gold/60 transition-colors tracking-wide"
          >
            ← Change Sign
          </button>

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
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-semibold text-black hover:bg-gold/90 transition-all"
              >
                <Star className="h-3.5 w-3.5" />
                Start Free, Upgrade Anytime
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/kundli"
                className="text-xs text-gold/50 hover:text-gold/70 transition-colors"
              >
                Create free Kundli
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Personalized Reading Conversion Funnel ── */}
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

                <Link
                  href="/onboarding"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0e1a] font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  Get My Vedic Reading — Free
                </Link>
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

        {/* ── Why Vedic Astrology ── */}
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
          <Link
            href={`/chat?v=astrology&q=Tell me more about today's horoscope for ${selectedSign.name}`}
            className="flex-1 flex items-center justify-center gap-2 glow-btn text-sm py-3"
          >
            <MessageCircle className="h-4 w-4" />
            Ask AI About Today
          </Link>
          <Link
            href={`/kundli`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gold/15 bg-gold/[0.03] px-6 py-3 text-sm font-semibold text-gold/70 hover:border-gold/30 hover:bg-gold/[0.06] transition-all"
          >
            Get Full Birth Chart
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Share */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={() => {
              const text = `My ${selectedSign.name} horoscope today on GrahAI`
              const url = `${window.location.origin}/horoscope?sign=${selectedSign.name.toLowerCase()}`
              if (navigator.share) {
                navigator.share({ title: text, url }).catch(() => {})
              } else {
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
      <Footer />
    </div>
  )
}
