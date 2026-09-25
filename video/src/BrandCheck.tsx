import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { brand } from "../../brand/brand";
import { ActionCard, Bubble, Emph, EventPill, Field, MaskLine, ResultPill } from "./kit";

// One-frame sanity check for the brand pack: fonts actually loaded (not a fallback),
// colors, logo/icon, and the core surfaces in brand styling. Render it after onboarding:
//   npm run stills -- BrandCheck 0
export const BrandCheck: React.FC = () => {
  const c = brand.colors;
  const swatches = [c.background, c.surface, c.foreground, c.muted, c.accent, c.accentSoft, c.border, ...(c.palette ?? []).flatMap((p) => [p.soft, p.strong])];
  return (
    <AbsoluteFill>
      <Field />
      <div style={{ position: "absolute", left: 80, right: 80, top: 110, display: "flex", flexDirection: "column", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {brand.assets.icon ? <Img src={staticFile(brand.assets.icon)} style={{ width: 120, height: 120, borderRadius: 27 }} /> : null}
          {brand.assets.logo ? <Img src={staticFile(brand.assets.logo)} style={{ height: 80 }} /> : null}
          <div style={{ font: `600 40px ${brand.typography.body}`, color: c.foreground }}>{brand.name}</div>
        </div>
        <div>
          <MaskLine delay={-30} size={150}>
            {brand.descriptor.split(" ").slice(0, -1).join(" ")} <Emph>{brand.descriptor.split(" ").slice(-1)}</Emph>
          </MaskLine>
        </div>
        <div style={{ font: `400 38px/1.4 ${brand.typography.body}`, color: c.muted }}>
          {brand.typography.display} / {brand.typography.body} · {brand.messaging.positioning}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {swatches.map((s, i) => (
            <div key={i} style={{ width: 90, height: 90, borderRadius: 20, background: s, border: `2px solid ${c.border}` }} />
          ))}
        </div>
        <div style={{ transform: "scale(2)", transformOrigin: "top left", display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <ActionCard actor="Helper" badge="He" title="Sample action" rows={[["Status", "Finished"]]} />
          <EventPill badge="Tm" i={1} text="Teammate joined — sample status" />
          <ResultPill badges={["A", "B"]} text="Sample result pill" />
          <Bubble text="A sample chat bubble in the body face." />
        </div>
      </div>
    </AbsoluteFill>
  );
};
