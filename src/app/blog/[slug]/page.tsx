import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Clock, MessageCircle } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BlurReveal } from "@/components/Animations"
import { articles } from "../articles"

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug)

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist.",
    }
  }

  return {
    title: `${article.title} | GrahAI Blog`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: `2026-03-01T00:00:00Z`,
    },
  }
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug)

  if (!article) {
    return (
      <main className="relative min-h-screen bg-bg">
        <Navbar />
        <section className="relative pt-40 pb-16 px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-section mb-6">Article Not Found</h1>
            <p className="text-body mb-8">
              Sorry, we couldn't find the article you're looking for.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-bg">
      <Navbar />

      {/* ARTICLE HEADER */}
      <section className="relative pt-32 pb-16 px-6 lg:px-10 border-b border-white/[0.03]">
        <div className="mx-auto max-w-3xl">
          <BlurReveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-label text-text-dim/60 hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </BlurReveal>

          <BlurReveal delay={0.1}>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-gold">
                {article.category}
              </span>
              <span className="text-caption text-text-dim/60 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </div>
          </BlurReveal>

          <BlurReveal delay={0.2}>
            <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6 leading-tight">
              {article.title}
            </h1>
          </BlurReveal>

          <BlurReveal delay={0.3}>
            <p className="text-body text-text-dim/80 text-lg">
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
                <p className="text-body text-text-dim/80 mb-6 leading-relaxed">
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
            <div className="rounded-2xl border border-white/[0.04] bg-bg-2/30 p-8 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-text mb-4">
                Ready for personalized insights?
              </h2>
              <p className="text-body text-text-dim/80 mb-8">
                Get detailed astrological, numerological, and tarot guidance tailored to your unique cosmic profile. Our AI combines ancient wisdom with modern technology.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-3 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-bg transition-all hover:bg-gold-light active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat with GrahAI
              </Link>
            </div>
          </BlurReveal>
        </div>
      </section>

      {/* MORE ARTICLES */}
      <section className="relative px-6 lg:px-10 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <BlurReveal>
            <h2 className="text-2xl font-bold text-text mb-10">More Articles</h2>
          </BlurReveal>

          <div className="space-y-6">
            {articles
              .filter((a) => a.slug !== article.slug)
              .slice(0, 3)
              .map((relatedArticle, idx) => (
                <BlurReveal key={relatedArticle.slug} delay={0.1 + idx * 0.05}>
                  <Link href={`/blog/${relatedArticle.slug}`}>
                    <div className="group flex items-start gap-6 rounded-xl border border-white/[0.04] bg-bg-2/20 p-6 transition-all duration-500 hover:border-gold/10 hover:bg-bg-2/40 cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex rounded-full border border-white/[0.08] px-3 py-0.5 text-[9px] font-semibold tracking-[0.15em] uppercase text-text-dim/40">
                            {relatedArticle.category}
                          </span>
                          <span className="text-caption text-text-dim/60 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relatedArticle.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-text group-hover:text-gold/80 transition-colors">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-caption text-text-dim/60 mt-2">
                          {relatedArticle.excerpt}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-gold/45 group-hover:text-gold/70 transition-colors">
                        →
                      </div>
                    </div>
                  </Link>
                </BlurReveal>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
