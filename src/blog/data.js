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
const BLOG_DESCRIPTION =
  "Notícias, inovação em saúde e boas práticas para a gestão de clínicas. Acompanhe o blog do Agenda Doutor.";
const ROBOTS_INDEX =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const absolute = (url) =>
  !url ? url : /^https?:\/\//.test(url) ? url : BLOG_ORIGIN + url;
const wordCount = (post) =>
  String(post.contentHtml || "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
const personOrOrg = (author) =>
  author?.name
    ? {
        "@type": "Person",
        name: author.name,
        ...(author.url ? { url: author.url } : {}),
        ...(author.bio ? { description: author.bio } : {}),
      }
    : { "@id": `${BLOG_ORIGIN}/#organization` };

export function blogHead(page, query = {}) {
  const post = page?.post;
  const result = page?.result;
  const path = post
    ? `/blog/${post.slug}`
    : blogQuery({ page: result?.page });
  const url = BLOG_ORIGIN + path;
  const title = post
    ? `${post.seoTitle || post.title} | Agenda Doutor`
    : "Blog | Agenda Doutor";
  const description = post?.seoDescription || post?.excerpt || BLOG_DESCRIPTION;
  const noindex =
    page?.kind === "error" ||
    Boolean(query.q || query.category || query.tag || query.sort);
  const image = absolute(post?.coverUrl) || `${BLOG_ORIGIN}/og-image.png`;
  const imageAlt = post?.coverAlt || "Agenda Doutor";
  const blogId = `${BLOG_ORIGIN}/blog#blog`;
  const publisher = { "@id": `${BLOG_ORIGIN}/#organization` };

  const schema = post
    ? [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          headline: post.title,
          description: post.seoDescription || post.excerpt,
          abstract: post.excerpt,
          image: [
            {
              "@type": "ImageObject",
              url: image,
              caption: imageAlt,
              ...(post.coverCredit ? { creditText: post.coverCredit } : {}),
            },
          ],
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          author: personOrOrg(post.author),
          publisher,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          isPartOf: { "@id": blogId },
          url,
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
          wordCount: wordCount(post),
          ...(post.readingMinutes
            ? { timeRequired: `PT${post.readingMinutes}M` }
            : {}),
          ...(post.category ? { articleSection: post.category } : {}),
          ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
          about: post.category ? { "@type": "Thing", name: post.category } : undefined,
          // Fontes citadas: sinal de confiabilidade (E-E-A-T) para buscadores e IAs.
          ...(post.sources?.length
            ? {
                citation: post.sources.map((source) => ({
                  "@type": "CreativeWork",
                  name: source.title,
                  url: source.url,
                })),
              }
            : {}),
          // Trechos mais adequados para leitura em voz alta / respostas de assistentes.
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: [".ad-blog-article-heading h1", ".ad-blog-article-heading p"],
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: `${BLOG_ORIGIN}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BLOG_ORIGIN}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ],
        },
      ]
    : [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": blogId,
          name: "Blog Agenda Doutor",
          description: BLOG_DESCRIPTION,
          url: `${BLOG_ORIGIN}/blog`,
          inLanguage: "pt-BR",
          publisher,
          ...(result?.data?.length
            ? {
                blogPost: result.data.map((item) => ({
                  "@type": "BlogPosting",
                  headline: item.title,
                  url: `${BLOG_ORIGIN}/blog/${item.slug}`,
                  datePublished: item.publishedAt,
                })),
              }
            : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: `${BLOG_ORIGIN}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BLOG_ORIGIN}/blog` },
          ],
        },
      ];

  const prevNext =
    !post && result && !noindex
      ? [
          ...(result.page > 1
            ? [{ rel: "prev", href: BLOG_ORIGIN + blogQuery({ page: result.page - 1 }) }]
            : []),
          ...(result.page < result.pages
            ? [{ rel: "next", href: BLOG_ORIGIN + blogQuery({ page: result.page + 1 }) }]
            : []),
        ]
      : [];

  return {
    title,
    meta: [
      { name: "description", content: description },
      { name: "robots", content: noindex ? "noindex,follow" : ROBOTS_INDEX },
      ...(post?.author?.name ? [{ name: "author", content: post.author.name }] : []),
      ...(post?.tags?.length ? [{ name: "keywords", content: post.tags.join(", ") }] : []),
      ...Object.entries({
        "og:type": post ? "article" : "website",
        "og:site_name": "Agenda Doutor",
        "og:locale": "pt_BR",
        "og:title": title,
        "og:description": description,
        "og:url": url,
        "og:image": image,
        "og:image:secure_url": image,
        "og:image:type": post?.coverUrl ? "image/webp" : "image/png",
        "og:image:alt": imageAlt,
      }).map(([property, content]) => ({ property, content })),
      {
        name: "twitter:card",
        content: post ? "summary_large_image" : "summary",
      },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: imageAlt },
      ...(post
        ? [
            { property: "article:published_time", content: post.publishedAt },
            {
              property: "article:modified_time",
              content: post.updatedAt || post.publishedAt,
            },
            ...(post.category
              ? [{ property: "article:section", content: post.category }]
              : []),
            ...(post.author?.name
              ? [{ property: "article:author", content: post.author.name }]
              : []),
            ...(post.tags || []).map((tag) => ({
              property: "article:tag",
              content: tag,
            })),
          ]
        : []),
    ],
    link: [
      { rel: "canonical", href: url },
      { rel: "alternate", hreflang: "pt-BR", href: url },
      { rel: "alternate", hreflang: "x-default", href: url },
      ...prevNext,
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Blog Agenda Doutor",
        href: `${BLOG_ORIGIN}/blog/feed.xml`,
      },
    ],
    script: schema.map((item, index) => ({
      key: `blog-structured-data-${index}`,
      type: "application/ld+json",
      innerHTML: JSON.stringify(item).replace(/</g, "\\u003c"),
    })),
  };
}
