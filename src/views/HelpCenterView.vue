<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ArrowRight,
  BookOpenText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Menu,
  MessageCircle,
  Search,
  Share2,
  X,
} from 'lucide-vue-next'
import { marked } from 'marked'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'
import { fetchKnowledgePageBySlug, fetchKnowledgeTree } from '@/api/knowledge-base'
import logoTexto from '@/assets/logo_texto.svg'

const categories = ref([])
const selectedPage = ref(null)
const selectedSlug = ref('')
const searchQuery = ref('')
const loadingTree = ref(false)
const loadingPage = ref(false)
const loadingBoot = ref(true)
const loadError = ref('')
const shareFeedback = ref('')
const sidebarFeedback = ref('')
const collapsedCategoryIds = ref([])
const isMobileMenuOpen = ref(false)

let shareTimer = null
let sidebarTimer = null

marked.setOptions({
  gfm: true,
  breaks: true,
})

const renderedArticle = computed(() => {
  if (!selectedPage.value?.contentMarkdown) return ''

  try {
    return marked.parse(selectedPage.value.contentMarkdown)
  } catch (error) {
    console.error('[LP HelpCenter] Erro ao renderizar markdown:', error)
    return '<p>Não foi possível renderizar este conteúdo.</p>'
  }
})

const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return categories.value

  return categories.value
    .map((category) => ({
      ...category,
      pages: (category.pages || []).filter((page) => page.title.toLowerCase().includes(query)),
    }))
    .filter((category) => category.pages.length > 0)
})

const orderedPages = computed(() =>
  categories.value.flatMap((category) =>
    (category.pages || []).map((page) => ({
      ...page,
      categoryName: category.name,
    }))
  )
)

const currentArticleIndex = computed(() =>
  orderedPages.value.findIndex((page) => page.slug === selectedSlug.value)
)

const previousArticle = computed(() => {
  if (currentArticleIndex.value <= 0) return null
  return orderedPages.value[currentArticleIndex.value - 1]
})

const nextArticle = computed(() => {
  if (currentArticleIndex.value < 0 || currentArticleIndex.value >= orderedPages.value.length - 1) return null
  return orderedPages.value[currentArticleIndex.value + 1]
})

const totalCategories = computed(() => categories.value.length)
const totalArticles = computed(() => orderedPages.value.length)

