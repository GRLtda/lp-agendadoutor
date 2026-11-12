<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import QRCode from 'qrcode'
import { ArrowLeft, ArrowRight, Smartphone, Copy, Pause, Play, RotateCcw, X, Monitor, Circle } from 'lucide-vue-next'
import AppButton from '../src/components/global/AppButton.vue'
import { connectRemote, createSecret } from './remote'

const controller = new URLSearchParams(location.search).has('controle')
const fragment = location.hash.slice(1)
const validSecret = /^[a-f0-9]{64}$/.test(fragment)
const secret = validSecret ? fragment : createSecret()
if (!controller) history.replaceState(null, '', `${location.pathname}#${secret}`)
const invalidLink = controller && !validSecret
const frame = ref(null)
const pairOpen = ref(!controller)
const qr = ref('')
const relayConnected = ref(false)
const lastPeer = ref(0)
const tick = ref(Date.now())
const state = ref(null)
const receivedAt = ref(0)
const pending = ref(null)
const feedback = ref('')
const ready = ref(false)
const controlUrl = `${location.origin}/apresentacao/pdn?controle=1#${secret}`
let remote
let interval
let sequence = 0
const hostEpoch = Date.now()
let lastEpoch = 0
let lastSequence = -1
let lastAck = null
let lastPublished = ''
let heartbeat = 0
let wakeLock
const processed = new Set()
const storageKey = `pdn-state-${secret}`

const online = computed(() => tick.value - lastPeer.value < 6500)
const elapsed = computed(() => {
  if (!state.value) return 0
  return state.value.elapsed + (state.value.timer.running ? Math.max(0, tick.value - receivedAt.value) / 1000 : 0)
})
const remaining = computed(() => 600 - elapsed.value)
const status = computed(() => {
  if (invalidLink) return 'Abra o link gerado no computador'
  if (online.value) return controller ? 'Computador conectado' : 'Celular conectado'
  if (relayConnected.value) return controller ? 'Aguardando o computador' : 'Aguardando o celular'
  return 'Conectando à rede…'
})
const position = computed(() => state.value ? `Slide ${state.value.index + 1} de ${state.value.count}` : 'Aguardando apresentação')
const formatTime = seconds => {
  const total = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
const api = () => frame.value?.contentWindow?.presentation

function loadDeck() {
  ready.value = Boolean(api())
  if (!ready.value) return
  if (!controller) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      if (saved) api().restore(saved)
    } catch {}
    refreshHost()
    publishState()
  } else if (state.value) api().go(state.value.index, state.value.step)
}

function refreshHost() {
  if (!api()) return
  state.value = api().state()
  state.value.hostNow = Date.now()
  receivedAt.value = Date.now()
  try { localStorage.setItem(storageKey, JSON.stringify(state.value)) } catch {}
}

function publishState() {
  if (!remote || !state.value) return
  remote.send({ type: 'state', epoch: hostEpoch, sequence: ++sequence, state: state.value, ack: lastAck })
}

function handleMessage(message) {
  if (controller && message.type === 'state' && (message.epoch > lastEpoch || (message.epoch === lastEpoch && message.sequence > lastSequence))) {
    lastEpoch = message.epoch
    lastSequence = message.sequence
    lastPeer.value = Date.now()
    state.value = message.state
    receivedAt.value = Date.now()
    if (ready.value) {
      const current = api().state()
      if (current.index !== message.state.index || current.step !== message.state.step) api().go(message.state.index, message.state.step)
    }
    if (pending.value?.id === message.ack) {
      pending.value = null
      feedback.value = 'Comando confirmado no computador'
    }
  }
  if (!controller && message.type === 'hello') {
    lastPeer.value = Date.now()
    refreshHost()
    publishState()
  }
  if (!controller && message.type === 'command' && api()) {
    lastPeer.value = Date.now()
    const age = Date.now() - message.issuedAt
    if (!processed.has(message.commandId) && (age < -1500 || age >= 8000)) return
    if (!processed.has(message.commandId)) {
      processed.add(message.commandId)
      if (processed.size > 256) processed.delete(processed.values().next().value)
      try { localStorage.setItem(`${storageKey}-commands`, JSON.stringify([...processed])) } catch {}
      api().command(message.action)
    }
    lastAck = message.commandId
    refreshHost()
    publishState()
  }
}

