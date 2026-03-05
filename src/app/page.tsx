"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { ArrowRight, ArrowDown, Check, Loader2, Star, Shield, Zap, Globe, BookOpen, Eye, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

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

/* ────────────────────────────────────────────────────
   BRAND LOGO SVG — Celestial orbit symbol
   ──────────────────────────────────────────────────── */
function BrandLogo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" stroke="url(#logoGrad)" strokeWidth="0.8" opacity="0.55" />
      <circle cx="24" cy="24" r="15" stroke="url(#logoGrad)" strokeWidth="0.5" opacity="0.3" />
      {/* Planet nodes */}
      <circle cx="24" cy="2" r="2.2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.8" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.6" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.6" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.8" fill="#C9A24D" opacity="0.7" />
      {/* Central sun */}
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
   ANIMATION WRAPPERS — smoother spring-like feel
   ──────────────────────────────────────────────────── */
const smooth = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
const smoothSlow = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }

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

/* ────────────────────────────────────────────────────
   NAVBAR — bigger logo, bigger brand name
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
        {/* Brand — 62px logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <BrandLogo size={62} />
          <div className="flex flex-col">
            <span className="text-[30px] font-extrabold tracking-tight leading-none">
              Grah<span className="gold-text">AI</span>
            </span>
            <span className="text-[11px] tracking-[0.22em] uppercase text-gold/30 font-semibold leading-none mt-1">
              Vedic Intelligence
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-9 md:flex">
          <Link href="/product"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Product</Link>
          <Link href="/pricing"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Pricing</Link>
          <Link href="/about"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">About</Link>
          <a href="#sciences"
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Sciences</a>
          <Link href="/chat"
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-gold/60 transition-colors hover:text-gold">
            <MessageCircle className="h-3.5 w-3.5" />
            Chat
          </Link>
          <a href="#waitlist"
            className="group flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold/70 transition-all hover:border-gold/30 hover:bg-gold/[0.06]">
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
          <span key={i} className="mx-6 whitespace-nowrap font-[family-name:var(--font-devanagari)] text-xs text-text/[0.07]">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────
   SCIENCE CARD
   ──────────────────────────────────────────────────── */
