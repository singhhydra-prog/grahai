"use client"

import { useEffect, useRef } from "react"

/**
 * Full-screen canvas-based cosmic background with:
 * - Twinkling stars at multiple depths
 * - Slow-drifting nebula clouds
 * - Occasional shooting stars
 * - Subtle zodiac constellation connections
 * Renders on a fixed canvas behind all content.
 */
export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    // Deterministic random
    const sr = (n: number) => {
      const x = Math.sin(n + 1) * 10000
      return x - Math.floor(x)
    }

    // Stars at 3 depth layers
    const stars = Array.from({ length: 200 }, (_, i) => ({
      x: sr(i * 3) * width,
      y: sr(i * 3 + 1) * height,
      r: sr(i * 3 + 2) * 1.5 + 0.3,
      speed: sr(i * 7) * 0.15 + 0.02,
      phase: sr(i * 11) * Math.PI * 2,
      layer: i < 60 ? 0 : i < 140 ? 1 : 2, // far, mid, near
    }))

    // Nebula blobs
    const nebulae = Array.from({ length: 5 }, (_, i) => ({
      x: sr(i * 13 + 50) * width,
      y: sr(i * 13 + 51) * height,
      rx: sr(i * 13 + 52) * 300 + 150,
      ry: sr(i * 13 + 53) * 200 + 100,
      hue: [220, 260, 280, 200, 310][i],
      drift: sr(i * 13 + 54) * 0.2 - 0.1,
      phase: sr(i * 13 + 55) * Math.PI * 2,
    }))

    // Shooting stars
    const shooters: Array<{
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; brightness: number
    }> = []

    let time = 0

    function spawnShooter() {
      const startX = Math.random() * width * 0.8
      const angle = Math.PI * 0.15 + Math.random() * 0.3
      shooters.push({
        x: startX,
        y: -10,
        vx: Math.cos(angle) * (8 + Math.random() * 6),
        vy: Math.sin(angle) * (8 + Math.random() * 6),
        life: 0,
        maxLife: 40 + Math.random() * 30,
        brightness: 0.6 + Math.random() * 0.4,
      })
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      time += 0.008

      // Draw nebulae
      for (const n of nebulae) {
        const nx = n.x + Math.sin(time * 0.3 + n.phase) * 30
        const ny = n.y + Math.cos(time * 0.2 + n.phase) * 20
        const opacity = 0.03 + Math.sin(time * 0.15 + n.phase) * 0.015

        const grad = ctx!.createRadialGradient(nx, ny, 0, nx, ny, n.rx)
        grad.addColorStop(0, `hsla(${n.hue}, 60%, 40%, ${opacity})`)
        grad.addColorStop(0.5, `hsla(${n.hue}, 50%, 30%, ${opacity * 0.5})`)
        grad.addColorStop(1, `hsla(${n.hue}, 40%, 20%, 0)`)
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.ellipse(nx, ny, n.rx, n.ry, 0, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Draw stars
      for (const s of stars) {
        const twinkle = 0.3 + Math.sin(time * s.speed * 10 + s.phase) * 0.7
        const layerAlpha = [0.4, 0.6, 0.9][s.layer]
        const alpha = twinkle * layerAlpha

        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(232, 228, 219, ${alpha})`
        ctx!.fill()

        // Glow for bright near stars
        if (s.layer === 2 && alpha > 0.7) {
          const glow = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
          glow.addColorStop(0, `rgba(201, 162, 77, ${alpha * 0.15})`)
          glow.addColorStop(1, `rgba(201, 162, 77, 0)`)
          ctx!.fillStyle = glow
          ctx!.beginPath()
          ctx!.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      // Shooting stars
      if (Math.random() < 0.008 && shooters.length < 3) spawnShooter()
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i]
        sh.x += sh.vx
        sh.y += sh.vy
        sh.life++

        const progress = sh.life / sh.maxLife
        const alpha = sh.brightness * (1 - progress)

        // Trail
        const tailLen = 40
        ctx!.beginPath()
        ctx!.moveTo(sh.x, sh.y)
        ctx!.lineTo(sh.x - sh.vx * tailLen * 0.15, sh.y - sh.vy * tailLen * 0.15)
        const trailGrad = ctx!.createLinearGradient(
          sh.x, sh.y,
          sh.x - sh.vx * tailLen * 0.15,
          sh.y - sh.vy * tailLen * 0.15
        )
        trailGrad.addColorStop(0, `rgba(226, 196, 116, ${alpha})`)
        trailGrad.addColorStop(1, `rgba(226, 196, 116, 0)`)
        ctx!.strokeStyle = trailGrad
        ctx!.lineWidth = 1.5
        ctx!.stroke()

        // Head glow
        ctx!.beginPath()
        ctx!.arc(sh.x, sh.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()

        if (sh.life >= sh.maxLife || sh.x > width + 50 || sh.y > height + 50) {
          shooters.splice(i, 1)
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      // Reposition stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].x = sr(i * 3) * width
        stars[i].y = sr(i * 3 + 1) * height
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  )
}
