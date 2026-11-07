<script setup>
import { AlertTriangle, CalendarDays, Check, CheckCheck, FileText, Image, MessageCircle, Paperclip, Receipt, StickyNote, Wallet, FolderOpen } from 'lucide-vue-next'
import BenefitTiles from './BenefitTiles.vue'
import logoBrand from '@/assets/logo_brand.svg'

// Cena "antes e depois" (pin + scrub em useHomeMotion). Cada item solto tem um
// destino (data-target) e é absorvido pelo módulo correspondente da
// plataforma. Sem movimento, a cena mostra apenas o painel organizado.
const words = 'Não é só sobre ter um sistema. É sobre ter mais tranquilidade na sua rotina.'.split(' ')

// x/y em % do palco, r em graus. mobile: false esconde o item em telas pequenas.
const chaos = [
  { kind: 'note', icon: StickyNote, text: 'Encaixe 10:15 ??', x: 3, y: 6, r: -7, target: 'agenda' },
  { kind: 'note alert', icon: AlertTriangle, text: '2 pacientes às 11h!', x: 70, y: 4, r: 5, target: 'agenda' },
  { kind: 'chat', icon: MessageCircle, text: 'WhatsApp · 27 não lidas', x: 58, y: 34, r: -4, target: 'confirm' },
  { kind: 'bubble', text: 'Confirma amanhã às 9h?', x: 8, y: 40, r: 4, target: 'confirm', mobile: false },
  { kind: 'receipt', icon: Receipt, text: 'Recibo R$ 250,00 · pago?', x: 6, y: 72, r: -5, target: 'fin' },
  { kind: 'file', icon: FileText, text: 'caixa_julho_v3.xlsx', x: 72, y: 70, r: 6, target: 'fin', mobile: false },
  { kind: 'file', icon: Paperclip, text: 'exame_sangue.pdf', x: 40, y: 82, r: -3, target: 'pront' },
  { kind: 'file', icon: Image, text: 'IMG_2048.HEIC', x: 36, y: 10, r: 8, target: 'pront', mobile: false },
  { kind: 'note', icon: StickyNote, text: 'Ligar p/ remarcar Paula', x: 34, y: 54, r: -9, target: 'agenda' },
  { kind: 'clock', text: '21:40 · ainda respondendo', x: 76, y: 52, r: 3, target: 'confirm', mobile: false },
]
</script>

<template>
  <section id="beneficios" class="ba" data-before-after aria-labelledby="ba-title">
    <div class="ba-scene" data-ba-scene>
      <div class="ba-scene-inner">
      <header class="ba-head">
        <span class="ba-kicker">Sua clínica antes e depois do Agenda Doutor</span>
        <h2 id="ba-title" class="ba-title" data-ba-words>
          <span v-for="(w, i) in words" :key="i" class="w">{{ w + ' ' }}</span>
        </h2>
      </header>

      <div class="ba-stage" data-ba-stage>
        <div class="ba-state" aria-hidden="true">
          <span class="ba-state-track">
            <span class="ba-state-knob" data-ba-knob></span>
            <span class="ba-state-opt" data-ba-before-label>Antes</span>
            <span class="ba-state-opt" data-ba-after-label>Depois</span>
          </span>
          <span class="ba-state-caption">
            <span data-ba-cap-before>Rotina sobrecarregada</span>
            <span data-ba-cap-after>Rotina organizada</span>
          </span>
        </div>

        <!-- Antes: tudo espalhado -->
        <div class="ba-chaos" aria-hidden="true">
          <div
            v-for="(c, i) in chaos"
            :key="i"
            class="ba-bit"
            :class="[`bit-${c.kind.split(' ')[0]}`, { 'is-alert': c.kind.includes('alert'), 'no-mobile': c.mobile === false }]"
            :style="{ '--x': `${c.x}%`, '--y': `${c.y}%` }"
            data-ba-bit
            :data-target="c.target"
            :data-r="c.r"
          >
            <component :is="c.icon" v-if="c.icon" :size="15" />
            <span>{{ c.text }}</span>
            <b v-if="c.kind === 'chat'" class="bit-badge">27</b>
          </div>
        </div>

        <!-- Depois: a plataforma organizada -->
        <div class="ba-board" data-ba-board role="img" aria-label="Painel do Agenda Doutor com agenda do dia, confirmações, financeiro e prontuário organizados">
          <div class="board-top" aria-hidden="true">
            <img :src="logoBrand" alt="" width="11" height="19" />
            <strong>Resumo do dia</strong>
            <span class="board-ok"><Check :size="12" /> Tudo em dia</span>
          </div>
          <div class="board-grid" aria-hidden="true">
            <div class="mod" data-ba-module="agenda">
              <span class="mod-title"><CalendarDays :size="13" /> Agenda de hoje</span>
              <div class="mod-rows">
                <span class="row" data-ba-row><i>08:00</i>Natália Ferreira<b class="st st-realizado">Realizado</b></span>
                <span class="row" data-ba-row><i>09:00</i>Helena Martins<b class="st st-confirmado">Confirmado</b></span>
                <span class="row" data-ba-row><i>10:15</i>Bruno Lima<b class="st st-agendado">Agendado</b></span>
              </div>
            </div>
            <div class="mod" data-ba-module="confirm">
              <span class="mod-title"><MessageCircle :size="13" /> Confirmações</span>
              <div class="mod-confirm" data-ba-row>
                <span class="ring"><CheckCheck :size="16" /></span>
                <div><strong>Lembretes enviados</strong><small>Respostas já na agenda</small></div>
              </div>
            </div>
            <div class="mod" data-ba-module="fin">
              <span class="mod-title"><Wallet :size="13" /> Financeiro</span>
              <div class="mod-fin" data-ba-row>
                <div><small>Receita do mês</small><strong>R$ 48.320</strong></div>
                <span class="bars"><i style="--h: 40%"></i><i style="--h: 62%"></i><i style="--h: 50%"></i><i style="--h: 78%"></i><i style="--h: 92%"></i></span>
              </div>
            </div>
            <div class="mod" data-ba-module="pront">
              <span class="mod-title"><FolderOpen :size="13" /> Prontuário</span>
              <div class="mod-chips" data-ba-row>
                <span>Prontuario</span><span>Procedimentos</span><span>Termos</span><span>Imagens e Anexos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

    <BenefitTiles />
  </section>
