import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "ZeroFee Prototype",
  description: "Choose what you earn. ZeroFee takes 0% of membership revenue."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
