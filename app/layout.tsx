import type { Metadata, Viewport } from "next";
import "./styles.css";

const appUrl = process.env.APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: { default: "ZeroFee", template: "%s · ZeroFee" },
  description: "Choose what you earn. ZeroFee takes 0% of membership revenue.",
  applicationName: "ZeroFee",
  openGraph: { siteName: "ZeroFee", type: "website", locale: "en" },
  twitter: { card: "summary_large_image" }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1e63ff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
