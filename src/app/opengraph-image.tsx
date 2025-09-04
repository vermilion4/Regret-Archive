import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Regret Archive - Share Your Regrets Anonymously";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              marginBottom: "20px",
              background: "linear-gradient(45deg, #ffffff, #e0e0e0)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Regret Archive
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#a0a0a0",
              marginBottom: "40px",
              maxWidth: "800px",
              lineHeight: "1.4",
            }}
          >
            Share Your Regrets Anonymously
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#888888",
              maxWidth: "600px",
              lineHeight: "1.3",
            }}
          >
            A safe space for sharing regrets and life lessons. Connect with
            others who understand your experiences.
          </div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
          }}
        >
          💭
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
          }}
        >
          🤗
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
