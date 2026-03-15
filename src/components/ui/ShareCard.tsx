"use client"

import { useRef, useState } from "react"
import { Share2, Download, X, Instagram, MessageCircle as WhatsAppIcon } from "lucide-react"

interface ShareCardProps {
  title: string
  body: string
  footer?: string
  onClose: () => void
}

/**
 * ShareCard — generates a branded card image for sharing on WhatsApp/Instagram.
 * Uses canvas to render a gold-themed card, then triggers native share or download.
 */
export default function ShareCard({ title, body, footer, onClose }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sharing, setSharing] = useState(false)

  const generateImage = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const w = 1080
    const h = 1080
    canvas.width = w
    canvas.height = h

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
    bgGrad.addColorStop(0, "#0A0E1A")
    bgGrad.addColorStop(1, "#111827")
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Gold border
    ctx.strokeStyle = "rgba(212,160,84,0.3)"
    ctx.lineWidth = 4
    ctx.roundRect(40, 40, w - 80, h - 80, 24)
    ctx.stroke()

    // Inner gold line accent
    const lineGrad = ctx.createLinearGradient(80, 200, w - 80, 200)
    lineGrad.addColorStop(0, "rgba(212,160,84,0)")
    lineGrad.addColorStop(0.5, "rgba(212,160,84,0.5)")
    lineGrad.addColorStop(1, "rgba(212,160,84,0)")
    ctx.strokeStyle = lineGrad
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(80, 200)
    ctx.lineTo(w - 80, 200)
    ctx.stroke()

    // GrahAI branding
    ctx.font = "bold 28px Inter, sans-serif"
    ctx.fillStyle = "#D4A054"
    ctx.fillText("GrahAI", 80, 140)

    // Tagline
    ctx.font = "14px Inter, sans-serif"
    ctx.fillStyle = "#8892A3"
    ctx.fillText("Your Planets. Your Path.", 80, 170)

    // Title
    ctx.font = "bold 48px Inter, sans-serif"
    ctx.fillStyle = "#F1F0F5"
    wrapText(ctx, title, 80, 300, w - 160, 58)

    // Body
    ctx.font = "22px Inter, sans-serif"
    ctx.fillStyle = "#9CA3AF"
    wrapText(ctx, body, 80, 480, w - 160, 34)

    // Footer
    if (footer) {
      ctx.font = "italic 18px Inter, sans-serif"
      ctx.fillStyle = "#D4A054"
      wrapText(ctx, footer, 80, h - 160, w - 160, 28)
    }

    // Bottom branding
    ctx.font = "14px Inter, sans-serif"
    ctx.fillStyle = "#8892A3"
    ctx.fillText("grahai-app.vercel.app", 80, h - 80)

    // Bottom gold line
    ctx.strokeStyle = lineGrad
    ctx.beginPath()
    ctx.moveTo(80, h - 200)
    ctx.lineTo(w - 80, h - 200)
    ctx.stroke()

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 1)
    })
  }

  const handleShare = async () => {
    setSharing(true)
    const blob = await generateImage()
    if (!blob) { setSharing(false); return }

    const file = new File([blob], "grahai-insight.png", { type: "image/png" })

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "GrahAI Insight",
          text: title,
          files: [file],
        })
      } catch {}
    } else {
      // Fallback: download
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "grahai-insight.png"
      a.click()
      URL.revokeObjectURL(url)
    }
    setSharing(false)
  }

  const handleDownload = async () => {
    const blob = await generateImage()
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "grahai-insight.png"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6" onClick={onClose}>
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#F1F0F5]">Share Insight</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5">
            <X className="w-4 h-4 text-[#8892A3]" />
          </button>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-[#D4A054]/20 bg-gradient-to-b from-[#D4A054]/[0.06] to-transparent p-4 mb-4">
          <p className="text-[10px] text-[#D4A054] font-semibold mb-1">GrahAI</p>
          <p className="text-sm font-bold text-[#F1F0F5] mb-2">{title}</p>
          <p className="text-xs text-[#A0A5B2] leading-relaxed line-clamp-3">{body}</p>
          {footer && <p className="text-[10px] text-[#D4A054] mt-2 italic">{footer}</p>}
        </div>

        {/* Share actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/5 bg-white/[0.02]
              hover:border-[#25D366]/30 hover:bg-[#25D366]/5 transition-all"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            <span className="text-[10px] text-[#A0A5B2]">WhatsApp</span>
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/5 bg-white/[0.02]
              hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5 transition-all"
          >
            <Instagram className="w-5 h-5 text-[#E4405F]" />
            <span className="text-[10px] text-[#A0A5B2]">Instagram</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/5 bg-white/[0.02]
              hover:border-[#D4A054]/30 hover:bg-[#D4A054]/5 transition-all"
          >
            <Download className="w-5 h-5 text-[#D4A054]" />
            <span className="text-[10px] text-[#A0A5B2]">Save</span>
          </button>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

/* ── Utility: word-wrap text on canvas ── */
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ")
  let line = ""
  let currentY = y

  for (const word of words) {
    const testLine = line + word + " "
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY)
      line = word + " "
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, currentY)
}
