import { onBeforeUnmount, onMounted, watch } from "vue";
import { trackEvent } from "@/services/behaviorAnalytics";

const SCROLL_STEPS = [25, 50, 75, 100];
const TIME_STEPS = [15, 30, 60, 120, 180]; // segundos com a aba visível
const READ_COMPLETE_SCROLL = 90;

/** Parâmetros comuns (sem dados pessoais) descrevendo o artigo. */
export function postParams(post) {
  if (!post) return {};
  return {
    post_slug: post.slug,
    post_title: String(post.title || "").slice(0, 100),
    post_category: post.category,
    post_author: post.author?.name,
    reading_minutes: post.readingMinutes,
    post_tags: (post.tags || []).slice(0, 5).join(","),
    published_date: post.publishedAt ? String(post.publishedAt).slice(0, 10) : undefined,
  };
}

/**
 * Engajamento do blog: visualização de lista/artigo, profundidade de rolagem,
 * tempo ativo de leitura, leitura concluída e cliques marcados com
 * `data-blog-event` (+ `data-blog-label`, `data-blog-slug`).
 * Só roda no navegador; durante o SSR todas as funções são no-op.
 */
export function useBlogEngagement({ page, route, articleSelector = ".ad-blog-prose" }) {
  if (import.meta.env.SSR) return;

  let scrollSeen, timeSeen, activeSeconds, ticker, readDone, viewKey, startedAt;

  const reset = () => {
    scrollSeen = new Set();
    timeSeen = new Set();
    activeSeconds = 0;
    readDone = false;
    startedAt = Date.now();
  };

  const articleProgress = () => {
    const el = document.querySelector(articleSelector);
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const total = rect.height || 1;
    const seen = Math.min(Math.max(window.innerHeight - rect.top, 0), total);
    return Math.round((seen / total) * 100);
  };

  const onScroll = () => {
    const post = page.value?.post;
    if (!post) return;
    const progress = articleProgress();
    for (const step of SCROLL_STEPS)
      if (progress >= step && !scrollSeen.has(step)) {
        scrollSeen.add(step);
        trackEvent("blog_scroll_depth", { ...postParams(post), percent_scrolled: step });
      }
    maybeComplete(progress);
  };

  const maybeComplete = (progress = articleProgress()) => {
    const post = page.value?.post;
    if (!post || readDone || progress < READ_COMPLETE_SCROLL) return;
    // Evita contar "scroll rápido": exige ao menos 30% do tempo estimado de leitura.
    const minSeconds = Math.max(10, (post.readingMinutes || 1) * 60 * 0.3);
    if (activeSeconds < minSeconds) return;
    readDone = true;
    trackEvent("blog_read_complete", { ...postParams(post), engaged_seconds: activeSeconds });
  };

  const tick = () => {
    if (document.visibilityState !== "visible" || !page.value?.post) return;
    activeSeconds += 1;
    if (TIME_STEPS.includes(activeSeconds) && !timeSeen.has(activeSeconds)) {
      timeSeen.add(activeSeconds);
      trackEvent("blog_time_on_page", { ...postParams(page.value.post), engaged_seconds: activeSeconds });
    }
    if (activeSeconds % 5 === 0) maybeComplete();
  };

  const onClick = (event) => {
    if (!(event.target instanceof Element)) return;
    const el = event.target.closest("[data-blog-event]");
    if (!el) return;
    const post = page.value?.post;
    const href = el.getAttribute("href") || "";
    let outbound;
    try {
      const url = new URL(href, window.location.href);
      outbound = url.origin !== window.location.origin ? url.hostname : undefined;
    } catch {
      /* href relativo inválido */
    }
    trackEvent(`blog_${el.dataset.blogEvent}`, {
      ...postParams(post),
      link_label: el.dataset.blogLabel,
      target_slug: el.dataset.blogSlug,
      link_domain: outbound,
      list_position: el.dataset.blogPosition,
      source_page: page.value?.kind,
    });
  };

  const onSubmit = (event) => {
    const form = event.target;
    if (!(form instanceof Element) || !form.matches("[data-blog-search]")) return;
    const input = form.querySelector('input[name="q"]');
    // Só o tamanho do termo: o texto pesquisado pode conter dados sensíveis.
    trackEvent("blog_search", { query_length: input?.value?.trim().length || 0, has_filter: Boolean(route.query.category || route.query.tag) });
  };

  const onHide = () => {
    const post = page.value?.post;
    if (document.visibilityState !== "hidden" || !post || activeSeconds < 3) return;
    trackEvent("blog_exit", {
      ...postParams(post),
      engaged_seconds: activeSeconds,
      max_scroll_percent: Math.max(0, ...scrollSeen),
      read_complete: readDone,
    });
  };

  const trackView = () => {
    const current = page.value;
    if (!current || current.kind === "error") return;
    const key = `${current.kind}:${current.post?.slug || ""}:${route.fullPath}`;
    if (key === viewKey) return;
    viewKey = key;
    reset();
    if (current.kind === "article")
      trackEvent("blog_post_view", postParams(current.post));
    else
      trackEvent("blog_list_view", {
        page_number: current.result?.page,
        total_posts: current.result?.total,
        category_filter: route.query.category || undefined,
        tag_filter: route.query.tag || undefined,
        has_search: Boolean(route.query.q),
        sort: route.query.sort || "newest",
      });
    requestAnimationFrame(onScroll);
  };

  onMounted(() => {
    reset();
    trackView();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    document.addEventListener("visibilitychange", onHide);
    ticker = window.setInterval(tick, 1000);
  });
  watch(() => [page.value, route.fullPath], trackView);
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("click", onClick, { capture: true });
    document.removeEventListener("submit", onSubmit, { capture: true });
    document.removeEventListener("visibilitychange", onHide);
    window.clearInterval(ticker);
  });
}
