"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="url(#lgNav)" strokeWidth="1" opacity="0.6" />
      <circle cx="24" cy="24" r="14" stroke="url(#lgNav)" strokeWidth="0.6" opacity="0.35" />
      <circle cx="24" cy="2" r="2" fill="#C9A24D" opacity="0.9" />
      <circle cx="44" cy="17" r="1.5" fill="#E2C474" opacity="0.7" />
      <circle cx="40" cy="38" r="1.5" fill="#C9A24D" opacity="0.5" />
      <circle cx="8" cy="38" r="1.5" fill="#E2C474" opacity="0.5" />
      <circle cx="4" cy="17" r="1.5" fill="#C9A24D" opacity="0.7" />
      <circle cx="24" cy="24" r="5" fill="url(#sgNav)" />
      <defs>
        <linearGradient id="lgNav" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#C9A24D" />
          <stop offset="100%" stopColor="#E2C474" />
        </linearGradient>
        <radialGradient id="sgNav" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#E2C474" />
          <stop offset="100%" stopColor="#C9A24D" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname === path
  }

  const [productsOpen, setProductsOpen] = useState(false)

  const productLinks = [
    { href: "/kundli", label: "Kundli (Birth Chart)" },
    { href: "/horoscope", label: "Daily Horoscope" },
    { href: "/compatibility", label: "Match Making" },
    { href: "/astrologer", label: "AI Astrologer" },
  ]

  const navLinks = [
    { href: "/horoscope", label: "Daily Horoscope" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "glass-nav border-b border-white/[0.04]" : ""
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size={40} />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight">
              Grah<span className="gold-text">AI</span>
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-gold/45 font-medium leading-none">
              Vedic Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] uppercase text-text-dim/50 hover:text-text/80 transition-colors">
              Products
              <ChevronDown className={`h-3 w-3 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
            </button>
            {productsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl border border-white/[0.06] bg-bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 py-2 z-50"
              >
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2.5 text-[11px] font-medium tracking-wide transition-colors ${
                      isActive(link.href)
                        ? "text-gold/80 bg-gold/[0.05]"
                        : "text-text-dim/60 hover:text-text/80 hover:bg-white/[0.03]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>

          {/* Daily Horoscope Direct Link */}
          <Link
            href="/horoscope"
            className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors ${
              isActive("/horoscope")
                ? "text-gold/70"
                : "text-text-dim/50 hover:text-text/80"
            }`}
          >
            Daily Horoscope
          </Link>

          {/* Pricing */}
          <Link
            href="/pricing"
            className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors ${
              isActive("/pricing")
                ? "text-gold/70"
                : "text-text-dim/50 hover:text-text/80"
            }`}
          >
            Pricing
          </Link>

          {/* About */}
          <Link
            href="/about"
            className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors ${
              isActive("/about")
                ? "text-gold/70"
                : "text-text-dim/50 hover:text-text/80"
            }`}
          >
            About
          </Link>

          {/* CTA Section with Badge */}
          <div className="flex items-center gap-3 pl-2 border-l border-white/[0.06]">
            {/* Free Forever Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/[0.05] border border-gold/[0.15]">
              <Sparkles className="h-3 w-3 text-gold/60" />
              <span className="text-[9px] font-semibold tracking-[0.1em] uppercase text-gold/60">
                Free Forever
              </span>
            </div>

            {/* Start Free CTA */}
            <Link
              href="/auth/login"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-gold/80 to-gold/60 px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-bg transition-all hover:shadow-lg hover:shadow-gold/30"
            >
              Start Free
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10"
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`h-0.5 bg-text-dim/50 transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`h-0.5 bg-text-dim/50 transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 bg-text-dim/50 transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          height: mobileMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden md:hidden border-t border-white/[0.04]"
      >
        <div className="flex flex-col gap-4 px-6 py-6 bg-bg/50 backdrop-blur-sm">
          {/* Product links in mobile */}
          <p className="text-[9px] tracking-[0.2em] uppercase text-gold/40 font-semibold">Products</p>
          {productLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold tracking-[0.1em] transition-colors pl-2 ${
                isActive(link.href)
                  ? "text-gold/70"
                  : "text-text-dim/50 hover:text-text/80"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-white/[0.04]" />

          {/* Navigation Links */}
          <p className="text-[9px] tracking-[0.2em] uppercase text-gold/40 font-semibold">Navigation</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold tracking-[0.1em] transition-colors pl-2 ${
                isActive(link.href)
                  ? "text-gold/70"
                  : "text-text-dim/50 hover:text-text/80"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-white/[0.04]" />

          {/* Mobile Free Badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gold/[0.05] border border-gold/[0.15] justify-center">
            <Sparkles className="h-3 w-3 text-gold/60" />
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gold/60">
              Free Forever - No Credit Card
            </span>
          </div>

          {/* Mobile CTA - Prominent Gold Button */}
          <Link
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold/80 to-gold/60 px-6 py-3 text-sm font-semibold tracking-[0.12em] uppercase text-bg transition-all hover:shadow-lg hover:shadow-gold/30 w-full"
          >
            Start Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  )
}