function sendCommand(action) {
  if (!online.value || pending.value) return
  pending.value = { id: createSecret(), action, startedAt: Date.now(), issuedAt: state.value.hostNow + Date.now() - receivedAt.value, lastSent: 0 }
  feedback.value = 'Enviando comando…'
  retryCommand()
  requestWakeLock()
}

function retryCommand() {
  const command = pending.value
  if (!command || !remote) return
  if (Date.now() - command.startedAt > 5000) {
    pending.value = null
    feedback.value = 'Sem confirmação. Confira a conexão e tente novamente.'
    return
  }
  if (Date.now() - command.lastSent < 600) return
  command.lastSent = Date.now()
  remote.send({ type: 'command', commandId: command.id, issuedAt: command.issuedAt, action: command.action })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(controlUrl)
    feedback.value = 'Link do controle copiado'
  } catch {
    feedback.value = 'Selecione e copie o link abaixo'
  }
}

async function requestWakeLock() {
  try { if (!wakeLock || wakeLock.released) wakeLock = await navigator.wakeLock?.request('screen') } catch {}
}

function visibilityChanged() {
  if (document.visibilityState === 'visible') {
    requestWakeLock()
    if (controller) remote?.send({ type: 'hello' })
  }
}

function onKey(event) {
  if (event.target.closest('button, input, a') || event.ctrlKey || event.metaKey || event.altKey) return
  if (event.key === 'Escape') { pairOpen.value = false; return }
  if (!controller) return
  const actions = { ArrowRight: 'next', ArrowDown: 'next', PageDown: 'next', ' ': 'next', Enter: 'next', ArrowLeft: 'prev', ArrowUp: 'prev', PageUp: 'prev', Backspace: 'prev', t: 'timer', T: 'timer' }
  const action = actions[event.key]
  if (!action) return
  event.preventDefault()
  sendCommand(action)
}

