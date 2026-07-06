import { createAction } from "remix/fetch-router";
import * as s from "remix/data-schema";

import { getProjects, type Project } from "@/lib/atproto.ts";
import * as npmx from "@/lib/npmx.ts";
import { routes } from "@/routes.ts";

const JsonFeedSchema = s.object(
  {
    items: s.array(s.any()),
  },
  { unknownKeys: "passthrough" },
);

export default createAction(routes.json, async ({ request }) => {
  const [projects, leafletFeed] = await Promise.all([
    getProjects(request.signal),
    getJsonFeed(request.signal),
  ]);

  const renderedProjects = await Promise.all(
    [...projects.maintaining, ...projects.projects]
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
      )
      .map((project) => loadAndRender(project, request)),
  );

  return new Response(
    JSON.stringify({
      ...leafletFeed,
      home_page_url: new URL("/", request.url).href,
      feed_url: new URL("/feed.json", request.url).href,
      items: [...leafletFeed.items, ...renderedProjects],
    }),
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=240",
        "Content-Type": "application/feed+json; charset=utf-8",
      },
    },
  );
});

async function getJsonFeed(signal: AbortSignal) {
  const response = await fetch("https://ebey.leaflet.pub/json", { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch JSON feed: ${response.status}`);
  }

  return s.parse(JsonFeedSchema, await response.json());
}

async function loadAndRender(project: Project, request: Request) {
  const meta =
    project.type === "pkg"
      ? await npmx.packageMeta(project.name, request.signal).catch(() => null)
      : null;

  return {
    id: project.link,
    url: project.link,
    title: project.name,
    summary: meta?.description || project.description,
    date_modified: project.created,
    content_html: `<p>${meta?.description || project.description}</p><p>Link: <a href="${project.link}">${project.link}</a></p>`,
  };
}
