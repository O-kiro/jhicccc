import { ImageResponse } from "next/og";

// Branded share card — palette mirrors the homepage hero (PRD §7.2).
export const alt = "MAN Kota Batu — Berilmu. Berakhlak. Berprestasi.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f1e9",
          padding: "68px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", width: 46, height: 46 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "4px solid #0f6e56",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "4px solid #ba7517",
                transform: "rotate(45deg)",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 22 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#201f1d" }}>MAN Kota Batu</div>
            <div style={{ fontSize: 20, color: "#6c6a61" }}>Madrasah Aliyah Negeri · MAKOBA</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, color: "#1f5faf" }}>
            Berilmu.
          </div>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, color: "#0f6e56" }}>
            Berakhl
          </div>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, color: "#ba7517" }}>
            Berprestasi.
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 26, color: "#201f1d" }}>Maju, Bermutu, dan Mendunia</div>
          <div style={{ display: "flex", fontSize: 22, color: "#6c6a61" }}>mankotabatu.sch.id</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
