"use client"

import { useState } from "react"

/**
 * Spline 3D Star — "a star like our own" (G-type yellow dwarf)
 *
 * Layered approach for seamless background merge:
 *   Layer 0  — CSS fallback star (shows while loading)
 *   Layer 1  — Spline iframe (oversized, shifted up to hide watermark)
 *   Layer 2  — Top edge fade (gradient → BG)
 *   Layer 3  — Bottom edge fade (gradient → BG, also hides watermark)
 *   Layer 4  — Left edge fade
 *   Layer 5  — Right edge fade
 *   Layer 6  — Corner patches (radial gradients at each corner)
 *   Layer 7  — Overall radial vignette for organic blending
 */
const SPLINE_URL = "https://my.spline.design/astarlikeourown-ukvK2EaYKfmPcjkfa9xzQqmD/"
const BG = "#0A0E1A"

export default function SplineStar({ className = "" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ overflow: "visible" }}
    >
      {/* ── Layer 0: CSS star fallback while iframe loads ── */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <CSSStarFallback />
      </div>

      {/* ── Layer 1: Spline iframe ──
          Oversized (160% × 180%) and shifted up so the star
          fills the container and the watermark is below the visible area. */}
      <div
        className={`absolute transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: "-40%",
          left: "-30%",
          width: "160%",
          height: "180%",
        }}
      >
        <iframe
          src={SPLINE_URL}
          frameBorder="0"
          width="100%"
          height="100%"
          style={{
            border: "none",
            background: BG,
            display: "block",
            pointerEvents: "none",
          }}
          onLoad={() => setLoaded(true)}
          allow="autoplay"
          title="3D Star Animation"
        />
      </div>

      {/* ── Layer 2: Top edge fade ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "-2px",
          height: "35%",
          background: `linear-gradient(to bottom, ${BG} 0%, ${BG}CC 30%, ${BG}66 60%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* ── Layer 3: Bottom edge fade (also hides watermark) ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: "-2px",
          height: "35%",
          background: `linear-gradient(to top, ${BG} 0%, ${BG}CC 30%, ${BG}66 60%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* ── Layer 4: Left edge fade ── */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: "-2px",
          width: "35%",
          background: `linear-gradient(to right, ${BG} 0%, ${BG}CC 30%, ${BG}66 60%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* ── Layer 5: Right edge fade ── */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          right: "-2px",
          width: "35%",
          background: `linear-gradient(to left, ${BG} 0%, ${BG}CC 30%, ${BG}66 60%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* ── Layer 6: Corner patches ──
          Radial gradients at each corner to eliminate any remaining
          rectangular hint where the edge fades meet. */}
      {/* Top-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, width: "50%", height: "50%",
          background: `radial-gradient(ellipse at 0% 0%, ${BG} 0%, transparent 70%)`,
          zIndex: 3,
        }}
      />
      {/* Top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, right: 0, width: "50%", height: "50%",
          background: `radial-gradient(ellipse at 100% 0%, ${BG} 0%, transparent 70%)`,
          zIndex: 3,
        }}
      />
      {/* Bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0, left: 0, width: "50%", height: "50%",
          background: `radial-gradient(ellipse at 0% 100%, ${BG} 0%, transparent 70%)`,
          zIndex: 3,
        }}
      />
      {/* Bottom-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0, right: 0, width: "50%", height: "50%",
          background: `radial-gradient(ellipse at 100% 100%, ${BG} 0%, transparent 70%)`,
          zIndex: 3,
        }}
      />

      {/* ── Layer 7: Master radial vignette ──
          Ties everything together — creates a natural circular
          window that fades organically into the page. */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%",
          background: `radial-gradient(circle at 50% 50%, transparent 20%, ${BG}40 32%, ${BG}99 40%, ${BG}DD 48%, ${BG} 56%)`,
          zIndex: 4,
        }}
      />
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
