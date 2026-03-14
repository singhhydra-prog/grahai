"use client"

import { useState, useEffect } from "react"
import { Menu, Plus, Edit3 } from "lucide-react"
import type { BirthData } from "@/types/app"

interface AppHeaderProps {
  onMenuClick?: () => void
  onProfileClick?: () => void
  onAddMember?: () => void
}

export default function AppHeader({
  onMenuClick,
  onProfileClick,
  onAddMember,
}: AppHeaderProps) {
  const [name, setName] = useState("Guest")
  const [initials, setInitials] = useState("G")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("grahai-onboarding-birthdata")
      if (stored) {
        const data = JSON.parse(stored) as BirthData
        const n = data.name || "Guest"
        setName(n.split(" ")[0])
        const parts = n.split(" ")
        setInitials(
          parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : n.substring(0, 2).toUpperCase()
        )
      }
    } catch {}
  }, [])

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Hamburger menu */}
      <button
        onClick={onMenuClick}
        className="relative w-11 h-11 rounded-full bg-[#2A2A40] flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-white/70" />
        {/* Notification dot */}
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#080818]" />
      </button>

      {/* Avatar with pink ring */}
      <button
        onClick={onProfileClick}
        className="flex flex-col items-center gap-1"
      >
        <div className="relative">
          {/* Pink ring */}
          <div className="w-16 h-16 rounded-full border-2 border-pink-500/60 flex items-center justify-center">
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-pink-600 to-pink-800
              flex items-center justify-center text-lg font-bold text-white">
              {initials}
            </div>
          </div>
          {/* Edit badge */}
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-pink-500
            flex items-center justify-center">
            <Edit3 className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <span className="text-xs text-white/70 font-medium">{name}</span>
      </button>

      {/* Add Member */}
      <button
        onClick={onAddMember}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-16 h-16 rounded-full bg-[#2A2A40] flex items-center justify-center">
          <Plus className="w-6 h-6 text-white/40" />
        </div>
        <span className="text-xs text-white/40 font-medium">Add Member</span>
      </button>
    </div>
  )
}
