<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRight, ArrowLeft } from 'lucide-vue-next'
import { marked } from 'marked'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'https://api.agendadoutor.com'

const article = ref(null)
const relatedArticles = ref([])
const category = ref(null)
const loading = ref(true)

onMounted(async () => {
  await loadArticle()
})

watch(() => route.params.articleSlug, async (newSlug) => {
  if (newSlug) {
    loading.value = true
    await loadArticle()
  }
})

async function loadArticle() {
  try {
    const slug = route.params.articleSlug
    const res = await fetch(`${apiUrl}/v1/help-center/articles/${slug}`)
    if (!res.ok) throw new Error('Artigo não encontrado')
    const data = await res.json()
    article.value = data.article
    relatedArticles.value = data.relatedArticles || []
    category.value = data.article.category
  } catch (err) {
    console.error('[HelpCenter] Erro:', err)
    router.replace('/ajuda')
  } finally {
    loading.value = false
    await nextTick()
    await nextTick()
    animateEntrance()
  }
}

function animateEntrance() {
  gsap.from('.hc-breadcrumb', { opacity: 0, y: -10, duration: 0.4, ease: 'power3.out' })

  const sidebar = document.querySelector('.hc-sidebar')
  if (sidebar) {
    gsap.fromTo(sidebar,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' }
    )
  }

  const article = document.querySelector('.hc-article')
  if (article) {
    gsap.fromTo(article,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power3.out' }
    )
  }
}

const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  try { return marked(article.value.content) }
  catch { return '<p>Erro ao renderizar o conteúdo.</p>' }
})

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function goToArticle(slug) {
  router.push(`/ajuda/${route.params.categorySlug}/${slug}`)
}
</script>

<template>
  <div class="hc-page">
    <AppHeader />

    <main class="hc-main">
      <div class="hc-container">
        <!-- Breadcrumb -->
        <nav class="hc-breadcrumb">
          <router-link to="/">Início</router-link>
          <ChevronRight :size="14" />
          <router-link to="/ajuda">Central de Ajuda</router-link>
          <ChevronRight :size="14" />
          <router-link v-if="category" :to="`/ajuda/${category.slug}`">{{ category.name }}</router-link>
          <template v-if="category"><ChevronRight :size="14" /></template>
          <span class="current">{{ article?.title || '...' }}</span>
        </nav>

        <!-- Loading -->
        <div v-if="loading" class="hc-loading">
          <div class="hc-spinner"></div>
        </div>

        <template v-else-if="article">
          <div class="hc-article-layout">
            <!-- Sidebar -->
            <aside class="hc-sidebar">
              <button class="hc-back-btn" @click="router.push(`/ajuda/${category?.slug}`)">
                <ArrowLeft :size="15" />
                <span>Voltar</span>
              </button>

              <h4 class="hc-sidebar-title">{{ category?.name }}</h4>
              <nav class="hc-sidebar-nav">
                <span class="hc-sidebar-link active">{{ article.title }}</span>
                <a
                  v-for="rel in relatedArticles"
                  :key="rel._id"
                  class="hc-sidebar-link"
                  @click.prevent="goToArticle(rel.slug)"
                  href="#"
                >
                  {{ rel.title }}
                </a>
              </nav>
            </aside>

            <!-- Article content -->
            <article class="hc-article">
              <header class="hc-article-header">
                <span v-if="category" class="hc-article-category">{{ category.name }}</span>
                <h1>{{ article.title }}</h1>
                <p class="hc-article-date">Atualizado em {{ formatDate(article.updatedAt || article.createdAt) }}</p>
                <div v-if="article.tags?.length" class="hc-article-tags">
                  <span v-for="tag in article.tags" :key="tag" class="hc-tag">{{ tag }}</span>
                </div>
              </header>
              <div class="hc-article-body" v-html="renderedContent"></div>
            </article>
          </div>
        </template>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesRegular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesMedium.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesSemiBold.woff2') format('woff2');
  font-weight: 600; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesLight.ttf') format('truetype');
  font-weight: 300; font-style: normal; font-display: swap;
}

.hc-page {
  font-family: 'Oakes', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1e293b;
  background-color: #f8fafc;
  overflow-x: hidden;
  --primary: #2563eb;
  --primary-dark: #1e40af;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hc-main {
  flex: 1;
  padding-top: 100px;
  padding-bottom: 4rem;
}

