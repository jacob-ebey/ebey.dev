import * as Effect from "mini-effect";
import * as Concurrency from "mini-effect/concurrency";
import * as Fetch from "mini-effect/fetch";

import { getProjects, type Project } from "../lib/atproto.ts";
import * as npmx from "../lib/npmx.ts";

export const Rss = (request: Request) =>
  Effect.gen(function* () {
    const [projects, leafletRss] = yield* Concurrency.all([
      getProjects,
      Fetch.request("https://ebey.leaflet.pub/rss").pipe(Fetch.text),
    ]);

    const renderedProjects = yield* Concurrency.all(
      [...projects.maintaining, ...projects.projects]
        .sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        )
        .map(loadAndRender),
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

const loadAndRender = (project: Project) =>
  Effect.gen(function* () {
    const meta =
      project.type === "pkg"
        ? yield* npmx.packageMeta(project.name).pipe(
            Effect.catchTags({
              PackageMetaUnavailable: () => Effect.succeed(null),
            }),
          )
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
  });