onMounted(async () => {
  if (invalidLink) return
  if (!controller) {
    try { JSON.parse(localStorage.getItem(`${storageKey}-commands`) || '[]').forEach(id => processed.add(id)) } catch {}
  }
  if (!controller) qr.value = await QRCode.toDataURL(controlUrl, { width: 300, margin: 2, errorCorrectionLevel: 'M' })
  remote = await connectRemote(secret, handleMessage, connected => {
    relayConnected.value = connected
    if (connected && controller) remote?.send({ type: 'hello' })
  })
  interval = setInterval(() => {
    tick.value = Date.now()
    retryCommand()
    if (controller) {
      if (tick.value - heartbeat > 2000) { heartbeat = tick.value; remote.send({ type: 'hello' }) }
    } else if (ready.value) {
      refreshHost()
      const fingerprint = `${state.value.index}.${state.value.step}.${state.value.timer.running}.${state.value.timer.acc}`
      if (fingerprint !== lastPublished || tick.value - heartbeat > 1000) {
        lastPublished = fingerprint
        heartbeat = tick.value
        publishState()
      }
    }
  }, 150)
  document.addEventListener('visibilitychange', visibilityChanged)
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  remote?.close()
  wakeLock?.release()
  document.removeEventListener('visibilitychange', visibilityChanged)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <main v-if="controller" class="controller">
    <header><div><p class="eyebrow">Agenda Doutor · PDN</p><h1>Controle da apresentação</h1></div><Smartphone :size="24" /></header>
    <p class="connection" role="status"><Circle :size="10" :fill="online ? 'currentColor' : 'none'" />{{ status }}</p>
    <section class="timer-card" :class="{ overtime: remaining < 0 }" aria-label="Cronômetro da apresentação">
      <p>Tempo de apresentação</p><div class="elapsed">{{ formatTime(elapsed) }}</div>
      <div class="timer-meta"><span>{{ state?.timer.running ? 'Em andamento' : 'Pausado' }}</span><span>{{ remaining < 0 ? 'Excedido' : 'Restante' }} {{ formatTime(Math.abs(remaining)) }}</span></div>
      <progress :value="Math.min(elapsed, 600)" max="600" aria-label="Tempo decorrido da meta de dez minutos" />
      <div class="timer-actions">
        <AppButton variant="outline" size="lg" :disabled="!online || !!pending" @click="sendCommand('timer')"><Pause v-if="state?.timer.running" :size="18" /><Play v-else :size="18" />{{ state?.timer.running ? 'Pausar' : 'Iniciar' }}</AppButton>
        <AppButton variant="ghost" size="lg" :disabled="!online || !!pending" @click="sendCommand('reset')"><RotateCcw :size="18" />Zerar tempo</AppButton>
      </div>
    </section>
    <section class="slide-card">
      <div class="slide-heading"><span>{{ position }}</span><span v-if="state?.maxStep">Etapa {{ state.step }} de {{ state.maxStep }}</span></div>
      <h2>{{ state?.title || 'Abra a apresentação no computador' }}</h2>
      <iframe v-if="!invalidLink" ref="frame" class="preview" src="/apresentacao/pdn/deck.html?shot" title="Prévia do slide atual" tabindex="-1" @load="loadDeck" />
      <div class="navigation">
        <AppButton variant="outline" size="lg" :disabled="!online || !!pending || (state?.index === 0 && state?.step === 0)" @click="sendCommand('prev')"><ArrowLeft :size="22" />Voltar</AppButton>
        <AppButton variant="primary" size="lg" :disabled="!online || !!pending || (state?.index === state?.count - 1 && state?.step === state?.maxStep)" @click="sendCommand('next')">Avançar<ArrowRight :size="22" /></AppButton>
      </div>
      <p class="feedback" role="status">{{ feedback || 'Cada toque avança uma etapa da apresentação.' }}</p>
    </section>
    <details v-if="state?.notes" class="notes"><summary>Notas do apresentador</summary><div v-html="state.notes" /></details>
    <p class="hint">Mantenha esta página aberta e os dois aparelhos conectados à internet.</p>
  </main>

  <main v-else class="display">
    <iframe ref="frame" class="projection" src="/apresentacao/pdn/deck.html" title="Apresentação Agenda Doutor PDN" @load="loadDeck" />
    <AppButton class="pair-trigger" variant="outline" @click="pairOpen = true"><Smartphone :size="18" />Controle pelo celular</AppButton>
    <div v-if="pairOpen" class="pair-backdrop">
      <section class="pair-panel" role="dialog" aria-modal="true" aria-labelledby="pair-title">
        <div class="pair-heading"><Monitor :size="24" /><AppButton variant="ghost" aria-label="Fechar pareamento" @click="pairOpen = false"><X :size="22" /></AppButton></div>
        <p class="eyebrow">Agenda Doutor · PDN</p><h1 id="pair-title">Seu celular é o controle</h1>
        <p>Escaneie o QR code com a câmera do celular para avançar, voltar e acompanhar o tempo.</p>
        <img v-if="qr" :src="qr" class="qr" alt="QR code para abrir o controle desta apresentação">
        <p class="connection" role="status"><Circle :size="10" :fill="online ? 'currentColor' : 'none'" />{{ status }}</p>
        <AppButton variant="outline" size="lg" @click="copyLink"><Copy :size="18" />Copiar link do controle</AppButton>
        <input class="control-link" :value="controlUrl" readonly aria-label="Link privado do controle" @focus="$event.target.select()">
        <p class="feedback" role="status">{{ feedback }}</p>
        <AppButton variant="primary" size="lg" @click="pairOpen = false; requestWakeLock()">Mostrar apresentação<ArrowRight :size="18" /></AppButton>
        <p class="hint">Use F11 no computador para tela cheia. O tempo começa no primeiro avanço.</p>
      </section>
    </div>
  </main>
</template>
