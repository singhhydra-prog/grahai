"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ArrowRight, Sparkles, Loader2, MessageCircle, Star, Heart, Briefcase, Home, Coins, Brain } from "lucide-react"
import Link from "next/link"

/* ─── Category quick-picks ─── */
const CATEGORIES = [
  { icon: Heart, label: "Love", emoji: "💕", question: "What does my chart say about my love life this year?" },
  { icon: Briefcase, label: "Career", emoji: "💼", question: "When will I see career growth or a promotion?" },
  { icon: Coins, label: "Money", emoji: "💰", question: "What planetary period is best for investments?" },
  { icon: Brain, label: "Health", emoji: "🧘", question: "Which planets affect my health and how to strengthen them?" },
  { icon: Home, label: "Family", emoji: "🏠", question: "How will family relationships evolve this year?" },
  { icon: Star, label: "Spiritual", emoji: "🕉️", question: "What is my dharmic purpose based on my birth chart?" },
]

/* ─── Quick AI response generator (client-side teaser) ─── */
async function getQuickAnswer(question: string, birthDate: string): Promise<{
  answer: string
  verse: string
  verseSource: string
  cta: string
}> {
  const res = await fetch("/api/ask-one-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, birthDate }),
  })
  if (!res.ok) throw new Error("Failed to get answer")
  return res.json()
}

export default function AskOneQuestion() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [step, setStep] = useState<"input" | "loading" | "result">("input")
  const [question, setQuestion] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [result, setResult] = useState<{
    answer: string; verse: string; verseSource: string; cta: string
  } | null>(null)

  const handleSubmit = async () => {
    if (!question.trim() || !birthDate) return
    setStep("loading")
    try {
      const data = await getQuickAnswer(question, birthDate)
      setResult(data)
      setStep("result")
    } catch {
      setStep("input")
    }
  }

  const handleCategoryClick = (idx: number) => {
    setSelectedCat(idx)
    setQuestion(CATEGORIES[idx].question)
  }

  const handleReset = () => {
    setStep("input")
    setQuestion("")
    setBirthDate("")
    setSelectedCat(null)
    setResult(null)
  }

  return (
    <section id="ask-one" className="relative py-28 lg:py-36">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-gold/60" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold/50">
              3-Click Clarity
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Ask One Question.{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-gold bg-clip-text text-transparent">
              Get Instant Guidance.
            </span>
          </h2>
          <p className="text-text-dim/60 text-sm max-w-lg mx-auto">
            No signup needed. Pick your concern, enter your birth date, and receive
            personalized Vedic wisdom in seconds.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.label}
                    onClick={() => handleCategoryClick(i)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                      selectedCat === i
                        ? "bg-gold/15 border-gold/40 text-gold"
                        : "bg-white/[0.03] border-white/[0.06] text-text-dim/60 hover:bg-white/[0.06] hover:border-white/10"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Question input */}
              <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
                <label className="block text-xs font-medium text-text-dim/50 mb-2">
                  Your question
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What do the stars reveal about my career this year?"
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim/30 focus:outline-none focus:border-gold/30 resize-none transition-colors"
                />

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-text-dim/50 mb-2">
                      Birth date
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/30 transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSubmit}
                      disabled={!question.trim() || !birthDate}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-gold to-amber-500 text-black hover:from-amber-400 hover:to-gold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4" />
                      Ask the Stars
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-text-dim/30 mt-3">
                Powered by Swiss Ephemeris calculations + Vedic wisdom engine
              </p>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-12 border border-white/[0.06] text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-6">
                <Loader2 className="w-16 h-16 text-gold/40 animate-spin" />
                <Sparkles className="w-6 h-6 text-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm text-text-dim/60">
                Consulting the Vedic scriptures...
              </p>
              <p className="text-[10px] text-text-dim/30 mt-2">
                Analyzing your chart against 50,000+ verses
              </p>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden">
                {/* Answer */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-xs font-medium text-gold/70">Your Cosmic Insight</span>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {result.answer}
                  </p>
                </div>

                {/* Blurred verse teaser */}
                <div className="relative border-t border-white/[0.04] bg-white/[0.02] p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-purple-400/70">
                      Classical Verse Reference
                    </span>
                  </div>
                  <p className="text-sm text-white/40 font-hindi blur-[3px] select-none mb-1">
                    {result.verse}
                  </p>
                  <p className="text-[10px] text-text-dim/30 blur-[2px] select-none">
                    — {result.verseSource}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                    <Link
                      href="/chat"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white text-xs font-semibold hover:from-purple-500 hover:to-blue-500 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Unlock Full Reading + Classical Sources
                    </Link>
                  </div>
                </div>

                {/* CTA row */}
                <div className="p-4 border-t border-white/[0.04] flex items-center justify-between">
                  <button
                    onClick={handleReset}
                    className="text-xs text-text-dim/40 hover:text-text-dim/60 transition-colors"
                  >
                    Ask another question
                  </button>
                  <Link
                    href="/chat"
                    className="flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
                  >
                    Get Full Reading
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* Re-export Lock since it's used in this component */
import { Lock } from "lucide-react"
