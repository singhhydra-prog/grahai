"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CosmicBackground — Layered full-screen space background.
 *
 * Layer 1: Looping space video
 * Layer 2: Canvas overlay with:
 *   - Soft glow blobs (warm orange-red, cool blue)
 *   - Hundreds of tiny soft floating particles (Spline space-dust style)
 *   - Slow natural shooting stars
 */

const BG = "#0A0E1A"
const PARTICLE_COUNT = 250

// ─── Types ───
interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  baseAlpha: number
  phase: number
  phaseSpeed: number
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number
  length: number; life: number; maxLife: number; alpha: number
}

interface GlowBlob {
  x: number; y: number; vx: number; vy: number
  radius: number; color: [number, number, number]
  alpha: number; phase: number; phaseSpeed: number
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [ready, setReady] = useState(false)

  useEffect(() => { setReady(true) }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0, h = 0
    const dpr = Math.min(devicePixelRatio, 2)

    // ─── Glow blobs (must be declared before resize) ───
    const blobs: GlowBlob[] = [
      { x: 0, y: 0, vx: 0.08, vy: 0.05, radius: 0, color: [220, 90, 30], alpha: 0.1, phase: 0, phaseSpeed: 0.002 },
      { x: 0, y: 0, vx: -0.06, vy: 0.03, radius: 0, color: [100, 150, 240], alpha: 0.07, phase: Math.PI, phaseSpeed: 0.003 },
      { x: 0, y: 0, vx: 0.04, vy: -0.05, radius: 0, color: [160, 80, 200], alpha: 0.035, phase: 1.5, phaseSpeed: 0.004 },
      { x: 0, y: 0, vx: -0.05, vy: 0.03, radius: 0, color: [200, 50, 30], alpha: 0.05, phase: 2.5, phaseSpeed: 0.002 },
    ]

    const initBlobs = () => {
      const s = Math.max(w, h)
      blobs[0].x = w * 0.18; blobs[0].y = h * 0.68; blobs[0].radius = s * 0.3
      blobs[1].x = w * 0.82; blobs[1].y = h * 0.22; blobs[1].radius = s * 0.28
      blobs[2].x = w * 0.5; blobs[2].y = h * 0.45; blobs[2].radius = s * 0.2
      blobs[3].x = w * 0.35; blobs[3].y = h * 0.45; blobs[3].radius = s * 0.2
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initBlobs()
    }
    resize()
    window.addEventListener("resize", resize)

    // ─── Space particles (Spline-style soft floating dust) ───
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 3 depth layers: far (tiny, slow), mid, near (slightly larger, slightly faster)
      const layer = Math.random()
      const isFar = layer < 0.5
      const isMid = layer >= 0.5 && layer < 0.85
      // isNear = layer >= 0.85

      const speed = isFar ? 0.03 : isMid ? 0.06 : 0.12
      const size = isFar ? (0.3 + Math.random() * 0.4) : isMid ? (0.5 + Math.random() * 0.6) : (0.8 + Math.random() * 1.0)
      const alpha = isFar ? (0.08 + Math.random() * 0.12) : isMid ? (0.15 + Math.random() * 0.2) : (0.3 + Math.random() * 0.35)

      particles.push({
        x: Math.random() * 4000,
        y: Math.random() * 3000,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size,
        baseAlpha: alpha,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.003 + Math.random() * 0.008,
      })
    }

