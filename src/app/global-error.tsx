"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0A0E1A", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          color: "#F1F0F5",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(212,160,84,0.1)",
            border: "1px solid rgba(212,160,84,0.2)",
            marginBottom: 24, fontSize: 30,
          }}>
            🪐
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Cosmic Disturbance
          </h1>
          <p style={{ color: "#ACB8C4", maxWidth: 400, marginBottom: 32 }}>
            Something unexpected happened. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #D4A054, #B8863C)",
              color: "#0A0E1A",
              border: "none",
              padding: "12px 32px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  )
}
