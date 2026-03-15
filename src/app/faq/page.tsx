"use client"

import { useRouter } from "next/navigation"
import FAQPage from "@/components/app/legal/FAQPage"

export default function FAQRoute() {
  const router = useRouter()
  return <div className="page-enter"><FAQPage onBack={() => { try { window.close() } catch {} ; router.back() }} /></div>
}
