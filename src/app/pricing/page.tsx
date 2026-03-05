"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"

/* ────────────────────────────────────────────────────
   ANIMATION
   ──────────────────────────────────────────────────── */
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
      className={className}>
      {children}
    </motion.div>
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
      className={className}>
      {children}
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────
   BRAND LOGO
   ──────────────────────────────────────────────────── */
function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="url(#lgP)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="url(#lgP)" strokeWidth="0.6" opacity="0.35" />
      <circle cx="24" cy="2" r="2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.5" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.5" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.5" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.5" fill="#C9A24D" opacity="0.7" />
      <circle cx="24" cy="24" r="5" fill="url(#sgP)" />
      <defs>
        <linearGradient id="lgP" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#C9A24D" /><stop offset="100%" stopColor="#E2C474" />
        </linearGradient>
        <radialGradient id="sgP" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#E2C474" /><stop offset="100%" stopColor="#C9A24D" />
        </radialGradient>
      </defs>
    </svg>
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
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "glass-nav border-b border-white/[0.04]" : ""}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo size={40} />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight">Grah<span className="gold-text">AI</span></span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-gold/25 font-medium leading-none">Vedic Intelligence</span>
          </div>
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          <Link href="/product" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Product</Link>
          <Link href="/pricing" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gold/70 transition-colors hover:text-gold">Pricing</Link>
          <Link href="/#sciences" className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 transition-colors hover:text-text/80">Sciences</Link>
          <Link href="/#waitlist" className="group flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.03] px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold/70 transition-all hover:border-gold/30 hover:bg-gold/[0.06]">
            Early Access<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

/* ────────────────────────────────────────────────────
   PRICING DATA
   ──────────────────────────────────────────────────── */
const plans = [
  {
    name: "Nakshatra",
    nameHi: "नक्षत्र",
    price: "Free",
    priceNote: "Forever",
    description: "Begin your Vedic journey with essential readings.",
    popular: false,
    features: [
      "Basic Kundli generation",
      "Daily planetary overview",
      "1 Tarot reading per day",
      "Numerology Life Path number",
      "Basic Vastu compass",
      "English output",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Graha",
    nameHi: "ग्रह",
    price: "₹499",
    priceNote: "/month",
    description: "Comprehensive readings with full classical depth.",
    popular: true,
    features: [
      "Full Kundli with Dasha analysis",
      "Unlimited Tarot spreads",
      "Complete Numerology profile",
      "Detailed Vastu room mapping",
      "Yoga & Dosha identification",
      "Transit predictions",
      "Bilingual: Hindi + English",
      "Gemstone recommendations",
      "Compatibility matching",
    ],
    cta: "Join Waitlist",
  },
  {
    name: "Rishi",
    nameHi: "ऋषि",
    price: "₹1,499",
    priceNote: "/month",
    description: "For serious practitioners who demand the highest precision.",
    popular: false,
    features: [
      "Everything in Graha plan",
      "Prashna Kundli (Horary)",
      "Muhurta — auspicious timing",
      "Annual prediction reports",
      "Remedial consultation",
      "Priority support",
      "API access for developers",
      "Custom report templates",
      "Family chart comparisons",
      "Export to PDF",
    ],
    cta: "Join Waitlist",
  },
]

const faqs = [
  { q: "Is GrahAI a replacement for a human astrologer?", a: "GrahAI is a tool that provides precision readings grounded in classical texts. It complements traditional consultation — think of it as a detailed second opinion computed with mathematical accuracy." },
  { q: "How accurate are the readings?", a: "We use the Swiss Ephemeris engine for planetary calculations — the same tool used by professional astrologers worldwide. Every interpretation traces back to specific verses in BPHS, Saravali, and other classical texts." },
  { q: "Can I cancel my subscription anytime?", a: "Yes. Cancel anytime from your dashboard. You'll retain access until the end of your billing period with no hidden fees." },
  { q: "What languages are supported?", a: "Currently English and Hindi with authentic Devanagari script. We plan to add Tamil, Telugu, Kannada, Bengali, and Marathi by Q3 2026." },
  { q: "Is my birth data safe?", a: "All personal data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never share your information with third parties. You can request complete data deletion at any time." },
]

/* ════════════════════════════════════════════════════
   PRICING PAGE
   ════════════════════════════════════════════════════ */
export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="relative min-h-screen bg-bg">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-40 pb-20 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <BlurReveal>
            <p className="text-label text-gold/30 mb-6">Pricing</p>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="heading-section mb-6">
              Choose your <span className="gold-text">cosmic plan</span>
            </h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-body mx-auto max-w-lg">
              Start free with essential readings. Upgrade for full classical depth,
              unlimited consultations, and bilingual support.
            </p>
          </BlurReveal>
        </div>
      </section>

      {/* ═══ PLANS ═══ */}
      <section className="px-6 lg:px-10 pb-32 lg:pb-48">
        <div className="mx-auto max-w-6xl grid gap-6 lg:gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.12}>
              <div className={`relative flex flex-col rounded-2xl border p-8 lg:p-10 transition-all duration-500 ${
                plan.popular
                  ? "border-gold/20 bg-bg-2/60 shadow-xl shadow-gold/[0.03]"
                  : "border-white/[0.04] bg-bg-2/30 hover:border-white/[0.08]"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-gold">
                      <Sparkles className="h-3 w-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-xl font-bold text-text">{plan.name}</h3>
                    <span className="font-[family-name:var(--font-devanagari)] text-xs text-gold/25">{plan.nameHi}</span>
                  </div>
                  <p className="text-caption mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text">{plan.price}</span>
                    <span className="text-sm text-text-dim/40">{plan.priceNote}</span>
                  </div>
                </div>

                <div className="flex-1 mb-8">
                  <div className="space-y-3">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="h-4 w-4 mt-0.5 shrink-0 text-gold/40" />
                        <span className="text-sm text-text-dim/60">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/#waitlist"
                  className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                    plan.popular
                      ? "bg-gold text-bg hover:bg-gold-light"
                      : "border border-gold/15 text-gold/60 hover:border-gold/25 hover:bg-gold/[0.04]"
                  }`}>
                  {plan.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-6 lg:px-10 pb-32 lg:pb-48">
        <div className="mx-auto max-w-3xl">
          <BlurReveal>
            <h2 className="heading-section text-center mb-16">
              Frequently <span className="gold-text">asked</span>
            </h2>
          </BlurReveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left rounded-xl border border-white/[0.04] bg-bg-2/30 p-6 transition-all hover:border-white/[0.08]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-text">{faq.q}</h3>
                    <span className={`text-gold/30 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </div>
                  {openFaq === i && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 text-caption">
                      {faq.a}
                    </motion.p>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-white/[0.03] px-6 lg:px-10 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo size={28} />
            <span className="text-sm font-medium text-text/40">GrahAI</span>
          </Link>
          <p className="text-[11px] text-text-dim/25">&copy; {new Date().getFullYear()} GrahAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/product" className="text-label text-text-dim/20 transition-colors hover:text-gold/40">Product</Link>
            <Link href="/" className="text-label text-text-dim/20 transition-colors hover:text-gold/40">Home</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
