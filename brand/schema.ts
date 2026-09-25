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
    /** Letter spacing for display headlines. Default "-.04em" suits most serifs and
     * geometric sans; heavy or wide faces (e.g. Clash Display) usually want "-.02em" to "-.03em". */
    displayTracking?: string;
    /** Extra word spacing for display headlines, e.g. ".08em" when tight tracking makes
     * words run together. Default "normal". */
    displayWordSpacing?: string;
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
  /** Music identity for generated scores (video/scripts/score.py). Every video from the
   * brand shares the family (tempo range, instrument, drum feel); each campaign varies. */
  sound?: {
    /** warm/bright/driving/calm: a soft bed under the product (≈ -17 LUFS).
     * hype/euphoric: club energy for launch and hype cuts (≈ -13 LUFS). */
    mood: "warm" | "bright" | "driving" | "calm" | "hype" | "euphoric";
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
