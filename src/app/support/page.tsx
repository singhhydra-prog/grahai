"use client"

import { useRouter } from "next/navigation"
import SupportPage from "@/components/app/legal/SupportPage"

export default function SupportRoute() {
  const router = useRouter()
  return <SupportPage onBack={() => { try { window.close() } catch {} ; router.back() }} />
}
