"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

/* ═══════════════════════════════════════════════════
   COSMIC STAR FIELD — Living animated background
   Canvas-based for 60fps performance on low-end devices
   ═══════════════════════════════════════════════════ */

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

export default function CosmicStarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    // Generate stars
    const w = window.innerWidth
    const h = window.innerHeight
    const count = Math.min(120, Math.floor((w * h) / 8000))
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }))

    let time = 0
    const animate = () => {
      time += 1
      ctx.clearRect(0, 0, w, h)

      starsRef.current.forEach((star) => {
        const flicker =
          Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        const alpha = star.opacity * flicker

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 168, 83, ${alpha})`
        ctx.fill()

        // Subtle glow for larger stars
        if (star.size > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(212, 168, 83, ${alpha * 0.08})`
          ctx.fill()
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
      {/* Nebula overlays */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/8 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-purple-900/6 blur-[80px] animate-pulse-slow delay-2000" />
      </motion.div>
    </>
  )
}
