"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, ArrowLeft, Sparkles, MapPin, Clock, Calendar,
  Briefcase, Heart, Gem, TrendingUp, Moon, Compass, Eye,
  BookOpen, Shield, Target
} from "lucide-react"
import type { BirthData, IntentCategory, CosmicSnapshot } from "@/types/app"
import LocationSearch, { type CityData } from "@/components/ui/LocationSearch"

interface OnboardingFlowProps {
  onComplete: () => void
}

const STEPS = [
  { id: "welcome" },
  { id: "intent" },
  { id: "trust" },
  { id: "birth" },
  { id: "reveal" },
]

const INTENTS: { id: IntentCategory; label: string; Icon: typeof Briefcase; color: string }[] = [
  { id: "career", label: "Career & Work", Icon: Briefcase, color: "from-amber-500/20 to-amber-600/10" },
  { id: "love", label: "Love & Relationship", Icon: Heart, color: "from-rose-500/20 to-rose-600/10" },
  { id: "marriage", label: "Marriage & Timing", Icon: Gem, color: "from-purple-500/20 to-purple-600/10" },
  { id: "money", label: "Money & Growth", Icon: TrendingUp, color: "from-emerald-500/20 to-emerald-600/10" },
  { id: "emotional", label: "Emotional Energy", Icon: Moon, color: "from-blue-500/20 to-blue-600/10" },
  { id: "daily", label: "Daily Guidance", Icon: Compass, color: "from-teal-500/20 to-teal-600/10" },
  { id: "exploring", label: "Just Exploring", Icon: Eye, color: "from-gray-500/20 to-gray-600/10" },
]

const TRUST_CARDS = [
  { Icon: Target, title: "Personalized from your birth details", desc: "Every insight is rooted in your unique chart — not generic sun-sign content." },
  { Icon: BookOpen, title: "Source-backed where relevant", desc: "Classical Jyotish references ground the guidance in real tradition." },
  { Icon: Shield, title: "Useful for real-life decisions", desc: "Career, love, timing, money — guidance you can actually act on." },
]

function getWesternSunSign(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const signs: [number, number, string][] = [
      [1, 20, "Capricorn"], [2, 19, "Aquarius"], [3, 20, "Pisces"], [4, 20, "Aries"],
      [5, 21, "Taurus"], [6, 21, "Gemini"], [7, 22, "Cancer"], [8, 23, "Leo"],
      [9, 23, "Virgo"], [10, 23, "Libra"], [11, 22, "Scorpio"], [12, 22, "Sagittarius"],
    ]
    for (let i = signs.length - 1; i >= 0; i--) {
      if (month > signs[i][0] || (month === signs[i][0] && day >= signs[i][1])) {
        return signs[i][2]
      }
    }
    return "Capricorn"
  } catch { return "Unknown" }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformApiResponse(apiData: any, dateOfBirth: string): CosmicSnapshot {
  const snap = apiData?.snapshot
  if (!snap) return makeFallbackSnapshot()

  return {
    profile: {
      moonSign: snap.vedicSign?.name || "Calculating...",
      risingSign: snap.vedicSign?.name || "Calculating...",
      sunSignVedic: snap.vedicSign?.name || "Calculating...",
      sunSignWestern: getWesternSunSign(dateOfBirth),
      nakshatra: snap.nakshatra?.name || "Calculating...",
      nakshatraPada: snap.nakshatra?.pada,
      dominantTheme: snap.element?.name ? `${snap.element.name} Element — ${snap.rulingPlanet?.name || ""}` : "Active Growth Phase",
    },
    todayInsight: snap.todayTransit?.detail || "Your chart shows a period of thoughtful progress. Trust the process.",
    dominantLifeTheme: snap.element?.insight || "You have a unique cosmic blueprint that shapes your journey in profound ways.",
    suggestedFirstQuestion: `What should I focus on this month based on my ${snap.vedicSign?.name || "chart"} energy?`,
  }
}

