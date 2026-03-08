"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowDown, Check, Loader2, Star, Shield, Zap, Globe, BookOpen, Eye, MessageCircle, Lock, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import CosmicSnapshot from "@/components/CosmicSnapshot"
import ExitIntentPopup from "@/components/ExitIntentPopup"
import AskOneQuestion from "@/components/AskOneQuestion"
import DecodeYourName from "@/components/DecodeYourName"
import VerseOfTheDay from "@/components/VerseOfTheDay"
import WeeklyTransitBrief from "@/components/WeeklyTransitBrief"
import PricingSection from "@/components/PricingSection"
import WhatsAppCTA from "@/components/WhatsAppCTA"

/* ────────────────────────────────────────────────────
   CONSTANTS — deterministic so SSR = client
   ──────────────────────────────────────────────────── */
function seed(n: number) {
  const x = Math.sin(n + 1) * 10000
  return x - Math.floor(x)
}

const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: `${(seed(i * 3 + 1) * 100).toFixed(2)}%`,
  top: `${(seed(i * 3 + 2) * 100).toFixed(2)}%`,
  w: seed(i * 3 + 3) * 2 + 0.5,
  dur: seed(i * 7 + 1) * 5 + 3,
  del: seed(i * 7 + 2) * 5,
}))

/* Floating particles for cinematic depth */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(seed(i * 5 + 10) * 100).toFixed(2)}%`,
  top: `${(seed(i * 5 + 11) * 100).toFixed(2)}%`,
  size: seed(i * 5 + 12) * 4 + 2,
  dur: seed(i * 5 + 13) * 15 + 10,
  del: seed(i * 5 + 14) * 8,
  drift: (seed(i * 5 + 15) - 0.5) * 100,
}))

/* ────────────────────────────────────────────────────
   BRAND LOGO SVG
   ──────────────────────────────────────────────────── */
function BrandLogo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" stroke="url(#logoGrad)" strokeWidth="0.8" opacity="0.55" />
      <circle cx="24" cy="24" r="15" stroke="url(#logoGrad)" strokeWidth="0.5" opacity="0.3" />
      <circle cx="24" cy="2" r="2.2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.8" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.6" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.6" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.8" fill="#C9A24D" opacity="0.7" />
      <circle cx="24" cy="24" r="5.5" fill="url(#sunGrad)" />
      <circle cx="24" cy="24" r="8" stroke="#C9A24D" strokeWidth="0.25" opacity="0.15" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#C9A24D" />
          <stop offset="100%" stopColor="#E2C474" />
        </linearGradient>
        <radialGradient id="sunGrad" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#E2C474" />
          <stop offset="100%" stopColor="#C9A24D" />
        </radialGradient>
      </defs>
    </svg>
  )
}

/* ────────────────────────────────────────────────────
   LARGE HERO YANTRA
   ──────────────────────────────────────────────────── */
function Yantra({ size = 500, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" className={className}>
      <circle cx="250" cy="250" r="240" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
      <circle cx="250" cy="250" r="200" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
      <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
      <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="0.2" opacity="0.03" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180
        return (
          <g key={i}>
            <line x1={250 + 160 * Math.cos(a)} y1={250 + 160 * Math.sin(a)}
              x2={250 + 240 * Math.cos(a)} y2={250 + 240 * Math.sin(a)}
              stroke="currentColor" strokeWidth="0.25" opacity="0.04" />
            <circle cx={250 + 240 * Math.cos(a)} cy={250 + 240 * Math.sin(a)}
              r="2.5" fill="currentColor" opacity="0.06" />
          </g>
        )
      })}
      <polygon points="250,50 420,350 80,350" stroke="currentColor" strokeWidth="0.35" opacity="0.04" />
      <polygon points="250,450 80,150 420,150" stroke="currentColor" strokeWidth="0.35" opacity="0.04" />
      <circle cx="250" cy="250" r="4" fill="currentColor" opacity="0.1" />
    </svg>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-4 my-1">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/15" />
      <div className="h-1 w-1 rounded-full bg-gold/20" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/15" />
    </div>
  )
}

/* ────────────────────────────────────────────────────
   ANIMATION WRAPPERS — cinematic easing
   ──────────────────────────────────────────────────── */
const smooth = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
const smoothSlow = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }
const cinematic = { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const }

function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ ...smoothSlow, delay }}
      className={className}>
      {children}
    </motion.div>
  )
}

function BlurReveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-30px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 24, filter: "blur(6px)" }}
      transition={{ ...smooth, delay }}
      className={className}>
      {children}
    </motion.div>
  )
}

function ScaleReveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
      transition={{ ...smoothSlow, delay }}
      className={className}>
      {children}
    </motion.div>
  )
}

/* Staggered character reveal for headings */
function CharReveal({ text, className = "", delay = 0 }: {
  text: string; className?: string; delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-30px" })
  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <motion.span key={i} className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.025 }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

/* ────────────────────────────────────────────────────
   SANSKRIT DICTIONARY
   ──────────────────────────────────────────────────── */
const SANSKRIT_DICT: Record<string, { devanagari: string; english: string; explanation: string }> = {
  "jyotish": { devanagari: "ज्योतिष", english: "Astrology", explanation: "The science of light and luminaries; Vedic astrology." },
  "kundli": { devanagari: "कुंडली", english: "Birth Chart", explanation: "A celestial map of planets at the moment of birth." },
  "graha": { devanagari: "ग्रह", english: "Planet", explanation: "Celestial bodies that influence human destiny." },
  "rashi": { devanagari: "राशि", english: "Sign", explanation: "One of the 12 zodiacal divisions of the ecliptic." },
  "nakshatra": { devanagari: "नक्षत्र", english: "Star", explanation: "27 lunar constellations forming the zodiac." },
  "dasha": { devanagari: "दशा", english: "Period", explanation: "Planetary periods governing life phases." },
  "panchang": { devanagari: "पञ्चांग", english: "Almanac", explanation: "Five-part calendar: tithi, nakshatra, yoga, karana, vara." },
  "vastu": { devanagari: "वास्तु", english: "Space", explanation: "Science of architecture and spatial harmony." },
  "yoga": { devanagari: "योग", english: "Union", explanation: "Auspicious planetary combinations." },
  "dosha": { devanagari: "दोष", english: "Flaw", explanation: "Astrological afflictions or weaknesses." },
  "bhava": { devanagari: "भाव", english: "House", explanation: "One of 12 life areas in a birth chart." },
  "muhurta": { devanagari: "मुहूर्त", english: "Auspicious Time", explanation: "Favorable moment for rituals or actions." },
  "manglik": { devanagari: "मांगलिक", english: "Mars-afflicted", explanation: "Strong Mars placement in certain houses." },
  "gochar": { devanagari: "गोचर", english: "Transit", explanation: "Current movement of planets through zodiacal signs." },
  "ayanamsa": { devanagari: "अयनांश", english: "Precession", explanation: "Correction factor for sidereal astrology." },
  "tithi": { devanagari: "तिथि", english: "Lunar Day", explanation: "One of 30 divisions of the lunar month." },
  "karana": { devanagari: "करण", english: "Half-day", explanation: "Half-day divisions derived from tithi." },
  "hora": { devanagari: "होरा", english: "Hour", explanation: "Horary astrology; time-based predictions." },
  "lagna": { devanagari: "लग्न", english: "Ascendant", explanation: "Rising sign at the exact birth moment." },
  "navamsa": { devanagari: "नवांश", english: "Subdivision", explanation: "Ninth division of zodiac signs in detailed analysis." },
}

/* ────────────────────────────────────────────────────
   SANSKRIT TERM TOOLTIP COMPONENT
   ──────────────────────────────────────────────────── */
function SanskritTerm({ term, children }: { term: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const dictEntry = SANSKRIT_DICT[term.toLowerCase()]
  if (!dictEntry) return <>{children}</>

  return (
    <motion.div className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <span className="cursor-help border-b border-dashed border-gold/40 hover:border-gold/60 transition-colors">
        {children}
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50">
            <div className="glass-card px-4 py-3 rounded-lg whitespace-nowrap shadow-xl">
              <p className="text-xs font-semibold text-gold mb-1">{dictEntry.english}</p>
              <p className="font-hindi text-xs text-gold/60 mb-1.5">
                {dictEntry.devanagari}
              </p>
              <p className="text-xs text-text-dim/70 max-w-xs">{dictEntry.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────
   VERSE TICKER (replaces Marquee)
   ──────────────────────────────────────────────────── */
const VERSES = [
  { sanskrit: "श्लोक", english: "The planets guide but do not dictate; free will and karma dance together.", source: "Bhagavad Gita" },
  { sanskrit: "ज्ञानं तु तेषां परमं गुह्यं", english: "Knowledge is the supreme secret; understanding oneself is the highest pursuit.", source: "Vedic Wisdom" },
  { sanskrit: "नक्षत्राणि ब्रह्मणः नेत्राणि", english: "Stars are the eyes of the cosmos; through them we see truth.", source: "Rig Veda" },
  { sanskrit: "ग्रहा देवताः सर्वत्र", english: "Planets are divine instruments woven into the fabric of fate.", source: "Surya Siddhanta" },
  { sanskrit: "आत्मा ही परमं ब्रह्म", english: "The self is the ultimate cosmos; look within to understand the stars.", source: "Upanishads" },
  { sanskrit: "काल ही सर्वश्रेष्ठ शक्ति", english: "Time is the supreme force; all cycles are held within it.", source: "Mahabharata" },
]

function VerseTicker() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section id="verses" className="relative py-16 lg:py-20 border-y border-white/[0.03] overflow-hidden">
      <div className="glass-card mx-auto max-w-7xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="relative overflow-hidden h-20 flex items-center">
          <motion.div
            className="flex gap-12"
            animate={{ x: isHovered ? 0 : [0, -4000] }}
            transition={{
              duration: 90,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop"
            }}>
            {[...VERSES, ...VERSES].map((verse, i) => (
              <div key={i} className="flex-shrink-0 min-w-fit px-8 flex items-center gap-6">
                <span className="text-xs text-gold/50 font-semibold">श्लोक —</span>
                <p className="text-sm text-text-dim/60">{verse.english}</p>
                <span className="text-xs text-text-dim/40">— {verse.source}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────
   COSMIC COMPASS QUIZ
   ──────────────────────────────────────────────────── */
function CosmicCompassQuiz() {
  const [selected, setSelected] = useState<string | null>(null)

  const quizCards = [
    { id: "explorer", emoji: "🔭", title: "Curious Explorer", desc: "Understand the celestial mechanics", target: "sciences" },
    { id: "guidance", emoji: "🌅", title: "Daily Guidance", desc: "Align with cosmic rhythms", target: "how-it-works" },
    { id: "decisions", emoji: "🧭", title: "Life Decisions", desc: "Navigate your path with clarity", target: "guided-demo" },
    { id: "scholar", emoji: "📚", title: "Deep Scholar", desc: "Master the ancient knowledge", target: "technology" },
  ]

  const handleSelect = (id: string, target: string) => {
    setSelected(id)
    if (typeof window !== "undefined") localStorage.setItem("cosmicChoice", id)
    const elem = document.getElementById(target)
    elem?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="quiz" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16 lg:mb-24">
          <BlurReveal><Divider /></BlurReveal>
          <BlurReveal delay={0.08}>
            <h2 className="heading-section mt-8 mb-5">
              What draws you to the <span className="gold-text">stars?</span>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.16}>
            <p className="text-body mx-auto max-w-lg">
              Find your path through Vedic wisdom
            </p>
          </BlurReveal>
        </div>

        <div className="grid gap-6 lg:gap-7 md:grid-cols-2 lg:grid-cols-4">
          {quizCards.map((card, i) => (
            <Reveal key={card.id} delay={0.1 + i * 0.08}>
              <motion.button
                onClick={() => handleSelect(card.id, card.target)}
                className={`glass-card p-6 text-center transition-all ${
                  selected === card.id ? "ring-2 ring-gold/50 bg-gold/[0.06]" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <div className="text-4xl mb-4">{card.emoji}</div>
                <h3 className="text-lg font-semibold text-text mb-2">{card.title}</h3>
                <p className="text-caption">{card.desc}</p>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────
   DAILY PANCHANG SECTION
   ──────────────────────────────────────────────────── */
function DailyPanchang() {
  const panchangData = {
    tithi: { label: "Tithi", value: "Shukla Paksha Tritiya", devanagari: "शुक्ल पक्ष तृतीया" },
    nakshatra: { label: "Nakshatra", value: "Mrigasira", devanagari: "मृगशिरा" },
    yoga: { label: "Yoga", value: "Indra", devanagari: "इंद्र" },
    karana: { label: "Karana", value: "Bava", devanagari: "बव" },
  }

  return (
    <section id="panchang" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16 lg:mb-24">
          <BlurReveal><Divider /></BlurReveal>
          <BlurReveal delay={0.08}>
            <h2 className="heading-section mt-8 mb-5">
              Your Day in the <span className="gold-text">Stars</span>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.16}>
            <p className="text-body mx-auto max-w-lg">
              Today&apos;s cosmic alignment for your reading
            </p>
          </BlurReveal>
        </div>

        <Reveal className="mx-auto max-w-2xl">
          <div className="glass-card p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(panchangData).map(([key, data]) => (
                <div key={key} className="text-center">
                  <p className="text-label text-gold/50 mb-3">{data.label}</p>
                  <p className="font-hindi text-sm text-gold/70 mb-2">
                    {data.devanagari}
                  </p>
                  <p className="text-text">{data.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/[0.03] text-center">
              <Link href="/daily"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold/70 hover:text-gold transition-colors">
                See Full Panchang
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────
   GAMIFICATION VISUALIZATION
   ──────────────────────────────────────────────────── */
function GamificationVisualization() {
  const [xp, setXp] = useState(0)
  const maxXp = 5000
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  useEffect(() => {
    if (!inView) return
    const duration = 2
    const steps = 60
    let current = 0
    const interval = setInterval(() => {
      current++
      setXp(Math.floor((current / steps) * maxXp))
      if (current >= steps) clearInterval(interval)
    }, (duration * 1000) / steps)
    return () => clearInterval(interval)
  }, [inView])

  const xpPercentage = (xp / maxXp) * 100

  return (
    <section id="gamification" ref={ref} className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16 lg:mb-24">
          <BlurReveal><Divider /></BlurReveal>
          <BlurReveal delay={0.08}>
            <h2 className="heading-section mt-8 mb-5">
              Your <span className="gold-text">Cosmic Journey</span>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.16}>
            <p className="text-body mx-auto max-w-lg">
              Track progress through gamified wisdom levels
            </p>
          </BlurReveal>
        </div>

        <Reveal className="mx-auto max-w-3xl">
          <div className="glass-card p-10 lg:p-14">
            <div className="grid lg:grid-cols-3 gap-8 mb-10">
              <div className="text-center">
                <p className="text-label text-gold/50 mb-6">Wisdom XP</p>
                <div className="relative h-32 w-32 mx-auto mb-4">
                  <svg className="absolute inset-0" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="50" stroke="rgba(201,162,77,0.1)" strokeWidth="4" />
                    <motion.circle
                      cx="60" cy="60" r="50"
                      stroke="#C9A24D"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - xpPercentage / 100)}`}
                      strokeLinecap="round"
                      animate={{ strokeDashoffset: `${2 * Math.PI * 50 * (1 - xpPercentage / 100)}` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-center">
                      <span className="text-2xl font-bold text-gold">{xp.toLocaleString()}</span>
                      <p className="text-xs text-text-dim/50">/ {maxXp.toLocaleString()}</p>
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-dim/60">Unlock deeper insights</p>
              </div>

              <div className="text-center">
                <p className="text-label text-gold/50 mb-6">Daily Streak</p>
                <div className="flex gap-1 justify-center mb-6 flex-wrap">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`h-8 w-8 rounded-lg ${
                        i < 5 ? "bg-gold/30" : "bg-gold/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-gold mb-1">5 days</p>
                <p className="text-xs text-text-dim/60">Keep reading daily</p>
              </div>

              <div className="text-center">
                <p className="text-label text-gold/50 mb-6">Achievements</p>
                <div className="flex gap-3 justify-center mb-6">
                  {[
                    { emoji: "⭐", label: "Novice" },
                    { emoji: "🌙", label: "Seeker" },
                    { emoji: "🔮", label: "Sage" },
                  ].map((badge, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotateY: 180 }}
                      animate={inView ? { scale: 1, rotateY: 0 } : { scale: 0, rotateY: 180 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="h-12 w-12 flex items-center justify-center rounded-full bg-gold/[0.08] text-xl"
                    >
                      {badge.emoji}
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-text-dim/60">3 badges earned</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/[0.03] text-center">
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold/70 hover:text-gold transition-colors">
                See Your Full Progress
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────
   JOURNEY PROGRESS BAR
   ──────────────────────────────────────────────────── */
function JourneyProgressBar() {
  const { scrollYProgress } = useScroll()
  const [isVisible, setIsVisible] = useState(false)
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null)

  useMotionValueEvent(scrollYProgress, "change", () => {
    setIsVisible(true)
    if (hideTimer) clearTimeout(hideTimer)
    const newTimer = setTimeout(() => setIsVisible(false), 3000)
    setHideTimer(newTimer)
  })

  const sections = [
    { id: "hero", label: "Hero", offset: 0 },
    { id: "verses", label: "Verses", offset: 0.08 },
    { id: "quiz", label: "Compass", offset: 0.15 },
    { id: "sciences", label: "Sciences", offset: 0.25 },
    { id: "stats", label: "Stats", offset: 0.32 },
    { id: "guided-demo", label: "Try", offset: 0.42 },
    { id: "technology", label: "Why GrahAI", offset: 0.55 },
    { id: "how-it-works", label: "How It Works", offset: 0.65 },
    { id: "panchang", label: "Panchang", offset: 0.73 },
    { id: "testimonials", label: "Stories", offset: 0.82 },
    { id: "gamification", label: "Progress", offset: 0.90 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:flex fixed top-[80px] left-0 right-0 z-40 bg-gradient-to-r from-bg/60 via-bg/80 to-bg/60 backdrop-blur-sm border-b border-white/[0.03]">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 h-12 flex items-center gap-6">
        {sections.map((sec, i) => (
          <motion.button
            key={sec.id}
            onClick={() => {
              const elem = document.getElementById(sec.id)
              elem?.scrollIntoView({ behavior: "smooth" })
            }}
            className="relative flex items-center gap-2 group"
          >
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-gold/30 group-hover:bg-gold/70 transition-colors"
              style={{ scaleX: useTransform(scrollYProgress, [sec.offset - 0.05, sec.offset + 0.05], [0.5, 1]) }}
            />
            <span className="text-xs font-semibold text-text-dim/50 group-hover:text-gold/70 transition-colors whitespace-nowrap">
              {sec.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────
   ENHANCED HOW IT WORKS WITH ANIMATED LINE
   ──────────────────────────────────────────────────── */
function HowItWorksEnhanced() {
  const steps = [
    {
      num: "01",
      title: "Upload Your Birth Data",
      desc: "Share your birth date, time, and place — or let us help you find it.",
      icon: "📍"
    },
    {
      num: "02",
      title: "Choose Your Sciences",
      desc: "Select which Vedic traditions resonate with you most.",
      icon: "⚖️"
    },
    {
      num: "03",
      title: "Receive Your Reading",
      desc: "Get a deeply personal, AI-synthesized interpretation in seconds.",
      icon: "✨"
    }
  ]

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" ref={containerRef} className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16 lg:mb-24">
          <BlurReveal><Divider /></BlurReveal>
          <BlurReveal delay={0.08}>
            <h2 className="heading-section mt-8 mb-5">
              How It <span className="gold-text">Works</span>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.16}>
            <p className="text-body mx-auto max-w-lg">
              Three simple steps from birth data to cosmic insight
            </p>
          </BlurReveal>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <svg className="absolute top-16 left-0 right-0 h-12 w-full pointer-events-none" style={{ overflow: "visible" }}>
            <motion.line
              x1="0" y1="32" x2="100%" y2="32"
              stroke="#C9A24D" strokeWidth="1"
              strokeDasharray="2,4"
              initial={{ strokeDashoffset: 100 }}
              animate={isInView ? { strokeDashoffset: 0 } : { strokeDashoffset: 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              opacity="0.3"
            />
          </svg>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={0.1 + i * 0.15}>
                <div className="relative">
                  <div className="text-6xl mb-6 opacity-10">{step.icon}</div>
                  <div className="absolute -top-3 -left-6 h-12 w-12 rounded-full border-2 border-gold/30 bg-bg flex items-center justify-center">
                    <span className="text-xs font-bold text-gold">{step.num}</span>
                  </div>
                  <h3 className="heading-card mb-3 mt-2">{step.title}</h3>
                  <p className="text-body">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────
   BACKGROUND LAYERS
   ──────────────────────────────────────────────────── */
function Stars() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {STARS.map(s => (
        <div key={s.id} className="star" style={{
          left: s.left, top: s.top,
          width: `${s.w}px`, height: `${s.w}px`,
          "--dur": `${s.dur}s`, "--del": `${s.del}s`,
        } as React.CSSProperties} />
      ))}
    </div>
  )
}

function Blobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[15%] top-[5%] h-[700px] w-[700px] rounded-full bg-indigo/[0.06] blur-[140px]"
        style={{ animation: "aurora-move 22s ease-in-out infinite" }} />
      <div className="absolute -right-[10%] top-[35%] h-[500px] w-[500px] rounded-full bg-gold/[0.03] blur-[120px]"
        style={{ animation: "aurora-move 28s ease-in-out infinite 7s" }} />
      <div className="absolute left-[30%] bottom-[0%] h-[600px] w-[600px] rounded-full bg-indigo/[0.04] blur-[130px]"
        style={{ animation: "aurora-move 20s ease-in-out infinite 14s" }} />
    </div>
  )
}

/* Floating golden particles for cinematic depth */
function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map(p => (
        <motion.div key={p.id}
          className="absolute rounded-full bg-gold/20"
          style={{
            left: p.left, top: p.top,
            width: `${p.size}px`, height: `${p.size}px`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, p.drift * 0.3, 0],
            opacity: [0.05, 0.25, 0.05],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.del,
          }}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────
   NAVBAR
   ──────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "glass-nav border-b border-white/[0.04]" : ""
      }`}
    >
      <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-4 group">
          <BrandLogo size={62} />
          <div className="flex flex-col">
            <span className="text-[30px] font-extrabold tracking-tight leading-none">
              Grah<span className="gold-text">AI</span>
            </span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-gold/50 font-semibold leading-none mt-1">
              Vedic Intelligence
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <Link href="/product"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Product</Link>
          <Link href="/pricing"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Pricing</Link>
          <Link href="/about"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">About</Link>
          <Link href="/blog"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Knowledge</Link>
          <a href="#sciences"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Sciences</a>
          <Link href="/chat"
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-gold/60 transition-colors hover:text-gold">
            <MessageCircle className="h-3.5 w-3.5" />
            Chat
          </Link>
          <a href="#waitlist"
            className="group flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold/70 transition-all hover:border-gold/30 hover:bg-gold/[0.06] hover:shadow-lg hover:shadow-gold/5">
            Early Access
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.nav>
  )
}

/* ────────────────────────────────────────────────────
   MARQUEE
   ──────────────────────────────────────────────────── */
function Marquee() {
  const items = [
    "ज्योतिष", "◇", "♈ मेष", "♉ वृषभ", "♊ मिथुन", "♋ कर्क",
    "◇", "अंकशास्त्र", "◇", "♌ सिंह", "♍ कन्या", "♎ तुला", "♏ वृश्चिक",
    "◇", "वास्तु", "◇", "♐ धनु", "♑ मकर", "♒ कुम्भ", "♓ मीन", "◇", "टैरो",
  ]
  const belt = [...items, ...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-white/[0.03] py-5">
      <div className="absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-bg to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-bg to-transparent" />
      <div className="marquee-belt">
        {belt.map((item, i) => (
          <span key={i} className="mx-6 whitespace-nowrap font-hindi text-xs text-text/[0.07]">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────
   SCIENCE CARD — with hover tilt + specular sweep
   ──────────────────────────────────────────────────── */
function ScienceCard({ num, icon, title, titleHi, text, i }: {
  num: string; icon: string; title: string; titleHi: string; text: string; i: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50 })

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({ x: (y - 0.5) * -8, y: (x - 0.5) * 8 })
    setGlare({ x: x * 100, y: y * 100 })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setGlare({ x: 50, y: 50 })
  }

  return (
    <Reveal delay={i * 0.12}>
      <div ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card group relative overflow-hidden p-8 lg:p-10 h-full"
        style={{
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.3s ease-out",
        }}>
        {/* Specular glare */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(201,162,77,0.06) 0%, transparent 60%)`,
          }} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <span className="pointer-events-none absolute -top-4 -right-2 select-none text-[100px] font-bold leading-none text-gold/[0.02] transition-colors duration-700 group-hover:text-gold/[0.05]">
          {num}
        </span>
        <div className="relative">
          <div className="mb-7 flex items-start justify-between">
            <motion.span className="text-4xl inline-block"
              whileHover={{ scale: 1.15, rotate: 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              {icon}
            </motion.span>
            <span className="text-label text-gold/40">{num}</span>
          </div>
          <h3 className="heading-card mb-1">{title}</h3>
          <p className="mb-4 font-hindi text-xs text-gold/50">{titleHi}</p>
          <p className="text-caption">{text}</p>
          <div className="mt-7 flex items-center gap-2 text-label text-gold/45 transition-all duration-300 group-hover:gap-3 group-hover:text-gold/65">
            <span>Explore</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ────────────────────────────────────────────────────
   FEATURE CARD — with golden left-border animation
   ──────────────────────────────────────────────────── */
function FeatureCard({ icon, title, text, i }: {
  icon: React.ReactNode; title: string; text: string; i: number
}) {
  return (
    <Reveal delay={i * 0.08}>
      <div className="group relative rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50 h-full overflow-hidden">
        {/* Animated left border accent */}
        <div className="absolute left-0 top-0 h-0 w-[2px] bg-gradient-to-b from-gold/60 to-gold/0 transition-all duration-700 group-hover:h-full" />
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gold/10 bg-gold/[0.04] text-gold/50 transition-all duration-500 group-hover:text-gold/70 group-hover:border-gold/20 group-hover:bg-gold/[0.08] group-hover:shadow-lg group-hover:shadow-gold/5">
          {icon}
        </div>
        <h3 className="mb-2.5 text-lg font-semibold text-text">{title}</h3>
        <p className="text-caption">{text}</p>
      </div>
    </Reveal>
  )
}

/* ────────────────────────────────────────────────────
   STAT — count-up animation
   ──────────────────────────────────────────────────── */
function Stat({ val, prefix, suffix, label, d }: { val: number; prefix?: string; suffix?: string; label: string; d: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur = 2000
    function tick(now: number) {
      const p = Math.min((now - start) / dur, 1)
      setN(Math.floor((1 - Math.pow(1 - p, 4)) * val))
      if (p < 1) requestAnimationFrame(tick)
    }
    const t = setTimeout(() => requestAnimationFrame(tick), d * 1000)
    return () => clearTimeout(t)
  }, [inView, val, d])

  return (
    <Reveal delay={d}>
      <div ref={ref} className="text-center">
        <div className="gold-text mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
          {prefix}{n}{suffix}
        </div>
        <p className="text-label text-text-dim/60">{label}</p>
      </div>
    </Reveal>
  )
}

/* ────────────────────────────────────────────────────
   STEP — with animated timeline connector
   ──────────────────────────────────────────────────── */
function Step({ num, title, titleHi, text, i }: {
  num: string; title: string; titleHi: string; text: string; i: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <Reveal delay={i * 0.12}>
      <div ref={ref} className="group flex gap-6 lg:gap-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
            transition={{ ...cinematic, delay: i * 0.15 }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/10 bg-gold/[0.03] transition-all duration-500 group-hover:border-gold/25 group-hover:bg-gold/[0.06] group-hover:shadow-lg group-hover:shadow-gold/10">
            <span className="text-base font-semibold text-gold/70">{num}</span>
          </motion.div>
          {i < 2 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15 + 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 w-px flex-1 origin-top bg-gradient-to-b from-gold/10 to-transparent" />
          )}
        </div>
        <div className="pb-14">
          <h3 className="mb-1 text-xl font-semibold text-text">{title}</h3>
          <p className="mb-2.5 font-hindi text-[11px] text-gold/45">{titleHi}</p>
          <p className="text-caption max-w-md">{text}</p>
        </div>
      </div>
    </Reveal>
  )
}

/* ────────────────────────────────────────────────────
   TRACEABILITY PROOF CARD — interactive demo
   ──────────────────────────────────────────────────── */
function TraceabilityCard() {
  const [revealed, setRevealed] = useState(false)

  return (
    <ScaleReveal delay={0.1}>
      <div className="glass-card p-8 lg:p-10 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <p className="text-label text-gold/50 mb-4">Traceability Demo</p>
        <h3 className="heading-card mb-6">Every insight is <span className="gold-text">source-verified</span></h3>

        {/* Sample insight */}
        <div className="rounded-xl border border-white/[0.06] bg-bg/60 p-5 mb-4">
          <p className="text-sm text-text/85 mb-3">
            <Sparkles className="inline h-3.5 w-3.5 text-gold/60 mr-1.5" />
            &ldquo;Jupiter in the 5th house blesses the native with wisdom, good fortune in education, and virtuous children.&rdquo;
          </p>

          {!revealed ? (
            <button onClick={() => setRevealed(true)}
              className="flex items-center gap-2 text-xs text-gold/65 hover:text-gold/85 transition-colors group">
              <Eye className="h-3.5 w-3.5" />
              <span>View classical source</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden">
              <div className="border-t border-white/[0.04] pt-3 mt-1 space-y-2">
                <p className="font-hindi text-sm text-gold/60">
                  पुत्रस्थाने गुरौ जाते विद्यावान् धनवान् सुखी
                </p>
                <p className="text-xs text-text-dim/65 italic">
                  &ldquo;When Guru occupies the fifth bhava, the native is learned, wealthy, and happy.&rdquo;
                </p>
                <p className="text-[10px] text-text-dim/50 uppercase tracking-wider">
                  Source: Brihat Parashara Hora Shastra, Ch. 24, Shloka 18
                </p>
              </div>
            </motion.div>
          )}
        </div>
        <p className="text-caption">
          Every prediction links to the original Sanskrit verse, transliteration, and meaning — so you can verify the wisdom yourself.
        </p>
      </div>
    </ScaleReveal>
  )
}

/* ────────────────────────────────────────────────────
   GUIDED DEMO FUNNEL
   ──────────────────────────────────────────────────── */
function GuidedDemo() {
  const [step, setStep] = useState(0)
  const [selectedScience, setSelectedScience] = useState("")
  const [selectedIntent, setSelectedIntent] = useState("")

  const sciences = [
    { id: "astrology", icon: "☿", name: "Vedic Astrology" },
    { id: "numerology", icon: "𝟗", name: "Numerology" },
    { id: "tarot", icon: "✦", name: "Tarot Reading" },
    { id: "vastu", icon: "◈", name: "Vastu Shastra" },
  ]

  const intents = [
    { id: "career", icon: "💼", name: "Career & Success" },
    { id: "love", icon: "💕", name: "Love & Relationships" },
    { id: "health", icon: "🌿", name: "Health & Wellness" },
    { id: "wealth", icon: "✨", name: "Wealth & Prosperity" },
  ]

  return (
    <section className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <BlurReveal><Divider /></BlurReveal>
        <BlurReveal delay={0.08}><p className="text-label text-gold/50 mt-6 mb-4">Try It</p></BlurReveal>
        <BlurReveal delay={0.16}>
          <h2 className="heading-section mb-5">
            See what <span className="gold-text">your reading</span> looks like
          </h2>
        </BlurReveal>
        <BlurReveal delay={0.24}>
          <p className="text-body mx-auto max-w-lg mb-12">
            Choose your science and intention to preview a sample reading.
          </p>
        </BlurReveal>

        <ScaleReveal delay={0.3}>
          <div className="glass-card p-8 lg:p-12 text-left">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500 ${
                    step >= s - 1
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "border border-white/[0.06] text-text-dim/50"
                  }`}>{s}</div>
                  {s < 3 && <div className={`h-px w-8 transition-colors duration-500 ${step >= s ? "bg-gold/20" : "bg-white/[0.04]"}`} />}
                </div>
              ))}
            </div>

            {/* Step 0: Pick science */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-text/80 mb-5">Choose your Vedic science:</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {sciences.map(s => (
                    <button key={s.id}
                      onClick={() => { setSelectedScience(s.id); setStep(1) }}
                      className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-bg/40 p-5 transition-all duration-300 hover:border-gold/20 hover:bg-gold/[0.04]">
                      <span className="text-3xl transition-transform group-hover:scale-110">{s.icon}</span>
                      <span className="text-xs text-text/80 group-hover:text-gold/80">{s.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Pick intent */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={smooth}>
                <p className="text-sm text-text/80 mb-5">What area of your life?</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {intents.map(i => (
                    <button key={i.id}
                      onClick={() => { setSelectedIntent(i.id); setStep(2) }}
                      className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-bg/40 p-5 transition-all duration-300 hover:border-gold/20 hover:bg-gold/[0.04]">
                      <span className="text-2xl">{i.icon}</span>
                      <span className="text-xs text-text/80 group-hover:text-gold/80">{i.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Locked preview */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={smooth}>
                <div className="relative rounded-xl border border-gold/10 bg-bg/60 p-6 overflow-hidden">
                  {/* Blurred preview content */}
                  <div className="space-y-3 select-none" style={{ filter: "blur(4px)" }}>
                    <div className="h-4 w-3/4 rounded bg-text/10" />
                    <div className="h-3 w-full rounded bg-text/5" />
                    <div className="h-3 w-5/6 rounded bg-text/5" />
                    <div className="h-3 w-2/3 rounded bg-text/5" />
                    <div className="h-8 w-40 rounded bg-gold/10 mt-4" />
                    <div className="h-3 w-full rounded bg-text/5" />
                    <div className="h-3 w-4/5 rounded bg-text/5" />
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/60 backdrop-blur-sm">
                    <Lock className="h-8 w-8 text-gold/60 mb-3" />
                    <p className="text-sm font-medium text-text/85 mb-1">Your personalized reading is ready</p>
                    <p className="text-xs text-text-dim/60 mb-5">Join the waitlist to unlock full reports</p>
                    <a href="#waitlist"
                      className="group inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-bg transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/10">
                      Unlock Full Report
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
                <button onClick={() => { setStep(0); setSelectedScience(""); setSelectedIntent("") }}
                  className="mt-4 text-xs text-text-dim/50 hover:text-text-dim/70 transition-colors">
                  Start over
                </button>
              </motion.div>
            )}
          </div>
        </ScaleReveal>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════
   LANDING PAGE
   ════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [wlCount, setWlCount] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroO = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  const yantraR = useTransform(scrollYProgress, [0, 1], [0, 30])
  const yantraScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroBlur = useTransform(scrollYProgress, [0.3, 0.6], [0, 8])

  useEffect(() => {
    supabase?.from("waitlist").select("id", { count: "exact", head: true })
      .then(({ count }: { count: number | null }) => { if (count !== null) setWlCount(count) })
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const v = email.trim().toLowerCase()
    if (!v) return
    setStatus("loading"); setErrorMsg("")
    try {
      const { error } = await supabase.from("waitlist").insert({ email: v })
      if (error) {
        if (error.code === "23505") { setErrorMsg("You're already on the list."); setStatus("error") }
        else throw error
        return
      }
      setStatus("success"); setWlCount(c => c + 1); setEmail("")
    } catch {
      setErrorMsg("Something went wrong. Try again."); setStatus("error")
    }
  }

  /* ── DATA ─────────────────────────────── */
  const sciences = [
    { num: "01", icon: "☿", title: "Kundli & Jyotish", titleHi: "कुंडली और ज्योतिष",
      text: "Your complete birth chart — planetary positions, Dasha timelines, Yogas, Doshas, and transits. Every prediction rooted in Brihat Parashara Hora Shastra, not generic sun-sign horoscopes." },
    { num: "02", icon: "𝟗", title: "Numerology", titleHi: "अंकशास्त्र",
      text: "Life Path, Destiny, Soul Urge, and Karmic Debt numbers through Pythagorean and Chaldean systems. Name vibration analysis with year-ahead forecasts and compatibility readings." },
    { num: "03", icon: "✦", title: "Tarot Reading", titleHi: "टैरो रीडिंग",
      text: "Full 78-card deck with Major and Minor Arcana. Celtic Cross, Three-Card, and Relationship spreads — each card interpreted with reversals, positional context, and elemental dignities." },
    { num: "04", icon: "◈", title: "Vastu Shastra", titleHi: "वास्तु शास्त्र",
      text: "Directional energy mapping for homes and workspaces. Room-by-room placement guidance, five-element balancing, and specific remedies grounded in classical Vastu texts." },
  ]

  const whyFeatures = [
    { icon: <BookOpen className="h-5 w-5" />, title: "Rooted in Classical Texts",
      text: "Every insight traces back to BPHS, Saravali, and Phaladeepika — the foundational texts of Vedic astrology spanning 2,000+ years." },
    { icon: <Zap className="h-5 w-5" />, title: "Instant, Detailed Readings",
      text: "From birth details to a comprehensive Kundli reading in under 30 seconds. No waiting, no appointments — available around the clock." },
    { icon: <Eye className="h-5 w-5" />, title: "Deeply Personalized",
      text: "Not one-size-fits-all predictions. Each reading is computed for your exact birth data — down to arc-second planetary precision." },
    { icon: <Shield className="h-5 w-5" />, title: "Private & Encrypted",
      text: "Birth data encrypted at rest and in transit. We never share personal information. You retain complete data sovereignty." },
    { icon: <Globe className="h-5 w-5" />, title: "Bilingual Output",
      text: "Complete readings in English and Hindi with authentic Devanagari script. Sanskrit terminology preserved with clear modern explanations." },
    { icon: <Star className="h-5 w-5" />, title: "Improves with Opt-in Feedback",
      text: "Pattern recognition deepens over time with your permission. Your second consultation is more insightful than your first — and your data remains yours." },
  ]

  const steps = [
    { num: "I", title: "Enter Your Birth Details", titleHi: "जन्म विवरण दें",
      text: "Date, time, and place of birth. Our ephemeris engine computes planetary positions to arc-second precision — the same accuracy used by professional astrologers worldwide." },
    { num: "II", title: "AI Analyzes Your Chart", titleHi: "AI विश्लेषण करे",
      text: "Our system examines every dimension — Dasha periods, Nakshatra placements, house lordships, Yogas, and transits. Each finding is cross-referenced against classical texts." },
    { num: "III", title: "Receive Your Reading", titleHi: "अपना पठन प्राप्त करें",
      text: "A deeply personal report with predictions, remedies, gemstone suggestions, and favorable periods — delivered in your preferred language, ready to guide your decisions." },
  ]

  return (
    <main className="relative min-h-screen bg-bg overflow-x-hidden">
      <Stars />
      <Blobs />
      <FloatingParticles />
      <Navbar />
      <JourneyProgressBar />

      {/* ═══════════════════════════════════════════
          HERO — cinematic parallax depth
          ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        {/* Yantra background — parallax depth */}
        <motion.div style={{ rotate: yantraR, scale: yantraScale }}
          className="pointer-events-none absolute right-[-8%] top-[8%] hidden text-gold lg:block">
          <Yantra size={650} />
        </motion.div>

        <div className="yantra-bg pointer-events-none absolute inset-0" />

        {/* Cinematic radial glow behind hero */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gold/[0.02] blur-[200px]"
          style={{ animation: "pulse-soft 6s ease-in-out infinite" }} />

        <motion.div style={{ opacity: heroO, y: heroY }}
          className="relative z-10 w-full">

          <div className="mx-auto flex flex-col items-center text-center max-w-3xl px-6 lg:px-10 pt-32 pb-20 lg:pt-36 lg:pb-24">
            {/* Badge — urgency reframe */}
            <BlurReveal delay={0.2}>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/10 bg-gold/[0.02] px-5 py-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/65">
                  Private Beta Opens April 2026
                </span>
              </div>
            </BlurReveal>

            {/* Tagline — staggered character reveal */}
            <BlurReveal delay={0.35}>
              <h1 className="heading-hero mb-5">
                <CharReveal text="Your Planets." className="text-text" delay={0.4} />
                <br />
                <CharReveal text="Your Path." className="gold-text" delay={0.7} />
              </h1>
            </BlurReveal>

            {/* Hindi subtitle */}
            <BlurReveal delay={0.5}>
              <p className="mb-7 font-hindi text-xl text-gold/40 md:text-2xl">
                आपके ग्रह, आपकी राह
              </p>
            </BlurReveal>

            {/* Body */}
            <BlurReveal delay={0.65}>
              <p className="text-body mb-10 max-w-xl">
                GrahAI brings together four Vedic sciences — Astrology, Numerology,
                Tarot, and Vastu — powered by AI trained on classical Sanskrit texts.
                Deeply personal readings, computed with precision, delivered in seconds.
              </p>
            </BlurReveal>

            {/* Primary CTA Button */}
            <BlurReveal delay={0.8}>
              <Link href="/chat"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-light px-10 py-4 text-base font-semibold text-bg transition-all hover:shadow-xl hover:shadow-gold/20 active:scale-[0.98]"
                style={{ animation: "pulse-soft 4s ease-in-out infinite" }}>
                Start Your Cosmic Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </BlurReveal>

            {/* Micro-nav links */}
            <BlurReveal delay={0.95}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm font-medium">
                <a href="#sciences"
                  className="text-text-dim/60 transition-colors hover:text-gold/70">Explore Jyotish</a>
                <span className="hidden sm:inline text-text-dim/20">·</span>
                <a href="#guided-demo"
                  className="text-text-dim/60 transition-colors hover:text-gold/70">Try a Reading</a>
                <span className="hidden sm:inline text-text-dim/20">·</span>
                <a href="#how-it-works"
                  className="text-text-dim/60 transition-colors hover:text-gold/70">Learn the Sciences</a>
              </div>
            </BlurReveal>

            {/* Waitlist counter */}
            {wlCount > 0 && (
              <BlurReveal delay={1.1}>
                <p className="mt-8 text-xs text-text-dim/50 text-center">
                  <span className="text-gold/50 font-medium">{wlCount.toLocaleString()}</span> seekers already on the path
                </p>
              </BlurReveal>
            )}
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-text/25">
            <span className="text-[8px] tracking-[0.3em] uppercase font-semibold">Scroll</span>
            <ArrowDown className="h-3 w-3" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          VERSE TICKER
          ═══════════════════════════════════════════ */}
      <VerseTicker />

      {/* ═══════════════════════════════════════════
          COSMIC SNAPSHOT — Zero-Signup Mini Reading
          ═══════════════════════════════════════════ */}
      <CosmicSnapshot />

      {/* ═══════════════════════════════════════════
          ASK ONE QUESTION — 3-Click Clarity
          ═══════════════════════════════════════════ */}
      <AskOneQuestion />

      {/* ═══════════════════════════════════════════
          DECODE YOUR NAME — Viral Numerology
          ═══════════════════════════════════════════ */}
      <DecodeYourName />

      {/* ═══════════════════════════════════════════
          COSMIC COMPASS QUIZ
          ═══════════════════════════════════════════ */}
      <CosmicCompassQuiz />

      {/* ═══════════════════════════════════════════
          FOUR SCIENCES
          ═══════════════════════════════════════════ */}
      <section id="sciences" className="relative py-28 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 lg:mb-24 text-center mx-auto max-w-2xl">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.08}><p className="text-label text-gold/50 mt-6 mb-4">Four Vedic Sciences</p></BlurReveal>
            <BlurReveal delay={0.16}>
              <h2 className="heading-section mb-5">
                Four pillars of <span className="gold-text">ancient knowledge</span>
              </h2>
            </BlurReveal>
            <BlurReveal delay={0.24}>
              <p className="text-body mx-auto max-w-lg">
                Each discipline draws from source texts spanning two millennia.
                Deep expertise in every tradition, unified under one platform.
              </p>
            </BlurReveal>
          </div>

          <div className="grid gap-6 lg:gap-7 md:grid-cols-2">
            {sciences.map((s, i) => <ScienceCard key={s.title} {...s} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS — real values with count-up
          ═══════════════════════════════════════════ */}
      <div className="relative border-y border-white/[0.03] py-20 lg:py-28">
        <div className="yantra-bg absolute inset-0" />
        <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-6 sm:grid-cols-2 md:grid-cols-4">
          <Stat val={4} label="Vedic Sciences" d={0} />
          <Stat val={2000} suffix="+" label="Years of Wisdom" d={0.08} />
          <Stat val={78} label="Tarot Cards" d={0.16} />
          <Stat val={30} prefix="≤" suffix="s" label="Reading Time" d={0.24} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          GUIDED DEMO FUNNEL — conversion section
          ═══════════════════════════════════════════ */}
      <GuidedDemo />

      {/* ═══════════════════════════════════════════
          WHY GRAHAI
          ═══════════════════════════════════════════ */}
      <section id="technology" className="relative py-28 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 lg:mb-24 text-center mx-auto max-w-2xl">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.08}><p className="text-label text-gold/50 mt-6 mb-4">Why GrahAI</p></BlurReveal>
            <BlurReveal delay={0.16}>
              <h2 className="heading-section mb-5">
                Not another <span className="gold-text">horoscope app</span>
              </h2>
            </BlurReveal>
            <BlurReveal delay={0.24}>
              <p className="text-body mx-auto max-w-lg">
                Every insight is traceable to a specific verse in classical texts.
                Built for depth, accuracy, and trust.
              </p>
            </BlurReveal>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyFeatures.map((f, i) => <FeatureCard key={f.title} {...f} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRACEABILITY PROOF
          ═══════════════════════════════════════════ */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <TraceabilityCard />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS - ENHANCED
          ═══════════════════════════════════════════ */}
      <HowItWorksEnhanced />

      {/* ═══════════════════════════════════════════
          DAILY PANCHANG
          ═══════════════════════════════════════════ */}
      <DailyPanchang />

      {/* ═══════════════════════════════════════════
          VERSE OF THE DAY — Classical Wisdom
          ═══════════════════════════════════════════ */}
      <VerseOfTheDay />

      {/* ═══════════════════════════════════════════
          THIS WEEK IN THE STARS — Transit Brief
          ═══════════════════════════════════════════ */}
      <WeeklyTransitBrief />

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section id="testimonials" className="relative py-28 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 lg:mb-24 text-center mx-auto max-w-2xl">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.08}><p className="text-label text-gold/50 mt-6 mb-4">What Testers Say</p></BlurReveal>
            <BlurReveal delay={0.16}>
              <h2 className="heading-section mb-5">
                Loved by our <span className="gold-text">early community</span>
              </h2>
            </BlurReveal>
            <BlurReveal delay={0.24}>
              <p className="text-body mx-auto max-w-lg">
                Hear from beta testers who experienced GrahAI&apos;s Vedic intelligence firsthand.
              </p>
            </BlurReveal>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Priya Sharma",
                role: "Software Engineer, Bangalore",
                quote: "The Kundli analysis was shockingly accurate. It identified career patterns I've been noticing for years — and the Sanskrit source citations let me verify everything myself.",
                rating: 5,
              },
              {
                name: "Arjun Mehta",
                role: "Business Owner, Mumbai",
                quote: "I was skeptical about AI-powered astrology, but the Vastu recommendations for my new office were spot-on. My team noticed the difference within weeks.",
                rating: 5,
              },
              {
                name: "Kavitha Nair",
                role: "Yoga Instructor, Kerala",
                quote: "GrahAI's numerology reading captured my life path with such depth. It felt like talking to a learned pandit, not a chatbot. Truly remarkable.",
                rating: 5,
              },
              {
                name: "Rahul Verma",
                role: "Medical Student, Delhi",
                quote: "The tarot readings are beautifully presented with real classical interpretations. No generic AI filler — every card meaning traced back to authentic sources.",
                rating: 5,
              },
              {
                name: "Deepika Joshi",
                role: "Interior Designer, Pune",
                quote: "As someone who studies Vastu professionally, I'm impressed by the accuracy. GrahAI references Vishwakarma Vastu Shastra correctly — something most apps get wrong.",
                rating: 5,
              },
              {
                name: "Vikram Singh",
                role: "Startup Founder, Hyderabad",
                quote: "Joined the beta expecting another horoscope app. Instead, I got a deeply personalized Dasha analysis with remedies I could actually follow. Game changer.",
                rating: 5,
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="group flex flex-col rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50 h-full">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg key={j} className="h-4 w-4 text-gold" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-text/85 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-auto pt-5 border-t border-white/[0.04]">
                    <p className="text-sm font-semibold text-text">{t.name}</p>
                    <p className="text-xs text-text-dim/55 mt-1">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GAMIFICATION VISUALIZATION
          ═══════════════════════════════════════════ */}
      <GamificationVisualization />

      {/* ═══════════════════════════════════════════
          PRICING — Geo-Based Plans + Micro-Transactions
          ═══════════════════════════════════════════ */}
      <PricingSection />

      {/* ═══════════════════════════════════════════
          FINAL CTA — with waitlist form
          ═══════════════════════════════════════════ */}
      <section className="relative py-28 lg:py-40">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[300px] rounded-full bg-gold/[0.04] blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <BlurReveal><Divider /></BlurReveal>
          <BlurReveal delay={0.1}>
            <h2 className="heading-section mt-8 mb-5">
              Your stars are already <span className="gold-text">aligned</span>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-body mx-auto mb-10 max-w-md">
              Join the waitlist and be among the first to experience
              precision Vedic readings when we launch.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.3}>
            <div id="waitlist" className="w-full max-w-md mx-auto">
              {status === "success" ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 rounded-2xl border border-green/15 bg-green/[0.03] px-6 py-5">
                  <div className="rounded-full bg-green/10 p-2"><Check className="h-4 w-4 text-green" /></div>
                  <div>
                    <p className="text-sm font-medium text-text">You&apos;re on the list</p>
                    <p className="text-xs text-text-dim">We&apos;ll reach out before launch.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <input type="email" value={email} required
                    onChange={e => { setEmail(e.target.value); if (status === "error") setStatus("idle") }}
                    placeholder="you@example.com"
                    className="h-13 flex-1 rounded-xl border border-white/[0.06] bg-bg-2/60 px-5 text-sm text-text placeholder:text-text-dim/55 backdrop-blur transition-all focus:border-gold/20 focus:outline-none focus:ring-1 focus:ring-gold/10" />
                  <button type="submit" disabled={status === "loading"}
                    className="group flex h-13 items-center justify-center gap-2 rounded-xl bg-gold px-8 text-sm font-semibold text-bg transition-all hover:bg-gold-light hover:shadow-xl hover:shadow-gold/15 active:scale-[0.98] disabled:opacity-50"
                    style={{ animation: status === "idle" ? "pulse-soft 4s ease-in-out infinite" : "none" }}>
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <>Join Waitlist<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>
                    )}
                  </button>
                </form>
              )}
              {status === "error" && errorMsg && <p className="mt-2 text-xs text-gold/75">{errorMsg}</p>}
              {wlCount > 0 && status !== "success" && (
                <p className="mt-4 text-xs text-text-dim/50 text-center">
                  <span className="text-gold/50 font-medium">{wlCount.toLocaleString()}</span> seekers already joined
                </p>
              )}
              <p className="mt-3 text-[10px] text-text-dim/45 text-center">
                Waitlist gets founder pricing + free first report
              </p>
            </div>
          </BlurReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.03] py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo size={38} />
                <span className="text-lg font-bold text-text/80">GrahAI</span>
              </div>
              <p className="text-caption max-w-xs mb-3">
                Ancient Vedic wisdom meets modern AI. Your planets, your path —
                decoded with precision.
              </p>
              <p className="font-hindi text-xs text-gold/35">
                आपके ग्रह, आपकी राह
              </p>
            </div>
            <div>
              <p className="text-label text-text-dim/50 mb-4">Platform</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/product" className="text-sm text-text-dim/60 transition-colors hover:text-gold/65">Product</Link>
                <Link href="/pricing" className="text-sm text-text-dim/60 transition-colors hover:text-gold/65">Pricing</Link>
                <Link href="/about" className="text-sm text-text-dim/60 transition-colors hover:text-gold/65">About</Link>
                <Link href="/blog" className="text-sm text-text-dim/60 transition-colors hover:text-gold/65">Knowledge</Link>
              </div>
            </div>
            <div>
              <p className="text-label text-text-dim/50 mb-4">Company</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/contact" className="text-sm text-text-dim/60 transition-colors hover:text-gold/65">Contact</Link>
                <a href="#" className="text-sm text-text-dim/60 transition-colors hover:text-gold/65">Privacy Policy</a>
                <a href="#" className="text-sm text-text-dim/60 transition-colors hover:text-gold/65">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-white/[0.03] pt-6 text-center">
            <p className="text-[11px] text-text-dim/40">&copy; {new Date().getFullYear()} GrahAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ─── Exit Intent Popup ─── */}
      <ExitIntentPopup />

      {/* ─── WhatsApp Floating CTA ─── */}
      <WhatsAppCTA />

      {/* ─── Floating Chat Button ─── */}
      <Link href="/chat">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 left-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] to-[#E2C474] shadow-lg shadow-[#C9A24D]/30 transition-transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-[#0B0E1A]" />
        </motion.div>
      </Link>
    </main>
  )
}
