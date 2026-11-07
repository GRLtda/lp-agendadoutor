<script setup>
import {
  Bold,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Cloud,
  FileText,
  Image,
  Italic,
  List,
  Syringe,
  FileSignature,
  Send,
  User,
  Calendar,
  Cake,
  ClipboardCheck,
  CheckCircle,
  ArrowRight,
} from 'lucide-vue-next'
import whatsappBg from '@/assets/imgs/whatsapp_bg.jpg'

// Telas demonstrativas de cada funcionalidade, desenhadas com a mesma
// nomenclatura e cores do app. Medidas em em: o tamanho da fonte acompanha a
// largura do contêiner (container query), então a tela escala por inteiro.
// As animações só rodam enquanto `active` é verdadeiro.
defineProps({
  kind: { type: String, required: true },
  active: { type: Boolean, default: false },
})

const weekDays = ['SEG 13', 'TER 14', 'QUA 15', 'QUI 16', 'SEX 17']
const weekAppts = [
  { c: 1, s: 0, h: 2, n: 'Ana Luiza', st: 'realizado' },
  { c: 1, s: 3, h: 2, n: 'Bruno Lima', st: 'confirmado' },
  { c: 2, s: 1, h: 2, n: 'Eduardo B.', st: 'cancelado' },
  { c: 2, s: 4, h: 3, n: 'Fernanda B.', st: 'confirmado' },
  { c: 3, s: 0, h: 3, n: 'Helena M.', st: 'agendado' },
  { c: 3, s: 5, h: 2, n: 'Isabela R.', st: 'agendado' },
  { c: 4, s: 2, h: 2, n: 'Paula Prado', st: 'cancelado' },
  { c: 4, s: 5, h: 2, n: 'Rafael R.', st: 'confirmado' },
  { c: 5, s: 1, h: 3, n: 'Camila S.', st: 'agendado' },
  { c: 5, s: 4, h: 2, n: 'Viviane N.', st: 'emAtendimento' },
]
const slotTime = (s) => {
  const m = 8 * 60 + s * 30
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
}
const statusFilters = [
  { key: 'agendado', label: 'Agendado' },
  { key: 'confirmado', label: 'Confirmado' },
  { key: 'realizado', label: 'Realizado' },
  { key: 'cancelado', label: 'Cancelado', toggles: true },
  { key: 'emAtendimento', label: 'Em Atendimento' },
]

const revenue = [18, 24, 21, 30, 27, 36, 33, 42]

const templates = [
  { icon: CheckCircle, label: 'Confirmação do agendamento' },
  { icon: Calendar, label: '24 horas antes' },
  { icon: Clock, label: '2 horas antes' },
  { icon: Cake, label: 'Aniversário do paciente' },
  { icon: ClipboardCheck, label: 'Envio de anamnese' },
]
</script>

