"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, BellOff, X, Sparkles } from "lucide-react"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i)
  return arr
}

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [showPrompt, setShowPrompt] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return
    setPermission(Notification.permission)

    // Show prompt after 30s if not already subscribed
    if (Notification.permission === "default") {
      const dismissed = localStorage.getItem("grahai-push-dismissed")
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10)
        // Don't show again for 7 days
        if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return
      }
      const timer = setTimeout(() => setShowPrompt(true), 30000)
      return () => clearTimeout(timer)
    }

    if (Notification.permission === "granted") {
      checkExistingSubscription()
    }
  }, [])

  const checkExistingSubscription = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setSubscribed(!!sub)
    } catch {}
  }, [])

  const subscribe = useCallback(async () => {
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== "granted") return

      const reg = await navigator.serviceWorker.ready

      // Subscribe to push
      let sub = await reg.pushManager.getSubscription()
      if (!sub && VAPID_PUBLIC_KEY) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
        })
      }

      if (sub) {
        // Save to backend
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: sub.toJSON(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        })
        setSubscribed(true)
      }

      setShowPrompt(false)
    } catch (err) {
      console.warn("Push subscription failed:", err)
    }
  }, [])

  const dismiss = useCallback(() => {
    setShowPrompt(false)
    localStorage.setItem("grahai-push-dismissed", String(Date.now()))
  }, [])

  if (!showPrompt || subscribed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="relative rounded-2xl border border-amber-500/20 bg-[#0E1538]/95 backdrop-blur-xl p-5 shadow-2xl shadow-amber-900/20">
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/40" />
          </button>

          {/* Icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Daily Cosmic Updates</h4>
              <p className="text-[11px] text-white/40">दैनिक राशिफल सूचना</p>
            </div>
          </div>

          <p className="text-xs text-white/60 mb-4 leading-relaxed">
            Get your personalized Vedic horoscope every morning at sunrise.
            Never miss a planetary transit that affects your chart.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={subscribe}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-sm font-semibold text-black hover:from-amber-400 hover:to-amber-500 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              Enable Notifications
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/50 hover:bg-white/5 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
