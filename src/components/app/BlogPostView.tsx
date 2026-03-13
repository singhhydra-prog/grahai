"use client"

import { ArrowLeft, Clock, MessageCircle } from "lucide-react"
import { BlurReveal } from "@/components/Animations"
import { articles } from "@/app/blog/articles"

interface BlogPostViewProps {
  onBack: () => void
  slug: string
}

export default function BlogPostView({ onBack, slug }: BlogPostViewProps) {
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    return (
      <main className="min-h-screen bg-[#050810]">
        <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <h1 className="text-lg font-bold text-white">Blog</h1>
        </div>
        <section className="relative pt-40 pb-16 px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">Article Not Found</h1>
            <p className="text-sm text-white/60 mb-8">
              Sorry, we couldn't find the article you're looking for.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050810]">
      {/* Back button header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Blog Post</h1>
      </div>

      {/* ARTICLE HEADER */}
      <section className="relative pt-32 pb-16 px-6 lg:px-10 border-b border-white/[0.03]">
        <div className="mx-auto max-w-3xl">
          <BlurReveal>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-amber-400 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </button>
          </BlurReveal>

          <BlurReveal delay={0.1}>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex rounded-full bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-amber-400">
                {article.category}
              </span>
              <span className="text-xs text-white/60 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </div>
          </BlurReveal>

          <BlurReveal delay={0.2}>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
          </BlurReveal>

          <BlurReveal delay={0.3}>
            <p className="text-sm text-white/60 text-lg">
              {article.excerpt}
            </p>
          </BlurReveal>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="relative py-16 px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-invert max-w-none">
            {article.content.split("\n\n").map((paragraph, idx) => (
              <BlurReveal key={idx} delay={0.4 + idx * 0.05}>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">
                  {paragraph}
                </p>
              </BlurReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative px-6 lg:px-10 py-16 border-t border-white/[0.03]">
        <div className="mx-auto max-w-3xl">
          <BlurReveal>
            <div className="rounded-2xl border border-white/[0.04] bg-white/[0.03] p-8 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Ready for personalized insights?
              </h2>
              <p className="text-sm text-white/60 mb-8">
                Get detailed astrological, numerological, and tarot guidance tailored to your unique cosmic profile. Our AI combines ancient wisdom with modern technology.
              </p>
              <button
                className="inline-flex items-center gap-3 rounded-xl bg-amber-400 px-8 py-4 text-base font-semibold text-[#050810] transition-all hover:bg-amber-300 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat with GrahAI
              </button>
            </div>
          </BlurReveal>
        </div>
      </section>

      {/* MORE ARTICLES */}
      <section className="relative px-6 lg:px-10 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <BlurReveal>
            <h2 className="text-2xl font-bold text-white mb-10">More Articles</h2>
          </BlurReveal>

          <div className="space-y-6">
            {articles
              .filter((a) => a.slug !== article.slug)
              .slice(0, 3)
              .map((relatedArticle, idx) => (
                <BlurReveal key={relatedArticle.slug} delay={0.1 + idx * 0.05}>
                  <button
                    onClick={() => {
                      // Navigation would be handled by parent component
                    }}
                    className="w-full group flex items-start gap-6 rounded-xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all duration-500 hover:border-amber-400/10 hover:bg-white/[0.04] cursor-pointer text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex rounded-full border border-white/[0.08] px-3 py-0.5 text-[9px] font-semibold tracking-[0.15em] uppercase text-white/40">
                          {relatedArticle.category}
                        </span>
                        <span className="text-xs text-white/60 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {relatedArticle.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-amber-400/80 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-2">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-amber-400/45 group-hover:text-amber-400/70 transition-colors">
                      →
                    </div>
                  </button>
                </BlurReveal>
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}
