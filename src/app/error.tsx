"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GrahAI Error]", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#0A0E1A" }}>
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          background: "rgba(212,160,84,0.1)",
          border: "1px solid rgba(212,160,84,0.2)",
        }}
      >
        <span className="text-3xl">🪐</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "#F1F0F5" }}>
        Cosmic Disturbance
      </h1>

      <p className="max-w-md mb-8" style={{ color: "#94A3B8" }}>
        The celestial alignment encountered an unexpected shift.
        This is temporary — the stars will realign shortly.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => {
            // Clear any cached errors and retry
            if (typeof window !== "undefined") {
              window.location.reload()
            } else {
              reset()
            }
          }}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #D4A054, #B8863C)",
            color: "#0A0E1A",
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
          style={{
            border: "1px solid rgba(212,160,84,0.3)",
            color: "#D4A054",
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
