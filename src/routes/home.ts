import { html } from "enhanceable";
import * as Effect from "mini-effect";
import * as Concurrency from "mini-effect/concurrency";

import { Document } from "../components/document.ts";
import { getProjects, type Project } from "../lib/atproto.ts";
import * as npmx from "../lib/npmx.ts";
import { htmlResponse } from "../lib/response.ts";

export const Home = () =>
  Effect.gen(function* () {
    const { maintaining, projects } = yield* getProjects;

    const [renderedMaintaining, renderedProjects] = yield* Concurrency.all([
      Concurrency.all(maintaining.map(loadAndRender)),
      Concurrency.all(projects.map(loadAndRender)),
    ]);

    return yield* htmlResponse(html`
        <${Document}>
            <main>
                <h1>Projects</h1>
                <h2>Maintaining</h2>
                ${renderedMaintaining}
                <hr />
                <h2>Explorations</h2>
                ${renderedProjects}
            </main>
        </${Document}>
    `);
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

    return html`
      <article
        class="project"
        ${{ "aria-labelledby": `title-project--${project.name}` }}
      >
        <header>
          <h3 ${{ id: `title-project--${project.name}` }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              ${{ href: project.link }}
            >
              ${project.name}
            </a>
          </h3>
          <time ${{ datetime: project.created }}>
            ${Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(project.created))}</time
          >${meta?.weeklyDownloads
            ? html`<data ${{ value: meta.weeklyDownloads }}
                >${Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(meta.weeklyDownloads)}
                downloads/week</data
              >`
            : null}
        </header>
        <p>${meta?.description || project.description}</p>
      </article>
    `;
  });
