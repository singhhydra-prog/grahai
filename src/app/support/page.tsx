"use client"

import { useRouter } from "next/navigation"
import SupportPage from "@/components/app/legal/SupportPage"

export default function SupportRoute() {
  const router = useRouter()
  return <div className="page-enter"><SupportPage onBack={() => { try { window.close() } catch {} ; router.back() }} /></div>
}
