"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Clock,
  Star,
  Loader2,
  Check,
} from "lucide-react"
import { zodiacSigns } from "@/lib/brand"
import AppHeader from "@/components/AppHeader"

type Step = 1 | 2 | 3 | 4

interface FormData {
  full_name: string
  display_name: string
  birth_date: string
  birth_time: string
  birth_time_unknown: boolean
  birth_city: string
  birth_state: string
  birth_country: string
  gender: string
  interests: string[]
  preferred_language: string
}

const INTERESTS = [
  { id: "astrology", label: "Vedic Astrology", labelHi: "ज्योतिष", icon: "♈" },
  { id: "numerology", label: "Numerology", labelHi: "अंकशास्त्र", icon: "🔢" },
  { id: "tarot", label: "Tarot", labelHi: "टैरो", icon: "🃏" },
  { id: "vastu", label: "Vastu Shastra", labelHi: "वास्तु", icon: "🏠" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    full_name: "",
    display_name: "",
    birth_date: "",
    birth_time: "",
    birth_time_unknown: false,
    birth_city: "",
    birth_state: "",
    birth_country: "India",
    gender: "",
    interests: [],
    preferred_language: "en",
  })

  // Pre-fill from auth user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
      if (user?.user_metadata) {
        setForm((f) => ({
          ...f,
          full_name: user.user_metadata.full_name || user.user_metadata.name || "",
          display_name: user.user_metadata.name?.split(" ")[0] || "",
        }))
      }
    })
  }, [])

  function updateForm(updates: Partial<FormData>) {
    setForm((f) => ({ ...f, ...updates }))
  }

  function toggleInterest(id: string) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter((i) => i !== id)
        : [...f.interests, id],
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Upsert user profile
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: form.full_name,
        display_name: form.display_name || form.full_name.split(" ")[0],
        birth_date: form.birth_date || null,
        birth_time: form.birth_time_unknown ? null : form.birth_time || null,
        birth_city: form.birth_city || null,
        birth_state: form.birth_state || null,
        birth_country: form.birth_country || null,
        gender: form.gender || null,
        preferred_language: form.preferred_language,
        interests: form.interests,
        onboarding_completed: true,
        subscription_tier: "free",
      })

      if (error) throw error

      // Initialize gamification — create user_stats + unlock "New Seeker"
      try {
        await supabase.from("user_stats").upsert({
          user_id: user.id,
          current_level: 1,
          total_xp: 0,
          xp_to_next_level: 100,
          daily_streak: 0,
          longest_streak: 0,
          last_activity_date: new Date().toISOString().split("T")[0],
          readings_total: 0,
          readings_astrology: 0,
          readings_numerology: 0,
          readings_tarot: 0,
          readings_vastu: 0,
        })

        const { data: achievement } = await supabase
          .from("achievements")
          .select("id")
          .eq("slug", "new_seeker")
          .single()

        if (achievement) {
          await supabase.from("user_achievements").upsert({
            user_id: user.id,
            achievement_id: achievement.id,
            unlocked_at: new Date().toISOString(),
          })
        }
      } catch {
        // Gamification init failure shouldn't block onboarding
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Onboarding error:", err)
      setLoading(false)
    }
  }

  const canProceed: Record<Step, boolean> = {
    1: form.full_name.trim().length > 0,
    2: true, // Birth details are optional
    3: form.interests.length > 0,
    4: true,
  }

  const stepLabels = ["Profile", "Birth Details", "Interests", "Ready"]

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-deep-space px-6 py-16">
      <AppHeader />
      {/* Background */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-indigo/15 blur-[128px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-saffron/8 blur-[96px]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-saffron" />
            <span className="text-lg font-bold text-cosmic-white">
              Grah<span className="text-saffron">AI</span>
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  s < step
                    ? "bg-saffron text-deep-space"
                    : s === step
                      ? "border-2 border-saffron bg-saffron/10 text-saffron"
                      : "border border-indigo/30 text-cosmic-white/30"
                }`}
              >
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`h-0.5 w-8 rounded transition-colors ${
                    s < step ? "bg-saffron" : "bg-indigo/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="mb-6 text-center text-xs text-cosmic-white/40">
          Step {step} of 4 — {stepLabels[step - 1]}
        </p>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-indigo/30 bg-navy-light/50 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* STEP 1: Profile */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 inline-flex rounded-full bg-saffron/10 p-3">
                      <User className="h-6 w-6 text-saffron" />
                    </div>
                    <h2 className="text-lg font-semibold text-cosmic-white">
                      Tell us about yourself
                    </h2>
                    <p className="mt-1 text-sm text-cosmic-white/40">
                      We&apos;ll personalize your readings
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-cosmic-white/60">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={(e) => updateForm({ full_name: e.target.value })}
                      placeholder="Your full name"
                      className="h-12 w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-cosmic-white/60">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={form.display_name}
                      onChange={(e) => updateForm({ display_name: e.target.value })}
                      placeholder="How should we address you?"
                      className="h-12 w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-cosmic-white/60">
                      Gender
                    </label>
                    <div className="flex gap-3">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => updateForm({ gender: g.toLowerCase() })}
                          className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                            form.gender === g.toLowerCase()
                              ? "border-saffron/50 bg-saffron/10 text-saffron"
                              : "border-indigo/30 text-cosmic-white/40 hover:border-indigo/50"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Birth Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 inline-flex rounded-full bg-saffron/10 p-3">
                      <Calendar className="h-6 w-6 text-saffron" />
                    </div>
                    <h2 className="text-lg font-semibold text-cosmic-white">
                      Birth Details
                    </h2>
                    <p className="mt-1 text-sm text-cosmic-white/40">
                      For accurate Kundli calculation (optional)
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cosmic-white/60">
                      <Calendar className="h-3.5 w-3.5" /> Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.birth_date}
                      onChange={(e) => updateForm({ birth_date: e.target.value })}
                      className="h-12 w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 text-cosmic-white focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20 [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cosmic-white/60">
                      <Clock className="h-3.5 w-3.5" /> Time of Birth
                    </label>
                    <input
                      type="time"
                      value={form.birth_time}
                      onChange={(e) => updateForm({ birth_time: e.target.value })}
                      disabled={form.birth_time_unknown}
                      className="h-12 w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 text-cosmic-white focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20 disabled:opacity-30 [color-scheme:dark]"
                    />
                    <label className="mt-2 flex items-center gap-2 text-sm text-cosmic-white/40">
                      <input
                        type="checkbox"
                        checked={form.birth_time_unknown}
                        onChange={(e) =>
                          updateForm({
                            birth_time_unknown: e.target.checked,
                            birth_time: "",
                          })
                        }
                        className="rounded border-indigo/30"
                      />
                      I don&apos;t know my birth time
                    </label>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-cosmic-white/60">
                      <MapPin className="h-3.5 w-3.5" /> Birth Place
                    </label>
                    <input
                      type="text"
                      value={form.birth_city}
                      onChange={(e) => updateForm({ birth_city: e.target.value })}
                      placeholder="City"
                      className="mb-3 h-12 w-full rounded-xl border border-indigo/30 bg-deep-space/50 px-4 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={form.birth_state}
                        onChange={(e) => updateForm({ birth_state: e.target.value })}
                        placeholder="State"
                        className="h-12 flex-1 rounded-xl border border-indigo/30 bg-deep-space/50 px-4 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                      />
                      <input
                        type="text"
                        value={form.birth_country}
                        onChange={(e) => updateForm({ birth_country: e.target.value })}
                        placeholder="Country"
                        className="h-12 flex-1 rounded-xl border border-indigo/30 bg-deep-space/50 px-4 text-cosmic-white placeholder:text-cosmic-white/25 focus:border-saffron/50 focus:outline-none focus:ring-2 focus:ring-saffron/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Interests */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 inline-flex rounded-full bg-saffron/10 p-3">
                      <Star className="h-6 w-6 text-saffron" />
                    </div>
                    <h2 className="text-lg font-semibold text-cosmic-white">
                      What interests you?
                    </h2>
                    <p className="mt-1 text-sm text-cosmic-white/40">
                      Select one or more to customize your experience
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {INTERESTS.map((interest) => {
                      const selected = form.interests.includes(interest.id)
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => toggleInterest(interest.id)}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-all ${
                            selected
                              ? "border-saffron/50 bg-saffron/10"
                              : "border-indigo/30 hover:border-indigo/50"
                          }`}
                        >
                          <span className="text-3xl">{interest.icon}</span>
                          <span
                            className={`text-sm font-medium ${
                              selected ? "text-saffron" : "text-cosmic-white/60"
                            }`}
                          >
                            {interest.label}
                          </span>
                          <span className="font-hindi text-xs text-cosmic-white/30">
                            {interest.labelHi}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-cosmic-white/60">
                      Preferred Language
                    </label>
                    <div className="flex gap-3">
                      {[
                        { id: "en", label: "English" },
                        { id: "hi", label: "हिंदी" },
                        { id: "both", label: "Both" },
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() =>
                            updateForm({ preferred_language: lang.id })
                          }
                          className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                            form.preferred_language === lang.id
                              ? "border-saffron/50 bg-saffron/10 text-saffron"
                              : "border-indigo/30 text-cosmic-white/40 hover:border-indigo/50"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Summary */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 text-4xl">
                      {zodiacSigns[0].symbol}
                    </div>
                    <h2 className="text-lg font-semibold text-cosmic-white">
                      Your cosmic profile is ready
                    </h2>
                    <p className="mt-1 text-sm text-cosmic-white/40">
                      Review and start your journey
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl bg-deep-space/30 p-5">
                    <div className="flex justify-between">
                      <span className="text-sm text-cosmic-white/40">Name</span>
                      <span className="text-sm font-medium text-cosmic-white">
                        {form.full_name}
                      </span>
                    </div>
                    {form.birth_date && (
                      <div className="flex justify-between">
                        <span className="text-sm text-cosmic-white/40">
                          Birth Date
                        </span>
                        <span className="text-sm font-medium text-cosmic-white">
                          {new Date(form.birth_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    {form.birth_time && !form.birth_time_unknown && (
                      <div className="flex justify-between">
                        <span className="text-sm text-cosmic-white/40">
                          Birth Time
                        </span>
                        <span className="text-sm font-medium text-cosmic-white">
                          {form.birth_time}
                        </span>
                      </div>
                    )}
                    {form.birth_city && (
                      <div className="flex justify-between">
                        <span className="text-sm text-cosmic-white/40">
                          Birth Place
                        </span>
                        <span className="text-sm font-medium text-cosmic-white">
                          {[form.birth_city, form.birth_state, form.birth_country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-cosmic-white/40">
                        Interests
                      </span>
                      <span className="text-sm font-medium text-saffron">
                        {form.interests
                          .map(
                            (i) =>
                              INTERESTS.find((int) => int.id === i)?.label || i
                          )
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-indigo/20 px-8 py-5">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex items-center gap-1.5 text-sm text-cosmic-white/40 transition-colors hover:text-cosmic-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!canProceed[step]}
                className="flex items-center gap-2 rounded-xl bg-saffron px-6 py-2.5 text-sm font-semibold text-deep-space transition-all hover:bg-gold-light disabled:opacity-30"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-saffron px-6 py-2.5 text-sm font-semibold text-deep-space transition-all hover:bg-gold-light disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Start Exploring
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
