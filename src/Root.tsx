import React from "react";
import { Composition } from "remotion";
import { Presentation } from "./compositions/Presentation";
import { SocialClip } from "./compositions/SocialClip";
import { DataDashboard } from "./compositions/DataDashboard";

export const Root: React.FC = () => {
  return (
    <>
      {/* Presentation — 16:9 widescreen slide deck */}
      <Composition
        id="Presentation"
        component={Presentation}
        durationInFrames={810}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Social Clip — 9:16 vertical for Reels / TikTok / Shorts */}
      <Composition
        id="SocialClip"
        component={SocialClip}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Data Dashboard — 16:9 animated metrics dashboard */}
      <Composition
        id="DataDashboard"
        component={DataDashboard}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
