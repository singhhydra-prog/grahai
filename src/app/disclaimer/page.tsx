"use client"

import DisclaimerPage from "@/components/app/legal/DisclaimerPage"

export default function DisclaimerRoute() {
  return <DisclaimerPage onBack={() => window.close()} />
}
