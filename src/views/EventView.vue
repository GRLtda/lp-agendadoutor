<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, Minus, Plus } from 'lucide-vue-next'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'
import EventIntro from '@/components/event/EventIntro.vue'
import EventStory from '@/components/event/EventStory.vue'
import EventCountdown from '@/components/event/EventCountdown.vue'
import { useEventMotion } from '@/composables/useEventMotion'
import {
  eventConfig,
  eventRegisterUrl,
  appRegisterUrl,
  loadEventCampaign,
  trackEventVisit,
} from '@/config/event'

// Só existe com código: /evento/<codigo> (campanha criada no admin). /evento
// sozinho volta para a home (router e vercel.json). O HTML pré-renderizado é a
// casca sem campanha; código, nome, dias e prazo reais são aplicados depois da
// montagem (consulta pública à API da campanha).
const route = useRoute()
const root = ref(null)
const campaignCode = ref('')
const eventName = ref('')
const days = ref(eventConfig.trialDays)
const endsAt = ref(null)
// unknown: API indisponível (mantém a oferta) · open · ended
const offerState = ref('unknown')
const ended = computed(() => offerState.value === 'ended')

const registerUrl = computed(() => (ended.value ? appRegisterUrl() : eventRegisterUrl(campaignCode.value)))
const offer = computed(() => (days.value === 30 ? '1 mês grátis' : `${days.value} dias grátis`))
const validUntil = computed(() => (endsAt.value
  ? new Date(endsAt.value).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' })
  : ''))
const serial = computed(() => (campaignCode.value ? `#${campaignCode.value.replace(/-/g, '').slice(0, 10)}-${days.value}D` : ''))

useEventMotion(root)

onMounted(async () => {
  const fromPath = typeof route.params.code === 'string' ? route.params.code.trim().toLowerCase() : ''
  if (!fromPath) return
  campaignCode.value = fromPath
  trackEventVisit(campaignCode.value)

  const campaign = await loadEventCampaign(campaignCode.value)
  if (!campaign) return
  if (campaign.valid) {
    offerState.value = 'open'
    eventName.value = campaign.label || ''
    if (Number.isInteger(campaign.trialDays)) days.value = campaign.trialDays
    endsAt.value = campaign.endsAt || null
  } else {
    offerState.value = 'ended'
  }
})

function onExpired() {
  offerState.value = 'ended'
}

// CTA fixo no celular: aparece depois da abertura e some perto dos CTAs principais.
const showSticky = ref(false)
let observer = null
const visible = new Set()
onMounted(() => {
  const targets = root.value?.querySelectorAll('[data-sticky-hide]') || []
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)))
    showSticky.value = visible.size === 0
  }, { threshold: 0.15 })
  targets.forEach((el) => observer.observe(el))
})
onBeforeUnmount(() => observer?.disconnect())

const openFaq = ref(-1)
const faqItems = computed(() => [
  { question: 'Vou pagar alguma coisa hoje?', answer: `Não. Você cadastra o cartão, mas a primeira cobrança acontece somente ${days.value} dias depois da assinatura.` },
  { question: `O que acontece depois dos ${days.value} dias?`, answer: `A assinatura do plano escolhido começa automaticamente. A primeira fatura inclui a mensalidade e a taxa de instalação de ${eventConfig.installationFee}.` },
  { question: 'Posso cancelar durante o período grátis?', answer: 'Sim. Cancele quando quiser antes do fim do período e nada será cobrado. Não há fidelidade nem multa.' },
  { question: 'Posso escolher qualquer plano?', answer: 'Sim. O benefício vale para todos os planos disponíveis no cadastro.' },
  { question: 'Já tenho conta. Posso usar a oferta?', answer: 'A oferta é para novos cadastros feitos por esta página. Fale com a nossa equipe pelo WhatsApp se tiver dúvidas.' },
].map((item, index) => ({ ...item, open: openFaq.value === index })))

function toggleFaq(index) {
  openFaq.value = openFaq.value === index ? -1 : index
}

const manifesto = 'Você cuida dos pacientes. O Agenda Doutor ajuda a cuidar da sua operação.'
</script>