function openMobileMenu() {
  isMobileMenuOpen.value = true
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleEscapeClose(event) {
  if (event.key !== 'Escape') return
  closeMobileMenu()
}

function isCategoryCollapsed(categoryId) {
  return collapsedCategoryIds.value.includes(String(categoryId))
}

function toggleCategory(categoryId) {
  const key = String(categoryId)

  if (isCategoryCollapsed(key)) {
    collapsedCategoryIds.value = collapsedCategoryIds.value.filter((item) => item !== key)
    return
  }

  collapsedCategoryIds.value = [...collapsedCategoryIds.value, key]
}

function categoryIsOpen(categoryId) {
  if (searchQuery.value.trim()) return true
  return !isCategoryCollapsed(categoryId)
}

function expandCategoryBySlug(slug) {
  const ownerCategory = categories.value.find((category) =>
    (category.pages || []).some((page) => page.slug === slug)
  )

  if (!ownerCategory) return

  const ownerKey = String(ownerCategory._id)
  collapsedCategoryIds.value = collapsedCategoryIds.value.filter((item) => item !== ownerKey)
}

function formatDate(value) {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch (_error) {
    return ''
  }
}

function syncArticleQuery(slug) {
  try {
    const currentUrl = new URL(window.location.href)
    if (slug) {
      currentUrl.searchParams.set('artigo', slug)
    } else {
      currentUrl.searchParams.delete('artigo')
    }
    window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`)
  } catch (_error) {
    // no-op
  }
}

async function copyHelpCenterLink() {
  const shareUrl = new URL(window.location.href)
  shareUrl.searchParams.delete('artigo')

  try {
    await navigator.clipboard.writeText(String(shareUrl))
    sidebarFeedback.value = 'Link da central copiado.'
  } catch (_error) {
    sidebarFeedback.value = 'Não foi possível copiar automaticamente.'
  }

  if (sidebarTimer) clearTimeout(sidebarTimer)
  sidebarTimer = setTimeout(() => {
    sidebarFeedback.value = ''
  }, 2200)
}

async function copyArticleLink() {
  if (!selectedSlug.value) return

  const shareUrl = new URL(window.location.href)
  shareUrl.searchParams.set('artigo', selectedSlug.value)

  try {
    await navigator.clipboard.writeText(String(shareUrl))
    shareFeedback.value = 'Link do artigo copiado.'
  } catch (_error) {
    shareFeedback.value = 'Não foi possível copiar o link automaticamente.'
  }

  if (shareTimer) clearTimeout(shareTimer)
  shareTimer = setTimeout(() => {
    shareFeedback.value = ''
  }, 2200)
}

async function loadTree() {
  loadingTree.value = true
  loadError.value = ''
  try {
    const payload = await fetchKnowledgeTree()
    categories.value = Array.isArray(payload) ? payload : []
    collapsedCategoryIds.value = categories.value.map((category) => String(category._id))
  } catch (error) {
    console.error('[LP HelpCenter] Erro ao carregar árvore:', error)
    loadError.value = error.message || 'Não foi possível carregar a Central de Ajuda.'
    categories.value = []
    collapsedCategoryIds.value = []
  } finally {
    loadingTree.value = false
  }
}

async function selectPage(slug, options = { updateQuery: true }) {
  if (!slug) return
  if (selectedSlug.value === slug && selectedPage.value?.slug === slug) return

  closeMobileMenu()
  expandCategoryBySlug(slug)
  selectedSlug.value = slug
  loadingPage.value = true
  loadError.value = ''

  try {
    selectedPage.value = await fetchKnowledgePageBySlug(slug)
    if (options.updateQuery) {
      syncArticleQuery(slug)
    }
  } catch (error) {
    console.error('[LP HelpCenter] Erro ao carregar página:', error)
    loadError.value = error.message || 'Não foi possível carregar o artigo.'
    selectedPage.value = null
  } finally {
    loadingPage.value = false
  }
}

function goToPreviousArticle() {
  if (!previousArticle.value) return
  selectPage(previousArticle.value.slug)
}

function goToNextArticle() {
  if (!nextArticle.value) return
  selectPage(nextArticle.value.slug)
}

function openFirstArticle() {
  if (!orderedPages.value.length) return
  selectPage(orderedPages.value[0].slug)
}

function selectWelcome() {
  closeMobileMenu()
  selectedPage.value = null
  selectedSlug.value = ''
  loadError.value = ''
  shareFeedback.value = ''
  syncArticleQuery('')
}

onMounted(async () => {
  loadingBoot.value = true
  window.addEventListener('keydown', handleEscapeClose)

  await loadTree()

  const currentUrl = new URL(window.location.href)
  const querySlug = currentUrl.searchParams.get('artigo') || ''
  const availableSlug = querySlug
    ? categories.value.some((category) => (category.pages || []).some((page) => page.slug === querySlug))
      ? querySlug
      : ''
    : ''

  if (availableSlug) {
    await selectPage(availableSlug, { updateQuery: true })
  } else {
    selectedPage.value = null
    selectedSlug.value = ''
    syncArticleQuery('')
  }

  loadingBoot.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscapeClose)
  document.body.style.overflow = ''
  if (shareTimer) clearTimeout(shareTimer)
  if (sidebarTimer) clearTimeout(sidebarTimer)
})

watch(isMobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
</script>

<template>
  <div class="help-center-page">
    <AppHeader />

    <main class="help-main">
      <div class="help-bg-shape shape-one"></div>
      <div class="help-bg-shape shape-two"></div>

      <section class="container hero-section">
        <span class="hero-badge">Suporte Agenda Doutor</span>
        <h1>Central de Ajuda</h1>
        <p>
          Encontre respostas rápidas, compartilhe artigos com sua equipe e acelere o uso do sistema no dia a dia.
        </p>

      </section>

      <section class="container">
        <div class="mobile-toolbar card-base">
          <button type="button" class="mobile-menu-btn" @click="openMobileMenu">
            <Menu :size="16" />
            Menu de artigos
          </button>

          <button type="button" class="mobile-menu-btn secondary" @click="openFirstArticle" :disabled="!totalArticles">
            Começar guia
            <ArrowRight :size="14" />
          </button>
        </div>

        <div v-if="isMobileMenuOpen" class="mobile-backdrop" @click="closeMobileMenu"></div>

        <div class="help-layout">
          <aside class="help-sidebar card-base" :class="{ 'mobile-open': isMobileMenuOpen }">
            <div class="sidebar-mobile-head">
              <img :src="logoTexto" alt="Agenda Doutor" />
              <button type="button" class="close-mobile-menu" @click="closeMobileMenu" aria-label="Fechar menu">
                <X :size="18" />
              </button>
            </div>

            <div class="search-wrap">
              <Search :size="16" class="search-icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar artigo"
                aria-label="Buscar artigo"
              />
            </div>

            <button
              type="button"
              class="page-link welcome-link"
              :class="{ active: !selectedSlug }"
              @click="selectWelcome"
            >
              <BookOpenText :size="14" />
              <span>Boas-vindas</span>
            </button>

            <div v-if="loadingTree" class="sidebar-feedback">
              <LoaderCircle :size="16" class="spin" />
              Carregando categorias...
            </div>

            <template v-else>
              <div v-if="filteredCategories.length === 0" class="sidebar-feedback">
                Nenhum artigo encontrado.
              </div>

              <div v-for="category in filteredCategories" :key="category._id" class="category-group">
                <button type="button" class="category-toggle" @click="toggleCategory(category._id)">
                  <h3>{{ category.name }}</h3>
                  <div class="category-toggle-right">
                    <span>{{ category.pages.length }}</span>
                    <ChevronDown :size="14" :class="{ rotated: categoryIsOpen(category._id) }" />
                  </div>
                </button>

                <div v-show="categoryIsOpen(category._id)" class="category-pages">
                  <button
                    v-for="page in category.pages"
                    :key="page._id"
                    type="button"
                    class="page-link"
                    :class="{ active: page.slug === selectedSlug }"
                    @click="selectPage(page.slug)"
                  >
                    <BookOpenText :size="14" />
                    <span>{{ page.title }}</span>
                  </button>
                </div>
              </div>
            </template>

            <a class="support-cta" href="https://wa.me/5511921923978" target="_blank" rel="noopener">
              <MessageCircle :size="16" />
              Falar com suporte
            </a>
          </aside>

          <section class="help-article card-base">
            <div v-if="loadingBoot || loadingPage" class="article-feedback">
              <LoaderCircle :size="18" class="spin" />
              Carregando conteúdo...
            </div>

            <template v-else>
              <div v-if="loadError" class="article-feedback article-error">
                {{ loadError }}
              </div>

              <article v-else-if="selectedPage" class="article-card">
                <header class="article-header">
                  <div class="article-meta-line">
                    <span class="category-pill">{{ selectedPage.category?.name || 'Base de Conhecimento' }}</span>
                    <span v-if="selectedPage.updatedAt">Atualizado em {{ formatDate(selectedPage.updatedAt) }}</span>
                  </div>

                  <button type="button" class="share-btn" @click="copyArticleLink">
                    <Share2 :size="14" />
                    Copiar link
                  </button>
                </header>

                <h2>{{ selectedPage.title }}</h2>
                <p v-if="shareFeedback" class="share-feedback">{{ shareFeedback }}</p>

                <div class="markdown-body" v-html="renderedArticle"></div>

                <footer class="article-nav">
                  <button
                    type="button"
                    class="article-nav-btn"
                    :disabled="!previousArticle"
                    @click="goToPreviousArticle"
                  >
                    <ChevronLeft :size="16" />
                    <span>
                      <small>Anterior</small>
                      <strong>{{ previousArticle?.title || 'Não disponível' }}</strong>
                    </span>
                  </button>

                  <button
                    type="button"
                    class="article-nav-btn article-nav-btn-next"
                    :disabled="!nextArticle"
                    @click="goToNextArticle"
                  >
                    <span>
                      <small>Proximo</small>
                      <strong>{{ nextArticle?.title || 'Não disponível' }}</strong>
                    </span>
                    <ChevronRight :size="16" />
                  </button>
                </footer>
              </article>

              <div v-else class="article-empty">
                <header class="welcome-article-head">
                  <div class="article-meta-line">
                    <span class="category-pill">Início</span>
                    <span>Guia rapido da base de conhecimento</span>
                  </div>
                </header>

                <img class="welcome-article-logo" :src="logoTexto" alt="Agenda Doutor" />

                <h2>Bem-vindo(a) a Central de Ajuda</h2>
                <p>
                  Aqui você encontra passo a passo para sua equipe usar o Agenda Doutor no dia a dia, sem depender de
                  token ou login.
                </p>

                <div class="welcome-stats">
                  <div class="welcome-stat-item">
                    <strong>{{ totalCategories }}</strong>
                    <span>Categorias disponiveis</span>
                  </div>
                  <div class="welcome-stat-item">
                    <strong>{{ totalArticles }}</strong>
                    <span>Artigos publicados</span>
                  </div>
                </div>

                <div class="welcome-actions">
                  <button type="button" class="welcome-btn primary" @click="openFirstArticle" :disabled="!totalArticles">
                    Iniciar leitura
                    <ArrowRight :size="14" />
                  </button>
                  <button type="button" class="welcome-btn secondary" @click="copyHelpCenterLink">
                    Compartilhar central
                  </button>
                  <a class="welcome-btn support" href="https://wa.me/5511921923978" target="_blank" rel="noopener">
                    <MessageCircle :size="14" />
                    Falar com suporte
                  </a>
                </div>

                <p v-if="sidebarFeedback" class="welcome-feedback">{{ sidebarFeedback }}</p>

                <button type="button" class="article-empty-btn" @click="openMobileMenu">
                  <Menu :size="16" />
                  Abrir menu de artigos
                </button>
              </div>
            </template>
          </section>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.help-center-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f7faff 0%, #f8fafc 35%, #ffffff 100%);
}

.help-main {
  position: relative;
  padding-top: 120px;
  padding-bottom: 4.5rem;
  overflow: hidden;
}

.help-bg-shape {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(30px);
}

.shape-one {
  width: 280px;
  height: 280px;
  background: rgba(37, 99, 235, 0.07);
  top: 110px;
  left: -80px;
}

.shape-two {
  width: 340px;
  height: 340px;
  background: rgba(56, 189, 248, 0.06);
  top: 260px;
  right: -100px;
}

.container {
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.hero-section {
  margin-bottom: 1rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-section h1 {
  margin: 0.7rem 0 0.5rem 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.06;
  color: #0f172a;
  letter-spacing: -0.03em;
}

.hero-section p {
  margin: 0;
  max-width: 880px;
  color: #475569;
  line-height: 1.65;
}

.mobile-toolbar {
  display: none;
  margin-bottom: 0.9rem;
  padding: 0.45rem;
  gap: 0.5rem;
}

.mobile-menu-btn {
  border: 1px solid #cbd5e1;
  border-radius: 0.74rem;
  background: #ffffff;
  color: #0f172a;
  min-height: 2.5rem;
  padding: 0.45rem 0.7rem;
  font-size: 0.84rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.mobile-menu-btn.secondary {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

.mobile-menu-btn:disabled {
  opacity: 0.55;
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(2px);
  z-index: 110;
}

.help-layout {
  display: grid;
  grid-template-columns: 350px minmax(0, 1fr);
  gap: 0.9rem;
}

.card-base {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #e2e8f0;
  border-radius: 1.1rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.help-sidebar {
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.78rem;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  position: sticky;
  top: 88px;
}

.sidebar-mobile-head {
  display: none;
}

.welcome-stats {
  margin-top: 0.68rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

.welcome-stat-item {
  border: 1px solid #dbeafe;
  border-radius: 0.65rem;
  padding: 0.48rem 0.52rem;
  background: rgba(255, 255, 255, 0.76);
}

.welcome-stat-item strong {
  display: block;
  color: #0f172a;
  font-size: 1rem;
  line-height: 1;
}

.welcome-stat-item span {
  color: #64748b;
  font-size: 0.72rem;
}

.welcome-actions {
  margin-top: 0.9rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
  width: min(860px, 100%);
}

.welcome-btn {
  border-radius: 0.7rem;
  border: 1px solid #cbd5e1;
  min-height: 2.7rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.32rem;
  text-decoration: none;
}

.welcome-btn.primary {
  background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #2563eb;
  color: #ffffff;
}

.welcome-btn.secondary {
  background: #ffffff;
  color: #1e293b;
}

.welcome-btn.support {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.welcome-btn:disabled {
  opacity: 0.55;
}

.welcome-feedback {
  margin-top: 0.62rem;
  color: #1d4ed8;
  font-size: 0.82rem;
}

.search-wrap {
  position: relative;
  margin-bottom: 0.2rem;
}

.search-wrap input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.72rem;
  padding: 0.72rem 0.78rem 0.72rem 2.2rem;
  font-size: 0.9rem;
  background-color: #ffffff;
}

.search-wrap input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #64748b;
}

.sidebar-feedback {
  margin-top: 0.7rem;
  color: #64748b;
  font-size: 0.88rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.category-group {
  margin-top: 0.9rem;
}

.category-toggle {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.12rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  cursor: pointer;
}

.category-toggle h3 {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
  font-weight: 700;
}

.category-toggle-right {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.category-toggle-right span {
  font-size: 0.72rem;
  background-color: #f1f5f9;
  color: #475569;
  border-radius: 999px;
  padding: 0.15rem 0.45rem;
}

.category-toggle-right svg {
  color: #64748b;
  transition: transform 0.2s ease;
}

.category-toggle-right svg.rotated {
  transform: rotate(180deg);
}

.category-pages {
  display: flex;
  flex-direction: column;
}

.page-link {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0.7rem;
  background-color: transparent;
  padding: 0.52rem 0.58rem;
  display: inline-flex;
  align-items: flex-start;
  gap: 0.45rem;
  color: #334155;
  font-size: 0.95rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.22s ease;
}

.page-link:hover {
  background-color: #eff6ff;
  border-color: #bfdbfe;
  transform: translateX(2px);
}

.page-link.active {
  background: linear-gradient(90deg, #dbeafe 0%, #eff6ff 100%);
  border-color: #93c5fd;
  color: #1d4ed8;
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.welcome-link {
  font-weight: 600;
}

.support-cta {
  margin-top: 0.95rem;
  width: 100%;
  border: 1px solid #dbeafe;
  border-radius: 0.75rem;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
  font-size: 0.86rem;
  padding: 0.62rem 0.7rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
}

.support-cta:hover {
  background-color: #dbeafe;
}

.help-article {
  padding: 1.25rem 1.35rem;
  min-height: 640px;
}

.article-feedback {
  min-height: 320px;
  border: 1px dashed #d1d5db;
  border-radius: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  gap: 0.45rem;
}

.article-error {
  border-color: #fecaca;
  color: #b91c1c;
  background-color: #fef2f2;
}

.article-card {
  width: 100%;
  max-width: none;
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.7rem;
}

.article-meta-line {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #64748b;
  font-size: 0.78rem;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.18rem 0.5rem;
  background-color: #f8fafc;
  color: #0f172a;
  font-weight: 600;
  font-size: 0.72rem;
}

.share-btn {
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  border-radius: 0.65rem;
  padding: 0.42rem 0.58rem;
  color: #334155;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.share-btn:hover {
  border-color: #93c5fd;
  color: #1d4ed8;
  background-color: #eff6ff;
}

.article-card h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.25rem);
  line-height: 1.13;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.share-feedback {
  margin: 0.55rem 0 0 0;
  color: #1d4ed8;
  font-size: 0.82rem;
}

.markdown-body {
  margin-top: 1rem;
  color: #334155;
  line-height: 1.75;
  font-size: 1rem;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  color: #0f172a;
  line-height: 1.2;
  margin-top: 1.35rem;
  margin-bottom: 0.55rem;
}

.markdown-body :deep(p) {
  margin: 0.74rem 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.3rem;
  margin: 0.7rem 0;
}

.markdown-body :deep(li) {
  margin: 0.2rem 0;
}

.markdown-body :deep(a) {
  color: #2563eb;
}

.markdown-body :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.65rem 0.95rem;
  border-left: 3px solid #93c5fd;
  background-color: #eff6ff;
  color: #1e3a8a;
  border-radius: 0.55rem;
}

.markdown-body :deep(code) {
  background-color: #f1f5f9;
  border-radius: 0.35rem;
  padding: 0.1rem 0.32rem;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background-color: #0f172a;
  color: #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.9rem;
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 0.9rem;
  border: 1px solid #e5e7eb;
  margin: 1rem 0;
}

.article-nav {
  margin-top: 1.3rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}

.article-nav-btn {
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  border-radius: 0.85rem;
  padding: 0.55rem 0.65rem;
  color: #334155;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  text-align: left;
}

.article-nav-btn:hover:not(:disabled) {
  border-color: #93c5fd;
  background-color: #eff6ff;
}

.article-nav-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.article-nav-btn span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.article-nav-btn small {
  font-size: 0.72rem;
  color: #64748b;
}

.article-nav-btn strong {
  font-size: 0.8rem;
  color: #0f172a;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-nav-btn-next {
  justify-content: space-between;
}

.article-empty {
  min-height: 420px;
  border: 1px solid #dbeafe;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, #f8fbff 0%, #eef6ff 65%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.2rem;
}

.welcome-article-head {
  width: 100%;
}

.welcome-article-logo {
  width: 170px;
  height: auto;
  margin-top: 0.9rem;
}

.article-empty h2 {
  margin: 1rem 0 0.45rem;
  color: #0f172a;
  font-size: clamp(1.55rem, 2.8vw, 2.1rem);
  line-height: 1.18;
}

.article-empty p {
  margin: 0;
  color: #475569;
  max-width: 760px;
  line-height: 1.6;
}

.article-empty .welcome-stats {
  margin-top: 1rem;
  max-width: 520px;
}

.article-empty .welcome-stat-item {
  border-color: #bfdbfe;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.65rem 0.75rem;
}

.article-empty .welcome-stat-item strong {
  font-size: 1.35rem;
}

.article-empty .welcome-stat-item span {
  font-size: 0.78rem;
}

.article-empty-btn {
  margin-top: 0.92rem;
  border: 1px solid #bfdbfe;
  background-color: #eff6ff;
  border-radius: 0.7rem;
  color: #1d4ed8;
  font-weight: 600;
  min-height: 2.45rem;
  padding: 0.45rem 0.82rem;
  display: none;
  align-items: center;
  gap: 0.4rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1080px) {
  .mobile-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .help-layout {
    grid-template-columns: 1fr;
  }

  .help-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 120;
    width: min(90vw, 370px);
    height: 100dvh;
    max-height: none;
    border-radius: 0 1rem 1rem 0;
    background: #ffffff;
    box-shadow: 20px 0 45px rgba(15, 23, 42, 0.2);
    transform: translateX(-105%);
    transition: transform 0.26s ease;
  }

  .help-sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-mobile-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sidebar-mobile-head img {
    width: 118px;
    height: auto;
  }

  .close-mobile-menu {
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    border-radius: 0.65rem;
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #334155;
  }

  .help-article {
    min-height: 520px;
  }

  .welcome-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .article-empty-btn {
    display: inline-flex;
  }
}

@media (max-width: 760px) {
  .help-main {
    padding-top: 96px;
  }

  .container {
    padding: 0 1rem;
  }

  .mobile-toolbar {
    grid-template-columns: 1fr;
  }

  .welcome-actions {
    grid-template-columns: 1fr;
  }

  .article-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-meta-line {
    flex-wrap: wrap;
  }

  .article-nav {
    grid-template-columns: 1fr;
  }
}
</style>
