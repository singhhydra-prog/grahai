"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

/**
 * Lightweight header for authenticated app pages.
 * Shows the GrahAI brand logo linking to homepage.
 */
export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/[0.04] bg-bg/80 px-5 py-3 backdrop-blur-xl">
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
    </header>
  )
}
