import { render, type UnsafeHTML } from "enhanceable";
import * as Effect from "mini-effect";

export const htmlResponse = (
  html: UnsafeHTML | Promise<UnsafeHTML>,
  init?: ResponseInit,
) =>
  Effect.fn(async () => {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "text/html; charset=utf-8");

    return new Response(await render(() => Promise.resolve(html)), {
      ...init,
      headers,
    });
  });
