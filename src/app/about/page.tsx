"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, BookOpen, Target, Heart, Users, Globe, Lightbulb } from "lucide-react"
import Link from "next/link"

const ease = [0.25, 0.46, 0.45, 0.94] as const

function BlurReveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(8px)" }}
      transition={{ duration: 0.85, delay, ease }}
      className={className}>{children}</motion.div>
  )
}

function Reveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}>{children}</motion.div>
  )
}

function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="url(#lgA)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="url(#lgA)" strokeWidth="0.6" opacity="0.35" />
      <circle cx="24" cy="2" r="2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.5" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.5" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.5" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.5" fill="#C9A24D" opacity="0.7" />
      <circle cx="24" cy="24" r="5" fill="url(#sgA)" />
      <defs>
        <linearGradient id="lgA" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#C9A24D" /><stop offset="100%" stopColor="#E2C474" /></linearGradient>
        <radialGradient id="sgA" cx="0.4" cy="0.35"><stop offset="0%" stopColor="#E2C474" /><stop offset="100%" stopColor="#C9A24D" /></radialGradient>
      </defs>
    </svg>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "glass-nav border-b border-white/[0.04]" : ""}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size={40} />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight">Grah<span className="gold-text">AI</span></span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-gold/25 font-medium leading-none">Vedic Intelligence</span>
          </div>
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          <Link href="/product" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Product</Link>
          <Link href="/pricing" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Pricing</Link>
          <Link href="/about" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gold/70">About</Link>
          <Link href="/#waitlist" className="group flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold/70 transition-all hover:border-gold/30 hover:bg-gold/[0.06]">
            Early Access<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.nav>
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

const values = [
  { icon: <BookOpen className="h-5 w-5" />, title: "Authenticity", text: "Every insight traces to classical Vedic texts. We don't generate predictions from thin air — we compute them from 2,000+ years of codified wisdom." },
  { icon: <Target className="h-5 w-5" />, title: "Precision", text: "Swiss Ephemeris calculations to arc-second accuracy. Divisional charts, Dasha sub-periods, and transit overlays computed with mathematical rigor." },
  { icon: <Heart className="h-5 w-5" />, title: "Accessibility", text: "Vedic knowledge that was once available only to scholars or expensive pandits — now accessible to everyone, in their own language, in seconds." },
  { icon: <Users className="h-5 w-5" />, title: "Privacy", text: "Your birth data is sacred. We encrypt everything, share nothing, and give you complete control over your information." },
  { icon: <Globe className="h-5 w-5" />, title: "Cultural Preservation", text: "Sanskrit terminology, Devanagari script, and authentic references preserved alongside modern explanations. Tradition meets technology." },
  { icon: <Lightbulb className="h-5 w-5" />, title: "Continuous Learning", text: "Our models improve with every reading. Pattern recognition deepens over time — the platform grows wiser with use." },
]

