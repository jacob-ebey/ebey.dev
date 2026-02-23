import { cloudflare } from "@cloudflare/vite-plugin";
import fullstack from "@hiogawa/vite-plugin-fullstack";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    fullstack({
      serverHandler: false,
      serverEnvironments: ["ssr"],
    }),
    cloudflare({
      persistState: true,
      viteEnvironment: { name: "ssr" },
    }),
  ],
});
