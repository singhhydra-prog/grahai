"use client"

import { useEffect, useRef } from "react"

/**
 * SpaceParticles — Full-screen animated space background.
 * Replicates the Spline "Space particles animation" aesthetic:
 *   - Dark navy space (#0A0E1A)
 *   - Large, soft, diffused glow orbs (warm orange-red, cool blue-white)
 *   - Tiny drifting star particles across 3 depth layers
 *   - Slow, cinematic floating motion
 *   - Mouse-reactive subtle parallax
 */

const BG = "#0A0E1A"

// --- Large ambient glow blobs (the signature look) ---
interface GlowBlob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: [number, number, number] // RGB
  baseAlpha: number
  phase: number
  phaseSpeed: number
}

// --- Tiny star particles ---
interface Star {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  twinklePhase: number
  twinkleSpeed: number
  depth: number // 0-2
}

export default function SpaceParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    const dpr = Math.min(devicePixelRatio, 2) // cap for performance

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", onMouse)

    // ─── Initialize glow blobs ───
    // Matching the Spline scene: warm orange-red blob, cool blue-white blob,
    // plus additional subtle accent blobs
    const blobs: GlowBlob[] = [
      {
        // Large warm orange-red (bottom-left area)
        x: 0, y: 0, vx: 0.12, vy: 0.08,
        radius: 0, color: [220, 100, 40], baseAlpha: 0.12,
        phase: 0, phaseSpeed: 0.003,
      },
      {
        // Cool blue-white (top-right area)
        x: 0, y: 0, vx: -0.1, vy: 0.06,
        radius: 0, color: [120, 160, 240], baseAlpha: 0.09,
        phase: Math.PI, phaseSpeed: 0.004,
      },
      {
        // Subtle gold accent (mid area)
        x: 0, y: 0, vx: 0.06, vy: -0.1,
        radius: 0, color: [160, 100, 200], baseAlpha: 0.05,
        phase: Math.PI * 0.5, phaseSpeed: 0.005,
      },
      {
        // Deep red accent (center-left)
        x: 0, y: 0, vx: -0.07, vy: 0.05,
        radius: 0, color: [200, 60, 40], baseAlpha: 0.06,
        phase: Math.PI * 1.2, phaseSpeed: 0.003,
      },
      {
        // Faint gold accent
        x: 0, y: 0, vx: 0.04, vy: -0.06,
        radius: 0, color: [212, 160, 84], baseAlpha: 0.04,
        phase: Math.PI * 0.8, phaseSpeed: 0.006,
      },
    ]

    // Position blobs relative to screen
    const initBlobs = () => {
      blobs[0].x = w * 0.2; blobs[0].y = h * 0.65; blobs[0].radius = Math.max(w, h) * 0.3
      blobs[1].x = w * 0.8; blobs[1].y = h * 0.25; blobs[1].radius = Math.max(w, h) * 0.28
      blobs[2].x = w * 0.5; blobs[2].y = h * 0.4; blobs[2].radius = Math.max(w, h) * 0.22
      blobs[3].x = w * 0.3; blobs[3].y = h * 0.4; blobs[3].radius = Math.max(w, h) * 0.2
      blobs[4].x = w * 0.6; blobs[4].y = h * 0.7; blobs[4].radius = Math.max(w, h) * 0.18
    }
    initBlobs()

    // ─── Initialize star particles ───
    const STAR_COUNT = 150
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = i < 50 ? 0 : i < 100 ? 1 : 2
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (depth === 0 ? 0.05 : depth === 1 ? 0.12 : 0.2),
        vy: (Math.random() - 0.5) * (depth === 0 ? 0.05 : depth === 1 ? 0.12 : 0.2),
        size: depth === 0 ? 0.4 : depth === 1 ? 0.8 : 1.2 + Math.random() * 0.8,
        alpha: depth === 0 ? 0.2 + Math.random() * 0.15 : depth === 1 ? 0.35 + Math.random() * 0.2 : 0.6 + Math.random() * 0.4,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        depth,
      })
    }

    // ─── Animation loop ───
    let time = 0
    const draw = () => {
      time++
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Draw glow blobs
      for (const blob of blobs) {
        blob.phase += blob.phaseSpeed
        const pulseAlpha = blob.baseAlpha * (0.7 + 0.3 * Math.sin(blob.phase))

        // Subtle mouse parallax — blobs drift slightly away from cursor
        const bdx = blob.x - mx
        const bdy = blob.y - my
        const bdist = Math.sqrt(bdx * bdx + bdy * bdy)
        if (bdist < 500 && bdist > 0) {
          blob.x += (bdx / bdist) * 0.15
          blob.y += (bdy / bdist) * 0.15
        }

        // Drift
        blob.x += blob.vx
        blob.y += blob.vy

        // Soft bounce off edges
        if (blob.x < w * -0.1 || blob.x > w * 1.1) blob.vx *= -1
        if (blob.y < h * -0.1 || blob.y > h * 1.1) blob.vy *= -1

        // Draw as radial gradient
        const grad = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        )
        const [r, g, b] = blob.color
        grad.addColorStop(0, `rgba(${r},${g},${b},${(pulseAlpha * 1.2).toFixed(4)})`)
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${(pulseAlpha * 0.6).toFixed(4)})`)
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${(pulseAlpha * 0.2).toFixed(4)})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad
        ctx.fillRect(
          blob.x - blob.radius,
          blob.y - blob.radius,
          blob.radius * 2,
          blob.radius * 2,
        )
      }

      // Draw star particles
      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = 0.6 + 0.4 * Math.sin(star.twinklePhase)
        const a = star.alpha * twinkle

        // Mouse parallax — deeper stars move less
        const parallax = star.depth === 0 ? 0.002 : star.depth === 1 ? 0.005 : 0.01
        const px = (mx - w / 2) * parallax
        const py = (my - h / 2) * parallax

        const sx = star.x + px
        const sy = star.y + py

        // Move
        star.x += star.vx
        star.y += star.vy

        // Wrap
        if (star.x < -5) star.x = w + 5
        if (star.x > w + 5) star.x = -5
        if (star.y < -5) star.y = h + 5
        if (star.y > h + 5) star.y = -5

        // Draw star dot
        ctx.globalAlpha = a
        ctx.fillStyle = star.depth === 2 ? "#F1F0F5" : star.depth === 1 ? "#B8B4C4" : "#7A7688"
        ctx.beginPath()
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Subtle glow on brightest stars
        if (star.depth === 2 && star.size > 1.5) {
          ctx.globalAlpha = a * 0.15
          ctx.beginPath()
          ctx.arc(sx, sy, star.size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{
        zIndex: 0,
        background: BG,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  )
}
