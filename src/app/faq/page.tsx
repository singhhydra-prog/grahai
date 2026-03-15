"use client"

import { useRouter } from "next/navigation"
import FAQPage from "@/components/app/legal/FAQPage"

export default function FAQRoute() {
  const router = useRouter()
  return <FAQPage onBack={() => { try { window.close() } catch {} ; router.back() }} />
}
