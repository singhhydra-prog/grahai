"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Users, MessageCircle, TrendingUp, CreditCard,
  Activity, RefreshCw, AlertTriangle, BarChart3
} from "lucide-react"

/* ════════════════════════════════════════════════════════
   FOUNDER ANALYTICS DASHBOARD

   Per Execution Document Section 15 — Weekly founder dashboard:
   - Onboarding conversion
   - DAU / WAU
   - Question volume
   - Free to paid conversion
   - Report sales
   - Route / shell issues
   - Top user themes
   ════════════════════════════════════════════════════════ */

interface DashboardData {
  onboarding: { started: number; completed: number; rate: number }
  engagement: { dau: number; wau: number; questionsToday: number; questionsWeek: number }
  monetization: { paywallViews: number; upgrades: number; conversionRate: number; reportPurchases: number }
  topThemes: Array<{ theme: string; count: number }>
  errors: Array<{ type: string; count: number }>
}

function StatCard({ label, value, icon: Icon, subtext, color }: {
  label: string; value: string | number; icon: typeof Users; subtext?: string; color: string
}) {
  return (
    <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] text-[#8892A3] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-[#F1F0F5]">{value}</p>
      {subtext && <p className="text-[10px] text-[#8892A3] mt-0.5">{subtext}</p>}
    </div>
  )
}

export default function FounderDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month">("today")

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/dashboard?timeframe=${timeframe}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch {
      // Dashboard will show placeholder data
    } finally {
      setLoading(false)
    }
  }, [timeframe])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // Placeholder data when API isn't ready yet
  const d = data || {
    onboarding: { started: 0, completed: 0, rate: 0 },
    engagement: { dau: 0, wau: 0, questionsToday: 0, questionsWeek: 0 },
    monetization: { paywallViews: 0, upgrades: 0, conversionRate: 0, reportPurchases: 0 },
    topThemes: [],
    errors: [],
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#F1F0F5]">Founder Dashboard</h1>
          <p className="text-xs text-[#8892A3]">GrahAI — Real-time metrics</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="w-8 h-8 rounded-lg bg-[#1E2638] border border-[#1E293B]
            flex items-center justify-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8892A3] ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Timeframe selector */}
      <div className="flex gap-2 mb-5">
        {(["today", "week", "month"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeframe === tf
                ? "bg-[#D4A054]/15 text-[#D4A054] border border-[#D4A054]/30"
                : "bg-[#111827] text-[#8892A3] border border-[#1E293B]"
            }`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      {/* Onboarding section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#F1F0F5] mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-400" />
          Onboarding
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Started" value={d.onboarding.started}
            icon={Users} color="bg-teal-500/10 text-teal-400" />
          <StatCard label="Completed" value={d.onboarding.completed}
            icon={Users} color="bg-emerald-500/10 text-emerald-400" />
          <StatCard label="Conv. Rate" value={`${(d.onboarding.rate * 100).toFixed(1)}%`}
            icon={TrendingUp} color="bg-blue-500/10 text-blue-400" />
        </div>
      </div>

      {/* Engagement section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#F1F0F5] mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          Engagement
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="DAU" value={d.engagement.dau}
            icon={Users} color="bg-amber-500/10 text-amber-400" />
          <StatCard label="WAU" value={d.engagement.wau}
            icon={Users} color="bg-orange-500/10 text-orange-400" />
          <StatCard label="Questions Today" value={d.engagement.questionsToday}
            icon={MessageCircle} color="bg-[#D4A054]/10 text-[#D4A054]" />
          <StatCard label="Questions This Week" value={d.engagement.questionsWeek}
            icon={MessageCircle} color="bg-[#D4A054]/10 text-[#D4A054]" />
        </div>
      </div>

      {/* Monetization section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#F1F0F5] mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          Monetization
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Paywall Views" value={d.monetization.paywallViews}
            icon={BarChart3} color="bg-rose-500/10 text-rose-400" />
          <StatCard label="Upgrades" value={d.monetization.upgrades}
            icon={TrendingUp} color="bg-emerald-500/10 text-emerald-400" />
          <StatCard label="Conv. Rate" value={`${(d.monetization.conversionRate * 100).toFixed(1)}%`}
            icon={TrendingUp} color="bg-blue-500/10 text-blue-400" />
          <StatCard label="Report Sales" value={d.monetization.reportPurchases}
            icon={CreditCard} color="bg-[#D4A054]/10 text-[#D4A054]" />
        </div>
      </div>

      {/* Top Themes */}
      {d.topThemes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#F1F0F5] mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#D4A054]" />
            Top User Themes
          </h2>
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 space-y-2">
            {d.topThemes.map((theme, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-[#ACB8C4]">{theme.theme}</span>
                <span className="text-xs font-medium text-[#D4A054]">{theme.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {d.errors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#F1F0F5] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Issues
          </h2>
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-2">
            {d.errors.map((err, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-rose-400">{err.type}</span>
                <span className="text-xs font-medium text-rose-400">{err.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-4 pb-8 border-t border-[#1E293B]">
        <p className="text-[10px] text-[#8892A3]">
          GrahAI Founder Dashboard — Data refreshes on page load
        </p>
      </div>
    </div>
  )
}
