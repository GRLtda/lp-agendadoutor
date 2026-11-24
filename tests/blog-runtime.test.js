import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/blog.js";
import { defaultBlogApiOrigin } from "../dist/server/entry-server.js";

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
