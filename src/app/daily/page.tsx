"use client"

import DailyInsightPage from "@/components/app/DailyInsightPage"

export default function DailyRoute() {
  return <DailyInsightPage onBack={() => window.close()} />
}
