"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SplinePlaceholder />,
})

function SplinePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full cosmic-gradient opacity-30 animate-pulse" />
    </div>
  )
}

interface SplineSceneProps {
  sceneUrl: string
  className?: string
  fallback?: React.ReactNode
}

/**
 * Spline 3D scene wrapper with lazy loading.
 * Pass a scene URL from spline.design exports.
 * Falls back to a glowing placeholder if no URL provided.
 */
export default function SplineScene({
  sceneUrl,
  className = "",
  fallback,
}: SplineSceneProps) {
  if (!sceneUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {fallback || <CosmicOrb />}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Suspense fallback={fallback || <SplinePlaceholder />}>
        <Spline scene={sceneUrl} />
      </Suspense>
    </div>
  )
}

/** Default cosmic orb placeholder when no Spline scene is available */
function CosmicOrb() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-magenta/20 via-violet/10 to-cyan/20 blur-xl animate-pulse" />
        {/* Inner orb */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-magenta/40 via-violet/30 to-cyan/40 blur-sm" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-magenta via-violet to-cyan opacity-60" />
        {/* Core */}
        <div className="absolute inset-10 rounded-full bg-white/20 blur-sm" />
      </div>
    </div>
  )
}
