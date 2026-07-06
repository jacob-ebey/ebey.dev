import { env, waitUntil } from "cloudflare:workers";
import type { Middleware } from "remix/fetch-router";

export function cache(): Middleware {
  return async ({ request, url }, next) => {
    if (import.meta.env.DEV || request.method !== "GET") {
      return next();
    }

    const store = await caches.open(
      "router-" + env.CF_VERSION_METADATA.timestamp,
    );
    const cacheKey = new URL(url);
    cacheKey.search = "";
    cacheKey.hash = "";

    const cached = await store.match(cacheKey);
    console.log("CACHED", cacheKey.href, !!cached);
    if (cached) return cached;

    const response = await next();
    if (response.ok && response.body) {
      const toCache = new Response(response.clone().body, {
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "",
          "Cache-Control": "s-maxage=300",
        },
      });
      waitUntil(store.put(cacheKey, toCache));
    }

    return response;
  };
}
