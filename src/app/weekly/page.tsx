"use client"

import { useRouter } from "next/navigation"
import WeeklyGuidancePage from "@/components/app/WeeklyGuidancePage"

export default function WeeklyRoute() {
  const router = useRouter()
  return <div className="page-enter"><WeeklyGuidancePage onBack={() => { try { window.close() } catch {} ; router.back() }} /></div>
}
