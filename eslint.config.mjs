import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";


export default defineConfig([
  { files: ["**/*.{js,cjs,mjs}"] },
  { files: ["**/*.{js,cjs,mjs}"], languageOptions: { sourceType: "module" } },
  { files: ["**/*.{js,cjs,mjs}"], languageOptions: { globals: globals.node } },
  { files: ["**/*.{js,cjs,mjs}"], plugins: { js }, extends: ["js/recommended"] },
  {
    files: ["**/*.{js,cjs,mjs}"],
    rules: {
      indent: ["error", 2], "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"]
    }
  },
  {
    ignores: [
      "node_modules/", // Ignorar la carpeta node_modules
      "dist/",         // Ignorar la carpeta dist
      "*.rest",        // Ignorar archivos .rest
    ]
  }
]);