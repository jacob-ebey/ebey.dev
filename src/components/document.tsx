import { ErrorBoundary, type JSXChild, type JSXProps } from "srv-jsx";

import { Header } from "./header.tsx";

import "../global.css";

import documentAssets from "./document.tsx?assets=ssr";
import browserAssets from "@/browser.ts?assets=client";

const assets = documentAssets.merge(browserAssets);

export function Document({
  children,
  description,
  mainLink,
  menuOpen,
  standardDocument,
  standardPublication,
  title,
}: {
  children?: JSXChild;
  description?: string;
  mainLink?: string;
  menuOpen?: boolean;
  standardDocument?: string;
  standardPublication?: string;
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
        {standardPublication ? (
          <link rel="site.standard.publication" href={standardPublication} />
        ) : null}
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
          <link nonce rel="stylesheet" href={asset.href} />
        ))}
        {assets.entry ? (
          <script nonce async type="module" src={assets.entry}></script>
        ) : null}
        {assets.js.map((asset: { href: string }) => (
          <link nonce rel="modulepreload" href={asset.href} />
        ))}

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
        <script
          innerHTML={`(()=>{let theme=localStorage.getItem("theme");(typeof theme==="string"?document.documentElement.setAttribute("data-theme", theme):document.documentElement.removeAttribute("data-theme"));})()`}
        />
      </head>
      <body>
        <Header mainLink={mainLink} open={menuOpen} />
        <ErrorBoundary
          fallback={
            <main>
              <h1>Oops, something went wrong.</h1>
            </main>
          }
        >
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
