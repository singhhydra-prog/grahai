"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050810] text-white">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-amber-400">404</h1>
        <p className="mb-1 text-xl text-white/60">Page not found</p>
        <p className="mb-8 text-sm text-white/30">
          The cosmic path you seek does not exist in this realm.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-[#050810] hover:bg-amber-400 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
