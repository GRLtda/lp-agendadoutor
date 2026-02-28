<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ArrowRight, BookOpen, HelpCircle, Mail } from 'lucide-vue-next'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'
import gsap from 'gsap'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL || 'https://api.agendadoutor.com'

const categories = ref([])
const searchQuery = ref('')
const loading = ref(true)
const error = ref(null)

const iconMap = {
  HelpCircle: '❓', Users: '👥', Calendar: '📅', Settings: '⚙️',
  CreditCard: '💳', UserCircle: '👤', BookOpen: '📖', Zap: '⚡',
  Shield: '🛡️', Star: '⭐', Bell: '🔔', FileText: '📄',
}

onMounted(async () => {
  // Anima hero imediatamente (elementos estáticos, sempre no DOM)
  animateHero()

  try {
    const res = await fetch(`${apiUrl}/v1/help-center/categories`)
    if (!res.ok) throw new Error('Erro ao carregar categorias')
    categories.value = await res.json()
  } catch (err) {
    console.error('[HelpCenter] Erro:', err)
    error.value = 'Não foi possível carregar a central de ajuda.'
  } finally {
    loading.value = false
    // Aguarda Vue renderizar os cards (v-if muda, DOM precisa atualizar)
    await nextTick()
    await nextTick()
    animateContent()
  }
})

function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('.hc-badge', {
    opacity: 0, y: 20, duration: 0.6,
  })
  .from('.hc-title', {
    opacity: 0, y: 30, duration: 0.7,
  }, '-=0.3')
  .from('.hc-subtitle', {
    opacity: 0, y: 20, duration: 0.5,
  }, '-=0.4')
  .from('.hc-search-wrapper', {
    opacity: 0, y: 25, scale: 0.98, duration: 0.6,
  }, '-=0.3')
}

function animateContent() {
  const cards = document.querySelectorAll('.hc-category-card')
  const support = document.querySelector('.hc-support-section')

  if (cards.length > 0) {
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
    )
  }

  if (support) {
    gsap.fromTo(support,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, delay: cards.length > 0 ? 0.3 : 0, ease: 'power3.out' }
    )
  }
}

function handleSearch() {
  if (!searchQuery.value.trim()) return
  router.push({ path: '/ajuda/busca', query: { q: searchQuery.value.trim() } })
}

function goToCategory(slug) {
  router.push(`/ajuda/${slug}`)
}

function getIcon(icon) {
  return iconMap[icon] || '📄'
}
</script>

<template>
  <div class="hc-page">
    <AppHeader />

    <!-- Hero -->
    <section class="hc-hero">
      <div class="hc-hero-bg"></div>
      <div class="hc-hero-content">
        <div class="hc-badge">
          <BookOpen :size="14" />
          <span>Base de Conhecimento</span>
        </div>
        <h1 class="hc-title">Como podemos te ajudar?</h1>
        <p class="hc-subtitle">Pesquise entre nossos tutoriais e guias para tirar suas dúvidas.</p>

        <div class="hc-search-wrapper">
          <form class="hc-search-form" @submit.prevent="handleSearch">
            <Search :size="20" class="hc-search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar artigos, tutoriais..."
              class="hc-search-input"
            />
            <button type="submit" class="hc-search-btn">
              <ArrowRight :size="18" />
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="hc-content">
      <div class="hc-container">
        <!-- Loading -->
        <div v-if="loading" class="hc-loading">
          <div class="hc-spinner"></div>
          <p>Carregando artigos...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="hc-error">
          <HelpCircle :size="40" />
          <p>{{ error }}</p>
          <button @click="$router.go(0)" class="hc-retry-btn">Tentar novamente</button>
        </div>

        <!-- Categories -->
        <template v-else>
          <div v-if="categories.length > 0" class="hc-categories-grid">
            <button
              v-for="cat in categories"
              :key="cat._id"
              class="hc-category-card"
              @click="goToCategory(cat.slug)"
            >
              <div class="hc-card-icon-wrapper">
                <span class="hc-card-icon">{{ getIcon(cat.icon) }}</span>
              </div>
              <div class="hc-card-body">
                <h3 class="hc-card-title">{{ cat.name }}</h3>
                <p v-if="cat.description" class="hc-card-desc">{{ cat.description }}</p>
              </div>
              <div class="hc-card-footer">
                <span class="hc-card-count">{{ cat.articleCount || 0 }} artigo{{ (cat.articleCount || 0) !== 1 ? 's' : '' }}</span>
                <ArrowRight :size="16" class="hc-card-arrow" />
              </div>
            </button>
          </div>

          <div v-else class="hc-empty">
            <BookOpen :size="40" />
            <p>Nenhuma categoria disponível no momento.</p>
          </div>
        </template>

        <!-- Support Section -->
        <div class="hc-support-section">
          <div class="hc-support-card">
            <div class="hc-support-icon">
              <Mail :size="24" />
            </div>
            <div class="hc-support-info">
              <h3>Não encontrou o que procurava?</h3>
              <p>Nossa equipe está pronta para te ajudar com qualquer dúvida.</p>
            </div>
            <a href="mailto:suporte@agendadoutor.com" class="hc-support-btn">
              Falar com suporte
            </a>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesRegular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesMedium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesSemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesLight.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

