"use client"

import { motion } from "framer-motion"
import { ArrowLeft, CreditCard } from "lucide-react"

interface RefundPolicyPageProps {
  onBack: () => void
}

export default function RefundPolicyPage({ onBack }: RefundPolicyPageProps) {
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
        <h1 className="text-lg font-semibold text-[#D4A054]">Cancellation &amp; Refund Policy</h1>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D4A054]/10 flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-[#D4A054]" />
          </div>
        </div>

        <div className="space-y-5 text-sm leading-relaxed text-[#D1D5DB]">

          <p>
            Our goal is to ensure complete customer satisfaction. Users have the opportunity to explore and try the services using the Free Plan without paying for any services.
          </p>

          {/* Refund Window */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Refund Window</h3>
            <p className="text-xs text-[#9CA3AF]">
              In the event that you are dissatisfied with the services provided, GrahAI will refund the money within <span className="text-[#D4A054] font-medium">24 hours</span> of the request. A cancellation request must be conveyed to our support system through email at <span className="text-[#D4A054]">support@grahai.app</span> within the defined time frame.
            </p>
          </div>

          {/* Important Rules */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Important Rules</h3>
            <div className="space-y-2 text-xs text-[#9CA3AF]">
              <p>Any technical delay or glitch reported in receiving emails beyond the cancellation window will not be eligible for a refund.</p>
              <p>No refund shall be processed if a customer requests cancellation after <span className="text-[#D4A054] font-medium">24 hours</span> from subscribing to the services.</p>
              <p>Refunds will be processed to the original source of payment within <span className="text-[#D4A054] font-medium">5-7 business days</span> for all eligible cancellations.</p>
              <p>If there are delays in refund processing from the issuing bank, you can contact the bank directly for more information.</p>
            </div>
          </div>

          {/* Payment Issues */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Payment Issues &amp; Server Errors</h3>
            <p className="text-xs text-[#9CA3AF]">
              In case the website or payment gateway is experiencing server-related issues like slow down, failure, or session timeout:
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-[#D4A054]/10 flex items-center justify-center text-[#D4A054] text-xs font-bold flex-shrink-0">1</div>
                <p className="text-xs text-[#9CA3AF]">
                  <span className="text-[#D1D5DB] font-medium">If your bank account appears debited:</span> Do not make a second payment. Contact us immediately at support@grahai.app to confirm your payment.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-[#D4A054]/10 flex items-center justify-center text-[#D4A054] text-xs font-bold flex-shrink-0">2</div>
                <p className="text-xs text-[#9CA3AF]">
                  <span className="text-[#D1D5DB] font-medium">If your bank account is not debited:</span> You may initiate a fresh transaction to make payment.
                </p>
              </div>
            </div>
          </div>

          {/* Multiple Payments */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Multiple Payments</h3>
            <p className="text-xs text-[#9CA3AF]">
              Refund for multiple payments, if any, even after the above precautions against the same order shall be refunded in full without deduction of the transaction charges. GrahAI shall only retain the cost of one single order as intended to be placed by you.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-[#D4A054]/5 rounded-xl p-4 border border-[#D4A054]/20">
            <h3 className="text-[#F5D89A] font-semibold text-sm mb-2">Need Help?</h3>
            <p className="text-xs text-[#D1D5DB]">
              For cancellation or refund requests, please email us at:
            </p>
            <p className="text-sm text-[#D4A054] font-medium mt-2">
              support@grahai.app
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
