"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CosmicBackground — Full-screen space background with "Grah AI" text.
 *
 * Replicates the Spline "Space particles animation" aesthetic:
 *   - Dark navy space (#0A0E1A) background
 *   - Large soft diffused glow blobs (warm orange-red, cool blue)
 *   - "Grah AI" text centered with glowing fire effect on the "A"
 *   - Fire particles rising from the glowing letter
 *   - Tiny drifting star particles
 *   - Mouse-reactive subtle parallax
 */

const BG = "#0A0E1A"
const STAR_COUNT = 100
const FIRE_PARTICLE_COUNT = 35

interface Star {
  x: number; y: number; vx: number; vy: number
  size: number; alpha: number; phase: number; speed: number
}

interface FireParticle {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; size: number
  color: string
}

interface GlowBlob {
  x: number; y: number; vx: number; vy: number
  radius: number; color: [number, number, number]
  alpha: number; phase: number; phaseSpeed: number
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0, h = 0
    const dpr = Math.min(devicePixelRatio, 2)

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

    // ─── Glow blobs ───
    const blobs: GlowBlob[] = [
      { x: 0, y: 0, vx: 0.1, vy: 0.06, radius: 0, color: [220, 90, 30], alpha: 0.14, phase: 0, phaseSpeed: 0.003 },
      { x: 0, y: 0, vx: -0.08, vy: 0.04, radius: 0, color: [100, 150, 240], alpha: 0.1, phase: Math.PI, phaseSpeed: 0.004 },
      { x: 0, y: 0, vx: 0.05, vy: -0.07, radius: 0, color: [160, 80, 200], alpha: 0.05, phase: 1.5, phaseSpeed: 0.005 },
      { x: 0, y: 0, vx: -0.06, vy: 0.04, radius: 0, color: [200, 50, 30], alpha: 0.07, phase: 2.5, phaseSpeed: 0.003 },
    ]

    const initBlobs = () => {
      const s = Math.max(w, h)
      blobs[0].x = w * 0.18; blobs[0].y = h * 0.68; blobs[0].radius = s * 0.32
      blobs[1].x = w * 0.82; blobs[1].y = h * 0.22; blobs[1].radius = s * 0.3
      blobs[2].x = w * 0.5; blobs[2].y = h * 0.45; blobs[2].radius = s * 0.2
      blobs[3].x = w * 0.35; blobs[3].y = h * 0.45; blobs[3].radius = s * 0.22
    }
    initBlobs()

    // ─── Stars ───
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = i < 35 ? 0 : i < 70 ? 1 : 2
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * (depth === 0 ? 0.04 : depth === 1 ? 0.1 : 0.18),
        vy: (Math.random() - 0.5) * (depth === 0 ? 0.04 : depth === 1 ? 0.1 : 0.18),
        size: depth === 0 ? 0.4 : depth === 1 ? 0.8 : 1 + Math.random() * 0.6,
        alpha: depth === 0 ? 0.2 : depth === 1 ? 0.4 : 0.6 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      })
    }

    // ─── Fire particles (rise from the glowing "A" letter) ───
    const fireColors = [
      "#FF6B20", "#FF8B40", "#FFAA30", "#FF5010",
      "#FFD060", "#FF4500", "#FF7700",
    ]
    const fireParticles: FireParticle[] = []
    const spawnFire = () => {
      // "A" in "Grah" is roughly at center-x + small offset
      const cx = w * 0.5 + w * 0.02
      const cy = h * 0.5 + h * 0.02
      fireParticles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -1 - Math.random() * 2.5,
        life: 0,
        maxLife: 30 + Math.random() * 40,
        size: 2 + Math.random() * 4,
        color: fireColors[Math.floor(Math.random() * fireColors.length)],
      })
    }

    // ─── Text rendering ───
    const drawText = () => {
      const fontSize = Math.min(w * 0.14, 140)
      ctx.save()

      // "Grah" in white
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const textY = h * 0.5
      const fullText = "Grah AI"

      // Measure to find the "A" position for the glow effect
      const metrics = ctx.measureText(fullText)
      const textStartX = w * 0.5 - metrics.width / 2

      // Position of the "h" to "A" gap (roughly where the fire capsule goes)
      const grahWidth = ctx.measureText("Grah ").width
      const aWidth = ctx.measureText("A").width
      const aCenterX = textStartX + grahWidth + aWidth * 0.5

      // Glowing capsule behind the "A"
      const capsuleW = aWidth * 1.3
      const capsuleH = fontSize * 0.65
      const capsuleR = capsuleH * 0.4

      // Outer glow
      ctx.shadowColor = "#FF5500"
      ctx.shadowBlur = 60
      ctx.fillStyle = "rgba(255, 80, 0, 0.25)"
      roundRect(ctx, aCenterX - capsuleW / 2, textY - capsuleH / 2, capsuleW, capsuleH, capsuleR)
      ctx.fill()

      // Inner capsule — gradient from orange to red
      ctx.shadowBlur = 30
      const capsGrad = ctx.createLinearGradient(
        aCenterX - capsuleW / 2, textY,
        aCenterX + capsuleW / 2, textY
      )
      capsGrad.addColorStop(0, "#FF8800")
      capsGrad.addColorStop(0.4, "#FF5500")
      capsGrad.addColorStop(1, "#CC2200")
      ctx.fillStyle = capsGrad
      roundRect(ctx, aCenterX - capsuleW / 2, textY - capsuleH / 2, capsuleW, capsuleH, capsuleR)
      ctx.fill()

      // Inner bright core of capsule
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(255, 160, 60, 0.3)"
      const innerW = capsuleW * 0.6
      const innerH = capsuleH * 0.5
      roundRect(ctx, aCenterX - innerW / 2, textY - innerH / 2, innerW, innerH, innerH * 0.4)
      ctx.fill()

      // Draw the text
      ctx.shadowColor = "rgba(255,255,255,0.3)"
      ctx.shadowBlur = 20
      ctx.fillStyle = "#FFFFFF"
      ctx.fillText(fullText, w * 0.5, textY)

      // Redraw just the "A" slightly brighter over the capsule
      ctx.shadowColor = "#FF8800"
      ctx.shadowBlur = 15
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "left"
      ctx.fillText("A", textStartX + grahWidth, textY)

      ctx.restore()

      // Return the "A" center for fire particle spawning
      return { aCenterX, aTopY: textY - capsuleH / 2 }
    }

    // ─── Animation loop ───
    let fireTimer = 0
    let aPos = { aCenterX: w * 0.5, aTopY: h * 0.45 }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Draw glow blobs
      for (const blob of blobs) {
        blob.phase += blob.phaseSpeed
        const a = blob.alpha * (0.7 + 0.3 * Math.sin(blob.phase))
        blob.x += blob.vx; blob.y += blob.vy
        if (blob.x < w * -0.1 || blob.x > w * 1.1) blob.vx *= -1
        if (blob.y < h * -0.1 || blob.y > h * 1.1) blob.vy *= -1

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)
        const [r, g, b] = blob.color
        grad.addColorStop(0, `rgba(${r},${g},${b},${(a * 1.2).toFixed(4)})`)
        grad.addColorStop(0.35, `rgba(${r},${g},${b},${(a * 0.5).toFixed(4)})`)
        grad.addColorStop(0.7, `rgba(${r},${g},${b},${(a * 0.15).toFixed(4)})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad
        ctx.fillRect(blob.x - blob.radius, blob.y - blob.radius, blob.radius * 2, blob.radius * 2)
      }

      // Draw stars
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      for (const star of stars) {
        star.phase += star.speed
        const twinkle = 0.6 + 0.4 * Math.sin(star.phase)
        star.x += star.vx; star.y += star.vy
        if (star.x < -5) star.x = w + 5
        if (star.x > w + 5) star.x = -5
        if (star.y < -5) star.y = h + 5
        if (star.y > h + 5) star.y = -5
        ctx.globalAlpha = star.alpha * twinkle
        ctx.fillStyle = "#E8E4F0"
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Draw text + get "A" position
      aPos = drawText()

      // Spawn fire particles
      fireTimer++
      if (fireTimer % 2 === 0 && fireParticles.length < FIRE_PARTICLE_COUNT) {
        spawnFire()
      }

      // Draw fire particles
      for (let i = fireParticles.length - 1; i >= 0; i--) {
        const p = fireParticles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.02 // slight upward acceleration
        p.vx *= 0.99

        const progress = p.life / p.maxLife
        const a = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8
        const s = p.size * (1 - progress * 0.5)

        ctx.globalAlpha = a * 0.8
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        if (p.life >= p.maxLife) {
          fireParticles.splice(i, 1)
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
  }, [ready])

  if (!ready) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ zIndex: 0, background: BG, pointerEvents: "none" }}
      aria-hidden="true"
    />
  )
}

/** Helper: draw a rounded rectangle path */
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