function ScienceCard({ num, icon, title, titleHi, text, i }: {
  num: string; icon: string; title: string; titleHi: string; text: string; i: number
}) {
  return (
    <Reveal delay={i * 0.1}>
      <div className="glass-card group relative overflow-hidden p-8 lg:p-10 h-full">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <span className="pointer-events-none absolute -top-4 -right-2 select-none text-[100px] font-bold leading-none text-gold/[0.02] transition-colors duration-700 group-hover:text-gold/[0.05]">
          {num}
        </span>
        <div className="relative">
          <div className="mb-7 flex items-start justify-between">
            <span className="text-4xl">{icon}</span>
            <span className="text-label text-gold/20">{num}</span>
          </div>
          <h3 className="heading-card mb-1">{title}</h3>
          <p className="mb-4 font-[family-name:var(--font-devanagari)] text-xs text-gold/30">{titleHi}</p>
          <p className="text-caption">{text}</p>
          <div className="mt-7 flex items-center gap-2 text-label text-gold/25 transition-all duration-300 group-hover:gap-3 group-hover:text-gold/50">
            <span>Explore</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ────────────────────────────────────────────────────
   FEATURE CARD
   ──────────────────────────────────────────────────── */
function FeatureCard({ icon, title, text, i }: {
  icon: React.ReactNode; title: string; text: string; i: number
}) {
  return (
    <Reveal delay={i * 0.08}>
      <div className="group rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50 h-full">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gold/10 bg-gold/[0.04] text-gold/50 transition-colors group-hover:text-gold/70">
          {icon}
        </div>
        <h3 className="mb-2.5 text-lg font-semibold text-text">{title}</h3>
        <p className="text-caption">{text}</p>
      </div>
    </Reveal>
  )
}

/* ────────────────────────────────────────────────────
   STAT
   ──────────────────────────────────────────────────── */
function Stat({ val, suffix, label, d }: { val: number; suffix?: string; label: string; d: number }) {
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
        <div className="gold-text mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">{n}{suffix}</div>
        <p className="text-label text-text-dim/40">{label}</p>
      </div>
    </Reveal>
  )
}

/* ────────────────────────────────────────────────────
   STEP
   ──────────────────────────────────────────────────── */
function Step({ num, title, titleHi, text, i }: {
  num: string; title: string; titleHi: string; text: string; i: number
}) {
  return (
    <Reveal delay={i * 0.12}>
      <div className="group flex gap-6 lg:gap-10">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/10 bg-gold/[0.03] transition-all duration-500 group-hover:border-gold/25 group-hover:bg-gold/[0.06]">
            <span className="text-base font-semibold text-gold/50">{num}</span>
          </div>
          {i < 2 && <div className="mt-3 w-px flex-1 bg-gradient-to-b from-gold/10 to-transparent" />}
        </div>
        <div className="pb-14">
          <h3 className="mb-1 text-xl font-semibold text-text">{title}</h3>
          <p className="mb-2.5 font-[family-name:var(--font-devanagari)] text-[11px] text-gold/25">{titleHi}</p>
          <p className="text-caption max-w-md">{text}</p>
        </div>
      </div>
    </Reveal>
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

  useEffect(() => {
    supabase.from("waitlist").select("id", { count: "exact", head: true })
      .then(({ count }) => { if (count !== null) setWlCount(count) })
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
    { icon: <Star className="h-5 w-5" />, title: "Continuously Improving",
      text: "Our models learn from every reading. Pattern recognition deepens over time — your second consultation is more insightful than your first." },
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
    <main className="relative min-h-screen bg-bg">
      <Stars />
      <Blobs />
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — centered, impactful, clean
          ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* Yantra background decoration */}
        <motion.div style={{ rotate: yantraR }}
          className="pointer-events-none absolute right-[-8%] top-[8%] hidden text-gold lg:block">
          <Yantra size={650} />
        </motion.div>

        <div className="yantra-bg pointer-events-none absolute inset-0" />

        <motion.div style={{ opacity: heroO, y: heroY }}
          className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">

          <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-32 pb-20 lg:pt-36 lg:pb-24">
            {/* Badge */}
            <BlurReveal delay={0.2}>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/10 bg-gold/[0.02] px-5 py-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/50">Launching April 2026</span>
              </div>
            </BlurReveal>

            {/* Tagline */}
            <BlurReveal delay={0.35}>
              <h1 className="heading-hero mb-5">
                <span className="text-text">Your Planets.</span>
                <br />
                <span className="gold-text">Your Path.</span>
              </h1>
            </BlurReveal>

            {/* Hindi subtitle */}
            <BlurReveal delay={0.5}>
              <p className="mb-7 font-[family-name:var(--font-devanagari)] text-xl text-gold/20 md:text-2xl">
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

            {/* Form */}
            <BlurReveal delay={0.8}>
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
                      className="h-13 flex-1 rounded-xl border border-white/[0.06] bg-bg-2/60 px-5 text-sm text-text placeholder:text-text-dim/40 backdrop-blur transition-all focus:border-gold/20 focus:outline-none focus:ring-1 focus:ring-gold/10" />
                    <button type="submit" disabled={status === "loading"}
                      className="group flex h-13 items-center justify-center gap-2 rounded-xl bg-gold px-8 text-sm font-semibold text-bg transition-all hover:bg-gold-light active:scale-[0.98] disabled:opacity-50"
                      style={{ animation: status === "idle" ? "pulse-soft 4s ease-in-out infinite" : "none" }}>
                      {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <>Join Waitlist<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>
                      )}
                    </button>
                  </form>
                )}
                {status === "error" && errorMsg && <p className="mt-2 text-xs text-gold/60">{errorMsg}</p>}
                {wlCount > 0 && status !== "success" && (
                  <p className="mt-4 text-xs text-text-dim/30 text-center">
                    <span className="text-gold/30 font-medium">{wlCount.toLocaleString()}</span> seekers already joined
                  </p>
                )}
              </div>
            </BlurReveal>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-text/10">
            <span className="text-[8px] tracking-[0.3em] uppercase font-semibold">Scroll</span>
            <ArrowDown className="h-3 w-3" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          MARQUEE
          ═══════════════════════════════════════════ */}
      <Marquee />

      {/* ═══════════════════════════════════════════
          FOUR SCIENCES
          ═══════════════════════════════════════════ */}
      <section id="sciences" className="relative px-6 lg:px-10 py-28 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 lg:mb-24 text-center mx-auto max-w-2xl">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.08}><p className="text-label text-gold/30 mt-6 mb-4">Four Vedic Sciences</p></BlurReveal>
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
          STATS
          ═══════════════════════════════════════════ */}
      <div className="relative border-y border-white/[0.03] py-20 lg:py-28">
        <div className="yantra-bg absolute inset-0" />
        <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-6 sm:grid-cols-2 md:grid-cols-4">
          <Stat val={4} label="Vedic Sciences" d={0} />
          <Stat val={2000} suffix="+" label="Years of Wisdom" d={0.08} />
          <Stat val={78} label="Tarot Cards" d={0.16} />
          <Stat val={30} suffix="s" label="Reading Time" d={0.24} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          WHY GRAHAI
          ═══════════════════════════════════════════ */}
      <section id="technology" className="relative px-6 lg:px-10 py-28 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 lg:mb-24 text-center mx-auto max-w-2xl">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.08}><p className="text-label text-gold/30 mt-6 mb-4">Why GrahAI</p></BlurReveal>
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
          PROCESS
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="relative px-6 lg:px-10 py-28 lg:py-40">
        <div className="mx-auto max-w-7xl">
          {/* Section header — centered */}
          <div className="mb-16 lg:mb-24 text-center mx-auto max-w-2xl">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.08}><p className="text-label text-gold/30 mt-6 mb-4">How It Works</p></BlurReveal>
            <BlurReveal delay={0.16}>
              <h2 className="heading-section mb-5">
                Three steps to your <span className="gold-text">cosmic reading</span>
              </h2>
            </BlurReveal>
            <BlurReveal delay={0.24}>
              <p className="text-body mx-auto max-w-lg">
                From birth details to a complete, personalized reading —
                in under thirty seconds.
              </p>
            </BlurReveal>
          </div>

          {/* Steps — centered column */}
          <div className="mx-auto max-w-xl">
            {steps.map((s, i) => <Step key={s.title} {...s} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="relative px-6 lg:px-10 py-28 lg:py-40">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[300px] rounded-full bg-gold/[0.04] blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
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
            <a href="#waitlist"
              className="group inline-flex items-center gap-3 rounded-xl bg-gold px-10 py-4 text-base font-semibold text-bg transition-all hover:bg-gold-light hover:shadow-xl hover:shadow-gold/10 active:scale-[0.98]">
              Join the Waitlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </BlurReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.03] px-6 lg:px-10 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo size={38} />
                <span className="text-lg font-bold text-text/60">GrahAI</span>
              </div>
              <p className="text-caption max-w-xs mb-3">
                Ancient Vedic wisdom meets modern AI. Your planets, your path —
                decoded with precision.
              </p>
              <p className="font-[family-name:var(--font-devanagari)] text-xs text-gold/15">
                आपके ग्रह, आपकी राह
              </p>
            </div>
            {/* Links */}
            <div>
              <p className="text-label text-text-dim/30 mb-4">Platform</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/product" className="text-sm text-text-dim/40 transition-colors hover:text-gold/50">Product</Link>
                <Link href="/pricing" className="text-sm text-text-dim/40 transition-colors hover:text-gold/50">Pricing</Link>
                <Link href="/about" className="text-sm text-text-dim/40 transition-colors hover:text-gold/50">About</Link>
                <Link href="/blog" className="text-sm text-text-dim/40 transition-colors hover:text-gold/50">Blog</Link>
              </div>
            </div>
            <div>
              <p className="text-label text-text-dim/30 mb-4">Company</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/contact" className="text-sm text-text-dim/40 transition-colors hover:text-gold/50">Contact</Link>
                <a href="#" className="text-sm text-text-dim/40 transition-colors hover:text-gold/50">Privacy Policy</a>
                <a href="#" className="text-sm text-text-dim/40 transition-colors hover:text-gold/50">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-white/[0.03] pt-6 text-center">
            <p className="text-[11px] text-text-dim/20">&copy; {new Date().getFullYear()} GrahAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* ─── Floating Chat Button ─── */}
      <Link href="/chat">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#C9A24D] to-[#E2C474] shadow-lg shadow-[#C9A24D]/30 transition-transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-[#0B0E1A]" />
        </motion.div>
      </Link>
    </main>
  )
}
