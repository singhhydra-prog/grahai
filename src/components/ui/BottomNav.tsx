"use client"

import { useState, useRef, useEffect } from "react"
import { Home, MessageCircle, Heart, FileText, User } from "lucide-react"
import type { TabType } from "@/types/app"
import { useLanguage } from "@/lib/LanguageContext"

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage()
  const [tappedTab, setTappedTab] = useState<TabType | null>(null)
  const prevTab = useRef(activeTab)

  useEffect(() => {
    if (activeTab !== prevTab.current) {
      setTappedTab(activeTab)
      const timer = setTimeout(() => setTappedTab(null), 500)
      prevTab.current = activeTab
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  const TABS: { id: TabType; label: string; Icon: typeof Home }[] = [
    { id: "home", label: t.nav.home, Icon: Home },
    { id: "ask", label: t.nav.ask, Icon: MessageCircle },
    { id: "compatibility", label: t.nav.compatibility, Icon: Heart },
    { id: "reports", label: t.nav.reports, Icon: FileText },
    { id: "profile", label: t.nav.profile, Icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          const justTapped = tappedTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full
                transition-all duration-200 haptic-tap"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={`relative transition-transform duration-300 ${
                justTapped ? "nav-icon-pop" : ""
              } ${isActive ? "nav-icon-active" : ""}`}>
                <Icon
                  className={`w-[22px] h-[22px] transition-all duration-300 ${
                    isActive ? "text-[#D4A054] drop-shadow-[0_0_6px_rgba(212,160,84,0.4)]" : "text-[#8892A3]"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${
                isActive ? "text-[#D4A054] text-glow" : "text-[#8892A3]"
              }`}>
                {label}
              </span>

              {/* Active glow indicator */}
              {isActive && (
                <>
                  <div className="nav-glow-dot nav-dot-enter" />
                  <div className="nav-reflection" />
                </>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
