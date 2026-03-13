"use client"

import { motion } from "framer-motion"
import type { TabType } from "@/types/app"

// ─── Bottom Navigation ─────────────────────────
// 5 tabs: Home, Ask, My Chart, Reports, Profile
// Minimal, calm, no flashy animations.

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const TABS: { id: TabType; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#C9A24D" : "#8A8690"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "ask",
    label: "Ask",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#C9A24D" : "#8A8690"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: "mychart",
    label: "My Chart",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#C9A24D" : "#8A8690"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "Reports",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#C9A24D" : "#8A8690"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#C9A24D" : "#8A8690"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg/80 backdrop-blur-xl border-t border-white/[0.04] safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-14">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors"
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.icon(isActive)}
              <span
                className={`text-[9px] font-medium tracking-wide transition-colors ${
                  isActive ? "text-gold" : "text-text-dim/50"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
