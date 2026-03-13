"use client"

// ─── Founder Note ──────────────────────────────
// Trust-building element. Personal, warm, brief.

interface FounderNoteProps {
  className?: string
}

export default function FounderNote({ className = "" }: FounderNoteProps) {
  return (
    <div className={`rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-xs font-semibold text-gold">
          H
        </div>
        <div>
          <p className="text-xs font-medium text-text">From the founder</p>
          <p className="text-[10px] text-text-dim/50">Harendra · GrahAI</p>
        </div>
      </div>
      <p className="text-xs text-text-dim/70 leading-relaxed">
        I built GrahAI because I believe Vedic astrology deserves better than
        vague predictions and fear-based advice. Every insight here is grounded
        in classical texts, interpreted with care, and presented with the
        sources visible. You deserve to understand <em>why</em>, not just <em>what</em>.
      </p>
    </div>
  )
}
