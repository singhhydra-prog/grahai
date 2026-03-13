"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Zap,
  BookOpen,
  MessageSquare,
  Save,
  Lock,
  Mail,
  Loader2,
} from "lucide-react"
import LocationAutocomplete, { type LocationSelection } from "@/components/LocationAutocomplete"

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

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

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const INTENTS = [
  { id: "career", label: "Career", hindi: "करियर", icon: "💼" },
  { id: "love", label: "Love", hindi: "प्रेम", icon: "❤️" },
  { id: "marriage", label: "Marriage", hindi: "विवाह", icon: "💍" },
  { id: "health", label: "Health", hindi: "स्वास्थ्य", icon: "🧘" },
  { id: "money", label: "Money", hindi: "धन", icon: "💰" },
  { id: "daily", label: "Daily Guidance", hindi: "दैनिक", icon: "🌅" },
  { id: "exploring", label: "Just Exploring", hindi: "अन्वेषण", icon: "🔭" },
]

const INTENT_PROMPTS: Record<string, string[]> = {
  career: [
    "Should I switch jobs soon?",
    "Why am I feeling blocked right now?",
    "What should I focus on this month?",
  ],
  love: [
    "Why has my relationship felt unstable?",
    "Is this the right time to reconnect?",
    "What pattern repeats in my love life?",
  ],
  marriage: [
    "When is the right time to marry?",
    "Is this the right person for me?",
    "What's blocking my marriage?",
  ],
  health: [
    "Why do I feel so drained lately?",
    "What lifestyle changes suit my chart?",
    "How can I improve my energy?",
  ],
  money: [
    "Why is money not flowing freely?",
    "When will my financial situation improve?",
    "Should I invest now?",
  ],
  daily: [
    "What should I focus on today?",
    "What energy does today carry?",
    "What should I avoid today?",
  ],
  exploring: [
    "What does my chart say about me?",
    "What's my biggest strength?",
    "What life patterns should I know about?",
  ],
}

const SAMPLE_ANSWER = `Your chart reveals interesting patterns around career transitions. Saturn's current transit suggests this is actually an auspicious time for strategic moves, but with caution—avoid impulsive decisions made in anger or frustration.

Your 10th house (career) shows strong Rahu influence, which amplifies ambition but can scatter focus. The remedy: meditate on clarity before major decisions. Mercury aspects your career zone favorably next month.`