    // ─── Shooting stars (slow, natural) ───
    const shootingStars: ShootingStar[] = []
    const spawnShootingStar = () => {
      const fromTop = Math.random() > 0.3
      const x = fromTop ? Math.random() * w * 1.2 : w + 20
      const y = fromTop ? -20 : Math.random() * h * 0.4
      const angle = Math.PI * (0.6 + Math.random() * 0.3)
      const speed = 2 + Math.random() * 3
      shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 100,
        life: 0,
        maxLife: 80 + Math.random() * 60,
        alpha: 0.25 + Math.random() * 0.4,
      })
    }

    // ─── Animation loop ───
    let shootTimer = 0

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Glow blobs
      for (const b of blobs) {
        b.phase += b.phaseSpeed
        const a = b.alpha * (0.7 + 0.3 * Math.sin(b.phase))
        b.x += b.vx; b.y += b.vy
        if (b.x < w * -0.1 || b.x > w * 1.1) b.vx *= -1
        if (b.y < h * -0.1 || b.y > h * 1.1) b.vy *= -1
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius)
        const [r, gr, bl] = b.color
        g.addColorStop(0, `rgba(${r},${gr},${bl},${(a * 1.2).toFixed(4)})`)
        g.addColorStop(0.35, `rgba(${r},${gr},${bl},${(a * 0.5).toFixed(4)})`)
        g.addColorStop(0.7, `rgba(${r},${gr},${bl},${(a * 0.12).toFixed(4)})`)
        g.addColorStop(1, `rgba(${r},${gr},${bl},0)`)
        ctx.fillStyle = g
        ctx.fillRect(b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2)
      }

      // Space particles (soft floating dots — Spline style)
      for (const p of particles) {
        p.phase += p.phaseSpeed
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges seamlessly
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Gentle twinkle (slow pulse)
        const twinkle = 0.6 + 0.4 * Math.sin(p.phase)
        const currentAlpha = p.baseAlpha * twinkle

        // Just a soft, simple dot — no rays, no sharp edges
        ctx.globalAlpha = currentAlpha
        ctx.fillStyle = "#C8D0F0"
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Subtle glow on slightly larger particles
        if (p.size > 0.7) {
          const glowR = p.size * 3
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
          glow.addColorStop(0, `rgba(200,210,240,${(currentAlpha * 0.25).toFixed(3)})`)
          glow.addColorStop(1, "rgba(200,210,240,0)")
          ctx.globalAlpha = 1
          ctx.fillStyle = glow
          ctx.fillRect(p.x - glowR, p.y - glowR, glowR * 2, glowR * 2)
        }
      }
      ctx.globalAlpha = 1

      // Shooting stars
      shootTimer++
      if (shootTimer > 180 + Math.random() * 300) {
        spawnShootingStar()
        shootTimer = 0
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.life++
        ss.x += ss.vx; ss.y += ss.vy

        const progress = ss.life / ss.maxLife
        const fadeAlpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.6
            ? 1 - (progress - 0.6) / 0.4
            : 1

        const mag = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)
        const tailX = ss.x - (ss.vx / mag) * ss.length
        const tailY = ss.y - (ss.vy / mag) * ss.length

        const trailGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
        trailGrad.addColorStop(0, "rgba(255,255,255,0)")
        trailGrad.addColorStop(0.5, `rgba(200,210,255,${(fadeAlpha * ss.alpha * 0.15).toFixed(3)})`)
        trailGrad.addColorStop(1, `rgba(255,255,255,${(fadeAlpha * ss.alpha * 0.7).toFixed(3)})`)

        ctx.strokeStyle = trailGrad
        ctx.lineWidth = 1
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(ss.x, ss.y)
        ctx.stroke()

        // Soft head
        ctx.globalAlpha = fadeAlpha * ss.alpha * 0.5
        ctx.fillStyle = "#FFFFFF"
        ctx.beginPath()
        ctx.arc(ss.x, ss.y, 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        if (ss.life >= ss.maxLife || ss.x < -200 || ss.y > h + 200) {
          shootingStars.splice(i, 1)
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    setTimeout(() => spawnShootingStar(), 3000)

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [ready])

  if (!ready) return null

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Layer 1: Video background */}
      <video
        autoPlay loop muted playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ background: BG }}
      >
        <source src="/space-bg.webm" type="video/webm" />
      </video>

      {/* Dark overlay for blending */}
      <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.5)" }} />

      {/* Layer 2: Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />
    </div>
  )
}
