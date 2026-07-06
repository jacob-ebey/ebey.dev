import type { Middleware } from "remix/fetch-router";
import { Renderer } from "remix/middleware/render";
import type { JSXChild } from "srv-jsx";

import { Document } from "@/components/document.tsx";

type Render = (
  root: JSXChild,
  init?: ResponseInit,
) => Response | Promise<Response>;

export function errors(): Middleware {
  return async (context, next) => {
    try {
      return await next();
    } catch (cause) {
      console.error(cause);

      const render = context.get(Renderer) as Render | undefined;
      if (!render) {
        return new Response("Internal Server Error", { status: 500 });
      }

      return render(
        <Document>
          <main>
            <h1>500 Internal Server Error</h1>
            <p>
              Something went wrong while processing your request. Please try
              again later.
            </p>
          </main>
        </Document>,
        { status: 500 },
      );
    }
  };
}
