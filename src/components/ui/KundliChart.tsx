"use client"

import { useState } from "react"

/**
 * KundliChart — SVG-based North Indian style Kundli chart
 * Shows 12 houses in the traditional diamond layout with planetary positions
 */

interface Planet {
  id: string
  symbol: string
  name: string
  house: number
  degree: number
  isRetrograde?: boolean
}

interface KundliChartProps {
  planets: Planet[]
  ascendantSign: number // 1-12 (Aries=1, Taurus=2, etc.)
  chartType?: "birth" | "navamsa" | "transit"
  size?: number
  showLabels?: boolean
}

const SIGN_NAMES = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
  "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis",
]

const SIGN_SYMBOLS = [
  "♈", "♉", "♊", "♋", "♌", "♍",
  "♎", "♏", "♐", "♑", "♒", "♓",
]

// North Indian chart house positions (diamond layout)
// Each house is a polygon within the main diamond
// Houses are numbered 1-12, with house 1 at the top
function getHousePolygon(house: number, size: number): string {
  const cx = size / 2
  const cy = size / 2
  const s = size * 0.45 // half-size of the diamond

  // The north indian chart is a square tilted 45 degrees (diamond)
  // with inner lines creating 12 triangular/trapezoidal houses
  const top = { x: cx, y: cy - s }
  const right = { x: cx + s, y: cy }
  const bottom = { x: cx, y: cy + s }
  const left = { x: cx - s, y: cy }
  const center = { x: cx, y: cy }

  // Midpoints of each side
  const topRight = { x: (top.x + right.x) / 2, y: (top.y + right.y) / 2 }
  const rightBottom = { x: (right.x + bottom.x) / 2, y: (right.y + bottom.y) / 2 }
  const bottomLeft = { x: (bottom.x + left.x) / 2, y: (bottom.y + left.y) / 2 }
  const leftTop = { x: (left.x + top.x) / 2, y: (left.y + top.y) / 2 }

  const houses: Record<number, string> = {
    1: `${top.x},${top.y} ${topRight.x},${topRight.y} ${center.x},${center.y} ${leftTop.x},${leftTop.y}`,
    2: `${topRight.x},${topRight.y} ${right.x},${right.y} ${center.x},${center.y}`,
    3: `${right.x},${right.y} ${rightBottom.x},${rightBottom.y} ${center.x},${center.y}`,
    4: `${rightBottom.x},${rightBottom.y} ${bottom.x},${bottom.y} ${center.x},${center.y} ${right.x},${right.y - 0.001}`.replace(
      `${right.x},${right.y - 0.001}`,
      ""
    ).trim().replace(/\s+/g, " "),
    5: `${bottom.x},${bottom.y} ${bottomLeft.x},${bottomLeft.y} ${center.x},${center.y}`,
    6: `${bottomLeft.x},${bottomLeft.y} ${left.x},${left.y} ${center.x},${center.y}`,
    7: `${left.x},${left.y} ${leftTop.x},${leftTop.y} ${center.x},${center.y} ${bottomLeft.x},${bottomLeft.y}`,
    8: `${leftTop.x},${leftTop.y} ${top.x},${top.y} ${center.x},${center.y}`,
    9: `${top.x},${top.y} ${topRight.x},${topRight.y} ${center.x},${center.y}`,
    10: `${topRight.x},${topRight.y} ${right.x},${right.y} ${center.x},${center.y}`,
    11: `${right.x},${right.y} ${rightBottom.x},${rightBottom.y} ${center.x},${center.y}`,
    12: `${rightBottom.x},${rightBottom.y} ${bottom.x},${bottom.y} ${center.x},${center.y}`,
  }

  // Simplified: we return the complete diamond layout polygons
  // North Indian style uses 4 corner triangles + 4 side triangles + 4 quadrilaterals
  return houses[house] || ""
}

// Get the center position of each house for text placement
function getHouseCenter(house: number, size: number): { x: number; y: number } {
  const cx = size / 2
  const cy = size / 2
  const s = size * 0.45
  const inner = s * 0.45

  // House positions in the North Indian diamond layout
  const positions: Record<number, { x: number; y: number }> = {
    1: { x: cx, y: cy - s * 0.65 },          // Top center (Ascendant)
    2: { x: cx + s * 0.5, y: cy - s * 0.5 },  // Top-right
    3: { x: cx + s * 0.65, y: cy },            // Right
    4: { x: cx + s * 0.5, y: cy + s * 0.5 },  // Bottom-right
    5: { x: cx, y: cy + s * 0.65 },            // Bottom center
    6: { x: cx - s * 0.5, y: cy + s * 0.5 },  // Bottom-left
    7: { x: cx - s * 0.65, y: cy },            // Left
    8: { x: cx - s * 0.5, y: cy - s * 0.5 },  // Top-left
    9: { x: cx - inner * 0.65, y: cy - inner }, // Inner top-left
    10: { x: cx + inner * 0.65, y: cy - inner }, // Inner top-right
    11: { x: cx + inner * 0.65, y: cy + inner }, // Inner bottom-right
    12: { x: cx - inner * 0.65, y: cy + inner }, // Inner bottom-left
  }

  return positions[house] || { x: cx, y: cy }
}

