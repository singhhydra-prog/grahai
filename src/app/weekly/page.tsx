"use client"

import WeeklyGuidancePage from "@/components/app/WeeklyGuidancePage"

export default function WeeklyRoute() {
  return <WeeklyGuidancePage onBack={() => window.close()} />
}
