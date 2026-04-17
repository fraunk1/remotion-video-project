import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChilesContainer } from "./ChilesContainer";
import { chilesTheme as t } from "./theme";

/** Slide 14 — closing with Gorsuch "shield" quote + Frank's personal sticker. */
export const ChilesClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h2P = spring({ frame, fps, config: { damping: 180 } });
  const quoteP = spring({ frame: frame - 10, fps, config: { damping: 180 } });
  const stickerP = spring({ frame: frame - 24, fps, config: { damping: 14 } });

  const lineIn = (p: number, d = 24) => ({
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [d, 0])}px)`,
  });

  return (
    <ChilesContainer background="swoosh-corner" padding={0}>
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
            fontSize: 100,
            fontWeight: t.font.weight.bold,
            color: t.colors.navy,
            ...lineIn(h2P),
          }}
        >
          Discussion
        </div>

        <div
          style={{
            marginTop: 40,
            maxWidth: 1200,
            background: "rgba(24, 154, 207, 0.08)",
            borderLeft: `6px solid ${t.colors.blue}`,
            borderRadius: "0 12px 12px 0",
            padding: "30px 44px",
            fontFamily: t.font.family,
            fontSize: 26,
            fontStyle: "italic",
            color: t.colors.textBright,
            lineHeight: 1.55,
            ...lineIn(quoteP, 16),
          }}
        >
          "The First Amendment stands as a shield against any effort to enforce orthodoxy in thought or
          speech…. However well-intentioned, any law that suppresses speech based on viewpoint
          represents an 'egregious' assault on both of those commitments."
          <div
            style={{
              fontStyle: "normal",
              fontSize: 20,
              color: t.colors.textDim,
              marginTop: 12,
            }}
          >
            — <em>Chiles v. Salazar</em>, Slip op. at 23
          </div>
        </div>

        <Img
          src={staticFile("chiles-bg/frank-sticker.png")}
          style={{
            height: 440,
            width: "auto",
            marginTop: 54,
            opacity: interpolate(stickerP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(stickerP, [0, 1], [20, 0])}px) scale(${interpolate(stickerP, [0, 1], [0.92, 1])})`,
          }}
        />
      </div>
    </ChilesContainer>
  );
};
