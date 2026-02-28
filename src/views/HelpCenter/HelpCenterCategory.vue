<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ChevronRight, ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'https://api.agendadoutor.com'

const category = ref(null)
const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const slug = route.params.categorySlug
    const res = await fetch(`${apiUrl}/v1/help-center/categories/${slug}`)
    if (!res.ok) throw new Error('Categoria não encontrada')
    const data = await res.json()
    category.value = data.category
    articles.value = data.articles
  } catch (err) {
    console.error('[HelpCenter] Erro:', err)
    router.replace('/ajuda')
  } finally {
    loading.value = false
    await nextTick()
    await nextTick()
    animateEntrance()
  }
})

function animateEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('.hc-breadcrumb', { opacity: 0, y: -10, duration: 0.4 })
    .from('.hc-category-header', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')

  const cards = document.querySelectorAll('.hc-article-card')
  if (cards.length > 0) {
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
    )
  }

  const footer = document.querySelector('.hc-page-footer')
  if (footer) {
    gsap.fromTo(footer,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.5, ease: 'power3.out' }
    )
  }
}

function goToArticle(articleSlug) {
  router.push(`/ajuda/${route.params.categorySlug}/${articleSlug}`)
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
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
          <span class="current">{{ category?.name || '...' }}</span>
        </nav>

        <!-- Loading -->
        <div v-if="loading" class="hc-loading">
          <div class="hc-spinner"></div>
        </div>

        <template v-else-if="category">
          <div class="hc-category-header">
            <h1>{{ category.name }}</h1>
            <p v-if="category.description">{{ category.description }}</p>
          </div>

          <div class="hc-articles-list">
            <button
              v-for="article in articles"
              :key="article._id"
              class="hc-article-card"
              @click="goToArticle(article.slug)"
            >
              <div class="hc-article-info">
                <h3>{{ article.title }}</h3>
                <p v-if="article.excerpt" class="hc-article-excerpt">{{ article.excerpt }}</p>
                <div class="hc-article-meta">
                  <span>{{ formatDate(article.createdAt) }}</span>
                  <div v-if="article.tags?.length" class="hc-tags">
                    <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="hc-tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <ArrowRight :size="18" class="hc-arrow" />
            </button>

            <div v-if="articles.length === 0" class="hc-empty">
              <p>Nenhum artigo publicado nesta categoria.</p>
              <router-link to="/ajuda" class="hc-back-link">
                <ArrowLeft :size="16" /> Voltar para categorias
              </router-link>
            </div>
          </div>

          <!-- Support -->
          <div class="hc-page-footer">
            <p>Não encontrou o que procurava? <a href="mailto:suporte@agendadoutor.com">Entre em contato com o suporte</a></p>
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
  max-width: 760px;
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
.hc-breadcrumb a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}
.hc-breadcrumb a:hover { opacity: 0.7; }
.hc-breadcrumb .current { color: #475569; font-weight: 500; }

/* Category Header */
.hc-category-header {
  margin-bottom: 2rem;
}
.hc-category-header h1 {
  font-size: 1.75rem;
  font-weight: 300;
  margin: 0 0 0.5rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.hc-category-header p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

/* Articles List */
.hc-articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hc-article-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hc-article-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--primary);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.hc-article-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.hc-article-card:hover::before {
  transform: scaleY(1);
}

.hc-article-info { flex: 1; min-width: 0; }

.hc-article-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #0f172a;
}

.hc-article-excerpt {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 0.5rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hc-article-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.hc-tags { display: flex; gap: 0.25rem; }
.hc-tag {
  padding: 0.1rem 0.5rem;
  background: #f1f5f9;
  color: var(--primary);
  border-radius: 99px;
  font-size: 0.65rem;
  font-weight: 600;
}

.hc-arrow {
  color: #d1d5db;
  flex-shrink: 0;
  margin-left: 1rem;
  transition: all 0.3s;
}
.hc-article-card:hover .hc-arrow {
  color: var(--primary);
  transform: translateX(3px);
}

/* Empty & Footer */
.hc-empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}
.hc-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
}

.hc-page-footer {
  text-align: center;
  padding: 2.5rem 1rem 0;
  margin-top: 2rem;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 0.85rem;
}
.hc-page-footer a { color: var(--primary); text-decoration: none; font-weight: 500; }
.hc-page-footer a:hover { text-decoration: underline; }

/* Loading */
.hc-loading { text-align: center; padding: 4rem; }
.hc-spinner {
  width: 32px; height: 32px;
  border: 2.5px solid #e2e8f0;
  border-top-color: var(--primary);
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .hc-main { padding-top: 80px; }
  .hc-category-header h1 { font-size: 1.375rem; }
}
</style>
