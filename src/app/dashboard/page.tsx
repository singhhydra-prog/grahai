"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Sparkles,
  Sun,
  Moon,
  Star,
  Compass,
  MessageCircle,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  Crown,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
  full_name: string
  display_name: string
  interests: string[]
  subscription_tier: string
  birth_date: string | null
}

const VERTICALS = [
  {
    id: "astrology",
    name: "Vedic Astrology",
    nameHi: "ज्योतिष",
    icon: Sun,
    color: "from-saffron/20 to-saffron/5",
    border: "border-saffron/20",
    iconColor: "text-saffron",
    desc: "Kundli, Dasha, transits",
    emoji: "♈",
  },
  {
    id: "numerology",
    name: "Numerology",
    nameHi: "अंकशास्त्र",
    icon: Star,
    color: "from-mint/20 to-mint/5",
    border: "border-mint/20",
    iconColor: "text-mint",
    desc: "Life path, destiny numbers",
    emoji: "🔢",
  },
  {
    id: "tarot",
    name: "Tarot Reading",
    nameHi: "टैरो",
    icon: Moon,
    color: "from-[#7B68EE]/20 to-[#7B68EE]/5",
    border: "border-[#7B68EE]/20",
    iconColor: "text-[#7B68EE]",
    desc: "Card spreads & guidance",
    emoji: "🃏",
  },
  {
    id: "vastu",
    name: "Vastu Shastra",
    nameHi: "वास्तु",
    icon: Compass,
    color: "from-gold-light/20 to-gold-light/5",
    border: "border-gold-light/20",
    iconColor: "text-gold-light",
    desc: "Space harmony analysis",
    emoji: "🏠",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadingState, setLoadingState] = useState(true)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileData) setProfile(profileData)
      setLoadingState(false)
    }
    load()
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
  }

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  if (loadingState) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-deep-space">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-8 w-8 animate-pulse text-saffron" />
          <p className="text-sm text-cosmic-white/40">Loading your cosmos...</p>
        </div>
      </main>
    )
  }

  const displayName = profile?.display_name || profile?.full_name?.split(" ")[0] || "Explorer"
  const tier = profile?.subscription_tier || "free"

  return (
    <main className="min-h-screen bg-deep-space">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-indigo/20 bg-deep-space/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-saffron" />
            <span className="font-bold text-cosmic-white">
              Grah<span className="text-saffron">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 text-cosmic-white/40 transition-colors hover:bg-indigo/20 hover:text-cosmic-white">
              <History className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-cosmic-white/40 transition-colors hover:bg-indigo/20 hover:text-cosmic-white">
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-2 text-cosmic-white/40 transition-colors hover:bg-error/10 hover:text-error"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-cosmic-white">
            {getGreeting()},{" "}
            <span className="gradient-text">{displayName}</span>
          </h1>
          <p className="mt-2 text-cosmic-white/40">
            What would you like to explore today?
          </p>
          {tier === "free" && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-saffron/20 bg-saffron/5 px-4 py-1.5 text-xs">
              <Crown className="h-3.5 w-3.5 text-saffron" />
              <span className="text-saffron/80">Free Plan</span>
              <span className="text-cosmic-white/30">·</span>
              <a href="#" className="font-medium text-saffron hover:underline">
                Upgrade for unlimited readings
              </a>
            </div>
          )}
        </motion.div>

        {/* Quick Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="group cursor-pointer rounded-2xl border border-indigo/30 bg-navy-light/30 p-6 transition-all hover:border-saffron/30 hover:bg-navy-light/50">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-saffron/10 p-3">
                <MessageCircle className="h-6 w-6 text-saffron" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-cosmic-white">
                  Ask anything about your stars
                </h2>
                <p className="mt-0.5 text-sm text-cosmic-white/40">
                  Chat with our AI for personalized insights across all
                  verticals
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-cosmic-white/20 transition-colors group-hover:text-saffron" />
            </div>
          </div>
        </motion.div>

        {/* Verticals Grid */}
        <div className="mb-10">
          <h2 className="mb-5 text-lg font-semibold text-cosmic-white">
            Explore Readings
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICALS.map((v, i) => {
              const Icon = v.icon
              const isInterested = profile?.interests?.includes(v.id)
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className={`group cursor-pointer rounded-2xl border ${v.border} bg-gradient-to-br ${v.color} p-6 transition-all hover:scale-[1.03]`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="text-3xl">{v.emoji}</span>
                    {isInterested && (
                      <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-medium text-saffron">
                        Your pick
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-cosmic-white">{v.name}</h3>
                  <p className="font-[family-name:var(--font-devanagari)] text-xs text-saffron/50">
                    {v.nameHi}
                  </p>
                  <p className="mt-2 text-sm text-cosmic-white/40">{v.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-saffron/60 transition-colors group-hover:text-saffron">
                    Start Reading
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="mb-5 text-lg font-semibold text-cosmic-white">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                label: "Daily Horoscope",
                desc: "Today's cosmic energy",
                color: "text-saffron",
              },
              {
                icon: Star,
                label: "Compatibility Check",
                desc: "Match your stars",
                color: "text-mint",
              },
              {
                icon: Moon,
                label: "Moon Phase",
                desc: "Lunar insights today",
                color: "text-[#7B68EE]",
              },
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="group cursor-pointer rounded-xl border border-indigo/20 bg-navy-light/20 p-5 transition-all hover:border-indigo/40 hover:bg-navy-light/40"
                >
                  <Icon className={`mb-3 h-5 w-5 ${action.color}`} />
                  <h3 className="text-sm font-medium text-cosmic-white">
                    {action.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-cosmic-white/30">
                    {action.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Recent Readings (placeholder) */}
        <div>
          <h2 className="mb-5 text-lg font-semibold text-cosmic-white">
            Recent Readings
          </h2>
          <div className="rounded-2xl border border-indigo/20 bg-navy-light/10 p-12 text-center">
            <History className="mx-auto mb-3 h-8 w-8 text-cosmic-white/20" />
            <p className="text-sm text-cosmic-white/30">
              No readings yet. Start exploring to see your history here.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
