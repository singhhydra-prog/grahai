import type { Metadata, Viewport } from "next"
import PushNotificationManager from "@/components/PushNotificationManager"

export const viewport: Viewport = {
  themeColor: "#0E1538",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "GrahAI · Jyotish Darpan",
  description: "Your Living Birth Chart — tap any house to explore your cosmic blueprint",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060A14] overflow-x-hidden">
      {children}
      <PushNotificationManager />
    </div>
  )
}
