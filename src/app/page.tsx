export default function RootPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="refresh" content="0;url=/en/" />
        <title>DrumAsia Live</title>
        <script
          dangerouslySetInnerHTML={{
            __html: "window.location.replace('/en/');",
          }}
        />
      </head>
      <body
        style={{
          background: "#0b0c0e",
          color: "#f2f1ec",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ letterSpacing: "0.2em", fontSize: "1.5rem" }}>DRUMASIA LIVE</h1>
          <p style={{ opacity: 0.7 }}>Loading session...</p>
          <noscript>
            <a href="/en/" style={{ color: "#ffa31a" }}>
              Click here to enter DrumAsia Live →
            </a>
          </noscript>
        </div>
      </body>
    </html>
  );
}
