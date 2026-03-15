"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ReportDetailPage from "@/components/app/ReportDetailPage"

function ReportContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || "love-compat"

  return <ReportDetailPage reportId={id} onBack={() => { try { window.close() } catch {} ; router.back() }} />
}

export default function ReportRoute() {
  return (
    <div className="page-enter">
      <Suspense fallback={
        <div className="min-h-dvh bg-[#0A0E1A] flex items-center justify-center">
          <p className="text-xs text-[#8892A3]">Loading report...</p>
        </div>
      }>
        <ReportContent />
      </Suspense>
    </div>
  )
}
