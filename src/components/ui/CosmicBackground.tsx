"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CosmicBackground — Layered full-screen space background.
 *
 * Layer 1: Looping space video (beyond_horizons_remix)
 * Layer 2: Canvas overlay with:
 *   - Soft glow blobs (warm orange-red, cool blue)
 *   - "Grah AI" text with orange triangle behind "AI"
 *   - Slow, natural shooting stars
 *   - Bright glowing star particles with subtle constellations
 */

const BG = "#0A0E1A"
const STAR_COUNT = 120

// ─── Types ───
interface Star {
  x: number; y: number; vx: number; vy: number
  size: number; alpha: number; phase: number; speed: number
  glowRadius: number
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

interface Constellation {
  starIndices: number[]
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

    // ─── Stars (brighter, with glow) ───
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const d = i < 40 ? 0 : i < 80 ? 1 : 2
      stars.push({
        x: Math.random() * 3000, y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * (d === 0 ? 0.02 : d === 1 ? 0.05 : 0.08),
        vy: (Math.random() - 0.5) * (d === 0 ? 0.02 : d === 1 ? 0.05 : 0.08),
        size: d === 0 ? 0.6 : d === 1 ? 1.2 : 1.5 + Math.random() * 0.8,
        alpha: d === 0 ? 0.3 : d === 1 ? 0.55 : 0.7 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01,
        glowRadius: d === 0 ? 2 : d === 1 ? 4 : 5 + Math.random() * 3,
      })
    }

