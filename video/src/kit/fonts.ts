import { continueRender, delayRender, staticFile } from "remotion";
import { brand } from "../../../brand/brand";

// Loads every face declared in brand/brand.ts: Google families via the Fonts CSS API,
// local files from brand/assets (served as public/brand). Rendering waits until all
// faces are ready, so frames never fall back to a system font.
let started = false;

export const loadBrandFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender("brand fonts");
  const jobs: Promise<unknown>[] = [];

  const google = brand.typography.fonts.filter((f) => f.source === "google");
  if (google.length) {
    const families = google.map((f) => {
      const w = [...f.weights].sort((a, b) => a - b);
      const axes = f.italic
        ? `ital,wght@${[...w.map((x) => `0,${x}`), ...w.map((x) => `1,${x}`)].join(";")}`
        : `wght@${w.join(";")}`;
      return `family=${encodeURIComponent(f.family).replace(/%20/g, "+")}:${axes}`;
    });
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${families.join("&")}&display=block`;
    jobs.push(
      new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      }).then(() =>
        Promise.all(
          google.flatMap((f) =>
            f.weights.flatMap((w) =>
              [false, ...(f.italic ? [true] : [])].map((it) =>
                document.fonts.load(`${it ? "italic " : ""}${w} 40px "${f.family}"`),
              ),
            ),
          ),
        ),
      ),
    );
    document.head.appendChild(link);
  }

  for (const f of brand.typography.fonts.filter((x) => x.source === "local")) {
    for (const file of f.files ?? []) {
      const face = new FontFace(f.family, `url(${staticFile(`brand/${file.src}`)})`, {
        weight: String(file.weight),
        style: file.style ?? "normal",
      });
      jobs.push(face.load().then((loaded) => document.fonts.add(loaded)));
    }
  }

  Promise.all(jobs)
    .catch((err) => console.error("brand font failed to load", err))
    .finally(() => continueRender(handle));
};
