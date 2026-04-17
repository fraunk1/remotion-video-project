import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BriefingContainer } from "./BriefingContainer";
import { fsmbTheme, BriefingTheme } from "./themes/fsmb";

/**
 * Generic closing slide: headline + optional pull-quote + Frank's sticker.
 * Per the closing-sticker rule, any deck Frank authors must include his
 * personal sticker — defaulted here, overridable via stickerPath.
 */
export const BriefingClosing: React.FC<{
  headline?: string;
  quote?: string;
  quoteSource?: string;
  stickerPath?: string;
  theme?: BriefingTheme;
}> = ({
  headline = "Discussion",
  quote,
  quoteSource,
  stickerPath = "frank-sticker.png",
  theme = fsmbTheme,
}) => {
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
    <BriefingContainer background="white" padding={0} theme={theme}>
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
            fontFamily: theme.font.family,
            fontSize: 100,
            fontWeight: theme.font.weight.bold,
            color: theme.colors.navy,
            ...lineIn(h2P),
          }}
        >
          {headline}
        </div>

        {quote && (
          <div
            style={{
              marginTop: 40,
              maxWidth: 1200,
              background: "rgba(24, 154, 207, 0.08)",
              borderLeft: `6px solid ${theme.colors.blue}`,
              borderRadius: "0 12px 12px 0",
              padding: "30px 44px",
              fontFamily: theme.font.family,
              fontSize: 26,
              fontStyle: "italic",
              color: theme.colors.textBright,
              lineHeight: 1.55,
              ...lineIn(quoteP, 16),
            }}
          >
            {quote}
            {quoteSource && (
              <div
                style={{
                  fontStyle: "normal",
                  fontSize: 20,
                  color: theme.colors.textDim,
                  marginTop: 12,
                }}
              >
                — {quoteSource}
              </div>
            )}
          </div>
        )}

        <Img
          src={staticFile(stickerPath)}
          style={{
            height: 440,
            width: "auto",
            marginTop: 54,
            opacity: interpolate(stickerP, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(stickerP, [0, 1], [20, 0])}px) scale(${interpolate(stickerP, [0, 1], [0.92, 1])})`,
          }}
        />
      </div>
    </BriefingContainer>
  );
};
