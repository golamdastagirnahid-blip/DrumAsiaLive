/**
 * Global not-found — used only when a URL doesn't match the middleware matcher
 * and therefore has no locale (per next-intl's recommended structure).
 * Self-contained <html>/<body> because it renders outside [locale]/layout.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0b0c0e",
          color: "#f2f1ec",
          fontFamily: "monospace",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ letterSpacing: "0.3em", fontSize: 12, opacity: 0.6 }}>
            404 — DRUMASIA
          </p>
          <h1 style={{ margin: "0.5rem 0" }}>This track isn&apos;t on the setlist.</h1>
          <p>
            <a href="/en" style={{ color: "#ffa31a" }}>
              Back to the session →
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
