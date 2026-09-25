import { registerRoot } from "remotion";
import { loadBrandFonts } from "./kit/fonts";
import { RemotionRoot } from "./Root";

loadBrandFonts();
registerRoot(RemotionRoot);
