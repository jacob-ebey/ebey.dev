import * as Effect from "mini-effect";
import { renderToReadableStream, type JSXChild } from "srv-jsx";

export const htmlResponse = (
  html: JSXChild,
  init?: ResponseInit,
) =>
  Effect.fn(async () => {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "text/html; charset=utf-8");

    return new Response(await renderToReadableStream(html), {
      ...init,
      headers,
    });
  });