.hc-container {
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Breadcrumb */
.hc-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.hc-breadcrumb a { color: var(--primary); text-decoration: none; font-weight: 500; transition: opacity 0.2s; }
.hc-breadcrumb a:hover { opacity: 0.7; }
.hc-breadcrumb .current { color: #475569; font-weight: 500; }

/* Layout */
.hc-article-layout { display: flex; gap: 2.5rem; align-items: flex-start; }

/* Sidebar */
.hc-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
}

.hc-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: inherit;
  color: #475569;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
}
.hc-back-btn:hover { background: #f1f5f9; color: #0f172a; }

.hc-sidebar-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin: 0 0 0.75rem 0;
}

.hc-sidebar-nav { display: flex; flex-direction: column; gap: 0.125rem; }

.hc-sidebar-link {
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: #475569;
  text-decoration: none;
  border-radius: 8px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: all 0.2s;
}
.hc-sidebar-link:hover { background: #f1f5f9; color: var(--primary); }
.hc-sidebar-link.active {
  background: rgba(37, 99, 235, 0.06);
  color: var(--primary);
  font-weight: 600;
  border-left-color: var(--primary);
}

/* Article */
.hc-article {
  flex: 1;
  min-width: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
}

.hc-article-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.hc-article-category {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--primary);
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
  display: block;
}

.hc-article-header h1 {
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0 0 0.5rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.hc-article-date {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0 0 0.75rem;
}

.hc-article-tags { display: flex; gap: 0.375rem; flex-wrap: wrap; }
.hc-tag {
  padding: 0.15rem 0.6rem;
  background: #f1f5f9;
  color: var(--primary);
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Markdown Body */
.hc-article-body { line-height: 1.8; color: #374151; font-size: 0.95rem; }
.hc-article-body :deep(h1) { font-size: 1.375rem; margin: 2rem 0 0.75rem; font-weight: 600; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
.hc-article-body :deep(h2) { font-size: 1.2rem; margin: 1.75rem 0 0.625rem; font-weight: 600; }
.hc-article-body :deep(h3) { font-size: 1.05rem; margin: 1.5rem 0 0.5rem; font-weight: 600; }
.hc-article-body :deep(p) { margin: 0.75rem 0; }
.hc-article-body :deep(ul), .hc-article-body :deep(ol) { padding-left: 1.5rem; margin: 0.75rem 0; }
.hc-article-body :deep(li) { margin: 0.375rem 0; }
.hc-article-body :deep(code) { background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 6px; font-size: 0.85em; font-family: 'JetBrains Mono', monospace; color: #e11d48; }
.hc-article-body :deep(pre) { background: #0f172a; color: #e2e8f0; padding: 1.25rem; border-radius: 12px; overflow-x: auto; margin: 1.25rem 0; }
.hc-article-body :deep(pre code) { background: none; padding: 0; color: inherit; }
.hc-article-body :deep(blockquote) { border-left: 3px solid var(--primary); padding: 1rem 1.25rem; background: rgba(37, 99, 235, 0.04); margin: 1.25rem 0; border-radius: 0 12px 12px 0; font-size: 0.9rem; }
.hc-article-body :deep(img) { max-width: 100%; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #e2e8f0; }
.hc-article-body :deep(a) { color: var(--primary); text-decoration: underline; }
.hc-article-body :deep(table) { width: 100%; border-collapse: collapse; margin: 1rem 0; }
.hc-article-body :deep(th), .hc-article-body :deep(td) { border: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; text-align: left; }
.hc-article-body :deep(th) { background: #f8fafc; font-weight: 600; }
.hc-article-body :deep(hr) { border: none; border-top: 1px solid #f1f5f9; margin: 2rem 0; }
.hc-article-body :deep(strong) { font-weight: 700; color: #0f172a; }

/* Loading */
.hc-loading { text-align: center; padding: 4rem; }
.hc-spinner { width: 32px; height: 32px; border: 2.5px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; margin: 0 auto; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .hc-main { padding-top: 80px; }
  .hc-article-layout { flex-direction: column; }
  .hc-sidebar { width: 100%; position: static; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
  .hc-article { padding: 1.5rem; }
}
</style>
