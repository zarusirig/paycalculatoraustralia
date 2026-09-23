import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Build output and the Firebase deploy cache are generated, not source.
  { ignores: [".firebase/**", "out/**", ".next/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
