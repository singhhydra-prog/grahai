export default function AppLoading() {
  return (
    <div className="min-h-screen bg-[#060A14] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <div
            className="absolute inset-0 rounded-full border-2 border-amber-500/20"
            style={{ animation: "spin 3s linear infinite" }}
          />
          <div
            className="absolute inset-2 rounded-full border border-amber-500/10"
            style={{ animation: "spin 2s linear infinite reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">✦</span>
          </div>
        </div>
        <p className="text-sm text-amber-400/40 tracking-widest uppercase">
          Aligning planets…
        </p>
      </div>
    </div>
  )
}
