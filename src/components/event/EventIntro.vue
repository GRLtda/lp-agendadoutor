<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import logoDark from '@/assets/logo_dark.svg'
import logoBrand from '@/assets/logo_brand.svg'

// Abertura do evento: envelope da marca se abre e libera o ingresso com a oferta.
// A animação é CSS (começa antes da hidratação, sem depender do JS);
// o JS só adiciona a inclinação 3D do ingresso seguindo o ponteiro.
const props = defineProps({
  eventName: { type: String, required: true },
  days: { type: Number, required: true },
  registerUrl: { type: String, required: true },
  validUntil: { type: String, default: '' },
  ended: { type: Boolean, default: false },
  serial: { type: String, default: '' },
})

const offerTitle = computed(() => (props.days === 30 ? '1 mês grátis' : `${props.days} dias grátis`))
const stage = ref(null)
let frame = 0

function onPointerMove(event) {
  if (!stage.value || event.pointerType === 'touch') return
  const rect = stage.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    stage.value?.style.setProperty('--tilt-y', `${(x * 14).toFixed(2)}deg`)
    stage.value?.style.setProperty('--tilt-x', `${(-y * 10).toFixed(2)}deg`)
    stage.value?.style.setProperty('--shine-x', `${((x + 0.5) * 100).toFixed(1)}%`)
  })
}

function onPointerLeave() {
  stage.value?.style.setProperty('--tilt-y', '0deg')
  stage.value?.style.setProperty('--tilt-x', '0deg')
}

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('pointerleave', onPointerLeave)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section class="intro" aria-labelledby="ticket-title">
    <div class="intro-grid" aria-hidden="true"></div>

    <div ref="stage" class="intro-stage" data-intro-stage>
      <!-- Envelope (fundo com forro, bolso e aba). Desenho em SVG com a mesma
           proporção do envelope (146 × 100), então as curvas não distorcem. -->
      <div class="envelope" aria-hidden="true">
        <div class="env-back"><span class="env-liner"></span></div>
        <div class="env-front">
          <svg viewBox="0 0 146 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="env-side" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#eef3fd" />
              </linearGradient>
              <linearGradient id="env-bottom" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#fbfcff" />
                <stop offset="100%" stop-color="#f1f5fe" />
              </linearGradient>
              <filter id="env-fold" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="-0.6" stdDeviation="0.9" flood-color="#1c2035" flood-opacity="0.08" />
              </filter>
            </defs>
            <path class="env-side" d="M0 3 L62 51 Q73 60 62 67 L0 100 Z" fill="url(#env-side)" filter="url(#env-fold)" />
            <path class="env-side" d="M146 3 L84 51 Q73 60 84 67 L146 100 Z" fill="url(#env-side)" filter="url(#env-fold)" />
            <path class="env-bottom" d="M0 100 L59 64 Q73 55 87 64 L146 100 Z" fill="url(#env-bottom)" filter="url(#env-fold)" />
          </svg>
        </div>
        <div class="env-flap-wrap">
          <svg class="env-flap" viewBox="0 0 146 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="env-flap" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#0057ff" />
                <stop offset="100%" stop-color="#1b69ff" />
              </linearGradient>
            </defs>
            <path d="M0 11 Q0 0 11 0 L135 0 Q146 0 146 11 L85 57 Q73 66 61 57 Z" fill="url(#env-flap)" />
            <path d="M8 9 L67 53.5 Q73 58 79 53.5 L138 9" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="0.7" stroke-linecap="round" stroke-dasharray="2 2" />
          </svg>
        </div>
        <div class="env-seal">
          <span class="env-seal-ring"></span>
          <img :src="logoBrand" alt="" width="18" height="31" />
        </div>
      </div>

      <!-- Ingresso -->
      <div class="ticket-pos">
        <div class="ticket-float">
          <article class="ticket">
            <div class="ticket-main">
              <header class="ticket-top">
                <img :src="logoDark" alt="Agenda Doutor" width="79" height="32" />
                <span class="ticket-kind">Ingresso digital</span>
              </header>

              <p class="ticket-event">{{ eventName || ' ' }}</p>

              <h1 id="ticket-title" class="ticket-title">
                <span class="tt-small">Você ganhou</span>
                <span class="tt-big">{{ offerTitle }}</span>
                <span class="tt-small">do Agenda Doutor</span>
              </h1>

              <dl class="ticket-meta">
                <div>
                  <dt>Benefício</dt>
                  <dd>{{ days }} dias sem pagar</dd>
                </div>
                <div>
                  <dt>{{ ended ? 'Situação' : 'Resgate até' }}</dt>
                  <dd>{{ ended ? 'Encerrado' : validUntil || 'Tempo limitado' }}</dd>
                </div>
              </dl>
            </div>

            <div class="ticket-tear" aria-hidden="true"></div>

            <div class="ticket-stub">
              <div>
                <span class="stub-label">{{ ended ? 'Oferta encerrada' : 'Acesso liberado' }}</span>
                <span class="stub-code">{{ serial }}</span>
              </div>
              <span class="stub-bars" aria-hidden="true"></span>
            </div>

            <span class="ticket-shine" aria-hidden="true"></span>
          </article>
        </div>
      </div>
    </div>

    <div class="intro-actions">
      <a :href="registerUrl" class="cta-primary" data-track-click="event_lp_cta_hero">
        <span>{{ ended ? 'Criar minha conta' : 'Ativar meu mês grátis' }}</span>
        <ArrowRight :size="18" aria-hidden="true" />
      </a>
      <p class="intro-note">
        {{ ended ? 'O período promocional terminou.' : 'Leva 2 minutos. Nada é cobrado hoje.' }}
      </p>
    </div>

    <div class="scroll-hint" aria-hidden="true">
      <span></span>
    </div>
  </section>
