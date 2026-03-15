"use client"

import SavedLibraryPage from "@/components/app/SavedLibraryPage"

export default function LibraryRoute() {
  return <SavedLibraryPage onBack={() => window.close()} />
}
