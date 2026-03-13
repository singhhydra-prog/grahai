"use client"

import { useState, useEffect, useCallback } from "react"

interface FreeTierLimits {
  kundliGenerations: number // max 2 free
  chatMessages: number // max 5 per day free
  tarotReadings: number // max 1 per day free
  horoscopeViews: number // unlimited free
  matchChecks: number // max 1 free
}

const LIMITS: FreeTierLimits = {
  kundliGenerations: 2,
  chatMessages: 5,
  tarotReadings: 1,
  horoscopeViews: 999,
  matchChecks: 1,
}

export function useFreeTier() {
  const [usage, setUsage] = useState<FreeTierLimits>({
    kundliGenerations: 0,
    chatMessages: 0,
    tarotReadings: 0,
    horoscopeViews: 0,
    matchChecks: 0,
  })
  const [isPremium, setIsPremium] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // SSR safety: only access localStorage after hydration
    try {
      const today = new Date().toISOString().split("T")[0]
      const stored = localStorage.getItem(`grahai_usage_${today}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === "object") {
          setUsage(parsed)
        }
      }

      // Check premium status
      const tier = localStorage.getItem("grahai_tier")
      setIsPremium(tier === "plus" || tier === "premium")
    } catch {
      // localStorage may not be available (SSR, private browsing)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const trackUsage = useCallback((feature: keyof FreeTierLimits) => {
    if (isPremium) return true

    const today = new Date().toISOString().split("T")[0]
    const current = usage[feature]
    const limit = LIMITS[feature]

    if (current >= limit) return false

    const newUsage = { ...usage, [feature]: current + 1 }
    setUsage(newUsage)
    localStorage.setItem(`grahai_usage_${today}`, JSON.stringify(newUsage))
    return true
  }, [usage, isPremium])

  const canUse = useCallback((feature: keyof FreeTierLimits) => {
    if (isPremium) return true
    return usage[feature] < LIMITS[feature]
  }, [usage, isPremium])

  const remaining = useCallback((feature: keyof FreeTierLimits) => {
    if (isPremium) return 999
    return Math.max(0, LIMITS[feature] - usage[feature])
  }, [usage, isPremium])

  return { usage, isPremium, trackUsage, canUse, remaining, limits: LIMITS }
}