</template>

<style scoped>
.intro {
  --tw: min(330px, 82vw, calc((100svh - 300px) / 1.32));
  --th: calc(var(--tw) * 1.32);
  --stage-bg: #f6f8fc;
  align-items: center;
  background: linear-gradient(180deg, #ffffff 0%, var(--stage-bg) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
  overflow: hidden;
  padding: 96px 1.25rem 2.5rem;
  position: relative;
}

/* Grade sutil, a mesma linguagem da home */
.intro-grid {
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.14) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.14) 1px, transparent 1px);
  background-size: 44px 44px;
  inset: 0;
  mask-image: linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%);
  pointer-events: none;
  position: absolute;
}

.intro-stage {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  --shine-x: 50%;
  height: var(--th);
  perspective: 1200px;
  position: relative;
  width: calc(var(--tw) * 1.08);
}

/* ---------- Envelope ---------- */
/* Sem transform no wrapper: as camadas do envelope se intercalam com o
   ingresso (fundo atrás, bolso e aba na frente) no mesmo contexto. */
.envelope {
  --ew: calc(var(--tw) * 1.08);
  --eh: calc(var(--tw) * 0.74);
  --er: calc(var(--tw) * 0.08);
  height: var(--eh);
  left: 0;
  position: absolute;
  top: calc((var(--th) - var(--eh)) / 2 + var(--th) * 0.14);
  width: var(--ew);
}

.env-back,
.env-front,
.env-flap-wrap,
.env-seal {
  animation:
    env-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both,
    env-out 0.65s cubic-bezier(0.55, 0, 0.75, 0.2) 1.95s forwards;
}

.env-back,
.env-front,
.env-flap-wrap {
  inset: 0;
  position: absolute;
}

