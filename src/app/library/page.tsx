"use client"

import { useRouter } from "next/navigation"
import SavedLibraryPage from "@/components/app/SavedLibraryPage"

export default function LibraryRoute() {
  const router = useRouter()
  return <div className="page-enter"><SavedLibraryPage onBack={() => { try { window.close() } catch {} ; router.back() }} /></div>
}
