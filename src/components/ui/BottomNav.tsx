"use client"

import { Home, MessageCircle, Compass, FileText, User } from "lucide-react"
import type { TabType } from "@/types/app"

const TABS: { id: TabType; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "ask", label: "Ask", Icon: MessageCircle },
  { id: "chart", label: "My Chart", Icon: Compass },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "profile", label: "Profile", Icon: User },
]

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full
                transition-all duration-200"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`w-[22px] h-[22px] transition-all duration-200 ${
                  isActive ? "text-[#D4A054]" : "text-[#5A6478]"
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                isActive ? "text-[#D4A054]" : "text-[#5A6478]"
              }`}>
                {label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5
                  rounded-full bg-[#D4A054]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
