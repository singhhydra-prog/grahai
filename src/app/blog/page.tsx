"use client"

import { ArrowRight, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BlurReveal, Reveal } from "@/components/Animations"

const articles = [
  {
    category: "Vedic Astrology",
    title: "Understanding Your Birth Chart: A Beginner's Guide to Kundli",
    excerpt: "Your Kundli is more than a horoscope — it's a precise map of the cosmos at the moment of your birth. Learn how planetary positions, houses, and Nakshatras shape your unique chart.",
    readTime: "8 min read",
    date: "March 2026",
    featured: true,
  },
  {
    category: "Numerology",
    title: "Life Path Numbers: What Your Birth Date Reveals",
    excerpt: "Discover how your Life Path number is calculated and what it reveals about your personality, strengths, challenges, and life purpose.",
    readTime: "6 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Tarot",
    title: "The Celtic Cross Spread: A Complete Interpretation Guide",
    excerpt: "The Celtic Cross is the most comprehensive Tarot spread. Here's how to read each position, interpret card interactions, and understand reversed cards.",
    readTime: "10 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Vastu",
    title: "Vastu for Your Home: Room-by-Room Directional Guide",
    excerpt: "Ancient Vastu principles for modern living spaces. Learn the ideal placement for your kitchen, bedroom, and workspace based on the five elements.",
    readTime: "7 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Technology",
    title: "How AI Interprets Classical Sanskrit Texts",
    excerpt: "A look inside GrahAI's approach to training AI on texts like Brihat Parashara Hora Shastra — preserving authenticity while enabling accessibility.",
    readTime: "5 min read",
    date: "March 2026",
    featured: false,
  },
  {
    category: "Vedic Astrology",
    title: "Mangal Dosha: Facts, Myths, and Remedies",
    excerpt: "Mangal Dosha is one of the most misunderstood concepts in Vedic astrology. We separate classical teachings from modern misconceptions.",
    readTime: "9 min read",
    date: "March 2026",
    featured: false,
  },
]

export default function BlogPage() {
  const featured = articles.find(a => a.featured)
  const rest = articles.filter(a => !a.featured)

  return (
    <main className="relative min-h-screen bg-bg">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-16 px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <BlurReveal><p className="text-label text-gold/30 mb-6">Blog & Resources</p></BlurReveal>
          <BlurReveal delay={0.1}>
            <h1 className="heading-section mb-6">
              Vedic wisdom, <span className="gold-text">explained</span>
            </h1>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p className="text-body mx-auto max-w-lg">
              Deep dives into astrology, numerology, tarot, and vastu — plus behind-the-scenes
              on how we&apos;re building GrahAI.
            </p>
          </BlurReveal>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="px-6 lg:px-10 pb-16">
          <div className="mx-auto max-w-6xl">
            <BlurReveal delay={0.3}>
              <div className="group rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 lg:p-12 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50 cursor-pointer">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-gold">{featured.category}</span>
                  <span className="text-caption text-text-dim/60 flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text mb-4 group-hover:text-gold/80 transition-colors">{featured.title}</h2>
                <p className="text-body max-w-2xl mb-8">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-label text-gold/50 group-hover:text-gold/70 transition-colors">
                  <span>Read Article</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </BlurReveal>
          </div>
        </section>
      )}

      {/* ARTICLES GRID */}
      <section className="px-6 lg:px-10 pb-32 lg:pb-48">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, i) => (
              <Reveal key={article.title} delay={i * 0.08}>
                <div className="group flex flex-col rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/50 cursor-pointer h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex rounded-full border border-white/[0.08] px-3 py-1 text-[9px] font-semibold tracking-[0.15em] uppercase text-text-dim/40">{article.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-3 group-hover:text-gold/80 transition-colors flex-1">{article.title}</h3>
                  <p className="text-caption mb-6">{article.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-caption text-text-dim/60 flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                    <span className="text-label text-gold/45 group-hover:text-gold/70 transition-colors flex items-center gap-1">
                      Read<ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 lg:px-10 py-24 lg:py-32 border-t border-white/[0.03]">
        <div className="mx-auto max-w-3xl text-center">
          <BlurReveal>
            <h2 className="heading-section mb-6">Stay <span className="gold-text">informed</span></h2>
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <p className="text-body mx-auto mb-10 max-w-md">
              Join the waitlist to receive new articles, product updates, and early access when we launch.
            </p>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <Link href="/#waitlist" className="group inline-flex items-center gap-3 rounded-xl bg-gold px-10 py-4 text-base font-semibold text-bg transition-all hover:bg-gold-light active:scale-[0.98]">
              Join the Waitlist<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </BlurReveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
