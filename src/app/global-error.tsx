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
      <body style={{ background: "#050810", color: "#E8E4DB", margin: 0 }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <div style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            background: "rgba(232,84,84,0.1)",
            border: "1px solid rgba(232,84,84,0.2)",
          }}>
            <span style={{ fontSize: "2rem" }}>⚡</span>
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            Something went wrong
          </h1>

          <p style={{
            maxWidth: "24rem",
            marginBottom: "2rem",
            color: "rgba(232,228,219,0.6)",
          }}>
            A critical cosmic disturbance has occurred. Don&apos;t worry — your data is safe.
          </p>

          <button
            onClick={reset}
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: 500,
              fontSize: "0.875rem",
              background: "linear-gradient(135deg, #C9A24D, #A07E30)",
              color: "#0a0a1a",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>

          {error.digest && (
            <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "rgba(232,228,219,0.3)" }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
