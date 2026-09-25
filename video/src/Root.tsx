import React from "react";
import { Composition, Folder } from "remotion";
import { BrandCheck } from "./BrandCheck";
import { POSTER_LEAD } from "./kit";
import { LaunchDemo, launchDemoFrames } from "../campaigns/launch-demo/LaunchDemo";
// campaign-imports (scripts/new-campaign.mjs inserts above this line)

// Every campaign registers here. Formats:
//   App Store preview (iPhone 6.9"): 886×1920 · Reels/TikTok/Shorts: 1080×1920.
// Typed variants add a 2-frame poster lead, so they run POSTER_LEAD frames longer.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="BrandCheck" component={BrandCheck} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Folder name="launch-demo">
      <Composition id="LaunchDemoAppStore" component={LaunchDemo} durationInFrames={launchDemoFrames + POSTER_LEAD} fps={30} width={886} height={1920} defaultProps={{ typed: true }} />
      <Composition id="LaunchDemoVertical" component={LaunchDemo} durationInFrames={launchDemoFrames + POSTER_LEAD} fps={30} width={1080} height={1920} defaultProps={{ typed: true }} />
      <Composition id="LaunchDemoMasked" component={LaunchDemo} durationInFrames={launchDemoFrames} fps={30} width={1080} height={1920} defaultProps={{ typed: false }} />
    </Folder>
    {/* campaign-compositions (scripts/new-campaign.mjs inserts above this line) */}
  </>
);
