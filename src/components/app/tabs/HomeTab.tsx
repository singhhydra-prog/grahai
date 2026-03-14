"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, ChevronDown, Sparkles, Moon, Sun, Star, TrendingUp } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import SectionHeader from "@/components/ui/SectionHeader"
import SplineScene from "@/components/ui/SplineScene"
import type { TabType, BirthData, CosmicSnapshot, DailyInsight } from "@/types/app"

/* ═══ Placeholder data ═══ */
const PLACEHOLDER_INSIGHTS: DailyInsight[] = [
  {
    title: "Career momentum building",
    body: "Jupiter's transit through your 10th house signals professional growth. Trust your instincts in meetings today.",
    category: "Career",
    icon: "💼",
  },
  {
    title: "Emotional clarity ahead",
    body: "Moon in Pushya nakshatra brings nurturing energy. A good day to resolve pending conversations.",
    category: "Relationships",
    icon: "💜",
  },
  {
    title: "Financial caution",
    body: "Saturn aspects your 2nd house — avoid impulsive purchases. Savings made today compound beautifully.",
    category: "Wealth",
    icon: "💰",
  },
]

const QUICK_QUESTIONS = [
  "How will my week look?",
  "Is today good for decisions?",
  "What should I focus on?",
  "Will I hear good news soon?",
]

interface HomeTabProps {
  onTabChange: (tab: TabType) => void
}

export default function HomeTab({ onTabChange }: HomeTabProps) {
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const [userName, setUserName] = useState("")
  const [snapshot, setSnapshot] = useState<CosmicSnapshot | null>(null)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Load user data from localStorage
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        setBirthData(data)
        setUserName(data.name?.split(" ")[0] || "")
      }
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      if (snap) setSnapshot(JSON.parse(snap))
    } catch {}

    // Update time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  })()

  const handleQuickQuestion = (q: string) => {
    localStorage.setItem("grahai-pending-question", q)
    onTabChange("ask")
  }

  return (
    <div className="min-h-full px-4 pt-2 pb-24 max-w-lg mx-auto">
      {/* ═══ Header ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-xl font-bold text-text">
            {greeting}{userName ? `, ${userName}` : ""} ✨
          </h1>
          <p className="text-xs text-text-dim mt-0.5">{currentTime} · Your cosmic day</p>
        </div>
        <button className="relative w-10 h-10 rounded-full glass-card flex items-center justify-center">
          <Bell className="w-4.5 h-4.5 text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-magenta rounded-full" />
        </button>
      </motion.div>

      {/* ═══ Spline 3D Hero / Cosmic Orb ═══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="cosmic-border rounded-3xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-bg-card via-bg to-bg-card">
            <SplineScene
              sceneUrl="" /* Add your Spline scene URL here */
              className="absolute inset-0"
            />
            {/* Overlay content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-xs uppercase tracking-widest text-magenta/80 font-medium mb-2">
                Today&apos;s Energy
              </p>
              <h2 className="text-2xl font-bold cosmic-gradient-text mb-1">
                {snapshot?.moonSign || "Cosmic Alignment"}
              </h2>
              <p className="text-xs text-text-secondary max-w-[280px]">
                {snapshot?.briefInsight ||
                  "The stars are aligning in your favor. Tap to explore your personalized insights."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Quick Stats Row ═══ */}
      {snapshot && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Moon className="w-4 h-4 text-cyan" />, label: "Moon Sign", value: snapshot.moonSign },
            { icon: <Star className="w-4 h-4 text-gold" />, label: "Lucky No.", value: `${snapshot.luckyNumber}` },
            { icon: <TrendingUp className="w-4 h-4 text-magenta" />, label: "Planet", value: snapshot.dominantPlanet },
          ].map((stat, i) => (
            <GlassCard key={stat.label} delay={0.15 + i * 0.05} className="text-center py-3">
              <div className="flex justify-center mb-1.5">{stat.icon}</div>
              <p className="text-xs text-text-dim">{stat.label}</p>
              <p className="text-sm font-semibold text-text mt-0.5">{stat.value}</p>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ═══ Quick Ask ═══ */}
      <SectionHeader title="Quick Ask" subtitle="Tap a question or ask your own" />
      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_QUESTIONS.map((q) => (
          <motion.button
            key={q}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickQuestion(q)}
            className="glass-card rounded-full px-4 py-2 text-xs text-text-secondary
              hover:border-magenta/30 hover:text-text transition-colors"
          >
            {q}
          </motion.button>
        ))}
      </div>

      {/* ═══ Today's Insights ═══ */}
      <SectionHeader title="Today's Insights" subtitle="Personalized for your chart" />
      <div className="space-y-3 mb-6">
        {PLACEHOLDER_INSIGHTS.map((insight, i) => (
          <GlassCard key={insight.title} delay={0.2 + i * 0.08}>
            <div className="flex gap-3">
              <div className="text-2xl">{insight.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text">{insight.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-magenta/70 font-medium">
                    {insight.category}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{insight.body}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ═══ Explore Vaani CTA ═══ */}
      <GlassCard glow="magenta" className="text-center" delay={0.4}>
        <Sparkles className="w-6 h-6 text-magenta mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-text mb-1">Ask Vaani anything</h3>
        <p className="text-xs text-text-dim mb-3">
          Your AI astrology companion, trained on Vedic wisdom
        </p>
        <button
          onClick={() => onTabChange("ask")}
          className="btn-primary px-6 py-2.5 text-sm"
        >
          Start a conversation
        </button>
      </GlassCard>
    </div>
  )
}
