"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sun, Moon, Sunrise, Star, Activity, Zap, Shield, ChevronRight,
  ToggleLeft, ToggleRight, Sparkles, Eye, ChevronDown, ChevronUp
} from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import { useLanguage } from "@/lib/LanguageContext"
import type { BirthData, AstroProfile } from "@/types/app"

interface MyChartTabProps {
  onProfileClick: () => void
  onAskQuestion: (q: string) => void
}

interface CosmicSnapshotData {
  snapshot?: {
    vedicSign?: { name: string; sanskrit: string; degree: string; element: string; quality: string; lord: string; lordSanskrit: string; gender: string }
    moonSign?: { name: string; sanskrit: string; degree: string; element: string; lord: string }
    risingSign?: { name: string; sanskrit: string; degree: string } | null
    nakshatra?: { name: string; sanskrit: string; lord: string; deity: string; pada: number; symbol: string; shakti: string; animal: string; gana: string }
    sunNakshatra?: { name: string; sanskrit: string; lord: string; pada: number }
    lifePath?: { number: number; meaning: string }
    element?: { name: string; insight: string }
    rulingPlanet?: { name: string; sanskrit: string; signifies: string }
    birthDay?: { name: string; sanskrit: string; lord: string; lordSanskrit: string }
    todayTransit?: { vibe: string; emoji: string; detail: string }
  }
}

const DEFAULT_PROFILE: AstroProfile = {
  moonSign: "—", risingSign: "—", sunSignVedic: "—",
  sunSignWestern: "—", nakshatra: "—", nakshatraPada: 0,
  currentDasha: "—", dominantTheme: "Complete your birth details to see your chart",
}

// Derive strengths/sensitivities from chart data (element + nakshatra + ruling planet + moon sign)
function getStrengths(
  element: string,
  nakshatraName?: string,
  rulingPlanet?: string,
  moonSignName?: string,
  risingSignName?: string,
): { strengths: string[]; sensitivities: string[] } {
  const strengths: string[] = []
  const sensitivities: string[] = []

  // Element-based foundation (1 each)
  const elementStrengths: Record<string, string> = {
    Fire: "Natural leadership and courage under pressure",
    Earth: "Practical decision-making and reliability",
    Air: "Excellent communication and quick mental processing",
    Water: "Deep emotional intelligence and powerful intuition",
  }
  const elementSensitivities: Record<string, string> = {
    Fire: "Impatience with slow processes",
    Earth: "Resistance to change",
    Air: "Overthinking and analysis paralysis",
    Water: "Absorbing others' emotional states",
  }
  if (elementStrengths[element]) strengths.push(elementStrengths[element])
  if (elementSensitivities[element]) sensitivities.push(elementSensitivities[element])

  // Ruling planet-specific (chart-based)
  if (rulingPlanet) {
    const planetStrengths: Record<string, string> = {
      Sun: `${rulingPlanet}-ruled chart: strong sense of identity and authority`,
      Moon: `${rulingPlanet}-ruled chart: emotional depth and nurturing instinct`,
      Mars: `${rulingPlanet}-ruled chart: physical vitality and competitive drive`,
      Mercury: `${rulingPlanet}-ruled chart: intellectual agility and versatile skills`,
      Jupiter: `${rulingPlanet}-ruled chart: wisdom-seeking nature and expansive vision`,
      Venus: `${rulingPlanet}-ruled chart: aesthetic sense and relationship magnetism`,
      Saturn: `${rulingPlanet}-ruled chart: disciplined persistence and long-term builder`,
    }
    const planetSensitivities: Record<string, string> = {
      Sun: "Ego sensitivity when authority is challenged",
      Moon: "Mood fluctuations influenced by lunar cycles",
      Mars: "Anger under pressure if not channeled physically",
      Mercury: "Nervous energy from information overload",
      Jupiter: "Overcommitment from excessive optimism",
      Venus: "Overindulgence in comfort and pleasure",
      Saturn: "Tendency toward pessimism during difficult phases",
    }
    if (planetStrengths[rulingPlanet]) strengths.push(planetStrengths[rulingPlanet])
    if (planetSensitivities[rulingPlanet]) sensitivities.push(planetSensitivities[rulingPlanet])
  }

  // Nakshatra-specific (unique to user's birth star)
  if (nakshatraName) {
    strengths.push(`${nakshatraName} Nakshatra gifts: innate talents shaped by your birth star's deity and shakti`)
  }

  // Moon sign + Rising sign combination
  if (moonSignName && risingSignName && moonSignName !== risingSignName) {
    sensitivities.push(`${moonSignName} Moon + ${risingSignName} Rising: inner emotional world may differ from how others perceive you`)
  } else if (moonSignName) {
    strengths.push(`${moonSignName} Moon: emotional responses aligned with your core nature`)
  }

  // Ensure at least 3 each
  if (strengths.length < 3) strengths.push("Unique cosmic blueprint shaping your life journey")
  if (sensitivities.length < 3) sensitivities.push("Growth edges revealed during challenging dasha periods")

  return { strengths: strengths.slice(0, 3), sensitivities: sensitivities.slice(0, 3) }
}

