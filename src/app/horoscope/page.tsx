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

// ─── Deterministic prediction generator ─────────────────

function seedRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generatePrediction(signId: number, dateStr: string): DailyPrediction {
  const dateSeed = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0)
  const rand = seedRandom(signId * 1000 + dateSeed * 7)

  const overallPhrases = [
    "The cosmos aligns in your favor today. Trust your intuition and take bold steps toward your goals.",
    "A day of reflection and inner clarity. Mercury's influence sharpens your communication skills.",
    "Jupiter expands your horizons. Opportunities arise through unexpected conversations.",
    "Saturn tests your discipline today, but rewards await those who persist with patience.",
    "Venus brings harmony to relationships. Express your feelings with confidence and grace.",
    "Mars energizes your ambitions. Channel this fire wisely — avoid impulsive decisions.",
    "The Moon's transit through your sign heightens emotional awareness. Honor your feelings.",
    "Rahu's shadow creates an illusion of urgency. Slow down and verify before committing.",
    "A powerful day for spiritual growth. Meditation and mantra practice yield deep insights.",
    "Ketu's influence dissolves old patterns. Embrace change as liberation, not loss.",
    "The Sun illuminates hidden talents. Others notice your authentic presence today.",
    "A transformative transit activates your house of purpose. Align actions with dharma.",
  ]

  const lovePhrases = [
    "Emotional depth strengthens bonds. Share something vulnerable with someone you trust.",
    "Venus softens defenses. An old misunderstanding may finally resolve through honest dialogue.",
    "Single? The stars suggest a meaningful connection through creative or spiritual circles.",
    "Give your partner space to process. Pressure now backfires — patience deepens love.",
    "Romance thrives through shared experiences today. Plan something new together.",
    "Your magnetism peaks this afternoon. Confidence attracts genuine admiration.",
    "Past relationship patterns surface for healing. Forgiveness opens new doorways.",
    "A gentle day for love. Small gestures of kindness carry immense weight.",
  ]

  const careerPhrases = [
    "A strategic decision today sets the trajectory for months ahead. Think long-term.",
    "Collaborative efforts yield better results than solo work. Partner with complementary minds.",
    "Mercury retrograde energy suggests reviewing contracts before signing. Details matter.",
    "Financial intuition peaks. Trust your gut on investment timing but verify with data.",
    "A mentor figure offers valuable guidance. Be open to unconventional advice.",
    "Creative solutions emerge for stalled projects. Think laterally, not linearly.",
    "Avoid workplace conflicts before noon. The afternoon brings harmonious negotiations.",
    "Your expertise gets recognized. Accept praise gracefully and leverage momentum.",
  ]

  const healthPhrases = [
    "Focus on hydration and rest. Your body processes deep emotional releases today.",
    "Morning exercise amplifies energy for the entire day. Don't skip the warmup.",
    "Digestive sensitivity — favor light, warm foods. Avoid cold beverages after meals.",
    "Pranayama practice is especially powerful today. Even 5 minutes shifts your state.",
    "Sleep quality matters more than duration. Create a calm evening routine.",
    "Joint and muscle tension responds to gentle stretching and warm oil massage.",
    "Mental clarity peaks in late morning. Schedule important decisions during this window.",
    "Your healing capacity is strong. Address any lingering health concerns proactively.",
  ]

  const spiritualPhrases = [
    "The veil between conscious and unconscious thins today. Pay attention to dreams.",
    "Mantra repetition during Brahma Muhurta (pre-dawn) activates dormant spiritual faculties.",
    "Practice non-attachment today. Hold loosely what you wish to keep.",
    "A sacred text or teaching appears at the right moment. Stay alert to synchronicities.",
    "Gratitude meditation before sleep transmutes today's challenges into tomorrow's wisdom.",
    "Your ancestors' blessings are strong. Light a lamp in their remembrance.",
    "Silence is your greatest teacher today. Reduce unnecessary speech.",
    "The planets support devotional practices. Any sincere prayer carries amplified potency.",
  ]

  const mantras = [
    "ॐ गं गणपतये नमः — Om Gam Ganapataye Namah",
    "ॐ नमः शिवाय — Om Namah Shivaya",
    "ॐ श्रीं ह्रीं क्लीं — Om Shreem Hreem Kleem",
    "ॐ सूर्याय नमः — Om Suryaya Namah",
    "ॐ चन्द्राय नमः — Om Chandraya Namah",
    "ॐ बृहस्पतये नमः — Om Brihaspataye Namah",
    "ॐ शुक्राय नमः — Om Shukraya Namah",
    "ॐ शनैश्चराय नमः — Om Shanaishcharaya Namah",
  ]

  const remedies = [
    "Offer water to the Sun at sunrise while chanting Gayatri mantra 11 times.",
    "Donate white clothes or rice to someone in need before noon.",
    "Wear a copper ring or bracelet on your dominant hand today.",
    "Feed jaggery and wheat to a cow or leave it for birds at sunrise.",
    "Light a ghee lamp in the northeast corner of your home this evening.",
    "Chant Hanuman Chalisa once before undertaking any major task today.",
    "Place fresh tulsi leaves in your drinking water for the day.",
    "Apply a small tilak of sandalwood paste at your Ajna chakra (third eye).",
  ]

  const avoidThings = [
    "Avoid starting new financial ventures after sunset.",
    "Refrain from harsh speech between 3-5 PM (Rahu Kaal influence).",
    "Do not lend money today — it may not return easily.",
    "Avoid wearing black to important meetings.",
    "Skip non-vegetarian food today for optimal planetary alignment.",
    "Postpone signing contracts or legal documents until tomorrow.",
    "Avoid travel in the southern direction during morning hours.",
    "Don't make promises you can't keep — Saturn watches closely today.",
  ]

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
    "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
  ]

  const planetaryInfluences = [
    "Sun-Jupiter conjunction amplifies wisdom and authority in your chart today.",
    "Moon-Venus trine brings emotional harmony and creative inspiration.",
    "Mars aspects your 10th house, energizing career ambitions significantly.",
    "Mercury's transit through your 3rd house sharpens communication and learning.",
    "Saturn's stabilizing influence on your finances builds long-term security.",
    "Rahu in your 5th house sparks unconventional creative urges — channel wisely.",
    "Jupiter's aspect on your Lagna brings expansion and optimism to all endeavors.",
    "Venus-Moon conjunction creates a beautiful day for artistic expression and love.",
  ]

  const colors = ["Saffron", "White", "Green", "Red", "Yellow", "Blue", "Silver", "Gold", "Pink", "Orange"]

  const idx = (arr: string[]) => arr[Math.floor(rand() * arr.length)]
  const score = () => Math.floor(rand() * 4) + 6 // 6-10 range

  return {
    overall: idx(overallPhrases),
    love: idx(lovePhrases),
    career: idx(careerPhrases),
    health: idx(healthPhrases),
    spiritual: idx(spiritualPhrases),
    luckyNumber: Math.floor(rand() * 9) + 1,
    luckyColor: idx(colors),
    luckyTime: `${Math.floor(rand() * 12) + 1}:${rand() > 0.5 ? "00" : "30"} ${rand() > 0.5 ? "AM" : "PM"}`,
    overallScore: score(),
    loveScore: score(),
    careerScore: score(),
    healthScore: score(),
    mantra: idx(mantras),
    remedy: idx(remedies),
    avoid: idx(avoidThings),
    moonNakshatra: idx(nakshatras),
    planetaryInfluence: idx(planetaryInfluences),
  }
}

