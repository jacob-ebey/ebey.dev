import { html } from "enhanceable";
import * as Effect from "mini-effect";

import { Document } from "../components/document.ts";
import { getBlogPosts } from "../lib/atproto.ts";
import { htmlResponse } from "../lib/response.ts";

export const Blog = () =>
  Effect.gen(function* () {
    const blogPosts = yield* getBlogPosts;

    return yield* htmlResponse(html`
        <${Document} ${{ title: "Blog" }}>
            <main>
                <h1>Blog</h1>
                ${blogPosts.map(
                  (post) => html`
                    <article
                      class="post"
                      ${{
                        "aria-labelledby": `title-project--${post.path.slice(1)}`,
                      }}
                    >
                      <header
                        ${{
                          style: `view-transition-name: post-header-${post.path.slice(1)}`,
                        }}
                      >
                        <h3
                          ${{
                            id: `title-project--${post.path.slice(1)}`,
                            style: `view-transition-name: post-header-title-${post.path.slice(1)}`,
                          }}
                        >
                          <a ${{ href: `/blog${post.path}` }}>
                            ${post.title}
                          </a>
                        </h3>
                        <time
                          ${{
                            datetime: post.publishedAt,
                            style: `view-transition-name: post-header-time-${post.path.slice(1)}`,
                          }}
                        >
                          ${Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(post.publishedAt))}
                        </time>
                      </header>
                      <p>${post.description}</p>
                    </article>
                  `,
                )}
            </main>
        </${Document}>
    `);
  });
