import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Pay Calculator Australia — Free Australian Pay Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#38bdf8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Pay Calculator Australia
          </div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            Free Australian Pay Calculator
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            Income Tax, Super, Medicare Levy & HECS — Official ATO Rates
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {["Official ATO Rates", "Free Forever", "No Signup"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "9999px",
                    padding: "8px 20px",
                    fontSize: "16px",
                    color: "#e2e8f0",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
