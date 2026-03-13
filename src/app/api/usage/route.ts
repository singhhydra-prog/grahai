import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getUsageSummary } from "@/lib/agents/usage-limiter"

/* ════════════════════════════════════════════════════════
   USAGE API — Returns current usage stats for the user
   Used by client to show remaining message counts
   ════════════════════════════════════════════════════════ */

export async function GET(req: NextRequest) {
  try {
    const sb = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll() },
          setAll() { /* API route */ },
        },
      }
    )

    const { data: { user }, error: authError } = await sb.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const summary = await getUsageSummary(user.id)

    return NextResponse.json(summary)
  } catch (err) {
    console.error("Usage API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
