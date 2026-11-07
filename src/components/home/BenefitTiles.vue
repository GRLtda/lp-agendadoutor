<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCheck,
  Clock,
  ClipboardCheck,
  FileSignature,
  History,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-vue-next'

// Os quatro benefícios. Todos seguem a mesma estrutura (cabeçalho + painel no
// estilo do app), cada um com animação e microinteração próprias. A entrada
// acontece quando o bloco aparece na tela (IntersectionObserver no próprio
// bloco, que nunca recebe clip-path para continuar observável).
const tiles = ref([])
const seen = ref([false, false, false, false])
const ready = ref(false)

// Mais tempo: interruptor de automação (o visitante pode alternar).
const automated = ref(false)
const tasks = [
  'Confirmar consultas uma a uma',
  'Lembrar pacientes na véspera',
  'Enviar anamnese antes da consulta',
  'Parabenizar aniversariantes',
]
const GAUGE = 2 * Math.PI * 42

// Menos faltas: a conversa pode ser repetida.
const replayKey = ref(0)

// Mais controle: alterna entre agenda e financeiro.
const controlTab = ref('agenda')
const occupancy = [
  { d: 'Seg', v: 72 },
  { d: 'Ter', v: 88 },
  { d: 'Qua', v: 64 },
  { d: 'Qui', v: 92 },
  { d: 'Sex', v: 80 },
]

// Mais segurança: termo de consentimento assinado pelo link do paciente.
// Fonte: api-clinic/docs/CONSENT_TERMS.md e o PDF do termo, cujo rodapé diz
// "Este documento possui validade legal conforme Lei Geral de Proteção de
// Dados (LGPD)". Termo e anamnese registram data/hora, IP e dispositivo.
const signKey = ref(0)
const protections = [
  { icon: FileSignature, title: 'Termos com validade jurídica', text: 'Assinatura pelo link, com PDF do termo assinado.' },
  { icon: ClipboardCheck, title: 'Anamnese com consentimento', text: 'Respostas registradas com data, hora, IP e dispositivo.' },
  { icon: LockKeyhole, title: 'Proteção de dados', text: 'Controle de acesso, criptografia e práticas da LGPD.' },
  { icon: History, title: 'Histórico de atividades', text: 'Ações da equipe registradas na clínica.' },
]

let observer = null
let autoTimer = null

onMounted(() => {
  ready.value = true
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const i = Number(entry.target.dataset.tile)
        seen.value[i] = true
        observer.unobserve(entry.target)
        if (i === 0) autoTimer = setTimeout(() => { automated.value = true }, 900)
      })
    },
    { threshold: 0.3 },
  )
  tiles.value.forEach((el) => el && observer.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(autoTimer)
})
</script>

