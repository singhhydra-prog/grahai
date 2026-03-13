"use client"

import { ArrowLeft, Sun, Moon, Star, Compass, Hash, Layers, Clock, Languages, Shield, ChevronRight, BarChart3, BookOpen, Gem } from "lucide-react"
import { BlurReveal, Reveal, Divider } from "@/components/Animations"

interface ProductViewProps {
  onBack: () => void
  onUpgrade: () => void
}

const sciences = [
  {
    id: "jyotish",
    icon: <Sun className="h-6 w-6" />,
    title: "Kundli & Jyotish",
    titleHi: "कुंडली और ज्योतिष",
    description: "Complete Vedic birth chart analysis with planetary positions, Dasha timelines, Yogas, Doshas, and real-time transit predictions.",
    capabilities: [
      "Birth chart (D1) and divisional charts (D2–D60)",
      "Vimshottari Dasha predictions with sub-period analysis",
      "Yoga identification — Raj Yoga, Dhan Yoga, Vipreet Yoga",
      "Mangal Dosha, Kaal Sarp Dosha, Pitra Dosha analysis",
      "Gochar (transit) impact on natal positions",
      "Nakshatra-based personality and compatibility insights",
      "Gemstone and remedy recommendations with classical backing",
    ],
    source: "Brihat Parashara Hora Shastra, Saravali, Phaladeepika",
  },
  {
    id: "numerology",
    icon: <Hash className="h-6 w-6" />,
    title: "Numerology",
    titleHi: "अंकशास्त्र",
    description: "Pythagorean and Chaldean number analysis covering your Life Path, Destiny, Soul Urge, and Karmic Debt numbers.",
    capabilities: [
      "Life Path number with detailed interpretation",
      "Destiny (Expression) and Soul Urge numbers",
      "Karmic Debt and Karmic Lesson identification",
      "Personal Year, Month, and Day cycles",
      "Name vibration analysis with correction suggestions",
      "Business name numerology evaluation",
      "Compatibility analysis between two people",
    ],
    source: "Pythagorean system, Chaldean system, Vedic Sankhya Shastra",
  },
  {
    id: "tarot",
    icon: <Layers className="h-6 w-6" />,
    title: "Tarot Reading",
    titleHi: "टैरो रीडिंग",
    description: "Full 78-card Rider-Waite deck with Major and Minor Arcana. Multiple spread options with reversal interpretation.",
    capabilities: [
      "Celtic Cross spread — 10-card comprehensive reading",
      "Three-Card spread — past, present, future",
      "Relationship spread — dynamics between two people",
      "Career spread — professional path guidance",
      "Reversed card interpretation with positional context",
      "Elemental dignity analysis between cards",
      "Daily single-card guidance pulls",
    ],
    source: "Rider-Waite-Smith tradition, Golden Dawn correspondences",
  },
  {
    id: "vastu",
    icon: <Compass className="h-6 w-6" />,
    title: "Vastu Shastra",
    titleHi: "वास्तु शास्त्र",
    description: "Directional energy mapping and spatial harmony for homes, offices, and commercial spaces based on classical Vastu texts.",
    capabilities: [
      "Room-by-room directional analysis",
      "Five-element (Panch Mahabhuta) balancing",
      "Entrance and exit placement optimization",
      "Kitchen, bedroom, and puja room guidelines",
      "Commercial and office Vastu for prosperity",
      "Plot shape and slope analysis",
      "Specific remedies for Vastu defects",
    ],
    source: "Vishwakarma Prakash, Samarangana Sutradhara, Manasara",
  },
]

const techFeatures = [
  { icon: <BarChart3 className="h-5 w-5" />, title: "Swiss Ephemeris Engine", text: "Arc-second planetary precision — the same calculation engine used by professional astrologers worldwide." },
  { icon: <BookOpen className="h-5 w-5" />, title: "Classical Text Grounding", text: "Every prediction maps to a specific verse in the source texts. No hallucinated insights — only verified scholarship." },
  { icon: <Clock className="h-5 w-5" />, title: "30-Second Delivery", text: "Complete chart generation, analysis, and formatted output in under 30 seconds. No scheduling, no waiting." },
  { icon: <Languages className="h-5 w-5" />, title: "Bilingual Output", text: "English and Hindi with authentic Devanagari script. Sanskrit terminology preserved alongside clear modern explanations." },
  { icon: <Shield className="h-5 w-5" />, title: "End-to-End Encryption", text: "AES-256 at rest, TLS 1.3 in transit. Your birth data stays private — we never share with third parties." },
  { icon: <Gem className="h-5 w-5" />, title: "Remedy Recommendations", text: "Gemstones, mantras, and rituals recommended with classical citations. Practical guidance rooted in tradition." },
]