<template>
  <div class="fs" :class="[`fs-${kind}`, { 'is-active': active }]" aria-hidden="true">
    <!-- 1 · Agenda -->
    <div v-if="kind === 'agenda'" class="fs-wrap ag">
      <div class="ag-main">
        <div class="ag-top">
          <strong>13 – 17 de julho</strong>
          <span class="seg"><b>Semana</b><span>Mês</span></span>
        </div>
        <div class="ag-head">
          <span v-for="d in weekDays" :key="d">{{ d }}</span>
        </div>
        <div class="ag-grid">
          <span
            v-for="(a, i) in weekAppts"
            :key="i"
            class="ag-appt"
            :class="[`st-${a.st}`, `c-${a.c}`]"
            :style="{ '--c': a.c, '--s': a.s, '--h': a.h, '--i': i }"
          ><b>{{ a.n }}</b><small>{{ slotTime(a.s) }}</small></span>
        </div>
      </div>
      <aside class="ag-side">
        <small class="lbl">Profissionais</small>
        <span class="ag-select">Todos os profissionais <ChevronDown :size="10" /></span>
        <small class="lbl">Status</small>
        <span v-for="f in statusFilters" :key="f.key" class="ag-filter" :class="{ 'is-toggle': f.toggles }">
          <span class="ag-check"><Check :size="9" /></span>
          {{ f.label }}
          <i class="ag-dot" :class="`dot-${f.key}`"></i>
        </span>
      </aside>
    </div>

    <!-- 2 · WhatsApp -->
    <div v-else-if="kind === 'whatsapp'" class="fs-wrap wa">
      <div class="wa-chat">
        <header class="wa-head">
          <span class="wa-av">B</span>
          <div><strong>Bruno Lima</strong><small>online</small></div>
        </header>
        <div class="wa-body" :style="{ backgroundImage: `url(${whatsappBg})` }">
          <p class="wa-msg out m1">
            <span class="wa-auto">Mensagem automática</span>
            Olá, Bruno! Lembrete: sua consulta é amanhã, às 09:30. Responda <b>1</b> para confirmar.
            <small>18:00 <CheckCheck :size="11" /></small>
          </p>
          <p class="wa-typing m2"><i></i><i></i><i></i></p>
          <p class="wa-msg in m3">1<small>18:04</small></p>
          <p class="wa-msg out m4">
            Consulta confirmada! Até amanhã 🙂
            <small>18:04 <CheckCheck :size="11" /></small>
          </p>
        </div>
      </div>
      <div class="wa-side">
        <div class="wa-card">
          <small class="lbl">Agenda · Amanhã</small>
          <div class="wa-appt">
            <span class="wa-time">09:30</span>
            <strong>Bruno Lima</strong>
            <span class="wa-st">
              <span class="st st-agendado">Agendado</span>
              <span class="st st-confirmado"><Check :size="10" /> Confirmado</span>
            </span>
          </div>
        </div>
        <div class="wa-card wa-rules">
          <small class="lbl">Lembretes automáticos</small>
          <span><Calendar :size="11" /> 24 horas antes</span>
          <span><Clock :size="11" /> 2 horas antes</span>
        </div>
      </div>
    </div>

    <!-- 3 · Prontuário -->
    <div v-else-if="kind === 'prontuario'" class="fs-wrap pr">
      <aside class="pr-side">
        <div class="pr-patient">
          <span class="pr-av">A</span>
          <span class="pr-name"></span>
          <span class="pr-meta"><small>Idade</small><b>25 anos</b></span>
          <span class="pr-meta"><small>Convênio</small><b>----</b></span>
        </div>
        <span class="pr-tab"><User :size="11" /> Informações</span>
        <span class="pr-tab is-on"><FileText :size="11" /> Prontuario</span>
        <span class="pr-tab"><Syringe :size="11" /> Planejamento Facial</span>
        <span class="pr-tab"><Syringe :size="11" /> Procedimentos</span>
        <span class="pr-tab"><FileSignature :size="11" /> Termos</span>
        <span class="pr-tab"><Image :size="11" /> Imagens e Anexos</span>
      </aside>
      <div class="pr-main">
        <div class="pr-top">
          <strong>Novo Atendimento</strong>
          <span class="pr-timer"><Clock :size="10" /> 00:21</span>
          <span class="pr-saved"><Cloud :size="11" /> Salvo</span>
          <span class="pr-finish">Finalizar <ArrowRight :size="10" /></span>
        </div>
        <div class="pr-tools">
          <span class="pr-model">Usar modelo <ChevronDown :size="10" /></span>
          <span class="pr-tool"><Bold :size="10" /></span>
          <span class="pr-tool"><Italic :size="10" /></span>
          <span class="pr-tool"><List :size="10" /></span>
        </div>
        <div class="pr-doc">
          <b class="pr-h l1">Queixa / Objetivo:</b>
          <span class="pr-line l2" style="--w: 78%"></span>
          <b class="pr-h l3">Avaliação:</b>
          <span class="pr-line l4" style="--w: 92%"></span>
          <span class="pr-line l5" style="--w: 64%"></span>
          <b class="pr-h l6">Conduta:</b>
          <span class="pr-line l7" style="--w: 84%"></span>
          <span class="pr-line l8" style="--w: 48%"></span>
        </div>
      </div>
    </div>

    <!-- 4 · Financeiro -->
    <div v-else-if="kind === 'financeiro'" class="fs-wrap fi">
      <div class="fi-kpis">
        <div class="fi-kpi k1"><small>Receita</small><b>R$ 48.320</b></div>
        <div class="fi-kpi k2"><small>Lucro</small><b>R$ 31.540</b></div>
        <div class="fi-kpi k3"><small>Margem</small><b>65%</b></div>
      </div>
      <div class="fi-chart">
        <div class="fi-chart-head"><strong>Evolução da receita</strong><small>Últimos 8 meses</small></div>
        <div class="fi-bars">
          <span v-for="(v, i) in revenue" :key="i" class="fi-bar" :style="{ '--v': v / 42, '--i': i }"></span>
          <svg class="fi-line" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 30 L14 25 L28 27 L42 18 L57 21 L71 11 L85 14 L100 4" pathLength="1" />
          </svg>
        </div>
      </div>
      <div class="fi-flow">
        <div class="fi-in"><small>Entram em 7 dias</small><b>R$ 6.240</b></div>
        <div class="fi-out"><small>Saem em 7 dias</small><b>R$ 2.180</b></div>
      </div>
    </div>

    <!-- 5 · Anamnese -->
    <div v-else-if="kind === 'anamnese'" class="fs-wrap an">
      <div class="an-phone">
        <span class="an-notch"></span>
        <small class="lbl">Anamnese · Sua Clínica</small>
        <strong class="an-title">Preencha antes da sua consulta</strong>
        <div class="an-q">
          <span>Possui alguma alergia?</span>
          <div class="an-opts"><span class="an-opt o-yes">Sim</span><span class="an-opt o-no">Não</span></div>
        </div>
        <div class="an-q">
          <span>Usa algum medicamento?</span>
          <span class="an-input"><span class="an-typed">Losartana 50 mg</span></span>
        </div>
        <div class="an-q">
          <span>Já realizou o procedimento?</span>
          <div class="an-opts"><span class="an-opt o-yes2">Sim</span><span class="an-opt">Não</span></div>
        </div>
        <span class="an-send"><Send :size="10" /> Enviar respostas</span>
      </div>
      <div class="an-panel">
        <small class="lbl">Anamneses pendentes</small>
        <div class="an-item an-target">
          <span class="an-av">H</span>
          <div><strong>Helena Martins</strong><small>Anamnese Geral</small></div>
          <span class="an-state">
            <span class="st st-agendado">Pendente</span>
            <span class="st st-realizado"><Check :size="10" /> Respondida</span>
          </span>
        </div>
        <div class="an-item">
          <span class="an-av">R</span>
          <div><strong>Rafael Ribeiro</strong><small>Avaliação Inicial</small></div>
          <span class="st st-agendado">Pendente</span>
        </div>
        <div class="an-item">
          <span class="an-av">C</span>
          <div><strong>Camila Souza</strong><small>Anamnese Geral</small></div>
          <span class="st st-agendado">Pendente</span>
        </div>
      </div>
    </div>

    <!-- 6 · Marketing -->
    <div v-else-if="kind === 'marketing'" class="fs-wrap mk">
      <div class="mk-list">
        <small class="lbl">Mensagens automáticas</small>
        <span v-for="(t, i) in templates" :key="t.label" class="mk-row" :style="{ '--i': i }">
          <component :is="t.icon" :size="12" />
          {{ t.label }}
          <span class="mk-switch"><i></i></span>
        </span>
      </div>
      <div class="mk-preview">
        <div class="mk-flow">
          <span class="mk-node"><Cake :size="11" /> Aniversário</span>
          <span class="mk-link"></span>
          <span class="mk-node is-wa">WhatsApp</span>
        </div>
        <div class="mk-bubble" :style="{ backgroundImage: `url(${whatsappBg})` }">
          <p>Feliz aniversário, Natália! 🎉 Toda a equipe da clínica deseja um dia incrível.<small>09:00 <CheckCheck :size="11" /></small></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fs {
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  color: var(--ad-ink);
}
.fs-wrap {
  font-size: 10px;
  font-size: clamp(6.5px, 1.75cqw, 11px);
  width: 100%;
  height: 100%;
  padding: 1.6em;
  box-sizing: border-box;
}

