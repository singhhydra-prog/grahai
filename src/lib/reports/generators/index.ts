/* ════════════════════════════════════════════════════════
   GrahAI — Code-Based Report Generator Dispatcher

   Routes report generation to the correct generator
   based on report type. All generation is done in pure
   code using Swiss Ephemeris data — NO AI API calls.
   ════════════════════════════════════════════════════════ */

import type { ReportData } from "../kundli-report-generator"
import type { GeneratedReport } from "./types"

import { generateLoveCompatReport } from "./love-compat"
import { generateKundliMatchReport } from "./kundli-match"
import { generateCareerReport } from "./career-blueprint"
import { generateMarriageTimingReport } from "./marriage-timing"
import { generateAnnualForecastReport } from "./annual-forecast"
import { generateWealthReport } from "./wealth-growth"
import { generateDashaReport } from "./dasha-deep-dive"

export type ReportType =
  | "love-compat"
  | "kundli-match"
  | "career-blueprint"
  | "marriage-timing"
  | "annual-forecast"
  | "wealth-growth"
  | "dasha-deep-dive"

const GENERATORS: Record<ReportType, (data: ReportData, partnerData?: ReportData) => GeneratedReport> = {
  "love-compat":      (data) => generateLoveCompatReport(data),
  "kundli-match":     (data, partner) => generateKundliMatchReport(data, partner),
  "career-blueprint": (data) => generateCareerReport(data),
  "marriage-timing":  (data) => generateMarriageTimingReport(data),
  "annual-forecast":  (data) => generateAnnualForecastReport(data),
  "wealth-growth":    (data) => generateWealthReport(data),
  "dasha-deep-dive":  (data) => generateDashaReport(data),
}

/**
 * Generate a structured report from chart data.
 * Entirely code-based — no external API calls.
 */
export function generateReport(
  reportType: ReportType,
  data: ReportData,
  partnerData?: ReportData
): GeneratedReport {
  const generator = GENERATORS[reportType]
  if (!generator) {
    throw new Error(`Unknown report type: ${reportType}`)
  }
  return generator(data, partnerData)
}

export const VALID_REPORT_TYPES: ReportType[] = [
  "love-compat",
  "kundli-match",
  "career-blueprint",
  "marriage-timing",
  "annual-forecast",
  "wealth-growth",
  "dasha-deep-dive",
]

export type { GeneratedReport, ReportData }
