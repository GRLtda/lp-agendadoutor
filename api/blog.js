import { readFile } from "node:fs/promises";
import {
  renderBlog,
  defaultBlogApiOrigin,
} from "../dist/server/entry-server.js";

let manifest;
export default async function handler(req, res) {
  if (!["GET", "HEAD"].includes(req.method)) return res.status(405).end();
  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";
  if (
    !/^(?:[a-z0-9-]+|media\/[a-f0-9]{24}|sitemap\.xml|feed\.xml)?$/.test(path)
  )
    return res.status(404).end();
  res.setHeader("Cache-Control", "no-store");
  try {
    const origin =
      process.env.BLOG_API_ORIGIN ||
      process.env.VITE_API_URL ||
      process.env.VITE_API_BASE_URL ||
      defaultBlogApiOrigin;
    if (!origin) throw new Error("Configure the LP API origin");
    const upstreamOrigin = new URL(origin);
    if (
      !["https:", "http:"].includes(upstreamOrigin.protocol) ||
      upstreamOrigin.username ||
      upstreamOrigin.password
    )
      throw new Error("Invalid API origin");
    const params = new URLSearchParams();
    for (const key of ["q", "category", "tag", "sort", "page"])
      if (typeof req.query[key] === "string") params.set(key, req.query[key]);
    const asset = path.startsWith("media/") || path.endsWith(".xml");
    const url = new URL(
      asset
        ? `/blog/${path}`
        : path
          ? `/v1/blog/posts/${path}`
          : "/v1/blog/posts",
      upstreamOrigin,
    );
    if (!asset) url.search = params.toString();
    else if (path === "sitemap.xml" && req.query.page)
      url.searchParams.set("page", req.query.page);
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      redirect: "manual",
      headers:
        asset && req.headers["if-none-match"]
          ? { "If-None-Match": req.headers["if-none-match"] }
          : {},
    });
    if (asset) {
      for (const key of [
        "content-type",
        "cache-control",
        "etag",
        "x-content-type-options",
      ])
        if (response.headers.has(key))
          res.setHeader(key, response.headers.get(key));
      res.status(response.status);
      return req.method === "HEAD" || response.status === 304
        ? res.end()
        : res.send(Buffer.from(await response.arrayBuffer()));
    }
    let page;
    if (!response.ok)
      page = { kind: "error", status: response.status === 404 ? 404 : 503 };
    else {
      const data = await response.json();
      page = path
        ? { kind: "article", post: data.data }
        : data.page > data.pages
          ? { kind: "error", status: 404 }
          : { kind: "index", result: data };
    }
    manifest ||= JSON.parse(
      await readFile(
        new URL("../dist/.vite/manifest.json", import.meta.url),
        "utf8",
      ),
    );
    const html = await renderBlog(
      `/blog${path ? `/${path}` : ""}${params.size ? `?${params}` : ""}`,
      page,
      manifest,
    );
    res.status(page.status || 200);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    if (page.kind === "error") res.setHeader("X-Robots-Tag", "noindex");
    return req.method === "HEAD" ? res.end() : res.send(html);
  } catch (error) {
    console.error("[blog] Failed to render public page:", error.message);
    res.setHeader("X-Robots-Tag", "noindex");
    return res
      .status(503)
      .send(
        "O blog está temporariamente indisponível. Tente novamente em instantes.",
      );
  }
}
