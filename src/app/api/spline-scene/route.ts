import { NextResponse } from "next/server"

/**
 * Proxy endpoint that fetches a time-limited signed URL for the Spline 3D star scene.
 * The signed URL expires after ~300 seconds, so this must be called fresh each time.
 */
export async function GET() {
  try {
    const SPLINE_FILE_ID = "faeeec90-f9d3-445f-8d5e-b8bdf7b98fc6"
    const res = await fetch(
      `https://apis.spline.design/file/signed/${SPLINE_FILE_ID}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Spline signed URL" },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json({ url: data.signedURL })
  } catch (err) {
    console.error("Spline scene proxy error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
