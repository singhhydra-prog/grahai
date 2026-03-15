"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/LanguageContext"

interface AppHeaderProps {
  onProfileClick?: () => void
  subtitle?: string
}

export default function AppHeader({ onProfileClick, subtitle }: AppHeaderProps) {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [initials, setInitials] = useState("")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userNameForGreeting")
      if (stored) {
        setName(stored)
        const parts = stored.trim().split(" ")
        setInitials(
          parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase()
        )
      }
    } catch {}
  }, [])

  return (
    <header className="px-5 pt-3 pb-2">
      <div className="flex items-center justify-between">
        {/* Logo + greeting */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A054] to-[#A16E2A]
            flex items-center justify-center gold-shimmer relative
            shadow-[0_4px_16px_rgba(212,160,84,0.25)]">
            <span className="text-[#0A0E1A] font-bold text-sm relative z-10">G</span>
          </div>
          <div>
            <h1
              className="text-base font-bold leading-tight"
              style={{
                background: "linear-gradient(270deg, #E8C278, #D4A054, #F59E0B, #E8C278, #D4A054)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient-text-flow 4s ease-in-out infinite",
              }}
            >
              {name ? `${t.home?.greeting || "Hello"}, ${name}` : "GrahAI"}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-[#8892A3] mt-0.5 text-visible">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Avatar with glow ring */}
        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full glass-card
            flex items-center justify-center transition-all
            hover:shadow-[0_0_20px_rgba(212,160,84,0.15)]
            border border-[#D4A054]/15 hover:border-[#D4A054]/35"
        >
          <span className="text-[11px] font-bold text-[#D4A054] relative z-10">
            {initials || "?"}
          </span>
        </button>
      </div>
    </header>
  )
}
