"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Zap,
  BookOpen,
  MessageSquare,
  Lock,
  Mail,
  Loader2,
  Moon,
  Star,
  Sun,
  Clock,
  ChevronRight,
  Check,
  Eye,
} from "lucide-react"
import LocationAutocomplete, { type LocationSelection } from "@/components/LocationAutocomplete"

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

type Step = 1 | 2 | 3 | 4 | 5 | 6

interface BirthData {
  date: string
  time: string
  place: string
  timeUnknown: boolean
  lat?: number
  lng?: number
  tz?: number
}

interface CosmicSnapshot {
  sunSign: string
  moonSign: string
  nakshatra: string
  nakshatraDeity: string
  nakshatraShakti: string
  lifeTheme: string
  element: string
  transitVibe: string
  rulingPlanet: string
  lifePath: string
}

// ═══════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════

const INTENTS = [
  { id: "career", label: "Career", hindi: "करियर", icon: "💼", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/20" },
  { id: "love", label: "Love", hindi: "प्रेम", icon: "❤️", color: "from-pink-500/20 to-pink-600/10", border: "border-pink-500/20" },
  { id: "marriage", label: "Marriage", hindi: "विवाह", icon: "💍", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/20" },
  { id: "money", label: "Money", hindi: "धन", icon: "💰", color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/20" },
  { id: "health", label: "Health", hindi: "स्वास्थ्य", icon: "🧘", color: "from-teal-500/20 to-teal-600/10", border: "border-teal-500/20" },
  { id: "daily", label: "Daily Guidance", hindi: "दैनिक मार्गदर्शन", icon: "🌅", color: "from-amber-500/20 to-orange-600/10", border: "border-amber-500/20" },
  { id: "exploring", label: "Just Exploring", hindi: "अन्वेषण", icon: "🔭", color: "from-indigo-500/20 to-indigo-600/10", border: "border-indigo-500/20" },
]

const INTENT_FIRST_QUESTIONS: Record<string, string> = {
  career: "Should I switch jobs this year?",
  love: "When will I find the right partner?",
  marriage: "Is this the right time for marriage?",
  money: "When will my finances improve?",
  health: "What lifestyle changes suit my chart?",
  daily: "What should I focus on today?",
  exploring: "What does my chart reveal about me?",
}

// Interactive demo data for "See a sample answer"
const DEMO_QUESTION = "Will I get a promotion this year?"
const DEMO_BIRTH = { sign: "Taurus", nakshatra: "Rohini" }

const DEMO_ANSWER_LINES = [
  "Based on your birth chart, Saturn is currently transiting your 10th house of career.",
  "",
  "This is a period of hard work being recognized. Your Dashamsha chart shows Jupiter aspecting your 10th lord, which strengthens career prospects significantly.",
  "",
  "**Key Timing:** The period between April–July 2026 looks especially favorable for career advancement.",
  "",
  "**Classical Reference:** As stated in Brihat Parashara Hora Shastra — when Jupiter aspects the 10th lord during Saturn's transit, professional elevation is indicated.",
  "",
  "**Practical Advice:** Focus on visibility in your current role. Avoid switching before May. The transit supports recognition for existing work rather than new beginnings.",
]

// ═══════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════

export default function OnboardingView({
  onBack,
  onComplete,
  startAtStep,
}: {
  onBack: () => void
  onComplete: () => void
  startAtStep?: Step
}) {
  const [step, setStep] = useState<Step>(startAtStep || 1)
  const [intent, setIntent] = useState<string | null>(null)
  const [birthData, setBirthData] = useState<BirthData>({
    date: "",
    time: "",
    place: "",
    timeUnknown: false,
  })
  const [cosmicSnapshot, setCosmicSnapshot] = useState<CosmicSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSampleDemo, setShowSampleDemo] = useState(false)
  const [demoTypingIndex, setDemoTypingIndex] = useState(0)
  const [demoComplete, setDemoComplete] = useState(false)

  // Step 5: First Question state
  const [editableQuestion, setEditableQuestion] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [questionLoading, setQuestionLoading] = useState(false)
  const [questionSubmitted, setQuestionSubmitted] = useState(false)

  // Auth state
  const [authEmail, setAuthEmail] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authSent, setAuthSent] = useState(false)

  // Persist birth data to localStorage whenever it changes
  useEffect(() => {
    if (birthData.date) {
      try {
        localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(birthData))
      } catch { /* ignore */ }
    }
  }, [birthData])

  // Persist cosmic snapshot
  useEffect(() => {
    if (cosmicSnapshot) {
      try {
        localStorage.setItem("grahai-cosmic-snapshot", JSON.stringify(cosmicSnapshot))
      } catch { /* ignore */ }
    }
  }, [cosmicSnapshot])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedBirth = localStorage.getItem("grahai-onboarding-birthdata")
      if (savedBirth) {
        const parsed = JSON.parse(savedBirth)
        if (parsed.date) setBirthData(parsed)
      }
      const savedSnap = localStorage.getItem("grahai-cosmic-snapshot")
      if (savedSnap) setCosmicSnapshot(JSON.parse(savedSnap))
    } catch { /* ignore */ }
  }, [])

  // Interactive demo typing effect
  useEffect(() => {
    if (!showSampleDemo) {
      setDemoTypingIndex(0)
      setDemoComplete(false)
      return
    }
    if (demoTypingIndex < DEMO_ANSWER_LINES.length) {
      const timer = setTimeout(() => {
        setDemoTypingIndex((i) => i + 1)
      }, 400)
      return () => clearTimeout(timer)
    } else {
      setDemoComplete(true)
    }
  }, [showSampleDemo, demoTypingIndex])

  async function fetchCosmicSnapshot() {
    setLoading(true)
    try {
      const response = await fetch("/api/cosmic-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: birthData.date }),
      })
      if (!response.ok) throw new Error("Failed")
      const data = await response.json()
      setCosmicSnapshot(data)
      setStep(4)
    } catch {
      // Fallback with approximate data if API fails
      setCosmicSnapshot({
        sunSign: "Calculating...",
        moonSign: "Calculating...",
        nakshatra: "Calculating...",
        nakshatraDeity: "",
        nakshatraShakti: "",
        lifeTheme: "Your unique journey awaits",
        element: "",
        transitVibe: "Auspicious energy today",
        rulingPlanet: "",
        lifePath: "",
      })
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleAuth() {
    setAuthLoading(true)
    try {
      localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(birthData))
      if (cosmicSnapshot) localStorage.setItem("grahai-cosmic-snapshot", JSON.stringify(cosmicSnapshot))
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/app`,
        },
      })
      if (error) throw error
    } catch {
      setAuthLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!authEmail.trim()) return
    setAuthLoading(true)
    try {
      localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(birthData))
      if (cosmicSnapshot) localStorage.setItem("grahai-cosmic-snapshot", JSON.stringify(cosmicSnapshot))
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/app`,
        },
      })
      if (error) throw error
      setAuthSent(true)
    } catch {
      // silently fail
    }
    setAuthLoading(false)
  }

  const canProceedBirth = birthData.date.trim().length > 0
  const suggestedQuestion = intent ? INTENT_FIRST_QUESTIONS[intent] : "What does my chart reveal about me?"

  // Initialize editable question when entering step 5
  useEffect(() => {
    if (step === 5 && !editableQuestion) {
      setEditableQuestion(suggestedQuestion)
    }
  }, [step, suggestedQuestion, editableQuestion])

  async function submitQuestion() {
    if (!editableQuestion.trim()) return
    setQuestionLoading(true)
    setAiResponse("")
    setQuestionSubmitted(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editableQuestion,
          birthData: birthData,
          intent: intent,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let fullText = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk
          setAiResponse(fullText)
        }
      }
    } catch (error) {
      setAiResponse("I encountered an issue retrieving your answer. Please try again.")
    } finally {
      setQuestionLoading(false)
    }
  }

  const stepProgress = step === 6 ? 100 : ((step - 1) / 5) * 100

  return (
    <main className="relative min-h-screen bg-[#050810]">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
          initial={{ width: "0%" }}
          animate={{ width: `${stepProgress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Back button */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={step > 1 ? () => setStep((step - 1) as Step) : onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="flex-1">
          <span className="text-xs text-white/40 font-medium">
            {step <= 5 ? `Step ${step} of 5` : "Create Account"}
          </span>
        </div>
        {step < 4 && (
          <button
            onClick={onBack}
            className="text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Background effects */}
      <div className="pointer-events-none fixed left-1/4 top-1/3 h-96 w-96 rounded-full bg-amber-400/[0.04] blur-[128px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-purple-400/[0.03] blur-[96px]" />

      <div className="relative z-10 mx-auto w-full max-w-lg px-4 pb-24">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════════════════
              STEP 1: INTENT SELECTION
              ═══════════════════════════════════════════ */}
          {step === 1 && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-8"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white">
                  What brings you here today?
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  Select your primary area of interest
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INTENTS.slice(0, 6).map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setIntent(item.id)
                      setStep(2)
                    }}
                    className={`rounded-2xl border p-4 text-center transition-all bg-gradient-to-br ${item.color} ${
                      intent === item.id
                        ? "border-amber-400/40 ring-1 ring-amber-400/20"
                        : `${item.border} hover:border-white/[0.15]`
                    }`}
                  >
                    <div className="mb-2 text-3xl">{item.icon}</div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-[10px] text-white/40 font-hindi mt-0.5">{item.hindi}</div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIntent("exploring")
                  setStep(2)
                }}
                className="mt-3 w-full rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 p-4 text-center transition-all hover:border-white/[0.15]"
              >
                <div className="mb-1 text-2xl">🔭</div>
                <div className="text-sm font-semibold text-white">Just Exploring</div>
                <div className="text-[10px] text-white/40 font-hindi">अन्वेषण</div>
              </motion.button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 2: TRUST FRAME
              ═══════════════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="trust"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-8"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white">
                  How GrahAI works
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  AI-powered, rooted in tradition
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: <MapPin className="w-5 h-5 text-amber-400" />,
                    title: "Personalized from your birth details",
                    desc: "Your exact date, time, and place of birth power every insight — nothing generic.",
                    bg: "from-amber-500/10 to-orange-500/5",
                  },
                  {
                    icon: <BookOpen className="w-5 h-5 text-purple-400" />,
                    title: "Rooted in classical Jyotish texts",
                    desc: "Every reading references Brihat Parashara Hora Shastra, Phaladeepika, and more.",
                    bg: "from-purple-500/10 to-indigo-500/5",
                  },
                  {
                    icon: <Zap className="w-5 h-5 text-emerald-400" />,
                    title: "Practical, not generic",
                    desc: "Get clear answers for career, love, money, and timing decisions you face today.",
                    bg: "from-emerald-500/10 to-teal-500/5",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    className={`flex gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${item.bg} p-5`}
                  >
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setStep(3)}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 3: BIRTH DETAILS
              ═══════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div
              key="birth"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-8"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white">Your birth details</h2>
                <p className="mt-2 text-sm text-white/50">
                  For accurate Vedic chart calculation
                </p>
              </div>

              <div className="space-y-4">
                {/* Date of Birth */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/60">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={birthData.date}
                    onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 [color-scheme:dark]"
                  />
                </div>

                {/* Time of Birth */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/60">
                    Time of Birth
                  </label>
                  <input
                    type="time"
                    value={birthData.time}
                    onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                    disabled={birthData.timeUnknown}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-30 [color-scheme:dark]"
                  />
                  <label className="mt-2.5 flex items-center gap-2.5 text-sm text-white/40 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      birthData.timeUnknown
                        ? "bg-amber-400/20 border-amber-400/40"
                        : "border-white/[0.15] bg-white/[0.03]"
                    }`}>
                      {birthData.timeUnknown && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={birthData.timeUnknown}
                      onChange={(e) =>
                        setBirthData({ ...birthData, timeUnknown: e.target.checked, time: "" })
                      }
                      className="sr-only"
                    />
                    I don&apos;t know my birth time
                  </label>
                  {birthData.timeUnknown && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 text-xs text-amber-400/70 flex items-center gap-1.5"
                    >
                      <Clock className="w-3 h-3" />
                      Approximate mode — timing precision will be reduced
                    </motion.p>
                  )}
                </div>

                {/* Place of Birth */}
                <LocationAutocomplete
                  value={birthData.place}
                  onChange={(text) => setBirthData({ ...birthData, place: text })}
                  onSelect={(loc: LocationSelection) =>
                    setBirthData({
                      ...birthData,
                      place: loc.displayLabel,
                      lat: loc.lat,
                      lng: loc.lng,
                      tz: loc.tz,
                    })
                  }
                  label="Place of Birth"
                  showIcon={true}
                  labelClassName="mb-2 block text-sm font-medium text-white/60"
                  inputClassName="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/25 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  placeholder="Start typing — e.g. Mumbai, Delhi"
                />
              </div>

              <button
                onClick={fetchCosmicSnapshot}
                disabled={!canProceedBirth || loading}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 disabled:opacity-40 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Reveal my chart
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 4: INSTANT REVEAL
              (Shown BEFORE account wall)
              ═══════════════════════════════════════════ */}
          {step === 4 && cosmicSnapshot && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-6"
            >
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Your Cosmic Profile</h2>
                <p className="mt-1.5 text-sm text-white/50">Here&apos;s what the stars reveal</p>
              </div>

              {/* Reveal Cards */}
              <div className="space-y-3">
                {[
                  {
                    icon: <Moon className="w-5 h-5 text-blue-300" />,
                    label: "Moon Sign (Rashi)",
                    value: cosmicSnapshot.moonSign,
                    sublabel: cosmicSnapshot.nakshatraDeity || "Your emotional core",
                    bg: "from-blue-500/10 to-indigo-500/5",
                    border: "border-blue-500/15",
                  },
                  {
                    icon: <Star className="w-5 h-5 text-amber-400" />,
                    label: "Nakshatra (Birth Star)",
                    value: cosmicSnapshot.nakshatra,
                    sublabel: cosmicSnapshot.nakshatraShakti || "Your cosmic DNA",
                    bg: "from-amber-500/10 to-orange-500/5",
                    border: "border-amber-500/15",
                  },
                  {
                    icon: <Sun className="w-5 h-5 text-orange-400" />,
                    label: "Dominant Life Theme",
                    value: cosmicSnapshot.lifeTheme,
                    sublabel: cosmicSnapshot.element || "Your life pattern",
                    bg: "from-orange-500/10 to-red-500/5",
                    border: "border-orange-500/15",
                  },
                  {
                    icon: <Eye className="w-5 h-5 text-emerald-400" />,
                    label: "Today's Insight",
                    value: cosmicSnapshot.transitVibe,
                    sublabel: cosmicSnapshot.rulingPlanet || "Current energy",
                    bg: "from-emerald-500/10 to-teal-500/5",
                    border: "border-emerald-500/15",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                    className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{item.icon}</div>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-wider text-white/40 font-medium">{item.label}</div>
                        <div className="mt-1 text-lg font-bold text-white">{item.value}</div>
                        <div className="text-xs text-white/50 mt-0.5">{item.sublabel}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Suggested First Question */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 rounded-2xl border border-amber-500/15 bg-amber-500/[0.05] p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-bold">Suggested First Question</span>
                </div>
                <p className="text-sm text-white/80 font-medium">{suggestedQuestion}</p>
              </motion.div>

              {/* CTA: Ask First Question or Sign Up */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 space-y-3"
              >
                <button
                  onClick={() => setStep(5)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
                >
                  Ask your first question
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  onClick={onComplete}
                  className="w-full text-center text-sm text-white/30 hover:text-white/50 transition-colors py-2"
                >
                  Continue without saving
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 5: FIRST QUESTION
              ═══════════════════════════════════════════ */}
          {step === 5 && (
            <motion.div
              key="firstQuestion"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-6"
            >
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <MessageSquare className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Your First Question</h2>
                <p className="mt-1.5 text-sm text-white/50">Ask about {intent} and get your answer</p>
              </div>

              {!questionSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Suggested Question Badge */}
                  <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.05] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-amber-400/60 font-bold mb-2">Suggested</p>
                    <p className="text-sm text-white/70">{suggestedQuestion}</p>
                  </div>

                  {/* Editable Question Input */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">
                      Or ask something else:
                    </label>
                    <textarea
                      value={editableQuestion}
                      onChange={(e) => setEditableQuestion(e.target.value)}
                      placeholder="Type your question..."
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/25 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={submitQuestion}
                    disabled={!editableQuestion.trim() || questionLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 disabled:opacity-40 active:scale-[0.98]"
                  >
                    {questionLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Get Your Answer
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Your Question */}
                  <div className="ml-4 mb-4 rounded-2xl rounded-tr-md bg-amber-400/10 border border-amber-400/20 px-4 py-3">
                    <p className="text-sm text-white font-medium">{editableQuestion}</p>
                  </div>

                  {/* AI Response */}
                  {questionLoading ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.02] px-4 py-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-bold">GrahAI</span>
                      </div>
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex gap-1"
                      >
                        <div className="w-2 h-2 bg-amber-400/50 rounded-full" />
                        <div className="w-2 h-2 bg-amber-400/50 rounded-full" />
                        <div className="w-2 h-2 bg-amber-400/50 rounded-full" />
                      </motion.div>
                    </motion.div>
                  ) : aiResponse ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.02] px-4 py-4 space-y-3 max-h-96 overflow-y-auto"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-bold">GrahAI</span>
                      </div>
                      {aiResponse.split("\n").map((line, idx) => {
                        if (!line.trim()) return <div key={idx} className="h-2" />
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <p key={idx} className="text-sm font-semibold text-amber-300/90">
                              {line.replace(/\*\*/g, "")}
                            </p>
                          )
                        }
                        return (
                          <p key={idx} className="text-sm text-white/70 leading-relaxed">
                            {line}
                          </p>
                        )
                      })}
                    </motion.div>
                  ) : null}

                  {/* Footer Actions - After Response Finishes */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 space-y-3"
                  >
                    <button
                      onClick={() => {
                        setQuestionSubmitted(false)
                        setAiResponse("")
                        setEditableQuestion("")
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-6 py-3.5 font-semibold text-white transition-all hover:border-amber-400/30 hover:bg-white/[0.1]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Ask a follow-up question
                    </button>
                    <button
                      onClick={() => setStep(6)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
                    >
                      Save chart & sign up
                      <Lock className="w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 6: SOFT ACCOUNT CREATION
              ═══════════════════════════════════════════ */}
          {step === 6 && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-8"
            >
              <div className="mb-8 text-center">
                <Lock className="mx-auto mb-4 h-10 w-10 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  Save your chart, keep your readings, get unlimited questions
                </p>
              </div>

              {authSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8"
                >
                  <div className="mx-auto mb-4 inline-flex rounded-full bg-emerald-400/20 p-4">
                    <Check className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Check your email</h3>
                  <p className="text-sm text-white/50">
                    We sent a magic link to{" "}
                    <span className="font-medium text-amber-400">{authEmail}</span>.
                    Click it to sign in.
                  </p>
                  <button
                    onClick={() => setAuthSent(false)}
                    className="mt-6 text-sm text-amber-400/70 transition-colors hover:text-amber-400"
                  >
                    Use a different email
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {/* Google */}
                  <button
                    onClick={handleGoogleAuth}
                    disabled={authLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] py-3.5 text-sm font-medium text-white transition-all hover:border-amber-400/30 hover:bg-white/[0.1] disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 my-4">
                    <div className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-xs text-white/30">or</span>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>

                  {/* Magic Link */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleMagicLink() }}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 text-white placeholder:text-white/25 transition-all focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  <button
                    onClick={handleMagicLink}
                    disabled={!authEmail.trim() || authLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 disabled:opacity-40 active:scale-[0.98]"
                  >
                    {authLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Magic Link
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={onComplete}
                    className="w-full text-center text-sm text-white/30 hover:text-white/50 transition-colors py-2 mt-2"
                  >
                    Maybe later
                  </button>
                </div>
              )}

              {/* What you get */}
              <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-white/30">
                <span>✓ 3 daily AI readings</span>
                <span>✓ Free Kundli</span>
                <span>✓ Daily Horoscope</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════
          INTERACTIVE SAMPLE DEMO MODAL
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {showSampleDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSampleDemo(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-white/[0.08] bg-[#0a0e1a] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Demo header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Interactive Preview</p>
                  <p className="text-sm font-semibold text-white">See how GrahAI works</p>
                </div>
              </div>

              {/* User profile badge */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Moon className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-xs text-white/50">
                  {DEMO_BIRTH.sign} Moon • {DEMO_BIRTH.nakshatra} Nakshatra
                </span>
              </div>

              {/* User question bubble */}
              <div className="ml-8 mb-4 rounded-2xl rounded-tr-md bg-amber-400/10 border border-amber-400/20 px-4 py-3">
                <p className="text-sm text-white font-medium">{DEMO_QUESTION}</p>
              </div>

              {/* AI answer — typing animation */}
              <div className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.02] px-4 py-4 mr-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-bold">GrahAI</span>
                </div>
                <div className="space-y-1">
                  {DEMO_ANSWER_LINES.slice(0, demoTypingIndex).map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-sm leading-relaxed ${
                        line.startsWith("**") ? "text-amber-300/90 font-semibold" : "text-white/70"
                      }`}
                    >
                      {line.replace(/\*\*/g, "")}
                    </motion.p>
                  ))}
                  {!demoComplete && (
                    <motion.span
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="inline-block w-2 h-4 bg-amber-400/50 rounded-sm"
                    />
                  )}
                </div>
              </div>

              {/* CTA after demo completes */}
              <AnimatePresence>
                {demoComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-3"
                  >
                    <p className="text-center text-xs text-white/40 mb-3">
                      This is a real example. Get answers personalized to YOUR chart.
                    </p>
                    <button
                      onClick={() => {
                        setShowSampleDemo(false)
                        setStep(1)
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
                    >
                      Get my first insight
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowSampleDemo(false)}
                      className="w-full text-center text-sm text-white/30 hover:text-white/50 transition-colors py-1"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
