"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, Users, Star, Sparkles, ArrowRight, ChevronRight,
  Lock, Plus, X, Calendar, Clock, MapPin, User,
  Brain, MessageCircle, Flame, Shield, Coins, Home as HomeIcon
} from "lucide-react"
import AppHeader from "@/components/ui/AppHeader"
import { useLanguage } from "@/lib/LanguageContext"
import type { BirthData } from "@/types/app"

/* ── Types ── */
interface CompatibilityResult {
  overallScore: number
  sections: {
    id: string
    title: string
    icon: typeof Heart
    score: number
    summary: string
    details: string
    isPremium: boolean
  }[]
  headline: string
  advice: string
}

interface CompatibilityTabProps {
  onProfileClick: () => void
  onAskQuestion: (question?: string) => void
  onPricingClick: () => void
}

/* ── Score Dial Component ── */
function ScoreDial({ score, size = 160, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference
  const color = score >= 75 ? "#4ADE80" : score >= 50 ? "#D4A054" : "#EF4444"

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(90,100,120,0.2)"
          strokeWidth="8"
        />
        {/* Score ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-[#8A8F9E] mt-0.5">out of 100</span>
      </div>
      {label && (
        <span className="text-sm text-[#D4A054] font-medium mt-2">{label}</span>
      )}
    </div>
  )
}

/* ── Partner Input Form ── */
function PartnerInputForm({ onSubmit, onClose }: {
  onSubmit: (data: BirthData) => void
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [timeOfBirth, setTimeOfBirth] = useState("")
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [placeOfBirth, setPlaceOfBirth] = useState("")

  const canSubmit = name.trim() && dateOfBirth && placeOfBirth.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass-card p-5 rounded-2xl space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-[#F1F0F5]">Partner&apos;s Birth Details</h3>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
          <X className="w-4 h-4 text-[#5A6478]" />
        </button>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs text-[#8A8F9E] mb-1 block">Name</label>
        <div className="flex items-center gap-2 glass-inner rounded-xl px-3 py-2.5">
          <User className="w-4 h-4 text-[#D4A054]" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Their name"
            className="flex-1 bg-transparent text-sm text-[#F1F0F5] placeholder:text-[#5A6478] outline-none"
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="text-xs text-[#8A8F9E] mb-1 block">Date of Birth</label>
        <div className="flex items-center gap-2 glass-inner rounded-xl px-3 py-2.5">
          <Calendar className="w-4 h-4 text-[#D4A054]" />
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#F1F0F5] outline-none
              [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Time of Birth */}
      <div>
        <label className="text-xs text-[#8A8F9E] mb-1 block">Time of Birth</label>
        <div className="flex items-center gap-2 glass-inner rounded-xl px-3 py-2.5">
          <Clock className="w-4 h-4 text-[#D4A054]" />
          <input
            type="time"
            value={timeOfBirth}
            onChange={(e) => setTimeOfBirth(e.target.value)}
            disabled={timeUnknown}
            className="flex-1 bg-transparent text-sm text-[#F1F0F5] outline-none
              disabled:opacity-40 [color-scheme:dark]"
          />
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={timeUnknown}
            onChange={(e) => {
              setTimeUnknown(e.target.checked)
              if (e.target.checked) setTimeOfBirth("")
            }}
            className="w-3.5 h-3.5 rounded accent-[#D4A054]"
          />
          <span className="text-xs text-[#8A8F9E]">Time unknown</span>
        </label>
      </div>

      {/* Place of Birth */}
      <div>
        <label className="text-xs text-[#8A8F9E] mb-1 block">Place of Birth</label>
        <div className="flex items-center gap-2 glass-inner rounded-xl px-3 py-2.5">
          <MapPin className="w-4 h-4 text-[#D4A054]" />
          <input
            type="text"
            value={placeOfBirth}
            onChange={(e) => setPlaceOfBirth(e.target.value)}
            placeholder="City, Country"
            className="flex-1 bg-transparent text-sm text-[#F1F0F5] placeholder:text-[#5A6478] outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={() => canSubmit && onSubmit({ name, dateOfBirth, timeOfBirth, timeUnknown, placeOfBirth })}
        disabled={!canSubmit}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300
          bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]
          hover:shadow-[0_0_20px_rgba(212,160,84,0.3)]
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Check Compatibility
      </button>
    </motion.div>
  )
}

/* ── Section Card ── */
function SectionCard({ section, onAsk, onUnlock }: {
  section: CompatibilityResult["sections"][0]
  onAsk: (q: string) => void
  onUnlock: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const Icon = section.icon
  const scoreColor = section.score >= 75 ? "text-green-400" : section.score >= 50 ? "text-[#D4A054]" : "text-red-400"

  return (
    <motion.div
      layout
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => !section.isPremium && setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A054]/20 to-[#D4A054]/5
          flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-[#D4A054]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F1F0F5]">{section.title}</span>
            {section.isPremium && <Lock className="w-3.5 h-3.5 text-[#5A6478]" />}
          </div>
          <p className="text-xs text-[#8A8F9E] truncate">{section.summary}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-lg font-bold ${scoreColor}`}>{section.score}</span>
          {!section.isPremium && (
            <ChevronRight className={`w-4 h-4 text-[#5A6478] transition-transform ${expanded ? "rotate-90" : ""}`} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && !section.isPremium && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-sm text-[#C5C1D6] leading-relaxed">{section.details}</p>
              <button
                onClick={() => onAsk(`Tell me more about ${section.title.toLowerCase()} compatibility with my partner`)}
                className="flex items-center gap-1.5 text-xs text-[#D4A054] font-medium hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Ask deeper question
              </button>
            </div>
          </motion.div>
        )}
        {section.isPremium && (
          <div className="px-4 pb-4">
            <button
              onClick={onUnlock}
              className="w-full py-2 rounded-lg text-xs font-medium
                bg-gradient-to-r from-[#D4A054]/20 to-[#D4A054]/10
                text-[#D4A054] border border-[#D4A054]/20
                hover:border-[#D4A054]/40 transition-colors"
            >
              Unlock with Premium
            </button>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main CompatibilityTab ── */
export default function CompatibilityTab({
  onProfileClick,
  onAskQuestion,
  onPricingClick,
}: CompatibilityTabProps) {
  const { t } = useLanguage()

  const [showPartnerForm, setShowPartnerForm] = useState(false)
  const [partnerData, setPartnerData] = useState<BirthData | null>(null)
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<BirthData | null>(null)
  const [relationshipType, setRelationshipType] = useState<"romantic" | "marriage" | "friendship" | "professional">("romantic")

  // Load user birth data
  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) setUserData(JSON.parse(stored))
    } catch {}
  }, [])

  // Generate compatibility result (mock for now, will connect to API)
  const generateCompatibility = useCallback(async (partner: BirthData) => {
    setIsLoading(true)
    setPartnerData(partner)
    setShowPartnerForm(false)

    // Simulate API call — will be replaced with real Claude API call
    await new Promise((r) => setTimeout(r, 2500))

    // Mock result
    const mockResult: CompatibilityResult = {
      overallScore: 76,
      headline: `Strong cosmic connection with ${partner.name}`,
      advice: "Your Moon signs create a natural emotional understanding. Focus on open communication during Mercury retrograde periods for best results.",
      sections: [
        {
          id: "emotional",
          title: "Emotional Bond",
          icon: Heart,
          score: 82,
          summary: "Deep emotional resonance through Moon alignment",
          details: "Your Moon signs share a harmonious trine aspect, creating natural emotional understanding. You intuitively sense each other's moods and needs. The Nakshatra compatibility (Nadi score) indicates strong emotional chemistry.",
          isPremium: false,
        },
        {
          id: "mental",
          title: "Mental Connection",
          icon: Brain,
          score: 74,
          summary: "Mercury aspects support intellectual rapport",
          details: "Mercury placements suggest stimulating conversations and shared intellectual curiosity. You both value learning and can grow together mentally. Minor friction may arise in communication styles during stress.",
          isPremium: false,
        },
        {
          id: "physical",
          title: "Physical Chemistry",
          icon: Flame,
          score: 79,
          summary: "Mars-Venus interplay shows magnetic attraction",
          details: "The Mars-Venus cross-aspects between your charts create a strong physical attraction. Your Kama (desire) scores from Ashtakoot matching indicate sustained passion over time.",
          isPremium: false,
        },
        {
          id: "trust",
          title: "Trust & Loyalty",
          icon: Shield,
          score: 71,
          summary: "Saturn aspects build lasting commitment",
          details: "Saturn's influence on both charts supports long-term commitment and reliability. Trust deepens over time as you both demonstrate consistency. Watch for possessive tendencies during Rahu transits.",
          isPremium: true,
        },
        {
          id: "financial",
          title: "Financial Harmony",
          icon: Coins,
          score: 68,
          summary: "Different approaches to money, but complementary",
          details: "Your 2nd and 11th house placements show different spending philosophies but complementary financial strengths. One of you is a natural saver while the other sees opportunities for growth.",
          isPremium: true,
        },
        {
          id: "family",
          title: "Family & Home",
          icon: HomeIcon,
          score: 80,
          summary: "Strong foundation for building a shared life",
          details: "4th house compatibility is excellent, indicating shared values around home and family. Your Graha Maitri (planetary friendship) score suggests you'll create a warm, supportive home environment.",
          isPremium: true,
        },
      ],
    }

    setResult(mockResult)
    setIsLoading(false)
  }, [])

  return (
    <div className="min-h-dvh pb-24">
      <AppHeader
        subtitle="Compatibility"
        onProfileClick={onProfileClick}
      />

      <div className="px-4 space-y-5 mt-2">

        {/* ── Empty State — No partner yet ── */}
        {!partnerData && !showPartnerForm && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Hero */}
            <div className="glass-card-hero rounded-2xl p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#D4A054] to-[#A16E2A]
                flex items-center justify-center shadow-lg shadow-[#D4A054]/20">
                <Heart className="w-8 h-8 text-[#0A0E1A]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F1F0F5] mb-1">
                  Kundli Matching
                </h2>
                <p className="text-sm text-[#8A8F9E] leading-relaxed max-w-[280px] mx-auto">
                  Discover your cosmic compatibility through Vedic astrology.
                  Based on Ashtakoot Milan — the ancient 8-fold matching system.
                </p>
              </div>

              <button
                onClick={() => setShowPartnerForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                  bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]
                  hover:shadow-[0_0_20px_rgba(212,160,84,0.3)] transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Partner Details
              </button>
            </div>

            {/* Relationship Type Selector */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1">
                Relationship Type
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { id: "romantic" as const, label: "Romantic", emoji: "💕" },
                  { id: "marriage" as const, label: "Marriage", emoji: "💍" },
                  { id: "friendship" as const, label: "Friendship", emoji: "🤝" },
                  { id: "professional" as const, label: "Business", emoji: "💼" },
                ]).map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setRelationshipType(type.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-center transition-all border press-scale ${
                      relationshipType === type.id
                        ? "border-[#D4A054]/40 bg-[#D4A054]/10"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <span className="text-lg">{type.emoji}</span>
                    <span className={`text-[10px] font-medium ${
                      relationshipType === type.id ? "text-[#D4A054]" : "text-[#8A8F9E]"
                    }`}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1">
                How It Works
              </h3>
              {[
                { step: "1", title: "Enter partner's birth details", desc: "Name, date, time & place of birth" },
                { step: "2", title: "AI analyzes both charts", desc: "Ashtakoot matching + planetary aspects" },
                { step: "3", title: "Get your compatibility score", desc: "Detailed breakdown across 6 life areas" },
              ].map((item) => (
                <div key={item.step} className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4A054]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#D4A054]">{item.step}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F1F0F5]">{item.title}</p>
                    <p className="text-xs text-[#8A8F9E]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="glass-inner rounded-xl p-3 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#D4A054] flex-shrink-0" />
              <p className="text-xs text-[#8A8F9E] leading-relaxed">
                <span className="text-[#D4A054] font-medium">Free:</span> Overall score + 3 sections.{" "}
                <span className="text-[#D4A054] font-medium">Premium:</span> All 6 sections with deep analysis.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Partner Input Form ── */}
        <AnimatePresence>
          {showPartnerForm && (
            <PartnerInputForm
              onSubmit={generateCompatibility}
              onClose={() => setShowPartnerForm(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Loading State ── */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-[#D4A054]/20 flex items-center justify-center">
                <Heart className="w-10 h-10 text-[#D4A054] animate-pulse" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-t-[#D4A054] border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-[#F1F0F5]">Analyzing cosmic compatibility...</p>
              <p className="text-xs text-[#8A8F9E]">Comparing birth charts & planetary positions</p>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Score Hero */}
            <div className="glass-card-hero rounded-2xl p-6 text-center space-y-3">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#D4A054]/10 flex items-center justify-center mx-auto mb-1">
                    <User className="w-5 h-5 text-[#D4A054]" />
                  </div>
                  <span className="text-xs text-[#8A8F9E]">{userData?.name || "You"}</span>
                </div>
                <Heart className="w-5 h-5 text-[#D4A054]" />
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#D4A054]/10 flex items-center justify-center mx-auto mb-1">
                    <Users className="w-5 h-5 text-[#D4A054]" />
                  </div>
                  <span className="text-xs text-[#8A8F9E]">{partnerData?.name || "Partner"}</span>
                </div>
              </div>

              <div className="score-dial-glow flex items-center justify-center">
                <ScoreDial score={result.overallScore} label="Overall Compatibility" />
              </div>

              <p className="text-sm font-medium text-[#F1F0F5]">{result.headline}</p>
              <p className="text-xs text-[#8A8F9E] leading-relaxed">{result.advice}</p>
            </div>

            <div className="section-divider" />

            {/* Section Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#8A8F9E] uppercase tracking-wider px-1">
                Detailed Breakdown
              </h3>
              {result.sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onAsk={onAskQuestion}
                  onUnlock={onPricingClick}
                />
              ))}
            </div>

            {/* Ask About Compatibility */}
            <button
              onClick={() => onAskQuestion(`What should ${userData?.name || "I"} and ${partnerData?.name || "my partner"} focus on to strengthen our relationship?`)}
              className="w-full glass-card rounded-xl p-4 flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A054]/20 to-[#D4A054]/5
                flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-[#D4A054]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#F1F0F5]">Ask about your compatibility</p>
                <p className="text-xs text-[#8A8F9E]">Get personalized relationship advice</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5A6478] group-hover:text-[#D4A054] transition-colors" />
            </button>

            {/* Try Another */}
            <button
              onClick={() => {
                setResult(null)
                setPartnerData(null)
                setShowPartnerForm(true)
              }}
              className="w-full py-3 rounded-xl text-sm font-medium text-[#D4A054]
                border border-[#D4A054]/20 hover:border-[#D4A054]/40
                hover:bg-[#D4A054]/5 transition-all"
            >
              Check with another person
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
