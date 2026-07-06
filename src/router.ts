import type { Route } from "remix/fetch-router/routes";
import { createRouter, type Action, type Router } from "remix/fetch-router";

import { cache } from "./middleware/cache.ts";
import { errors } from "./middleware/errors.tsx";
import { render } from "./middleware/render.tsx";
import { routes } from "./routes.ts";

const router = createRouter({
  middleware: [errors(), render(), cache()],
});

declare module "remix/fetch-router" {
  interface RouterTypes {
    context: typeof router extends Router<infer C> ? C : never;
  }
}

const actionModules = Object.assign(
  {},
  import.meta.glob<true, string, () => Promise<{ default: Action<any> }>>(
    "./actions/**/*.ts",
  ),
  import.meta.glob<true, string, () => Promise<{ default: Action<any> }>>(
    "./actions/**/*.tsx",
  ),
);

for (const [filepath, loadMod] of Object.entries(actionModules)) {
  const parts = filepath
    .replace(/^\.\/actions\//, "")
    .replace(/\.tsx?$/, "")
    .split("/");
  const name = parts.pop();
  if (!name) throw new Error(`Invalid action path: ${filepath}`);

  let routesToRead: unknown = routes;
  for (const part of parts) {
    routesToRead = (routesToRead as Record<string, unknown>)?.[part];
  }

  const route = (routesToRead as Record<string, Route> | undefined)?.[name];
  if (!route) {
    throw new Error(`Route not found: ${[...parts, name].join(".")}`);
  }

  router.route(route.method, route.pattern, async (ctx) => {
    const mod = await loadMod();
    if (typeof mod.default === "function") {
      return mod.default(ctx);
    }
    return mod.default.handler(ctx);
  });
}

export { router };

export default {
  fetch(request) {
    return router.fetch(request);
  },
} satisfies ExportedHandler;
