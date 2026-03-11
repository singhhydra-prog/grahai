"use client"

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Cosmic mandala offline icon */}
        <div className="relative mx-auto mb-8 h-32 w-32">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-spin-slow" />
          <div className="absolute inset-3 rounded-full border border-gold/10 animate-spin-reverse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">🪐</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-text mb-2">
          ग्रह विश्राम में हैं
        </h1>
        <p className="text-lg text-gold/60 font-medium mb-4">
          Planets are resting
        </p>
        <p className="text-sm text-text-dim/70 leading-relaxed mb-8">
          You're offline right now. Connect to the internet to receive your cosmic readings.
          Your cached horoscopes are still available.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-6 py-3 text-sm font-semibold text-gold hover:bg-gold/15 transition-all active:scale-95"
        >
          <span>↻</span>
          Try Again
        </button>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 15s linear infinite; }
      `}</style>
    </main>
  )
}
