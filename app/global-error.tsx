"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "10vh 24px", textAlign: "center" }}>
        <h1>ZeroFee is temporarily unavailable</h1>
        <p>Please try again in a moment.</p>
        <button onClick={reset} style={{ padding: "10px 16px", fontSize: 16 }}>Try again</button>
      </body>
    </html>
  );
}
