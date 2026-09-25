import { config } from "@remotion/eslint-config-flat";

export default [...config, { ignores: ["out/**", "node_modules/**", "scripts/**"] }];
