import type { PubLeafletContent } from "@atcute/leaflet";
import htmlLang from "@shikijs/langs/html";
import shellLang from "@shikijs/langs/shell";
import tsxLang from "@shikijs/langs/tsx";
import baseTheme from "@shikijs/themes/one-dark-pro";
import { createAction } from "remix/fetch-router";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import type { JSXChild } from "srv-jsx";

import { Document } from "../components/document.tsx";
import { getBlogPost } from "../lib/atproto.ts";
import { routes } from "../routes.ts";

const theme = {
  ...baseTheme,
  bg: "var(--test)",
};

const highlighter = await createHighlighterCore({
  // @ts-expect-error - no types
  engine: createOnigurumaEngine(import("shiki/onig.wasm")),
  themes: [theme],
  langs: [htmlLang, shellLang, tsxLang],
});

const supportedLangs = new Set(["html", "shell", "tsx"]);

export default createAction(
  routes["blog-post"],
  async ({ params, render, request }) => {
    const post = await getBlogPost(params.rkey, request.signal);
    const slug = post.path.slice(1);

    return render(
      <Document
        description={post.description}
        mainLink="/blog"
        standardDocument={post.uri}
        title={post.title}
      >
        <main>
          <header style={`view-transition-name: post-header-${slug}`}>
            <h1 style={`view-transition-name: post-header-title-${slug}`}>
              {post.title}
            </h1>
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
          <article class="blog-post">
            {renderBlocks(post.content.pages[0].blocks)}
          </article>
        </main>
      </Document>,
    );
  },
);

function renderBlocks(
  blocks: PubLeafletContent.Main["pages"][number]["blocks"],
) {
  const rendered: JSXChild[] = [];

  for (const block of blocks) {
    switch (block.block.$type) {
      case "pub.leaflet.blocks.header": {
        const Heading = headingTag(block.block.level);
        rendered.push(<Heading>{block.block.plaintext}</Heading>);
        break;
      }
      case "pub.leaflet.blocks.text":
        if (block.block.facets?.length) {
          const chunks: JSXChild[] = [];
          let lastEnd = 0;
          for (const facet of block.block.facets) {
            chunks.push(
              block.block.plaintext.slice(lastEnd, facet.index.byteStart),
            );
            for (const feature of facet.features) {
              switch (feature.$type) {
                case "pub.leaflet.richtext.facet#link": {
                  const text = block.block.plaintext.slice(
                    facet.index.byteStart,
                    facet.index.byteEnd,
                  );
                  chunks.push(<a href={feature.uri}>{text}</a>);
                  lastEnd = facet.index.byteEnd;
                  break;
                }
                case "pub.leaflet.richtext.facet#code": {
                  const text = block.block.plaintext.slice(
                    facet.index.byteStart,
                    facet.index.byteEnd,
                  );
                  chunks.push(<code>{text}</code>);
                  lastEnd = facet.index.byteEnd;
                  break;
                }
                default: {
                  const text = block.block.plaintext.slice(
                    facet.index.byteStart,
                    facet.index.byteEnd,
                  );
                  chunks.push(text);
                  lastEnd = facet.index.byteEnd;
                  break;
                }
              }
            }
          }
          if (lastEnd < block.block.plaintext.length) {
            chunks.push(block.block.plaintext.slice(lastEnd));
          }
          rendered.push(<p>{chunks}</p>);
        } else {
          rendered.push(<p>{block.block.plaintext}</p>);
        }
        break;
      case "pub.leaflet.blocks.image": {
        const link = (block.block.image as { ref?: { $link?: string } })?.ref
          ?.$link;
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
          const code = highlighter.codeToHtml(block.block.plaintext, {
            lang: block.block.language as any,
            theme,
          });
          rendered.push(<div innerHTML={code} />);
        } else {
          rendered.push(
            <pre>
              <code>{text}</code>
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
