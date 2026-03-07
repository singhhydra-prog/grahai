/* ════════════════════════════════════════════════════════
   GrahAI — Report Generation API Route

   POST /api/reports/generate
   Body: { kundliId: string } or { birthDetails: BirthDetails, name?: string }

   Generates a professional Kundli PDF report, uploads to
   Supabase Storage, saves metadata to `reports` table,
   and returns a signed download URL.
   ════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { assembleReportData } from "@/lib/reports/kundli-report-generator"
import { renderKundliPDF } from "@/lib/reports/pdf-renderer"
import type { BirthDetails } from "@/lib/ephemeris/types"

// ─── Supabase Client from Request Cookies ───────────────

function getSupabaseFromReq(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll() { },
      },
    }
  )
}

// ─── Auth Helper ────────────────────────────────────────

async function getAuthUser(req: NextRequest) {
  const supabase = getSupabaseFromReq(req)
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// ─── POST Handler ───────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to generate reports." },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = await req.json()
    const { kundliId, birthDetails, name } = body as {
      kundliId?: string
      birthDetails?: BirthDetails
      name?: string
    }

    let reportBirthDetails: BirthDetails
    let reportName: string
    let linkedKundliId: string | null = kundliId || null

    // 3. Get birth details — either from existing Kundli or from request
    if (kundliId) {
      const supabase = getSupabaseFromReq(req)
      const { data: kundli, error } = await supabase
        .from("kundlis")
        .select("*")
        .eq("id", kundliId)
        .eq("user_id", user.id)
        .single()

      if (error || !kundli) {
        return NextResponse.json(
          { error: "Kundli not found or access denied." },
          { status: 404 }
        )
      }

      reportBirthDetails = {
        date: kundli.birth_date,
        time: kundli.birth_time || "12:00",
        place: kundli.birth_place || "Unknown",
        latitude: kundli.latitude,
        longitude: kundli.longitude,
        timezone: kundli.timezone || 5.5,
      }
      reportName = kundli.name || name || "Native"
    } else if (birthDetails) {
      reportBirthDetails = {
        ...birthDetails,
      }
      reportName = name || "Native"
    } else {
      return NextResponse.json(
        { error: "Provide either kundliId or birthDetails." },
        { status: 400 }
      )
    }

    // 4. Check if user already has a recent report for this kundli
    if (linkedKundliId) {
      const supabase = getSupabaseFromReq(req)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: existingReport } = await supabase
        .from("reports")
        .select("id, file_url, generated_at")
        .eq("user_id", user.id)
        .eq("kundli_id", linkedKundliId)
        .gte("generated_at", oneHourAgo)
        .order("generated_at", { ascending: false })
        .limit(1)
        .single()

      if (existingReport?.file_url) {
        return NextResponse.json({
          reportId: existingReport.id,
          downloadUrl: existingReport.file_url,
          cached: true,
          message: "A recent report already exists. Returning cached version.",
        })
      }
    }

    // 5. Assemble all report data
    const reportData = await assembleReportData(reportBirthDetails, reportName)

    // 6. Render PDF
    const pdfBuffer = await renderKundliPDF(reportData)

    // 7. Upload to Supabase Storage
    const supabase = getSupabaseFromReq(req)
    const timestamp = Date.now()
    const sanitizedName = reportName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
    const fileName = `reports/${user.id}/${sanitizedName}_kundli_${timestamp}.pdf`

    const { error: uploadError } = await supabase.storage
      .from("grahai-reports")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return NextResponse.json(
        { error: "Failed to upload report. Please try again." },
        { status: 500 }
      )
    }

    // 8. Get signed URL (valid for 7 days)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("grahai-reports")
      .createSignedUrl(fileName, 60 * 60 * 24 * 7) // 7 days

    if (signedUrlError) {
      console.error("Signed URL error:", signedUrlError)
      return NextResponse.json(
        { error: "Report generated but failed to create download link." },
        { status: 500 }
      )
    }

    // 9. Save report metadata to DB
    const { data: reportRecord, error: dbError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        kundli_id: linkedKundliId,
        report_type: "kundli_full",
        file_url: signedUrlData.signedUrl,
        storage_path: fileName,
        metadata: {
          name: reportName,
          birthDate: reportBirthDetails.date,
          place: reportBirthDetails.place,
          ascendant: reportData.natalChart.ascendantSign,
          moonSign: reportData.nakshatraAnalysis.name,
          yogaCount: reportData.yogas.length,
          doshaCount: reportData.doshas.length,
          pages: 12,
        },
        generated_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (dbError) {
      console.error("DB insert error:", dbError)
      // Non-fatal — report is still available via signed URL
    }

    // 10. Return success
    return NextResponse.json({
      reportId: reportRecord?.id || null,
      downloadUrl: signedUrlData.signedUrl,
      cached: false,
      metadata: {
        name: reportName,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        sections: [
          "Title Page",
          "Planetary Positions",
          "Lagna Chart (D1)",
          "Divisional Charts (D9, D10)",
          "Nakshatra Analysis",
          "Dasha Timeline (20 Years)",
          "Yoga Analysis",
          "Dosha Analysis",
          "House Interpretation",
          "Remedies",
          "Bibliography",
        ],
      },
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred during report generation." },
      { status: 500 }
    )
  }
}