<template>
  <div class="bt" :class="{ 'is-ready': ready }">
    <div class="bt-head">
      <h3 class="bt-title">O que muda na sua rotina</h3>
      <p>Quatro ganhos que aparecem no dia a dia da clínica, da recepção ao consultório.</p>
    </div>

    <div class="bt-grid">
      <!-- Mais tempo -->
      <article :ref="(el) => (tiles[0] = el)" data-tile="0" class="tile t-time" :class="{ 'is-in': seen[0], 'is-auto': automated }">
        <header class="tile-head">
          <span class="tile-icon"><Clock :size="18" /></span>
          <div>
            <h4>Mais tempo.</h4>
            <p>Automatize tarefas repetitivas e simplifique seu dia.</p>
          </div>
        </header>
        <div class="panel">
          <div class="panel-bar">
            <span class="panel-label">Tarefas do dia</span>
            <button
              type="button"
              class="switch"
              role="switch"
              :aria-checked="automated"
              aria-label="Automação das tarefas"
              @click="automated = !automated"
            >
              <span class="switch-label">{{ automated ? 'Automação ligada' : 'Tudo manual' }}</span>
              <span class="switch-track"><i></i></span>
            </button>
          </div>
          <div class="time-body" aria-hidden="true">
            <div class="time-list">
            <ul class="time-tasks">
              <li v-for="(t, i) in tasks" :key="t" :style="{ '--i': i }">
                <span class="task-check"><Check :size="11" /></span>
                <span class="task-name">{{ t }}</span>
                <span class="task-tag">
                  <span class="tag-manual">Manual</span>
                  <span class="tag-auto">Automático</span>
                </span>
              </li>
            </ul>
            <span v-if="automated" class="time-scan"></span>
            </div>
            <div class="gauge">
              <span class="gauge-ring">
                <svg viewBox="0 0 100 100">
                  <circle class="gauge-track" cx="50" cy="50" r="42" />
                  <circle
                    class="gauge-fill"
                    cx="50"
                    cy="50"
                    r="42"
                    :style="{ strokeDasharray: GAUGE, strokeDashoffset: GAUGE * (automated ? 0.14 : 0.72) }"
                  />
                </svg>
                <span class="gauge-center"><Clock :size="20" /></span>
              </span>
              <span class="gauge-text">
                <b>{{ automated ? 'Mais tempo livre' : 'Agenda tomada' }}</b>
                <small>para cuidar dos seus pacientes</small>
              </span>
            </div>
          </div>
        </div>
      </article>

      <!-- Menos faltas -->
      <article :ref="(el) => (tiles[1] = el)" data-tile="1" class="tile t-shows" :class="{ 'is-in': seen[1] }">
        <header class="tile-head">
          <span class="tile-icon"><CalendarCheck :size="18" /></span>
          <div>
            <h4>Menos faltas.</h4>
            <p>Facilite a confirmação de consultas pelo WhatsApp.</p>
          </div>
        </header>
        <div class="panel panel-chat">
          <button type="button" class="replay" @click="replayKey++">
            <RotateCcw :size="13" /> Ver de novo
          </button>
          <div :key="replayKey" class="shows-chat" aria-hidden="true">
            <p class="sc-out">Olá, Helena! Sua consulta é amanhã às 09:00. Responda <b>1</b> para confirmar.</p>
            <p class="sc-in">1 <CheckCheck :size="13" /></p>
            <div class="sc-appt">
              <span class="sc-time">09:00</span>
              <strong>Helena Martins</strong>
              <span class="sc-st">
                <span class="st st-agendado">Agendado</span>
                <span class="st st-confirmado"><Check :size="10" /> Confirmado</span>
              </span>
            </div>
          </div>
        </div>
      </article>

      <!-- Mais controle -->
      <article :ref="(el) => (tiles[2] = el)" data-tile="2" class="tile t-control" :class="{ 'is-in': seen[2] }">
        <header class="tile-head">
          <span class="tile-icon"><TrendingUp :size="18" /></span>
          <div>
            <h4>Mais controle.</h4>
            <p>Acompanhe a agenda e a gestão financeira em um só lugar.</p>
          </div>
        </header>
        <div class="panel">
          <div class="ctrl-tabs" role="group" aria-label="Visualização">
            <button type="button" :aria-pressed="controlTab === 'agenda'" :class="{ 'is-on': controlTab === 'agenda' }" @click="controlTab = 'agenda'">Agenda</button>
            <button type="button" :aria-pressed="controlTab === 'fin'" :class="{ 'is-on': controlTab === 'fin' }" @click="controlTab = 'fin'">Financeiro</button>
            <span class="ctrl-ind" :class="{ 'is-right': controlTab === 'fin' }" aria-hidden="true"></span>
          </div>
          <div class="ctrl-panels" aria-hidden="true">
            <div class="ctrl-panel ctrl-agenda" :class="{ 'is-on': controlTab === 'agenda' }">
              <small>Ocupação da semana</small>
              <div class="occ">
                <span v-for="(o, i) in occupancy" :key="o.d" class="occ-col" :style="{ '--v': o.v / 100, '--i': i }">
                  <i></i><em>{{ o.d }}</em>
                </span>
              </div>
            </div>
            <div class="ctrl-panel ctrl-fin" :class="{ 'is-on': controlTab === 'fin' }">
              <small>Evolução da receita</small>
              <svg viewBox="0 0 200 70" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bt-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#0057FF" stop-opacity="0.22" />
                    <stop offset="100%" stop-color="#0057FF" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path class="area" d="M0 56 L28 48 L57 52 L85 36 L114 40 L142 24 L171 28 L200 10 L200 70 L0 70 Z" />
                <path class="line" d="M0 56 L28 48 L57 52 L85 36 L114 40 L142 24 L171 28 L200 10" pathLength="1" />
              </svg>
              <div class="fin-flow">
                <span><small>Entram em 7 dias</small><b class="pos">R$ 6.240</b></span>
                <span><small>Saem em 7 dias</small><b class="neg">R$ 2.180</b></span>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Mais segurança -->
      <article :ref="(el) => (tiles[3] = el)" data-tile="3" class="tile t-safe" :class="{ 'is-in': seen[3] }">
        <header class="tile-head">
          <span class="tile-icon"><ShieldCheck :size="18" /></span>
          <div>
            <h4>Mais segurança.</h4>
            <p>Termos e anamneses com validade jurídica e os dados dos pacientes protegidos conforme a LGPD.</p>
          </div>
          <RouterLink to="/lgpd" class="tile-link" data-track-click="beneficios_lgpd">
            Ver práticas de LGPD <ArrowRight :size="14" />
          </RouterLink>
        </header>
        <div class="panel safe-panel">
          <button type="button" class="replay" @click="signKey++">
            <RotateCcw :size="13" /> Assinar de novo
          </button>

          <div :key="signKey" class="doc" aria-hidden="true">
            <div class="doc-head">
              <span class="doc-icon"><FileSignature :size="15" /></span>
              <div>
                <strong>Termo de consentimento</strong>
                <small>Helena Martins · Toxina botulínica</small>
              </div>
            </div>
            <div class="doc-lines">
              <i style="--w: 92%; --i: 0"></i>
              <i style="--w: 84%; --i: 1"></i>
              <i style="--w: 66%; --i: 2"></i>
            </div>
            <ul class="doc-checks">
              <li><span class="box"><Check :size="10" /></span> Li e aceito o termo</li>
              <li><span class="box"><Check :size="10" /></span> Confirmo minha identidade</li>
            </ul>
            <div class="doc-sign">
              <svg viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet">
                <path pathLength="1" d="M8 42 C 20 12, 30 12, 34 38 S 46 52, 54 30 C 60 14, 68 16, 66 34 C 64 48, 78 46, 86 28 C 92 16, 100 20, 98 36 C 97 46, 110 44, 118 30 S 136 18, 140 34 C 143 44, 156 42, 166 30 C 176 20, 188 26, 212 22" />
              </svg>
              <span class="doc-sign-name">Helena Martins</span>
              <span class="doc-stamp"><Check :size="12" /> Assinado</span>
            </div>
            <div class="doc-evidence">
              <span style="--i: 0">17/07 · 09:12</span>
              <span style="--i: 1">IP e dispositivo registrados</span>
              <span style="--i: 2">PDF enviado pelo WhatsApp</span>
            </div>
          </div>

          <ul class="protect">
            <li v-for="(item, i) in protections" :key="item.title" :style="{ '--i': i }">
              <span class="protect-icon"><component :is="item.icon" :size="15" /></span>
              <span class="protect-text"><b>{{ item.title }}</b><small>{{ item.text }}</small></span>
              <span class="protect-check" aria-hidden="true"><Check :size="10" /></span>
            </li>
          </ul>
        </div>
      </article>
    </div>

    <div class="bt-cta">
      <a href="https://wa.me/5511921923978" target="_blank" rel="noopener noreferrer" class="bt-cta-link" data-track-click="beneficios_whatsapp_quero_modernizar">
        Quero modernizar minha agenda <ArrowRight :size="17" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.bt { max-width: 1200px; margin: 0 auto; padding: clamp(3rem, 8vh, 5rem) 1.5rem clamp(5rem, 12vh, 8rem); }
