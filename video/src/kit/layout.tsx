import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// Campaigns are authored on one 886×1920 canvas (the iPhone 6.9" App Store preview size).
// <Stage> centers that canvas in any composition: 886×1920 for the App Store, 1080×1920
// for Reels/TikTok/Shorts (the background fills the extra width). Keep key content above
// y≈1620 so social platform UI never covers it.
export const CANVAS = { w: 886, h: 1920 };
export const CX = CANVAS.w / 2;

export function Stage({ background, children }: { background: React.ReactNode; children: React.ReactNode }) {
  const { width, height } = useVideoConfig();
  const scale = height / CANVAS.h;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {background}
      <div
        style={{
          position: "absolute",
          width: CANVAS.w,
          height: CANVAS.h,
          left: (width - CANVAS.w * scale) / 2,
          top: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