.hc-page {
  font-family: 'Oakes', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1e293b;
  background-color: #f8fafc;
  overflow-x: hidden;
  --primary: #2563eb;
  --primary-dark: #1e40af;
  min-height: 100vh;
}

/* Hero */
.hc-hero {
  position: relative;
  padding-top: 160px;
  padding-bottom: 5rem;
  text-align: center;
  overflow: hidden;
}

.hc-hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 70% at 50% 20%, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.hc-hero-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(37, 99, 235, 0.08);
  color: var(--primary);
  padding: 0.4rem 1rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
}

.hc-title {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 300;
  color: #0f172a;
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.hc-subtitle {
  font-size: 1.05rem;
  color: #64748b;
  margin: 0 0 2.5rem 0;
  line-height: 1.6;
}

/* Search */
.hc-search-wrapper {
  max-width: 520px;
  margin: 0 auto;
}

.hc-search-form {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 0.375rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02);
}

.hc-search-form:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
}

.hc-search-icon {
  margin-left: 0.875rem;
  color: #94a3b8;
  flex-shrink: 0;
}

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
  border-radius: 12px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.hc-search-btn:hover { background: var(--primary-dark); }

/* Content */
.hc-content {
  padding-bottom: 4rem;
}

.hc-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Categories Grid */
.hc-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.hc-category-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hc-category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.hc-category-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-3px);
}

.hc-category-card:hover::before {
  transform: scaleX(1);
}

.hc-card-icon-wrapper {
  margin-bottom: 1rem;
}

.hc-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 1.5rem;
  transition: background 0.3s;
}

.hc-category-card:hover .hc-card-icon {
  background: #eff6ff;
}

.hc-card-body {
  flex: 1;
  margin-bottom: 1.25rem;
}

.hc-card-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 0.375rem;
  color: #0f172a;
}

.hc-card-desc {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hc-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.hc-card-count {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.hc-card-arrow {
  color: #cbd5e1;
  transition: all 0.3s;
}

.hc-category-card:hover .hc-card-arrow {
  color: var(--primary);
  transform: translateX(3px);
}

/* Support Section */
.hc-support-section {
  margin-top: 3rem;
}

.hc-support-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem 2rem;
}

.hc-support-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: #f1f5f9;
  border-radius: 14px;
  color: #64748b;
  flex-shrink: 0;
}

.hc-support-info {
  flex: 1;
}

.hc-support-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #0f172a;
}

.hc-support-info p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.hc-support-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.5rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 99px;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.hc-support-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

/* States */
.hc-loading, .hc-error, .hc-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #64748b;
}

.hc-loading p, .hc-error p, .hc-empty p {
  margin-top: 1rem;
}

.hc-spinner {
  width: 32px;
  height: 32px;
  border: 2.5px solid #e2e8f0;
  border-top-color: var(--primary);
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.hc-retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.25rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 99px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.hc-retry-btn:hover { background: var(--primary-dark); }

/* Responsive */
@media (max-width: 768px) {
  .hc-hero { padding-top: 130px; padding-bottom: 3rem; }
  .hc-title { font-size: 1.75rem; }
  .hc-categories-grid { grid-template-columns: 1fr; }
  .hc-support-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hc-hero { padding-top: 110px; padding-bottom: 2rem; }
  .hc-categories-grid { gap: 0.75rem; }
}
</style>
