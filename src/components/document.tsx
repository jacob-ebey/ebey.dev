import type { JSXChild, JSXProps } from "srv-jsx";

import { Header } from "./header.tsx";

import "../global.css";

import documentAssets from "./document.tsx?assets=ssr";
import browserAssets from "../browser.ts?assets=client";

const assets = documentAssets.merge(browserAssets);

export function Document({
  children,
  description,
  mainLink,
  menuOpen,
  standardDocument,
  title,
}: {
  children?: JSXChild;
  description?: string;
  mainLink?: string;
  menuOpen?: boolean;
  standardDocument?: string;
  title?: string;
} & JSXProps) {
  const pageTitle = title ? `${title} | ebey.dev` : "ebey.dev";
  const pageDescription = description || "Welcome to ebey.dev";

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {standardDocument ? (
          <>
            <link rel="alternate" href={standardDocument} />
            <link rel="site.standard.document" href={standardDocument} />
          </>
        ) : null}
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
        {assets.css.map((asset: { href: string }) => (
          <link rel="stylesheet" href={asset.href} />
        ))}
        {assets.entry ? (
          <script type="module" src={assets.entry}></script>
        ) : null}
        {assets.js.map((asset: { href: string }) => (
          <link rel="modulepreload" href={asset.href} />
        ))}

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
      </head>
      <body>
        <Header mainLink={mainLink} open={menuOpen} />
        {children}
      </body>
    </html>
  );
}
