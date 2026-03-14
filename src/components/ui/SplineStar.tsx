"use client"

import { useState } from "react"

/**
 * Spline 3D Star — "a star like our own" (G-type yellow dwarf)
 *
 * Clean 3-layer approach:
 *   1. Spline iframe (oversized + shifted up to push watermark out)
 *   2. Single radial vignette that fades edges into the page BG
 *   3. Thin bottom gradient to catch any watermark remnant
 *
 * The container uses overflow:hidden so the oversized iframe
 * is cropped to the component bounds.
 */
const SPLINE_URL = "https://my.spline.design/astarlikeourown-ukvK2EaYKfmPcjkfa9xzQqmD/"
const BG = "#0A0E1A"

export default function SplineStar({ className = "" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* CSS star fallback while iframe loads */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <CSSStarFallback />
      </div>

      {/* Spline iframe — oversized so star fills the view,
          shifted up so watermark falls below the overflow clip */}
      <iframe
        src={SPLINE_URL}
        frameBorder="0"
        className={`absolute transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          border: "none",
          background: "transparent",
          display: "block",
          pointerEvents: "none",
          /* 120% wide, 140% tall, centered horizontally, shifted up */
          width: "120%",
          height: "140%",
          left: "-10%",
          top: "-25%",
        }}
        onLoad={() => setLoaded(true)}
        allow="autoplay"
        title="3D Star Animation"
      />

      {/* Single radial vignette — fades the circular edge into the page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `radial-gradient(
            circle at 50% 45%,
            transparent 30%,
            ${BG}33 42%,
            ${BG}88 50%,
            ${BG}CC 56%,
            ${BG} 64%
          )`,
        }}
      />

      {/* Bottom strip — extra insurance to hide watermark */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          zIndex: 3,
          height: "15%",
          background: `linear-gradient(to top, ${BG}, transparent)`,
        }}
      />
    </div>
  )
}

/** Pure CSS animated star fallback */
function CSSStarFallback() {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,160,84,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute w-[78%] h-[78%] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(212,160,84,0.0), rgba(212,160,84,0.15), rgba(255,200,100,0.05), rgba(212,160,84,0.12), rgba(212,160,84,0.0))",
          animation: "spin 12s linear infinite",
        }}
      />
      <div
        className="absolute w-[64%] h-[64%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,160,84,0.25) 0%, rgba(212,160,84,0.08) 50%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
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
      <div
        className="absolute w-[43%] h-[43%] rounded-full overflow-hidden opacity-40"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.3) 0%, transparent 25%), radial-gradient(circle at 65% 55%, rgba(255,255,255,0.15) 0%, transparent 20%)",
          animation: "spin 20s linear infinite reverse",
        }}
      />
      <div
        className="absolute w-[18%] h-[18%] rounded-full"
        style={{
          background: "radial-gradient(circle at 45% 40%, rgba(255,240,200,0.6) 0%, transparent 70%)",
        }}
      />
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
