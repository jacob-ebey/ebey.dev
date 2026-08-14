import { get, route } from "remix/fetch-router/routes";

export const routes = route({
  home: get("/"),
  blog: get("/blog"),
  "blog-post": get("/blog/:rkey"),
  resume: get("/resume"),
  menu: get("/menu"),
  subscribe: get("/subscribe"),
  rss: get("/feed.xml"),
  json: get("/feed.json"),
  "404": "*",
});
