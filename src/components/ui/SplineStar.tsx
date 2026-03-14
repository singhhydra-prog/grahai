"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Spline 3D Star — "a star like our own" (G-type yellow dwarf)
 * Loads the Spline scene via runtime, seamless with dark background.
 * Shows a CSS star fallback while the 3D scene loads.
 */
export default function SplineStar({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadScene() {
      try {
        // Dynamically import the Spline runtime (keeps bundle small)
        const { Application } = await import("@splinetool/runtime")

        if (cancelled || !canvasRef.current) return

        const app = new Application(canvasRef.current)

        // Load directly from the published Spline scene URL (permanent, no proxy needed)
        const SCENE_URL =
          "https://my.spline.design/astarlikeourown-ukvK2EaYKfmPcjkfa9xzQqmD/scene.splinecode"

        if (cancelled) return

        await app.load(SCENE_URL)

        if (!cancelled) setLoaded(true)
      } catch (err) {
        console.warn("Spline scene failed to load:", err)
        if (!cancelled) setError(true)
      }
    }

    loadScene()
    return () => { cancelled = true }
  }, [])

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* CSS star fallback — visible while Spline loads or on error */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          loaded && !error ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <CSSStarFallback />
      </div>

      {/* Spline canvas — hidden until loaded */}
      {!error && (
        <canvas
          ref={canvasRef}
          className={`w-full h-full transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "transparent" }}
        />
      )}
    </div>
  )
}

/** Pure CSS animated star fallback */
function CSSStarFallback() {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Outermost soft halo */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(212,160,84,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Corona glow ring — slow spin */}
      <div
        className="absolute w-[78%] h-[78%] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(212,160,84,0.0), rgba(212,160,84,0.15), rgba(255,200,100,0.05), rgba(212,160,84,0.12), rgba(212,160,84,0.0))",
          animation: "spin 12s linear infinite",
        }}
      />
      {/* Middle glow */}
      <div
        className="absolute w-[64%] h-[64%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,160,84,0.25) 0%, rgba(212,160,84,0.08) 50%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      {/* Inner star body */}
      <div
        className="absolute w-[43%] h-[43%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #FFE4A0, #D4A054 50%, #B8863C 80%, #96702E 100%)",
          boxShadow:
            "0 0 40px rgba(212,160,84,0.5), 0 0 80px rgba(212,160,84,0.25), 0 0 120px rgba(212,160,84,0.1), inset 0 -4px 12px rgba(150,112,46,0.4)",
          animation: "starPulse 3s ease-in-out infinite",
        }}
      />
      {/* Surface texture */}
      <div
        className="absolute w-[43%] h-[43%] rounded-full overflow-hidden opacity-40"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.3) 0%, transparent 25%), radial-gradient(circle at 65% 55%, rgba(255,255,255,0.15) 0%, transparent 20%)",
          animation: "spin 20s linear infinite reverse",
        }}
      />
      {/* Bright core */}
      <div
        className="absolute w-[18%] h-[18%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, rgba(255,240,200,0.6) 0%, transparent 70%)",
        }}
      />
      {/* Lens flare rays */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "conic-gradient(from 30deg, transparent 0deg, rgba(212,160,84,0.3) 2deg, transparent 4deg, transparent 86deg, rgba(212,160,84,0.2) 88deg, transparent 90deg, transparent 176deg, rgba(212,160,84,0.25) 178deg, transparent 180deg, transparent 266deg, rgba(212,160,84,0.15) 268deg, transparent 270deg, transparent 360deg)",
          animation: "spin 30s linear infinite",
        }}
      />
      <style>{`
        @keyframes starPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.04); filter: brightness(1.1); }
        }
      `}</style>
    </div>
  )
}
