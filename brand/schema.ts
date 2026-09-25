// The brand pack: the single source of truth for the brand's look, voice and claims,
// shared by the social pipeline and the video studio. It lives in brand/ at the repo root:
// brand.ts (typed tokens, pure data, no imports beyond this file), voice.md, product.md,
// visual-language.md and assets/. The onboard-video-brand skill writes it from your product.

export type BrandFont = {
  family: string;
  /** "google": loaded from Google Fonts at render time. "local": files in brand/assets/. */
  source: "google" | "local";
  weights: number[];
  italic?: boolean;
  /** For local fonts: files relative to brand/assets/, one per weight/style. */
  files?: { src: string; weight: number; style?: "normal" | "italic" }[];
};

export type BrandPack = {
  name: string;
  /** One line the brand would actually say about itself. */
  descriptor: string;
  /** Where the pack was extracted from (repo path or URL), for re-onboarding. */
  source: string;
  colors: {
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    accent: string;
    accentSoft: string;
    border: string;
    /** Optional extra hues for color-coding features, agents, plans, etc. */
    palette?: { soft: string; strong: string }[];
  };
  typography: {
    /** CSS font-family names; each must appear in `fonts`. */
    display: string;
    body: string;
    displayWeight: number;
    /** Use the display face in italic for emphasis words (needs an italic face loaded). */
    italicEmphasis: boolean;
    fonts: BrandFont[];
  };
  assets: {
    /** Files in brand/assets/, referenced as "brand/<file>" (served to video via public/brand). */
    logo?: string;
    logoOnDark?: string;
    icon?: string;
  };
  motion: {
    /** measured: longer holds, calmer entrances. snappy: tighter holds. */
    pace: "measured" | "steady" | "snappy";
    radius: number;
  };
  voice: {
    tone: string[];
    avoid: string[];
  };
  messaging: {
    positioning: string;
    audience: string;
    /** Benefits the product can honestly claim, each traceable to product.md. */
    proofPoints: string[];
    defaultCta: string;
  };
};

export const defineBrand = (brand: BrandPack): BrandPack => brand;