const FOLLOW_UP_PROMPTS = [
  "Why now?",
  "Tell me more",
  "What happens next?",
  "How serious is this?",
  "What remedy helps?",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [intent, setIntent] = useState<string | null>(null)
  const [birthData, setBirthData] = useState<BirthData>({
    date: "",
    time: "",
    place: "",
    timeUnknown: false,
  })
  const [cosmicSnapshot, setCosmicSnapshot] = useState<CosmicSnapshot | null>(
    null
  )
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSampleModal, setShowSampleModal] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [followUpCount, setFollowUpCount] = useState(0)
  const [authEmail, setAuthEmail] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  async function fetchCosmicSnapshot() {
    setLoading(true)
    try {
      const response = await fetch("/api/cosmic-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate: birthData.date }),
      })

      if (!response.ok) throw new Error("Failed to fetch cosmic snapshot")

      const data = await response.json()
      setCosmicSnapshot(data)
      setStep(6)
    } catch (error) {
      console.error("Error fetching cosmic snapshot:", error)
      alert("Failed to reveal your chart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function sendQuestion(question: string) {
    if (!question.trim() || !cosmicSnapshot) return

    const newMessage: ChatMessage = { role: "user", content: question }
    setChatMessages((prev) => [...prev, newMessage])
    setCurrentQuestion("")
    setStreaming(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          vertical: "general",
          user_id: "anonymous-onboarding",
          birthData,
        }),
      })

      if (!response.ok) throw new Error("Chat request failed")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          fullResponse += chunk

          setChatMessages((prev) => {
            const updated = [...prev]
            if (updated[updated.length - 1].role === "assistant") {
              updated[updated.length - 1].content = fullResponse
            } else {
              updated.push({ role: "assistant", content: fullResponse })
            }
            return updated
          })
        }
      }

      setFollowUpCount((prev) => prev + 1)
      if (step === 7) setStep(8)
    } catch (error) {
      console.error("Error sending question:", error)
      alert("Failed to get answer. Please try again.")
    } finally {
      setStreaming(false)
    }
  }

  async function handleAuthEmail() {
    if (!authEmail.trim()) return
    setAuthLoading(true)

    try {
      // Save birth data to localStorage before magic link call
      localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(birthData))

      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail,
        options: { shouldCreateUser: true },
      })

      if (error) throw error

      alert("Magic link sent! Check your email to verify.")
      setStep(10)
    } catch (error) {
      console.error("Auth error:", error)
      alert("Failed to send magic link. Please try again.")
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleGoogleAuth() {
    setAuthLoading(true)
    try {
      // Save birth data to localStorage before OAuth call
      localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(birthData))

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Google auth error:", error)
      alert("Google sign-in failed. Please try again.")
      setAuthLoading(false)
    }
  }

  async function skipAuth() {
    // Save birth data to localStorage so it's not lost
    localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(birthData))
    router.push("/kundli")  // Send to kundli page instead of /app (which requires auth)
  }

  const canProceedStep5 = birthData.date.trim().length > 0
  const suggestedQuestions = intent ? INTENT_PROMPTS[intent] || [] : []

  return (
    <main className="relative min-h-screen bg-deep-space px-4 py-8 sm:px-6">
      {/* Background effects */}
      <div className="pointer-events-none fixed left-1/4 top-1/3 h-96 w-96 rounded-full bg-indigo/15 blur-[128px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-saffron/8 blur-[96px]" />

      {/* Progress bar for all steps */}
      {step >= 1 && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-cosmic-white/5">
          <motion.div
            className="h-full bg-saffron"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 10) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-lg">
        {/* STEP 1: SPLASH */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex min-h-screen items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-6 inline-flex items-center gap-3"
                >
                  <Sparkles className="h-10 w-10 text-saffron" />
                  <h1 className="text-4xl font-bold text-cosmic-white">
                    Grah<span className="text-saffron">AI</span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg text-cosmic-white/60"
                >
                  Clarity, grounded in your chart.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  onAnimationComplete={() => setStep(2)}
                  className="absolute inset-0"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: WELCOME */}
          {step === 2 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-20"
            >
              <div className="mb-8 text-center">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-saffron" />
                <h2 className="text-2xl font-bold text-cosmic-white">
                  Get clarity in 30 seconds
                </h2>
                <p className="mt-3 text-cosmic-white/60">
                  Ask a real-life question. GrahAI reads your birth chart and
                  explains the answer.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setStep(3)}
                  className="w-full rounded-xl bg-saffron px-6 py-3 font-semibold text-deep-space transition-all hover:bg-gold-light"
                >
                  Get my first insight
                </button>
                <button
                  onClick={() => setShowSampleModal(true)}
                  className="w-full rounded-xl border border-indigo/30 px-6 py-3 font-semibold text-cosmic-white transition-all hover:border-indigo/50"
                >
                  See sample answer
                </button>
              </div>

              {showSampleModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                  onClick={() => setShowSampleModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md rounded-2xl border border-indigo/30 bg-navy-light p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="mb-4 text-lg font-semibold text-cosmic-white">
                      Sample Answer: Career Question
                    </h3>
                    <p className="whitespace-pre-wrap text-sm text-cosmic-white/70">
                      {SAMPLE_ANSWER}
                    </p>
                    <button
                      onClick={() => setShowSampleModal(false)}
                      className="mt-6 w-full rounded-xl bg-saffron px-4 py-2 font-semibold text-deep-space"
                    >
                      Close
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3: INTENT SELECTION */}
          {step === 3 && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-cosmic-white">
                  What brings you here today?
                </h2>
                <p className="mt-2 text-cosmic-white/60">
                  Select your primary interest
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {INTENTS.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIntent(item.id)
                      setStep(4)
                    }}
                    className={`rounded-xl border p-4 text-center transition-all ${
                      intent === item.id
                        ? "border-saffron/50 bg-saffron/10"
                        : "border-indigo/30 hover:border-indigo/50"
                    }`}
                  >
                    <div className="mb-2 text-3xl">{item.icon}</div>
                    <div className="text-sm font-semibold text-cosmic-white">
                      {item.label}
                    </div>
                    <div className="text-xs text-cosmic-white/40">{item.hindi}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIntent("exploring")
                  setStep(4)
                }}
                className="mt-4 w-full rounded-xl border border-indigo/30 p-4 text-center transition-all hover:border-indigo/50"
              >
                <div className="mb-2 text-3xl">{INTENTS[6].icon}</div>
                <div className="text-sm font-semibold text-cosmic-white">
                  {INTENTS[6].label}
                </div>
                <div className="text-xs text-cosmic-white/40">{INTENTS[6].hindi}</div>
              </button>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex flex-1 items-center justify-center gap-1.5 text-cosmic-white/40 hover:text-cosmic-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: HOW IT WORKS */}
          {step === 4 && (
            <motion.div
              key="how-it-works"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-cosmic-white">
                  How it works
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: "Personalized",
                    desc: "From your exact date, time, and place of birth",
                  },
                  {
                    icon: Zap,
                    title: "Practical",
                    desc: "For real-life decisions, not generic horoscopes",
                  },
                  {
                    icon: BookOpen,
                    title: "Source-backed",
                    desc: "With classical text references you can verify",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 rounded-xl border border-indigo/30 bg-navy-light/30 p-4"
                  >
                    <item.icon className="h-6 w-6 flex-shrink-0 text-saffron" />
                    <div>
                      <h3 className="font-semibold text-cosmic-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-cosmic-white/60">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex gap-2">
                <button
                  onClick={() => setStep(3)}
                  className="flex flex-1 items-center justify-center gap-1.5 text-cosmic-white/40 hover:text-cosmic-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-saffron px-4 py-2.5 font-semibold text-deep-space hover:bg-gold-light"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: BIRTH DETAILS */}
          {step === 5 && (
            <motion.div
              key="birth-details"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-cosmic-white">
                  Your birth details
                </h2>
                <p className="mt-2 text-cosmic-white/60">
                  For accurate chart calculation
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-cosmic-white/60">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={birthData.date}
                    onChange={(e) =>
                      setBirthData({ ...birthData, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 py-2.5 text-cosmic-white focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20 [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-cosmic-white/60">
                    Time of Birth
                  </label>
                  <input
                    type="time"
                    value={birthData.time}
                    onChange={(e) =>
                      setBirthData({ ...birthData, time: e.target.value })
                    }
                    disabled={birthData.timeUnknown}
                    className="w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 py-2.5 text-cosmic-white focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20 disabled:opacity-30 [color-scheme:dark]"
                  />
                  <label className="mt-2 flex items-center gap-2 text-sm text-cosmic-white/40">
                    <input
                      type="checkbox"
                      checked={birthData.timeUnknown}
                      onChange={(e) =>
                        setBirthData({
                          ...birthData,
                          timeUnknown: e.target.checked,
                          time: "",
                        })
                      }
                      className="rounded border-indigo/30"
                    />
                    I don't know my birth time
                  </label>
                  {birthData.timeUnknown && (
                    <p className="mt-2 text-xs text-saffron/70">
                      Approximate Mode — readings will be less precise
                    </p>
                  )}
                </div>

                <LocationAutocomplete
                  value={birthData.place}
                  onChange={(text) =>
                    setBirthData({ ...birthData, place: text })
                  }
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
                  labelClassName="mb-2 block text-sm font-medium text-cosmic-white/60"
                  inputClassName="w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 py-2.5 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                  placeholder="Start typing — e.g. Mumbai, Delhi"
                />
              </div>

              <div className="mt-8 flex gap-2">
                <button
                  onClick={() => setStep(4)}
                  className="flex flex-1 items-center justify-center gap-1.5 text-cosmic-white/40 hover:text-cosmic-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={fetchCosmicSnapshot}
                  disabled={!canProceedStep5 || loading}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-saffron px-4 py-2.5 font-semibold text-deep-space hover:bg-gold-light disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Reveal my chart
                      <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: INSTANT REVEAL */}
          {step === 6 && cosmicSnapshot && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-cosmic-white">
                  Your cosmic profile
                </h2>
                <p className="mt-2 text-cosmic-white/60">Instant insights</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Moon Sign",
                    value: cosmicSnapshot.moonSign,
                    sublabel: cosmicSnapshot.nakshatraDeity,
                  },
                  {
                    label: "Nakshatra",
                    value: cosmicSnapshot.nakshatra,
                    sublabel: cosmicSnapshot.nakshatraShakti,
                  },
                  {
                    label: "Life Theme",
                    value: cosmicSnapshot.lifeTheme,
                    sublabel: cosmicSnapshot.element,
                  },
                  {
                    label: "Today's Vibe",
                    value: cosmicSnapshot.transitVibe,
                    sublabel: cosmicSnapshot.rulingPlanet,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-indigo/30 bg-navy-light/30 p-4"
                  >
                    <div className="text-xs text-cosmic-white/40">{item.label}</div>
                    <div className="mt-1 text-lg font-semibold text-saffron">
                      {item.value}
                    </div>
                    <div className="text-xs text-cosmic-white/50">
                      {item.sublabel}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-indigo/30 bg-navy-light/30 p-4">
                <div className="text-xs text-cosmic-white/40">
                  Suggested first question
                </div>
                <div className="mt-1 text-sm text-cosmic-white">
                  {suggestedQuestions[0] || "What does my chart reveal about me?"}
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                <button
                  onClick={() => setStep(7)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-saffron px-4 py-2.5 font-semibold text-deep-space hover:bg-gold-light"
                >
                  Ask my first question
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setStep(10)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-indigo/30 px-4 py-2.5 font-semibold text-cosmic-white hover:border-indigo/50"
                >
                  <Save className="h-4 w-4" />
                  Save chart
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: FIRST QUESTION */}
          {step === 7 && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-cosmic-white">
                  What's your question?
                </h2>
                <p className="mt-2 text-cosmic-white/60">
                  Tap a suggestion or ask your own
                </p>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendQuestion(q)}
                    disabled={streaming}
                    className="rounded-full border border-indigo/30 bg-navy-light/30 px-3 py-1.5 text-xs font-medium text-cosmic-white transition-all hover:border-indigo/50 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !streaming) {
                      sendQuestion(currentQuestion)
                    }
                  }}
                  placeholder="Or type your own question..."
                  disabled={streaming}
                  className="w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 py-2.5 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20 disabled:opacity-50"
                />
                <button
                  onClick={() => sendQuestion(currentQuestion)}
                  disabled={!currentQuestion.trim() || streaming}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-saffron px-3 py-1.5 font-semibold text-deep-space hover:bg-gold-light disabled:opacity-50"
                >
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setStep(6)}
                  className="flex flex-1 items-center justify-center gap-1.5 text-cosmic-white/40 hover:text-cosmic-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 8: ANSWER DELIVERY */}
          {step === 8 && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-cosmic-white">
                  GrahAI's answer
                </h2>
              </div>

              <div className="mb-6 max-h-96 space-y-3 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "ml-8 bg-saffron/10 text-cosmic-white"
                        : "mr-0 border border-indigo/30 text-cosmic-white/70"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {!streaming && chatMessages.length > 1 && (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {FOLLOW_UP_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendQuestion(prompt)}
                        disabled={streaming}
                        className="rounded-full border border-indigo/30 bg-navy-light/30 px-3 py-1.5 text-xs font-medium text-cosmic-white transition-all hover:border-indigo/50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {followUpCount >= 2 && (
                    <div className="mb-4 rounded-xl border border-indigo/30 bg-navy-light/30 p-4 text-sm text-cosmic-white/70">
                      Create a free account to save your insights and get daily
                      guidance.
                    </div>
                  )}
                </>
              )}

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setStep(7)}
                  className="flex flex-1 items-center justify-center gap-1.5 text-cosmic-white/40 hover:text-cosmic-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                {followUpCount >= 2 && (
                  <button
                    onClick={() => setStep(10)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-saffron px-4 py-2.5 font-semibold text-deep-space hover:bg-gold-light"
                  >
                    Save & sign up
                    <Lock className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 10: SOFT ACCOUNT CREATION */}
          {step === 10 && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <div className="mb-8 text-center">
                <Lock className="mx-auto mb-4 h-12 w-12 text-saffron" />
                <h2 className="text-2xl font-bold text-cosmic-white">
                  Save your cosmic profile
                </h2>
                <p className="mt-2 text-cosmic-white/60">
                  Keep your chart forever and get daily guidance
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoogleAuth}
                  disabled={authLoading}
                  className="w-full rounded-xl border border-indigo/30 bg-navy-light/30 px-4 py-3 font-semibold text-cosmic-white transition-all hover:border-indigo/50 disabled:opacity-50"
                >
                  {authLoading ? (
                    <Loader2 className="inline h-4 w-4 animate-spin" />
                  ) : (
                    "Continue with Google"
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="h-4 w-4 text-cosmic-white/40" />
                  </div>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !authLoading) {
                        handleAuthEmail()
                      }
                    }}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-indigo/30 bg-deep-space/50 py-3 pl-12 pr-4 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                  />
                  <button
                    onClick={handleAuthEmail}
                    disabled={!authEmail.trim() || authLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-saffron px-3 py-1.5 font-semibold text-deep-space hover:bg-gold-light disabled:opacity-50"
                  >
                    {authLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send link"
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={skipAuth}
                  className="w-full rounded-xl text-cosmic-white/40 hover:text-cosmic-white"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots for steps 2-10 */}
        {step >= 2 && step <= 10 && (
          <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => {
              const dotStep = (i + 2) as Step
              return (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    dotStep <= step ? "w-6 bg-saffron" : "w-2 bg-indigo/30"
                  }`}
                />
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
