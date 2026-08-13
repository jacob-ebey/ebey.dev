import type { PubLeafletContent, PubLeafletRichtextFacet } from "@atcute/leaflet";
import htmlLang from "@shikijs/langs/html";
import shellLang from "@shikijs/langs/shell";
import yamlLang from "@shikijs/langs/yaml";
import tsxLang from "@shikijs/langs/tsx";
import baseTheme from "@shikijs/themes/one-dark-pro";
import { createAction } from "remix/fetch-router";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import type { JSXChild } from "srv-jsx";

import { Document } from "@/components/document.tsx";
import { getBlogPost } from "@/lib/atproto.ts";
import { routes } from "@/routes.ts";

const theme = {
  ...baseTheme,
  bg: "var(--test)",
};

const highlighter = await createHighlighterCore({
  // @ts-expect-error - no types
  engine: createOnigurumaEngine(import("shiki/onig.wasm")),
  themes: [theme],
  langs: [htmlLang, shellLang, tsxLang, yamlLang],
});

const supportedLangs = new Set(["html", "shell", "shellscript", "tsx", "yaml"]);

export default createAction(routes["blog-post"], async ({ params, render, request }) => {
  const post = await getBlogPost(params.rkey, request.signal);
  const slug = post.path.slice(1);

  return render(
    <Document
      description={post.description}
      mainLink="/blog"
      standardDocument={post.uri}
      standardPublication={post.site}
      title={post.title}
    >
      <main>
        <header style={`view-transition-name: post-header-${slug}`}>
          <h1 style={`view-transition-name: post-header-title-${slug}`}>{post.title}</h1>
          <time
            datetime={post.publishedAt}
            style={`view-transition-name: post-header-time-${slug}`}
          >
            {Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(post.publishedAt))}
          </time>
        </header>
        <article class="blog-post">{renderBlocks(post.content.pages[0].blocks)}</article>
      </main>
    </Document>,
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=240",
      },
    },
  );
});

function renderBlocks(blocks: PubLeafletContent.Main["pages"][number]["blocks"]) {
  const rendered: JSXChild[] = [];

  for (const block of blocks) {
    switch (block.block.$type) {
      case "pub.leaflet.blocks.header": {
        const Heading = headingTag(block.block.level);
        rendered.push(
          <Heading>{renderRichText(block.block.plaintext, block.block.facets)}</Heading>,
        );
        break;
      }
      case "pub.leaflet.blocks.text":
        rendered.push(<p>{renderRichText(block.block.plaintext, block.block.facets)}</p>);
        break;
      case "pub.leaflet.blocks.image": {
        const link = (block.block.image as { ref?: { $link?: string } })?.ref?.$link;
        if (link) {
          rendered.push(
            <img
              src={`https://shiitake.us-east.host.bsky.network/xrpc/com.atproto.sync.getBlob?did=did:plc:twegdcgytckr5cxm57gyruxa&cid=${link}`}
            />,
          );
        }
        break;
      }
      case "pub.leaflet.blocks.code": {
        const text = block.block.plaintext;
        if (block.block.language && supportedLangs.has(block.block.language)) {
          const code = highlighter
            .codeToHtml(block.block.plaintext, {
              lang: (block.block.language === "shellscript"
                ? "shell"
                : block.block.language) as any,
              theme,
            })
            .trim();
          rendered.push(<div innerHTML={code} />);
        } else {
          rendered.push(
            <pre>
              <code>{text.trim()}</code>
            </pre>,
          );
        }
        break;
      }
      case "pub.leaflet.blocks.horizontalRule":
        rendered.push(<hr />);
        break;
      case "pub.leaflet.blocks.unorderedList":
        rendered.push(
          <ul>
            {block.block.children.map((child) => (
              <li>
                {renderBlocks([
                  {
                    $type: "pub.leaflet.pages.linearDocument#block",
                    block: child.content,
                  },
                ])}
              </li>
            ))}
          </ul>,
        );
        break;
      case "pub.leaflet.blocks.orderedList":
        rendered.push(
          <ol>
            {block.block.children.map((child) => (
              <li>
                {renderBlocks([
                  {
                    $type: "pub.leaflet.pages.linearDocument#block",
                    block: child.content,
                  },
                ])}
              </li>
            ))}
          </ol>,
        );
        break;
      default:
        console.error(`Unsupported block type ${block.block.$type}`);
        break;
    }
  }

  return rendered;
}

function renderRichText(
  plaintext: string,
  facets: PubLeafletRichtextFacet.Main[] | undefined,
): JSXChild[] {
  if (!facets?.length) {
    return [plaintext];
  }

  const spans = facets.map((facet) => ({
    start: codeUnitIndexAtByte(plaintext, facet.index.byteStart),
    end: codeUnitIndexAtByte(plaintext, facet.index.byteEnd),
    features: facet.features,
  }));

  const points = new Set<number>([0, plaintext.length]);
  for (const span of spans) {
    points.add(span.start);
    points.add(span.end);
  }
  const stops = [...points].sort((a, b) => a - b);

  const chunks: JSXChild[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const start = stops[i];
    const end = stops[i + 1];
    if (end <= start) continue;
    const features = spans
      .filter((span) => span.start <= start && span.end >= end)
      .flatMap((span) => span.features);
    chunks.push(applyFeatures(plaintext.slice(start, end), features));
  }
  return chunks;
}

function applyFeatures(
  text: string,
  features: PubLeafletRichtextFacet.Main["features"][number][],
): JSXChild {
  const feature =
    features.find((f) => f.$type === "pub.leaflet.richtext.facet#link") ??
    features.find((f) => f.$type === "pub.leaflet.richtext.facet#code");
  switch (feature?.$type) {
    case "pub.leaflet.richtext.facet#link":
      return <a href={feature.uri}>{text}</a>;
    case "pub.leaflet.richtext.facet#code":
      return <code>{text}</code>;
    default:
      return text;
  }
}

function codeUnitIndexAtByte(text: string, byteIndex: number): number {
  let bytePos = 0;
  let codePos = 0;
  for (const char of text) {
    if (bytePos === byteIndex) {
      return codePos;
    }
    const codePoint = char.codePointAt(0)!;
    bytePos += codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : codePoint < 0x10000 ? 3 : 4;
    if (bytePos > byteIndex) {
      return codePos;
    }
    codePos += char.length;
  }
  return text.length;
}

function headingTag(level: number | undefined) {
  switch (level) {
    case 1:
      return "h1";
    case 3:
      return "h3";
    case 4:
      return "h4";
    case 5:
      return "h5";
    case 6:
      return "h6";
    default:
      return "h2";
  }
}