export default function MyChartTab({ onProfileClick, onAskQuestion }: MyChartTabProps) {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<AstroProfile>(DEFAULT_PROFILE)
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [cosmicData, setCosmicData] = useState<CosmicSnapshotData | null>(null)
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

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
            moonSign: s.moonSign?.name || s.vedicSign?.name || prev.moonSign,
            risingSign: s.risingSign?.name || prev.risingSign,
            sunSignVedic: s.vedicSign?.name || prev.sunSignVedic,
            nakshatra: s.nakshatra?.name || prev.nakshatra,
            nakshatraPada: s.nakshatra?.pada || prev.nakshatraPada,
          }))
        }
        if (data.profile) setProfile(prev => ({ ...prev, ...data.profile }))
      }
      const bd = localStorage.getItem("grahai-onboarding-birthdata")
      if (bd) setBirthData(JSON.parse(bd))
    } catch (err) {
      console.warn("[MyChartTab] Failed to load cached chart data:", err)
    }
  }, [])

  const snap = cosmicData?.snapshot
  const vedicSign = snap?.vedicSign
  const nakshatraData = snap?.nakshatra
  const moonSignData = snap?.moonSign
  const risingSignData = snap?.risingSign
  const element = vedicSign?.element || moonSignData?.element || ""
  const { strengths, sensitivities } = getStrengths(
    element,
    nakshatraData?.name,
    snap?.rulingPlanet?.name,
    moonSignData?.name,
    risingSignData?.name,
  )

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <div className="min-h-full pb-24">
      <AppHeader onProfileClick={onProfileClick} subtitle={t.chart.yourBlueprint} />

      <div className="px-5 pt-4">
        {/* ═══ 1. Identity Summary — Simple View ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-hero p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#F1F0F5]">
                {birthData?.name || "Your"} {t.chart.title || "Chart"}
              </h2>
              <p className="text-[10px] text-[#8892A3]">
                {birthData?.dateOfBirth} &middot; {birthData?.placeOfBirth || ""}
              </p>
            </div>
            <button
              onClick={() => setIsAdvanced(!isAdvanced)}
              className="flex items-center gap-1.5 text-xs text-[#8892A3]"
            >
              {isAdvanced ? (
                <><ToggleRight className="w-4 h-4 text-[#D4A054]" /><span className="text-[#D4A054]">{t.chart.advanced}</span></>
              ) : (
                <><ToggleLeft className="w-4 h-4" />{t.chart.simple}</>
              )}
            </button>
          </div>

          {/* Core triad: Moon, Nakshatra, Rising */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Moon, label: t.chart.moonSign, value: profile.moonSign, color: "text-blue-300" },
              { icon: Star, label: t.chart.nakshatra, value: `${profile.nakshatra}`, color: "text-[#D4A054]" },
              { icon: Sunrise, label: t.chart.risingSign, value: risingSignData?.name || profile.risingSign, color: "text-amber-300" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-[#0A0E1A]/60 rounded-xl p-3 text-center"
              >
                <item.icon className={`w-4 h-4 ${item.color} mx-auto mb-1`} />
                <p className="text-[10px] text-[#8892A3] mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-[#D4A054]">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Sun sign + Element row */}
          <div className="flex items-center gap-3 bg-[#0A0E1A]/40 rounded-xl p-3">
            <div className="flex items-center gap-2 flex-1">
              <Sun className="w-3.5 h-3.5 text-orange-300" />
              <span className="text-xs text-[#ACB8C4]">{t.chart.sun} <span className="text-[#F1F0F5] font-medium">{vedicSign?.name || profile.sunSignVedic}</span></span>
            </div>
            <div className="w-px h-4 bg-[#1E293B]" />
            <div className="flex items-center gap-2 flex-1">
              <Eye className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-xs text-[#ACB8C4]">{t.chart.elementLabel} <span className="text-[#F1F0F5] font-medium">{element}</span></span>
            </div>
          </div>

          {/* Advanced: Additional details */}
          <AnimatePresence>
            {isAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-[#1E293B]/40"
              >
                <div className="space-y-2">
                  {[
                    { label: t.chart.nakshatraPada, value: `${nakshatraData?.pada || profile.nakshatraPada}` },
                    { label: t.chart.nakshatraLord, value: nakshatraData?.lord || "—" },
                    { label: t.chart.nakshatraDeity, value: nakshatraData?.deity || "—" },
                    { label: t.chart.signQuality, value: vedicSign?.quality || "—" },
                    { label: t.chart.rulingPlanet, value: `${snap?.rulingPlanet?.name || vedicSign?.lord || "—"} (${snap?.rulingPlanet?.sanskrit || vedicSign?.lordSanskrit || ""})` },
                    { label: t.chart.signDegree, value: vedicSign?.degree ? `${vedicSign.degree}° in ${vedicSign.name}` : "—" },
                    ...(snap?.lifePath ? [{ label: t.chart.lifePath, value: `${snap.lifePath.number} — ${snap.lifePath.meaning.split("—")[0].trim()}` }] : []),
                    { label: t.chart.currentDasha, value: profile.currentDasha || t.chart.calculating },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-[11px] text-[#8892A3]">{item.label}</span>
                      <span className="text-[11px] font-medium text-[#ACB8C4] text-right max-w-[55%]">{item.value}</span>
                    </div>
                  ))}
                </div>
                {birthData && (
                  <div className="mt-3 pt-3 border-t border-[#1E293B]/30">
                    <p className="text-[10px] text-[#8892A3]">
                      {birthData.dateOfBirth} &middot; {birthData.timeOfBirth || t.chart.timeUnknownLabel} &middot; {birthData.placeOfBirth}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══ 2. Current Active Energies ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-[#F1F0F5]">{t.chart.currentEnergies}</h3>
          </div>
          <p className="text-xs text-[#ACB8C4] leading-relaxed mb-3">
            {snap?.todayTransit?.detail || (profile.currentDasha && profile.currentDasha !== "—"
              ? `Your ${profile.currentDasha} period shapes today's energy. Check your daily horoscope for transit details.`
              : "Transit data unavailable — visit the Home tab to load your personalized cosmic weather.")}
          </p>
          {profile.currentDasha && (
            <div className="flex items-center gap-2 bg-[#0A0E1A]/50 rounded-lg p-2.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <div>
                <p className="text-[10px] text-[#8892A3]">{t.chart.activeDasha}</p>
                <p className="text-xs font-medium text-[#F1F0F5]">{profile.currentDasha}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => onAskQuestion("What planetary transits are most active for me right now?")}
            className="flex items-center gap-1 mt-3 text-[11px] text-[#D4A054] font-medium hover:text-[#E8C278] transition-colors"
          >
            {t.chart.askTransits} <ChevronRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* ═══ 3. Strengths & Sensitivities ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card mb-4 overflow-hidden"
        >
          <button onClick={() => toggleSection("strengths")} className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-[#F1F0F5]">${t.chart.strengths} & ${t.chart.sensitivities}</span>
            </div>
            {expandedSection === "strengths" ? <ChevronUp className="w-4 h-4 text-[#8892A3]" /> : <ChevronDown className="w-4 h-4 text-[#8892A3]" />}
          </button>
          <AnimatePresence>
            {expandedSection === "strengths" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mb-2">{t.chart.strengths}</p>
                    <div className="space-y-2">
                      {strengths.map((s) => (
                        <div key={s} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <p className="text-xs text-[#ACB8C4] leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-amber-400 uppercase tracking-wider mb-2">{t.chart.sensitivities}</p>
                    <div className="space-y-2">
                      {sensitivities.map((s) => (
                        <div key={s} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <p className="text-xs text-[#ACB8C4] leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══ 4. Recurring Themes (Patterns) ═══ */}
        <h3 className="text-sm font-semibold text-[#F1F0F5] mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4A054]" />
          {t.chart.recurringThemes}
        </h3>
        <div className="space-y-3 mb-5">
          {[
            {
              title: t.chart.emotionalPattern,
              desc: snap?.element ? `As a ${snap.element.name} sign, ${snap.element.insight?.substring(0, 100)}...` : "You process deeply before reacting. This gives you wisdom but sometimes delays action.",
              ask: "Tell me more about my emotional patterns based on my chart",
              color: "text-blue-400", bg: "bg-blue-500/10",
            },
            {
              title: t.chart.workStyle,
              desc: vedicSign ? `With ${vedicSign.name} energy, you thrive in environments that match your ${vedicSign.element} nature.` : "You thrive in structured environments but need creative autonomy.",
              ask: "What does my chart say about my ideal work environment?",
              color: "text-amber-400", bg: "bg-amber-500/10",
            },
            {
              title: t.chart.relationshipStyle,
              desc: nakshatraData ? `${nakshatraData.name} (${nakshatraData.deity} energy) shapes how you love. Your ${nakshatraData.gana} nature influences attraction.` : "You seek depth and loyalty. Surface connections drain you.",
              ask: "What's my relationship pattern according to my chart?",
              color: "text-rose-400", bg: "bg-rose-500/10",
            },
          ].map((theme, i) => (
            <motion.button
              key={theme.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              onClick={() => onAskQuestion(theme.ask)}
              className="w-full text-left glass-card card-lift p-4 hover:border-[#D4A054]/15 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${theme.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className={`text-xs font-bold ${theme.color}`}>{theme.title[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#F1F0F5] mb-1">{theme.title}</h4>
                  <p className="text-xs text-[#8892A3] leading-relaxed">{theme.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8892A3] shrink-0 mt-1" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* ═══ 5. Nakshatra Details (Expandable) ═══ */}
        {nakshatraData && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card mb-4 overflow-hidden"
          >
            <button onClick={() => toggleSection("nakshatra")} className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D4A054]" />
                <span className="text-sm font-semibold text-[#F1F0F5]">{t.chart.nakshatra} {t.chart.deepDive}</span>
              </div>
              {expandedSection === "nakshatra" ? <ChevronUp className="w-4 h-4 text-[#8892A3]" /> : <ChevronDown className="w-4 h-4 text-[#8892A3]" />}
            </button>
            <AnimatePresence>
              {expandedSection === "nakshatra" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-[#0A0E1A] rounded-xl p-3">
                    <div className="text-center mb-3">
                      <p className="text-lg font-bold text-[#D4A054]">{nakshatraData.name}</p>
                      <p className="text-xs text-[#8892A3]">{nakshatraData.sanskrit} &middot; Pada {nakshatraData.pada}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: t.chart.deity, value: nakshatraData.deity },
                        { label: t.chart.lord, value: nakshatraData.lord },
                        { label: t.chart.symbol, value: nakshatraData.symbol },
                        { label: t.chart.shakti, value: nakshatraData.shakti },
                        { label: t.chart.animal, value: nakshatraData.animal },
                        { label: t.chart.gana, value: nakshatraData.gana },
                      ].map(item => (
                        <div key={item.label} className="bg-[#111827] rounded-lg p-2">
                          <p className="text-[10px] text-[#8892A3]">{item.label}</p>
                          <p className="text-xs font-medium text-[#ACB8C4]">{item.value}</p>
                        </div>
                      ))}
                    </div>
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
            transition={{ delay: 0.4 }}
            className="glass-card p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-[#F1F0F5]">{snap.element.name} {t.chart.elementLabel}</span>
            </div>
            <p className="text-xs text-[#ACB8C4] leading-relaxed">{snap.element.insight}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
