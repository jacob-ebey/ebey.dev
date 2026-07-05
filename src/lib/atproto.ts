import { Client, simpleFetchHandler } from "@atcute/client";
import type {} from "@atcute/atproto";
import type {} from "@atcute/bluesky";
import type { PubLeafletContent } from "@atcute/leaflet";
import type {} from "@atcute/standard-site";
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
  return res.data.value;
})
  .pipe(Schema.validate(ProjectsSchema))
  .pipe(
    Effect.catchSome((cause) =>
      Effect.fail(new FailedToGetProjects({ cause })),
    ),
  );

const BlogPostSchema = Schema.object({
  site: Schema.string(),
  path: Schema.string(),
  title: Schema.string(),
  description: Schema.string(),
  publishedAt: Schema.string(),
});

const BlogPostsSchema = Schema.array(BlogPostSchema);

export type BlogPost = Schema.InferOutput<typeof BlogPostSchema>;

const FailedToGetBlogPosts = Effect.failure("FailedToGetBlogPosts");

export const getBlogPosts = Effect.fn(async (signal) => {
  const res = await pds.get("com.atproto.repo.listRecords", {
    params: {
      collection: "site.standard.document",
      repo: "ebey.dev",
    },
    signal,
  });
  if (!res.ok) throw new Error("response not ok");
  return res.data.records.map((record) => record.value);
})
  .pipe(Schema.validate(BlogPostsSchema))
  .pipe(
    Effect.catchSome((cause) =>
      Effect.fail(new FailedToGetBlogPosts({ cause })),
    ),
  );

const FailedToGetBlogPost = Effect.failure("FailedToGetBlogPost");

export const getBlogPost = (rkey: string) =>
  Effect.fn(async (signal) => {
    const res = await pds.get("com.atproto.repo.getRecord", {
      params: {
        collection: "site.standard.document",
        repo: "ebey.dev",
        rkey,
      },
      signal,
    });
    if (!res.ok) throw new Error("response not ok");
    return res.data.value;
  })
    .pipe((post) =>
      Effect.gen(function* () {
        yield* Schema.validate(BlogPostSchema)(post);
        return post as BlogPost & { content: PubLeafletContent.Main };
      }),
    )
    .pipe(
      Effect.catchSome((cause) =>
        Effect.fail(new FailedToGetBlogPost({ cause })),
      ),
    );
