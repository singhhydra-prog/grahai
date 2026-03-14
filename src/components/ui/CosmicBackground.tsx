"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CosmicBackground — Layered full-screen space background.
 *
 * Layer 1: Looping space video (beyond_horizons_remix)
 * Layer 2: Canvas overlay with:
 *   - Soft glow blobs (warm orange-red, cool blue)
 *   - "Grah AI" text with glowing fire capsule on "A"
 *   - Fire particles rising from the capsule
 *   - Shooting stars (diagonal bright streaks)
 *   - Tiny twinkling star particles
 */

const BG = "#0A0E1A"
const STAR_COUNT = 80
const FIRE_PARTICLE_COUNT = 30

// ─── Types ───
interface Star {
  x: number; y: number; vx: number; vy: number
  size: number; alpha: number; phase: number; speed: number
}

interface FireParticle {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; size: number; color: string
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

/** Draw a rounded rectangle path */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
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

    // ─── Glow blobs (must be declared before resize which calls initBlobs) ───
    const blobs: GlowBlob[] = [
      { x: 0, y: 0, vx: 0.1, vy: 0.06, radius: 0, color: [220, 90, 30], alpha: 0.12, phase: 0, phaseSpeed: 0.003 },
      { x: 0, y: 0, vx: -0.08, vy: 0.04, radius: 0, color: [100, 150, 240], alpha: 0.08, phase: Math.PI, phaseSpeed: 0.004 },
      { x: 0, y: 0, vx: 0.05, vy: -0.07, radius: 0, color: [160, 80, 200], alpha: 0.04, phase: 1.5, phaseSpeed: 0.005 },
      { x: 0, y: 0, vx: -0.06, vy: 0.04, radius: 0, color: [200, 50, 30], alpha: 0.06, phase: 2.5, phaseSpeed: 0.003 },
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
    window.addEventListener("mousemove", (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    })

    // ─── Stars ───
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const d = i < 30 ? 0 : i < 60 ? 1 : 2
      stars.push({
        x: Math.random() * 3000, y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * (d === 0 ? 0.04 : d === 1 ? 0.1 : 0.18),
        vy: (Math.random() - 0.5) * (d === 0 ? 0.04 : d === 1 ? 0.1 : 0.18),
        size: d === 0 ? 0.4 : d === 1 ? 0.8 : 1 + Math.random() * 0.6,
        alpha: d === 0 ? 0.15 : d === 1 ? 0.3 : 0.5 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.015,
      })
    }

