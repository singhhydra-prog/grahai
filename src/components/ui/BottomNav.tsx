"use client"

import { Heart, MessageCircle, FileText } from "lucide-react"
import type { TabType } from "@/types/app"

const TABS: { id: TabType; label: string; Icon: typeof Heart; badge?: string }[] = [
  { id: "compatibility", label: "Compatibility", Icon: Heart },
  { id: "questions", label: "Questions", Icon: MessageCircle },
  { id: "reports", label: "Reports", Icon: FileText, badge: "FREE" },
]

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080818] border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {TABS.map(({ id, label, Icon, badge }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {badge && (
                <span className="absolute top-1 right-[20%] text-[8px] font-bold bg-blue-600
                  text-white px-1.5 py-0.5 rounded-sm leading-none">
                  {badge}
                </span>
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-white/30"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </div>

              {isActive ? (
                <span className="text-[10px] font-semibold text-white bg-pink-600
                  px-3 py-0.5 rounded-full leading-tight">
                  {label}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-white/30">
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