    // ─── Constellations (subtle lines between nearby stars) ───
    const constellations: Constellation[] = []
    const buildConstellations = () => {
      constellations.length = 0
      // Pick groups of 3-5 nearby stars to connect
      const used = new Set<number>()
      for (let attempt = 0; attempt < 12; attempt++) {
        const seed = Math.floor(Math.random() * stars.length)
        if (used.has(seed)) continue

        const group: number[] = [seed]
        used.add(seed)

        // Find nearby stars within distance
        for (let j = 0; j < stars.length && group.length < 4; j++) {
          if (used.has(j)) continue
          const dx = stars[j].x - stars[seed].x
          const dy = stars[j].y - stars[seed].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200 && dist > 30) {
            group.push(j)
            used.add(j)
          }
        }

        if (group.length >= 2) {
          constellations.push({
            starIndices: group,
            alpha: 0,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: 0.002 + Math.random() * 0.003,
          })
        }
      }
    }
    buildConstellations()

    // ─── Shooting stars (slower, more natural) ───
    const shootingStars: ShootingStar[] = []
    const spawnShootingStar = () => {
      const fromTop = Math.random() > 0.3
      const x = fromTop ? Math.random() * w * 1.2 : w + 20
      const y = fromTop ? -20 : Math.random() * h * 0.4
      const angle = Math.PI * (0.6 + Math.random() * 0.3)
      const speed = 2 + Math.random() * 3 // much slower than before (was 6+8)
      shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 100,
        life: 0,
        maxLife: 80 + Math.random() * 60, // longer life since slower
        alpha: 0.3 + Math.random() * 0.5,
      })
    }

    // ─── Draw "Grah AI" text with orange triangle behind "AI" ───
    const drawText = () => {
      if (!ctx) return
      const fontSize = Math.min(w * 0.12, 120)
      ctx.save()
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const textY = h * 0.38
      const fullText = "Grah AI"

      // Measure text segments
      const fullWidth = ctx.measureText(fullText).width
      const textStartX = w * 0.5 - fullWidth / 2
      const grahSpaceW = ctx.measureText("Grah ").width
      const aiW = ctx.measureText("AI").width
      const aiStartX = textStartX + grahSpaceW
      const aiCenterX = aiStartX + aiW * 0.5

      // ── Orange triangle behind "AI" ──
      const triW = aiW * 1.6
      const triH = fontSize * 1.1
      const triTopY = textY - triH * 0.45
      const triBottomY = textY + triH * 0.55

      // Outer glow for triangle
      ctx.shadowColor = "#FF6600"
      ctx.shadowBlur = 40

      // Triangle gradient (warm orange)
      const triGrad = ctx.createLinearGradient(aiCenterX, triTopY, aiCenterX, triBottomY)
      triGrad.addColorStop(0, "#FF8800")
      triGrad.addColorStop(0.5, "#FF5500")
      triGrad.addColorStop(1, "#CC3300")
      ctx.fillStyle = triGrad

      // Draw triangle: apex at top-center, base at bottom
      ctx.beginPath()
      ctx.moveTo(aiCenterX, triTopY)
      ctx.lineTo(aiCenterX + triW * 0.5, triBottomY)
      ctx.lineTo(aiCenterX - triW * 0.5, triBottomY)
      ctx.closePath()
      ctx.fill()

      // Inner bright core of triangle
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(255, 170, 70, 0.2)"
      const innerScale = 0.5
      const innerTriH = triH * innerScale
      const innerTriW = triW * innerScale
      const innerTopY = textY - innerTriH * 0.3
      const innerBottomY = textY + innerTriH * 0.7
      ctx.beginPath()
      ctx.moveTo(aiCenterX, innerTopY)
      ctx.lineTo(aiCenterX + innerTriW * 0.5, innerBottomY)
      ctx.lineTo(aiCenterX - innerTriW * 0.5, innerBottomY)
      ctx.closePath()
      ctx.fill()

      // ── Draw "Grah " in white ──
      ctx.shadowColor = "rgba(255,255,255,0.2)"
      ctx.shadowBlur = 15
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.fillText(fullText, w * 0.5, textY)

      // Re-draw "AI" brighter over triangle
      ctx.shadowColor = "#FF8800"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "left"
      ctx.fillText("AI", aiStartX, textY)

      ctx.restore()
    }

    // ─── Animation loop ───
    let frame = 0
    let shootTimer = 0

    const draw = () => {
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

      // Stars (brighter, with soft glow halo)
      for (const s of stars) {
        s.phase += s.speed
        s.x += s.vx; s.y += s.vy
        if (s.x < -5) s.x = w + 5; if (s.x > w + 5) s.x = -5
        if (s.y < -5) s.y = h + 5; if (s.y > h + 5) s.y = -5

        const twinkle = 0.6 + 0.4 * Math.sin(s.phase)
        const currentAlpha = s.alpha * twinkle

        // Soft glow halo
        const glowGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.glowRadius)
        glowGrad.addColorStop(0, `rgba(200,210,255,${(currentAlpha * 0.4).toFixed(3)})`)
        glowGrad.addColorStop(0.4, `rgba(180,195,255,${(currentAlpha * 0.15).toFixed(3)})`)
        glowGrad.addColorStop(1, `rgba(180,195,255,0)`)
        ctx.fillStyle = glowGrad
        ctx.fillRect(s.x - s.glowRadius, s.y - s.glowRadius, s.glowRadius * 2, s.glowRadius * 2)

        // Bright core
        ctx.globalAlpha = currentAlpha
        ctx.fillStyle = "#E8E4FF"
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Constellations (subtle connecting lines)
      for (const c of constellations) {
        c.phase += c.phaseSpeed
        // Slow fade in/out cycle
        c.alpha = 0.04 + 0.06 * Math.sin(c.phase)

        ctx.strokeStyle = `rgba(150,170,220,${c.alpha.toFixed(3)})`
        ctx.lineWidth = 0.5
        ctx.lineCap = "round"

        for (let j = 0; j < c.starIndices.length - 1; j++) {
          const s1 = stars[c.starIndices[j]]
          const s2 = stars[c.starIndices[j + 1]]
          ctx.beginPath()
          ctx.moveTo(s1.x, s1.y)
          ctx.lineTo(s2.x, s2.y)
          ctx.stroke()
        }
      }

      // ── Shooting stars (slow & natural) ──
      shootTimer++
      if (shootTimer > 150 + Math.random() * 250) { // less frequent (was 60+120)
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
        trailGrad.addColorStop(0.5, `rgba(200,210,255,${(fadeAlpha * ss.alpha * 0.2).toFixed(3)})`)
        trailGrad.addColorStop(1, `rgba(255,255,255,${(fadeAlpha * ss.alpha * 0.8).toFixed(3)})`)

        ctx.strokeStyle = trailGrad
        ctx.lineWidth = 1.2
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(ss.x, ss.y)
        ctx.stroke()

        // Soft head glow
        ctx.globalAlpha = fadeAlpha * ss.alpha * 0.6
        ctx.fillStyle = "#FFFFFF"
        ctx.beginPath()
        ctx.arc(ss.x, ss.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        if (ss.life >= ss.maxLife || ss.x < -200 || ss.y > h + 200) {
          shootingStars.splice(i, 1)
        }
      }

      // Text
      drawText()

      animRef.current = requestAnimationFrame(draw)
    }

    // Spawn initial shooting star with delay for natural feel
    setTimeout(() => spawnShootingStar(), 2000)

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

      {/* Layer 2: Canvas (text, stars, constellations, shooting stars, blobs) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />
    </div>
  )
}
