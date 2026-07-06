import { Client, simpleFetchHandler } from "@atcute/client";
import type {} from "@atcute/atproto";
import type {} from "@atcute/bluesky";
import type { PubLeafletContent } from "@atcute/leaflet";
import type {} from "@atcute/standard-site";
import * as s from "remix/data-schema";

export const pds = new Client({
  handler: simpleFetchHandler({
    service: "https://shiitake.us-east.host.bsky.network/",
  }),
});

const ProjectSchema = s.object({
  type: s.enum_(["pkg", "site"]),
  name: s.string(),
  link: s.string(),
  created: s.string(),
  description: s.optional(s.string()),
});

const ProjectsSchema = s.object({
  maintaining: s.array(ProjectSchema),
  projects: s.array(ProjectSchema),
});

export type Project = s.InferOutput<typeof ProjectSchema>;

export type Projects = s.InferOutput<typeof ProjectsSchema>;

export async function getProjects(signal?: AbortSignal) {
  const res = await pds.get("com.atproto.repo.getRecord", {
    params: {
      collection: "dev.ebey.random",
      repo: "ebey.dev",
      rkey: "projects",
    },
    signal,
  });
  if (!res.ok) throw new Error("response not ok");
  return s.parse(ProjectsSchema, res.data.value);
}

const BlogPostSchema = s.object({
  uri: s.string(),
  site: s.string(),
  path: s.string(),
  title: s.string(),
  description: s.string(),
  publishedAt: s.string(),
});

const BlogPostWithContentSchema = s.object({
  uri: s.string(),
  site: s.string(),
  path: s.string(),
  title: s.string(),
  description: s.string(),
  publishedAt: s.string(),
  content: s
    .any()
    .refine((value) => value !== undefined, "Expected content")
    .transform((value) => value as PubLeafletContent.Main),
});

export type BlogPost = s.InferOutput<typeof BlogPostSchema>;

export async function getBlogPosts(signal?: AbortSignal) {
  const res = await pds.get("com.atproto.repo.listRecords", {
    params: {
      collection: "site.standard.document",
      repo: "ebey.dev",
    },
    signal,
  });
  if (!res.ok) throw new Error("response not ok");
  return res.data.records.map((record) =>
    s.parse(BlogPostSchema, {
      ...record.value,
      uri: record.uri,
    }),
  );
}

export async function getBlogPost(rkey: string, signal?: AbortSignal) {
  const res = await pds.get("com.atproto.repo.getRecord", {
    params: {
      collection: "site.standard.document",
      repo: "ebey.dev",
      rkey,
    },
    signal,
  });
  if (!res.ok) throw new Error("response not ok");

  return s.parse(BlogPostWithContentSchema, {
    ...res.data.value,
    uri: res.data.uri,
  });
}
