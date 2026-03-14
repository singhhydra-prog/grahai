"use client"

import { Home, MessageCircle, FileText, User } from "lucide-react"
import { motion } from "framer-motion"
import type { TabType } from "@/types/app"

const TABS: { id: TabType; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "ask", label: "Vaani", Icon: MessageCircle },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "profile", label: "You", Icon: User },
]

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  isActive ? "text-magenta" : "text-text-dim"
                }`}
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-magenta" : "text-text-dim"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-px left-3 right-3 h-0.5 rounded-full bg-magenta"
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
