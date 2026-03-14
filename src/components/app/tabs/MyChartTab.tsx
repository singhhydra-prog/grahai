"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon, Sunrise, Star, Activity, Heart, Briefcase, Zap, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import type { BirthData, AstroProfile } from "@/types/app"

interface MyChartTabProps {
  onProfileClick: () => void
  onAskQuestion: (q: string) => void
}

const DEFAULT_PROFILE: AstroProfile = {
  moonSign: "Cancer",
  risingSign: "Leo",
  sunSignVedic: "Virgo",
  sunSignWestern: "Libra",
  nakshatra: "Pushya",
  nakshatraPada: 1,
  currentDasha: "Venus-Mercury",
  dominantTheme: "Inner growth and clarity",
}

export default function MyChartTab({ onProfileClick, onAskQuestion }: MyChartTabProps) {
  const [profile, setProfile] = useState<AstroProfile>(DEFAULT_PROFILE)
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [isAdvanced, setIsAdvanced] = useState(false)

  useEffect(() => {
    try {
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) {
        const data = JSON.parse(snap)
        if (data.moonSign || data.profile) {
          setProfile((prev) => ({ ...prev, ...data, ...(data.profile || {}) }))
        }
      }
      const bd = localStorage.getItem("grahai-onboarding-birthdata")
      if (bd) setBirthData(JSON.parse(bd))
    } catch {}
  }, [])

  const chartItems = [
    { Icon: Moon, label: "Moon Sign", value: profile.moonSign, color: "text-blue-300" },
    { Icon: Sunrise, label: "Rising Sign", value: profile.risingSign, color: "text-amber-300" },
    { Icon: Sun, label: "Sun Sign (Vedic)", value: profile.sunSignVedic, color: "text-orange-300" },
    { Icon: Star, label: "Nakshatra", value: `${profile.nakshatra}${profile.nakshatraPada ? ` (Pada ${profile.nakshatraPada})` : ""}`, color: "text-purple-300" },
    { Icon: Activity, label: "Current Dasha", value: profile.currentDasha || "Calculating...", color: "text-teal-300" },
  ]

  const patterns = [
    {
      icon: "🧠",
      title: "Your emotional pattern",
      desc: "You process deeply before reacting. This gives you wisdom but sometimes delays action.",
      askPrompt: "Tell me more about my emotional patterns",
    },
    {
      icon: "💼",
      title: "Your work style",
      desc: "You thrive in structured environments but need creative autonomy. Leadership comes naturally in your mid-career phase.",
      askPrompt: "What does my chart say about my career potential?",
    },
    {
      icon: "❤️",
      title: "Your relationship style",
      desc: "You seek depth and loyalty. Surface connections drain you. Your chart favors long-term bonds over short flings.",
      askPrompt: "What's my relationship pattern according to my chart?",
    },
    {
      icon: "⚡",
      title: "Current active energies",
      desc: "A transit of focus and discipline is active. This is a building phase — effort invested now compounds over the next 6 months.",
      askPrompt: "What planetary transits are affecting me right now?",
    },
  ]

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle="Your identity & patterns" />

      <div className="px-5 pt-4">
        {/* ═══ Chart Summary Card ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#F1F0F5]">Your Chart</h2>
            <button
              onClick={() => setIsAdvanced(!isAdvanced)}
              className="flex items-center gap-1.5 text-xs text-[#5A6478]"
            >
              {isAdvanced ? (
                <>
                  <ToggleRight className="w-4 h-4 text-[#D4A054]" />
                  <span className="text-[#D4A054]">Advanced</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4" />
                  Simple
                </>
              )}
            </button>
          </div>

          {/* Core chart items */}
          <div className="space-y-3">
            {chartItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between py-2 border-b border-[#1E293B]/60 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <item.Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm text-[#94A3B8]">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-[#D4A054]">{item.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Advanced section */}
          {isAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-[#1E293B]"
            >
              <p className="text-xs text-[#5A6478] mb-3">Additional chart data</p>
              <div className="space-y-2.5">
                {[
                  { label: "Sun Sign (Western)", value: profile.sunSignWestern },
                  { label: "Dominant Theme", value: profile.dominantTheme || "—" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-[#5A6478]">{item.label}</span>
                    <span className="text-xs font-medium text-[#94A3B8]">{item.value}</span>
                  </div>
                ))}
              </div>
              {birthData && (
                <div className="mt-3 pt-3 border-t border-[#1E293B]/40">
                  <p className="text-xs text-[#5A6478] mb-2">Birth Details</p>
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#94A3B8]">{birthData.dateOfBirth} &middot; {birthData.timeOfBirth || "Time unknown"}</p>
                    <p className="text-xs text-[#94A3B8]">{birthData.placeOfBirth}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* ═══ Pattern Recognition Cards ═══ */}
        <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3">Your patterns</h3>
        <div className="space-y-3 mb-6">
          {patterns.map((p, i) => (
            <motion.button
              key={p.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              onClick={() => onAskQuestion(p.askPrompt)}
              className="w-full text-left bg-[#111827] border border-[#1E293B] rounded-xl p-4
                hover:border-[#D4A054]/15 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{p.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-[#F1F0F5] mb-1">{p.title}</h4>
                  <p className="text-xs text-[#5A6478] leading-relaxed">{p.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5A6478] shrink-0 mt-1" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* ═══ Learn Your Chart ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[#D4A054]/5 to-transparent border border-[#D4A054]/10
            rounded-xl p-4 text-center"
        >
          <p className="text-sm font-semibold text-[#D4A054] mb-1">Learn your chart</p>
          <p className="text-xs text-[#5A6478]">
            Understand what each element means and how it shapes your life
          </p>
        </motion.div>
      </div>
    </div>
  )
}