const timeline = [
  { date: "January 2026", title: "Idea & Research", text: "Deep study of classical texts — BPHS, Saravali, Phaladeepika. Architecture design for multi-discipline AI platform." },
  { date: "February 2026", title: "Foundation Sprint", text: "Core infrastructure built — Supabase backend, Next.js frontend, Swiss Ephemeris integration, and AI training pipeline." },
  { date: "March 2026", title: "Building in Public", text: "Landing page live, waitlist growing. Four Vedic science modules in active development. Community feedback shaping the product." },
  { date: "April 2026", title: "Launch", text: "Public launch with Kundli generation, Numerology, Tarot, and Vastu modules. Free and premium tiers available." },
]

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-bg">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <BlurReveal>
            <p className="text-label text-gold/30 mb-6">About GrahAI</p>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="heading-section mb-8">
              Preserving ancient wisdom<br />through <span className="gold-text">modern technology</span>
            </h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-body max-w-2xl text-lg leading-relaxed">
              For millennia, Vedic sciences have guided millions through life&apos;s most important decisions —
              career, relationships, health, and spiritual growth. But access to authentic, text-grounded
              readings has always been limited by geography, language, and cost.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.3}>
            <p className="text-body max-w-2xl mt-6 text-lg leading-relaxed">
              GrahAI was built to change that. We&apos;re creating an AI platform that doesn&apos;t just generate
              horoscopes — it computes precise Vedic readings grounded in the same classical texts that
              scholars have studied for over two thousand years.
            </p>
          </BlurReveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative px-6 lg:px-10 py-24 lg:py-36 bg-bg-2/20">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.1}><p className="text-label text-gold/30 mt-6 mb-4">Our Mission</p></BlurReveal>
            <BlurReveal delay={0.2}>
              <h2 className="heading-section mb-8">
                Make Vedic knowledge<br /><span className="gold-text">universally accessible</span>
              </h2>
            </BlurReveal>
            <BlurReveal delay={0.3}>
              <p className="text-body max-w-lg leading-relaxed">
                We believe everyone deserves access to the depth and precision of classical
                Vedic sciences — regardless of where they live, what language they speak, or
                what they can afford. GrahAI democratizes this ancient knowledge while
                preserving its authenticity.
              </p>
            </BlurReveal>
          </div>
          <div>
            <BlurReveal delay={0.2}>
              <div className="rounded-2xl border border-white/[0.04] bg-bg/50 p-10">
                <p className="font-[family-name:var(--font-devanagari)] text-2xl text-gold/20 mb-6 leading-relaxed">
                  &ldquo;ज्योतिषशास्त्रं वेदस्य चक्षुः&rdquo;
                </p>
                <p className="text-body italic mb-4">
                  &ldquo;Jyotish Shastra is the eye of the Vedas.&rdquo;
                </p>
                <p className="text-caption">— Vedanga Jyotisha</p>
              </div>
            </BlurReveal>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="relative px-6 lg:px-10 py-32 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 lg:mb-28 text-center">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.1}><p className="text-label text-gold/30 mt-6 mb-4">Our Values</p></BlurReveal>
            <BlurReveal delay={0.2}>
              <h2 className="heading-section mb-6">What we <span className="gold-text">stand for</span></h2>
            </BlurReveal>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="group rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/10 bg-gold/[0.04] text-gold/50 transition-colors group-hover:text-gold/70">{v.icon}</div>
                  <h3 className="mb-3 text-lg font-semibold text-text">{v.title}</h3>
                  <p className="text-caption">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative px-6 lg:px-10 py-32 lg:py-48 bg-bg-2/20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-20 text-center">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.1}><p className="text-label text-gold/30 mt-6 mb-4">Our Journey</p></BlurReveal>
            <BlurReveal delay={0.2}>
              <h2 className="heading-section mb-6">From idea to <span className="gold-text">launch</span></h2>
            </BlurReveal>
          </div>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <Reveal key={t.date} delay={i * 0.1}>
                <div className="group flex gap-6 lg:gap-10">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/10 bg-gold/[0.03] transition-all group-hover:border-gold/25">
                      <span className="text-xs font-bold text-gold/40">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    {i < timeline.length - 1 && <div className="mt-3 w-px flex-1 bg-gradient-to-b from-gold/10 to-transparent" />}
                  </div>
                  <div className="pb-14">
                    <p className="text-label text-gold/25 mb-2">{t.date}</p>
                    <h3 className="mb-2 text-xl font-semibold text-text">{t.title}</h3>
                    <p className="text-caption max-w-md">{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 lg:px-10 py-32 lg:py-40">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <BlurReveal>
            <h2 className="heading-section mb-6">Join us on this <span className="gold-text">journey</span></h2>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <p className="text-body mx-auto mb-12 max-w-md">
              Be among the first to experience what happens when 2,000 years of wisdom meets modern AI.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <Link href="/#waitlist" className="group inline-flex items-center gap-3 rounded-xl bg-gold px-10 py-4 text-base font-semibold text-bg transition-all hover:bg-gold-light active:scale-[0.98]">
              Join the Waitlist<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </BlurReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.03] px-6 lg:px-10 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-2"><BrandLogo size={28} /><span className="text-sm font-medium text-text/40">GrahAI</span></Link>
          <p className="text-[11px] text-text-dim/25">&copy; {new Date().getFullYear()} GrahAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/product" className="text-label text-text-dim/20 transition-colors hover:text-gold/40">Product</Link>
            <Link href="/pricing" className="text-label text-text-dim/20 transition-colors hover:text-gold/40">Pricing</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
