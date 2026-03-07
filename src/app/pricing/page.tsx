"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BlurReveal, Reveal } from "@/components/Animations"

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
                    <span className="font-hindi text-xs text-gold/45">{plan.nameHi}</span>
                  </div>
                  <p className="text-caption mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text">{plan.price}</span>
                    <span className="text-sm text-text-dim/60">{plan.priceNote}</span>
                  </div>
                </div>

                <div className="flex-1 mb-8">
                  <div className="space-y-3">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="h-4 w-4 mt-0.5 shrink-0 text-gold/50" />
                        <span className="text-sm text-text-dim/70">{f}</span>
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
                    <span className={`text-gold/50 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
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

      <Footer />
    </main>
  )
}
