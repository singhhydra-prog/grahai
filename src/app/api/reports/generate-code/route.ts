/* ════════════════════════════════════════════════════════════════
   GrahAI — Code-Based Report Generation API Route

   POST /api/reports/generate-code
   Body: {
     reportType: "love-compat" | "kundli-match" | "career-blueprint" |
                 "marriage-timing" | "annual-forecast" | "wealth-growth" |
                 "dasha-deep-dive",
     birthDetails: BirthDetails,
     name?: string,
     partnerBirthDetails?: BirthDetails,
     partnerName?: string,
   }

   Generates structured reports using PURE CODE calculations.
   No AI API calls — all content is derived from Swiss Ephemeris
   chart data and Vedic astrology rules.

   ════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { assembleReportData } from "@/lib/reports/kundli-report-generator"
import { generateReport, VALID_REPORT_TYPES } from "@/lib/reports/generators"
import type { ReportType } from "@/lib/reports/generators"
import type { BirthDetails } from "@/lib/ephemeris/types"

// ─── Types ──────────────────────────────────────────────────────

interface SuccessResponse {
  success: true
  reportType: ReportType
  generatedAt: string
  name: string
  partnerName?: string
  summary: string
  sections: Array<{
    title: string
    content: string
    highlights?: string[]
  }>
  remedies?: Array<{
    type: string
    description: string
  }>
  engine: "code"
}

interface ErrorResponse {
  success: false
  error: string
  code?: string
}

type ApiResponse = SuccessResponse | ErrorResponse

// ─── Main POST Handler ───────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const startTime = Date.now()

  try {
    // Parse request body
    const body = await req.json()
    const {
      reportType,
      birthDetails,
      name,
      partnerBirthDetails,
      partnerName,
    } = body as {
      reportType?: string
      birthDetails?: BirthDetails
      name?: string
      partnerBirthDetails?: BirthDetails
      partnerName?: string
    }

    // Validate required fields
    if (!reportType || !birthDetails) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: reportType and birthDetails",
          code: "INVALID_REQUEST",
        } as ErrorResponse,
        { status: 400 }
      )
    }

    // Validate report type
    if (!VALID_REPORT_TYPES.includes(reportType as ReportType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid reportType. Must be one of: ${VALID_REPORT_TYPES.join(", ")}`,
          code: "INVALID_REPORT_TYPE",
        } as ErrorResponse,
        { status: 400 }
      )
    }

    const typedReportType = reportType as ReportType

    // Validate birth date format
    if (!birthDetails.date || !birthDetails.latitude || !birthDetails.longitude) {
      return NextResponse.json(
        {
          success: false,
          error: "birthDetails must include date, latitude, and longitude",
          code: "INVALID_BIRTH_DETAILS",
        } as ErrorResponse,
        { status: 400 }
      )
    }

    console.log(`[generate-code] Generating ${typedReportType} for ${name || "Native"}, birth: ${birthDetails.date}`)

    // Step 1: Assemble natal chart data (Swiss Ephemeris calculations)
    const reportData = await assembleReportData(birthDetails, name)

    console.log(
      `[generate-code] Chart assembled in ${Date.now() - startTime}ms: ` +
      `Asc=${reportData.natalChart.ascendantSign?.name}, ` +
      `Moon=${reportData.natalChart.moonSign?.name}, ` +
      `Yogas=${reportData.yogas.length}, Doshas=${reportData.doshas.length}`
    )

    // Step 2: Assemble partner chart if needed (for kundli-match)
    let partnerReportData = undefined
    if (typedReportType === "kundli-match" && partnerBirthDetails) {
      partnerReportData = await assembleReportData(partnerBirthDetails, partnerName)
      console.log(`[generate-code] Partner chart assembled: ${partnerReportData.natalChart.moonSign?.name}`)
    }

    // Step 3: Generate report from code (NO AI API call)
    const generated = generateReport(typedReportType, reportData, partnerReportData)

    const totalTime = Date.now() - startTime
    console.log(`[generate-code] Report generated in ${totalTime}ms (${generated.sections.length} sections)`)

    // Build final response
    const response: SuccessResponse = {
      success: true,
      reportType: typedReportType,
      generatedAt: new Date().toISOString(),
      name: name || "Native",
      partnerName,
      summary: generated.summary,
      sections: generated.sections,
      remedies: generated.remedies,
      engine: "code",
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[generate-code] Error after ${totalTime}ms:`, error)
    console.error("[generate-code] Stack:", error instanceof Error ? error.stack : "no stack")

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"

    return NextResponse.json(
      {
        success: false,
        error: `Report generation failed: ${errorMessage}`,
        code: "GENERATION_ERROR",
      } as ErrorResponse,
      { status: 500 }
    )
  }
}

// ─── OPTIONS Handler (CORS support) ──────────────────────────

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
