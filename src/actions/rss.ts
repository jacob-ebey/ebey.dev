import { createAction } from "remix/fetch-router";

import { getProjects, type Project } from "../lib/atproto.ts";
import * as npmx from "../lib/npmx.ts";
import { routes } from "../routes.ts";

export default createAction(routes.rss, async ({ request }) => {
  const [projects, leafletRss] = await Promise.all([
    getProjects(request.signal),
    getRssFeed(request.signal),
  ]);

  const renderedProjects = await Promise.all(
    [...projects.maintaining, ...projects.projects]
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .map((project) => loadAndRender(project, request)),
  );

  return new Response(
    leafletRss
      .replace("</channel>", renderedProjects.join("\n") + "\n</channel>")
      .replace(
        'atom:link href="https://ebey.leaflet.pub/rss"',
        `atom:link href="${new URL("/feed.xml", request.url).href}"`,
      ),
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    },
  );
});

async function getRssFeed(signal: AbortSignal) {
  const response = await fetch("https://ebey.leaflet.pub/rss", { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status}`);
  }
  return response.text();
}

async function loadAndRender(project: Project, request: Request) {
  const meta =
    project.type === "pkg"
      ? await npmx
          .packageMeta(project.name, request.signal)
          .catch(() => null)
      : null;

  return `
      <item>
        <title>${project.name}</title>
        <link>${project.link}</link>
        <guid isPermaLink="false">${project.link}</guid>
        <pubDate>${new Date(project.created).toUTCString()}</pubDate>
        <description>${meta?.description || project.description}</description>
        <content:encoded><![CDATA[<p>${meta?.description || project.description}</p><p>Link: <a href="${project.link}">${project.link}</a></p>]]></content:encoded>
      </item>
    `;
}
