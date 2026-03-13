"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Home, MessageCircle, User, FileText } from "lucide-react"

/* ═══════════════════════════════════════════════════
   BOTTOM NAV — Frosted glass navigation bar
   Center mandala button for cosmic home
   ═══════════════════════════════════════════════════ */

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/app" },
  { icon: MessageCircle, label: "Ask", href: "/chat" },
  { icon: null, label: "Kundli", href: "/kundli" },
  { icon: User, label: "My Chart", href: "/app?tab=mychart" },
  { icon: FileText, label: "Reports", href: "/reports" },
]

export default function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = (href: string) => {
    // Handle query parameter-based routes (e.g., /app?tab=mychart)
    if (href.includes("?")) {
      const hrefPath = href.split("?")[0]
      const hrefParams = new URLSearchParams(href.split("?")[1])

      // Check if pathname matches and all query params match
      if (pathname !== hrefPath) return false
      for (const [key, value] of hrefParams) {
        if (searchParams.get(key) !== value) return false
      }
      return true
    }

    // For /app, only match if pathname is exactly /app (no query params active)
    if (href === "/app") return pathname === "/app" && searchParams.toString() === ""

    // Standard path matching for other routes
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40" role="navigation" aria-label="Main navigation">
      {/* Frosted glass */}
      <div className="relative mx-auto max-w-lg">
        <div className="absolute inset-0 bg-[#060A14]/80 backdrop-blur-2xl border-t border-white/[0.06]" />

        <div className="relative flex items-end justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
          {NAV_ITEMS.map((item, i) => {
            const isCenter = i === 2
            const active = isActive(item.href)

            if (isCenter) {
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="relative -mt-5"
                  aria-label="Generate Kundli"
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
                </Link>
              )
            }

            const Icon = item.icon!
            return (
              <Link
                key={i}
                href={item.href}
                className="flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] min-h-[44px] justify-center"
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "text-gold" : "text-white/30"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    active ? "text-gold/80" : "text-white/25"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
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
