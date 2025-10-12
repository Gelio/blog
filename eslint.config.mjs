import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  {
    ignores: [".next", "next-env.d.ts"],
  },
  ...compat.config({
    extends: ["next/typescript", "next/core-web-vitals"],
  }),
]);
