"use client"

// ─── Section Header ────────────────────────────
// Consistent section titles across all tabs.
// Calm, no emoji, optional action link.

interface SectionHeaderProps {
  label?: string         // tiny uppercase label above title
  title: string
  action?: { label: string; onTap: () => void }
  className?: string
}

export default function SectionHeader({
  label,
  title,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between mb-4 ${className}`}>
      <div>
        {label && (
          <p className="text-[9px] uppercase tracking-[0.2em] text-text-dim/40 font-medium mb-1">
            {label}
          </p>
        )}
        <h2 className="text-base font-semibold text-text">{title}</h2>
      </div>
      {action && (
        <button
          onClick={action.onTap}
          className="text-[11px] text-gold/70 hover:text-gold font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
