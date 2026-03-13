"use client"

import { ArrowLeft, BookOpen, Target, Heart, Users, Globe, Lightbulb } from "lucide-react"
import { BlurReveal, Reveal, Divider } from "@/components/Animations"

interface AboutViewProps {
  onBack: () => void
}

const values = [
  { icon: <BookOpen className="h-5 w-5" />, title: "Authenticity", text: "Every insight traces to classical Vedic texts. We don't generate predictions from thin air — we compute them from 2,000+ years of codified wisdom." },
  { icon: <Target className="h-5 w-5" />, title: "Precision", text: "Swiss Ephemeris calculations to arc-second accuracy. Divisional charts, Dasha sub-periods, and transit overlays computed with mathematical rigor." },
  { icon: <Heart className="h-5 w-5" />, title: "Accessibility", text: "Vedic knowledge that was once available only to scholars or expensive pandits — now accessible to everyone, in their own language, in seconds." },
  { icon: <Users className="h-5 w-5" />, title: "Privacy", text: "Your birth data is sacred. We encrypt everything, share nothing, and give you complete control over your information." },
  { icon: <Globe className="h-5 w-5" />, title: "Cultural Preservation", text: "Sanskrit terminology, Devanagari script, and authentic references preserved alongside modern explanations. Tradition meets technology." },
  { icon: <Lightbulb className="h-5 w-5" />, title: "Continuous Learning", text: "Our models improve with opt-in feedback. Pattern recognition deepens over time — your second consultation is more insightful than your first." },
]

const timeline = [
  { date: "January 2026", title: "Idea & Research", text: "Deep study of classical texts — BPHS, Saravali, Phaladeepika. Architecture design for multi-discipline AI platform." },
  { date: "February 2026", title: "Foundation Sprint", text: "Core infrastructure built — Supabase backend, Next.js frontend, Swiss Ephemeris integration, and AI training pipeline." },
  { date: "March 2026", title: "Building in Public", text: "Landing page live, waitlist growing. Four Vedic science modules in active development. Community feedback shaping the product." },
  { date: "April 2026", title: "Launch", text: "Public launch with Kundli generation, Numerology, Tarot, and Vastu modules. Free and premium tiers available." },
]

export default function AboutView({ onBack }: AboutViewProps) {
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
        <h1 className="text-lg font-bold text-white">About</h1>
      </div>

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <BlurReveal>
            <p className="text-xs font-medium text-amber-400/30 mb-6">About GrahAI</p>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Preserving ancient wisdom<br />through <span className="text-amber-400">modern technology</span>
            </h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-sm text-white/60 max-w-2xl text-lg leading-relaxed">
              For millennia, Vedic sciences have guided millions through life's most important decisions —
              career, relationships, health, and spiritual growth. But access to authentic, text-grounded
              readings has always been limited by geography, language, and cost.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.3}>
            <p className="text-sm text-white/60 max-w-2xl mt-6 text-lg leading-relaxed">
              GrahAI was built to change that. We're creating an AI platform that doesn't just generate
              horoscopes — it computes precise Vedic readings grounded in the same classical texts that
              scholars have studied for over two thousand years.
            </p>
          </BlurReveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative px-6 lg:px-10 py-24 lg:py-36 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.1}><p className="text-xs font-medium text-amber-400/30 mt-6 mb-4">Our Mission</p></BlurReveal>
            <BlurReveal delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                Make Vedic knowledge<br /><span className="text-amber-400">universally accessible</span>
              </h2>
            </BlurReveal>
            <BlurReveal delay={0.3}>
              <p className="text-sm text-white/60 max-w-lg leading-relaxed">
                We believe everyone deserves access to the depth and precision of classical
                Vedic sciences — regardless of where they live, what language they speak, or
                what they can afford. GrahAI democratizes this ancient knowledge while
                preserving its authenticity.
              </p>
            </BlurReveal>
          </div>
          <div>
            <BlurReveal delay={0.2}>
              <div className="rounded-2xl border border-white/[0.04] bg-[#050810]/50 p-10">
                <p className="font-hindi text-2xl text-amber-400/40 mb-6 leading-relaxed">
                  &ldquo;ज्योतिषशास्त्रं वेदस्य चक्षुः&rdquo;
                </p>
                <p className="text-sm text-white/60 italic mb-4">
                  &ldquo;Jyotish Shastra is the eye of the Vedas.&rdquo;
                </p>
                <p className="text-xs text-white/50">— Vedanga Jyotisha</p>
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
            <BlurReveal delay={0.1}><p className="text-xs font-medium text-amber-400/30 mt-6 mb-4">Our Values</p></BlurReveal>
            <BlurReveal delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">What we <span className="text-amber-400">stand for</span></h2>
            </BlurReveal>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="group rounded-2xl border border-white/[0.04] bg-white/[0.03] p-8 transition-all duration-500 hover:border-amber-400/10 hover:bg-white/[0.05]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/[0.04] text-amber-400/50 transition-colors group-hover:text-amber-400/70">{v.icon}</div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{v.title}</h3>
                  <p className="text-xs text-white/50">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative px-6 lg:px-10 py-32 lg:py-48 bg-white/[0.03]">
        <div className="mx-auto max-w-3xl">
          <div className="mb-20 text-center">
            <BlurReveal><Divider /></BlurReveal>
            <BlurReveal delay={0.1}><p className="text-xs font-medium text-amber-400/30 mt-6 mb-4">Our Journey</p></BlurReveal>
            <BlurReveal delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">From idea to <span className="text-amber-400">launch</span></h2>
            </BlurReveal>
          </div>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <Reveal key={t.date} delay={i * 0.1}>
                <div className="group flex gap-6 lg:gap-10">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-400/10 bg-amber-400/[0.03] transition-all group-hover:border-amber-400/25">
                      <span className="text-xs font-bold text-amber-400/40">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    {i < timeline.length - 1 && <div className="mt-3 w-px flex-1 bg-gradient-to-b from-amber-400/10 to-transparent" />}
                  </div>
                  <div className="pb-14">
                    <p className="text-xs font-medium text-amber-400/25 mb-2">{t.date}</p>
                    <h3 className="mb-2 text-xl font-semibold text-white">{t.title}</h3>
                    <p className="text-xs text-white/50 max-w-md">{t.text}</p>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Join us on this <span className="text-amber-400">journey</span></h2>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <p className="text-sm text-white/60 mx-auto mb-12 max-w-md">
              Be among the first to experience what happens when 2,000 years of wisdom meets modern AI.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-3 rounded-xl bg-amber-400 px-10 py-4 text-base font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
            >
              Join the Waitlist
            </button>
          </BlurReveal>
        </div>
      </section>
    </main>
  )
}