<template>
  <div ref="root" class="event-page">
    <AppHeader :register-href="registerUrl" />

    <main>
      <EventIntro
        data-intro
        data-sticky-hide
        :event-name="eventName"
        :days="days"
        :register-url="registerUrl"
        :valid-until="validUntil"
        :ended="ended"
        :serial="serial"
      />

      <section class="bridge">
        <p class="bridge-text">
          Seu tempo deveria estar com seus pacientes.<br />
          <span>Não com o que acontece em volta da consulta.</span>
        </p>
      </section>

      <EventStory />

      <section class="manifesto" aria-label="Agenda Doutor">
        <p class="manifesto-text" data-manifesto>
          <span v-for="(w, i) in manifesto.split(' ')" :key="i" class="w">{{ w + ' ' }}</span>
        </p>
      </section>

      <EventCountdown
        data-sticky-hide
        :ends-at="endsAt"
        :ended="ended"
        :days="days"
        :register-url="registerUrl"
        @expired="onExpired"
      />

      <section class="faq" aria-labelledby="faq-title">
        <div class="faq-inner">
          <h2 id="faq-title" class="section-title">Perguntas frequentes</h2>
          <div class="faq-list">
            <div v-for="(item, index) in faqItems" :key="item.question" class="faq-item" :class="{ open: item.open }">
              <button
                type="button"
                class="faq-question"
                :aria-expanded="item.open"
                :data-track-click="`event_lp_faq_${index + 1}`"
                @click="toggleFaq(index)"
              >
                <span>{{ item.question }}</span>
                <Minus v-if="item.open" :size="18" aria-hidden="true" />
                <Plus v-else :size="18" aria-hidden="true" />
              </button>
              <div class="faq-answer-wrap">
                <p class="faq-answer">{{ item.answer }}</p>
              </div>
            </div>
          </div>
          <p class="faq-help">
            Ainda com dúvida?
            <a :href="eventConfig.whatsappUrl" target="_blank" rel="noopener noreferrer" data-track-click="event_lp_whatsapp_faq">Fale com a equipe no WhatsApp</a>
          </p>
        </div>
      </section>

      <section class="final" data-sticky-hide>
        <div class="final-inner">
          <h2>Seu consultório não precisa de mais trabalho.<br /><span>Precisa de uma rotina mais inteligente.</span></h2>
          <a :href="registerUrl" class="cta-primary" data-track-click="event_lp_cta_final">
            <span>{{ ended ? 'Criar minha conta' : `Ativar meu ${offer === '1 mês grátis' ? 'mês grátis' : offer}` }}</span>
            <ArrowRight :size="18" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>

    <AppFooter />

    <Transition name="sticky">
      <div v-if="showSticky" class="sticky-cta">
        <div>
          <strong>{{ ended ? 'Conheça o Agenda Doutor' : offer }}</strong>
          <small>{{ ended ? 'Oferta encerrada' : 'Nada é cobrado hoje' }}</small>
        </div>
        <a :href="registerUrl" class="cta-primary cta-sm" data-track-click="event_lp_cta_sticky">
          <span>{{ ended ? 'Criar conta' : 'Ativar' }}</span>
          <ArrowRight :size="16" aria-hidden="true" />
        </a>
      </div>
    </Transition>
  </div>
</template>

<style>
/* Botão principal da campanha (usado também pelos componentes da página). */
.event-page .cta-primary {
  align-items: center;
  background: linear-gradient(180deg, #1b69ff 0%, #0057ff 100%);
  border-radius: 999px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 14px 30px -12px rgba(0, 87, 255, 0.65);
  color: #ffffff;
  display: inline-flex;
  font-size: 0.98rem;
  font-weight: 700;
  gap: 0.6rem;
  justify-content: center;
  letter-spacing: 0.02em;
  min-height: 56px;
  overflow: hidden;
  padding: 0 1.6rem 0 1.9rem;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s;
  -webkit-tap-highlight-color: transparent;
}

.event-page .cta-primary::after {
  background: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.35) 50%, transparent 70%);
  content: '';
  inset: 0;
  position: absolute;
  transform: translateX(-120%);
  transition: transform 0.7s ease;
}

