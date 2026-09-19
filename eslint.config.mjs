import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals, ...nextTypescript,
  { files: ["src/content/pages/**/*.tsx", "src/content/chrome/**/*.tsx"], rules: {
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
  } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".playwright-mcp/**", ".firecrawl/**"]),
]);
