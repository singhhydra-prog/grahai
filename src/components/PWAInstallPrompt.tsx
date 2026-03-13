"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Download, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return

    // Check if dismissed recently (7-day cooldown)
    try {
      const dismissed = localStorage.getItem("grahai-install-dismissed")
      if (dismissed) {
        const diff = Date.now() - parseInt(dismissed)
        if (diff < 7 * 24 * 60 * 60 * 1000) return
      }
    } catch {}

    // Detect iOS
    const ua = navigator.userAgent
    const isiOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setIsIOS(isiOS)

    if (isiOS) {
      // Show iOS prompt after 30s
      const timer = setTimeout(() => setShowPrompt(true), 30000)
      return () => clearTimeout(timer)
    }

    // Android/Desktop — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Delay showing by 20s for non-intrusive UX
      setTimeout(() => setShowPrompt(true), 20000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setShowPrompt(false)
    setShowIOSGuide(false)
    try {
      localStorage.setItem("grahai-install-dismissed", Date.now().toString())
    } catch {}
  }, [])

  if (!showPrompt) return null

  // iOS Safari guide
  if (isIOS && !showIOSGuide) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl bg-[#0C1224]/95 backdrop-blur-xl border border-amber-500/20 p-4 shadow-2xl shadow-amber-500/5">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 text-white/30 hover:text-white/60"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Smartphone size={18} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#E8E4DB]">
                Install GrahAI
              </p>
              <p className="text-xs text-[#8A8690] mt-0.5">
                Add to your home screen for a native app experience
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowIOSGuide(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-[#060A14]"
          >
            <Download size={14} />
            Show Me How
          </button>
        </div>
      </div>
    )
  }

  // iOS guide steps
  if (isIOS && showIOSGuide) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4">
        <div className="rounded-2xl bg-[#0C1224] border border-amber-500/20 p-5 max-w-sm w-full shadow-2xl">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 text-white/30 hover:text-white/60"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <p className="text-lg font-bold text-[#E8E4DB] mb-4">
            Add GrahAI to Home Screen
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-400">1</span>
              <p className="text-sm text-[#8A8690]">
                Tap the <span className="text-[#E8E4DB] font-medium">Share</span> button
                <span className="ml-1 inline-block text-base">⎋</span> in Safari&apos;s toolbar
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-400">2</span>
              <p className="text-sm text-[#8A8690]">
                Scroll down and tap <span className="text-[#E8E4DB] font-medium">&quot;Add to Home Screen&quot;</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 h-7 w-7 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-400">3</span>
              <p className="text-sm text-[#8A8690]">
                Tap <span className="text-[#E8E4DB] font-medium">&quot;Add&quot;</span> to install GrahAI
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="mt-5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-[#E8E4DB]"
          >
            Got It
          </button>
        </div>
      </div>
    )
  }

  // Android/Desktop install prompt
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl bg-[#0C1224]/95 backdrop-blur-xl border border-amber-500/20 p-4 shadow-2xl shadow-amber-500/5">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-white/30 hover:text-white/60"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Download size={18} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#E8E4DB]">
              Install GrahAI App
            </p>
            <p className="text-xs text-[#8A8690] mt-0.5">
              Instant access from your home screen. Works offline.
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-[#060A14]"
          >
            <Download size={14} />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-[#8A8690]"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}
