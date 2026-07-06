import { cloudflare } from "@cloudflare/vite-plugin";
import fullstack from "@hiogawa/vite-plugin-fullstack";
import srvJsx from "srv-jsx/vite";
import { defineConfig, type PluginOption } from "vite";

export default defineConfig({
  plugins: [
    fullstack({
      serverHandler: false,
      serverEnvironments: ["ssr"],
    }),
    srvJsx() as unknown as PluginOption,
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
    ssr: {
      build: {
        emitAssets: true,
        outDir: "dist/ssr",
        rollupOptions: {
          input: { index: "./src/router.ts" },
        },
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
