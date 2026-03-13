"use client"

import { ArrowLeft, Clock, ChevronRight } from "lucide-react"
import { BlurReveal, Reveal } from "@/components/Animations"
import { articles } from "@/app/blog/articles"

interface BlogViewProps {
  onBack: () => void
}

export default function BlogView({ onBack }: BlogViewProps) {
  const featured = articles.find(a => a.featured)
  const rest = articles.filter(a => !a.featured)

  return (
    <main className="relative min-h-screen bg-bg flex flex-col">
      {/* Back Header */}
      <header className="sticky top-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/[0.06]">
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <h1 className="text-sm font-bold text-white">Blog & Resources</h1>
        </div>
      </header>

      <div className="flex-1">
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
                <button
                  onClick={() => {
                    // Navigate to article detail
                    // In the parent component, handle this with onArticleSelect or similar
                    window.location.href = `/blog/${featured.slug}`
                  }}
                  className="w-full text-left"
                >
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
                </button>
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
                  <button
                    onClick={() => {
                      // Navigate to article detail
                      // In the parent component, handle this with onArticleSelect or similar
                      window.location.href = `/blog/${article.slug}`
                    }}
                    className="w-full text-left"
                  >
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
                  </button>
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
              <button
                onClick={() => {
                  // Scroll to waitlist section in parent component
                  const element = document.getElementById('waitlist')
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group inline-flex items-center gap-3 rounded-xl bg-gold px-10 py-4 text-base font-semibold text-bg transition-all hover:bg-gold-light active:scale-[0.98]"
              >
                Join the Waitlist<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </BlurReveal>
          </div>
        </section>
      </div>
    </main>
  )
}
