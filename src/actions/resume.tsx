import { createAction } from "remix/fetch-router";

import { Document } from "@/components/document.tsx";
import { routes } from "@/routes.ts";

export default createAction(routes.resume, async ({ render }) => {
  const year = new Date().getFullYear();
  const yearsOfExperience = year - 2013;
  return render(
    <Document title="Resume">
      <main class="resume">
        <div>
          <h1>Jacob Ebey</h1>
          <p>
            Sr. Software Engineer with over {yearsOfExperience} years of
            experience and a focus on the underlying tech that backs the modern
            web stack.
          </p>
          <section>
            <header>
              <h2>Remix / Shopify</h2>
              <p>2021 - 2026</p>
            </header>
            <ul>
              <li>Prepared Remix v1 for initial open-source release.</li>
              <li>
                Developed the{" "}
                <a href="https://npmx.dev/package/turbo-stream">turbo-stream</a>{" "}
                wire format enabling seamless deferred data streaming,
                significantly improving perceived page-load performance for
                millions of production deployments.
              </li>
              <li>
                Accelerated Shopify product roadmaps by leading large-scale
                migrations to React Router and overhauling @shopify/hydrogen
                architecture, eliminating major technical debt.
              </li>
              <li>
                Co-orchestrated backporting Remix v1 capabilities to React
                Router v6, delivering a migration path that minimized breaking
                changes and preserved enterprise investments.
              </li>
              <li>
                Pioneered the initial React Server Components runtime for Vite,
                laying the foundation for{" "}
                <a href="https://npmx.dev/package/@vitejs/plugin-rsc">
                  @vitejs/plugin-rsc
                </a>
                .
              </li>
              <li>
                Future-proofed React Router by integrating React Server
                Components, delivering a low-friction upgrade path aligning
                enterprise users with React's long-term vision.
              </li>
              <li>
                Bolstered security by proactively triaging CVEs and delivering
                rapid vulnerability patches, ensuring zero critical downtime or
                breaches for production applications.
              </li>
              <li>
                Drove strategic alignment and influenced the product roadmap as
                a React Router Steering Committee member, prioritizing community
                pain points alongside core objectives.
              </li>
            </ul>
          </section>
          <section>
            <header>
              <h2>Lululemon (contract)</h2>
              <p>2019 - 2021</p>
            </header>
            <ul>
              <li>
                Drove revenue uplift by architecting high-fidelity product
                preview overlays that minimized purchase friction and boosted
                add-to-cart rates.
              </li>
              <li>
                Improved experimentation by building an internal A/B testing
                platform that empowered product managers to independently launch
                and monitor data-driven tests.
              </li>
              <li>
                Accelerated experiment velocity with a lightweight Node.js
                runtime serving Webpack Module Federation builds, enabling
                real-time frontend variant testing without rebuilding
                applications.
              </li>
            </ul>
          </section>
          <section>
            <header>
              <h2>Microsoft (contracts)</h2>
              <p>2016 - 2019</p>
            </header>
            <ul>
              <li>
                AI &amp; Knowledge - Accelerated data-scientist productivity
                with a unified discovery platform cutting data location and
                preparation time.
              </li>
              <li>
                AI &amp; Knowledge - Delivered a holistic visualization of
                Microsoft's master customer data, replacing manual gathering
                with on-demand exploration.
              </li>
              <li>
                Rewards - Democratized marketing operations by empowering
                non-technical teams to independently deploy dynamic campaigns
                without engineering bottlenecks.
              </li>
              <li>
                Sales - Boosted sales effectiveness with a pre-call preparation
                tool consolidating cross-organizational data and predictive
                intelligence.
              </li>
            </ul>
          </section>
          <section>
            <header>
              <h2>OMAX Corporation</h2>
              <p>2013 - 2016</p>
            </header>
            <ul>
              <li>
                Developed advanced chamfer and spiral lead toolpath features
                reducing manual programming time and improving cutting
                precision.
              </li>
              <li>
                Played an integral role in maturing an internal scripting engine
                into a public SDK, opening up a third-party developer ecosystem.
              </li>
              <li>
                Developed OMAX Intelli-CAM, the industry's first 3D CAM
                application for waterjets, capturing an untapped market and
                reinforcing the company's innovative status.
              </li>
              <li>
                Developed a lightweight, cross-platform OpenGL renderer enabling
                real-time 3D visualization on Linux and mobile, eliminating
                legacy Windows dependency and reducing hardware costs.
              </li>
              <li>
                Fast-tracked a monitoring application POC to test market
                assumptions and feasibility, providing critical data that
                prevented a costly full-scale misstep.
              </li>
              <li>
                Conducted foundational R&amp;D on EtherCAT industrial protocols,
                delivering a technical blueprint that de-risked and accelerated
                the development of next-generation ultra-low-latency machine
                control.
              </li>
            </ul>
          </section>
        </div>
        <aside>
          <h2>Portfolio</h2>
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M20 8h-2a2 2 0 0 0 -2 2a2 2 0 1 1 -4 0v-1a2 2 0 0 0 -2 -2h-1a2 2 0 0 1 -2 -2v-.5" />
              <path d="M3 12h3a2 2 0 0 1 2 2v.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 1 1.5 1.5v3.25" />
              <path d="M15 20.5v-3.5a2 2 0 0 1 2 -2h3.5" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            </svg>
            <a href="https://ebey.dev">ebey.dev</a>
          </div>
          <div>
            <svg width="98" height="96" viewBox="0 0 98 96" fill="none">
              <g clip-path="url(#clip0_730_27136)">
                <path
                  d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_730_27136">
                  <rect width="98" height="96" fill="currentColor" />
                </clipPath>
              </defs>
            </svg>
            <a href="https://github.com/jacob-ebey">jacob-ebey</a>
          </div>

          <h2>Contact</h2>
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-mail"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
              <path d="M3 7l9 6l9 -6" />
            </svg>
            <a href="mailto:jobs@ebey.dev">jobs@ebey.dev</a>
          </div>

          <h2>Skills</h2>
          <div>HTML/CSS</div>
          <div>JavaScript</div>
          <div>TypeScript</div>
          <div>React/Preact</div>
          <div>React Router</div>
          <div>Vite</div>
          <div>Webpack</div>
          <div>SQLite/ORMs</div>
          <div>Git</div>
          <div>Golang</div>
          <div>Serverless</div>
          <div>Docker</div>
          <div>C#</div>
          <div>Research</div>
          <div>...</div>

          <h2>Projects</h2>
          <div>
            <a href="https://atpm.dev">atpm.dev</a>
          </div>
          <div>
            <a href="https://github-md.com">github-md.com</a>
          </div>
          <div>
            <a href="https://npmx.dev/package/turbo-stream">turbo-stream</a>
          </div>
          <div>
            <a href="https://npmx.dev/package/srv-jsx">srv-jsx</a>
          </div>
        </aside>
      </main>
    </Document>,
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=240",
      },
    },
  );
});
