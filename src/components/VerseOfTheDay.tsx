"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { BookOpen, RefreshCw, Volume2, VolumeX, Share2, ChevronRight } from "lucide-react"
import Link from "next/link"

/* ─── Curated verses from classical Jyotish texts ─── */
const VERSES = [
  {
    sanskrit: "ग्रहा राजानः सर्वे सर्वस्य जगतो गुरुः ।\nब्रह्मा विष्णुश्च रुद्रश्च ग्रहरूपा नमोऽस्तु ते ॥",
    translation: "All planets are kings and teachers of the entire world. Brahma, Vishnu, and Rudra manifest in planetary form — I bow to them.",
    source: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 2, Verse 3",
    topic: "Planetary Reverence",
    color: "from-gold via-amber-400 to-yellow-500",
  },
  {
    sanskrit: "जन्मकाले यथा ग्रहाः स्थिताः तथा फलं वदेत् ।\nप्रश्नकाले तथा ज्ञेयं शुभाशुभफलं बुधैः ॥",
    translation: "As planets are positioned at birth, so shall their results be declared. At the time of query too, the wise discern auspicious and inauspicious outcomes.",
    source: "Phaladeepika",
    chapter: "Chapter 1, Verse 12",
    topic: "Birth Chart Fundamentals",
    color: "from-purple-400 via-violet-400 to-indigo-400",
  },
  {
    sanskrit: "दशाफलं ग्रहबलात् विज्ञेयं कर्मजं फलम् ।\nशुभे शुभं दशाफलं पापे पापं प्रकीर्तितम् ॥",
    translation: "Dasha results are known from planetary strength and karmic merit. In auspicious periods, results are fortunate; in malefic periods, challenging.",
    source: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 46, Verse 8",
    topic: "Dasha Timing",
    color: "from-blue-400 via-cyan-400 to-teal-400",
  },
  {
    sanskrit: "योगकारकग्रहाणां दशासु महाफलं भवेत् ।\nराजयोगप्रदाः केचित् धनयोगप्रदाः परे ॥",
    translation: "In the periods of yoga-forming planets, great results manifest. Some grant Raja Yoga (power and status), others bestow Dhana Yoga (wealth).",
    source: "Saravali",
    chapter: "Chapter 35, Verse 15",
    topic: "Yogas & Fortune",
    color: "from-emerald-400 via-green-400 to-lime-400",
  },
  {
    sanskrit: "नक्षत्राणां अधिपो शशी देवो बृहस्पतिः ।\nनक्षत्रं जन्मकालीनं सर्वफलप्रदायकम् ॥",
    translation: "The Moon governs the nakshatras, and Jupiter is the lord of the devas. The birth nakshatra is the bestower of all life results.",
    source: "Jataka Parijata",
    chapter: "Chapter 2, Verse 7",
    topic: "Nakshatra Wisdom",
    color: "from-rose-400 via-pink-400 to-fuchsia-400",
  },
  {
    sanskrit: "लग्नं प्रधानं सर्वत्र लग्नाधिपबलं तथा ।\nबलवान् लग्नपो यस्य तस्य सर्वं शुभं भवेत् ॥",
    translation: "The Ascendant (Lagna) is paramount in all matters, along with its lord's strength. One whose Lagna lord is strong experiences auspiciousness in all things.",
    source: "Brihat Parashara Hora Shastra",
    chapter: "Chapter 11, Verse 1",
    topic: "Ascendant Power",
    color: "from-amber-400 via-orange-400 to-red-400",
  },
  {
    sanskrit: "शनैश्चरस्य दृष्टौ तु विलम्बः कार्यसिद्धये ।\nकिन्तु स्थिरफलं तस्य सन्देहो नास्ति कर्हिचित् ॥",
    translation: "Under Saturn's gaze, accomplishment comes with delay. But the results he bestows are permanent — of this there is no doubt.",
    source: "Phaladeepika",
    chapter: "Chapter 8, Verse 22",
    topic: "Saturn's Lessons",
    color: "from-slate-400 via-gray-400 to-zinc-400",
  },
]

export default function VerseOfTheDay() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [verseIdx, setVerseIdx] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Deterministic "daily" verse based on date
  useEffect(() => {
    const day = new Date()
    const seed = day.getFullYear() * 1000 + (day.getMonth() + 1) * 31 + day.getDate()
    setVerseIdx(seed % VERSES.length)
  }, [])

  const verse = VERSES[verseIdx]

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utter = new SpeechSynthesisUtterance(verse.translation)
    utter.rate = 0.85
    utter.onend = () => setIsSpeaking(false)
    speechSynthesis.speak(utter)
    setIsSpeaking(true)
  }

  const nextVerse = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
    setVerseIdx((prev) => (prev + 1) % VERSES.length)
  }

  const handleShare = () => {
    const text = `"${verse.translation}" — ${verse.source}, ${verse.chapter}\n\nDiscover ancient Vedic wisdom at GrahAI`
    if (navigator.share) {
      navigator.share({ title: "Verse of the Day — GrahAI", text, url: window.location.origin })
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text + " " + window.location.origin)}`
      window.open(url, "_blank")
    }
  }

  return (
    <section className="relative py-20 lg:py-28 border-y border-white/[0.03]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.02] rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold/60" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold/50">
                Verse of the Day
              </span>
            </div>
            <span className="text-[10px] text-text-dim/30">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
            </span>
          </div>

          {/* Verse card */}
          <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden">
            {/* Topic badge */}
            <div className="px-6 pt-5">
              <span className={`inline-block text-[10px] tracking-[0.15em] uppercase font-semibold bg-gradient-to-r ${verse.color} bg-clip-text text-transparent`}>
                {verse.topic}
              </span>
            </div>

            {/* Sanskrit verse */}
            <div className="px-6 pt-4 pb-3">
              <p className="text-base md:text-lg text-gold/70 font-hindi leading-loose whitespace-pre-line">
                {verse.sanskrit}
              </p>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Translation */}
            <div className="px-6 py-4">
              <p className="text-sm text-white/80 leading-relaxed italic">
                &ldquo;{verse.translation}&rdquo;
              </p>
            </div>

            {/* Source */}
            <div className="px-6 pb-4">
              <p className="text-[11px] text-text-dim/40">
                — {verse.source}, {verse.chapter}
              </p>
            </div>

            {/* Action bar */}
            <div className="px-5 py-3 border-t border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSpeech}
                  className="flex items-center gap-1.5 text-xs text-text-dim/40 hover:text-text-dim/60 transition-colors"
                  title={isSpeaking ? "Stop" : "Listen"}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  {isSpeaking ? "Stop" : "Listen"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-text-dim/40 hover:text-text-dim/60 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
                <button
                  onClick={nextVerse}
                  className="flex items-center gap-1.5 text-xs text-text-dim/40 hover:text-text-dim/60 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Next verse
                </button>
              </div>
              <Link
                href="/chat"
                className="flex items-center gap-1 text-xs font-medium text-gold/70 hover:text-gold transition-colors"
              >
                Explore more wisdom
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