.lbl {
  display: block;
  margin-bottom: 0.6em;
  color: #8a94a8;
  font-size: 1em;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.st {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.3em 0.8em;
  border-radius: 999px;
  font-size: 1em;
  font-weight: 600;
  white-space: nowrap;
}
.st-agendado { background: #eef2ff; color: #3b82f6; }
.st-confirmado { background: #fefce8; color: #a16207; }
.st-realizado { background: #f0fdf4; color: #16a34a; }

/* ---------- Agenda ---------- */
.ag { display: grid; grid-template-columns: 1fr 13.5em; gap: 1.6em; }
.ag-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1em; font-size: 1.25em; }
.seg { display: inline-flex; padding: 0.2em; border-radius: 0.6em; background: #f1f4f9; font-size: 0.8em; color: #6b7488; }
.seg > * { padding: 0.3em 0.9em; border-radius: 0.45em; }
.seg b { background: #fff; color: var(--ad-blue); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06); }
.ag-head { display: grid; grid-template-columns: repeat(5, 1fr); padding-bottom: 0.6em; border-bottom: 1px solid #eef1f6; color: #6b7488; font-size: 0.95em; text-align: center; }
.ag-head span:last-child { color: var(--ad-blue); font-weight: 600; }
.ag-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(7, 3.2em);
  background-image: linear-gradient(#f0f3f8 1px, transparent 1px);
  background-size: 100% 3.2em;
}
.ag-appt {
  --cc: #3b82f6; --bg: #eef2ff; --pill: #3b82f6; --bd: #bfdbfe;
  position: relative;
  grid-column: var(--c);
  grid-row: calc(var(--s) + 1) / span var(--h);
  display: flex;
  flex-direction: column;
  margin: 0.2em;
  padding: 0.5em 0.5em 0.4em 1.5em;
  border-radius: 0.7em;
  background: var(--bg);
  box-shadow: inset 0 0 0 1px var(--bd);
  color: var(--cc);
  font-size: 0.95em;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.4s, filter 0.4s;
}
.ag-appt::before { content: ''; position: absolute; left: 0.6em; top: 0.55em; bottom: 0.55em; width: 0.32em; border-radius: 999px; background: var(--pill); }
.ag-appt b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
.ag-appt small { margin-top: 0.1em; font-size: 0.85em; font-weight: 500; opacity: 0.7; }
.ag-appt.st-confirmado { --cc: #a16207; --bg: #fefce8; --pill: #eab308; --bd: #fde68a; }
.ag-appt.st-realizado { --cc: #16a34a; --bg: #f0fdf4; --pill: #16a34a; --bd: #86efac; }
.ag-appt.st-cancelado { --cc: #dc2626; --bg: #fef2f2; --pill: #dc2626; --bd: #fecaca; text-decoration: line-through; }
.ag-appt.st-emAtendimento { --cc: #7c3aed; --bg: #f5f3ff; --pill: #7c3aed; --bd: #c4b5fd; }
.ag-side { display: flex; flex-direction: column; gap: 0.5em; padding-left: 1.4em; border-left: 1px solid #eef1f6; }
.ag-side .lbl:not(:first-child) { margin-top: 1em; }
.ag-select { display: flex; justify-content: space-between; align-items: center; padding: 0.6em 0.8em; border: 1px solid #e3e8f0; border-radius: 0.6em; color: #5b6478; font-size: 1em; }
.ag-filter { display: flex; align-items: center; gap: 0.6em; color: #3f475c; font-size: 1.05em; }
.ag-check { display: grid; place-items: center; width: 1.3em; height: 1.3em; border-radius: 0.3em; background: var(--ad-blue); color: #fff; transition: background 0.3s, box-shadow 0.3s; }
.ag-check svg { width: 0.9em; height: 0.9em; transition: opacity 0.2s; }
.ag-dot { margin-left: auto; width: 0.6em; height: 0.6em; border-radius: 50%; }
.dot-agendado { background: #3b82f6; }
.dot-confirmado { background: #eab308; }
.dot-realizado { background: #16a34a; }
.dot-cancelado { background: #dc2626; }
.dot-emAtendimento { background: #7c3aed; }

.is-active .ag-appt { animation: pop 0.5s var(--ease-back) both; animation-delay: calc(0.15s + var(--i) * 0.06s); }
.is-active .ag-filter.is-toggle .ag-check { animation: uncheck 0.3s 1.6s forwards; }
.is-active .ag-filter.is-toggle .ag-check svg { animation: fade-out 0.2s 1.6s forwards; }
.is-active .ag-appt.st-cancelado { animation: pop 0.5s var(--ease-back) both, dim 0.4s 1.7s forwards; animation-delay: calc(0.15s + var(--i) * 0.06s), 1.7s; }

/* ---------- WhatsApp ---------- */
.wa { display: grid; grid-template-columns: 1.25fr 1fr; gap: 1.6em; }
.wa-chat { display: flex; flex-direction: column; border-radius: 1em; overflow: hidden; border: 1px solid #e8ecf3; }
.wa-head { display: flex; align-items: center; gap: 0.8em; padding: 0.9em 1em; background: #f7f8fa; border-bottom: 1px solid #e8ecf3; }
.wa-head div { display: flex; flex-direction: column; }
.wa-head strong { font-size: 1.15em; }
.wa-head small { color: #25a35a; font-size: 0.95em; }
.wa-av, .an-av { display: grid; place-items: center; width: 2.6em; height: 2.6em; border-radius: 50%; background: #e8efff; color: var(--ad-blue); font-weight: 600; font-size: 1.05em; flex: none; }
.wa-body { flex: 1; display: flex; flex-direction: column; gap: 0.7em; padding: 1.1em; background-size: 24em; background-color: #efeae2; }
.wa-msg { position: relative; max-width: 82%; margin: 0; padding: 0.7em 0.9em 1.6em; border-radius: 0.9em; font-size: 1.1em; line-height: 1.4; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06); }
.wa-msg small { position: absolute; right: 0.8em; bottom: 0.4em; display: inline-flex; align-items: center; gap: 0.2em; color: #8696a0; font-size: 0.78em; }
.wa-msg small svg { color: #53bdeb; width: 1.1em; height: 1.1em; }
.wa-msg.out { align-self: flex-end; background: #d9fdd3; border-top-right-radius: 0.2em; }
.wa-msg.in { align-self: flex-start; background: #fff; border-top-left-radius: 0.2em; padding-right: 4em; font-weight: 600; }
.wa-auto { display: block; margin-bottom: 0.2em; color: #128c7e; font-size: 0.8em; font-weight: 600; }
.wa-typing { align-self: flex-start; display: flex; gap: 0.3em; margin: 0; padding: 0.8em 1em; border-radius: 0.9em; background: #fff; }
.wa-typing i { width: 0.5em; height: 0.5em; border-radius: 50%; background: #9aa3b5; animation: typing 1s infinite; }
.wa-typing i:nth-child(2) { animation-delay: 0.15s; }
.wa-typing i:nth-child(3) { animation-delay: 0.3s; }
.wa-side { display: flex; flex-direction: column; gap: 1.2em; }
.wa-card { padding: 1.2em; border-radius: 1em; border: 1px solid #eef1f6; background: #fafbfd; }
.wa-appt { display: flex; align-items: center; gap: 0.8em; padding: 0.8em; border-radius: 0.7em; background: #fff; border: 1px solid #eef1f6; font-size: 1.05em; }
.wa-appt strong { flex: 1; font-weight: 600; }
.wa-time { color: #8a94a8; font-family: var(--fonte-mono); }
.wa-st { display: grid; }
.wa-st > * { grid-area: 1 / 1; justify-self: end; }
.wa-st .st-confirmado { opacity: 0; }
.wa-rules { display: flex; flex-direction: column; gap: 0.7em; }
.wa-rules span { display: flex; align-items: center; gap: 0.6em; color: #3f475c; font-size: 1.05em; }
.wa-rules svg { color: var(--ad-blue); }
.m2, .m3, .m4 { opacity: 0; }
.is-active .m1 { animation: msg-in 0.45s 0.2s var(--ease-back) both; }
.is-active .m2 { animation: msg-in 0.3s 0.9s both, fade-out 0.2s 1.7s forwards; }
.is-active .m3 { animation: msg-in 0.45s 1.75s var(--ease-back) both; }
.is-active .m4 { animation: msg-in 0.45s 2.5s var(--ease-back) both; }
.is-active .wa-st .st-agendado { animation: fade-out 0.25s 2.05s forwards; }
.is-active .wa-st .st-confirmado { animation: pop 0.45s 2.1s var(--ease-back) forwards; }
.is-active .wa-appt { animation: ring 1s 2.1s ease-out; }

/* ---------- Prontuário ---------- */
.pr { display: grid; grid-template-columns: 14em 1fr; gap: 0; padding: 0; }
.pr-side { display: flex; flex-direction: column; gap: 0.25em; padding: 1.4em 1em; border-right: 1px solid #eef1f6; background: #fbfcfe; }
.pr-patient { display: flex; flex-direction: column; gap: 0.4em; margin-bottom: 1em; padding: 1em; border: 1px solid #eef1f6; border-radius: 0.9em; background: #fff; }
.pr-av { display: grid; place-items: center; width: 3em; height: 3em; border-radius: 0.6em; background: #eef4ff; color: var(--ad-blue); font-weight: 600; font-size: 1.2em; }
.pr-name { height: 0.9em; width: 80%; border-radius: 0.4em; background: #e3e8f0; filter: blur(1px); }
.pr-meta { display: flex; justify-content: space-between; font-size: 0.95em; }
.pr-meta small { color: #8a94a8; }
.pr-tab { display: flex; align-items: center; gap: 0.6em; padding: 0.6em 0.7em; border-radius: 0.5em; color: #3f475c; font-size: 1.02em; }
.pr-tab.is-on { background: #eef2ff; color: var(--ad-blue); font-weight: 600; }
.pr-main { display: flex; flex-direction: column; padding: 1.4em 1.8em; min-width: 0; }
.pr-top { display: flex; align-items: center; gap: 1em; margin-bottom: 1em; }
.pr-top strong { flex: 1; font-size: 1.4em; font-weight: 500; }
.pr-timer { display: inline-flex; align-items: center; gap: 0.3em; padding: 0.3em 0.8em; border-radius: 999px; background: #f1f4f9; color: #5b6478; font-size: 1em; font-variant-numeric: tabular-nums; }
.pr-saved { display: inline-flex; align-items: center; gap: 0.3em; color: #16a34a; font-size: 1em; opacity: 0; }
.pr-finish { display: inline-flex; align-items: center; gap: 0.3em; padding: 0.5em 1em; border-radius: 0.6em; background: #10b981; color: #fff; font-size: 1em; font-weight: 600; }
.pr-tools { display: flex; gap: 0.5em; padding-bottom: 1em; margin-bottom: 1.2em; border-bottom: 1px solid #eef1f6; }
.pr-model { display: inline-flex; align-items: center; gap: 0.5em; padding: 0.4em 0.8em; border: 1px solid #e3e8f0; border-radius: 0.5em; color: #5b6478; font-size: 1em; margin-right: 0.6em; }
.pr-tool { display: grid; place-items: center; width: 2.2em; height: 2.2em; border: 1px solid #eef1f6; border-radius: 0.5em; color: #5b6478; }
.pr-doc { display: flex; flex-direction: column; gap: 0.6em; }
.pr-h { font-size: 1.15em; margin-top: 0.4em; }
.pr-line { display: block; height: 0.7em; width: var(--w); border-radius: 0.35em; background: #e6ebf3; transform-origin: left; }
.is-active .pr-doc > * { animation: write 0.5s var(--ease-out) both; }
.is-active .l1 { animation-delay: 0.2s !important; }
.is-active .l2 { animation-delay: 0.45s !important; }
.is-active .l3 { animation-delay: 0.75s !important; }
.is-active .l4 { animation-delay: 1s !important; }
.is-active .l5 { animation-delay: 1.2s !important; }
.is-active .l6 { animation-delay: 1.5s !important; }
.is-active .l7 { animation-delay: 1.75s !important; }
.is-active .l8 { animation-delay: 1.95s !important; }
.is-active .pr-saved { animation: pop 0.4s 2.4s var(--ease-back) forwards; }

/* ---------- Financeiro ---------- */
.fi { display: grid; grid-template-rows: auto 1fr auto; gap: 1.2em; }
.fi-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1em; }
.fi-kpi { display: flex; flex-direction: column; gap: 0.3em; padding: 1em 1.2em; border-radius: 0.9em; border: 1px solid #eef1f6; background: #fafbfd; }
.fi-kpi small { color: #8a94a8; font-size: 1em; }
.fi-kpi b { font-size: 1.7em; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.fi-kpi.k2 b { color: #16a34a; }
.fi-kpi.k3 b { color: var(--ad-blue); }
.fi-chart { display: flex; flex-direction: column; padding: 1.2em; border-radius: 0.9em; border: 1px solid #eef1f6; min-height: 0; }
.fi-chart-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1em; }
.fi-chart-head strong { font-size: 1.15em; font-weight: 600; }
.fi-chart-head small { color: #8a94a8; font-size: 0.95em; }
.fi-bars { position: relative; flex: 1; display: flex; align-items: flex-end; gap: 4%; min-height: 8em; padding-top: 1em; }
.fi-bar { flex: 1; height: calc(var(--v) * 100%); border-radius: 0.4em 0.4em 0.15em 0.15em; background: linear-gradient(180deg, #cfe0ff, #e8f0ff); transform-origin: bottom; }
.fi-bar:last-of-type { background: linear-gradient(180deg, var(--ad-blue-2), var(--ad-blue)); }
.fi-line { position: absolute; inset: 1em 0 0; width: 100%; height: calc(100% - 1em); overflow: visible; }
.fi-line path { fill: none; stroke: var(--ad-blue); stroke-width: 2; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.fi-flow { display: grid; grid-template-columns: 1fr 1fr; gap: 1em; }
.fi-flow > div { display: flex; justify-content: space-between; align-items: center; padding: 0.9em 1.2em; border-radius: 0.9em; font-size: 1.05em; }
.fi-flow small { color: #5b6478; }
.fi-in { background: #f0fdf4; }
.fi-in b { color: #16a34a; }
.fi-out { background: #fef2f2; }
.fi-out b { color: #dc2626; }
.is-active .fi-kpi { animation: rise 0.5s var(--ease-out) both; }
.is-active .k2 { animation-delay: 0.1s; }
.is-active .k3 { animation-delay: 0.2s; }
.is-active .fi-bar { animation: grow 0.7s var(--ease-out) both; animation-delay: calc(0.3s + var(--i) * 0.07s); }
.is-active .fi-line path { animation: draw 1.3s 0.7s var(--ease-in-out) both; }
.is-active .fi-flow > div { animation: rise 0.5s 1.3s var(--ease-out) both; }

/* ---------- Anamnese ---------- */
.an { display: grid; grid-template-columns: 19em 1fr; gap: 2em; align-items: center; }
.an-phone { position: relative; display: flex; flex-direction: column; gap: 1em; padding: 2.6em 1.4em 1.6em; border-radius: 2.2em; border: 0.35em solid #1c2035; background: #fff; box-shadow: 0 1.6em 3em -1.6em rgba(28, 45, 90, 0.45); }
.an-notch { position: absolute; top: 0.7em; left: 50%; width: 5em; height: 0.9em; border-radius: 999px; background: #1c2035; transform: translateX(-50%); }
.an-title { font-size: 1.35em; font-weight: 600; line-height: 1.2; }
.an-q { display: flex; flex-direction: column; gap: 0.5em; font-size: 1.02em; color: #3f475c; }
.an-opts { display: flex; gap: 0.5em; }
.an-opt { flex: 1; padding: 0.5em; border-radius: 0.6em; border: 1px solid #e3e8f0; text-align: center; transition: all 0.3s; }
.an-input { display: block; min-height: 2.4em; padding: 0.55em 0.8em; border-radius: 0.6em; border: 1px solid #e3e8f0; color: var(--ad-ink); }
.an-typed { display: inline-block; overflow: hidden; white-space: nowrap; vertical-align: bottom; }
.an-send { display: flex; justify-content: center; align-items: center; gap: 0.5em; padding: 0.8em; border-radius: 0.7em; background: var(--ad-blue); color: #fff; font-weight: 600; font-size: 1.05em; }
.an-panel { display: flex; flex-direction: column; gap: 0.8em; }
.an-item { display: flex; align-items: center; gap: 0.9em; padding: 0.9em 1em; border-radius: 0.9em; border: 1px solid #eef1f6; background: #fafbfd; }
.an-item div { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.an-item strong { font-size: 1.1em; font-weight: 600; }
.an-item small { color: #8a94a8; font-size: 0.95em; }
.an-state { display: grid; }
.an-state > * { grid-area: 1 / 1; justify-self: end; }
.an-state .st-realizado { opacity: 0; }
.is-active .o-no, .is-active .o-yes2 { animation: choose 0.3s forwards; }
.is-active .o-no { animation-delay: 0.6s; }
.is-active .an-typed { animation: type 0.9s 1s steps(15) both; }
.is-active .o-yes2 { animation-delay: 2s; }
.is-active .an-send { animation: press 0.35s 2.5s; }
.is-active .an-state .st-agendado { animation: fade-out 0.25s 2.85s forwards; }
.is-active .an-state .st-realizado { animation: pop 0.45s 2.9s var(--ease-back) forwards; }
.is-active .an-target { animation: ring-green 1s 2.9s ease-out; }

/* ---------- Marketing ---------- */
.mk { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8em; align-items: center; }
.mk-list { display: flex; flex-direction: column; gap: 0.6em; }
.mk-row { display: flex; align-items: center; gap: 0.8em; padding: 0.85em 1em; border-radius: 0.8em; border: 1px solid #eef1f6; background: #fafbfd; color: #3f475c; font-size: 1.08em; }
.mk-row svg { color: var(--ad-blue); flex: none; }
.mk-switch { position: relative; margin-left: auto; width: 2.6em; height: 1.5em; border-radius: 999px; background: #dfe4ec; flex: none; transition: background 0.3s; }
.mk-switch i { position: absolute; top: 0.2em; left: 0.2em; width: 1.1em; height: 1.1em; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); transition: transform 0.3s var(--ease-back); }
.mk-preview { display: flex; flex-direction: column; gap: 1.2em; }
.mk-flow { display: flex; align-items: center; }
.mk-node { display: inline-flex; align-items: center; gap: 0.4em; padding: 0.6em 1em; border-radius: 0.7em; border: 1px solid #dce6fb; background: #f3f7ff; color: var(--ad-blue); font-size: 1.02em; font-weight: 600; }
.mk-node.is-wa { border-color: #c6f1d6; background: #f0fdf4; color: #128c7e; }
.mk-link { flex: 1; height: 2px; margin: 0 0.6em; background: repeating-linear-gradient(90deg, #b8c7e6 0 6px, transparent 6px 11px); background-size: 22px 2px; }
.mk-bubble { padding: 1.4em; border-radius: 1em; background-color: #efeae2; background-size: 24em; }
.mk-bubble p { position: relative; margin: 0 0 0 auto; max-width: 92%; padding: 0.8em 1em 1.8em; border-radius: 0.9em; border-top-right-radius: 0.2em; background: #d9fdd3; font-size: 1.1em; line-height: 1.45; }
.mk-bubble small { position: absolute; right: 0.8em; bottom: 0.45em; display: inline-flex; align-items: center; gap: 0.2em; color: #8696a0; font-size: 0.78em; }
.mk-bubble small svg { color: #53bdeb; width: 1.1em; height: 1.1em; }
.is-active .mk-row { animation: rise 0.45s var(--ease-out) both; animation-delay: calc(0.1s + var(--i) * 0.08s); }
.is-active .mk-switch { animation: switch-bg 0.3s forwards; animation-delay: calc(0.8s + var(--i) * 0.22s); }
.is-active .mk-switch i { animation: switch-knob 0.35s var(--ease-back) forwards; animation-delay: calc(0.8s + var(--i) * 0.22s); }
.is-active .mk-link { animation: flow 0.8s linear infinite; }
.is-active .mk-bubble p { animation: msg-in 0.5s 2s var(--ease-back) both; }

/* ---------- Telas pequenas (celular) ---------- */
@container (max-width: 520px) {
  .fs-wrap { font-size: clamp(7px, 2.6cqw, 11px); padding: 1.2em; }
  .ag { grid-template-columns: minmax(0, 1fr); }
  .ag-side { display: none; }
  .ag-head span:nth-child(-n + 2), .ag-appt.c-1, .ag-appt.c-2 { display: none; }
  .ag-head, .ag-grid { grid-template-columns: repeat(3, 1fr); }
  .ag-appt { grid-column: calc(var(--c) - 2); }
  .wa { grid-template-columns: minmax(0, 1fr); }
  .wa-side .wa-rules { display: none; }
  .pr { grid-template-columns: minmax(0, 1fr); }
  .pr-side { display: none; }
  .pr-main { padding: 1.2em; }
  .pr-tool { display: none; }
  .fi-kpi b { font-size: 1.45em; }
  .an { grid-template-columns: 1fr 1fr; gap: 1em; align-items: start; }
  .an-phone { padding: 2.2em 1em 1.2em; border-radius: 1.6em; gap: 0.7em; }
  .an-item { padding: 0.7em; gap: 0.5em; flex-wrap: wrap; }
  .an-item .an-av { display: none; }
  .mk { grid-template-columns: minmax(0, 1fr); gap: 1em; }
  .mk-row:nth-child(n + 5) { display: none; }
  .mk-flow { display: none; }
}

/* ---------- Keyframes ---------- */
@keyframes pop { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
@keyframes rise { from { opacity: 0; transform: translateY(0.8em); } to { opacity: 1; transform: none; } }
@keyframes msg-in { from { opacity: 0; transform: translateY(0.6em) scale(0.94); } to { opacity: 1; transform: none; } }
@keyframes fade-out { to { opacity: 0; } }
@keyframes dim { to { opacity: 0.18; filter: grayscale(1); } }
@keyframes uncheck { to { background: #fff; box-shadow: inset 0 0 0 1px #cbd3e1; } }
@keyframes typing { 0%, 60%, 100% { transform: none; opacity: 0.5; } 30% { transform: translateY(-0.3em); opacity: 1; } }
@keyframes ring { 0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); } 100% { box-shadow: 0 0 0 0.8em rgba(234, 179, 8, 0); } }
@keyframes ring-green { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 100% { box-shadow: 0 0 0 0.8em rgba(34, 197, 94, 0); } }
@keyframes write { from { opacity: 0; transform: scaleX(0.2); } to { opacity: 1; transform: none; } }
@keyframes grow { from { transform: scaleY(0); } to { transform: none; } }
@keyframes draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes choose { to { background: #eef4ff; border-color: var(--ad-blue); color: var(--ad-blue); font-weight: 600; } }
@keyframes type { from { width: 0; } to { width: 100%; } }
@keyframes press { 50% { transform: scale(0.95); filter: brightness(1.1); } }
@keyframes switch-bg { to { background: var(--ad-blue); } }
@keyframes switch-knob { to { transform: translateX(1.1em); } }
@keyframes flow { to { background-position: 22px 0; } }

@media (prefers-reduced-motion: reduce) {
  .fs *, .fs *::before { animation-duration: 0.001s !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; }
}
</style>