export default function KundliChart({
  planets,
  ascendantSign,
  chartType = "birth",
  size = 320,
  showLabels = true,
}: KundliChartProps) {
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null)

  const cx = size / 2
  const cy = size / 2
  const s = size * 0.45

  // Diamond corners
  const top = `${cx},${cy - s}`
  const right = `${cx + s},${cy}`
  const bottom = `${cx},${cy + s}`
  const left = `${cx - s},${cy}`

  // Get sign for each house
  const getSignForHouse = (house: number) => {
    const signIndex = ((ascendantSign - 1 + house - 1) % 12)
    return { name: SIGN_NAMES[signIndex], symbol: SIGN_SYMBOLS[signIndex], index: signIndex }
  }

  // Get planets in a specific house
  const getPlanetsInHouse = (house: number) => {
    return planets.filter((p) => p.house === house)
  }

  const chartTitle = chartType === "birth" ? "Rashi Chart" :
    chartType === "navamsa" ? "Navamsa (D9)" : "Transit Chart"

  return (
    <div className="flex flex-col items-center">
      {/* Chart title */}
      <p className="text-xs font-semibold text-[#D4A054] uppercase tracking-wider mb-2">{chartTitle}</p>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background glow */}
        <defs>
          <radialGradient id="chartGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A054" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#D4A054" stopOpacity="0" />
          </radialGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background circle glow */}
        <circle cx={cx} cy={cy} r={s * 1.1} fill="url(#chartGlow)" />

        {/* Main diamond outline */}
        <polygon
          points={`${top} ${right} ${bottom} ${left}`}
          fill="none"
          stroke="#D4A054"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Inner cross lines (creating 12 houses) */}
        {/* Horizontal and vertical lines through center */}
        <line x1={cx - s} y1={cy} x2={cx + s} y2={cy} stroke="#D4A054" strokeWidth="0.8" strokeOpacity="0.25" />
        <line x1={cx} y1={cy - s} x2={cx} y2={cy + s} stroke="#D4A054" strokeWidth="0.8" strokeOpacity="0.25" />

        {/* Diagonal lines from midpoints to center */}
        {/* Top-right midpoint to bottom-left midpoint */}
        <line
          x1={(cx + cx + s) / 2} y1={(cy - s + cy) / 2}
          x2={(cx + cx - s) / 2} y2={(cy + s + cy) / 2}
          stroke="#D4A054" strokeWidth="0.8" strokeOpacity="0.25"
        />
        {/* Top-left midpoint to bottom-right midpoint */}
        <line
          x1={(cx + cx - s) / 2} y1={(cy - s + cy) / 2}
          x2={(cx + cx + s) / 2} y2={(cy + s + cy) / 2}
          stroke="#D4A054" strokeWidth="0.8" strokeOpacity="0.25"
        />

        {/* House contents */}
        {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
          const pos = getHouseCenter(house, size)
          const sign = getSignForHouse(house)
          const housePlanets = getPlanetsInHouse(house)
          const isHovered = hoveredHouse === house
          const isAscendant = house === 1

          return (
            <g
              key={house}
              onMouseEnter={() => setHoveredHouse(house)}
              onMouseLeave={() => setHoveredHouse(null)}
              className="cursor-pointer"
            >
              {/* Hover highlight */}
              {isHovered && (
                <circle cx={pos.x} cy={pos.y} r={size * 0.08} fill="#D4A054" fillOpacity="0.08" />
              )}

              {/* Sign label */}
              {showLabels && (
                <text
                  x={pos.x}
                  y={pos.y - (housePlanets.length > 0 ? 12 : 4)}
                  textAnchor="middle"
                  className="select-none"
                  fill={isAscendant ? "#D4A054" : "#8892A3"}
                  fontSize={isAscendant ? "11" : "9"}
                  fontWeight={isAscendant ? "700" : "500"}
                  fontFamily="Inter, sans-serif"
                >
                  {sign.symbol} {sign.name}
                  {isAscendant && (
                    <tspan fill="#D4A054" fontSize="7" dy="-5"> Asc</tspan>
                  )}
                </text>
              )}

              {/* Planets in this house */}
              {housePlanets.map((planet, pi) => (
                <text
                  key={planet.id}
                  x={pos.x + (pi - (housePlanets.length - 1) / 2) * 18}
                  y={pos.y + 8 + (housePlanets.length > 3 ? (pi >= 3 ? 14 : 0) : 0)}
                  textAnchor="middle"
                  fill="#F1F0F5"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                  filter="url(#goldGlow)"
                >
                  {planet.symbol}
                  {planet.isRetrograde && (
                    <tspan fill="#EF4444" fontSize="7" dy="-3">R</tspan>
                  )}
                </text>
              ))}

              {/* House number (small) */}
              <text
                x={pos.x}
                y={pos.y + (housePlanets.length > 0 ? 22 : 12)}
                textAnchor="middle"
                fill="#8892A3"
                fontSize="7"
                fontFamily="Inter, sans-serif"
                opacity="0.5"
              >
                H{house}
              </text>
            </g>
          )
        })}

        {/* Ascendant marker — "Asc" at the top of the diamond */}
        <text
          x={cx}
          y={cy - s - 8}
          textAnchor="middle"
          fill="#D4A054"
          fontSize="10"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          ▲ Lagna
        </text>
      </svg>

      {/* Hovered house tooltip */}
      {hoveredHouse && (
        <div className="mt-2 text-center">
          <p className="text-xs text-[#D4A054] font-medium">
            House {hoveredHouse} — {getSignForHouse(hoveredHouse).symbol} {SIGN_NAMES[getSignForHouse(hoveredHouse).index]}
          </p>
          <p className="text-[10px] text-[#8892A3]">
            {getPlanetsInHouse(hoveredHouse).length > 0
              ? getPlanetsInHouse(hoveredHouse).map((p) => p.name).join(", ")
              : "No planets"}
          </p>
        </div>
      )}
    </div>
  )
}
