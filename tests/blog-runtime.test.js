import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/blog.js";
import { readFileSync } from "node:fs";
import { defaultBlogApiOrigin, renderBlog } from "../dist/server/entry-server.js";

test("blog SSR uses the existing LP API configuration without an extra environment variable", async () => {
  const originalFetch = globalThis.fetch;
  const keys = ["BLOG_API_ORIGIN", "VITE_API_URL", "VITE_API_BASE_URL"];
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  for (const key of keys) delete process.env[key];
  let upstream;
  globalThis.fetch = async (url) => {
    upstream = new URL(url);
    return Response.json({
      data: [],
      page: 1,
      pages: 1,
      total: 0,
      categories: [],
    });
  };
  const response = () => ({
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
  });
  try {
    const res = response();
    await handler({ method: "GET", query: {}, headers: {} }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(upstream.origin, new URL(defaultBlogApiOrigin).origin);
    assert.equal(upstream.pathname, "/v1/blog/posts");
    assert.match(res.body, /landing-header/);
    assert.match(res.body, /landing-footer/);
    process.env.BLOG_API_ORIGIN = "https://override.example.test";
    process.env.VITE_API_URL = "https://existing.example.test";
    await handler({ method: "GET", query: {}, headers: {} }, response());
    assert.equal(upstream.origin, "https://override.example.test");
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test("artigo expõe SEO/GEO completo e links rastreáveis no HTML inicial", async () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../dist/.vite/manifest.json", import.meta.url), "utf8"),
  );
  const post = {
    _id: "1",
    slug: "teste",
    title: "Como reduzir faltas",
    excerpt: "Resumo",
    category: "Gestão",
    tags: ["agenda"],
    readingMinutes: 4,
    publishedAt: "2026-11-01T10:00:00Z",
    updatedAt: "2026-11-10T10:00:00Z",
    author: { name: "Dra. Ana" },
    contentHtml: "<p>um dois três</p>",
    sources: [{ title: "OMS", url: "https://who.int" }],
    related: [],
  };
  const html = await renderBlog("/blog/teste", { kind: "article", post }, manifest);
  assert.match(html, /"@type":"BlogPosting"/);
  assert.match(html, /"wordCount":3/);
  assert.match(html, /"citation"/);
  assert.match(html, /property="og:locale" content="pt_BR"/);
  assert.match(html, /property="article:section" content="Gestão"/);
  assert.match(html, /max-snippet:-1/);
  assert.match(html, /hreflang="x-default"/);
  assert.match(html, /data-blog-event="source_click"/);
  assert.match(html, /data-blog-event="cta_click"/);
});
