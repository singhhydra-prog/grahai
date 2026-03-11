"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft } from "lucide-react"

/**
 * Lightweight header for authenticated app pages.
 * Shows back button, GrahAI logo linking to homepage, and upgrade CTA.
 */
export default function AppHeader() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.04] bg-bg/80 px-5 py-3 backdrop-blur-xl">
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors text-text/60 hover:text-text"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <Link
        href="/"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
        aria-label="Go to GrahAI homepage"
      >
        <Sparkles className="h-5 w-5 text-saffron" />
        <span className="text-base font-bold text-text">
          Grah<span className="text-saffron">AI</span>
        </span>
      </Link>

      <Link
        href="/pricing"
        className="px-4 py-1.5 rounded-lg bg-saffron/10 text-saffron text-sm font-medium hover:bg-saffron/20 transition-colors"
      >
        Upgrade
      </Link>
    </header>
  )
}
