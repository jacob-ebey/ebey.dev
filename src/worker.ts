import * as Effect from "mini-effect";
import { html } from "enhanceable";

import { Document } from "./components/document.ts";
import { htmlResponse } from "./lib/response.ts";
import { router } from "./lib/router.ts";
import { Blog } from "./routes/blog.ts";
import { BlogPost } from "./routes/blog-post.ts";
import { Home } from "./routes/home.ts";
import { Json } from "./routes/json.ts";
import { Menu } from "./routes/menu.ts";
import { Rss } from "./routes/rss.ts";
import { Subscribe } from "./routes/subscribe.ts";

const routeRequest = router([
  [new URLPattern({ pathname: "/" }), Home],
  [new URLPattern({ pathname: "/blog" }), Blog],
  [new URLPattern({ pathname: "/blog/:rkey" }), BlogPost],
  [new URLPattern({ pathname: "/menu" }), Menu],
  [new URLPattern({ pathname: "/subscribe" }), Subscribe],
  [new URLPattern({ pathname: "/feed.xml" }), Rss],
  [new URLPattern({ pathname: "/feed.json" }), Json],
]);

const notFound = () =>
  htmlResponse(html`
    <${Document}>
      <main>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </main>
    </${Document}>
  `);

const internalServerError = (cause: unknown) => {
  console.error(cause);

  return htmlResponse(
    html`
      <${Document}>
        <main>
          <h1>500 Internal Server Error</h1>
          <p>
            Something went wrong while processing your request. Please try again
            later.
          </p>
        </main>
      </${Document}>
    `,
    {
      status: 500,
    },
  );
};

export default {
  async fetch(request, _, ctx) {
    const program = routeRequest(request).pipe(
      Effect.catchTags({
        FailedToRouteRequest: notFound,
      }),
      Effect.catchSome(internalServerError),
    );

    const promise = Effect.run(program, request.signal);
    ctx.waitUntil(promise);
    return promise;
  },
} satisfies ExportedHandler;
