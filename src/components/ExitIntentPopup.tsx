"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, ArrowRight, Star, Moon } from "lucide-react"
import Link from "next/link"

/* ════════════════════════════════════════════════════════
   EXIT-INTENT SMART POPUP
   Context-aware popup when visitors move to leave.
   Tracks which sections they viewed → personalizes the offer.
   ════════════════════════════════════════════════════════ */

interface PopupVariant {
  emoji: string
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  color: string
}

const VARIANTS: Record<string, PopupVariant> = {
  cosmic_snapshot: {
    emoji: "✨",
    title: "Wait — your stars have something to say",
    subtitle: "Get an instant Vedic reading with just your birthday. No account needed.",
    cta: "See My Cosmic Snapshot",
    ctaLink: "#cosmic-snapshot",
    color: "from-purple-500/20 to-gold/10",
  },
  astrology: {
    emoji: "☿",
    title: "Your Kundli is waiting to be decoded",
    subtitle: "Planetary positions calculated to arc-second precision. Free first reading included.",
    cta: "Start My Reading",
    ctaLink: "/chat",
    color: "from-blue-500/20 to-gold/10",
  },
  tarot: {
    emoji: "✦",
    title: "The cards have a message for you",
    subtitle: "AI-powered Tarot readings with all 78 cards — Major and Minor Arcana. Try it free.",
    cta: "Draw My Cards",
    ctaLink: "/chat",
    color: "from-purple-500/20 to-gold/10",
  },
  numerology: {
    emoji: "𝟗",
    title: "Your numbers tell a story",
    subtitle: "Life Path, Destiny, Soul Urge — all computed instantly. Discover your numerical blueprint.",
    cta: "Reveal My Numbers",
    ctaLink: "/chat",
    color: "from-amber-500/20 to-gold/10",
  },
  vastu: {
    emoji: "◈",
    title: "Your space holds hidden energy",
    subtitle: "Vedic spatial analysis for your home or workspace. Room-by-room guidance available.",
    cta: "Analyze My Space",
    ctaLink: "/chat",
    color: "from-emerald-500/20 to-gold/10",
  },
  pricing: {
    emoji: "🌟",
    title: "Start free forever on Nakshatra tier",
    subtitle: "No credit card needed. Get unlimited basic readings + daily Panchang insights. Upgrade anytime.",
    cta: "Start Free Now",
    ctaLink: "/chat",
    color: "from-gold/20 to-amber-500/10",
  },
  default: {
    emoji: "🪐",
    title: "Before you go — a cosmic gift",
    subtitle: "Enter just your birthday and discover your Vedic zodiac sign, birth star, and life path number. Completely free.",
    cta: "Get My Free Snapshot",
    ctaLink: "#cosmic-snapshot",
    color: "from-gold/15 to-purple-500/10",
  },
}

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasFired, setHasFired] = useState(false)
  const [variant, setVariant] = useState<PopupVariant>(VARIANTS.default)

  // Detect which section was most viewed
  const detectContext = useCallback((): string => {
    if (typeof window === "undefined") return "default"

    // Check localStorage for user's quiz choice
    const cosmicChoice = localStorage.getItem("cosmicChoice")
    if (cosmicChoice === "scholar") return "astrology"
    if (cosmicChoice === "guidance") return "cosmic_snapshot"
    if (cosmicChoice === "decisions") return "astrology"

    // Check scroll position to determine most-viewed section
    const sections: { id: string; key: string }[] = [
      { id: "sciences", key: "astrology" },
      { id: "cosmic-snapshot", key: "cosmic_snapshot" },
      { id: "guided-demo", key: "astrology" },
      { id: "pricing-section", key: "pricing" },
    ]

    let bestMatch = "default"
    let bestVisibility = 0

    for (const sec of sections) {
      const el = document.getElementById(sec.id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const visible = Math.max(0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      ) / el.offsetHeight
      if (visible > bestVisibility) {
        bestVisibility = visible
        bestMatch = sec.key
      }
    }

    // Check URL hash
    const hash = window.location.hash.replace("#", "")
    if (hash.includes("tarot")) return "tarot"
    if (hash.includes("numerology") || hash.includes("number")) return "numerology"
    if (hash.includes("vastu")) return "vastu"

    return bestMatch
  }, [])

  useEffect(() => {
    // Don't show if already fired or on mobile (exit intent doesn't work well)
    if (hasFired) return
    const isMobile = window.innerWidth < 768
    const wasShown = sessionStorage.getItem("exitPopupShown")
    if (wasShown) return

    let timeoutId: ReturnType<typeof setTimeout>

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves to top of page (about to close tab)
      if (e.clientY > 5) return
      if (hasFired) return

      const context = detectContext()
      setVariant(VARIANTS[context] || VARIANTS.default)
      setIsVisible(true)
      setHasFired(true)
      sessionStorage.setItem("exitPopupShown", "true")
    }

    // Mobile: trigger after scroll-up or after 45 seconds
    const handleScrollUp = () => {
      if (hasFired) return
      // If user has scrolled down significantly and then comes back to top
      if (window.scrollY < 200 && document.documentElement.scrollHeight > 3000) {
        const context = detectContext()
        setVariant(VARIANTS[context] || VARIANTS.default)
        setIsVisible(true)
        setHasFired(true)
        sessionStorage.setItem("exitPopupShown", "true")
      }
    }

    if (isMobile) {
      // On mobile, use a timer fallback (30 seconds of engagement)
      timeoutId = setTimeout(() => {
        if (!hasFired) {
          const context = detectContext()
          setVariant(VARIANTS[context] || VARIANTS.default)
          setIsVisible(true)
          setHasFired(true)
          sessionStorage.setItem("exitPopupShown", "true")
        }
      }, 45000)
      window.addEventListener("scroll", handleScrollUp, { passive: true })
    } else {
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("scroll", handleScrollUp)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [hasFired, detectContext])

  const close = () => setIsVisible(false)

  const handleCTAClick = () => {
    setIsVisible(false)
    if (variant.ctaLink.startsWith("#")) {
      const el = document.getElementById(variant.ctaLink.replace("#", ""))
      el?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[50%] -translate-y-1/2 z-[9999] mx-auto max-w-md"
          >
            <div className={`relative rounded-2xl border border-white/[0.08] bg-gradient-to-br ${variant.color} bg-[#0f0f2a]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden`}>
              {/* Decorative dots */}
              <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden opacity-30">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-gold/40"
                    style={{
                      left: `${(Math.sin(i * 37) * 0.5 + 0.5) * 100}%`,
                      top: `${(Math.cos(i * 23) * 0.5 + 0.5) * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 rounded-full bg-white/[0.05] p-2 text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative p-8 pt-10 text-center">
                {/* Emoji */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="text-5xl mb-5"
                >
                  {variant.emoji}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white/90 mb-3 leading-tight">
                  {variant.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-sm mx-auto">
                  {variant.subtitle}
                </p>

                {/* CTA Button */}
                {variant.ctaLink.startsWith("#") ? (
                  <button
                    onClick={handleCTAClick}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#E2C474] px-8 py-3.5 text-sm font-semibold text-[#0B0E1A] transition-all hover:shadow-xl hover:shadow-[#C9A24D]/25 active:scale-[0.98]"
                  >
                    {variant.cta}
                    <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
                  </button>
                ) : (
                  <Link
                    href={variant.ctaLink}
                    onClick={close}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#E2C474] px-8 py-3.5 text-sm font-semibold text-[#0B0E1A] transition-all hover:shadow-xl hover:shadow-[#C9A24D]/25 active:scale-[0.98]"
                  >
                    {variant.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                {/* Dismiss text */}
                <button
                  onClick={close}
                  className="block mx-auto mt-5 text-xs text-white/25 hover:text-white/40 transition-colors"
                >
                  No thanks, I&apos;ll explore later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
