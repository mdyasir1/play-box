import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    files: [
      "src/lib/use-progress.ts",
      "src/components/zip-game.tsx",
      "src/components/maze-paint-game.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
