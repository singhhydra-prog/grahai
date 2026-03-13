"use client"

import { useState, useEffect } from "react"
import { RefreshCw, X } from "lucide-react"

export default function PWAUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    const checkForUpdate = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        if (!reg) return

        setRegistration(reg)

        // Listen for new service worker
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (!newWorker) return

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available
              setShowUpdate(true)
            }
          })
        })

        // Check for updates periodically (every 30 min)
        const interval = setInterval(() => {
          reg.update()
        }, 30 * 60 * 1000)

        return () => clearInterval(interval)
      } catch (err) {
        console.warn("[GrahAI] SW update check failed:", err)
      }
    }

    checkForUpdate()
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
    }
    window.location.reload()
  }

  if (!showUpdate) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-4 duration-500">
      <div className="rounded-2xl bg-[#0C1224]/95 backdrop-blur-xl border border-emerald-500/20 p-4 shadow-2xl max-w-sm mx-auto">
        <button
          onClick={() => setShowUpdate(false)}
          className="absolute top-3 right-3 p-1 text-white/30 hover:text-white/60"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <RefreshCw size={18} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#E8E4DB]">
              New Version Available
            </p>
            <p className="text-xs text-[#8A8690] mt-0.5">
              GrahAI has been updated with new cosmic features
            </p>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/15 transition-all"
        >
          <RefreshCw size={14} />
          Update Now
        </button>
      </div>
    </div>
  )
}