</template>

<style scoped>
.ba { --ba-bg: #f7f9fd; position: relative; background: var(--ba-bg); }

/* O elemento fixado (pin) ocupa a largura toda e não tem margens: o conteúdo
   centralizado fica no filho, para o GSAP não reposicionar ao fixar/soltar. */
.ba-scene { position: relative; width: 100%; }
.ba-scene-inner {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(5rem, 12vh, 8rem) 1.5rem 3rem;
  box-sizing: border-box;
}

.ba-head { max-width: 900px; margin: 0 auto 2.2rem; text-align: center; }
.ba-kicker {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--ad-blue);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ba-title {
  margin: 0;
  color: var(--ad-ink);
  font-size: clamp(2rem, 4.2vw, 3.5rem);
  font-weight: 300;
  line-height: 1.06;
  letter-spacing: -0.035em;
}

/* Palco */
.ba-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 460px;
  padding: 3.5rem 1rem 1.5rem;
  border-radius: 28px;
  background:
    radial-gradient(ellipse 60% 60% at 50% 55%, rgba(0, 87, 255, 0.07), transparent 70%),
    #ffffff;
  border: 1px solid var(--ad-line);
  box-shadow: 0 40px 90px -60px rgba(28, 45, 90, 0.45);
  overflow: hidden;
}

