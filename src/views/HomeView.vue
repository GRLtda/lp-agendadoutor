<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeConfirmStory from '@/components/home/HomeConfirmStory.vue'
import HomeFeatures from '@/components/home/HomeFeatures.vue'
import HomeBeforeAfter from '@/components/home/HomeBeforeAfter.vue'
import HomeFaq from '@/components/home/HomeFaq.vue'
import HomeFinalCta from '@/components/home/HomeFinalCta.vue'
import HomeStickyCta from '@/components/home/HomeStickyCta.vue'
import { useHomeMotion } from '@/composables/useHomeMotion'

// Narrativa da home: problema → transformação → solução → benefício.
// Documentação: docs/home.md
const root = ref(null)
// O header some enquanto a seção escura das funcionalidades ocupa o topo.
const headerHidden = ref(false)
useHomeMotion(root)
</script>

<template>
  <div ref="root" class="landing-page">
    <AppHeader :hidden="headerHidden" />

    <main>
      <HomeHero />
      <HomeConfirmStory />
      <HomeFeatures @cover-top="headerHidden = $event" />
      <HomeBeforeAfter />
      <HomeFaq />
      <HomeFinalCta />
    </main>

    <AppFooter />
    <HomeStickyCta />
  </div>
</template>

<style>
/* Tokens da home, derivados da identidade do Agenda Doutor (azul do logo,
   tinta #1C2035, DM Sans e cores de status do calendário do app). */
.landing-page {
  --ad-blue: #0057ff;
  --ad-blue-2: #1b69ff;
  --ad-ink: #1c2035;
  --ad-ink-soft: #475569;
  --ad-muted: #64748b;
  --ad-line: #e6ebf5;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Compatibilidade com o header e o rodapé compartilhados. */
  --primary: #2563eb;

  width: 100%;
  overflow-x: clip;
  font-family: var(--fonte-principal);
  color: var(--ad-ink);
  background: #ffffff;
}

.landing-page h1,
.landing-page h2,
.landing-page h3,
.landing-page h4 {
  font-family: var(--fonte-titulo);
}

</style>
