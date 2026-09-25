import { defineBrand } from "./schema";

// The brand this repo makes content for. Ships as a fictional placeholder ("Acme Planner");
// the onboard-video-brand skill replaces it with your product's real colors, fonts, logo
// and claims. Keep this file pure data: it is read by the video studio and by agents.
export const brand = defineBrand({
  name: "Acme Planner",
  descriptor: "Your week, handled.",
  source: "fictional example",
  colors: {
    background: "#f8f6f1",
    surface: "#ffffff",
    foreground: "#191713",
    muted: "#6e6a62",
    accent: "#2f5bd3",
    accentSoft: "#e3eafb",
    border: "#e9e5dd",
    palette: [
      { soft: "#e3eafb", strong: "#2f5bd3" },
      { soft: "#efe6fa", strong: "#7a4bc2" },
      { soft: "#fdebdc", strong: "#c0601f" },
      { soft: "#e2f3e8", strong: "#2c7a4b" },
    ],
  },
  typography: {
    display: "Fraunces",
    body: "Inter",
    displayWeight: 500,
    italicEmphasis: true,
    fonts: [
      { family: "Fraunces", source: "google", weights: [500, 600], italic: true },
      { family: "Inter", source: "google", weights: [400, 500, 600, 700] },
    ],
  },
  assets: {
    icon: "brand/icon.svg",
  },
  motion: {
    pace: "steady",
    radius: 22,
  },
  voice: {
    tone: ["clear", "warm", "confident"],
    avoid: ["hype", "fake urgency", "jargon"],
  },
  messaging: {
    positioning: "A planner that turns a messy week into a handled one.",
    audience: "Busy team leads juggling meetings, deadlines and handoffs",
    proofPoints: [
      "Meetings scheduled without the back-and-forth",
      "Deadlines caught before they slip",
      "Handoffs sent to the right person",
    ],
    defaultCta: "Get your week back.",
  },
});
