export const BLOG_ORIGIN = "https://www.agendadoutor.com";
// Use the LP's existing API setting. The alias remains supported for older setups.
export const BLOG_API_ORIGIN =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";
export function blogQuery(query, changes = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...query, ...changes })) {
    if (
      ["q", "category", "tag", "sort", "page"].includes(key) &&
      value &&
      String(value) !== "1"
    )
      params.set(key, String(value));
  }
  return `/blog${params.size ? `?${params}` : ""}`;
}
export async function loadBlogPage(
  path,
  query,
  apiOrigin = BLOG_API_ORIGIN,
  signal,
) {
  const slug = path.replace(/^\/blog\/?/, "");
  const url = new URL(
    slug ? `/v1/blog/posts/${encodeURIComponent(slug)}` : "/v1/blog/posts",
    apiOrigin || window.location.origin,
  );
  if (!slug)
    for (const [key, value] of new URLSearchParams(
      blogQuery(query).split("?")[1],
    ))
      url.searchParams.set(key, value);
  const response = await fetch(url, { signal });
  if (!response.ok)
    return { kind: "error", status: response.status === 404 ? 404 : 503 };
  const data = await response.json();
  if (!slug && data.page > data.pages) return { kind: "error", status: 404 };
  return slug
    ? { kind: "article", post: data.data }
    : { kind: "index", result: data };
}
export function blogHead(page, query = {}) {
  const post = page?.post;
  const path = post
    ? `/blog/${post.slug}`
    : blogQuery({ page: page?.result?.page });
  const url = BLOG_ORIGIN + path;
  const title = post
    ? `${post.seoTitle || post.title} | Agenda Doutor`
    : "Blog | Agenda Doutor";
  const description =
    post?.seoDescription ||
    post?.excerpt ||
    "Notícias, inovação em saúde e boas práticas para a gestão de clínicas. Acompanhe o blog do Agenda Doutor.";
  const noindex =
    page?.kind === "error" ||
    Boolean(query.q || query.category || query.tag || query.sort);
  const image = post?.coverUrl || `${BLOG_ORIGIN}/og-image.png`;
  const schema = post
    ? [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: [image],
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Person",
            name: post.author?.name,
            ...(post.author?.url ? { url: post.author.url } : {}),
          },
          publisher: { "@id": `${BLOG_ORIGIN}/#organization` },
          mainEntityOfPage: url,
          inLanguage: "pt-BR",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Blog",
              item: `${BLOG_ORIGIN}/blog`,
            },
            { "@type": "ListItem", position: 2, name: post.title, item: url },
          ],
        },
      ]
    : {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Blog Agenda Doutor",
        url: `${BLOG_ORIGIN}/blog`,
        inLanguage: "pt-BR",
      };
  return {
    title,
    meta: [
      { name: "description", content: description },
      {
        name: "robots",
        content: noindex
          ? "noindex,follow"
          : "index,follow,max-image-preview:large",
      },
      ...Object.entries({
        "og:type": post ? "article" : "website",
        "og:title": title,
        "og:description": description,
        "og:url": url,
        "og:image": image,
        "og:image:secure_url": image,
        "og:image:type": post?.coverUrl ? "image/webp" : "image/png",
        "og:image:alt": post?.coverAlt || "Agenda Doutor",
      }).map(([property, content]) => ({ property, content })),
      {
        name: "twitter:card",
        content: post ? "summary_large_image" : "summary",
      },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: post?.coverAlt || "Agenda Doutor" },
      ...(post
        ? [
            { property: "article:published_time", content: post.publishedAt },
            { property: "article:modified_time", content: post.updatedAt },
          ]
        : []),
    ],
    link: [
      { rel: "canonical", href: url },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Blog Agenda Doutor",
        href: `${BLOG_ORIGIN}/blog/feed.xml`,
      },
    ],
    script: [
      {
        key: "blog-structured-data",
        type: "application/ld+json",
        innerHTML: JSON.stringify(schema).replace(/</g, "\\u003c"),
      },
    ],
  };
}
