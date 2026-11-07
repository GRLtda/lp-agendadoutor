<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import FeatureScreen from './FeatureScreen.vue'
import AppSidebarMock from './AppSidebarMock.vue'

// Capítulos com tela fixa (sticky) no desktop: o mesmo "app" troca de tela a
// cada capítulo. No celular, cada capítulo traz a própria tela, sem prender o
// scroll. O capítulo ativo é o que cruza o meio da janela.
const chapters = [
  {
    kind: 'agenda',
    short: 'Agenda',
    nav: 'Calendário',
    path: 'calendario',
    kicker: 'Agenda inteligente',
    title: 'Sua semana inteira, clara em uma só tela.',
    text: 'Veja a agenda por semana ou mês, filtre por profissional e acompanhe o status de cada consulta pelas cores.',
    points: ['Visão de semana e mês', 'Filtro por profissional', 'Status: agendado, confirmado, realizado'],
  },
  {
    kind: 'whatsapp',
    short: 'WhatsApp',
    nav: 'Marketing',
    path: 'marketing/mensagens',
    kicker: 'Confirmação automática pelo WhatsApp',
    title: 'O lembrete sai sozinho. A confirmação chega na agenda.',
    text: 'Com o WhatsApp da clínica conectado, o paciente recebe lembretes 24 horas e 2 horas antes e responde ali mesmo.',
    points: ['Lembretes 24h e 2h antes', 'Modelos de mensagem editáveis', 'Status atualizado na agenda'],
  },
  {
    kind: 'prontuario',
    short: 'Prontuário',
    nav: 'Atendimentos',
    path: 'atendimentos',
    kicker: 'Prontuário digital',
    title: 'O histórico do paciente a um clique da consulta.',
    text: 'Registre o atendimento com editor de texto e modelos prontos, com procedimentos, termos e imagens do paciente no mesmo lugar.',
    points: ['Modelos prontos para o registro', 'Procedimentos, termos e imagens', 'Cronômetro do atendimento'],
  },
  {
    kind: 'financeiro',
    short: 'Financeiro',
    nav: 'Financeiro',
    path: 'financeiro',
    kicker: 'Gestão financeira',
    title: 'Receita, lucro e margem, sem planilha.',
    text: 'Acompanhe a evolução da receita, o desempenho por procedimento e o que entra e sai nos próximos dias.',
    points: ['Evolução da receita', 'Performance por procedimento', 'Entradas e saídas em 7 dias'],
  },
  {
    kind: 'anamnese',
    short: 'Anamnese',
    nav: 'Prontuário',
    path: 'anamneses',
    kicker: 'Anamnese online',
    title: 'O paciente responde antes. Você atende já sabendo.',
    text: 'Crie seus modelos de anamnese, envie ao paciente pelo WhatsApp e acompanhe as respostas pendentes.',
    points: ['Modelos personalizados', 'Envio pelo WhatsApp', 'Pendências no painel'],
  },
  {
    kind: 'marketing',
    short: 'Marketing',
    nav: 'Workflows',
    path: 'workflows',
    kicker: 'Automação de marketing',
    title: 'Relacionamento com o paciente, no automático.',
    text: 'Ative mensagens de aniversário, confirmação e lembrete, e monte fluxos com os Workflows.',
    points: ['Mensagem de aniversário', 'Mensagens por gatilho', 'Workflows de automação'],
  },
]


const titleWords = 'Tudo o que a sua clínica precisa, em uma só plataforma.'.split(' ')

const emit = defineEmits(['cover-top'])
const shellEl = ref(null)
let topObserver = null

const active = ref(0)
// Telas demonstrativas são decorativas: só existem no cliente e só no layout
// em uso (sticky no desktop, uma por capítulo no celular).
const layout = ref(null)
let desktopQuery = null
const syncLayout = () => { layout.value = desktopQuery.matches ? 'desktop' : 'mobile' }
const chapterEls = ref([])
let observer = null

