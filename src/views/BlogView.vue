<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Search,
  Share2,
} from "lucide-vue-next";
import AppHeader from "@/components/global/AppHeader.vue";
import AppFooter from "@/components/global/AppFooter.vue";
import AppButton from "@/components/global/AppButton.vue";
import BlogCard from "@/components/blog/BlogCard.vue";
import { BLOG_ORIGIN, blogHead, blogQuery, loadBlogPage } from "@/blog/data";
import "@/assets/css/blog.css";

const route = useRoute();
const state = inject("blogState", {});
const page = ref(state.blogPage || null);
if (!import.meta.env.SSR) state.blogPage = null;
const loading = ref(!page.value);
const error = ref("");
const search = ref(String(route.query.q || ""));
const post = computed(() => page.value?.post);
const result = computed(() => page.value?.result);
const copied = ref(false);
let controller,
  revision = 0;
const date = (value) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
useHead(computed(() => blogHead(page.value, route.query)));
async function load() {
  controller?.abort();
  controller = new AbortController();
  const current = ++revision;
  loading.value = true;
  error.value = "";
  search.value = String(route.query.q || "");
  try {
    const data = await loadBlogPage(
      route.path,
      route.query,
      undefined,
      controller.signal,
    );
    if (current === revision) page.value = data;
  } catch (failure) {
    if (current === revision && failure.name !== "AbortError")
      error.value = "Não foi possível carregar os artigos. Tente novamente.";
  } finally {
    if (current === revision) loading.value = false;
  }
}
if (!page.value && !import.meta.env.SSR) load();
watch(() => route.fullPath, load);
onBeforeUnmount(() => {
  ++revision;
  controller?.abort();
});
function submitSearch() {
  window.location.assign(
    blogQuery(route.query, { q: search.value.trim(), page: 1 }),
  );
}
async function copyLink() {
  try {
    await navigator.clipboard.writeText(
      `${BLOG_ORIGIN}/blog/${post.value.slug}`,
    );
    copied.value = true;
  } catch {
    error.value =
      "Não foi possível copiar o link. Você pode copiar o endereço na barra do navegador.";
  }
}
</script>
<template>
  <div class="landing-page ad-blog-page">
    <AppHeader />
    <main id="blog-conteudo" class="ad-blog-container" :aria-busy="loading">
      <div v-if="error" role="alert" class="ad-blog-notice">
        {{ error }}
        <AppButton variant="outline" @click="load">Tentar novamente</AppButton>
      </div>
      <section
        v-if="loading && !page"
        class="ad-blog-loading"
        role="status"
        aria-label="Carregando artigos"
      >
        <span></span><span></span><span></span>
      </section>
      <section v-else-if="page?.kind === 'error'" class="ad-blog-empty">
        <BookOpen :size="36" />
        <h1>
          {{
            page.status === 404
              ? "Este artigo não está disponível"
              : "Não foi possível carregar o blog"
          }}
        </h1>
        <p>
          {{
            page.status === 404
              ? "O conteúdo pode ter sido removido ou ainda não foi publicado."
              : "Tente novamente em alguns instantes."
          }}
        </p>
        <AppButton href="/blog" variant="primary">Voltar para o blog</AppButton>
      </section>
      <template v-else-if="result">
        <header class="ad-blog-hero">
          <span class="ad-blog-kicker">BLOG AGENDA DOUTOR</span>
          <h1>
            Informação que aproxima.<br /><span>Conhecimento que cuida.</span>
          </h1>
          <p>
            Notícias do mundo da saúde, novas ideias e boas práticas para quem
            cuida de pessoas e faz a gestão da clínica.
          </p>
        </header>
        <div class="ad-blog-filters">
          <nav aria-label="Categorias">
            <a
              :href="blogQuery(route.query, { category: '', page: 1 })"
              :aria-current="!route.query.category ? 'page' : undefined"
              >Todos os temas</a
            ><a
              v-for="category in result.categories"
              :key="category"
              :href="blogQuery(route.query, { category, page: 1 })"
              :aria-current="
                route.query.category === category ? 'page' : undefined
              "
              >{{ category }}</a
            >
          </nav>
          <form
            role="search"
            action="/blog"
            method="get"
            @submit.prevent="submitSearch"
          >
            <input
              v-if="route.query.category"
              type="hidden"
              name="category"
              :value="route.query.category"
            /><input
              v-if="route.query.tag"
              type="hidden"
              name="tag"
              :value="route.query.tag"
            /><label class="ad-blog-sr" for="ad-blog-search"
              >Pesquisar artigos</label
            ><input
              name="q"
              id="ad-blog-search"
              v-model="search"
              type="search"
              maxlength="120"
              placeholder="Pesquisar no blog"
            /><AppButton type="submit" variant="outline" aria-label="Pesquisar"
              ><Search :size="18"
            /></AppButton>
          </form>
        </div>
        <div class="ad-blog-results">
          <span
            >{{ result.total }} {{ result.total === 1 ? "artigo" : "artigos"
            }}<template v-if="route.query.tag">
              com #{{ route.query.tag }}</template
            ></span
          >
          <div>
            <a
              v-if="route.query.q || route.query.category || route.query.tag"
              href="/blog"
              >Limpar filtros</a
            ><a
              :href="
                blogQuery(route.query, {
                  sort: route.query.sort === 'oldest' ? '' : 'oldest',
                  page: 1,
                })
              "
              >{{
                route.query.sort === "oldest"
                  ? "Mais antigos primeiro"
                  : "Mais recentes primeiro"
              }}</a
            >
          </div>
        </div>
        <div v-if="result.data.length" class="ad-blog-grid">
          <BlogCard
            v-for="(article, index) in result.data"
            :key="article._id"
            :post="article"
            :featured="
              index === 0 &&
              result.page === 1 &&
              !route.query.q &&
              !route.query.category &&
              !route.query.tag
            "
          />
        </div>
        <section v-else class="ad-blog-empty">
          <BookOpen :size="36" />
          <h2>
            {{
              result.total
                ? "Nenhum artigo nesta página"
                : route.query.q || route.query.category || route.query.tag
                  ? "Nenhum artigo encontrado"
                  : "Novas leituras estão a caminho"
            }}
          </h2>
          <p>
            Explore os temas ou volte em breve para acompanhar as próximas
            publicações.
          </p>
          <AppButton
            v-if="route.query.q || route.query.category || route.query.tag"
            href="/blog"
            variant="outline"
            >Ver todos os artigos</AppButton
          >
        </section>
        <nav
          v-if="result.pages > 1"
          class="ad-blog-pagination"
          aria-label="Paginação"
        >
          <AppButton
            v-if="result.page > 1"
            :href="blogQuery(route.query, { page: result.page - 1 })"
            variant="outline"
            rel="prev"
            ><ArrowLeft :size="16" />Anterior</AppButton
          ><span>Página {{ result.page }} de {{ result.pages }}</span
          ><AppButton
            v-if="result.page < result.pages"
            :href="blogQuery(route.query, { page: result.page + 1 })"
            variant="outline"
            rel="next"
            >Próxima<ArrowRight :size="16"
          /></AppButton>
        </nav>
      </template>
      <template v-else-if="post">
        <nav class="ad-blog-breadcrumb" aria-label="Caminho">
          <a href="/blog">Blog</a><span>/</span
          ><a :href="blogQuery({ category: post.category })">{{
            post.category
          }}</a>
        </nav>
        <article>
          <header class="ad-blog-article-heading">
            <span class="ad-blog-kicker">{{ post.category }}</span>
            <h1>{{ post.title }}</h1>
            <p>{{ post.excerpt }}</p>
            <div class="ad-blog-meta">
              <span>Por {{ post.author?.name }}</span
              ><time :datetime="post.publishedAt">{{
                date(post.publishedAt)
              }}</time
              ><span>{{ post.readingMinutes }} min de leitura</span>
            </div>
          </header>
          <figure v-if="post.coverUrl" class="ad-blog-cover">
            <img
              :src="post.coverUrl"
              :alt="post.coverAlt"
              width="1800"
              height="1000"
              fetchpriority="high"
            />
            <figcaption v-if="post.coverCredit">
              {{ post.coverCredit }}
            </figcaption>
          </figure>
          <div class="ad-blog-article-layout">
            <div class="ad-blog-prose" v-html="post.contentHtml" />
            <aside v-if="post.headings?.length" class="ad-blog-toc">
              <h2>Neste artigo</h2>
              <a
                v-for="heading in post.headings.filter(
                  (item) => item.level === 2,
                )"
                :key="heading.id"
                :href="`#${heading.id}`"
                >{{ heading.text }}</a
              >
            </aside>
          </div>
          <div class="ad-blog-article-end">
            <section v-if="post.sources?.length">
              <h2>Fontes e referências</h2>
              <ul>
                <li v-for="source in post.sources" :key="source.url">
                  <a :href="source.url" rel="noopener noreferrer">{{
                    source.title
                  }}</a>
                </li>
              </ul>
            </section>
            <nav class="ad-blog-tags" aria-label="Tags">
              <a v-for="tag in post.tags" :key="tag" :href="blogQuery({ tag })"
                >#{{ tag }}</a
              >
            </nav>
            <aside class="ad-blog-author">
              <strong>{{ post.author?.name }}</strong>
              <p v-if="post.author?.bio">{{ post.author.bio }}</p>
              <a
                v-if="post.author?.url"
                :href="post.author.url"
                rel="noopener noreferrer"
                >Sobre o autor</a
              >
            </aside>
            <p class="ad-blog-disclaimer">
              Conteúdo informativo. Não substitui avaliação, diagnóstico ou
              orientação de um profissional de saúde.
            </p>
            <nav class="ad-blog-share" aria-label="Compartilhar">
              <AppButton variant="outline" @click="copyLink"
                ><Share2 :size="16" />{{
                  copied ? "Link copiado" : "Copiar link"
                }}</AppButton
              ><AppButton
                :href="`https://wa.me/?text=${encodeURIComponent(`${post.title} ${BLOG_ORIGIN}/blog/${post.slug}`)}`"
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                >WhatsApp</AppButton
              ><AppButton
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BLOG_ORIGIN}/blog/${post.slug}`)}`"
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                >LinkedIn</AppButton
              >
            </nav>
          </div>
        </article>
        <section v-if="post.related?.length" class="ad-blog-related">
          <h2>Continue a leitura</h2>
          <div class="ad-blog-grid">
            <BlogCard
              v-for="article in post.related"
              :key="article._id"
              :post="article"
            />
          </div>
        </section>
      </template>
      <aside class="ad-blog-cta">
        <div>
          <span class="ad-blog-kicker">MENOS BUROCRACIA. MAIS CUIDADO.</span>
          <h2>Sua clínica pode ter<br />uma rotina mais leve.</h2>
          <p>Conheça o Agenda Doutor e dedique mais tempo ao que importa.</p>
        </div>
        <AppButton to="/register" variant="primary" size="lg"
          >Começar agora <ArrowRight :size="18"
        /></AppButton>
      </aside>
    </main>
    <AppFooter />
  </div>
</template>
