"use client"

import { useState, useEffect, useRef, FormEvent, useMemo } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import {
  Sparkles,
  Star,
  Sun,
  Moon,
  Compass,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  ArrowDown,
  Check,
  Loader2,
  Eye,
  Layers,
  MessageCircle,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { zodiacSigns } from "@/lib/brand"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STARFIELD — 120 procedural stars
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 0.5,
        duration: Math.random() * 5 + 2,
        delay: Math.random() * 4,
      })),
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--duration": `${s.duration}s`,
            "--delay": `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AURORA BACKGROUND — Animated gradient blobs
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div
        className="aurora-blob absolute -left-32 top-1/4 h-[600px] w-[600px] bg-indigo/15"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora-blob absolute right-[-10%] top-[10%] h-[500px] w-[500px] bg-saffron/8"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="aurora-blob absolute bottom-[10%] left-1/3 h-[400px] w-[400px] bg-indigo/10"
        style={{ animationDelay: "8s" }}
      />
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ORBITAL RING — Zodiac symbols orbiting
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function OrbitalRing() {
  return (
    <div className="pointer-events-none absolute right-[-8%] top-1/2 -translate-y-1/2 hidden lg:block">
      <div className="relative h-[600px] w-[600px]">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border border-saffron/10"
          style={{ animation: "spin-slow 90s linear infinite" }}
        >
          {zodiacSigns.map((sign, i) => {
            const angle = (i * 30 * Math.PI) / 180
            const r = 280
            return (
              <span
                key={sign.en}
                className="absolute text-2xl opacity-30 transition-opacity duration-300 hover:opacity-80"
                style={{
                  left: `${300 + r * Math.cos(angle)}px`,
                  top: `${300 + r * Math.sin(angle)}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {sign.symbol}
              </span>
            )
          })}
        </div>
        {/* Middle ring */}
        <div
          className="absolute inset-[80px] rounded-full border border-indigo/15"
          style={{ animation: "spin-slow 120s linear infinite reverse" }}
        />
        {/* Inner ring */}
        <div className="absolute inset-[160px] rounded-full border border-saffron/5" />
        {/* Center glow */}
        <div className="absolute inset-[220px] rounded-full bg-saffron/5 blur-xl" />
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAVBAR — Sticky with progressive blur
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-indigo/20 bg-deep-space/90 backdrop-blur-2xl shadow-lg shadow-deep-space/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="relative">
            <Sparkles className="h-6 w-6 text-saffron" />
            <div className="absolute inset-0 animate-ping text-saffron opacity-20">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-cosmic-white">
            Grah<span className="text-saffron">AI</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden items-center gap-8 md:flex"
        >
          {["Features", "Verticals", "How It Works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative text-sm text-cosmic-white/50 transition-colors duration-300 hover:text-cosmic-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-saffron after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </a>
          ))}
          <a
            href="#waitlist"
            className="group relative overflow-hidden rounded-full bg-saffron/10 px-5 py-2 text-sm font-medium text-saffron transition-all duration-300 hover:bg-saffron/20 hover:shadow-lg hover:shadow-saffron/10"
          >
            <span className="relative z-10">Join Waitlist</span>
          </a>
        </motion.div>
      </div>
    </nav>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION — Intersection observer reveal
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative px-6 py-24 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ZODIAC TICKER — Infinite horizontal scroll
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ZodiacTicker() {
  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-deep-space to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-deep-space to-transparent" />
      <div className="flex animate-[scroll_40s_linear_infinite] gap-16">
        {[...zodiacSigns, ...zodiacSigns].map((sign, i) => (
          <div
            key={`${sign.en}-${i}`}
            className="flex shrink-0 items-center gap-3 text-cosmic-white/20 transition-colors duration-300 hover:text-cosmic-white/50"
          >
            <span className="text-2xl">{sign.symbol}</span>
            <span className="text-sm font-medium tracking-wider uppercase">
              {sign.en}
            </span>
            <span className="font-[family-name:var(--font-devanagari)] text-xs text-saffron/25">
              {sign.hi}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FEATURE CARD — Glass-morphism with accent glow
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FeatureCard({
  icon: Icon,
  title,
  titleHi,
  description,
  delay,
}: {
  icon: React.ElementType
  title: string
  titleHi: string
  description: string
  delay: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="glass-card glass-card-hover group relative overflow-hidden p-8"
    >
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/0 to-transparent transition-all duration-500 group-hover:via-saffron/50" />

      <div className="relative z-10">
        <div className="mb-5 inline-flex rounded-xl bg-saffron/10 p-3 ring-1 ring-saffron/20 transition-all duration-300 group-hover:bg-saffron/15 group-hover:ring-saffron/40 group-hover:shadow-lg group-hover:shadow-saffron/10">
          <Icon className="h-6 w-6 text-saffron" />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-cosmic-white">
          {title}
        </h3>
        <p className="mb-3 font-[family-name:var(--font-devanagari)] text-sm text-saffron/60">
          {titleHi}
        </p>
        <p className="text-[15px] leading-relaxed text-cosmic-white/50">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VERTICAL CARD — Premium with gradient border
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function VerticalCard({
  icon,
  name,
  nameHi,
  desc,
  accent,
  index,
}: {
  icon: string
  name: string
  nameHi: string
  desc: string
  accent: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group relative overflow-hidden rounded-2xl border border-indigo/20 bg-navy-light/30 backdrop-blur-sm transition-all duration-500 hover:border-saffron/30"
    >
      {/* Top gradient bar */}
      <div className={`h-1 bg-gradient-to-r ${accent}`} />

      <div className="p-8">
        <div className="mb-5 flex items-center gap-4">
          <span className="text-4xl">{icon}</span>
          <div>
            <h3 className="text-xl font-semibold text-cosmic-white">{name}</h3>
            <p className="font-[family-name:var(--font-devanagari)] text-sm text-saffron/50">
              {nameHi}
            </p>
          </div>
        </div>
        <p className="mb-6 text-[15px] leading-relaxed text-cosmic-white/45">
          {desc}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-saffron/60 transition-all duration-300 group-hover:text-saffron group-hover:gap-3">
          <span>Explore</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: "inset 0 0 60px rgba(212,168,67,0.05)" }} />
    </motion.div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STAT COUNTER — Animated number
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function StatCounter({
  value,
  suffix = "",
  label,
  sub,
  delay,
}: {
  value: number
  suffix?: string
  label: string
  sub: string
  delay: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = value
    const duration = 2000
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(eased * end)
      setCount(start)
      if (progress < 1) requestAnimationFrame(step)
    }

    const timer = setTimeout(() => requestAnimationFrame(step), delay * 1000)
    return () => clearTimeout(timer)
  }, [isInView, value, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <div className="gradient-text mb-2 text-5xl font-bold md:text-6xl">
        {count}
        {suffix}
      </div>
      <div className="text-lg font-medium text-cosmic-white">{label}</div>
      <div className="mt-1 text-sm text-cosmic-white/35">{sub}</div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════ */
export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [waitlistCount, setWaitlistCount] = useState(0)

  /* Hero parallax */
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 80])

  useEffect(() => {
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => {
        if (count !== null) setWaitlistCount(count)
      })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({ email: email.trim().toLowerCase() })

      if (error) {
        if (error.code === "23505") {
          setErrorMsg("You're already on the list! We'll be in touch soon.")
          setStatus("error")
        } else {
          throw error
        }
        return
      }

      setStatus("success")
      setWaitlistCount((c) => c + 1)
      setEmail("")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  const features = [
    {
      icon: Sun,
      title: "Vedic Astrology",
      titleHi: "ज्योतिष",
      description:
        "Complete Kundli analysis using classical texts — BPHS, Phaladeepika, and Saravali. Dasha predictions, transit analysis, and compatibility matching.",
    },
    {
      icon: Star,
      title: "Numerology",
      titleHi: "अंकशास्त्र",
      description:
        "Pythagorean and Chaldean number analysis. Life path, destiny, soul urge calculations with personalized yearly forecasts.",
    },
    {
      icon: Moon,
      title: "Tarot Reading",
      titleHi: "टैरो",
      description:
        "AI-powered card interpretations across Major and Minor Arcana. Celtic Cross, three-card, and custom spreads with intuitive guidance.",
    },
    {
      icon: Compass,
      title: "Vastu Shastra",
      titleHi: "वास्तु शास्त्र",
      description:
        "Directional energy analysis for homes and offices. Room-by-room recommendations aligned with cosmic principles.",
    },
    {
      icon: Brain,
      title: "Self-Learning AI",
      titleHi: "स्व-शिक्षा",
      description:
        "28 specialized AI agents that continuously learn and improve from every reading. Hierarchical approval ensures quality.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      titleHi: "गोपनीयता",
      description:
        "Your birth data and readings are encrypted end-to-end. We never share personal information. Complete data sovereignty.",
    },
  ]

  const verticals = [
    {
      icon: "♈",
      name: "Kundli & Jyotish",
      nameHi: "कुंडली और ज्योतिष",
      desc: "Birth chart analysis with Dasha periods, planetary transits, Yogas, and Dosha assessment. Classical interpretation from BPHS and Phaladeepika.",
      accent: "from-saffron via-gold-light to-saffron",
    },
    {
      icon: "🔢",
      name: "Numerology",
      nameHi: "अंकशास्त्र",
      desc: "Life path, destiny, and soul urge numbers. Pythagorean and Chaldean systems with name analysis, lucky numbers, and year-ahead forecasts.",
      accent: "from-indigo via-[#6366F1] to-indigo",
    },
    {
      icon: "🃏",
      name: "Tarot Reading",
      nameHi: "टैरो रीडिंग",
      desc: "Full 78-card deck interpretations. Celtic Cross, past-present-future, and relationship spreads with reversals and positional context.",
      accent: "from-[#8B5CF6] via-[#A78BFA] to-[#8B5CF6]",
    },
    {
      icon: "🏠",
      name: "Vastu Shastra",
      nameHi: "वास्तु शास्त्र",
      desc: "Directional energy mapping, room placement recommendations, element balancing, and remedies aligned with classical Vastu principles.",
      accent: "from-gold-dark via-gold-light to-gold-dark",
    },
  ]

  const steps = [
    {
      icon: Eye,
      title: "Share Your Details",
      titleHi: "विवरण साझा करें",
      desc: "Enter your birth date, time, and location. Our AI agents securely process your cosmic coordinates.",
    },
    {
      icon: Layers,
      title: "AI Analyzes",
      titleHi: "AI विश्लेषण",
      desc: "28 specialized agents cross-reference classical texts, planetary positions, and numerological patterns.",
    },
    {
      icon: MessageCircle,
      title: "Get Your Reading",
      titleHi: "अपना पठन प्राप्त करें",
      desc: "Receive a deeply personalized reading with actionable insights, remedies, and future predictions.",
    },
  ]

  return (
    <main className="relative min-h-screen bg-deep-space">
      <Starfield />
      <AuroraBackground />
      <Navbar />

      {/* ━━━ HERO ━━━ */}
      <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <OrbitalRing />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 mx-auto max-w-7xl px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-saffron/20 bg-saffron/5 px-5 py-2.5 backdrop-blur-sm"
            >
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron" />
              </div>
              <span className="text-xs font-medium tracking-wider text-saffron uppercase">
                Launching April 2026
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="mb-4 text-5xl font-bold leading-[1.05] tracking-tight text-cosmic-white md:text-7xl lg:text-8xl">
              Ancient Wisdom,
              <br />
              <span className="gradient-text">AI Precision</span>
            </h1>
            <p className="mb-2 font-[family-name:var(--font-devanagari)] text-xl text-saffron/50 md:text-2xl">
              प्राचीन ज्ञान, आधुनिक बुद्धिमत्ता
            </p>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-cosmic-white/45">
              GrahAI brings together the depth of classical Vedic sciences and
              the power of 28 specialized AI agents — delivering personalized
              readings across Astrology, Numerology, Tarot, and Vastu.
            </p>

            {/* Waitlist Form */}
            <div id="waitlist">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 p-5 backdrop-blur-sm"
                >
                  <div className="rounded-full bg-success/20 p-2">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-cosmic-white">
                      You&apos;re on the list!
                    </p>
                    <p className="text-sm text-cosmic-white/50">
                      We&apos;ll notify you when GrahAI launches.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status === "error") setStatus("idle")
                      }}
                      placeholder="Enter your email"
                      required
                      className="h-14 w-full rounded-xl border border-indigo/30 bg-navy-light/40 px-5 text-cosmic-white placeholder:text-cosmic-white/25 backdrop-blur-md transition-all duration-300 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:bg-navy-light/60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="glow-button flex h-14 items-center justify-center gap-2 rounded-xl bg-saffron px-8 font-semibold text-deep-space transition-all duration-300 hover:bg-gold-light hover:shadow-xl hover:shadow-saffron/20 disabled:opacity-50 active:scale-[0.98]"
                    style={{
                      animation: status === "idle" ? "pulse-glow 3s ease-in-out infinite" : "none",
                    }}
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
              {status === "error" && errorMsg && (
                <p className="mt-2 text-sm text-saffron/80">{errorMsg}</p>
              )}
              {waitlistCount > 0 && status !== "success" && (
                <p className="mt-4 text-sm text-cosmic-white/30">
                  <span className="font-semibold text-saffron/60">
                    {waitlistCount.toLocaleString()}
                  </span>{" "}
                  people have joined the waitlist
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-cosmic-white/20"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ━━━ ZODIAC TICKER ━━━ */}
      <div className="relative z-10 border-y border-indigo/10 bg-deep-space/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <ZodiacTicker />
        </div>
      </div>

      {/* ━━━ FEATURES ━━━ */}
      <Section id="features">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo/30 bg-indigo/5 px-4 py-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-saffron" />
              <span className="text-xs font-medium tracking-wider text-cosmic-white/50 uppercase">
                Capabilities
              </span>
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-cosmic-white md:text-5xl text-balance">
              Where tradition meets{" "}
              <span className="gradient-text">technology</span>
            </h2>
            <p className="mx-auto max-w-2xl text-cosmic-white/40">
              Every reading is powered by classical texts, validated by AI, and
              refined through continuous learning.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </Section>

      {/* ━━━ VERTICALS ━━━ */}
      <Section id="verticals" className="overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo/30 bg-indigo/5 px-4 py-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-saffron" />
              <span className="text-xs font-medium tracking-wider text-cosmic-white/50 uppercase">
                Four Pillars
              </span>
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-cosmic-white md:text-5xl text-balance">
              Four pillars of{" "}
              <span className="gradient-text">Vedic science</span>
            </h2>
            <p className="mx-auto max-w-2xl text-cosmic-white/40">
              Deep, personalized readings across all four Vedic disciplines —
              each powered by dedicated AI specialists.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {verticals.map((v, i) => (
              <VerticalCard key={v.name} {...v} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ━━━ STATS ━━━ */}
      <Section className="border-y border-indigo/10 bg-navy-light/5">
        <div className="relative z-10 mx-auto grid max-w-5xl gap-16 md:grid-cols-3">
          <StatCounter value={28} label="AI Agents" sub="Specialized & learning" delay={0} />
          <StatCounter value={4} label="Vedic Sciences" sub="Complete coverage" delay={0.15} />
          <StatCounter value={24} suffix="/7" label="Availability" sub="Instant readings" delay={0.3} />
        </div>
      </Section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <Section id="how-it-works">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo/30 bg-indigo/5 px-4 py-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-saffron" />
              <span className="text-xs font-medium tracking-wider text-cosmic-white/50 uppercase">
                Simple Process
              </span>
            </motion.div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-cosmic-white md:text-5xl text-balance">
              Three steps to your{" "}
              <span className="gradient-text">cosmic reading</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo/30 bg-navy-light/40 backdrop-blur-sm">
                  <step.icon className="h-7 w-7 text-saffron" />
                </div>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-8 hidden h-px w-[calc(100%-80px)] bg-gradient-to-r from-saffron/20 to-transparent md:block" />
                )}
                <div className="mb-1 text-xs font-bold tracking-widest text-saffron/40 uppercase">
                  Step {i + 1}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-cosmic-white">
                  {step.title}
                </h3>
                <p className="mb-2 font-[family-name:var(--font-devanagari)] text-sm text-saffron/40">
                  {step.titleHi}
                </p>
                <p className="text-sm leading-relaxed text-cosmic-white/40">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ━━━ CTA ━━━ */}
      <Section>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Glow behind CTA */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-saffron/10 blur-[100px]" />
          </div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-cosmic-white md:text-5xl text-balance">
            Ready to explore your{" "}
            <span className="gradient-text">cosmic blueprint</span>?
          </h2>
          <p className="mb-10 text-lg text-cosmic-white/40">
            Join the waitlist for early access. Be among the first to experience
            AI-powered Vedic readings.
          </p>
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-3 rounded-xl bg-saffron px-10 py-4 text-lg font-semibold text-deep-space transition-all duration-300 hover:bg-gold-light hover:shadow-2xl hover:shadow-saffron/20 active:scale-[0.98]"
          >
            Join the Waitlist
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </Section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="relative z-10 border-t border-indigo/10 bg-deep-space px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-saffron" />
              <span className="text-lg font-bold text-cosmic-white">
                Grah<span className="text-saffron">AI</span>
              </span>
            </div>
            <p className="text-center text-sm text-cosmic-white/25">
              &copy; {new Date().getFullYear()} GrahAI. Ancient wisdom, modern
              intelligence.
            </p>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-sm text-cosmic-white/25 transition-colors duration-300 hover:text-saffron"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-cosmic-white/25 transition-colors duration-300 hover:text-saffron"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
