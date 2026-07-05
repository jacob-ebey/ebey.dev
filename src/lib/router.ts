import { env, waitUntil } from "cloudflare:workers";

import * as Effect from "mini-effect";

const FailedToRouteRequest = Effect.failure("FailedToRouteRequest");

export const router =
  <C, D>(
    routes: [
      URLPattern,
      (
        request: Request,
        match: URLPatternResult,
      ) => Effect.Effect<Response, C, D, never>,
    ][],
  ) =>
  (
    request: Request,
  ): Effect.Effect<
    Response,
    Effect.Failure<"FailedToRouteRequest"> | C,
    D,
    never
  > =>
    Effect.gen(function* () {
      const url = new URL(request.url);
      const isGetRequest = request.method === "GET";

      const cache = yield* Effect.fn(() =>
        caches.open("router-" + env.CF_VERSION_METADATA.timestamp),
      );
      const cacheKey = new URL(url);
      cacheKey.search = "";
      cacheKey.hash = "";

      if (import.meta.env.PROD && isGetRequest) {
        const cached = yield* Effect.fn(() => cache.match(cacheKey));
        console.log("CACHED", cacheKey.href, !!cached);
        if (cached) return cached;
      }

      let response: Response | undefined;
      for (const route of routes) {
        const match = route[0].exec(url);
        if (match !== null) {
          response = yield* route[1](request, match);
          break;
        }
      }

      if (!response) throw new FailedToRouteRequest();

      if (import.meta.env.PROD && isGetRequest && response.body) {
        const toCache = new Response(response.clone().body, {
          headers: {
            "Content-Type": response.headers.get("Content-Type") || "",
            "Cache-Control": "s-maxage=300",
          },
        });
        waitUntil(cache.put(cacheKey, toCache));
      }

      return response;
    });
