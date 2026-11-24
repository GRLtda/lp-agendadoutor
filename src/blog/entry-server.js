import { renderToString } from "vue/server-renderer";
import { renderSSRHead } from "@unhead/vue/server";
import { createApp } from "../main";
export { BLOG_API_ORIGIN as defaultBlogApiOrigin } from "./data";

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
export async function renderBlog(path, page, manifest) {
  // Render the LP app itself, including its existing header, footer, logo and buttons.
  const context = await createApp(path);
  context.initialState.blogPage = page;
  const body = await renderToString(context.app);
  const head = await renderSSRHead(context.head);
  const styles = [
    ...new Set(Object.values(manifest).flatMap((entry) => entry.css || [])),
  ];
  const entry =
    Object.values(manifest).find(
      (item) => item.isEntry && item.src === "index.html",
    ) || Object.values(manifest).find((item) => item.isEntry);
  const state = JSON.stringify(JSON.stringify({ blogPage: page }))
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return `<!doctype html><html ${head.htmlAttrs || 'lang="pt-BR"'}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light"><link rel="icon" href="/favicon-32x32.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&family=DM+Mono:wght@300;400;500&display=swap">${head.headTags}${styles.map((file) => `<link rel="stylesheet" href="/${escape(file)}">`).join("")}</head><body ${head.bodyAttrs}>${head.bodyTagsOpen || ""}<div id="app">${body}</div><script>window.__INITIAL_STATE__=${state};</script>${entry ? `<script type="module" src="/${escape(entry.file)}"></script>` : ""}${head.bodyTags || ""}</body></html>`;
}
