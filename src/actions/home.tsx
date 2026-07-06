import { createAction } from "remix/fetch-router";

import { Document } from "@/components/document.tsx";
import { getProjects, type Project } from "@/lib/atproto.ts";
import * as npmx from "@/lib/npmx.ts";
import { routes } from "@/routes.ts";

export default createAction(routes.home, async ({ render, request }) => {
  const { maintaining, projects } = await getProjects(request.signal);

  const [renderedMaintaining, renderedProjects] = await Promise.all([
    Promise.all(maintaining.map((project) => loadAndRender(project, request))),
    Promise.all(projects.map((project) => loadAndRender(project, request))),
  ]);

  return render(
    <Document>
      <main>
        <h1>Projects</h1>
        <h2>Maintaining</h2>
        {renderedMaintaining}
        <hr />
        <h2>Explorations</h2>
        {renderedProjects}
      </main>
    </Document>,
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=240",
      },
    },
  );
});

async function loadAndRender(project: Project, request: Request) {
  const meta =
    project.type === "pkg"
      ? await npmx.packageMeta(project.name, request.signal).catch(() => null)
      : null;

  return (
    <article class="project" aria-labelledby={`title-project--${project.name}`}>
      <header>
        <h3 id={`title-project--${project.name}`}>
          <a target="_blank" rel="noopener noreferrer" href={project.link}>
            {project.name}
          </a>
        </h3>
        <time datetime={project.created}>
          {Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(project.created))}
        </time>
        {meta?.weeklyDownloads ? (
          <data value={meta.weeklyDownloads}>
            {Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
            }).format(meta.weeklyDownloads)}{" "}
            downloads/week
          </data>
        ) : null}
      </header>
      <p>{meta?.description || project.description}</p>
    </article>
  );
}
