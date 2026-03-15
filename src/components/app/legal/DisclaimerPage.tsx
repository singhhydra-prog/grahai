"use client"

import { motion } from "framer-motion"
import { ArrowLeft, AlertTriangle } from "lucide-react"

interface DisclaimerPageProps {
  onBack: () => void
}

export default function DisclaimerPage({ onBack }: DisclaimerPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="min-h-screen bg-[#0A0E1A] text-[#F1F0F5] pb-28"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/5 transition">
          <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
        </button>
        <h1 className="text-lg font-semibold text-[#D4A054]">Disclaimer</h1>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D4A054]/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-[#D4A054]" />
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#D1D5DB]">
          <p>
            The astrology-related content, predictions, insights, and guidance offered on the Platform are based on astrological principles, beliefs, and interpretations. The accuracy and reliability of astrological predictions and insights can vary.
          </p>
          <p>
            The use of the Platform&apos;s services and content is at the user&apos;s discretion and risk. For more details please refer to our Terms and Conditions and Privacy Policy.
          </p>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Important Notice</h3>
            <p className="text-xs text-[#9CA3AF]">
              GrahAI does not render psychological, health, or any other kind of personal professional services. If you require personal psychological and/or health-related assistance or advice, we recommend that a competent professional be consulted. GrahAI expressly disclaims all responsibilities for any liability, loss, or risk incurred as a consequence of availing our Services.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Limitation of Liability</h3>
            <p className="text-xs text-[#9CA3AF]">
              You expressly understand and agree that the use of the services is at your sole risk. The services are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. GrahAI expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose.
            </p>
            <p className="text-xs text-[#9CA3AF] mt-2">
              GrahAI makes no warranty that the services will be uninterrupted, timely, secure, or error free. Use of any material downloaded or obtained through the use of the services shall be at your own discretion and risk, and you will be solely responsible for any damage to your computer system, mobile telephone, wireless device, or data that results from the use of the services or the download of any such material.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Indemnity</h3>
            <p className="text-xs text-[#9CA3AF]">
              You agree to indemnify and hold harmless GrahAI, its officers, directors, employees, suppliers, and affiliates, from and against any losses, damages, fines and expenses (including attorney&apos;s fees and costs) arising out of or relating to any claims that you have used the Services in violation of another party&apos;s rights, in violation of any law, in violations of any provisions of the Terms and Conditions, or any other claim related to your use of the Services, except where such use is authorized by GrahAI.
            </p>
          </div>

          <p className="text-xs text-center text-[#9CA3AF] pt-4">
            &copy; {new Date().getFullYear()} GrahAI. All rights reserved.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