.bt-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; margin-bottom: 2rem; }
.bt-title { margin: 0; color: var(--ad-ink); font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 400; letter-spacing: -0.03em; }
.bt-head p { max-width: 26rem; margin: 0; color: var(--ad-muted); font-size: 1rem; line-height: 1.55; }

.bt-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; }

/* Estrutura comum */
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid var(--ad-line);
  box-shadow: 0 30px 60px -50px rgba(28, 45, 90, 0.5);
  overflow: hidden;
  transition: box-shadow 0.4s, border-color 0.4s;
}
.tile:hover { border-color: #d6e2fb; box-shadow: 0 40px 70px -46px rgba(0, 87, 255, 0.35); }
.t-time { grid-column: span 7; }
.t-shows { grid-column: span 5; }
.t-control { grid-column: span 5; }
.t-safe { grid-column: span 7; }

.tile-head { display: flex; align-items: flex-start; gap: 0.9rem; min-height: 4.6rem; }
.tile-head > div { flex: 1; min-width: 0; }
.tile-icon { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: 12px; background: #eef2ff; color: var(--ad-blue); }
.tile h4 { margin: 0 0 0.3rem; color: var(--ad-ink); font-size: 1.35rem; font-weight: 600; letter-spacing: -0.02em; }
.tile-head p { margin: 0; color: var(--ad-ink-soft); font-size: 0.95rem; line-height: 1.5; }
.tile-link { display: inline-flex; align-items: center; gap: 0.35rem; flex: none; margin-top: 0.3rem; color: var(--ad-blue); font-size: 0.86rem; font-weight: 600; text-decoration: none; white-space: nowrap; }
.tile-link svg { transition: transform 0.25s var(--ease-out); }
.tile-link:hover svg { transform: translateX(3px); }

.panel {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 18px;
  background: #f7f9fc;
  border: 1px solid #eef1f6;
  overflow: hidden;
}
.panel-bar { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.panel-label { display: inline-flex; align-items: center; gap: 0.4rem; color: #5b6478; font-size: 0.78rem; font-weight: 600; }
.panel-label svg { color: var(--ad-blue); }

/* Entradas: cada bloco entra de um jeito. O bloco em si nunca é recortado. */
.is-ready .t-time .tile-head,
.is-ready .t-time .panel { clip-path: inset(0 100% 0 0); transition: clip-path 0.9s var(--ease-in-out); }
.is-ready .t-time .panel { transition-delay: 0.15s; }
.is-ready .t-time.is-in .tile-head,
.is-ready .t-time.is-in .panel { clip-path: inset(-24px -24px -24px -24px); }
.is-ready .t-shows { opacity: 0; transform: perspective(900px) rotateX(14deg) translateY(30px); transform-origin: 50% 100%; transition: opacity 0.7s, transform 0.9s var(--ease-out), box-shadow 0.4s, border-color 0.4s; }
.is-ready .t-shows.is-in { opacity: 1; transform: none; }
.is-ready .t-control { opacity: 0; transform: scale(0.94); transition: opacity 0.6s, transform 0.8s var(--ease-back), box-shadow 0.4s, border-color 0.4s; }
.is-ready .t-control.is-in { opacity: 1; transform: none; }
.is-ready .t-safe .tile-head { opacity: 0; transform: translateY(16px); transition: opacity 0.6s, transform 0.8s var(--ease-out); }
.is-ready .t-safe .panel { opacity: 0; transform: translateY(26px) scale(0.98); transition: opacity 0.7s 0.12s, transform 0.9s 0.12s var(--ease-out); }
.is-ready .t-safe.is-in .tile-head,
.is-ready .t-safe.is-in .panel { opacity: 1; transform: none; }

/* ---------- Mais tempo ---------- */
.switch { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
.switch-label { font-size: 0.78rem; font-weight: 600; color: #8a94a8; transition: color 0.3s; }
.switch-track { position: relative; width: 40px; height: 22px; border-radius: 999px; background: #dfe4ec; transition: background 0.35s; }
.switch-track i { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); transition: transform 0.4s var(--ease-back); }
.switch:focus-visible .switch-track { outline: 2px solid var(--ad-blue); outline-offset: 2px; }
.is-auto .switch-track { background: var(--ad-blue); }
.is-auto .switch-track i { transform: translateX(18px); }
.is-auto .switch-label { color: var(--ad-blue); }

.time-body { display: grid; grid-template-columns: minmax(0, 1fr) 150px; gap: 1.1rem; align-items: center; }
.time-list { position: relative; min-width: 0; }
.time-tasks { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.time-tasks li {
  --d: calc(var(--i) * 0.14s);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  border-radius: 11px;
  background: #ffffff;
  border: 1px solid #eef1f6;
  font-size: 0.82rem;
  color: var(--ad-ink);
  transition: border-color 0.4s var(--d), box-shadow 0.4s var(--d);
}
.task-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid #cbd3e1;
  color: transparent;
  box-sizing: border-box;
  transition: background 0.35s var(--d), border-color 0.35s var(--d), color 0.2s var(--d), transform 0.45s var(--d) var(--ease-back);
}
.task-name { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.4s var(--d); }
.task-tag { display: grid; flex: none; }
.task-tag > * { grid-area: 1 / 1; justify-self: end; padding: 2px 8px; border-radius: 999px; font-size: 0.68rem; font-weight: 600; white-space: nowrap; transition: opacity 0.3s var(--d), transform 0.45s var(--d) var(--ease-back); }
.tag-manual { background: #f1f4f9; color: #6b7488; }
.tag-auto { background: #eef2ff; color: var(--ad-blue); opacity: 0; transform: translateY(6px); }
.is-auto .time-tasks li { border-color: #dbe6fd; box-shadow: 0 6px 14px -12px rgba(0, 87, 255, 0.6); }
.is-auto .task-check { background: var(--ad-blue); border-color: var(--ad-blue); color: #fff; transform: scale(1.06); }
.is-auto .task-name { color: #6b7488; }
.is-auto .tag-manual { opacity: 0; transform: translateY(-6px); }
.is-auto .tag-auto { opacity: 1; transform: none; }
.time-scan {
  position: absolute;
  left: -6px;
  right: -6px;
  top: 0;
  height: 26%;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(0, 87, 255, 0), rgba(0, 87, 255, 0.12) 60%, rgba(0, 87, 255, 0));
  pointer-events: none;
  animation: scan 0.8s var(--ease-in-out) forwards;
}

.gauge { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; }
.gauge-ring { position: relative; width: 112px; height: 112px; }
.gauge-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.gauge-track { fill: none; stroke: #e6ebf3; stroke-width: 9; }
.gauge-fill { fill: none; stroke: var(--ad-blue); stroke-width: 9; stroke-linecap: round; transition: stroke-dashoffset 1.1s 0.35s var(--ease-in-out); }
.gauge-center { position: absolute; inset: 0; display: grid; place-items: center; color: var(--ad-blue); transition: transform 0.5s 0.35s var(--ease-back); }
.is-auto .gauge-center { transform: rotate(360deg); }
.gauge-text { display: flex; flex-direction: column; gap: 0.1rem; }
.gauge-text b { color: var(--ad-ink); font-size: 0.86rem; font-weight: 600; }
.gauge-text small { color: #6b7488; font-size: 0.74rem; line-height: 1.3; }

/* ---------- Menos faltas ---------- */
.panel-chat { padding: 0; background: #efeae2 url('@/assets/imgs/whatsapp_bg.jpg'); background-size: 260px; }
.shows-chat { display: flex; flex-direction: column; justify-content: flex-end; gap: 0.5rem; height: 100%; padding: 3rem 1rem 1rem; box-sizing: border-box; }
.sc-out, .sc-in { margin: 0; padding: 0.6rem 0.8rem; border-radius: 12px; font-size: 0.82rem; line-height: 1.4; color: var(--ad-ink); box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06); }
.sc-out { align-self: flex-end; max-width: 88%; background: #d9fdd3; border-top-right-radius: 3px; }
.sc-in { align-self: flex-start; display: inline-flex; align-items: center; gap: 4px; background: #fff; border-top-left-radius: 3px; font-weight: 600; }
.sc-in svg { color: #53bdeb; }
.sc-appt { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.3rem; padding: 0.6rem 0.75rem; border-radius: 12px; background: #fff; font-size: 0.82rem; }
.sc-appt strong { flex: 1; color: var(--ad-ink); font-weight: 600; }
.sc-time { color: #8a94a8; font-family: var(--fonte-mono); font-size: 0.75rem; }
.sc-st { display: grid; }
.sc-st > * { grid-area: 1 / 1; justify-self: end; }
.st { display: inline-flex; align-items: center; gap: 3px; padding: 2px 9px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; }
.st-agendado { background: #eef2ff; color: #3b82f6; }
.st-confirmado { background: #fefce8; color: #a16207; border: 1px solid #fde68a; opacity: 0; }
.is-in .sc-out { animation: msg 0.5s 0.4s var(--ease-back) both; }
.is-in .sc-in { animation: msg 0.45s 1.3s var(--ease-back) both; }
.is-in .sc-st .st-agendado { animation: out 0.25s 1.9s forwards; }
.is-in .sc-st .st-confirmado { animation: pop 0.45s 1.95s var(--ease-back) forwards; }
.is-in .sc-appt { animation: ring 1.1s 1.95s ease-out; }
.replay {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid rgba(28, 32, 53, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #5b6478;
  font: inherit;
  font-size: 0.76rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.replay:hover { color: var(--ad-blue); border-color: #cfdcf8; }
.replay:hover svg { animation: spin-back 0.6s var(--ease-out); }
.replay:focus-visible { outline: 2px solid var(--ad-blue); outline-offset: 2px; }

/* ---------- Mais controle ---------- */
.ctrl-tabs { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; align-self: flex-start; margin-bottom: 1rem; padding: 3px; border-radius: 999px; background: #e9edf4; }
.ctrl-tabs button { position: relative; z-index: 1; padding: 0.4rem 1rem; border: 0; border-radius: 999px; background: none; color: #6b7488; font: inherit; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: color 0.3s; }
.ctrl-tabs button.is-on { color: var(--ad-blue); }
.ctrl-tabs button:focus-visible { outline: 2px solid var(--ad-blue); outline-offset: 1px; }
.ctrl-ind { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); border-radius: 999px; background: #fff; box-shadow: 0 2px 6px rgba(28, 32, 53, 0.1); transition: transform 0.45s var(--ease-out); }
.ctrl-ind.is-right { transform: translateX(100%); }
.ctrl-panels { display: grid; flex: 1; }
.ctrl-panel { grid-area: 1 / 1; opacity: 0; transform: translateY(10px); transition: opacity 0.4s, transform 0.5s var(--ease-out); pointer-events: none; }
.ctrl-panel.is-on { opacity: 1; transform: none; }
.ctrl-panel small { display: block; margin-bottom: 0.6rem; color: #8a94a8; font-size: 0.74rem; font-weight: 600; }
.occ { display: flex; align-items: flex-end; gap: 10px; height: 120px; }
.occ-col { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 6px; height: 100%; }
.occ-col i { width: 100%; height: calc(var(--v) * 100% - 20px); border-radius: 8px 8px 4px 4px; background: linear-gradient(180deg, #cfe0ff, #e8f0ff); transform-origin: bottom; transform: scaleY(0); transition: transform 0.7s var(--ease-out); transition-delay: calc(var(--i) * 0.07s); }
.occ-col:nth-child(4) i { background: linear-gradient(180deg, var(--ad-blue-2), var(--ad-blue)); }
.occ-col em { color: #8a94a8; font-size: 0.7rem; font-style: normal; }
.is-in .ctrl-agenda.is-on .occ-col i { transform: none; }
.ctrl-fin svg { display: block; width: 100%; height: 84px; overflow: visible; }
.ctrl-fin .area { fill: url(#bt-area); opacity: 0; transition: opacity 0.6s 0.4s; }
.ctrl-fin .line { fill: none; stroke: var(--ad-blue); stroke-width: 2.5; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.1s var(--ease-in-out); }
.ctrl-fin.is-on .area { opacity: 1; }
.ctrl-fin.is-on .line { stroke-dashoffset: 0; }
.fin-flow { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 0.7rem; }
.fin-flow span { display: flex; flex-direction: column; padding: 0.5rem 0.7rem; border-radius: 10px; background: #fff; border: 1px solid #eef1f6; }
.fin-flow small { margin: 0; font-size: 0.68rem; }
.fin-flow b { font-size: 0.92rem; }
.pos { color: #16a34a; }
.neg { color: #dc2626; }

/* ---------- Mais segurança ---------- */
.safe-panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; align-items: start; padding-top: 3rem; }

.doc {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.95rem;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e6ebf5;
  box-shadow: 0 20px 36px -28px rgba(28, 45, 90, 0.55);
  transition: transform 0.4s var(--ease-out), box-shadow 0.4s;
}
.t-safe:hover .doc { transform: translateY(-2px); box-shadow: 0 26px 44px -28px rgba(0, 87, 255, 0.45); }
.doc-head { display: flex; align-items: center; gap: 0.6rem; }
.doc-head div { display: flex; flex-direction: column; min-width: 0; }
.doc-head strong { color: var(--ad-ink); font-size: 0.84rem; font-weight: 600; }
.doc-head small { color: #8a94a8; font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-icon { display: grid; place-items: center; flex: none; width: 30px; height: 30px; border-radius: 9px; background: #eef2ff; color: var(--ad-blue); }
.doc-lines { display: flex; flex-direction: column; gap: 5px; }
.doc-lines i { display: block; height: 6px; width: var(--w); border-radius: 4px; background: #eef1f6; transform-origin: left; }
.doc-checks { display: flex; flex-direction: column; gap: 5px; margin: 0; padding: 0; list-style: none; }
.doc-checks li { display: flex; align-items: center; gap: 0.45rem; color: #3f475c; font-size: 0.74rem; }
.box { display: grid; place-items: center; width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #cbd3e1; color: transparent; box-sizing: border-box; }
.doc-sign { position: relative; display: flex; flex-direction: column; align-items: center; padding: 1.75rem 0.5rem 0.5rem; border-radius: 10px; background: #f7f9fc; border: 1px dashed #d6deea; }
.doc-sign > svg { display: block; width: 100%; height: 42px; }
.doc-sign > svg path { fill: none; stroke: #1c2035; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
.doc-sign-name { margin-top: 0.15rem; padding-top: 0.25rem; border-top: 1px solid #d6deea; width: 70%; color: #8a94a8; font-size: 0.66rem; text-align: center; }
.doc-stamp {
  position: absolute;
  top: 0.45rem;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  font-size: 0.66rem;
  font-weight: 700;
  opacity: 0;
  transform: scale(1.6) rotate(-10deg);
}
.doc-evidence { display: flex; flex-wrap: wrap; gap: 5px; }
.doc-evidence span { padding: 3px 8px; border-radius: 999px; background: #f1f4f9; color: #5b6478; font-size: 0.65rem; font-weight: 600; white-space: nowrap; opacity: 0; transform: translateY(6px); }

.is-in .doc-lines i { animation: grow-x 0.5s var(--ease-out) both; animation-delay: calc(0.25s + var(--i) * 0.1s); }
.is-in .doc-checks li:nth-child(1) .box { animation: tick 0.35s 0.75s var(--ease-back) forwards; }
.is-in .doc-checks li:nth-child(2) .box { animation: tick 0.35s 1s var(--ease-back) forwards; }
.is-in .doc-sign > svg path { animation: draw 1.1s 1.25s var(--ease-in-out) forwards; }
.is-in .doc-stamp { animation: stamp 0.45s 2.4s var(--ease-back) forwards; }
.is-in .doc-evidence span { animation: rise 0.4s var(--ease-out) forwards; animation-delay: calc(2.65s + var(--i) * 0.15s); }

.protect { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.protect li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.7rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eef1f6;
  opacity: 0;
  transform: translateX(14px);
  transition: opacity 0.45s, transform 0.55s var(--ease-out), border-color 0.3s, box-shadow 0.3s;
  transition-delay: calc(0.3s + var(--i) * 0.12s), calc(0.3s + var(--i) * 0.12s), 0s, 0s;
}
.protect li:hover { border-color: #cfdcf8; box-shadow: 0 10px 20px -16px rgba(0, 87, 255, 0.6); }
.protect-icon { display: grid; place-items: center; flex: none; width: 30px; height: 30px; border-radius: 9px; background: #eef2ff; color: var(--ad-blue); transition: transform 0.4s var(--ease-back); }
.protect li:hover .protect-icon { transform: scale(1.08) rotate(-4deg); }
.protect-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.protect-text b { color: var(--ad-ink); font-size: 0.8rem; font-weight: 600; }
.protect-text small { color: #6b7488; font-size: 0.7rem; line-height: 1.35; }
.protect-check { display: grid; place-items: center; flex: none; width: 18px; height: 18px; border-radius: 50%; background: #eef1f6; color: transparent; transform: scale(0.7); transition: background 0.35s, color 0.35s, transform 0.45s var(--ease-back); transition-delay: calc(1.6s + var(--i) * 0.18s); }
.is-in .protect li { opacity: 1; transform: none; }
.is-in .protect-check { background: #f0fdf4; color: #16a34a; transform: none; }

/* CTA */
.bt-cta { display: flex; justify-content: center; margin-top: 2.5rem; }
.bt-cta-link { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.6rem; border-radius: 999px; background: #fff; border: 1px solid #cfdcf8; color: var(--ad-blue); font-weight: 600; text-decoration: none; transition: background 0.25s, box-shadow 0.25s, transform 0.25s var(--ease-out); }
.bt-cta-link:hover { background: #f3f7ff; box-shadow: 0 12px 24px -14px rgba(0, 87, 255, 0.5); transform: translateY(-1px); }
.bt-cta-link svg { transition: transform 0.25s var(--ease-out); }
.bt-cta-link:hover svg { transform: translateX(3px); }

@keyframes msg { from { opacity: 0; transform: translateY(8px) scale(0.94); } to { opacity: 1; transform: none; } }
@keyframes out { to { opacity: 0; } }
@keyframes pop { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: none; } }
@keyframes ring { 0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); } 100% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); } }
@keyframes spin-back { from { transform: rotate(0); } to { transform: rotate(-360deg); } }
@keyframes scan { from { transform: translateY(-30%); opacity: 1; } 85% { opacity: 1; } to { transform: translateY(330%); opacity: 0; } }
@keyframes grow-x { from { transform: scaleX(0); } to { transform: none; } }
@keyframes tick { to { background: var(--ad-blue); border-color: var(--ad-blue); color: #fff; } }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes stamp { to { opacity: 1; transform: none; } }
@keyframes rise { to { opacity: 1; transform: none; } }

@media (max-width: 960px) {
  .t-time, .t-safe { grid-column: 1 / -1; }
  .t-shows, .t-control { grid-column: span 6; }
}

@media (max-width: 720px) {
  .bt-head { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
  .bt-grid { grid-template-columns: minmax(0, 1fr); }
  .t-time, .t-shows, .t-control, .t-safe { grid-column: auto; }
  .tile { padding: 1.2rem; border-radius: 20px; gap: 1rem; }
  .tile-head { min-height: 0; flex-wrap: wrap; }
  .tile h4 { font-size: 1.25rem; }
  .tile-head > div { flex: 1 1 calc(100% - 40px - 0.9rem); }
  .tile-link { order: 3; margin-left: calc(40px + 0.9rem); }
  .panel.safe-panel { padding-top: 2.9rem; }
  .panel { padding: 0.85rem; }
  .time-body { grid-template-columns: minmax(0, 1fr); }
  .gauge { flex-direction: row; text-align: left; gap: 0.9rem; }
  .gauge-ring { width: 76px; height: 76px; flex: none; }
  .safe-panel { grid-template-columns: minmax(0, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .tile, .tile * { transition-duration: 0.01s !important; transition-delay: 0s !important; animation-duration: 0.01s !important; animation-delay: 0s !important; }
  .time-scan { display: none; }
}
</style>
