import { renderWith } from "remix/middleware/render";
import { createHtmlResponse } from "remix/response/html";
import { renderToReadableStream, type JSXChild } from "srv-jsx";

export function render() {
  return renderWith(
    ({ request }) =>
      async (root: JSXChild, init?: ResponseInit) => {
        const body = await renderToReadableStream(root, {
          prerender: true,
          signal: request.signal,
        });
        const headers = new Headers(init?.headers);

        return createHtmlResponse(body, {
          ...init,
          headers,
        });
      },
  );
}
