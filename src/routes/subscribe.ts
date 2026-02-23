import { html } from "enhanceable";

import { htmlResponse } from "../lib/response.ts";
import { Document } from "../components/document.ts";

export const Subscribe = () =>
  htmlResponse(html`
    <${Document} ${{ menuOpen: true }}>
      <main class="menu">
        <h1 class="sr-only">Subscribe</h1>
        <nav aria-label="Primary">
          <ul>
            <li>
                <a href="/feed.xml">RSS feed</a>
            </li>
            <li>
              <a href="/feed.json" >JSON feed</a>
            </li>
          </ul>
        </nav>
        <p>
          Or simply copy/paste this page’s URL into your feed reader for
          <a
            href="https://blog.jim-nielsen.com/2021/automatically-discoverable-rss-feeds/"
            target="_blank"
            rel="noopener"
          >automatic feed discovery</a>.
        </p>
      </main>
    </${Document}>
  `);
