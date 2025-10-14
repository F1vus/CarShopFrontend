import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import __dirname from "path";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "app": path.resolve(__dirname, "src/app"),
      "styles": path.resolve(__dirname, "src/app/assets/styles"),
      "api": path.resolve(__dirname, "src/app/api"),
    },
  },
});
