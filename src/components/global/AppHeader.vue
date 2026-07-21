<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import AppButton from './AppButton.vue'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function scrollToSection(id) {
  // Se não estiver na home, vai para a home primeiro
  if (route.path !== '/') {
    router.push({ path: '/', hash: `#${id}` })
    return
  }

  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    if (isMobileMenuOpen.value) toggleMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="landing-header" :class="{ 'is-scrolled': isScrolled }">
      <div class="header-container">
        <div class="logo">
          <router-link to="/" data-track-click="header_logo">
            <img src="@/assets/logo_dark.svg" alt="Agenda Doutor" style="height: 32px;" />
          </router-link>
        </div>

        <nav class="desktop-nav">
          <a href="#funcionalidades" data-track-click="header_menu_funcionalidades" @click.prevent="scrollToSection('funcionalidades')">Funcionalidades</a>
          <a href="#beneficios" data-track-click="header_menu_beneficios" @click.prevent="scrollToSection('beneficios')">Benefícios</a>
          <a href="#faq" data-track-click="header_menu_faq" @click.prevent="scrollToSection('faq')">FAQ</a>
          <a href="#contato" data-track-click="header_menu_contato" @click.prevent="scrollToSection('footer')">Contato</a>
        </nav>

        <div class="header-actions">
          <AppButton to="/login" variant="ghost" size="md" data-track-click="header_login">Login</AppButton>
          <AppButton href="https://wa.me/5511921923978" variant="primary" size="md" data-track-click="header_whatsapp_comecar_agora" target="_blank" rel="noopener noreferrer">
            Começar agora
          </AppButton>
        </div>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" @click="toggleMobileMenu">
          <Menu v-if="!isMobileMenuOpen" />
          <X v-else />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <nav>
          <a href="#funcionalidades" data-track-click="mobile_menu_funcionalidades" @click="toggleMobileMenu()">Funcionalidades</a>
          <a href="#beneficios" data-track-click="mobile_menu_beneficios" @click="toggleMobileMenu()">Benefícios</a>
          <a href="#faq" data-track-click="mobile_menu_faq" @click="toggleMobileMenu()">FAQ</a>
          <div class="mobile-actions-list">
            <AppButton to="/login" variant="outline" size="lg" class="mobile-full" data-track-click="mobile_menu_login">Login</AppButton>
            <AppButton href="https://wa.me/5511921923978" variant="primary" size="lg" class="mobile-full" data-track-click="mobile_menu_whatsapp_comecar_agora" target="_blank" rel="noopener noreferrer">
              Começar agora
            </AppButton>
          </div>
        </nav>
      </div>
    </header>
</template>

<style scoped>
/* Header Styles moved from LandingView.vue */
.landing-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  z-index: 100;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(0px);
}
.landing-header.is-scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  height: 60px;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative; /* Context for absolute nav */
}
.logo { display: flex; align-items: center; gap: 0.75rem; font-weight: 700; font-size: 1.25rem; color: #0f172a; }

.desktop-nav { 
  display: flex; 
  gap: 2rem; 
  align-items: center; 
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.desktop-nav a { font-weight: 500; font-size: 0.95rem; color: #475569; position: relative; cursor: pointer; text-decoration: none; }
.desktop-nav a:hover { color: var(--primary); }

.header-actions { display: flex; align-items: center; gap: 0.75rem; }

.mobile-toggle { display: none; background: none; border: none; cursor: pointer; color: #0f172a; }

/* Mobile Menu */
.mobile-menu {
  position: absolute; top: 100%; left: 0; right: 0;
  background: white; padding: 2rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; gap: 1rem;
}
.mobile-menu nav > a { font-size: 1.1rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; display: block; text-decoration: none; color: #1e293b; }
.mobile-actions-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
.mobile-full { width: 100%; text-align: center; }

@media(max-width: 900px) {
  .desktop-nav, .header-actions { display: none; }
  .mobile-toggle { display: block; }
}
</style>
