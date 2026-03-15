"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import {
  ArrowRight, ArrowLeft, Sparkles, MapPin, Clock, Calendar,
  Briefcase, Heart, Gem, TrendingUp, Moon, Compass, Eye,
  BookOpen, Shield, Target, Send, ChevronRight, Globe,
} from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"
import { LANGUAGES, type Language } from "@/lib/i18n"
import type { BirthData, IntentCategory, CosmicSnapshot } from "@/types/app"
import LocationSearch, { type CityData } from "@/components/ui/LocationSearch"

/* GrahAI branding — shown only on onboarding welcome step */

interface OnboardingFlowProps {
  onComplete: (goToAsk?: boolean, firstQuestion?: string) => void
}

const STEPS = [
  { id: "language" },         // 0
  { id: "welcome-trust" },    // 1 — merged welcome + trust
  { id: "intent" },           // 2
  { id: "birth" },            // 3
  { id: "reveal" },           // 4
  { id: "first-question" },   // 5
]

// Intent-based suggested questions for the first-question step
const INTENT_QUESTIONS: Record<string, string[]> = {
  career: [
    "Is this a good time to change jobs or ask for a promotion?",
    "What does my chart say about my career strengths?",
    "When is my next big professional opportunity coming?",
  ],
  love: [
    "What does my chart reveal about my love life right now?",
    "Am I likely to meet someone meaningful soon?",
    "What pattern in my chart affects how I relate to partners?",
  ],
  marriage: [
    "Is this a favorable period for marriage or commitment?",
    "What does my chart say about timing for a serious relationship?",
    "Are there any blocks to marriage in my chart right now?",
  ],
  money: [
    "What does my chart say about financial growth this year?",
    "Is this a good time for investments or big purchases?",
    "What are my chart's natural wealth indicators?",
  ],
  emotional: [
    "Why have I been feeling restless or stuck lately?",
    "What does my chart show about my emotional state right now?",
    "How can I work with my current energy instead of against it?",
  ],
  daily: [
    "What should I focus on today based on my chart?",
    "What energy is most active for me this week?",
    "Is today a good day for important decisions?",
  ],
  exploring: [
    "What is the most interesting thing about my birth chart?",
    "What does my Moon sign and Nakshatra say about my personality?",
    "What life themes are most active for me right now?",
  ],
}

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
      moonSign: snap.moonSign?.name || snap.vedicSign?.name || "Calculating...",
      risingSign: snap.risingSign?.name || "Requires birth time",
      sunSignVedic: snap.vedicSign?.name || "Calculating...",
      sunSignWestern: getWesternSunSign(dateOfBirth),
      nakshatra: snap.nakshatra?.name || "Calculating...",
      nakshatraPada: snap.nakshatra?.pada,
      dominantTheme: snap.element?.name ? `${snap.element.name} Element — ${snap.rulingPlanet?.name || ""}` : "Active Growth Phase",
    },
    todayInsight: snap.todayTransit?.detail || "Your chart shows a period of thoughtful progress. Trust the process.",
    dominantLifeTheme: snap.element?.insight || "You have a unique cosmic blueprint that shapes your journey in profound ways.",
    suggestedFirstQuestion: `What should I focus on this month based on my ${snap.moonSign?.name || snap.vedicSign?.name || "chart"} energy?`,
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
  const { t, lang, setLanguage } = useLanguage()
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
  const [firstQuestion, setFirstQuestion] = useState("")
  const questionInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus question input when reaching step 5
  useEffect(() => {
    if (step === 5 && questionInputRef.current) {
      setTimeout(() => questionInputRef.current?.focus(), 600)
    }
  }, [step])

  // Auto-advance after language selection
  useEffect(() => {
    if (step === 0 && lang) {
      setTimeout(() => setStep(1), 300)
    }
  }, [lang, step])

  const INTENTS: { id: IntentCategory; label: string; Icon: typeof Briefcase; color: string }[] = [
    { id: "career", label: t.onboarding.intentCareer, Icon: Briefcase, color: "from-amber-500/20 to-amber-600/10" },
    { id: "love", label: t.onboarding.intentLove, Icon: Heart, color: "from-rose-500/20 to-rose-600/10" },
    { id: "marriage", label: t.onboarding.intentMarriage, Icon: Gem, color: "from-[#D4A054]/20 to-[#D4A054]/10" },
    { id: "money", label: t.onboarding.intentMoney, Icon: TrendingUp, color: "from-emerald-500/20 to-emerald-600/10" },
    { id: "emotional", label: t.onboarding.intentEmotional, Icon: Moon, color: "from-blue-500/20 to-blue-600/10" },
    { id: "daily", label: t.onboarding.intentDaily, Icon: Compass, color: "from-teal-500/20 to-teal-600/10" },
    { id: "exploring", label: t.onboarding.intentExploring, Icon: Eye, color: "from-gray-500/20 to-gray-600/10" },
  ]

  const TRUST_CARDS = [
    { Icon: Target, title: t.onboarding.trustCard1Title, desc: t.onboarding.trustCard1Desc },
    { Icon: BookOpen, title: t.onboarding.trustCard2Title, desc: t.onboarding.trustCard2Desc },
    { Icon: Shield, title: t.onboarding.trustCard3Title, desc: t.onboarding.trustCard3Desc },
  ]

  const canProceed = useCallback(() => {
    if (step === 0) return true // language picker
    if (step === 1) return true // welcome-trust
    if (step === 2) return intent !== null // intent
    if (step === 3) {
      return form.name.trim().length >= 2 && form.dateOfBirth && form.placeOfBirth.trim() && (timeUnknown || form.timeOfBirth)
    }
    if (step === 4) return true // reveal
    if (step === 5) return true // first question (optional)
    return false
  }, [step, intent, form, timeUnknown])

  const handleNext = async () => {
    // Step 0: Language picker — auto-advances via useEffect
    if (step === 0) {
      setStep(1)
      return
    }

    // Step 3 → 4: Generate chart then move to reveal
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
          body: JSON.stringify({
            birthDate: form.dateOfBirth,
            birthTime: timeUnknown ? null : form.timeOfBirth,
            latitude: selectedCity?.lat,
            longitude: selectedCity?.lng,
          }),
        })
        if (res.ok) {
          const apiData = await res.json()
          const transformed = transformApiResponse(apiData, form.dateOfBirth)
          localStorage.setItem("grahai-cosmic-snapshot", JSON.stringify(apiData))
          setSnapshot(transformed)
        } else {
          setSnapshot(makeFallbackSnapshot())
        }
      } catch {
        setSnapshot(makeFallbackSnapshot())
      }
      setIsSubmitting(false)
      setStep(4)
      return
    }

    // Step 4: Reveal — move to first question
    if (step === 4) {
      setStep(5)
      return
    }

    // Step 5: First question — go to Ask tab or enter app
    if (step === 5) {
      localStorage.setItem("grahai-onboarding-complete", "true")
      if (firstQuestion.trim()) {
        onComplete(true, firstQuestion.trim())
      } else {
        onComplete()
      }
      return
    }

    if (step < STEPS.length - 1) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0 && step <= 3) setStep(step - 1)
  }

  const handleSelectSuggestion = (q: string) => {
    setFirstQuestion(q)
  }

  const handleAskNow = () => {
    if (firstQuestion.trim()) {
      localStorage.setItem("grahai-onboarding-complete", "true")
      onComplete(true, firstQuestion.trim())
    }
  }

  const updateField = (key: keyof BirthData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const slideVariants = {
    enter: { opacity: 0, x: 40, scale: 0.96, filter: "blur(6px)" },
    center: {
      opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
    exit: {
      opacity: 0, x: -30, scale: 0.96, filter: "blur(4px)",
      transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] as const }
    },
  }

  const suggestedQuestions = intent ? INTENT_QUESTIONS[intent] || INTENT_QUESTIONS.exploring : INTENT_QUESTIONS.exploring

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Progress dots — show for steps 1-3 (welcome-trust, intent, birth) */}
      {step >= 1 && step <= 3 && (
        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-2">
            {STEPS.slice(1, 4).map((s, i) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= (step - 1) ? "bg-gradient-to-r from-[#D4A054] to-[#A16E2A]" : "bg-[#1E293B]"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Back button */}
      {step > 0 && step <= 3 && (
        <button
          onClick={handleBack}
          className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-[#1E2638]
            border border-[#1E293B] flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-[#8892A3]" />
        </button>
      )}

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ═══ Step 0: Language Picker ═══ */}
          {step === 0 && (
            <motion.div
              key="language"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-14 h-14 rounded-full bg-[#D4A054]/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Globe className="w-7 h-7 text-[#D4A054]" />
                </motion.div>
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-2">
                  {t.langPicker.title}
                </h2>
                <p className="text-sm text-[#8892A3]">
                  {t.langPicker.subtitle}
                </p>
              </div>

              {/* 3-column grid of language cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {LANGUAGES.map((langMeta, i) => (
                  <motion.button
                    key={langMeta.code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => setLanguage(langMeta.code as Language)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      lang === langMeta.code
                        ? "border-[#D4A054] bg-[#D4A054]/5"
                        : "border-[#1E293B] bg-[#111827] hover:border-[#1E293B]/80"
                    }`}
                  >
                    <p className={`text-sm font-semibold mb-1 ${
                      lang === langMeta.code ? "text-[#D4A054]" : "text-[#F1F0F5]"
                    }`}>
                      {langMeta.label}
                    </p>
                    <p className={`text-xs ${
                      lang === langMeta.code ? "text-[#D4A054]/80" : "text-[#8892A3]"
                    }`}>
                      {langMeta.labelEn}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ Step 1: Welcome + Trust (merged) ═══ */}
          {step === 1 && (
            <motion.div
              key="welcome-trust"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              {/* ── Grah AI Brand with orange triangle ── */}
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                  className="relative inline-flex items-center justify-center mb-4 mt-6"
                >
                  <span
                    className="text-[3.5rem] sm:text-[4.5rem] font-extrabold tracking-tight text-white"
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      textShadow: "0 0 18px rgba(255,255,255,0.15)",
                      lineHeight: 1,
                    }}
                  >
                    Grah{" "}
                  </span>
                  <span className="relative inline-block">
                    <svg
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "130%",
                        height: "110%",
                        filter: "drop-shadow(0 0 30px rgba(255,102,0,0.5))",
                      }}
                      viewBox="0 0 100 90"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="triGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                          <stop offset="0%" stopColor="#FF8800" />
                          <stop offset="50%" stopColor="#FF5500" />
                          <stop offset="100%" stopColor="#CC3300" />
                        </linearGradient>
                      </defs>
                      <polygon points="50,2 98,88 2,88" fill="url(#triGrad)" />
                      <polygon points="50,32 72,74 28,74" fill="rgba(255,180,80,0.15)" />
                    </svg>
                    <span
                      className="relative z-10 text-[3.5rem] sm:text-[4.5rem] font-extrabold tracking-tight text-white"
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        textShadow: "0 0 10px rgba(255,136,0,0.4)",
                        lineHeight: 1,
                      }}
                    >
                      AI
                    </span>
                  </span>
                </motion.div>

                <h1 className="text-2xl font-bold text-[#F1F0F5] mb-2 tracking-tight">
                  {t.onboarding.welcomeSubtitle}
                </h1>
                <p className="text-sm text-[#ACB8C4] leading-relaxed mb-6">
                  {t.onboarding.welcomeDesc}
                </p>
              </div>

              {/* Trust cards — integrated into welcome */}
              <div className="space-y-3">
                {TRUST_CARDS.map(({ Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.12 }}
                    className="flex gap-3 p-3.5 rounded-xl bg-[#111827] border border-[#1E293B]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#D4A054]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-[#D4A054]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#F1F0F5] mb-0.5">{title}</h3>
                      <p className="text-xs text-[#8892A3] leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ Step 2: Intent Selection ═══ */}
          {step === 2 && (
            <motion.div
              key="intent"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-2">
                  {t.onboarding.intentTitle}
                </h2>
                <p className="text-sm text-[#8892A3]">
                  {t.onboarding.intentSubtitle}
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
                      <Icon className={`w-5 h-5 ${intent === id ? "text-[#D4A054]" : "text-[#ACB8C4]"}`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      intent === id ? "text-[#D4A054]" : "text-[#ACB8C4]"
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

          {/* ═══ Step 3: Birth Details ═══ */}
          {step === 3 && (
            <motion.div
              key="birth"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-2">{t.onboarding.birthTitle}</h2>
                <p className="text-sm text-[#8892A3]">{t.onboarding.birthSubtitle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#ACB8C4] mb-1.5 block">{t.onboarding.fullName}</label>
                  <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)}
                    placeholder={t.onboarding.fullNamePlaceholder} autoFocus
                    className="w-full bg-[#0D1220] border border-[#1E293B] rounded-xl px-4 py-3.5
                      text-[#F1F0F5] text-sm placeholder:text-[#8892A3]/50
                      input-focus-glow focus:border-[#D4A054]/40 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#ACB8C4] mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />{t.onboarding.dateOfBirth}
                  </label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="w-full bg-[#0D1220] border border-[#1E293B] rounded-xl px-4 py-3
                      text-[#F1F0F5] text-sm input-focus-glow focus:border-[#D4A054]/40 focus:outline-none transition-colors [color-scheme:dark]" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#ACB8C4] mb-1.5">
                    <Clock className="w-3.5 h-3.5" />{t.onboarding.timeOfBirth}
                  </label>
                  <input type="time" value={form.timeOfBirth} onChange={(e) => updateField("timeOfBirth", e.target.value)}
                    disabled={timeUnknown}
                    className={`w-full bg-[#0D1220] border border-[#1E293B] rounded-xl px-4 py-3
                      text-[#F1F0F5] text-sm input-focus-glow focus:border-[#D4A054]/40 focus:outline-none transition-colors
                      [color-scheme:dark] ${timeUnknown ? "opacity-40" : ""}`} />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)}
                      className="w-4 h-4 rounded border-[#1E293B] bg-[#0D1220] accent-[#D4A054]" />
                    <span className="text-xs text-[#8892A3]">{t.onboarding.dontKnowTime}</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#ACB8C4] mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />{t.onboarding.placeOfBirth}
                  </label>
                  <LocationSearch
                    value={form.placeOfBirth}
                    onChange={(value, city) => {
                      updateField("placeOfBirth", value)
                      if (city) setSelectedCity(city)
                    }}
                    placeholder={t.onboarding.placePlaceholder}
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
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-1">{t.onboarding.revealTitle}</h2>
                <p className="text-xs text-[#8892A3]">{form.name.split(" ")[0]}&apos;s {t.onboarding.revealSubtitle}</p>
              </div>

              {/* Key triad: Moon Sign, Nakshatra, Rising Sign */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: t.onboarding.moonSign, value: snapshot.profile.moonSign },
                  { label: t.onboarding.nakshatra, value: snapshot.profile.nakshatra },
                  { label: t.onboarding.risingSign, value: snapshot.profile.risingSign || "N/A" },
                ].map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-[#111827] border border-[#1E293B] rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#8892A3] mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-[#D4A054]">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Dominant life theme */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="bg-[#111827] border border-[#D4A054]/15 rounded-xl p-4 mb-4">
                <p className="text-xs text-[#D4A054] font-medium mb-2">{snapshot.profile.dominantTheme || t.common.today}</p>
                <p className="text-sm text-[#ACB8C4] leading-relaxed">{snapshot.dominantLifeTheme}</p>
              </motion.div>

              {/* Today insight */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="bg-[#0D1220] border border-[#1E293B] rounded-xl p-4 mb-4">
                <p className="text-xs text-[#8892A3] font-medium mb-2">{t.onboarding.todayLabel}</p>
                <p className="text-sm text-[#ACB8C4] leading-relaxed">{snapshot.todayInsight}</p>
              </motion.div>

              {/* Teaser for next step */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                className="text-center">
                <p className="text-[10px] text-[#8892A3]">{t.onboarding.readyToAsk}</p>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ Step 5: First Question — The Aha Moment ═══ */}
          {step === 5 && (
            <motion.div
              key="first-question"
              variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#F1F0F5] mb-2">
                  {t.onboarding.askFirstTitle}
                </h2>
                <p className="text-sm text-[#8892A3] leading-relaxed">
                  {t.onboarding.askFirstSubtitle}
                </p>
              </div>

              {/* Question input */}
              <div className="relative mb-5">
                <input
                  ref={questionInputRef}
                  type="text"
                  value={firstQuestion}
                  onChange={(e) => setFirstQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && firstQuestion.trim()) handleAskNow() }}
                  placeholder={t.onboarding.typePlaceholder}
                  className="w-full bg-[#0D1220] border border-[#1E293B] rounded-xl px-4 py-3.5 pr-12
                    text-[#F1F0F5] text-sm placeholder:text-[#8892A3]/50
                    focus:border-[#D4A054]/40 focus:outline-none transition-colors"
                />
                {firstQuestion.trim() && (
                  <button
                    onClick={handleAskNow}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                      bg-gradient-to-r from-[#D4A054] to-[#A16E2A] flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 text-[#0A0E1A]" />
                  </button>
                )}
              </div>

              {/* Suggested questions based on intent */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-medium text-[#8892A3] uppercase tracking-wider">{t.onboarding.suggestionsLabel}</p>
                {suggestedQuestions.map((q, i) => (
                  <motion.button
                    key={q}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => handleSelectSuggestion(q)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left
                      transition-all duration-200 ${
                      firstQuestion === q
                        ? "border-[#D4A054]/50 bg-[#D4A054]/5"
                        : "border-[#1E293B] bg-[#111827] hover:border-[#1E293B]/80"
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 shrink-0 ${
                      firstQuestion === q ? "text-[#D4A054]" : "text-[#8892A3]"
                    }`} />
                    <span className={`text-sm leading-snug ${
                      firstQuestion === q ? "text-[#D4A054]" : "text-[#ACB8C4]"
                    }`}>{q}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto shrink-0 ${
                      firstQuestion === q ? "text-[#D4A054]" : "text-[#8892A3]/40"
                    }`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Save-chart step removed — consolidated into 6-step flow */}
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
              : "bg-[#1E2638] text-[#8892A3] cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0A0E1A]/30 border-t-[#0A0E1A] rounded-full animate-spin" />
              <span>{t.onboarding.readingChart}</span>
            </>
          ) : step === 0 ? (
            <>{t.onboarding.getFirstInsight}<ArrowRight className="w-4 h-4" /></>
          ) : step === 4 ? (
            <>{t.onboarding.askYourFirst}<ArrowRight className="w-4 h-4" /></>
          ) : step === 5 ? (
            firstQuestion.trim() ? (
              <><Send className="w-4 h-4" />{t.onboarding.askNow}</>
            ) : (
              <>{t.onboarding.skipExplore}<ArrowRight className="w-4 h-4" /></>
            )
          ) : step === 3 ? (
            <><Sparkles className="w-4 h-4" />{t.onboarding.generateChart}</>
          ) : (
            <>{t.onboarding.continueBtn}<ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