.event-page .cta-primary svg {
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.event-page .cta-primary:hover {
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 18px 36px -12px rgba(0, 87, 255, 0.75);
  transform: translateY(-2px);
}

.event-page .cta-primary:hover::after { transform: translateX(120%); }
.event-page .cta-primary:hover svg { transform: translateX(4px); }
.event-page .cta-primary:active { transform: translateY(0) scale(0.98); }

.event-page .cta-primary:focus-visible {
  outline: 3px solid rgba(0, 87, 255, 0.35);
  outline-offset: 3px;
}

.event-page .cta-on-dark {
  box-shadow: 0 14px 34px -10px rgba(0, 87, 255, 0.8);
}

.event-page .cta-sm {
  font-size: 0.85rem;
  min-height: 44px;
  padding: 0 1rem 0 1.2rem;
}

@media (prefers-reduced-motion: reduce) {
  .event-page .cta-primary,
  .event-page .cta-primary::after,
  .event-page .cta-primary svg { transition: none; }
}
</style>

<style scoped>
.event-page {
  background: #ffffff;
  overflow-x: clip;
}

.bridge {
  padding: 4.5rem 1.25rem 1rem;
  text-align: center;
}

.bridge-text {
  color: #1c2035;
  font-size: clamp(1.4rem, 5.4vw, 2.3rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 0 auto;
  max-width: 760px;
}

.bridge-text span {
  color: #0057ff;
  font-weight: 500;
}

.manifesto {
  padding: 5rem 1.25rem;
}

.manifesto-text {
  color: #1c2035;
  font-size: clamp(1.75rem, 7vw, 3.4rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.12;
  margin: 0 auto;
  max-width: 900px;
}

.section-title {
  color: #1c2035;
  font-size: clamp(1.6rem, 5.5vw, 2.3rem);
  letter-spacing: -0.03em;
  margin: 0 0 0.5rem;
}

.faq-inner {
  margin: 0 auto;
  max-width: 980px;
}

.faq {
  padding: 4.5rem 1.25rem 3rem;
}

.faq-inner {
  max-width: 760px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.faq-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.faq-item.open {
  border-color: #c7d7fe;
  box-shadow: 0 12px 30px -20px rgba(0, 87, 255, 0.45);
}

.faq-question {
  align-items: center;
  background: none;
  border: none;
  color: #1c2035;
  cursor: pointer;
  display: flex;
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem 1.1rem;
  text-align: left;
  width: 100%;
}

.faq-question svg { color: #0057ff; flex-shrink: 0; }

.faq-question:focus-visible {
  border-radius: 14px;
  outline: 2px solid #0057ff;
  outline-offset: -2px;
}

/* Abre com altura animada sem medir em JS */
.faq-answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.faq-item.open .faq-answer-wrap { grid-template-rows: 1fr; }

.faq-answer {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0;
  overflow: hidden;
  padding: 0 1.1rem;
}

.faq-item.open .faq-answer { padding-bottom: 1.1rem; }

.faq-help {
  color: #64748b;
  font-size: 0.92rem;
  margin: 1.5rem 0 0;
  text-align: center;
}

.faq-help a { color: #0057ff; font-weight: 600; }

.final {
  padding: 1rem 1.25rem 5rem;
}

.final-inner {
  align-items: center;
  background: linear-gradient(180deg, #f6f8fc 0%, #eef3ff 100%);
  border: 1px solid #e3eafb;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin: 0 auto;
  max-width: 980px;
  padding: 3rem 1.5rem;
  text-align: center;
}

.final-inner h2 {
  color: #1c2035;
  font-size: clamp(1.5rem, 5.5vw, 2.4rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0;
}

.final-inner h2 span { color: #0057ff; font-weight: 600; }

.sticky-cta {
  align-items: center;
  /* Sem backdrop-filter: o blur refeito a cada frame travava o scroll das cenas */
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  bottom: calc(0.75rem + env(safe-area-inset-bottom));
  box-shadow: 0 18px 40px -18px rgba(28, 32, 53, 0.45);
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  left: 0.75rem;
  padding: 0.55rem 0.55rem 0.55rem 1rem;
  position: fixed;
  right: 0.75rem;
  z-index: 90;
}

.sticky-cta div { display: flex; flex-direction: column; }
.sticky-cta strong { color: #1c2035; font-size: 0.95rem; }
.sticky-cta small { color: #64748b; font-size: 0.75rem; }

.sticky-enter-active,
.sticky-leave-active { transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s; }
.sticky-enter-from,
.sticky-leave-to { opacity: 0; transform: translateY(120%); }

@media (min-width: 900px) {
  .sticky-cta { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .faq-answer-wrap { transition: none; }
}
</style>
