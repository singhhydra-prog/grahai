"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Home, Search, User, BookOpen } from "lucide-react"

/* ═══════════════════════════════════════════════════
   BOTTOM NAV — Frosted glass navigation bar
   Center mandala button for cosmic home
   ═══════════════════════════════════════════════════ */

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/app" },
  { icon: Search, label: "Explore", href: "/app/explore" },
  { icon: null, label: "Kundli", href: "/app" }, // center mandala
  { icon: BookOpen, label: "Learn", href: "/blog" },
  { icon: User, label: "Profile", href: "/dashboard" },
]

export default function BottomNav() {
  const [active, setActive] = useState(0)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      {/* Frosted glass */}
      <div className="relative mx-auto max-w-lg">
        <div className="absolute inset-0 bg-[#060A14]/80 backdrop-blur-2xl border-t border-white/[0.06]" />

        <div className="relative flex items-end justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
          {NAV_ITEMS.map((item, i) => {
            const isCenter = i === 2
            const isActive = active === i

            if (isCenter) {
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="relative -mt-5"
                >
                  {/* Spinning border */}
                  <motion.div
                    className="absolute inset-[-3px] rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 0%, rgba(212,168,83,0.3) 25%, transparent 50%, rgba(212,168,83,0.3) 75%, transparent 100%)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Button */}
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/20 flex items-center justify-center shadow-lg shadow-gold/10">
                    <span className="text-2xl">🕉️</span>
                  </div>
                </button>
              )
            }

            const Icon = item.icon!
            return (
              <Link
                key={i}
                href={item.href}
                onClick={() => setActive(i)}
                className="flex flex-col items-center gap-1 py-2 px-3 min-w-[56px]"
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? "text-gold" : "text-white/30"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? "text-gold/80" : "text-white/25"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="w-1 h-1 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
