<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, ChevronRight, ArrowRight } from 'lucide-vue-next'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'https://api.agendadoutor.com'

const query = ref(route.query.q || '')
const articles = ref([])
const total = ref(0)
const loading = ref(false)
const searched = ref(false)

onMounted(() => {
  gsap.from('.hc-breadcrumb', { opacity: 0, y: -10, duration: 0.4, ease: 'power3.out' })
  gsap.from('.hc-search-title', { opacity: 0, y: 20, duration: 0.5, delay: 0.1, ease: 'power3.out' })
  gsap.from('.hc-search-form', { opacity: 0, y: 15, duration: 0.5, delay: 0.2, ease: 'power3.out' })

  if (query.value) search()
})

watch(() => route.query.q, (val) => {
  if (val) {
    query.value = val
    search()
  }
})

async function search() {
  if (!query.value.trim() || query.value.trim().length < 2) return
  loading.value = true
  searched.value = true
  try {
    const res = await fetch(`${apiUrl}/v1/help-center/search?q=${encodeURIComponent(query.value.trim())}`)
    if (!res.ok) throw new Error('Erro na busca')
    const data = await res.json()
    articles.value = data.articles
    total.value = data.total
  } catch (err) {
    console.error('[HelpCenter] Erro na busca:', err)
    articles.value = []
    total.value = 0
  } finally {
    loading.value = false
    await nextTick()
    await nextTick()
    const cards = document.querySelectorAll('.hc-result-card')
    if (cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }
      )
    }
  }
}

function handleSearch() {
  router.replace({ query: { q: query.value.trim() } })
  search()
}

function goToArticle(article) {
  const categorySlug = article.category?.slug || 'geral'
  router.push(`/ajuda/${categorySlug}/${article.slug}`)
}

function highlightText(text, q) {
  if (!q || !text) return text
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
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
          <span class="current">Busca</span>
        </nav>

        <h1 class="hc-search-title">Buscar na Central de Ajuda</h1>

        <!-- Search -->
        <form class="hc-search-form" @submit.prevent="handleSearch">
          <div class="hc-search-bar">
            <Search :size="20" class="hc-search-icon" />
            <input v-model="query" type="text" placeholder="Buscar artigos..." class="hc-search-input" />
            <button type="submit" class="hc-search-btn">
              <ArrowRight :size="18" />
            </button>
          </div>
        </form>

        <!-- Loading -->
        <div v-if="loading" class="hc-loading">
          <div class="hc-spinner"></div>
        </div>

        <!-- Results -->
        <div v-else-if="searched">
          <p class="hc-results-count" v-if="total > 0">
            {{ total }} resultado{{ total !== 1 ? 's' : '' }} para "<strong>{{ route.query.q }}</strong>"
          </p>

          <div class="hc-results-list">
            <button
              v-for="article in articles"
              :key="article._id"
              class="hc-result-card"
              @click="goToArticle(article)"
            >
              <span class="hc-result-category">{{ article.category?.name }}</span>
              <h3 v-html="highlightText(article.title, route.query.q)"></h3>
              <p v-if="article.excerpt" class="hc-result-excerpt" v-html="highlightText(article.excerpt, route.query.q)"></p>
            </button>
          </div>

          <div v-if="total === 0" class="hc-no-results">
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente buscar com outros termos ou verifique a ortografia.</p>
            <router-link to="/ajuda" class="hc-back-link">← Voltar para categorias</router-link>
          </div>
        </div>
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
  max-width: 700px;
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
}
.hc-breadcrumb a { color: var(--primary); text-decoration: none; font-weight: 500; transition: opacity 0.2s; }
.hc-breadcrumb a:hover { opacity: 0.7; }
.hc-breadcrumb .current { color: #475569; font-weight: 500; }

.hc-search-title {
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0 0 1.5rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}

/* Search */
.hc-search-form { margin-bottom: 2rem; }
.hc-search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.375rem;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.hc-search-bar:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}
.hc-search-icon { margin-left: 0.75rem; color: #94a3b8; flex-shrink: 0; }
.hc-search-input {
  flex: 1;
  padding: 0.75rem 0.875rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1e293b;
}
.hc-search-input:focus { outline: none; }
.hc-search-input::placeholder { color: #94a3b8; }
.hc-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.hc-search-btn:hover { background: var(--primary-dark); }

/* Results */
.hc-results-count {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}
.hc-results-list { display: flex; flex-direction: column; gap: 0.75rem; }
.hc-result-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.hc-result-card::before {
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
.hc-result-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}
.hc-result-card:hover::before { transform: scaleY(1); }
.hc-result-category {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 0.25rem;
  letter-spacing: 0.06em;
}
.hc-result-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #0f172a;
}
.hc-result-excerpt {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}
.hc-result-card :deep(mark) {
  background: #fef08a;
  padding: 0.05rem 0.15rem;
  border-radius: 3px;
}

/* States */
.hc-loading, .hc-no-results { text-align: center; padding: 3rem; color: #64748b; }
.hc-no-results h3 { margin: 0 0 0.5rem; color: #374151; font-weight: 600; }
.hc-spinner { width: 32px; height: 32px; border: 2.5px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; margin: 0 auto; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.hc-back-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
}
</style>
