"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sun, Moon, Sunrise, Star, Activity, Heart, Briefcase, Zap, ChevronRight,
  ToggleLeft, ToggleRight, Sparkles, Eye, BookOpen, ChevronDown, ChevronUp
} from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import type { BirthData, AstroProfile } from "@/types/app"

interface MyChartTabProps {
  onProfileClick: () => void
  onAskQuestion: (q: string) => void
}

interface CosmicSnapshotData {
  snapshot?: {
    vedicSign?: { name: string; sanskrit: string; degree: string; element: string; quality: string; lord: string; lordSanskrit: string; gender: string }
    nakshatra?: { name: string; sanskrit: string; lord: string; deity: string; pada: number; symbol: string; shakti: string; animal: string; gana: string }
    lifePath?: { number: number; meaning: string }
    element?: { name: string; insight: string }
    rulingPlanet?: { name: string; sanskrit: string; signifies: string }
    birthDay?: { name: string; sanskrit: string; lord: string; lordSanskrit: string }
    todayTransit?: { vibe: string; emoji: string; detail: string }
  }
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
  const [cosmicData, setCosmicData] = useState<CosmicSnapshotData | null>(null)
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [astroMode, setAstroMode] = useState<"vedic" | "western">("vedic")

  useEffect(() => {
    try {
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) {
        const data = JSON.parse(snap)
        setCosmicData(data)
        if (data.snapshot) {
          const s = data.snapshot
          setProfile(prev => ({
            ...prev,
            sunSignVedic: s.vedicSign?.name || prev.sunSignVedic,
            nakshatra: s.nakshatra?.name || prev.nakshatra,
            nakshatraPada: s.nakshatra?.pada || prev.nakshatraPada,
          }))
        }
        if (data.moonSign || data.profile) {
          setProfile(prev => ({ ...prev, ...data, ...(data.profile || {}) }))
        }
      }
      const bd = localStorage.getItem("grahai-onboarding-birthdata")
      if (bd) setBirthData(JSON.parse(bd))
    } catch {}
  }, [])

  const snap = cosmicData?.snapshot
  const vedicSign = snap?.vedicSign
  const nakshatraData = snap?.nakshatra

  const chartItems = astroMode === "vedic" ? [
    { Icon: Moon, label: "Moon Sign", value: profile.moonSign, color: "text-blue-300", desc: "Emotional nature & inner world" },
    { Icon: Sunrise, label: "Rising Sign", value: profile.risingSign, color: "text-amber-300", desc: "How others perceive you" },
    { Icon: Sun, label: "Sun Sign (Vedic)", value: vedicSign?.name || profile.sunSignVedic, color: "text-orange-300", desc: "Core identity & soul purpose" },
    { Icon: Star, label: "Nakshatra", value: `${nakshatraData?.name || profile.nakshatra}${nakshatraData?.pada ? ` (Pada ${nakshatraData.pada})` : profile.nakshatraPada ? ` (Pada ${profile.nakshatraPada})` : ""}`, color: "text-purple-300", desc: nakshatraData?.shakti || "Lunar mansion energy" },
    { Icon: Activity, label: "Current Dasha", value: profile.currentDasha || "Calculating...", color: "text-teal-300", desc: "Active planetary period" },
  ] : [
    { Icon: Moon, label: "Moon Sign", value: profile.moonSign, color: "text-blue-300", desc: "Emotional nature & inner world" },
    { Icon: Sunrise, label: "Rising Sign", value: profile.risingSign, color: "text-amber-300", desc: "How others perceive you" },
    { Icon: Sun, label: "Sun Sign (Western)", value: profile.sunSignWestern || profile.sunSignVedic, color: "text-orange-300", desc: "Core identity (tropical zodiac)" },
    { Icon: Activity, label: "Current Dasha", value: profile.currentDasha || "Calculating...", color: "text-teal-300", desc: "Active planetary period" },
  ]

  const patterns = [
    {
      icon: "🧠", title: "Your emotional pattern",
      desc: snap?.element ? `As a ${snap.element.name} sign, ${snap.element.insight?.substring(0, 120)}...` : "You process deeply before reacting. This gives you wisdom but sometimes delays action.",
      askPrompt: "Tell me more about my emotional patterns based on my chart",
    },
    {
      icon: "💼", title: "Your work style",
      desc: vedicSign ? `With ${vedicSign.name} (${vedicSign.quality}) energy, you thrive in environments that match your ${vedicSign.element} nature. ${vedicSign.lord} guides your professional direction.` : "You thrive in structured environments but need creative autonomy.",
      askPrompt: "What does my chart say about my career potential?",
    },
    {
      icon: "❤️", title: "Your relationship style",
      desc: nakshatraData ? `${nakshatraData.name} (${nakshatraData.deity} energy) shapes how you love. Your ${nakshatraData.gana} nature influences attraction patterns.` : "You seek depth and loyalty. Surface connections drain you.",
      askPrompt: "What's my relationship pattern according to my chart?",
    },
    {
      icon: "⚡", title: "Current active energies",
      desc: snap?.todayTransit?.detail || "A transit of focus and discipline is active. This is a building phase — effort invested now compounds.",
      askPrompt: "What planetary transits are affecting me right now?",
    },
  ]

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle="Your identity & patterns" />

      <div className="px-5 pt-4">
        {/* Vedic / Western toggle */}
        <div className="flex gap-2 mb-4 glass-inner rounded-2xl p-1">
          <button onClick={() => setAstroMode("vedic")}
            className={`flex-1 py-2.5 text-xs font-medium tab-pill ${
              astroMode === "vedic" ? "tab-pill-active" : "text-[#5A6478]"
            }`}>Vedic (Sidereal)</button>
          <button onClick={() => setAstroMode("western")}
            className={`flex-1 py-2.5 text-xs font-medium tab-pill ${
              astroMode === "western" ? "tab-pill-active" : "text-[#5A6478]"
            }`}>Western (Tropical)</button>
        </div>

        {/* ═══ Chart Summary Card ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-hero p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-base font-semibold text-[#F1F0F5] text-3d">Your Chart</h2>
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
                className="py-2 border-b border-[#1E293B]/60 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm text-[#94A3B8]">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#D4A054]">{item.value}</span>
                </div>
                {isAdvanced && (
                  <p className="text-[10px] text-[#5A6478] mt-1 ml-7">{item.desc}</p>
                )}
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
                  { label: astroMode === "vedic" ? "Sun Sign (Western)" : "Sun Sign (Vedic)", value: astroMode === "vedic" ? (profile.sunSignWestern || "—") : (vedicSign?.name || profile.sunSignVedic) },
                  { label: "Dominant Theme", value: profile.dominantTheme || "—" },
                  ...(vedicSign ? [
                    { label: "Element", value: vedicSign.element },
                    { label: "Quality", value: vedicSign.quality },
                    { label: "Ruling Planet", value: `${snap?.rulingPlanet?.name || vedicSign.lord} (${snap?.rulingPlanet?.sanskrit || ""})` },
                    { label: "Sign Degree", value: `${vedicSign.degree}° in ${vedicSign.name}` },
                  ] : []),
                  ...(nakshatraData ? [
                    { label: "Nakshatra Deity", value: nakshatraData.deity },
                    { label: "Nakshatra Lord", value: nakshatraData.lord },
                    { label: "Symbol", value: nakshatraData.symbol },
                    { label: "Gana", value: nakshatraData.gana },
                  ] : []),
                  ...(snap?.lifePath ? [
                    { label: "Life Path Number", value: `${snap.lifePath.number}` },
                  ] : []),
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

        {/* ═══ Nakshatra Deep Dive ═══ */}
        {nakshatraData && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card mb-5 overflow-hidden"
          >
            <button
              onClick={() => toggleSection("nakshatra")}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-[#F1F0F5]">Nakshatra Details</span>
              </div>
              {expandedSection === "nakshatra" ? (
                <ChevronUp className="w-4 h-4 text-[#5A6478]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#5A6478]" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === "nakshatra" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-[#0A0E1A] rounded-xl p-3 space-y-2">
                    <div className="text-center mb-2">
                      <p className="text-lg font-bold text-[#D4A054]">{nakshatraData.name}</p>
                      <p className="text-xs text-[#5A6478]">{nakshatraData.sanskrit} &middot; Pada {nakshatraData.pada}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Deity", value: nakshatraData.deity },
                        { label: "Lord", value: nakshatraData.lord },
                        { label: "Symbol", value: nakshatraData.symbol },
                        { label: "Shakti", value: nakshatraData.shakti },
                        { label: "Animal", value: nakshatraData.animal },
                        { label: "Gana", value: nakshatraData.gana },
                      ].map(item => (
                        <div key={item.label} className="bg-[#111827] rounded-lg p-2">
                          <p className="text-[10px] text-[#5A6478]">{item.label}</p>
                          <p className="text-xs font-medium text-[#94A3B8]">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══ Life Path ═══ */}
        {snap?.lifePath && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card mb-5 overflow-hidden"
          >
            <button
              onClick={() => toggleSection("lifepath")}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4A054]" />
                <span className="text-sm font-semibold text-[#F1F0F5]">Life Path {snap.lifePath.number}</span>
              </div>
              {expandedSection === "lifepath" ? (
                <ChevronUp className="w-4 h-4 text-[#5A6478]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#5A6478]" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === "lifepath" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-[#0A0E1A] rounded-xl p-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4A054]/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-[#D4A054]">{snap.lifePath.number}</span>
                    </div>
                    <p className="text-sm text-[#94A3B8] leading-relaxed text-center">{snap.lifePath.meaning}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══ Element Insight ═══ */}
        {snap?.element && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-4 mb-5"
          >
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-[#F1F0F5] text-visible">{snap.element.name} Element</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed relative z-10 text-visible">{snap.element.insight}</p>
          </motion.div>
        )}

        {/* ═══ Pattern Recognition Cards ═══ */}
        <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3">Your patterns</h3>
        <div className="space-y-3 mb-6">
          {patterns.map((p, i) => (
            <motion.button
              key={p.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              onClick={() => onAskQuestion(p.askPrompt)}
              className="w-full text-left glass-card card-lift p-4
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
          className="glass-card-hero p-4 text-center"
        >
          <BookOpen className="w-5 h-5 text-[#D4A054] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#D4A054] mb-1">Learn your chart</p>
          <p className="text-xs text-[#5A6478]">
            Understand what each element means and how it shapes your life
          </p>
        </motion.div>
      </div>
    </div>
  )
}
