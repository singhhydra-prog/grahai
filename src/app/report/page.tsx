"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ReportDetailPage from "@/components/app/ReportDetailPage"

function ReportContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || "love-clarity"

  return <ReportDetailPage reportId={id} onBack={() => window.close()} />
}

export default function ReportRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-[#0A0E1A] flex items-center justify-center">
        <p className="text-xs text-[#5A6478]">Loading report...</p>
      </div>
    }>
      <ReportContent />
    </Suspense>
  )
}
