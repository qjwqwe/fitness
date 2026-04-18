import astro from "eslint-plugin-astro";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/", "node_modules/"],
  },
  ...astro.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "astro/no-conflict-attrs": "error",
      "astro/no-set-html-directive": "off",
    },
  },
];