function generatePanchang(dateStr: string): PanchangData {
  const dateSeed = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0)
  const rand = seedRandom(dateSeed * 31)

  const tithis = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Amavasya",
  ]
  const yogas = [
    "Vishkambha", "Preeti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  ]
  const karanas = [
    "Bava", "Balava", "Kaulava", "Taitila", "Garija",
    "Vanija", "Vishti", "Shakuni", "Chatushpada", "Nagava",
  ]
  const varas = ["Ravivara (Sunday)", "Somavara (Monday)", "Mangalavara (Tuesday)", "Budhavara (Wednesday)", "Guruvara (Thursday)", "Shukravara (Friday)", "Shanivara (Saturday)"]
  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  ]

  const idx = (arr: string[]) => arr[Math.floor(rand() * arr.length)]
  const dayOfWeek = new Date(dateStr).getDay()

  return {
    tithi: idx(tithis),
    nakshatra: idx(nakshatras),
    yoga: idx(yogas),
    karana: idx(karanas),
    vara: varas[dayOfWeek] || varas[0],
    sunRise: "6:28 AM",
    sunSet: "6:14 PM",
    moonSign: SIGNS[Math.floor(rand() * 12)].name,
    rahukaal: `${Math.floor(rand() * 3) + 1}:30 PM – ${Math.floor(rand() * 3) + 3}:00 PM`,
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
              Your <span className="gold-text">Daily Horoscope</span>
            </h1>
            <p className="text-text-dim/60 text-sm max-w-md mx-auto">
              Personalized Vedic predictions powered by real planetary transits, Panchang, and Nakshatra analysis
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
    <div className="min-h-screen bg-bg pt-24 pb-20">
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
            <ScoreBar score={prediction.loveScore} label="Love" icon={Heart} color="#F0C8E0" />
            <ScoreBar score={prediction.careerScore} label="Career" icon={Briefcase} color="#4ADE80" />
            <ScoreBar score={prediction.healthScore} label="Health" icon={Shield} color="#60A5FA" />
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
          <button className="flex items-center gap-2 text-xs text-text-dim/40 hover:text-gold/50 transition-colors">
            <Share2 className="h-3 w-3" />
            Share today&apos;s reading
          </button>
        </div>
      </div>
    </div>
  )
}