function goTo(index) {
  const el = chapterEls.value[index]
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
}

onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 900px)')
  syncLayout()
  desktopQuery.addEventListener('change', syncLayout)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.value = Number(entry.target.dataset.index)
      })
    },
    { rootMargin: '-48% 0px -48% 0px' },
  )
  chapterEls.value.forEach((el) => observer.observe(el))

  // Avisa a home quando a seção escura cobre o topo da janela (o header some).
  topObserver = new IntersectionObserver(
    ([entry]) => emit('cover-top', entry.isIntersecting),
    { rootMargin: '0px 0px -92% 0px' },
  )
  if (shellEl.value) topObserver.observe(shellEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  topObserver?.disconnect()
  emit('cover-top', false)
  desktopQuery?.removeEventListener('change', syncLayout)
})
</script>

<template>
  <section id="funcionalidades" class="ft" data-features aria-labelledby="ft-title">
    <div ref="shellEl" class="ft-shell" data-ft-shell>
      <div class="ft-ambient" aria-hidden="true"><span></span><span></span></div>

      <header class="ft-intro">
        <span class="ft-kicker"><i></i> Funcionalidades</span>
        <h2 id="ft-title" class="ft-title" data-ft-words>
          <span v-for="(w, i) in titleWords" :key="i" class="w">{{ w + ' ' }}</span>
        </h2>
        <p>Do agendamento ao financeiro, cada parte da rotina conversa com a outra. Role e veja o sistema funcionando.</p>
      </header>

      <div class="ft-body">
        <ol class="ft-chapters">
          <li
            v-for="(c, i) in chapters"
            :key="c.kind"
            :ref="(el) => { if (el) chapterEls[i] = el }"
            class="ft-ch"
            :class="{ 'is-active': active === i }"
            :data-index="i"
          >
            <div class="ft-ch-text">
              <span class="ft-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="ft-ch-kicker">{{ c.kicker }}</span>
              <h3>{{ c.title }}</h3>
              <p>{{ c.text }}</p>
              <ul class="ft-points">
                <li v-for="p in c.points" :key="p"><Check :size="14" /> {{ p }}</li>
              </ul>
            </div>

            <div class="ft-mobile-device" aria-hidden="true">
              <div class="dev-bar"><i></i><i></i><i></i><span>app.agendadoutor.com/{{ c.path }}</span></div>
              <div class="ft-mobile-screen">
                <FeatureScreen v-if="layout === 'mobile'" :kind="c.kind" :active="active === i" />
              </div>
            </div>
          </li>
        </ol>

        <div class="ft-sticky">
          <div class="ft-device" aria-hidden="true">
            <div class="dev-bar">
              <i></i><i></i><i></i>
              <span class="dev-url">app.agendadoutor.com/<b :key="chapters[active].path">{{ chapters[active].path }}</b></span>
            </div>
            <div class="dev-body">
              <AppSidebarMock class="dev-side" :active="chapters[active].nav" />
              <div class="dev-screens">
                <div
                  v-for="(c, i) in chapters"
                  :key="c.kind"
                  class="dev-screen"
                  :class="{ 'is-shown': active === i, 'is-past': i < active }"
                >
                  <FeatureScreen v-if="layout === 'desktop'" :kind="c.kind" :active="active === i" />
                </div>
              </div>
            </div>
          </div>

          <nav class="ft-tabs" aria-label="Funcionalidades">
            <button
              v-for="(c, i) in chapters"
              :key="c.kind"
              type="button"
              class="ft-tab"
              :class="{ 'is-active': active === i }"
              :aria-current="active === i ? 'step' : undefined"
              @click="goTo(i)"
            >
              {{ c.short }}
            </button>
            <span class="ft-tab-ind" :style="{ '--i': active }" aria-hidden="true"></span>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ft { position: relative; background: var(--ft-outer, #ffffff); }

.ft-shell {
  position: relative;
  isolation: isolate;
  overflow: clip;
  background:
    radial-gradient(ellipse 60% 40% at 80% 0%, rgba(27, 105, 255, 0.22), transparent 70%),
    radial-gradient(ellipse 50% 30% at 10% 100%, rgba(0, 87, 255, 0.16), transparent 70%),
    linear-gradient(180deg, #0a1024 0%, #070b1a 45%, #060915 100%);
  color: #e8edf7;
}
.ft-ambient { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.ft-ambient span:first-child {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(180deg, transparent, #000 12%, #000 85%, transparent);
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 12%, #000 85%, transparent);
}

.ft-intro {
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(5rem, 14vh, 9rem) 1.5rem clamp(2rem, 6vh, 4rem);
  text-align: center;
}
.ft-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(0, 87, 255, 0.16);
  border: 1px solid rgba(91, 139, 247, 0.3);
  color: #8fb5ff;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.ft-kicker i { width: 7px; height: 7px; border-radius: 50%; background: #5b8bf7; box-shadow: 0 0 0 4px rgba(0, 87, 255, 0.2); }
.ft-title {
  margin: 1.3rem 0 1.2rem;
  color: #f5f7fb;
  font-size: clamp(2.3rem, 5.2vw, 4.4rem);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.04em;
}
.ft-intro p { max-width: 36rem; margin: 0 auto; color: rgba(226, 232, 240, 0.7); font-size: 1.1rem; line-height: 1.6; }

.ft-body {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem clamp(4rem, 12vh, 8rem);
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(2rem, 4vw, 4.5rem);
}

/* Capítulos */
.ft-chapters { margin: 0; padding: 0; list-style: none; }
.ft-ch {
  min-height: 82vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0.28;
  transition: opacity 0.5s var(--ease-out);
}
.ft-ch.is-active { opacity: 1; }
.ft-ch:first-child { min-height: 70vh; }
.ft-ch:last-child { min-height: 100vh; }
.ft-ch-text { position: relative; padding-left: 1.4rem; }
.ft-ch-text::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.3rem;
  bottom: 0.3rem;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--ad-blue-2), rgba(0, 87, 255, 0.1));
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.7s var(--ease-out);
}
.ft-ch.is-active .ft-ch-text::before { transform: none; }
.ft-num { display: block; color: #5b8bf7; font-family: var(--fonte-mono); font-size: 0.85rem; margin-bottom: 0.4rem; }
.ft-ch-kicker { display: block; color: #8fb5ff; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.6rem; }
.ft-ch h3 {
  margin: 0 0 0.9rem;
  color: #f5f7fb;
  font-size: clamp(1.6rem, 2.4vw, 2.2rem);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.025em;
}
.ft-ch p { margin: 0 0 1.2rem; color: rgba(226, 232, 240, 0.72); font-size: 1.02rem; line-height: 1.6; }
.ft-points { display: flex; flex-direction: column; gap: 0.5rem; margin: 0; padding: 0; list-style: none; }
.ft-points li { display: flex; align-items: center; gap: 0.55rem; color: rgba(226, 232, 240, 0.88); font-size: 0.94rem; }
.ft-points svg { flex: none; padding: 2px; border-radius: 50%; background: rgba(0, 87, 255, 0.28); color: #a9c6ff; box-sizing: content-box; }
.ft-points li { opacity: 0.6; transform: translateX(-6px); transition: opacity 0.5s, transform 0.5s var(--ease-out); }
.ft-ch.is-active .ft-points li { opacity: 1; transform: none; }
.ft-ch.is-active .ft-points li:nth-child(2) { transition-delay: 0.08s; }
.ft-ch.is-active .ft-points li:nth-child(3) { transition-delay: 0.16s; }

/* Dispositivo fixo */
.ft-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.1rem;
  padding-top: 60px;
}
.ft-device {
  position: relative;
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 60px 120px -40px rgba(0, 0, 0, 0.8),
    0 30px 80px -40px rgba(0, 87, 255, 0.55);
}
.dev-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-bottom: 1px solid #eef1f6;
  background: #fbfcfe;
}
.dev-bar i { width: 9px; height: 9px; border-radius: 50%; background: #e3e7ef; }
.dev-bar > span {
  margin: 0 auto;
  padding: 3px 14px;
  border-radius: 6px;
  background: #f1f4f9;
  color: #8a94a8;
  font-size: 0.66rem;
  font-family: var(--fonte-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}
.dev-url b { color: var(--ad-blue); font-weight: 500; display: inline-block; animation: url-in 0.4s var(--ease-out); }

.dev-body { display: grid; grid-template-columns: 150px 1fr; aspect-ratio: 16 / 10.4; }
.dev-side { --sbm-size: 9.6px; }

.dev-screens { position: relative; overflow: hidden; }
.dev-screen {
  position: absolute;
  inset: 0;
  opacity: 0;
  clip-path: inset(100% 0 0 0);
  transform: translateY(24px);
  transition: clip-path 0.75s var(--ease-in-out), transform 0.75s var(--ease-out), opacity 0.4s;
  pointer-events: none;
}
.dev-screen.is-past { clip-path: inset(0 0 100% 0); transform: translateY(-24px); }
.dev-screen.is-shown { opacity: 1; clip-path: inset(0 0 0 0); transform: none; }

/* Abas */
.ft-tabs {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.ft-tab {
  position: relative;
  z-index: 1;
  padding: 0.55rem 0.4rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(226, 232, 240, 0.6);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
}
.ft-tab:hover { color: #fff; border-color: transparent; }
.ft-tab.is-active { color: #fff; }
.ft-tab:focus-visible { outline: 2px solid #8fb5ff; outline-offset: 2px; }
.ft-tab-ind {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 6);
  border-radius: 999px;
  background: linear-gradient(180deg, #2f74ff, var(--ad-blue));
  box-shadow: 0 6px 18px -6px rgba(0, 87, 255, 0.8);
  transform: translateX(calc(var(--i) * 100%));
  transition: transform 0.55s var(--ease-out);
}

.ft-mobile-device { display: none; }

@keyframes url-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

@media (max-width: 899px) {
  .ft-intro { padding-top: 5rem; text-align: left; }
  .ft-intro p { margin: 0; font-size: 1rem; }
  .ft-title { font-size: clamp(2.1rem, 9vw, 2.8rem); }
  .ft-body { grid-template-columns: minmax(0, 1fr); padding-bottom: 4rem; }
  .ft-sticky { display: none; }
  .ft-ch, .ft-ch:first-child, .ft-ch:last-child { min-height: 0; opacity: 1; padding: 2.2rem 0; }
  .ft-ch + .ft-ch { border-top: 1px solid rgba(255, 255, 255, 0.07); }
  .ft-ch-text::before { transform: none; opacity: 0.6; }
  .ft-ch.is-active .ft-ch-text::before { opacity: 1; }
  .ft-points li { opacity: 1; transform: none; }
  .ft-mobile-device {
    display: block;
    margin-top: 1.6rem;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 30px 60px -30px rgba(0, 87, 255, 0.55);
    transform: translateY(14px) scale(0.98);
    opacity: 0.6;
    transition: transform 0.6s var(--ease-out), opacity 0.6s;
  }
  .ft-ch.is-active .ft-mobile-device { transform: none; opacity: 1; }
  .ft-mobile-screen { aspect-ratio: 4 / 3.3; }
}

@media (prefers-reduced-motion: reduce) {
  .ft-ch, .ft-ch-text::before, .ft-points li, .dev-screen, .ft-tab-ind, .ft-mobile-device { transition: none !important; }
  .dev-url b { animation: none; }
}
</style>
