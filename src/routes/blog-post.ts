import type { PubLeafletContent } from "@atcute/leaflet";
import { html, unsafe, UnsafeHTML } from "enhanceable";
import hljs from "highlight.js";
import * as Effect from "mini-effect";

import { Document } from "../components/document.ts";
import { getBlogPost } from "../lib/atproto.ts";
import { htmlResponse } from "../lib/response.ts";

export const BlogPost = (request: Request, match: URLPatternResult) =>
  Effect.gen(function* () {
    const post = yield* getBlogPost(match.pathname.groups.rkey);

    return yield* htmlResponse(html`
        <${Document} ${{ mainLink: "/blog" }}>
            <main>
                <header ${{ style: `view-transition-name: post-header-${post.path.slice(1)}` }}>
                    <h1 ${{ style: `view-transition-name: post-header-title-${post.path.slice(1)}` }}>${post.title}</h1>
                    <time ${{ datetime: post.publishedAt, style: `view-transition-name: post-header-time-${post.path.slice(1)}` }}>
                    ${Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(post.publishedAt))}
                    </time>
                </header>
                <article class="blog-post">
                    ${renderBlocks(post.content.pages[0].blocks)}
                </article>
            </main>
        </${Document}>
    `);
  });

function renderBlocks(
  blocks: PubLeafletContent.Main["pages"][number]["blocks"],
) {
  const rendered: Promise<UnsafeHTML>[] = [];

  for (const block of blocks) {
    switch (block.block.$type) {
      case "pub.leaflet.blocks.header":
        rendered.push(
          html`${unsafe(`<h${block.block.level ?? 2}>`)}${block.block
            .plaintext}${unsafe(`</h${block.block.level ?? 2}>`)}`,
        );
        break;
      case "pub.leaflet.blocks.text":
        rendered.push(html`<p>${block.block.plaintext}</p>`);
        break;
      case "pub.leaflet.blocks.image":
        const link = (block.block.image as { ref?: { $link?: string } })?.ref
          ?.$link;
        if (link) {
          rendered.push(
            html`<img
              ${{
                src: `https://shiitake.us-east.host.bsky.network/xrpc/com.atproto.sync.getBlob?did=did:plc:twegdcgytckr5cxm57gyruxa&cid=${link}`,
              }}
            />`,
          );
        }
        break;
      case "pub.leaflet.blocks.code":
        const code = block.block.language
          ? hljs.highlight(block.block.plaintext, {
              language: block.block.language,
            })
          : hljs.highlightAuto(block.block.plaintext);
        rendered.push(
          html`<pre><code>${code.value
            ? unsafe(code.value)
            : block.block.plaintext}</code></pre>`,
        );
        break;
      case "pub.leaflet.blocks.horizontalRule":
        rendered.push(html`<hr />`);
        break;
      case "pub.leaflet.blocks.unorderedList":
        rendered.push(html`
          <ul>
            ${block.block.children.map(
              (child) =>
                html`<li>
                  ${renderBlocks([
                    {
                      $type: "pub.leaflet.pages.linearDocument#block",
                      block: child.content,
                    },
                  ])}
                </li>`,
            )}
          </ul>
        `);
        break;
      case "pub.leaflet.blocks.orderedList":
        rendered.push(html`
          <ol>
            ${block.block.children.map(
              (child) =>
                html`<li>
                  ${renderBlocks([
                    {
                      $type: "pub.leaflet.pages.linearDocument#block",
                      block: child.content,
                    },
                  ])}
                </li>`,
            )}
          </ol>
        `);
        break;
      default:
        console.error(`Unsupported block type ${block.block.$type}`);
        break;
    }
  }

  return rendered;
}
