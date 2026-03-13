"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SectionHeader, FounderNote } from "@/components/ui"
import type { OverlayType } from "@/types/app"

// ═══════════════════════════════════════════════════
// INTERNAL TYPES
// ═══════════════════════════════════════════════════

interface ProfileData {
  name: string
  email?: string
  plan: "free" | "plus" | "premium"
  questionsToday: number
  questionsLimit: number
  streakDays: number
  birthData?: {
    date: string
    time: string
    place: string
  }
}

// ═══════════════════════════════════════════════════
// PROFILE TAB
// ═══════════════════════════════════════════════════

export default function ProfileTab({
  onShowOverlay,
}: {
  onShowOverlay: (o: OverlayType) => void
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    try {
      const name = localStorage.getItem("userNameForGreeting") || "You"
      const snap = localStorage.getItem("grahai-cosmic-snapshot")
      const birthRaw = localStorage.getItem("grahai-onboarding-birthdata")
      const parsed = snap ? JSON.parse(snap) : null
      const birth = birthRaw ? JSON.parse(birthRaw) : null

      setProfile({
        name,
        plan: "free",
        questionsToday: 0,
        questionsLimit: 3,
        streakDays: 0,
        birthData: birth ? {
          date: birth.date || "",
          time: birth.time || "",
          place: birth.place || birth.city || "",
        } : undefined,
      })

      // Try to get real plan from API
      void fetch("/api/user/entitlements").then(r => r.json()).then(data => {
        if (data?.plan) {
          setProfile(prev => prev ? { ...prev, plan: data.plan } : prev)
        }
        if (data?.question_limit !== undefined) {
          setProfile(prev => prev ? { ...prev, questionsLimit: data.question_limit } : prev)
        }
      }).catch(() => {})

      void parsed
    } catch { /* ignore */ }
  }, [])

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  const PLAN_LABELS: Record<string, { label: string; color: string }> = {
    free: { label: "Free", color: "text-text-dim/60 bg-white/[0.04]" },
    plus: { label: "Plus", color: "text-gold bg-gold/10" },
    premium: { label: "Premium", color: "text-saffron bg-saffron/10" },
  }

  const planInfo = PLAN_LABELS[profile.plan] || PLAN_LABELS.free

  return (
    <div className="overflow-y-auto h-full tab-content">

      {/* ─── Profile Header ─── */}
      <section className="px-5 pt-6 pb-2">
        <div className="rounded-2xl border border-white/[0.04] bg-bg-card/40 p-5">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar circle */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-saffron/10 border border-gold/20 flex items-center justify-center">
              <span className="text-xl font-semibold text-gold">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-text truncate">{profile.name}</h2>
              {profile.email && (
                <p className="text-[11px] text-text-dim/40 truncate">{profile.email}</p>
              )}
              <span className={`inline-block mt-1 text-[9px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full ${planInfo.color}`}>
                {planInfo.label}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-xl bg-white/[0.02]">
              <p className="text-sm font-semibold text-text">{profile.questionsToday}/{profile.questionsLimit}</p>
              <p className="text-[9px] uppercase tracking-wider text-text-dim/40 mt-0.5">Today</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/[0.02]">
              <p className="text-sm font-semibold text-text">{profile.streakDays}</p>
              <p className="text-[9px] uppercase tracking-wider text-text-dim/40 mt-0.5">Streak</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/[0.02]">
              <p className="text-sm font-semibold text-gold">{profile.plan === "free" ? "Upgrade" : "Active"}</p>
              <p className="text-[9px] uppercase tracking-wider text-text-dim/40 mt-0.5">Plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Birth Details ─── */}
      <section className="px-5 pt-6">
        <SectionHeader label="Your data" title="Birth Details" />
        {profile.birthData ? (
          <div className="rounded-2xl border border-white/[0.04] bg-bg-card/40 p-5 space-y-3">
            {[
              { label: "Date", value: profile.birthData.date },
              { label: "Time", value: profile.birthData.time },
              { label: "Place", value: profile.birthData.place },
            ].filter(i => i.value).map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-text-dim/40 font-medium">{item.label}</span>
                <span className="text-xs text-text">{item.value}</span>
              </div>
            ))}
            <button
              onClick={() => onShowOverlay("onboarding")}
              className="text-[11px] text-gold/60 hover:text-gold transition-colors mt-2"
            >
              Edit birth details
            </button>
          </div>
        ) : (
          <button
            onClick={() => onShowOverlay("onboarding")}
            className="w-full text-left rounded-2xl border border-dashed border-gold/20 bg-gold/[0.02] p-5"
          >
            <p className="text-sm font-semibold text-text mb-1">Add birth details</p>
            <p className="text-xs text-text-dim/60">Required for personalized chart analysis and reports.</p>
          </button>
        )}
      </section>

      {/* ─── Plan & Upgrade ─── */}
      {profile.plan === "free" && (
        <section className="px-5 pt-6">
          <SectionHeader label="Your plan" title="Get More From GrahAI" />
          <motion.button
            onClick={() => onShowOverlay("pricing")}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl border border-gold/15 bg-gradient-to-br from-gold/[0.06] to-saffron/[0.03] p-5 text-left"
          >
            <h3 className="text-sm font-semibold text-text mb-1">Upgrade to Plus</h3>
            <p className="text-xs text-text-dim/60 leading-relaxed mb-3">
              Unlimited questions, priority answers, full report access, and deeper chart analysis.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gold">₹199/mo</span>
              <span className="text-xs text-gold/70 font-medium">See plans →</span>
            </div>
          </motion.button>
        </section>
      )}

      {/* ─── Settings ─── */}
      <section className="px-5 pt-6">
        <SectionHeader title="Settings" />
        <div className="rounded-2xl border border-white/[0.04] bg-bg-card/40 overflow-hidden">
          {[
            { label: "Notifications", detail: "Daily insights", action: () => {} },
            { label: "Language", detail: "English", action: () => {} },
            { label: "Data & Privacy", detail: "Your data is stored locally", action: () => {} },
            { label: "Help & Support", detail: "FAQs and contact", action: () => {} },
          ].map((item, idx) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors ${
                idx < 3 ? "border-b border-white/[0.03]" : ""
              }`}
            >
              <span className="text-xs font-medium text-text">{item.label}</span>
              <span className="text-[11px] text-text-dim/40">{item.detail}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Founder Note ─── */}
      <section className="px-5 pt-8 pb-8">
        <FounderNote />
      </section>
    </div>
  )
}
