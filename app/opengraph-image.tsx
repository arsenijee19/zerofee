import { ImageResponse } from "next/og";

export const alt = "ZeroFee: creators choose what they earn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#07111f,#123981 65%,#1e63ff)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 800 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#1e63ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>Z</div>
          ZeroFee
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02 }}>You choose what you earn.</div>
          <div style={{ fontSize: 36, color: "#c9d8f5" }}>0% platform fee on creator membership revenue.</div>
        </div>
      </div>
    ),
    size
  );
}
