"use client"

/* ════════════════════════════════════════════════════════
   RashiChart — North Indian Style Kundli Diagram (SVG)

   Renders the classic diamond-in-square birth chart layout
   with planet placements in each of the 12 houses.
   ════════════════════════════════════════════════════════ */

import { motion } from "framer-motion"

// ─── Types ──────────────────────────────────────────────

interface PlanetPlacement {
  name: string
  shortName: string   // e.g. "Su", "Mo", "Ma"
  degree: number
  retrograde?: boolean
  sign: string
}

interface RashiChartProps {
  ascendantSign: number    // 1-12 (Aries=1)
  planets: PlanetPlacement[]
  houses: number[]         // sign index (1-12) for each house 1-12
  title?: string
  size?: number
  className?: string
}

// ─── Sign Symbols ───────────────────────────────────────

const SIGN_SYMBOLS = [
  "", "Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi",
]

const SIGN_NAMES = [
  "",
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

// ─── North Indian House Positions (diamond layout) ──────
// Each house maps to a polygon region in the chart.
// The center positions are for placing planet text.

interface HouseGeometry {
  // Polygon points for the house boundary
  points: string
  // Center x,y for text placement
  cx: number
  cy: number
}

// North Indian chart: House 1 is top-center diamond
// Layout on a 300x300 grid:
//   Top-left corner = (0,0), center = (150,150)
//
//   House positions (North Indian standard):
//   H1 = top center (diamond)
//   H2 = top-left triangle
//   H3 = left-top triangle
//   H4 = left center (diamond)
//   H5 = left-bottom triangle
//   H6 = bottom-left triangle
//   H7 = bottom center (diamond)
//   H8 = bottom-right triangle
//   H9 = right-bottom triangle
//   H10 = right center (diamond)
//   H11 = right-top triangle
//   H12 = top-right triangle

function getHouseGeometries(s: number): HouseGeometry[] {
  const m = s / 2 // midpoint
  const q1 = s / 4
  const q3 = (3 * s) / 4

  return [
    // House 1: top center diamond
    { points: `${m},${q1} ${q1},0 ${m},0 ${q3},0 ${m},${q1}`, cx: m, cy: q1 * 0.55 },
    // Correction: proper North Indian layout
    // Actually let me use the standard diamond-in-rectangle approach

    // The standard North Indian chart is a square with diagonals creating 12 regions:
    // Outer square: (0,0) to (s,s)
    // Inner diamond: midpoints of sides → (m,0), (s,m), (m,s), (0,m)

    // House 1 (Lagna): Top triangle of inner diamond
    // Re-doing with proper geometry:
  ]
}

// Simplified approach: define house regions explicitly
function getHouseLayout(s: number) {
  const m = s / 2

  // North Indian style: square with X diagonals
  // Creates 12 triangular/trapezoidal regions
  // Numbering goes: 1(top), 2(upper-left), 3(left-upper), 4(left),
  // 5(lower-left), 6(bottom-left), 7(bottom), 8(bottom-right),
  // 9(right-lower), 10(right), 11(right-upper), 12(upper-right)

  const houses: { path: string; tx: number; ty: number }[] = [
    // H1 - top center triangle
    { path: `M${m},${m} L0,0 L${s},0 Z`, tx: m, ty: s * 0.15 },
    // H2 - upper left triangle
    { path: `M0,0 L${m},0 L0,${m} Z`, tx: s * 0.12, ty: s * 0.2 },
    // H3 - left upper triangle
    { path: `M0,0 L0,${m} L${m},${m} Z`, tx: s * 0.2, ty: s * 0.38 },
    // H4 - left center triangle
    { path: `M0,0 L${m},${m} L0,${s} Z`, tx: s * 0.15, ty: m },
    // H5 - left lower triangle
    { path: `M0,${s} L${m},${m} L0,${m} Z`, tx: s * 0.2, ty: s * 0.62 },
    // H6 - bottom left triangle
    { path: `M0,${s} L${m},${s} L${m},${m} Z`, tx: s * 0.12, ty: s * 0.8 },
    // H7 - bottom center triangle
    { path: `M0,${s} L${m},${m} L${s},${s} Z`, tx: m, ty: s * 0.85 },
    // H8 - bottom right triangle
    { path: `M${s},${s} L${m},${s} L${m},${m} Z`, tx: s * 0.88, ty: s * 0.8 },
    // H9 - right lower triangle
    { path: `M${s},${s} L${m},${m} L${s},${m} Z`, tx: s * 0.8, ty: s * 0.62 },
    // H10 - right center triangle
    { path: `M${s},${s} L${m},${m} L${s},0 Z`, tx: s * 0.85, ty: m },
    // H11 - right upper triangle
    { path: `M${s},0 L${m},${m} L${s},${m} Z`, tx: s * 0.8, ty: s * 0.38 },
    // H12 - upper right triangle
    { path: `M${s},0 L${m},0 L${m},${m} Z`, tx: s * 0.88, ty: s * 0.2 },
  ]

  return houses
}

// ─── Map planets to houses ──────────────────────────────

function mapPlanetsToHouses(
  planets: PlanetPlacement[],
  houses: number[]
): Map<number, PlanetPlacement[]> {
  const houseMap = new Map<number, PlanetPlacement[]>()

  for (let i = 0; i < 12; i++) {
    houseMap.set(i, [])
  }

  for (const planet of planets) {
    // Find which house this planet's sign belongs to
    const planetSignIndex = SIGN_NAMES.indexOf(planet.sign)
    if (planetSignIndex < 1) continue

    const houseIndex = houses.findIndex((h) => h === planetSignIndex)
    if (houseIndex >= 0) {
      houseMap.get(houseIndex)?.push(planet)
    }
  }

  return houseMap
}

// ─── Planet abbreviation colors ─────────────────────────

const PLANET_COLORS: Record<string, string> = {
  Su: "#E2C474", // gold — Sun
  Mo: "#C8D8E4", // silver — Moon
  Ma: "#E85454", // red — Mars
  Me: "#4ADE80", // green — Mercury
  Ju: "#E2994A", // saffron — Jupiter
  Ve: "#F0C8E0", // pink — Venus
  Sa: "#6B7DA8", // blue-gray — Saturn
  Ra: "#8B8BCD", // purple — Rahu
  Ke: "#B8860B", // dark gold — Ketu
}

// ─── Component ──────────────────────────────────────────

export default function RashiChart({
  ascendantSign,
  planets,
  houses,
  title = "Lagna Chart (D1)",
  size = 300,
  className = "",
}: RashiChartProps) {
  const layout = getHouseLayout(size)
  const planetMap = mapPlanetsToHouses(planets, houses)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`inline-block ${className}`}
    >
      {/* Title */}
      {title && (
        <p className="text-center text-xs text-text-dim uppercase tracking-widest mb-2">
          {title}
        </p>
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="select-none"
      >
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="rgba(12, 18, 36, 0.8)"
          stroke="rgba(192, 162, 77, 0.3)"
          strokeWidth={1.5}
          rx={4}
        />

        {/* Diagonal lines forming the diamond */}
        <line
          x1={0} y1={0} x2={size} y2={size}
          stroke="rgba(192, 162, 77, 0.2)" strokeWidth={1}
        />
        <line
          x1={size} y1={0} x2={0} y2={size}
          stroke="rgba(192, 162, 77, 0.2)" strokeWidth={1}
        />
        {/* Horizontal and vertical midlines */}
        <line
          x1={size / 2} y1={0} x2={size / 2} y2={size}
          stroke="rgba(192, 162, 77, 0.15)" strokeWidth={0.5}
        />
        <line
          x1={0} y1={size / 2} x2={size} y2={size / 2}
          stroke="rgba(192, 162, 77, 0.15)" strokeWidth={0.5}
        />

        {/* House regions */}
        {layout.map((house, i) => {
          const isLagna = i === 0
          const signIndex = houses[i] || 1

          return (
            <g key={i}>
              {/* House boundary (subtle) */}
              <path
                d={house.path}
                fill={isLagna ? "rgba(226, 153, 74, 0.08)" : "transparent"}
                stroke="rgba(192, 162, 77, 0.25)"
                strokeWidth={0.8}
              />

              {/* Sign label (small) */}
              <text
                x={house.tx}
                y={house.ty - 6}
                textAnchor="middle"
                fill={isLagna ? "#E2994A" : "rgba(138, 134, 144, 0.6)"}
                fontSize={size * 0.028}
                fontFamily="var(--font-inter)"
              >
                {SIGN_SYMBOLS[signIndex]}
                {isLagna && " (Asc)"}
              </text>

              {/* Planets in this house */}
              {(planetMap.get(i) || []).map((planet, pi) => {
                const yOffset = pi * (size * 0.042)
                const color = PLANET_COLORS[planet.shortName] || "#E8E4DB"

                return (
                  <text
                    key={planet.shortName}
                    x={house.tx}
                    y={house.ty + 6 + yOffset}
                    textAnchor="middle"
                    fill={color}
                    fontSize={size * 0.036}
                    fontWeight={600}
                    fontFamily="var(--font-inter)"
                  >
                    {planet.shortName}
                    {planet.retrograde && (
                      <tspan fontSize={size * 0.024} fill="#E85454"> R</tspan>
                    )}
                  </text>
                )
              })}
            </g>
          )
        })}

        {/* Center label */}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          fill="rgba(192, 162, 77, 0.4)"
          fontSize={size * 0.03}
          fontFamily="var(--font-devanagari)"
        >
          ग्रह
        </text>
        <text
          x={size / 2}
          y={size / 2 + 10}
          textAnchor="middle"
          fill="rgba(192, 162, 77, 0.3)"
          fontSize={size * 0.022}
          fontFamily="var(--font-inter)"
        >
          GrahAI
        </text>
      </svg>
    </motion.div>
  )
}
