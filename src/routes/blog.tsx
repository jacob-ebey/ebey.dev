import * as Effect from "mini-effect";

import { Document } from "../components/document.tsx";
import { getBlogPosts } from "../lib/atproto.ts";
import { htmlResponse } from "../lib/response.ts";

export const Blog = () =>
  Effect.gen(function* () {
    const blogPosts = yield* getBlogPosts;

    return yield* htmlResponse(
      <Document title="Blog">
        <main>
          <h1>Blog</h1>
          {blogPosts.map((post) => {
            const slug = post.path.slice(1);

            return (
              <article
                class="post"
                aria-labelledby={`title-project--${slug}`}
              >
                <header style={`view-transition-name: post-header-${slug}`}>
                  <h3
                    id={`title-project--${slug}`}
                    style={`view-transition-name: post-header-title-${slug}`}
                  >
                    <a href={`/blog${post.path}`}>{post.title}</a>
                  </h3>
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
                <p>{post.description}</p>
              </article>
            );
          })}
        </main>
      </Document>,
    );
  });
