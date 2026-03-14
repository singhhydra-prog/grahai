"use client"

/**
 * GrahAI brand logo — geometric wireframe text style
 * Matches the brand identity: gold (#D4A054) on dark (#0A0E1A)
 * The text has a subtle geometric line pattern inside the letters
 * with a soft glow effect for the cosmic aesthetic.
 */
export default function GrahAILogo({
  className = "",
  size = "md",
}: {
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const fontSize = size === "sm" ? "text-2xl" : size === "lg" ? "text-5xl" : "text-4xl"
  const id = `logo-pattern-${size}`

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* Geometric wireframe pattern inside the letters */}
          <pattern
            id={id}
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
            patternTransform="rotate(30)"
          >
            {/* Dark gold base */}
            <rect width="20" height="20" fill="#D4A054" />
            {/* Geometric lines */}
            <line x1="0" y1="0" x2="20" y2="20" stroke="#B8863C" strokeWidth="0.5" opacity="0.6" />
            <line x1="20" y1="0" x2="0" y2="20" stroke="#B8863C" strokeWidth="0.5" opacity="0.6" />
            <line x1="10" y1="0" x2="10" y2="20" stroke="#FFE4A0" strokeWidth="0.3" opacity="0.3" />
            <line x1="0" y1="10" x2="20" y2="10" stroke="#FFE4A0" strokeWidth="0.3" opacity="0.3" />
            {/* Diamond accents */}
            <circle cx="10" cy="10" r="1" fill="#FFE4A0" opacity="0.4" />
            <circle cx="0" cy="0" r="0.8" fill="#FFE4A0" opacity="0.3" />
            <circle cx="20" cy="20" r="0.8" fill="#FFE4A0" opacity="0.3" />
          </pattern>
        </defs>
      </svg>

      <span
        className={`font-bold tracking-wider ${fontSize}`}
        style={{
          background: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><rect width='20' height='20' fill='%23D4A054'/><line x1='0' y1='0' x2='20' y2='20' stroke='%23B8863C' stroke-width='.7' opacity='.5'/><line x1='20' y1='0' x2='0' y2='20' stroke='%23B8863C' stroke-width='.7' opacity='.5'/><line x1='10' y1='0' x2='10' y2='20' stroke='%23FFE4A0' stroke-width='.4' opacity='.25'/><line x1='0' y1='10' x2='20' y2='10' stroke='%23FFE4A0' stroke-width='.4' opacity='.25'/><circle cx='10' cy='10' r='1.2' fill='%23FFE4A0' opacity='.35'/></svg>`
          )}")`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 12px rgba(212,160,84,0.4)) drop-shadow(0 0 24px rgba(212,160,84,0.15))",
        }}
      >
        Grah AI
      </span>

      {/* Subtle tagline */}
      <span
        className="text-[10px] tracking-[0.3em] uppercase self-end mb-[0.15em] ml-1 hidden sm:inline"
        style={{ color: "rgba(212,160,84,0.5)" }}
      >
        Jyotish Darpan
      </span>
    </div>
  )
}
