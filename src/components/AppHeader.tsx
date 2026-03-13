"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Sparkles, ArrowLeft } from "lucide-react"

/**
 * Lightweight header for authenticated app pages.
 * Shows back button (with fallback), GrahAI logo, and upgrade CTA.
 */

const BACK_FALLBACKS: Record<string, string> = {
  "/chat": "/dashboard",
  "/daily": "/dashboard",
  "/kundli": "/dashboard",
  "/horoscope": "/dashboard",
  "/compatibility": "/dashboard",
  "/reports": "/dashboard",
  "/pricing": "/dashboard",
}

export default function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    // Always attempt router.back() first, which safely handles browser history
    // If called from a new tab/fresh load, it's a no-op and the URL stays the same
    router.back()
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.04] bg-bg/80 px-5 py-3 backdrop-blur-xl">
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors text-text/60 hover:text-text"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
        aria-label="Go to GrahAI dashboard"
      >
        <Sparkles className="h-5 w-5 text-saffron" />
        <span className="text-base font-bold text-text">
          Grah<span className="text-saffron">AI</span>
        </span>
      </Link>

      <Link
        href="/pricing"
        className="px-4 py-2 rounded-lg bg-saffron/10 text-saffron text-sm font-medium hover:bg-saffron/20 transition-colors min-h-[40px] flex items-center"
      >
        Upgrade
      </Link>
    </header>
  )
}
