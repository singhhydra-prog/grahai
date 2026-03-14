"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Sparkles, MapPin, Clock, Calendar } from "lucide-react"
import SplineScene from "@/components/ui/SplineScene"
import type { BirthData } from "@/types/app"

interface OnboardingFlowProps {
  onComplete: (data: BirthData) => void
}

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "name", title: "Your Name" },
  { id: "birth", title: "Birth Details" },
]

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BirthData>({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canProceed = useCallback(() => {
    if (step === 0) return true
    if (step === 1) return form.name.trim().length >= 2
    if (step === 2) return form.dateOfBirth && form.timeOfBirth && form.placeOfBirth.trim()
    return false
  }, [step, form])

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      return
    }
    // Final step — save and complete
    setIsSubmitting(true)
    try {
      localStorage.setItem("grahai-onboarding-birthdata", JSON.stringify(form))
      localStorage.setItem("userNameForGreeting", form.name.split(" ")[0])

      // Generate cosmic snapshot
      const res = await fetch("/api/cosmic-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const snapshot = await res.json()
        localStorage.setItem("grahai-cosmic-snapshot", JSON.stringify(snapshot))
      }
    } catch {}
    setIsSubmitting(false)
    onComplete(form)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const updateField = (key: keyof BirthData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col">
      {/* ═══ Progress Bar ═══ */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-gradient-to-r from-magenta to-violet" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ═══ Back Button ═══ */}
      {step > 0 && (
        <button
          onClick={handleBack}
          className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full glass-card
            flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-text-dim" />
        </button>
      )}

      {/* ═══ Step Content ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-sm"
            >
              {/* Cosmic Orb */}
              <div className="w-48 h-48 mx-auto mb-8">
                <SplineScene sceneUrl="" className="w-full h-full" />
              </div>

              <h1 className="text-3xl font-bold text-text mb-3">
                Welcome to{" "}
                <span className="cosmic-gradient-text">GrahAI</span>
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed mb-2">
                Your AI-powered Vedic astrology companion.
                Personalized insights based on your unique birth chart.
              </p>
              <p className="text-xs text-text-dim">
                We combine ancient Jyotish wisdom with modern AI to give you
                the most accurate readings possible.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full max-w-sm"
            >
              <Sparkles className="w-10 h-10 text-magenta mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">What&apos;s your name?</h2>
              <p className="text-sm text-text-dim mb-8">
                So we can personalize your cosmic journey
              </p>

              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                autoFocus
                className="w-full bg-bg-input border border-border rounded-xl px-4 py-3.5
                  text-text text-center text-lg placeholder:text-text-dim/50
                  focus:border-magenta/50 focus:outline-none transition-colors"
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="birth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text mb-2">Birth Details</h2>
                <p className="text-sm text-text-dim">
                  Accurate birth details = accurate predictions
                </p>
              </div>

              <div className="space-y-4">
                {/* Date of Birth */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3
                      text-text placeholder:text-text-dim/50
                      focus:border-magenta/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* Time of Birth */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Time of Birth
                  </label>
                  <input
                    type="time"
                    value={form.timeOfBirth}
                    onChange={(e) => updateField("timeOfBirth", e.target.value)}
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3
                      text-text placeholder:text-text-dim/50
                      focus:border-magenta/50 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-text-dim/60 mt-1">
                    Don&apos;t know exact time? Enter approximate — we&apos;ll adjust
                  </p>
                </div>

                {/* Place of Birth */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    value={form.placeOfBirth}
                    onChange={(e) => updateField("placeOfBirth", e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3
                      text-text placeholder:text-text-dim/50
                      focus:border-magenta/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Bottom CTA ═══ */}
      <div className="px-6 pb-8 pt-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2
            transition-all ${
            canProceed() && !isSubmitting
              ? "btn-primary"
              : "bg-bg-elevated text-text-dim cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : step === STEPS.length - 1 ? (
            <>
              <Sparkles className="w-4 h-4" />
              Generate My Chart
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
