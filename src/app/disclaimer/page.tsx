"use client"

import { useRouter } from "next/navigation"
import DisclaimerPage from "@/components/app/legal/DisclaimerPage"

export default function DisclaimerRoute() {
  const router = useRouter()
  return <DisclaimerPage onBack={() => { try { window.close() } catch {} ; router.back() }} />
}
