"use client"

import { useEffect } from "react"

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[GrahAI] Service Worker registered:", reg.scope)
            // Trim caches periodically
            setInterval(() => {
              reg.active?.postMessage("trimCaches")
            }, 1000 * 60 * 60) // every hour
          })
          .catch((err) => {
            console.warn("[GrahAI] SW registration failed:", err)
          })
      })
    }
  }, [])

  return null
}
