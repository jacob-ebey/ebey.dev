import { html, type Child } from "enhanceable";
import { Header } from "./header.ts";

import assets from "./document.ts?assets=ssr";
import "../global.css";

export function Document({
  children,
  mainLink,
  menuOpen,
}: {
  children?: Child;
  mainLink?: string;
  menuOpen?: boolean;
}) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          as="font"
          type="font/woff2"
          crossorigin
          href="https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbV2o-flEEny0FZhsfKu5WU4xD7OwGtT0rU.woff2"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
        />
        ${assets.css.map(
          (asset: { href: string }) => html`<link rel="stylesheet" ${asset} />`,
        )}
        ${assets.js.map(
          (asset: { href: string }) =>
            html`<link rel="modulepreload" ${asset} />`,
        )}
        ${assets.entry
          ? html`<script type="module" ${{ src: assets.entry }}}></script>`
          : null}

        <link rel="prefetch" href="/menu" />
        <link rel="prefetch" href="/subscribe" />

        <link rel="favicon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/feed.xml"
          title="RSS Feed"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href="/feed.json"
          title="RSS Feed"
        />

        <title>ebey.dev</title>
        <meta name="description" content="Welcome to ebey.dev" />

        <script>
          (() => {
            const theme = localStorage.getItem("theme");
            if (theme) {
              document.documentElement.setAttribute("data-theme", theme);
            }
            window.addEventListener("pageshow", () => {
              const theme = localStorage.getItem("theme");
              if (theme) {
                document.documentElement.setAttribute("data-theme", theme);
              } else {
                document.documentElement.removeAttribute("data-theme");
              }
            });
          })();
        </script>
      </head>
      <body>
        <${Header} ${{ mainLink, open: menuOpen }} />
        ${children}
      </body>
    </html>
  `;
}
