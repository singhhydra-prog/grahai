"use client"

/**
 * CosmicBackground — Full-screen looping space video background.
 *
 * Uses the "Beyond Horizons" remix video (space-bg.webm) as a
 * seamless, edge-to-edge animated background across the entire app.
 * - Fixed position, covers full viewport
 * - Loops infinitely, muted, autoplays
 * - Slight dark overlay to ensure text readability
 * - z-index 0 so all content renders above it
 */
export default function CosmicBackground() {
  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Video layer — covers full screen */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ background: "#0A0E1A" }}
      >
        <source src="/space-bg.webm" type="video/webm" />
      </video>

      {/* Dark overlay — ensures text readability over the video */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(10, 14, 26, 0.35)",
        }}
      />
    </div>
  )
}