.ba-state {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.ba-state-track {
  position: relative;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  padding: 3px;
  border-radius: 999px;
  background: #f1f4f9;
  font-size: 0.78rem;
  font-weight: 600;
}
.ba-state-knob {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc(50% - 3px);
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(28, 32, 53, 0.12);
  transform: translateX(100%);
}
.ba-state-opt { position: relative; z-index: 1; padding: 0.35rem 0.95rem; color: #8a94a8; text-align: center; }
.ba-state-opt:last-child { color: var(--ad-blue); }
.ba-state-caption { display: grid; color: var(--ad-muted); font-size: 0.82rem; }
.ba-state-caption > * { grid-area: 1 / 1; text-align: right; }
.ba-state-caption > :first-child { opacity: 0; }

.ba-chaos { display: none; position: absolute; inset: 3.4rem 1rem 1rem; z-index: 3; pointer-events: none; }
.ba-bit {
  position: absolute;
  left: var(--x);
  top: var(--y);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e6e8ee;
  box-shadow: 0 14px 30px -14px rgba(28, 32, 53, 0.35);
  color: #3f475c;
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
  will-change: transform;
}
.bit-note { background: #fff8db; border-color: #f6e7a6; color: #6b5a12; }
.bit-note.is-alert { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
.bit-chat { background: #fff; padding-right: 2.2rem; }
.bit-chat svg { color: #25d366; }
.bit-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.72rem;
  box-shadow: 0 0 0 3px #fff;
}
.bit-bubble { background: #d9fdd3; border-color: #c4efbd; border-radius: 12px 12px 12px 3px; }
.bit-receipt { background: #fff; border-style: dashed; }
.bit-file svg { color: #5b6478; }
.bit-clock { background: #1c2035; border-color: #1c2035; color: #fff; font-family: var(--fonte-mono); font-size: 0.75rem; }

/* Painel organizado */
.ba-board {
  font-size: 1.06rem;
  position: relative;
  z-index: 2;
  width: min(100%, 800px);
  padding: 16px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(28, 32, 53, 0.07);
  box-shadow: 0 50px 90px -50px rgba(28, 45, 90, 0.5), 0 0 0 8px rgba(0, 87, 255, 0.03);
}
.board-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 0 4px; }
.board-top strong { flex: 1; color: var(--ad-ink); font-size: 0.95rem; font-weight: 600; }
.board-ok { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; background: #f0fdf4; color: #16a34a; font-size: 0.74rem; font-weight: 600; }
.board-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 10px; }
.mod {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: #fafbfd;
  border: 1px solid #eef1f6;
}
.mod-title { display: inline-flex; align-items: center; gap: 6px; color: #5b6478; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.02em; }
.mod-title svg { color: var(--ad-blue); }
.mod-rows { display: flex; flex-direction: column; gap: 6px; }
.row { display: flex; align-items: center; gap: 10px; padding: 7px 9px; border-radius: 9px; background: #fff; border: 1px solid #eef1f6; color: var(--ad-ink); font-size: 0.8rem; }
.row i { color: #8a94a8; font-style: normal; font-family: var(--fonte-mono); font-size: 0.72rem; }
.row b { margin-left: auto; }
.st { padding: 2px 8px; border-radius: 999px; font-size: 0.66rem; font-weight: 600; white-space: nowrap; }
.st-agendado { background: #eef2ff; color: #3b82f6; }
.st-confirmado { background: #fefce8; color: #a16207; }
.st-realizado { background: #f0fdf4; color: #16a34a; }
.mod-confirm { display: flex; align-items: center; gap: 12px; }
.mod-confirm strong { display: block; color: var(--ad-ink); font-size: 0.86rem; font-weight: 600; }
.mod-confirm small { color: var(--ad-muted); font-size: 0.74rem; }
.ring { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #fefce8; color: #eab308; box-shadow: inset 0 0 0 2px #fde68a; flex: none; }
.mod-fin { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; }
.mod-fin small { display: block; color: var(--ad-muted); font-size: 0.72rem; }
.mod-fin strong { color: var(--ad-ink); font-size: 1.15rem; font-weight: 600; letter-spacing: -0.02em; }
.bars { display: flex; align-items: flex-end; gap: 4px; height: 38px; }
.bars i { width: 8px; height: var(--h); border-radius: 3px; background: #cfe0ff; }
.bars i:last-child { background: var(--ad-blue); }
.mod-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.mod-chips span { padding: 4px 10px; border-radius: 999px; background: #eef4ff; color: var(--ad-blue); font-size: 0.72rem; font-weight: 600; }
.board-grid > .mod:first-child { grid-row: span 2; }

/* Com movimento */
.ba.is-motion .ba-scene-inner { height: 100vh; height: 100svh; padding-top: calc(60px + 2rem); padding-bottom: 1.5rem; }
.ba.is-motion .ba-stage { flex: 1; min-height: 0; }
.ba.is-motion .ba-chaos { display: block; }
.ba.is-motion .ba-state-knob { transform: none; }
.ba.is-motion .ba-state-opt:first-of-type { color: #b91c1c; }
.ba.is-motion .ba-state-opt:last-child { color: #8a94a8; }
.ba.is-motion .ba-state-caption > :first-child { opacity: 1; }
.ba.is-motion .ba-state-caption > :last-child { opacity: 0; }

@media (max-width: 899px) {
  .ba-scene-inner { padding-top: 4.5rem; }
  .ba-head { margin-bottom: 1.4rem; text-align: left; }
  .ba-kicker { font-size: 0.7rem; margin-bottom: 0.6rem; }
  .ba-title { font-size: clamp(1.65rem, 7vw, 2.3rem); }
  .ba-stage { min-height: 420px; padding: 3.2rem 0.6rem 0.8rem; border-radius: 22px; }
  .ba-state-caption { display: none; }
  .ba-bit { left: calc(var(--x) * 0.58); font-size: 0.72rem; padding: 0.45rem 0.6rem; }
  .ba-bit.no-mobile { display: none; }
  .ba-board { padding: 10px; border-radius: 16px; }
  .board-grid { grid-template-columns: 1fr 1fr; gap: 7px; }
  .board-grid > .mod:first-child { grid-row: auto; grid-column: 1 / -1; }
  .mod { padding: 9px; gap: 7px; }
  .row { padding: 6px 7px; font-size: 0.72rem; gap: 6px; }
  .row:nth-child(3) { display: none; }
  .mod-confirm { flex-direction: column; align-items: flex-start; gap: 6px; }
  .mod-confirm strong { font-size: 0.76rem; }
  .mod-confirm small { display: none; }
  .mod-fin { flex-direction: column; align-items: flex-start; }
  .mod-fin strong { font-size: 0.95rem; }
  .bars { display: none; }
  .board-grid > .mod:last-child { grid-column: 1 / -1; }
  .ba.is-motion .ba-scene-inner { padding-top: calc(60px + 1rem); padding-bottom: 5.5rem; }
}
</style>