    // ─── Shooting stars ───
    const shootingStars: ShootingStar[] = []
    function spawnShootingStar() {
      // Random entry from top or right edge, traveling diagonally down-left
      const fromTop = Math.random() > 0.3
      const x = fromTop ? Math.random() * w * 1.2 : w + 20
      const y = fromTop ? -20 : Math.random() * h * 0.4
      const angle = Math.PI * (0.6 + Math.random() * 0.3) // roughly 108°–162° (upper-right to lower-left)
      const speed = 6 + Math.random() * 8
      shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 60 + Math.random() * 120,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        alpha: 0.5 + Math.random() * 0.5,
      })
    }

    // ─── Fire particles ───
    const fireColors = [
      "#FF6B20", "#FF8B40", "#FFAA30", "#FF5010", "#FFD060", "#FF4500",
    ]
    const fireParticles: FireParticle[] = []
    let lastACenterX = w * 0.5
    let lastACenterY = h * 0.38

    function spawnFire() {
      fireParticles.push({
        x: lastACenterX + (Math.random() - 0.5) * 35,
        y: lastACenterY + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.5 - Math.random() * 2.5,
        life: 0,
        maxLife: 25 + Math.random() * 35,
        size: 2 + Math.random() * 4,
        color: fireColors[Math.floor(Math.random() * fireColors.length)],
      })
    }

    // ─── Draw "Grah AI" text with fire capsule ───
    function drawText() {
      if (!ctx) return
      const fontSize = Math.min(w * 0.12, 120)
      ctx.save()
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Position text at ~38% from top (above center, giving room for onboarding below)
      const textY = h * 0.38
      const fullText = "Grah AI"

      // Measure text to locate the "A"
      const fullWidth = ctx.measureText(fullText).width
      const textStartX = w * 0.5 - fullWidth / 2
      const grahSpaceW = ctx.measureText("Grah ").width
      const aW = ctx.measureText("A").width
      const aCenterX = textStartX + grahSpaceW + aW * 0.5

      // Store for fire particle spawning
      lastACenterX = aCenterX
      lastACenterY = textY

      // ── Capsule behind "A" ──
      const capW = aW * 1.4
      const capH = fontSize * 0.65
      const capR = capH * 0.4

      // Outer glow
      ctx.shadowColor = "#FF5500"
      ctx.shadowBlur = 50
      ctx.fillStyle = "rgba(255, 80, 0, 0.2)"
      roundRect(ctx, aCenterX - capW / 2, textY - capH / 2, capW, capH, capR)
      ctx.fill()

      // Main capsule gradient (orange → red)
      ctx.shadowBlur = 25
      const cg = ctx.createLinearGradient(aCenterX - capW / 2, textY, aCenterX + capW / 2, textY)
      cg.addColorStop(0, "#FF8800")
      cg.addColorStop(0.45, "#FF5500")
      cg.addColorStop(1, "#CC2200")
      ctx.fillStyle = cg
      roundRect(ctx, aCenterX - capW / 2, textY - capH / 2, capW, capH, capR)
      ctx.fill()

      // Bright inner core
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(255, 170, 70, 0.25)"
      const iW = capW * 0.55, iH = capH * 0.4
      roundRect(ctx, aCenterX - iW / 2, textY - iH / 2, iW, iH, iH * 0.4)
      ctx.fill()

      // ── Draw the full text ──
      ctx.shadowColor = "rgba(255,255,255,0.25)"
      ctx.shadowBlur = 18
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.fillText(fullText, w * 0.5, textY)

      // Re-draw "A" brighter over capsule
      ctx.shadowColor = "#FF8800"
      ctx.shadowBlur = 12
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "left"
      ctx.fillText("A", textStartX + grahSpaceW, textY)

      ctx.restore()
    }

    // ─── Animation loop ───
    let frame = 0
    let shootTimer = 0

    function draw() {
      if (!ctx) return
      frame++
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

      // Stars
      for (const s of stars) {
        s.phase += s.speed
        s.x += s.vx; s.y += s.vy
        if (s.x < -5) s.x = w + 5; if (s.x > w + 5) s.x = -5
        if (s.y < -5) s.y = h + 5; if (s.y > h + 5) s.y = -5
        ctx.globalAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase))
        ctx.fillStyle = "#E0DCF0"
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // ── Shooting stars ──
      shootTimer++
      if (shootTimer > 60 + Math.random() * 120) {
        spawnShootingStar()
        shootTimer = 0
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.life++
        ss.x += ss.vx; ss.y += ss.vy

        // Fade in then out
        const progress = ss.life / ss.maxLife
        const fadeAlpha = progress < 0.15
          ? progress / 0.15
          : progress > 0.7
            ? 1 - (progress - 0.7) / 0.3
            : 1

        // Draw trail (line with gradient)
        const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length
        const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length

        const trailGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
        trailGrad.addColorStop(0, `rgba(255,255,255,0)`)
        trailGrad.addColorStop(0.6, `rgba(255,255,255,${(fadeAlpha * ss.alpha * 0.3).toFixed(3)})`)
        trailGrad.addColorStop(1, `rgba(255,255,255,${(fadeAlpha * ss.alpha).toFixed(3)})`)

        ctx.strokeStyle = trailGrad
        ctx.lineWidth = 1.5
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(ss.x, ss.y)
        ctx.stroke()

        // Bright head
        ctx.globalAlpha = fadeAlpha * ss.alpha
        ctx.fillStyle = "#FFFFFF"
        ctx.beginPath()
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        if (ss.life >= ss.maxLife || ss.x < -200 || ss.y > h + 200) {
          shootingStars.splice(i, 1)
        }
      }

      // Text
      drawText()

      // Fire particles
      if (frame % 2 === 0 && fireParticles.length < FIRE_PARTICLE_COUNT) {
        spawnFire()
      }

      for (let i = fireParticles.length - 1; i >= 0; i--) {
        const p = fireParticles[i]
        p.life++
        p.x += p.vx; p.y += p.vy
        p.vy -= 0.02; p.vx *= 0.99
        const prog = p.life / p.maxLife
        const a = prog < 0.2 ? prog / 0.2 : 1 - (prog - 0.2) / 0.8
        const sz = p.size * (1 - prog * 0.5)
        ctx.globalAlpha = a * 0.7
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        if (p.life >= p.maxLife) fireParticles.splice(i, 1)
      }
      ctx.globalAlpha = 1

      animRef.current = requestAnimationFrame(draw)
    }

    // Spawn a few shooting stars immediately
    spawnShootingStar()
    setTimeout(() => spawnShootingStar(), 800)

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

      {/* Slight dark overlay for blending video with canvas */}
      <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.5)" }} />

      {/* Layer 2: Canvas (text, particles, shooting stars, blobs) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />
    </div>
  )
}
