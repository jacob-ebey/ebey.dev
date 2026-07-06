import { cloudflare } from "@cloudflare/vite-plugin";
import fullstack from "@hiogawa/vite-plugin-fullstack";
import srvJsx from "srv-jsx/vite";
import { defineConfig, type PluginOption } from "vite";

export default defineConfig({
  plugins: [
    srvJsx() as unknown as PluginOption,
    fullstack({
      serverHandler: false,
      serverEnvironments: ["ssr"],
    }),
    cloudflare({
      persistState: true,
      viteEnvironment: { name: "ssr" },
    }),
  ],
  environments: {
    client: {
      build: {
        outDir: "dist/client",
        rollupOptions: {
          input: { index: "./src/browser.ts" },
        },
      },
    },
  },
});
