import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Lightweight middleware — just pass through for now
  // Auth protection is handled at the page level
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
