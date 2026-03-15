"use client"

import { useRouter } from "next/navigation"
import WeeklyGuidancePage from "@/components/app/WeeklyGuidancePage"

export default function WeeklyRoute() {
  const router = useRouter()
  return <WeeklyGuidancePage onBack={() => { try { window.close() } catch {} ; router.back() }} />
}
