<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

// Contador até o fim da campanha. O prazo vem da API (campo "Fim" da campanha
// no admin), então não reinicia ao recarregar; a API também recusa o benefício
// depois dele.
const props = defineProps({
  endsAt: { type: String, default: null },
  ended: { type: Boolean, default: false },
  days: { type: Number, required: true },
  registerUrl: { type: String, required: true },
})
const emit = defineEmits(['expired'])

const now = ref(0)
let timer = 0

const endTime = computed(() => (props.endsAt ? new Date(props.endsAt).getTime() : null))
const remaining = computed(() => (endTime.value && now.value ? Math.max(0, endTime.value - now.value) : null))
const isOver = computed(() => props.ended || remaining.value === 0)

const pad = (value) => String(value).padStart(2, '0')
const units = computed(() => {
  const ms = remaining.value
  if (ms === null) return [
    { label: 'dias', value: '--' }, { label: 'horas', value: '--' },
    { label: 'min', value: '--' }, { label: 'seg', value: '--' },
  ]
  const total = Math.floor(ms / 1000)
  return [
    { label: 'dias', value: pad(Math.floor(total / 86400)) },
    { label: 'horas', value: pad(Math.floor((total % 86400) / 3600)) },
    { label: 'min', value: pad(Math.floor((total % 3600) / 60)) },
    { label: 'seg', value: pad(total % 60) },
  ]
})

const deadlineLabel = computed(() => {
  if (!props.endsAt) return ''
  const date = new Date(props.endsAt)
  const day = date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: 'numeric', month: 'long' })
  const time = date.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })
  return `${day}, às ${time}`
})

const offer = computed(() => (props.days === 30 ? '1 mês grátis' : `${props.days} dias grátis`))

watch(isOver, (over) => { if (over && endTime.value) emit('expired') })

onMounted(() => {
  now.value = Date.now()
  timer = window.setInterval(() => { now.value = Date.now() }, 1000)
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <section class="countdown" data-countdown aria-labelledby="countdown-title">
    <div class="cd-light" aria-hidden="true"></div>
    <div class="cd-inner">
      <template v-if="!isOver">
        <span class="cd-kicker" data-cd-reveal>Tempo limitado</span>
        <h2 id="countdown-title" class="cd-title" data-cd-reveal>
          Seu presente está liberado.<br /><span>Mas não para sempre.</span>
        </h2>

        <template v-if="endsAt">
          <p class="cd-sub" data-cd-reveal>Resgate seu {{ offer }} até:</p>
          <p class="cd-deadline" data-cd-reveal>{{ deadlineLabel }}</p>

          <div class="cd-clock" role="timer" aria-live="off" :aria-label="`Faltam ${units[0].value} dias, ${units[1].value} horas e ${units[2].value} minutos`">
            <div v-for="unit in units" :key="unit.label" class="cd-unit" data-cd-unit>
              <div class="cd-digits">
                <span v-for="(digit, index) in unit.value.split('')" :key="index" class="cd-digit">
                  <Transition name="roll">
                    <span :key="digit">{{ digit }}</span>
                  </Transition>
                </span>
              </div>
              <span class="cd-label">{{ unit.label }}</span>
            </div>
          </div>
        </template>
        <p v-else class="cd-sub" data-cd-reveal>Exclusivo para quem está no evento. Ative enquanto ainda está aqui.</p>

        <a :href="registerUrl" class="cta-primary cta-on-dark" data-track-click="event_lp_cta_countdown" data-cd-reveal>
          <span>Garantir meu mês grátis</span>
          <ArrowRight :size="18" aria-hidden="true" />
        </a>
      </template>

      <template v-else>
        <span class="cd-kicker">Oferta encerrada</span>
        <h2 id="countdown-title" class="cd-title">O período do presente terminou.</h2>
        <p class="cd-sub">Você ainda pode conhecer o Agenda Doutor e organizar sua rotina.</p>
        <a :href="registerUrl" class="cta-primary cta-on-dark" data-track-click="event_lp_cta_countdown_ended">
          <span>Criar minha conta</span>
          <ArrowRight :size="18" aria-hidden="true" />
        </a>
      </template>
    </div>
  </section>
</template>

<style scoped>
.countdown {
  background: #1c2035;
  color: #ffffff;
  overflow: hidden;
  padding: 5rem 1.25rem;
  position: relative;
}

/* Iluminação: faixa do azul da marca que varre a seção com o scroll (--cd-light) */
.cd-light {
  --cd-light: 0;
  background: linear-gradient(115deg, transparent 20%, rgba(0, 87, 255, 0.35) 50%, transparent 80%);
  inset: -20% -40%;
  opacity: 0.9;
  pointer-events: none;
  position: absolute;
  transform: translateX(calc((var(--cd-light) - 0.5) * 60%));
}

.cd-inner {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 760px;
  position: relative;
  text-align: center;
}

.cd-kicker {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.8rem;
  text-transform: uppercase;
}

.cd-title {
  font-size: clamp(1.9rem, 7vw, 3.2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin: 1.1rem 0 1.25rem;
}

.cd-title span { color: #8fb4ff; }

.cd-sub {
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  margin: 0;
}

.cd-deadline {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0.3rem 0 1.75rem;
}

.cd-clock {
  display: grid;
  gap: 0.6rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 2rem;
  width: min(100%, 560px);
}

.cd-unit {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  padding: 0.9rem 0.25rem 0.7rem;
}

.cd-digits {
  display: flex;
  justify-content: center;
}

.cd-digit {
  display: inline-block;
  font-size: clamp(2rem, 11vw, 3.75rem);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  height: 1.1em;
  letter-spacing: -0.02em;
  line-height: 1.1;
  overflow: hidden;
  position: relative;
  width: 0.62em;
}

.cd-digit > span {
  display: block;
  inset: 0;
  position: absolute;
  text-align: center;
}

.cd-label {
  color: rgba(255, 255, 255, 0.6);
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-top: 0.2rem;
  text-transform: uppercase;
}

/* Rolagem do dígito: o novo entra de cima, o antigo sai por baixo */
.roll-enter-active,
.roll-leave-active {
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s;
}
.roll-enter-from { opacity: 0; transform: translateY(-70%); }
.roll-leave-to { opacity: 0; transform: translateY(70%); }

@media (min-width: 700px) {
  .cd-clock { gap: 1rem; }
  .cd-unit { padding: 1.2rem 0.5rem 0.9rem; }
}

@media (prefers-reduced-motion: reduce) {
  .roll-enter-active, .roll-leave-active { transition: none; }
}
</style>
