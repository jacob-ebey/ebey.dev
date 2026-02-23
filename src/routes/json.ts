import * as Effect from "mini-effect";
import * as Concurrency from "mini-effect/concurrency";
import * as Fetch from "mini-effect/fetch";
import * as Schema from "mini-effect/schema";

import { getProjects, type Project } from "../lib/atproto.ts";
import * as npmx from "../lib/npmx.ts";

const JsonFeedSchema = Schema.object({
  items: Schema.array(Schema.any()),
});

export const Json = (request: Request) =>
  Effect.gen(function* () {
    const [projects, leafletFeed] = yield* Concurrency.all([
      getProjects,
      Fetch.request("https://ebey.leaflet.pub/json").pipe(
        Fetch.json,
        Schema.validate(JsonFeedSchema),
      ),
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
      JSON.stringify({
        ...leafletFeed,
        home_page_url: new URL("/", request.url).href,
        feed_url: new URL("/feed.json", request.url).href,
        items: [...leafletFeed.items, ...renderedProjects],
      }),
      {
        headers: {
          "Content-Type": "application/feed+json; charset=utf-8",
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

    return {
      id: project.link,
      url: project.link,
      title: project.name,
      summary: meta?.description || project.description,
      date_modified: project.created,
      content_html: `<p>${meta?.description || project.description}</p><p>Link: <a href="${project.link}">${project.link}</a></p>`,
    };
  });
