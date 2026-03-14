"use client"

import dynamic from "next/dynamic"

const SpaceParticles = dynamic(() => import("./SpaceParticles"), { ssr: false })

/**
 * Client wrapper for the SpaceParticles canvas background.
 * Used in the root layout to replace CSS starfield/nebula/shooting stars.
 */
export default function CosmicBackground() {
  return <SpaceParticles />
}