.env-back {
  background: linear-gradient(180deg, #e7eefc 0%, #dbe5f8 100%);
  border-radius: var(--er);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 40px 70px -34px rgba(28, 45, 90, 0.5),
    0 14px 30px -20px rgba(0, 87, 255, 0.3);
  overflow: hidden;
  z-index: 1;
}

/* Forro interno com o padrão da marca, visível quando a aba abre */
.env-liner {
  background:
    radial-gradient(circle at 1px 1px, rgba(0, 87, 255, 0.22) 1px, transparent 1.6px) 0 0 / 11px 11px,
    linear-gradient(170deg, #f4f7ff 0%, #dfe8fd 100%);
  clip-path: polygon(0 0, 100% 0, 100% 3%, 50% 66%, 0 3%);
  inset: 0 0 auto;
  height: 100%;
  position: absolute;
}

/* Bolso: abas laterais e de baixo, com pontas arredondadas */
.env-front {
  border-radius: var(--er);
  overflow: hidden;
  z-index: 4;
}

.env-front svg,
.env-flap {
  display: block;
  height: 100%;
  overflow: visible;
  width: 100%;
}

.env-flap-wrap {
  animation:
    env-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both,
    flap-layer 0.55s linear 0.8s both,
    env-out 0.65s cubic-bezier(0.55, 0, 0.75, 0.2) 1.95s forwards;
  perspective: 900px;
  z-index: 5;
}

.env-flap {
  animation: flap-open 0.55s cubic-bezier(0.65, 0, 0.35, 1) 0.8s both;
  filter: drop-shadow(0 6px 10px rgba(0, 61, 184, 0.28));
  transform-origin: 50% 0;
}

/* Selo: lacre com anel, como uma carta especial */
.env-seal {
  align-items: center;
  animation:
    env-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both,
    seal-out 0.35s cubic-bezier(0.5, 0, 0.75, 0) 0.55s forwards;
  background: radial-gradient(circle at 35% 30%, #ffffff 0%, #f2f6ff 70%, #e3ebfd 100%);
  border-radius: 50%;
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.55),
    0 10px 22px -6px rgba(0, 61, 184, 0.55);
  display: flex;
  height: 54px;
  justify-content: center;
  left: calc(50% - 27px);
  position: absolute;
  top: calc(var(--eh) * 0.62 - 30px);
  width: 54px;
  z-index: 6;
}

.env-seal-ring {
  border: 1.5px dashed rgba(0, 87, 255, 0.35);
  border-radius: 50%;
  inset: 5px;
  position: absolute;
}

/* ---------- Ingresso ---------- */
/* O ingresso começa pequeno e inteiro dentro do envelope (entre o fundo e o
   bolso), sobe pela abertura e só depois passa para a frente e cresce. */
.ticket-pos {
  animation: ticket-emerge 1.8s linear 0.8s both;
  inset: 0 calc(var(--tw) * 0.04);
  position: absolute;
  z-index: 3;
}

.ticket-float {
  animation: ticket-float 6s ease-in-out 2.9s infinite;
  height: 100%;
  transform-style: preserve-3d;
}

.ticket {
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 28px 60px -24px rgba(28, 32, 53, 0.35),
    0 12px 24px -16px rgba(0, 87, 255, 0.25);
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ticket-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 7cqw 7.5cqw 5cqw;
}

.ticket-top {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.ticket-top img {
  height: auto;
  width: 24cqw;
}

.ticket-kind {
  border: 1px solid #dbe5ff;
  border-radius: 999px;
  color: #0057ff;
  font-size: 3.2cqw;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 1cqw 2.6cqw;
  text-transform: uppercase;
}

.ticket-event {
  color: #64748b;
  font-size: 3.8cqw;
  font-weight: 500;
  margin: 7cqw 0 0;
}

.ticket-title {
  color: #1c2035;
  display: flex;
  flex-direction: column;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 2.5cqw 0 0;
  text-transform: uppercase;
}

.tt-small {
  font-size: 6cqw;
  font-weight: 500;
  line-height: 1.15;
}

.tt-big {
  background: linear-gradient(180deg, #0057ff 0%, #1b69ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 15.5cqw;
  font-weight: 800;
  letter-spacing: -0.04em;
  /* Folga em cima: com background-clip: text, o acento de "MÊS" fora da caixa não é pintado */
  line-height: 1;
  margin: 0 0 0.6cqw;
  padding-top: 0.14em;
}

.ticket-meta {
  border-top: 1px solid #eef2f7;
  display: grid;
  gap: 4cqw;
  grid-template-columns: 1fr 1fr;
  margin: auto 0 0;
  padding-top: 4.5cqw;
}

.ticket-meta dt {
  color: #94a3b8;
  font-size: 3cqw;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ticket-meta dd {
  color: #1c2035;
  font-size: 4.2cqw;
  font-weight: 600;
  margin: 1cqw 0 0;
}

/* Picote com recortes laterais */
.ticket-tear {
  border-top: 2px dashed #dbe3f0;
  height: 0;
  margin: 0 6cqw;
  position: relative;
}

.ticket-tear::before,
.ticket-tear::after {
  background: var(--stage-bg);
  border-radius: 50%;
  content: '';
  height: 6cqw;
  position: absolute;
  top: calc(-3cqw - 1px);
  width: 6cqw;
}

.ticket-tear::before { left: -9cqw; }
.ticket-tear::after { right: -9cqw; }

.ticket-stub {
  align-items: center;
  background: linear-gradient(120deg, #0057ff 0%, #1b69ff 100%);
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  margin: 4cqw 3.5cqw 3.5cqw;
  border-radius: 14px;
  padding: 4.2cqw 5cqw;
}

.stub-label {
  display: block;
  font-size: 4.4cqw;
  font-weight: 700;
}

.stub-code {
  display: block;
  font-family: var(--fonte-mono);
  font-size: 3cqw;
  letter-spacing: 0.08em;
  margin-top: 0.8cqw;
  opacity: 0.8;
  text-transform: uppercase;
}

.stub-bars {
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0 2px, transparent 2px 4px, rgba(255, 255, 255, 0.9) 4px 5px, transparent 5px 8px);
  border-radius: 2px;
  height: 9cqw;
  opacity: 0.85;
  width: 20cqw;
}

/* Brilho que atravessa o ingresso quando ele chega e segue o ponteiro */
.ticket-shine {
  animation: shine-pass 1.2s ease 2.55s both;
  background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.55) 50%, transparent 65%);
  background-position: var(--shine-x) 0;
  background-size: 250% 100%;
  inset: 0;
  mix-blend-mode: soft-light;
  pointer-events: none;
  position: absolute;
}

/* ---------- Ações ---------- */
.intro-actions {
  align-items: center;
  animation: rise-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 2.55s both;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.75rem;
  position: relative;
  z-index: 2;
}

.intro-note {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.scroll-hint {
  animation: rise-in 0.6s ease 3.2s both;
  bottom: 1.1rem;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
}

.scroll-hint span {
  border: 1.5px solid #cbd5e1;
  border-radius: 999px;
  display: block;
  height: 30px;
  position: relative;
  width: 18px;
}

.scroll-hint span::after {
  animation: wheel 1.8s ease-in-out infinite;
  background: #0057ff;
  border-radius: 2px;
  content: '';
  height: 6px;
  left: calc(50% - 1.5px);
  position: absolute;
  top: 6px;
  width: 3px;
}

/* ---------- Keyframes ---------- */
@keyframes env-in {
  from { opacity: 0; transform: translateY(28px) scale(0.96); }
  to { opacity: 1; transform: none; }
}

@keyframes env-out {
  to { opacity: 0; transform: translateY(42%) scale(0.94); }
}

@keyframes seal-out {
  0% { transform: scale(1); opacity: 1; }
  45% { transform: scale(1.14); opacity: 1; }
  100% { transform: scale(0.2); opacity: 0; }
}

@keyframes flap-open {
  from { transform: rotateX(0deg); }
  to { transform: rotateX(178deg); }
}

/* Na metade da abertura a aba passa para trás do ingresso */
@keyframes flap-layer {
  0%, 49% { z-index: 5; }
  50%, 100% { z-index: 0; }
}

@keyframes ticket-emerge {
  0% {
    opacity: 0;
    transform: translateY(calc(var(--th) * 0.15)) scale(0.48);
    z-index: 3;
  }
  22% {
    opacity: 1;
    transform: translateY(calc(var(--th) * 0.15)) scale(0.48);
    animation-timing-function: cubic-bezier(0.45, 0, 0.2, 1);
  }
  58% {
    transform: translateY(calc(var(--th) * -0.25)) scale(0.5) rotateZ(1.5deg);
    z-index: 3;
    animation-timing-function: cubic-bezier(0.3, 0, 0.15, 1);
  }
  59% { z-index: 7; }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateZ(-1.2deg);
    z-index: 7;
  }
}

@keyframes ticket-float {
  0%, 100% { transform: translateY(0) rotateY(0deg); }
  50% { transform: translateY(-6px) rotateY(3deg); }
}

@keyframes shine-pass {
  from { background-position: 140% 0; }
  to { background-position: -40% 0; }
}

@keyframes rise-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

@keyframes wheel {
  0% { opacity: 0; transform: translateY(0); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translateY(9px); }
}

@media (min-width: 900px) {
  .intro {
    --tw: min(360px, calc((100svh - 320px) / 1.32));
  }
}

@media (prefers-reduced-motion: reduce) {
  .envelope { display: none; }
  .ticket-pos,
  .ticket-float,
  .ticket-shine,
  .intro-actions,
  .scroll-hint,
  .scroll-hint span::after {
    animation: none;
  }
  .ticket { transition: none; }
}
</style>