export default function ProductView({ onBack, onUpgrade }: ProductViewProps) {
  return (
    <main className="min-h-screen bg-[#050810]">
      {/* Back button header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Product</h1>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-40 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <BlurReveal>
            <p className="text-xs font-medium text-amber-400/30 mb-6">Product</p>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Four sciences,<br /><span className="text-amber-400">one platform</span>
            </h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-sm text-white/60 mx-auto max-w-xl">
              GrahAI unifies Vedic Astrology, Numerology, Tarot, and Vastu Shastra into
              a single AI-powered platform. Every reading is grounded in classical texts,
              computed with mathematical precision, and delivered in seconds.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.3}>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={onBack}
                className="group flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-3.5 text-sm font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
              >
                Join the Waitlist
              </button>
              <button
                onClick={onUpgrade}
                className="flex items-center gap-2 rounded-xl border border-amber-400/15 px-8 py-3.5 text-sm font-semibold text-amber-400/60 transition-all hover:border-amber-400/25 hover:bg-amber-400/[0.04]"
              >
                View Pricing<ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </BlurReveal>
        </div>
      </section>

      {/* ═══ FOUR SCIENCES DEEP DIVE ═══ */}
      {sciences.map((science, idx) => (
        <section key={science.id} id={science.id}
          className={`relative px-6 lg:px-10 py-24 lg:py-36 ${idx % 2 === 1 ? "bg-white/[0.03]" : ""}`}>
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-start">
              {/* Left — Info */}
              <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                <BlurReveal>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] text-amber-400/50">
                    {science.icon}
                  </div>
                </BlurReveal>
                <BlurReveal delay={0.1}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white lg:text-4xl">{science.title}</h2>
                    <span className="font-hindi text-sm text-amber-400/45">{science.titleHi}</span>
                  </div>
                </BlurReveal>
                <BlurReveal delay={0.15}>
                  <p className="text-sm text-white/60 mb-8 max-w-lg">{science.description}</p>
                </BlurReveal>
                <BlurReveal delay={0.2}>
                  <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-amber-400/40 mb-2">Source Texts</p>
                  <p className="text-xs text-white/50 italic">{science.source}</p>
                </BlurReveal>
              </div>

              {/* Right — Capabilities */}
              <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                <div className="rounded-2xl border border-white/[0.04] bg-white/[0.03] p-8 lg:p-10">
                  <p className="text-xs font-medium text-amber-400/45 mb-6">Capabilities</p>
                  <div className="space-y-4">
                    {science.capabilities.map((cap, i) => (
                      <Reveal key={i} delay={i * 0.05}>
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/30" />
                          <span className="text-sm text-white/75 leading-relaxed">{cap}</span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ═══ TECHNOLOGY ═══ */}
      <section className="relative px-6 lg:px-10 py-32 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 lg:mb-28 max-w-2xl mx-auto text-center">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.1}><p className="text-xs font-medium text-amber-400/30 mt-6 mb-4">Under the Hood</p></BlurReveal>
            <BlurReveal delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Built for <span className="text-amber-400">precision</span>
              </h2>
            </BlurReveal>
            <BlurReveal delay={0.3}>
              <p className="text-sm text-white/60 max-w-lg mx-auto">
                Every component of GrahAI is engineered for accuracy, speed, and trust.
              </p>
            </BlurReveal>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {techFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="group rounded-2xl border border-white/[0.04] bg-white/[0.03] p-8 transition-all duration-500 hover:border-amber-400/10 hover:bg-white/[0.05]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/[0.04] text-amber-400/50 transition-colors group-hover:text-amber-400/70">
                    {f.icon}
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-xs text-white/50">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative px-6 lg:px-10 py-32 lg:py-40">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[300px] rounded-full bg-amber-400/[0.04] blur-[140px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <BlurReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to explore<br />your <span className="text-amber-400">cosmic blueprint</span>?
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <p className="text-sm text-white/60 mx-auto mb-12 max-w-md">
              Join the waitlist today and be among the first to experience
              precision Vedic readings powered by AI.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={onBack}
                className="group flex items-center gap-2 rounded-xl bg-amber-400 px-10 py-4 text-base font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
              >
                Join the Waitlist
              </button>
              <button
                onClick={onUpgrade}
                className="flex items-center gap-2 rounded-xl border border-amber-400/15 px-10 py-4 text-base font-semibold text-amber-400/60 transition-all hover:border-amber-400/25 hover:bg-amber-400/[0.04]"
              >
                View Plans<ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </BlurReveal>
        </div>
      </section>
    </main>
  )
}
