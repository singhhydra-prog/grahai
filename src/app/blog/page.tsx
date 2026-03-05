"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Clock, ChevronRight } from "lucide-react"
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
      <circle cx="24" cy="24" r="22" stroke="url(#lgB)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="url(#lgB)" strokeWidth="0.6" opacity="0.35" />
      <circle cx="24" cy="2" r="2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.5" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.5" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.5" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.5" fill="#C9A24D" opacity="0.7" />
      <circle cx="24" cy="24" r="5" fill="url(#sgB)" />
      <defs>
        <linearGradient id="lgB" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#C9A24D" /><stop offset="100%" stopColor="#E2C474" /></linearGradient>
        <radialGradient id="sgB" cx="0.4" cy="0.35"><stop offset="0%" stopColor="#E2C474" /><stop offset="100%" stopColor="#C9A24D" /></radialGradient>
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
          <Link href="/about" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">About</Link>
          <Link href="/#waitlist" className="group flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold/70 transition-all hover:border-gold/30 hover:bg-gold/[0.06]">
            Early Access<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

const articles = [
  {
    category: "Vedic Astrology",
    title: "Understanding Your Birth Chart: A Beginner's Guide to Kundli",
    excerpt: "Your Kundli is more than a horoscope — it's a precise map of the cosmos at the moment of your birth. Learn how planetary positions, houses, and Nakshatras shape your unique chart.",
    readTime: "8 min read",
    date: "March 2026",
    featured: true,
  },
  {
    category: "Numerology",
    title: "Life Path Numbers: What Your Birth Date Reveals",
    excerpt: "Discover how your Life Path number is calculated and what it reveals about your personality, strengths, challenges, and life purpose.",
    readTime: "6 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Tarot",
    title: "The Celtic Cross Spread: A Complete Interpretation Guide",
    excerpt: "The Celtic Cross is the most comprehensive Tarot spread. Here's how to read each position, interpret card interactions, and understand reversed cards.",
    readTime: "10 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Vastu",
    title: "Vastu for Your Home: Room-by-Room Directional Guide",
    excerpt: "Ancient Vastu principles for modern living spaces. Learn the ideal placement for your kitchen, bedroom, and workspace based on the five elements.",
    readTime: "7 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Technology",
    title: "How AI Interprets Classical Sanskrit Texts",
    excerpt: "A look inside GrahAI's approach to training AI on texts like Brihat Parashara Hora Shastra — preserving authenticity while enabling accessibility.",
    readTime: "5 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Vedic Astrology",
    title: "Mangal Dosha: Facts, Myths, and Remedies",
    excerpt: "Mangal Dosha is one of the most misunderstood concepts in Vedic astrology. We separate classical teachings from modern misconceptions.",
    readTime: "9 min read",
    date: "March 2026",
    featured: false,
  },
]

export default function BlogPage() {
  const featured = articles.find(a => a.featured)
  const rest = articles.filter(a => !a.featured)

  return (
    <main className="relative min-h-screen bg-bg">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-16 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <BlurReveal><p className="text-label text-gold/30 mb-6">Blog & Resources</p></BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="heading-section mb-6">
              Vedic wisdom, <span className="gold-text">explained</span>
            </h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-body mx-auto max-w-lg">
              Deep dives into astrology, numerology, tarot, and vastu — plus behind-the-scenes
              on how we&apos;re building GrahAI.
            </p>
          </BlurReveal>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="px-6 lg:px-10 pb-16">
          <div className="mx-auto max-w-6xl">
            <BlurReveal delay={0.3}>
              <div className="group rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 lg:p-12 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50 cursor-pointer">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-gold">{featured.category}</span>
                  <span className="text-caption flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text mb-4 group-hover:text-gold/80 transition-colors">{featured.title}</h2>
                <p className="text-body max-w-2xl mb-8">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-label text-gold/30 group-hover:text-gold/50 transition-colors">
                  <span>Read Article</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </BlurReveal>
          </div>
        </section>
      )}

      {/* ARTICLES GRID */}
      <section className="px-6 lg:px-10 pb-32 lg:pb-48">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, i) => (
              <Reveal key={article.title} delay={i * 0.08}>
                <div className="group flex flex-col rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50 cursor-pointer h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex rounded-full border border-white/[0.08] px-3 py-1 text-[9px] font-semibold tracking-[0.15em] uppercase text-text-dim/40">{article.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-3 group-hover:text-gold/80 transition-colors flex-1">{article.title}</h3>
                  <p className="text-caption mb-6">{article.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-caption flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                    <span className="text-label text-gold/25 group-hover:text-gold/50 transition-colors flex items-center gap-1">
                      Read<ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 lg:px-10 py-24 lg:py-32 border-t border-white/[0.03]">
        <div className="mx-auto max-w-3xl text-center">
          <BlurReveal>
            <h2 className="heading-section mb-6">Stay <span className="gold-text">informed</span></h2>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <p className="text-body mx-auto mb-10 max-w-md">
              Join the waitlist to receive new articles, product updates, and early access when we launch.
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
