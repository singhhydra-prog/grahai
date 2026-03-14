"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Globe,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Edit3,
  Star,
  Zap,
  Calendar,
} from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import type { BirthData, UserProfile, OverlayType } from "@/types/app"

const SETTINGS_ITEMS = [
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Globe, label: "Language", id: "language" },
  { icon: Shield, label: "Data & Privacy", id: "privacy" },
  { icon: HelpCircle, label: "Help & Support", id: "help" },
]

interface ProfileTabProps {
  onShowOverlay?: (overlay: OverlayType) => void
}

export default function ProfileTab({ onShowOverlay }: ProfileTabProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    plan: "free",
    questionsToday: 0,
    streakDays: 0,
    joinedAt: "",
  })
  const [birthData, setBirthData] = useState<BirthData | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        setBirthData(data)
        setProfile((prev) => ({ ...prev, name: data.name }))
      }
      const name = localStorage.getItem("userNameForGreeting")
      if (name) setProfile((prev) => ({ ...prev, name }))
    } catch {}

    // Try to fetch real profile
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.email) {
          setProfile((prev) => ({
            ...prev,
            email: data.email,
            plan: data.plan || "free",
          }))
        }
      })
      .catch(() => {})

    // Try entitlements
    fetch("/api/user/entitlements")
      .then((r) => r.json())
      .then((data) => {
        if (data?.plan) {
          setProfile((prev) => ({ ...prev, plan: data.plan }))
        }
      })
      .catch(() => {})
  }, [])

  const initial = profile.name?.charAt(0)?.toUpperCase() || "?"
  const planColors = {
    free: "text-text-dim bg-bg-elevated",
    plus: "text-magenta bg-magenta/10",
    premium: "text-cyan bg-cyan/10",
  }

  return (
    <div className="min-h-full px-4 pt-3 pb-24 max-w-lg mx-auto">
      {/* ═══ Profile Header ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-magenta to-violet flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-text truncate">
            {profile.name || "Set up your profile"}
          </h1>
          {profile.email && (
            <p className="text-xs text-text-dim truncate">{profile.email}</p>
          )}
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
              planColors[profile.plan]
            }`}
          >
            {profile.plan} plan
          </span>
        </div>
      </motion.div>

      {/* ═══ Stats Row ═══ */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Zap className="w-4 h-4 text-magenta" />, value: `${profile.questionsToday}`, label: "Questions today" },
          { icon: <Calendar className="w-4 h-4 text-cyan" />, value: `${profile.streakDays}`, label: "Day streak" },
          { icon: <Star className="w-4 h-4 text-gold" />, value: profile.plan, label: "Current plan" },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={0.1 + i * 0.05} className="text-center py-3">
            <div className="flex justify-center mb-1">{stat.icon}</div>
            <p className="text-sm font-semibold text-text capitalize">{stat.value}</p>
            <p className="text-[10px] text-text-dim mt-0.5">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* ═══ Birth Details ═══ */}
      <GlassCard className="mb-4" delay={0.2}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text">Birth Details</h3>
          <button className="text-xs text-magenta font-medium flex items-center gap-1">
            <Edit3 className="w-3 h-3" />
            Edit
          </button>
        </div>
        {birthData ? (
          <div className="space-y-2">
            {[
              { label: "Date of Birth", value: birthData.dateOfBirth },
              { label: "Time of Birth", value: birthData.timeOfBirth },
              { label: "Place of Birth", value: birthData.placeOfBirth },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-xs text-text-dim">{item.label}</span>
                <span className="text-xs text-text font-medium">{item.value || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-text-dim mb-3">
              Add your birth details for accurate readings
            </p>
            <button className="btn-primary px-4 py-2 text-xs">Add Birth Details</button>
          </div>
        )}
      </GlassCard>

      {/* ═══ Upgrade CTA (free users) ═══ */}
      {profile.plan === "free" && (
        <GlassCard glow="magenta" className="mb-4 text-center" delay={0.25}>
          <h3 className="text-sm font-semibold text-text mb-1">Upgrade to Plus</h3>
          <p className="text-xs text-text-dim mb-3">
            Unlimited questions, all reports, priority responses
          </p>
          <button className="btn-primary px-5 py-2 text-sm">
            ₹199/month · Get Plus
          </button>
        </GlassCard>
      )}

      {/* ═══ Settings List ═══ */}
      <div className="space-y-1 mb-6">
        {SETTINGS_ITEMS.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
              hover:bg-bg-card transition-colors text-left"
          >
            <item.icon className="w-4.5 h-4.5 text-text-dim" />
            <span className="text-sm text-text flex-1">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-text-dim" />
          </motion.button>
        ))}
      </div>

      {/* ═══ Sign Out ═══ */}
      <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
        hover:bg-error/5 transition-colors text-left">
        <LogOut className="w-4.5 h-4.5 text-error/70" />
        <span className="text-sm text-error/70">Sign Out</span>
      </button>

      {/* ═══ Footer ═══ */}
      <p className="text-center text-[10px] text-text-dim/50 mt-6">
        GrahAI v2.0 · Made with 🤍 in India
      </p>
    </div>
  )
}
