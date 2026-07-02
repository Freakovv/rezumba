import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050508",
          color: "#f4f4f5",
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: "0.08em",
        }}
      >
        MS
      </div>
    ),
    { ...size },
  );
}
