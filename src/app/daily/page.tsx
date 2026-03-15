"use client"

import { useRouter } from "next/navigation"
import DailyInsightPage from "@/components/app/DailyInsightPage"

export default function DailyRoute() {
  const router = useRouter()
  return <DailyInsightPage onBack={() => { try { window.close() } catch {}; router.back() }} />
}
