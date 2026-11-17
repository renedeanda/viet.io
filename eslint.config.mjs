import next from "eslint-config-next";

// Flat config (ESLint 9). Next 16 removed `next lint`; run `npm run lint`.
export default [
  ...next,
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    rules: {
      // React Compiler-era hook rules (eslint-plugin-react-hooks 7, via eslint-config-next 16) report existing
      // effect patterns; warnings until those components are refactored on their own.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/globals": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/unsupported-syntax": "warn",
      "react-hooks/component-hook-factories": "warn",
    },
  },
  { ignores: [".next/**", "out/**", "node_modules/**", ".wrangler/**", "next-env.d.ts", "public/**"] },
];
