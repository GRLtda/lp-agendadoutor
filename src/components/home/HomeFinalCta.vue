<script setup>
import { ArrowRight, Check, CheckCheck, ClipboardCheck } from 'lucide-vue-next'
import AppButton from '@/components/global/AppButton.vue'

// Fechamento: o cartão azul se expande com o scroll (máscara), o símbolo da
// marca é desenhado em traço e as palavras do título sobem em sequência.
const words = 'Pronto para ter uma rotina mais leve?'.split(' ')
</script>

<template>
  <section class="fc" data-final-cta data-hide-sticky aria-labelledby="fc-title">
    <div class="fc-card" data-fc-card>
      <div class="fc-art" aria-hidden="true">
        <span class="fc-ring r1"></span>
        <span class="fc-ring r2"></span>
        <svg class="fc-mark" viewBox="0 0 120 209" fill="none">
          <path data-fc-path pathLength="1" d="M60.326 208.097C27.1176 208.242 0.0722656 181.414 0.0722656 148.278C0.0722656 134.792 4.64024 121.741 12.9786 111.155L15.0088 108.834C15.2263 108.617 15.5164 108.327 15.7339 108.109L74.8275 42.5625C84.1085 50.9009 84.9061 65.1849 76.5677 74.3933L31.9756 123.843C26.03 130.587 22.7671 139.288 22.7671 148.278C22.7671 168.943 39.8064 185.837 60.6161 185.475C81.0632 185.112 97.3774 168.146 97.3774 147.698V132.182C97.3774 119.711 107.456 109.632 120 109.632V147.553C119.927 180.689 93.3895 207.952 60.326 208.097Z" />
          <path data-fc-path pathLength="1" d="M107.021 96.8707V97.0157L45.3172 165.463C36.0363 157.124 35.2387 142.84 43.577 133.632L88.1692 84.1818C94.1148 77.4386 97.3776 68.6652 97.3776 59.7468C97.3776 39.0822 80.3384 22.1879 59.5287 22.5504C38.9365 22.8405 22.6224 39.8797 22.6224 60.3269V75.8435C22.6224 88.3148 12.5438 98.3933 0 98.3933V60.4719C0.0725075 27.4809 26.6103 0.1456 59.6012 0.00058514C92.8097 -0.14443 119.855 26.6834 119.855 59.8193C119.927 73.3057 115.36 86.3571 107.021 96.8707Z" />
        </svg>
        <span class="fc-chip c1"><Check :size="12" /> Consulta confirmada</span>
        <span class="fc-chip c2"><ClipboardCheck :size="12" /> Anamnese respondida</span>
        <span class="fc-chip c3"><CheckCheck :size="12" /> Lembrete enviado</span>
      </div>

      <div class="fc-copy">
        <span class="fc-kicker">Agenda Doutor</span>
        <h2 id="fc-title" class="fc-title" data-fc-title>
          <template v-for="(w, i) in words" :key="i"><span class="wm"><span class="w">{{ w }}</span></span>{{ ' ' }}</template>
        </h2>
        <p class="fc-sub" data-fc-reveal>Descubra como o Agenda Doutor pode simplificar o dia a dia da sua clínica.</p>
        <div class="fc-ctas" data-fc-reveal>
          <AppButton to="/register" size="lg" class="fc-main" data-track-click="final_cta_register_comecar_agora">
            Começar agora <ArrowRight :size="18" />
          </AppButton>
          <AppButton href="https://wa.me/5511921923978" size="lg" class="fc-alt" target="_blank" rel="noopener noreferrer" data-track-click="final_cta_whatsapp_fale_com_equipe">
            Fale com nossa equipe
          </AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fc { padding: clamp(3rem, 8vh, 5rem) clamp(0.75rem, 2vw, 1.5rem); background: #eef4ff; }

.fc-card {
  position: relative;
  isolation: isolate;
  max-width: 1320px;
  min-height: min(78vh, 640px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.5rem, 6vw, 6rem);
  border-radius: 32px;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(ellipse 60% 80% at 85% 50%, rgba(255, 255, 255, 0.16), transparent 60%),
    radial-gradient(ellipse 40% 60% at 0% 100%, rgba(10, 16, 36, 0.35), transparent 70%),
    linear-gradient(135deg, #0047d6 0%, var(--ad-blue) 45%, var(--ad-blue-2) 100%);
  box-shadow: 0 60px 120px -60px rgba(0, 61, 184, 0.75);
}
.fc-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 80% at 80% 50%, #000, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 80% 50%, #000, transparent 75%);
}

.fc-art { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.fc-ring {
  position: absolute;
  top: 50%;
  right: 12%;
  width: 520px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  transform: translate(25%, -50%);
}
.fc-ring.r2 { width: 340px; border-color: rgba(255, 255, 255, 0.24); right: 17%; }
.fc-mark {
  position: absolute;
  top: 50%;
  right: 16%;
  height: 62%;
  transform: translateY(-50%);
  overflow: visible;
}
.fc-mark path {
  stroke: rgba(255, 255, 255, 0.7);
  stroke-width: 0.9;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  fill: rgba(255, 255, 255, 0.06);
}
.fc-chip {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--ad-ink);
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 20px 40px -20px rgba(10, 16, 36, 0.6);
  animation: chip-bob 6s ease-in-out infinite;
}
.fc-chip svg { color: var(--ad-blue); }
.c1 { top: 20%; right: 6%; }
.c1 svg { color: #eab308; }
.c2 { top: 52%; right: 30%; animation-delay: -2s; }
.c2 svg { color: #16a34a; }
.c3 { bottom: 16%; right: 9%; animation-delay: -4s; }
.c3 svg { color: #128c7e; }

.fc-copy { position: relative; max-width: 620px; }
.fc-kicker { display: inline-block; margin-bottom: 1.2rem; color: rgba(255, 255, 255, 0.75); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
.fc-title {
  margin: 0 0 1.3rem;
  color: #fff;
  font-size: clamp(2.4rem, 5.6vw, 4.8rem);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.045em;
}
.wm { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.08em; margin-bottom: -0.08em; }
.w { display: inline-block; }
.fc-sub { max-width: 30rem; margin: 0 0 2.2rem; color: rgba(255, 255, 255, 0.82); font-size: clamp(1.02rem, 1.4vw, 1.2rem); line-height: 1.6; }
.fc-ctas { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.fc-ctas :deep(.app-button) { height: 54px; padding: 0 1.7rem; border-radius: 999px; font-weight: 600; }
.fc-main { background: #ffffff !important; color: var(--ad-blue) !important; border-color: #fff !important; box-shadow: 0 18px 36px -18px rgba(10, 16, 36, 0.7); }
.fc-main:hover { transform: translateY(-2px); box-shadow: 0 24px 40px -18px rgba(10, 16, 36, 0.8); }
.fc-main :deep(svg) { transition: transform 0.25s var(--ease-out); }
.fc-main:hover :deep(svg) { transform: translateX(3px); }
.fc-alt { background: rgba(255, 255, 255, 0.1) !important; color: #fff !important; border-color: rgba(255, 255, 255, 0.35) !important; }
.fc-alt:hover { background: rgba(255, 255, 255, 0.18) !important; }
.fc-ctas :deep(.app-button:focus-visible) { outline-color: #fff; }

@keyframes chip-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

@media (max-width: 899px) {
  .fc-card { min-height: 0; align-items: flex-start; padding: 3rem 1.4rem 15rem; border-radius: 26px; }
  .fc-ring { top: auto; bottom: -160px; right: 50%; width: 380px; transform: translateX(50%); }
  .fc-ring.r2 { bottom: -70px; right: 50%; width: 220px; }
  .fc-mark { top: auto; bottom: 1.6rem; right: 50%; height: 150px; transform: translateX(50%); }
  .c1 { top: auto; bottom: 9.5rem; right: 1rem; }
  .c2 { top: auto; bottom: 5.5rem; right: auto; left: 1rem; }
  .c3 { bottom: 1.6rem; right: 1.2rem; }
  .fc-ctas { flex-direction: column; }
  .fc-ctas :deep(.app-button) { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .fc-chip { animation: none; }
}
</style>
