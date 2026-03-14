"use client"

import { useEffect, useState } from "react"

interface AppHeaderProps {
  onProfileClick?: () => void
  subtitle?: string
}

export default function AppHeader({ onProfileClick, subtitle }: AppHeaderProps) {
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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A054] to-[#A16E2A]
            flex items-center justify-center shadow-lg shadow-[#D4A054]/10">
            <span className="text-[#0A0E1A] font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#F1F0F5] leading-tight">
              {name ? `Hello, ${name}` : "GrahAI"}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-[#5A6478] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Avatar */}
        <button
          onClick={onProfileClick}
          className="w-9 h-9 rounded-full bg-[#1E2638] border border-[#D4A054]/20
            flex items-center justify-center transition-all hover:border-[#D4A054]/40"
        >
          <span className="text-[11px] font-semibold text-[#D4A054]">
            {initials || "?"}
          </span>
        </button>
      </div>
    </header>
  )
}
