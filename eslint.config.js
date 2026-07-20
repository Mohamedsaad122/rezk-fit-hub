import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react": react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off", // disable Fast Refresh warning for boilerplate structure compatibility
      "no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": ["error", { "ignore": ["cmdk-input-wrapper"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["vite.config.js", "tailwind.config.js", "postcss.config.js", "eslint.config.js", "vitest.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
];
