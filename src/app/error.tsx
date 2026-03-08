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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          background: "rgba(201,162,77,0.1)",
          border: "1px solid rgba(201,162,77,0.2)",
        }}
      >
        <span className="text-3xl">🪐</span>
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "#E8E4DB" }}
      >
        Cosmic Disturbance
      </h1>

      <p
        className="max-w-md mb-8"
        style={{ color: "rgba(232,228,219,0.6)" }}
      >
        The celestial alignment encountered an unexpected shift.
        This is temporary — the stars will realign shortly.
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #C9A24D, #A07E30)",
            color: "#0a0a1a",
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
          style={{
            border: "1px solid rgba(201,162,77,0.3)",
            color: "#C9A24D",
          }}
        >
          Return Home
        </Link>
      </div>

      {error.digest && (
        <p
          className="mt-8 text-xs"
          style={{ color: "rgba(232,228,219,0.3)" }}
        >
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}
