import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MedReviewContainer } from "./MedReviewContainer";
import { medreviewTheme as t } from "./theme";

/**
 * Slide 14 — Get Involved. Closing invitation with a strong tagline and
 * Frank's sticker as the hero element (his email + LinkedIn live on the
 * sticker itself, so no separate contact callout is needed).
 */
export const MedReviewClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h2P = spring({ frame, fps, config: { damping: 180 } });
  const taglineP = spring({ frame: frame - 10, fps, config: { damping: 180 } });
  const stickerP = spring({ frame: frame - 22, fps, config: { damping: 16 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  return (
    <MedReviewContainer background="swoosh-corner" padding={0}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 180px",
        }}
      >
        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 104,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            lineHeight: 1.05,
            ...lineIn(h2P),
          }}
        >
          Get Involved
        </div>

        <div
          style={{
            fontFamily: t.font.family,
            fontSize: 34,
            color: t.colors.text,
            marginTop: 22,
            maxWidth: "26em",
            lineHeight: 1.35,
            ...lineIn(taglineP, 16),
          }}
        >
          <span style={{ color: t.colors.navy, fontWeight: t.font.weight.bold }}>Your expertise</span>{" "}
          shapes how this technology develops.
        </div>

        <Img
          src={staticFile("chiles-bg/frank-sticker.png")}
          style={{
            height: 620,
            width: "auto",
            marginTop: 40,
            opacity: interpolate(stickerP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(stickerP, [0, 1], [24, 0])}px) scale(${interpolate(stickerP, [0, 1], [0.92, 1])})`,
            filter: "drop-shadow(0 18px 40px rgba(14, 40, 65, 0.22))",
          }}
        />
      </div>
    </MedReviewContainer>
  );
};