function makeFallbackSnapshot(): CosmicSnapshot {
  return {
    profile: {
      moonSign: "Cancer", risingSign: "Leo", sunSignVedic: "Virgo",
      sunSignWestern: "Libra", nakshatra: "Pushya", dominantTheme: "Patience Before Progress"
    },
    todayInsight: "Your chart shows a period of thoughtful decision-making. Focus on clarity over speed.",
    dominantLifeTheme: "You tend to think deeply before acting, but right now your chart shows momentum building.",
    suggestedFirstQuestion: "What should I focus on this month for career growth?"
  }
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [intent, setIntent] = useState<IntentCategory | null>(null)
  const [form, setForm] = useState<BirthData>({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  })
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snapshot, setSnapshot] = useState<CosmicSnapshot | null>(null)

  const canProceed = useCallback(() => {
    if (step === 0) return true
    if (step === 1) return intent !== null
    if (step === 2) return true
    if (step === 3) {
      return form.name.trim().length >= 2 && form.dateOfBirth && form.placeOfBirth.trim() && (timeUnknown || form.timeOfBirth)
    }
    if (step === 4) return true
    return false
  }, [step, intent, form, timeUnknown])

  const handleNext = async () => {
    if (step === 3) {
      setIsSubmitting(true)
      try {
        const birthData = {
          ...form,
          timeUnknown,
          ...(selectedCity && {
            latitude: selectedCity.lat,
            longitude: selectedCity.lng,
            timezone: selectedCity.tz,
          }),
        }
        localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(birthData))
        localStorage.setItem("userNameForGreeting", form.name.split(" ")[0])
        if (intent) localStorage.setItem("grahai-user-intent", intent)
        localStorage.setItem("grahai-questions-left", "3")

        const res = await fetch("/api/cosmic-snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthDate: form.dateOfBirth }),
        })
        if (res.ok) {
          const apiData = await res.json()
          const transformed = transformApiResponse(apiData, form.dateOfBirth)
          // Store raw API data for MyChartTab, AND transformed for quick reads
          localStorage.setItem("grahai-cosmic-snapshot", JSON.stringify(apiData))
          setSnapshot(transformed)
        } else {
          const fallback = makeFallbackSnapshot()
          setSnapshot(fallback)
        }
      } catch {
        setSnapshot(makeFallbackSnapshot())
      }
      setIsSubmitting(false)
      setStep(4)
      return
    }
    if (step === 4) {
      onComplete()
      return
    }
    if (step < STEPS.length - 1) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0 && step !== 4) setStep(step - 1)
  }

  const updateField = (key: keyof BirthData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const slideVariants = {
    enter: { opacity: 0, y: 24 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Progress dots */}
      {step < 4 && (
        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-2">
            {STEPS.slice(0, 4).map((s, i) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-gradient-to-r from-[#D4A054] to-[#A16E2A]" : "bg-[#1E293B]"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Back button */}
      {step > 0 && step < 4 && (
        <button
          onClick={handleBack}
          className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-[#1E2638]
            border border-[#1E293B] flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-[#5A6478]" />
        </button>
      )}

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ═══ Step 0: Welcome ═══ */}
          {step === 0 && (
            <motion.div
              key="welcome"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="text-center max-w-sm"
            >
              <div className="w-40 h-40 mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-full border border-[#D4A054]/15 animate-[rotate-slow_40s_linear_infinite]" />
                <div className="absolute inset-3 rounded-full border border-[#D4A054]/10 animate-[rotate-slow_60s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#D4A054]/20 to-[#A16E2A]/10 blur-sm" />
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-[#D4A054]/30 to-[#A16E2A]/20" />
                <div className="absolute inset-14 rounded-full bg-[#D4A054]/10 flex items-center justify-center">
                  <span className="text-3xl font-bold gold-gradient-text">G</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-[#F1F0F5] mb-3 tracking-tight">
                Clear answers for love,{" "}
                <span className="gold-gradient-text">career, timing,</span>{" "}
                and life.
              </h1>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                GrahAI reads your chart to give calm, practical guidance
                for the decisions that matter.
              </p>
            </motion.div>
          )}

          {/* ═══ Step 1: Intent Selection ═══ */}
          {step === 1 && (
            <motion.div
              key="intent"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-2">
                  What do you need clarity on?
                </h2>
                <p className="text-sm text-[#5A6478]">
                  This helps us personalize your first experience
                </p>
              </div>

              <div className="space-y-2.5">
                {INTENTS.map(({ id, label, Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => setIntent(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
                      border transition-all duration-200 text-left ${
                      intent === id
                        ? "border-[#D4A054]/50 bg-[#D4A054]/5"
                        : "border-[#1E293B] bg-[#111827] hover:border-[#1E293B]/80"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color}
                      flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${intent === id ? "text-[#D4A054]" : "text-[#94A3B8]"}`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      intent === id ? "text-[#D4A054]" : "text-[#94A3B8]"
                    }`}>{label}</span>
                    {intent === id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[#D4A054] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#0A0E1A]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ Step 2: Trust ═══ */}
          {step === 2 && (
            <motion.div
              key="trust"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-2">
                  Not generic. Not random.
                </h2>
                <p className="text-sm text-[#5A6478]">Built around your chart.</p>
              </div>
              <div className="space-y-4">
                {TRUST_CARDS.map(({ Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.12 }}
                    className="flex gap-4 p-4 rounded-xl bg-[#111827] border border-[#1E293B]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#D4A054]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#D4A054]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#F1F0F5] mb-1">{title}</h3>
                      <p className="text-xs text-[#5A6478] leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ Step 3: Birth Details ═══ */}
          {step === 3 && (
            <motion.div
              key="birth"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-2">Your birth details</h2>
                <p className="text-sm text-[#5A6478]">Accurate details lead to precise guidance</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] mb-1.5 block">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter your full name" autoFocus
                    className="w-full bg-[#0D1220] border border-[#1E293B] rounded-xl px-4 py-3.5
                      text-[#F1F0F5] text-sm placeholder:text-[#5A6478]/50
                      focus:border-[#D4A054]/40 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#94A3B8] mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />Date of Birth
                  </label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="w-full bg-[#0D1220] border border-[#1E293B] rounded-xl px-4 py-3
                      text-[#F1F0F5] text-sm focus:border-[#D4A054]/40 focus:outline-none transition-colors [color-scheme:dark]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#94A3B8] mb-1.5">
                    <Clock className="w-3.5 h-3.5" />Time of Birth
                  </label>
                  <input type="time" value={form.timeOfBirth} onChange={(e) => updateField("timeOfBirth", e.target.value)}
                    disabled={timeUnknown}
                    className={`w-full bg-[#0D1220] border border-[#1E293B] rounded-xl px-4 py-3
                      text-[#F1F0F5] text-sm focus:border-[#D4A054]/40 focus:outline-none transition-colors
                      [color-scheme:dark] ${timeUnknown ? "opacity-40" : ""}`} />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)}
                      className="w-4 h-4 rounded border-[#1E293B] bg-[#0D1220] accent-[#D4A054]" />
                    <span className="text-xs text-[#5A6478]">I don&apos;t know my birth time</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#94A3B8] mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />Place of Birth
                  </label>
                  <LocationSearch
                    value={form.placeOfBirth}
                    onChange={(value, city) => {
                      updateField("placeOfBirth", value)
                      if (city) setSelectedCity(city)
                    }}
                    placeholder="Search city — e.g. Mumbai, Delhi, London..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Step 4: Instant Reveal ═══ */}
          {step === 4 && snapshot && (
            <motion.div
              key="reveal"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A054]/20 to-[#A16E2A]/10
                    flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-7 h-7 text-[#D4A054]" />
                </motion.div>
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-1">Your chart, at first glance</h2>
                <p className="text-xs text-[#5A6478]">{form.name.split(" ")[0]}&apos;s cosmic blueprint</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Vedic Sign", value: snapshot.profile.sunSignVedic },
                  { label: "Nakshatra", value: snapshot.profile.nakshatra },
                  { label: "Western", value: snapshot.profile.sunSignWestern },
                ].map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-[#111827] border border-[#1E293B] rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#5A6478] mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-[#D4A054]">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="bg-[#111827] border border-[#D4A054]/15 rounded-xl p-4 mb-4">
                <p className="text-xs text-[#D4A054] font-medium mb-2">{snapshot.profile.dominantTheme || "Active Theme"}</p>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{snapshot.dominantLifeTheme}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="bg-[#0D1220] border border-[#1E293B] rounded-xl p-4 mb-4">
                <p className="text-xs text-[#5A6478] font-medium mb-2">Today</p>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{snapshot.todayInsight}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="text-center">
                <p className="text-[10px] text-[#5A6478] mb-2">Try asking</p>
                <p className="text-xs text-[#D4A054]/70 italic">&ldquo;{snapshot.suggestedFirstQuestion}&rdquo;</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-8 pt-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2
            transition-all ${
            canProceed() && !isSubmitting
              ? "btn-primary"
              : "bg-[#1E2638] text-[#5A6478] cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0A0E1A]/30 border-t-[#0A0E1A] rounded-full animate-spin" />
              <span>Reading your chart...</span>
            </>
          ) : step === 0 ? (
            <>Get my first insight<ArrowRight className="w-4 h-4" /></>
          ) : step === 4 ? (
            <><Sparkles className="w-4 h-4" />Enter GrahAI</>
          ) : step === 3 ? (
            <><Sparkles className="w-4 h-4" />Generate my chart</>
          ) : (
            <>Continue<ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
