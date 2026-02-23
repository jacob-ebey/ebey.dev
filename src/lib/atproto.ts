import { Client, simpleFetchHandler } from "@atcute/client";
import type {} from "@atcute/atproto";
import type {} from "@atcute/bluesky";
import type {} from "@atcute/leaflet";
import type {} from "@atcute/standard-site";
import * as Effect from "mini-effect";
import * as Schema from "mini-effect/schema";

export const pds = new Client({
  handler: simpleFetchHandler({
    service: "https://shiitake.us-east.host.bsky.network/",
  }),
});

const ProjectSchema = Schema.object({
  type: Schema.union([Schema.literal("pkg"), Schema.literal("site")]),
  name: Schema.string(),
  link: Schema.string(),
  created: Schema.string(),
  description: Schema.optional(Schema.string()),
});

const ProjectsSchema = Schema.object({
  maintaining: Schema.array(ProjectSchema),
  projects: Schema.array(ProjectSchema),
});

export type Project = Schema.InferOutput<typeof ProjectSchema>;

export type Projects = Schema.InferOutput<typeof ProjectsSchema>;

const FailedToGetProjects = Effect.failure("FailedToGetProjects");

export const getProjects = Effect.fn(async (signal) => {
  const res = await pds.get("com.atproto.repo.getRecord", {
    params: {
      collection: "dev.ebey.random",
      repo: "ebey.dev",
      rkey: "projects",
    },
    signal,
  });
  if (!res.ok) throw new Error("response not ok");
  return res.data.value as Projects;
}).pipe(
  Effect.catchSome((cause) => Effect.fail(new FailedToGetProjects({ cause }))),
);
