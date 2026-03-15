"use client"

import { useState } from "react"
import { ChevronDown, ArrowLeft, HelpCircle, Sparkles, Shield, CreditCard, Star, Users } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSection {
  title: string
  icon: typeof HelpCircle
  items: FAQItem[]
}

const FAQ_DATA: FAQSection[] = [
  {
    title: "About GrahAI",
    icon: Sparkles,
    items: [
      {
        question: "What is GrahAI?",
        answer: "GrahAI is an AI-powered Vedic astrology app that combines ancient Jyotish wisdom with modern AI. It provides personalized daily guidance, compatibility matching, detailed reports, and an AI astrologer you can ask questions to — all based on your actual birth chart.",
      },
      {
        question: "How is GrahAI different from other horoscope apps?",
        answer: "Unlike generic sun-sign horoscope apps, GrahAI uses your complete Vedic birth chart (including Moon sign, Nakshatra, Dasha periods, and planetary transits) to give you highly personalized guidance. Every insight is sourced from classical Jyotish principles and explained in plain language by our AI.",
      },
      {
        question: "Is GrahAI based on Vedic or Western astrology?",
        answer: "GrahAI is primarily based on Vedic (Jyotish) astrology, which uses the sidereal zodiac. However, we also show your Western sun sign for reference. All predictions, remedies, and compatibility analysis follow traditional Vedic methodology.",
      },
      {
        question: "How accurate is GrahAI?",
        answer: "GrahAI's calculations are astronomically precise. Our AI interprets your chart using classical Jyotish rules (Parashari and Jaimini systems). While astrology is a guidance tool and not deterministic, our users consistently report that GrahAI's insights resonate deeply with their life experiences.",
      },
    ],
  },
  {
    title: "Your Birth Chart",
    icon: Star,
    items: [
      {
        question: "Why do you need my birth time?",
        answer: "Your birth time determines your Ascendant (Lagna), house placements, and Dasha periods — which are the most personalized parts of your chart. Without birth time, we can still provide Moon sign and Nakshatra-based guidance, but with less precision.",
      },
      {
        question: "What if I don't know my exact birth time?",
        answer: "You can select 'Time Unknown' during onboarding. GrahAI will use your Moon sign and Nakshatra (derived from birth date and place) to provide guidance. While not as precise as a full chart reading, it's still significantly more personalized than generic horoscopes.",
      },
      {
        question: "Is my birth data safe?",
        answer: "Absolutely. Your birth data is encrypted and stored securely. We never share your personal information with third parties. You can delete your data at any time from the Profile section. See our Privacy Policy for complete details.",
      },
    ],
  },
  {
    title: "Compatibility & Matching",
    icon: Users,
    items: [
      {
        question: "How does compatibility matching work?",
        answer: "GrahAI uses the traditional Ashtakoot Milan (8-fold matching) system along with additional planetary aspect analysis. We compare both birth charts across emotional bonding, mental connection, physical chemistry, trust, finances, and family life — giving you a comprehensive compatibility score out of 100.",
      },
      {
        question: "Can I check compatibility with multiple people?",
        answer: "Yes! You can check compatibility with as many people as you'd like. Free users get the overall score and 3 section breakdowns. Premium users get all 6 detailed sections with deep analysis and personalized advice.",
      },
    ],
  },
  {
    title: "Subscription & Payments",
    icon: CreditCard,
    items: [
      {
        question: "What do I get for free?",
        answer: "Free users get: daily guidance with do/avoid advice, 3 AI questions per day, basic compatibility score with 3 sections, lucky elements, and panchang details. It's a full experience — premium just goes deeper.",
      },
      {
        question: "What does Premium include?",
        answer: "Premium unlocks: unlimited AI questions, all 6 compatibility sections with deep analysis, full report catalog (career blueprint, marriage timing, annual forecast, wealth growth, Dasha deep-dive), advanced chart features, and priority support.",
      },
      {
        question: "How do I cancel my subscription?",
        answer: "You can cancel anytime from the Profile > Manage Subscription section. Your premium features will remain active until the end of your current billing period. Refunds are available within 24 hours of purchase — see our Refund Policy for details.",
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major payment methods through Razorpay, including UPI, credit/debit cards, net banking, and popular wallets. All transactions are secured with bank-grade encryption.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    items: [
      {
        question: "Does GrahAI share my data?",
        answer: "No. We do not sell, rent, or share your personal data with any third party. Your birth data and chat history are used solely to provide you with personalized astrological guidance. See our Privacy Policy for complete details.",
      },
      {
        question: "Can I delete my account?",
        answer: "Yes. You can delete your account and all associated data from Profile > Settings > Delete Account. This action is permanent and removes all your data from our servers within 30 days.",
      },
    ],
  },
]

interface FAQPageProps {
  onBack: () => void
}

export default function FAQPage({ onBack }: FAQPageProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-[#F1F0F5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#D4A054]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#F1F0F5]">FAQ</h1>
            <p className="text-xs text-[#5A6478]">Frequently Asked Questions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-6 pb-12">
        {FAQ_DATA.map((section, si) => {
          const SectionIcon = section.icon
          return (
            <div key={si}>
              {/* Section header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4A054]/10 flex items-center justify-center">
                  <SectionIcon className="w-4 h-4 text-[#D4A054]" />
                </div>
                <h2 className="text-sm font-semibold text-[#D4A054] uppercase tracking-wider">
                  {section.title}
                </h2>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {section.items.map((item, qi) => {
                  const key = `${si}-${qi}`
                  const isOpen = openItems.has(key)
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                      >
                        <span className="text-sm font-medium text-[#F1F0F5] pr-4">{item.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#5A6478] flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-[#8A8F9E] leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Still have questions? */}
        <div className="rounded-2xl border border-[#D4A054]/20 bg-[#D4A054]/5 p-5 text-center">
          <HelpCircle className="w-8 h-8 text-[#D4A054] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#F1F0F5] mb-1">Still have questions?</p>
          <p className="text-xs text-[#8A8F9E] mb-3">
            Our support team is here to help.
          </p>
          <button
            onClick={() => window.open("/support", "_blank")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-[#D4A054] to-[#B8863A] text-[#0A0E1A]"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}
