<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import logoWhatsapp from '@/assets/logo_whatsapp.svg'

// CTA fixo do celular. Some enquanto a abertura, o CTA final ou o rodapé
// estão visíveis, para não duplicar botões na tela nem cobrir o conteúdo.
const visible = ref(false)
let observer = null
const onScreen = new Set()

onMounted(() => {
  const targets = [...document.querySelectorAll('[data-hide-sticky], #footer')]
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) onScreen.add(entry.target)
      else onScreen.delete(entry.target)
    })
    visible.value = onScreen.size === 0
  })
  targets.forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="sticky-cta" :class="{ 'is-visible': visible }" :aria-hidden="!visible" :inert="!visible">
    <RouterLink to="/register" class="sc-main" data-track-click="sticky_register_comecar_agora">
      Começar agora <ArrowRight :size="17" />
    </RouterLink>
    <a
      href="https://wa.me/5511921923978"
      target="_blank"
      rel="noopener noreferrer"
      class="sc-wa"
      aria-label="Falar com a equipe pelo WhatsApp"
      data-track-click="sticky_whatsapp_fale_com_equipe"
    >
      <img :src="logoWhatsapp" alt="" width="20" height="20" />
    </a>
  </div>
</template>

<style scoped>
.sticky-cta { display: none; }

@media (max-width: 899px) {
  .sticky-cta {
    position: fixed;
    left: 0.75rem;
    right: 0.75rem;
    bottom: calc(0.75rem + env(safe-area-inset-bottom));
    z-index: 90;
    display: flex;
    gap: 0.5rem;
    padding: 0.4rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid rgba(28, 32, 53, 0.08);
    box-shadow: 0 20px 40px -18px rgba(28, 45, 90, 0.45);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    transform: translateY(140%);
    opacity: 0;
    transition: transform 0.45s var(--ease-out), opacity 0.3s;
  }
  .sticky-cta.is-visible { transform: none; opacity: 1; }
  .sc-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-height: 48px;
    border-radius: 999px;
    background: linear-gradient(180deg, #2f74ff 0%, var(--ad-blue) 100%);
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 10px 20px -10px rgba(0, 87, 255, 0.8);
  }
  .sc-wa {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #25d366;
  }
  .sc-wa img { filter: brightness(0) invert(1); }
  .sc-main:focus-visible, .sc-wa:focus-visible { outline: 2px solid var(--ad-ink); outline-offset: 2px; }
}

@media (max-width: 899px) and (prefers-reduced-motion: reduce) {
  .sticky-cta { transition: none; }
}
</style>
