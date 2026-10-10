"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main-content" className="state-page" role="alert">
      <p className="eyebrow">Something went wrong</p>
      <h1>This page hit a problem.</h1>
      <p className="hero-text">Your data is safe. Try again, or head back to a stable page.{error.digest ? ` Reference: ${error.digest}` : ""}</p>
      <div className="cta-row"><button className="primary-button" onClick={reset}>Try again</button><Link className="secondary-button" href="/">Go home</Link></div>
    </main>
  );
}
