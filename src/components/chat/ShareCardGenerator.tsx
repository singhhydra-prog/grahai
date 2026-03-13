"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Download, Copy, X, Smartphone, Square, MessageCircle } from "lucide-react"

interface ShareCardGeneratorProps {
  text: string
  vertical?: string
  isOpen: boolean
  onClose: () => void
}

const VERTICAL_ICONS: Record<string, string> = {
  astrology: "🪐",
  numerology: "🔢",
  tarot: "🃏",
  vastu: "🏠",
  palmistry: "🤚",
  general: "✨",
}

export default function ShareCardGenerator({
  text,
  vertical = "astrology",
  isOpen,
  onClose,
}: ShareCardGeneratorProps) {
  const [format, setFormat] = useState<"square" | "story">("square")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateCard = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const isStory = format === "story"
    const w = 1080
    const h = isStory ? 1920 : 1080
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, "#0a0e1a")
    grad.addColorStop(0.5, "#1a1040")
    grad.addColorStop(1, "#0a0e1a")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Decorative stars
    ctx.fillStyle = "rgba(201, 162, 77, 0.15)"
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = Math.random() * 2 + 0.5
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Subtle border glow
    ctx.strokeStyle = "rgba(201, 162, 77, 0.15)"
    ctx.lineWidth = 2
    ctx.strokeRect(40, 40, w - 80, h - 80)

    // GrahAI header
    const headerY = isStory ? 200 : 120
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "rgba(201, 162, 77, 0.8)"
    ctx.textAlign = "center"
    ctx.fillText("GrahAI · Jyotish Darpan", w / 2, headerY)

    // Decorative line
    ctx.strokeStyle = "rgba(201, 162, 77, 0.3)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w / 2 - 120, headerY + 20)
    ctx.lineTo(w / 2 + 120, headerY + 20)
    ctx.stroke()

    // Vertical label
    ctx.font = "16px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
    ctx.textAlign = "center"
    ctx.fillText(
      `${VERTICAL_ICONS[vertical] || "✨"} ${vertical.charAt(0).toUpperCase() + vertical.slice(1)} Insight`,
      w / 2,
      headerY + 50
    )

    // Main insight text (word-wrapped)
    const truncated = text.length > 280 ? text.slice(0, 277) + "..." : text
    const cleanText = truncated
      .replace(/[#*_~`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim()

    ctx.font = "32px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "#E8E4DB"
    ctx.textAlign = "center"

    const maxWidth = w - 160
    const lineHeight = 48
    const words = cleanText.split(" ")
    let line = ""
    const lines: string[] = []

    for (const word of words) {
      const testLine = line + (line ? " " : "") + word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = testLine
      }
    }
    if (line) lines.push(line)

    const maxLines = isStory ? 12 : 8
    const displayLines = lines.slice(0, maxLines)
    if (lines.length > maxLines) {
      displayLines[displayLines.length - 1] =
        displayLines[displayLines.length - 1].slice(0, -3) + "..."
    }

    const textStartY = isStory
      ? h / 2 - (displayLines.length * lineHeight) / 2
      : h / 2 - (displayLines.length * lineHeight) / 2 + 20

    // Quote marks
    ctx.font = "bold 72px Georgia, serif"
    ctx.fillStyle = "rgba(201, 162, 77, 0.2)"
    ctx.textAlign = "center"
    ctx.fillText('"', w / 2, textStartY - 10)

    // Draw text lines
    ctx.font = "32px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "#E8E4DB"
    ctx.textAlign = "center"
    displayLines.forEach((l, i) => {
      ctx.fillText(l, w / 2, textStartY + i * lineHeight)
    })

    // Bottom CTA
    const bottomY = h - (isStory ? 180 : 100)

    // Divider
    ctx.strokeStyle = "rgba(201, 162, 77, 0.2)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(80, bottomY - 30)
    ctx.lineTo(w - 80, bottomY - 30)
    ctx.stroke()

    ctx.font = "bold 22px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "rgba(201, 162, 77, 0.7)"
    ctx.textAlign = "center"
    ctx.fillText("Get your personalized Vedic reading", w / 2, bottomY)

    ctx.font = "18px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "rgba(201, 162, 77, 0.45)"
    ctx.textAlign = "center"
    ctx.fillText("grahai.app", w / 2, bottomY + 35)

    return canvas
  }, [text, vertical, format])

  const handleDownload = useCallback(async () => {
    setGenerating(true)
    try {
      const canvas = await generateCard()
      if (!canvas) {
        setGenerating(false)
        return
      }

      const link = document.createElement("a")
      link.download = `grahai-insight-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } finally {
      setGenerating(false)
    }
  }, [generateCard])

  const handleCopy = useCallback(async () => {
    setGenerating(true)
    try {
      const canvas = await generateCard()
      if (!canvas) {
        setGenerating(false)
        return
      }

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ])
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            } catch {
              // Fallback: download instead
              const link = document.createElement("a")
              link.download = `grahai-insight-${Date.now()}.png`
              link.href = canvas.toDataURL("image/png")
              link.click()
            }
          }
          setGenerating(false)
        },
        "image/png"
      )
    } catch {
      setGenerating(false)
    }
  }, [generateCard])

  const handleWhatsApp = useCallback(async () => {
    const truncated = text.length > 200 ? text.slice(0, 197) + "..." : text
    const cleanText = truncated
      .replace(/[#*_~`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim()
    const shareText = `${cleanText}\n\n🪐 Get your personalized Vedic reading at grahai.app`
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(url, "_blank")
  }, [text])

  const handleNativeShare = useCallback(async () => {
    setGenerating(true)
    try {
      const canvas = await generateCard()
      if (!canvas) {
        setGenerating(false)
        return
      }

      canvas.toBlob(
        async (blob) => {
          if (blob && navigator.share) {
            const file = new File([blob], "grahai-insight.png", {
              type: "image/png",
            })
            try {
              await navigator.share({
                title: "GrahAI Insight",
                text: "Check out my Vedic astrology insight from GrahAI",
                files: [file],
              })
            } catch {
              // User cancelled or not supported
            }
          }
          setGenerating(false)
        },
        "image/png"
      )
    } catch {
      setGenerating(false)
    }
  }, [generateCard])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-gradient-to-br from-[#0a0e1a] via-[#0E1538] to-[#0a0e1a] rounded-2xl border border-white/[0.06] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-semibold text-white">
                    Share Insight
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Format Toggle */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide block mb-2">
                    Format
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormat("square")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${
                        format === "square"
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                          : "border-white/[0.06] text-white/50 hover:bg-white/5"
                      }`}
                    >
                      <Square className="w-4 h-4" />
                      <span className="text-xs font-medium">Square</span>
                    </button>
                    <button
                      onClick={() => setFormat("story")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${
                        format === "story"
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                          : "border-white/[0.06] text-white/50 hover:bg-white/5"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-medium">Story</span>
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wide block mb-2">
                    Preview
                  </label>
                  <div
                    className={`bg-black/30 rounded-lg border border-white/[0.06] flex items-center justify-center overflow-hidden ${
                      format === "story" ? "aspect-[9/16]" : "aspect-square"
                    }`}
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50 transition-all text-xs font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 disabled:opacity-50 transition-all text-xs font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/25 disabled:opacity-50 transition-all text-xs font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  {typeof navigator !== "undefined" &&
                    typeof navigator.share === "function" && (
                      <button
                        onClick={handleNativeShare}
                        disabled={generating}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 disabled:opacity-50 transition-all text-xs font-medium"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    )}
                </div>

                {generating && (
                  <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                    Generating...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
