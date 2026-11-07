<script setup>
import { ArrowRight, Check, CheckCheck, Plus, Search } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import AppButton from '@/components/global/AppButton.vue'
import AppSidebarMock from './AppSidebarMock.vue'
import logoWhatsapp from '@/assets/logo_whatsapp.svg'
import fotoMilena from '@/assets/imgs/foto_milena.webp?w=48&h=48&fit=cover&position=center&format=webp&quality=75'
import fotoManu from '@/assets/imgs/foto_manu.webp?w=48&h=48&fit=cover&position=center&format=webp&quality=75'
import fotoMedica from '@/assets/imgs/foto_medica.webp?w=48&h=48&fit=cover&position=center&format=webp&quality=75'

// Réplica da tela de Calendário do app (mesma navegação, cores de status e
// nomenclatura). A entrada é feita em CSS para começar antes da hidratação.
const days = [
  { label: 'SEG', n: 13 },
  { label: 'TER', n: 14 },
  { label: 'QUA', n: 15 },
  { label: 'QUI', n: 16 },
  { label: 'SEX', n: 17, today: true },
]
const hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']

// col: 1..5 · start/span em blocos de 30 min a partir das 08:00
const appointments = [
  { col: 1, start: 0, span: 2, name: 'Ana Luiza Lima', time: '08:00 – 09:00', status: 'realizado' },
  { col: 1, start: 3, span: 2, name: 'Bruno Lima', time: '09:30 – 10:10', status: 'realizado' },
  { col: 2, start: 1, span: 2, name: 'Eduardo Barros', time: '08:30 – 09:20', status: 'cancelado' },
  { col: 2, start: 4, span: 2, name: 'Fernanda Barros', time: '10:00 – 10:50', status: 'confirmado' },
  { col: 3, start: 2, span: 3, name: 'Helena Martins', time: '09:00 – 10:20', status: 'agendado', flips: true },
  { col: 3, start: 6, span: 2, name: 'Isabela Ribeiro', time: '11:00 – 11:50', status: 'agendado' },
  { col: 4, start: 0, span: 2, name: 'Natália Ferreira', time: '08:00 – 08:45', status: 'confirmado' },
  { col: 4, start: 5, span: 2, name: 'Rafael Ribeiro', time: '10:30 – 11:20', status: 'agendado' },
  { col: 5, start: 1, span: 2, name: 'Camila Souza', time: '08:30 – 09:20', status: 'agendado', isNew: true },
  { col: 5, start: 5, span: 2, name: 'Paula Prado', time: '10:30 – 11:15', status: 'confirmado' },
]

</script>

<template>
  <section class="hero" data-hero data-hide-sticky aria-labelledby="hero-title">
    <div class="hero-backdrop" aria-hidden="true">
      <span class="hero-grid"></span>
      <span class="hero-glow"></span>
    </div>

    <div class="hero-inner">
      <div class="hero-copy" data-hero-copy>
        <div class="hero-trust">
          <span class="hero-avatars">
            <img :src="fotoMilena" alt="" width="22" height="22" decoding="async" />
            <img :src="fotoManu" alt="" width="22" height="22" decoding="async" />
            <img :src="fotoMedica" alt="" width="22" height="22" decoding="async" />
          </span>
          <span>Mais de <strong>100 profissionais</strong> confiam</span>
        </div>

        <p class="hero-eyebrow">Sistema de gestão para clínicas e consultórios</p>

        <h1 id="hero-title" class="hero-title">
          <span class="ht-line">Sua clínica mais organizada.</span>
          <span class="ht-line ht-accent">
            Seu tempo mais
            <span class="ht-mark">valorizado.<svg viewBox="0 0 220 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11 C 60 3, 150 3, 217 9" /></svg></span>
          </span>
        </h1>

        <p class="hero-sub">
          Agendamentos, confirmações, prontuários e gestão em um só lugar.
          Menos tarefas manuais, mais tempo para seus pacientes.
        </p>

        <div class="hero-ctas">
          <AppButton to="/register" variant="primary" size="lg" class="hero-cta-main" data-track-click="hero_register_comecar_agora">
            Começar agora <ArrowRight :size="18" />
          </AppButton>
          <AppButton href="https://wa.me/5511921923978" variant="outline" size="lg" class="hero-cta-alt" data-track-click="hero_whatsapp_fale_com_equipe" target="_blank" rel="noopener noreferrer">
            Fale com nossa equipe
          </AppButton>
        </div>
        <p class="hero-login">
          Já tem conta?
          <RouterLink to="/login" data-track-click="hero_login">Entrar na conta</RouterLink>
        </p>
      </div>

      <div class="hero-stage" data-hero-stage>
        <div class="hero-tilt" data-hero-tilt>
          <!-- Janela do app -->
          <div class="app-window" role="img" aria-label="Demonstração da agenda do Agenda Doutor: consultas da semana sendo organizadas e uma confirmação recebida pelo WhatsApp">
            <div class="win-bar" aria-hidden="true">
              <i></i><i></i><i></i>
              <span class="win-url">app.agendadoutor.com/calendario</span>
            </div>
            <div class="win-body" aria-hidden="true">
              <AppSidebarMock class="win-side" active="Calendário" />

              <div class="win-main">
                <div class="cal-top">
                  <span class="cal-search"><Search :size="11" /> Pesquisar...</span>
                  <span class="cal-toggle"><b>Semana</b><span>Mês</span></span>
                </div>
                <div class="cal">
                  <div class="cal-head">
                    <span></span>
                    <span v-for="d in days" :key="d.n" class="cal-day" :class="{ 'is-today': d.today }">
                      <small>{{ d.label }}</small>{{ d.n }}
                    </span>
                  </div>
                  <div class="cal-grid">
                    <div class="cal-hours">
                      <span v-for="h in hours" :key="h">{{ h }}</span>
                    </div>
                    <div v-for="(d, di) in days" :key="d.n" class="cal-col" :class="`col-${di + 1}`" :style="{ '--d': di + 1 }"></div>
                    <div
                      v-for="(a, i) in appointments"
                      :key="a.name"
                      class="appt"
                      :class="[`st-${a.status}`, `col-${a.col}`, { 'is-new': a.isNew, 'is-flip': a.flips }]"
                      :style="{ '--col': a.col, '--start': a.start, '--span': a.span, '--i': i }"
                    >
                      <strong>{{ a.name }}</strong>
                      <small>{{ a.time }}</small>
                      <span v-if="a.flips" class="appt-confirmed st-confirmado"><strong>{{ a.name }}</strong><small>{{ a.time }}</small></span>
                    </div>
                    <span class="cal-cursor"><Plus :size="12" /></span>
                  </div>
                </div>
                <div class="cal-legend">
                  <span><i class="dot d-agendado"></i>Agendado</span>
                  <span><i class="dot d-confirmado"></i>Confirmado</span>
                  <span><i class="dot d-realizado"></i>Realizado</span>
                  <span><i class="dot d-cancelado"></i>Cancelado</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensagem automática no WhatsApp -->
          <div class="float float-whats" aria-hidden="true">
            <header>
              <img :src="logoWhatsapp" alt="" width="16" height="16" />
              <span>Mensagem automática · 24h antes</span>
            </header>
            <p class="fw-out">Olá, Helena! Sua consulta é amanhã às 09:00. Responda <b>1</b> para confirmar.</p>
            <p class="fw-in">1 <CheckCheck :size="13" /></p>
          </div>

          <!-- Confirmação recebida -->
          <div class="float float-confirm" aria-hidden="true">
            <span class="fc-icon"><Check :size="14" /></span>
            <span><strong>Helena Martins</strong> confirmou a consulta</span>
          </div>

          <!-- Nova consulta -->
          <div class="float float-new" aria-hidden="true">
            <span class="fn-dot"></span>
            Nova consulta · Sex 08:30
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: calc(80px + clamp(2rem, 6vh, 4.5rem)) 0 clamp(4rem, 9vh, 7rem);
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(180deg, #ffffff 0%, #f6f9ff 62%, #f3f6fc 100%);
}

.hero-backdrop { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 87, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 87, 255, 0.055) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 60% at 62% 38%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 62% 38%, #000 0%, transparent 75%);
}
.hero-glow {
  position: absolute;
  width: min(900px, 90vw);
  aspect-ratio: 1;
  right: -12%;
  top: 4%;
  background: radial-gradient(circle, rgba(27, 105, 255, 0.16) 0%, rgba(27, 105, 255, 0) 62%);
}

.hero-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.18fr);
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
}

/* Texto */
.hero-copy { position: relative; z-index: 2; }

.hero-trust {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.85rem 0.3rem 0.35rem;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid var(--ad-line);
  box-shadow: 0 6px 18px rgba(28, 32, 53, 0.05);
  color: var(--ad-ink-soft);
  font-size: 0.85rem;
  animation: hero-rise 0.7s var(--ease-out) both;
}
.hero-trust strong { color: var(--ad-ink); font-weight: 600; }
.hero-avatars { display: flex; }
.hero-avatars img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  margin-left: -7px;
}
.hero-avatars img:first-child { margin-left: 0; }

.hero-eyebrow {
  margin: 1.6rem 0 0.9rem;
  color: var(--ad-blue);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  animation: hero-rise 0.7s 0.08s var(--ease-out) both;
}

.hero-title {
  margin: 0;
  font-size: clamp(2.6rem, 4.6vw, 4.1rem);
  line-height: 1.02;
  font-weight: 300;
  letter-spacing: -0.04em;
  color: var(--ad-ink);
}
.ht-line {
  display: block;
  animation: hero-line 0.9s var(--ease-out) both;
  animation-delay: 0.14s;
}
.ht-accent {
  animation-delay: 0.26s;
  color: var(--ad-blue);
}
.ht-mark { position: relative; display: inline-block; white-space: nowrap; }
.ht-mark svg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.16em;
  width: 100%;
  height: 0.28em;
  overflow: visible;
}
.ht-mark path {
  fill: none;
  stroke: var(--ad-blue-2);
  stroke-width: 3.5;
  stroke-linecap: round;
  opacity: 0.45;
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
  animation: hero-draw 0.9s 1s var(--ease-in-out) forwards;
}

.hero-sub {
  max-width: 34rem;
  margin: 1.6rem 0 2rem;
  color: var(--ad-ink-soft);
  font-size: clamp(1.05rem, 1.35vw, 1.2rem);
  line-height: 1.6;
  animation: hero-rise 0.7s 0.4s var(--ease-out) both;
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  animation: hero-rise 0.7s 0.52s var(--ease-out) both;
}
.hero-ctas :deep(.app-button) { border-radius: 999px; padding: 0 1.6rem; height: 52px; }
.hero-cta-main { box-shadow: 0 12px 28px -10px rgba(0, 87, 255, 0.6) !important; }
.hero-cta-main :deep(svg) { transition: transform 0.25s var(--ease-out); }
.hero-cta-main:hover :deep(svg) { transform: translateX(3px); }

.hero-login {
  margin: 1.1rem 0 0;
  color: var(--ad-muted);
  font-size: 0.92rem;
  animation: hero-rise 0.7s 0.6s var(--ease-out) both;
}
.hero-login a {
  color: var(--ad-blue);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 87, 255, 0.25);
  transition: border-color 0.2s;
}
.hero-login a:hover { border-color: var(--ad-blue); }

/* Palco do produto */
.hero-stage {
  position: relative;
  margin-right: clamp(-4rem, -3vw, -1rem);
  perspective: 1600px;
}
.hero-tilt { position: relative; transform-style: preserve-3d; will-change: transform; }

.app-window {
  position: relative;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(28, 32, 53, 0.08);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 50px 100px -30px rgba(28, 45, 90, 0.35),
    0 24px 48px -24px rgba(0, 87, 255, 0.25);
  overflow: hidden;
  animation: hero-stage 1.1s 0.2s var(--ease-out) both;
}

.win-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-bottom: 1px solid #eef1f6;
  background: #fbfcfe;
}
.win-bar i { width: 9px; height: 9px; border-radius: 50%; background: #e3e7ef; }
.win-url {
  margin: 0 auto;
  padding: 3px 14px;
  border-radius: 6px;
  background: #f1f4f9;
  color: #8a94a8;
  font-size: 0.68rem;
  font-family: var(--fonte-mono);
}

.win-body { display: grid; grid-template-columns: 164px 1fr; min-height: 430px; }

.win-side { --sbm-size: 10.5px; }

.win-main { display: flex; flex-direction: column; padding: 10px 12px 12px; min-width: 0; }
.cal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cal-search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 46%;
  padding: 5px 10px;
  border: 1px solid #e8ecf3;
  border-radius: 7px;
  color: #a0a8b8;
  font-size: 0.64rem;
}
.cal-toggle {
  display: inline-flex;
  padding: 2px;
  border-radius: 7px;
  background: #f1f4f9;
  font-size: 0.62rem;
  color: #6b7488;
}
.cal-toggle b, .cal-toggle span { padding: 3px 10px; border-radius: 5px; }
.cal-toggle b { background: #fff; color: var(--ad-blue); font-weight: 600; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06); }

.cal { --row: 34px; flex: 1; }
.cal-head {
  display: grid;
  grid-template-columns: 36px repeat(5, 1fr);
  padding-bottom: 6px;
  border-bottom: 1px solid #eef1f6;
}
.cal-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--ad-ink);
  font-size: 0.95rem;
  line-height: 1.1;
}
.cal-day small { color: #8a94a8; font-size: 0.52rem; letter-spacing: 0.06em; }
.cal-day.is-today { color: var(--ad-blue); font-weight: 600; }

.cal-grid {
  position: relative;
  display: grid;
  grid-template-columns: 36px repeat(5, 1fr);
  grid-template-rows: repeat(8, var(--row));
  background-image: linear-gradient(#f0f3f8 1px, transparent 1px);
  background-size: 100% var(--row);
}
.cal-hours { grid-column: 1; grid-row: 1 / -1; display: grid; grid-template-rows: repeat(8, var(--row)); }
.cal-hours span { color: #9aa3b5; font-size: 0.52rem; padding-top: 2px; }
.cal-col { grid-column: calc(var(--d) + 1); grid-row: 1 / -1; border-left: 1px solid #f0f3f8; }

.appt {
  --c: #3b82f6;
  --bg: #eef2ff;
  --pill: #3b82f6;
  --bd: #bfdbfe;
  grid-column: calc(var(--col) + 1);
  grid-row: calc(var(--start) + 1) / span var(--span);
  position: relative;
  margin: 2px;
  padding: 5px 6px 4px 14px;
  border-radius: 7px;
  background: var(--bg);
  box-shadow: inset 0 0 0 1px var(--bd);
  color: var(--c);
  text-align: left;
  overflow: hidden;
  animation: appt-in 0.55s var(--ease-back) both;
  animation-delay: calc(0.75s + var(--i) * 0.09s);
}
.appt::before,
.appt-confirmed::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 5px;
  bottom: 5px;
  width: 3px;
  border-radius: 999px;
  background: var(--pill);
}
.appt strong { display: block; font-size: 0.6rem; font-weight: 600; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.appt small { display: block; margin-top: 1px; font-size: 0.54rem; opacity: 0.7; white-space: nowrap; }

.st-agendado { --c: #3b82f6; --bg: #eef2ff; --pill: #3b82f6; --bd: #bfdbfe; }
.st-confirmado { --c: #a16207; --bg: #fefce8; --pill: #eab308; --bd: #fde68a; }
.st-realizado { --c: #16a34a; --bg: #f0fdf4; --pill: #16a34a; --bd: #86efac; }
.st-cancelado { --c: #dc2626; --bg: #fef2f2; --pill: #dc2626; --bd: #fecaca; opacity: 0.8; }
.st-cancelado strong, .st-cancelado small { text-decoration: line-through; }

.appt.is-new { animation: appt-drop 0.7s 2.05s var(--ease-back) both; }

.appt-confirmed {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 5px 6px 4px 14px;
  border-radius: inherit;
  background: var(--bg);
  box-shadow: inset 0 0 0 1px var(--bd);
  color: var(--c);
  clip-path: inset(0 100% 0 0);
  animation: appt-flip 0.6s 3.5s var(--ease-in-out) forwards;
}
.appt.is-flip::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 8px;
  box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.45);
  animation: appt-ring 1.1s 3.6s ease-out both;
  pointer-events: none;
}

.cal-cursor {
  grid-column: 6;
  grid-row: 2 / span 2;
  justify-self: center;
  align-self: center;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--ad-blue);
  color: #fff;
  box-shadow: 0 6px 14px rgba(0, 87, 255, 0.4);
  opacity: 0;
  animation: cursor-tap 0.9s 1.5s var(--ease-out) both;
  pointer-events: none;
}

.cal-legend {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  color: #6b7488;
  font-size: 0.56rem;
}
.cal-legend span { display: inline-flex; align-items: center; gap: 4px; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.d-agendado { background: #3b82f6; }
.d-confirmado { background: #eab308; }
.d-realizado { background: #16a34a; }
.d-cancelado { background: #ef4444; }

/* Cartões flutuantes */
.float {
  text-align: left;
  position: absolute;
  z-index: 3;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(28, 32, 53, 0.07);
  box-shadow: 0 24px 50px -18px rgba(28, 45, 90, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.float-whats {
  left: -3%;
  bottom: -7%;
  width: 250px;
  padding: 12px;
  transform: translateZ(60px);
  animation: float-in-left 0.7s 2.55s var(--ease-out) both, bob 6s 3.4s ease-in-out infinite;
}
.float-whats header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #5b6478;
  font-size: 0.66rem;
  font-weight: 600;
}
.fw-out, .fw-in {
  margin: 0;
  padding: 7px 9px;
  border-radius: 10px;
  font-size: 0.7rem;
  line-height: 1.4;
  color: var(--ad-ink);
}
.fw-out { background: #f1f5f9; border-top-left-radius: 3px; }
.fw-in {
  display: flex;
  align-items: center;
  gap: 4px;
  width: max-content;
  margin: 6px 0 0 auto;
  background: #d9fdd3;
  border-top-right-radius: 3px;
  font-weight: 600;
  animation: bubble-in 0.4s 3.15s var(--ease-back) both;
}
.fw-in svg { color: #53bdeb; }

.float-confirm {
  right: 6%;
  top: 22%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px 9px 9px;
  color: #5b6478;
  font-size: 0.74rem;
  transform: translateZ(80px);
  animation: float-in-up 0.6s 3.75s var(--ease-back) both, bob 7s 4.5s ease-in-out infinite reverse;
}
.float-confirm strong { color: var(--ad-ink); font-weight: 600; }
.fc-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fefce8;
  color: #eab308;
  border: 1px solid #fde68a;
}

.float-new {
  right: 3%;
  top: -4%;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  color: var(--ad-ink);
  font-size: 0.7rem;
  font-weight: 600;
  transform: translateZ(40px);
  animation: float-in-up 0.6s 2.15s var(--ease-back) both;
}
.fn-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ad-blue); box-shadow: 0 0 0 4px rgba(0, 87, 255, 0.14); }

/* Keyframes */
@keyframes hero-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes hero-line {
  from { opacity: 0; transform: translateY(0.45em); clip-path: inset(0 0 100% 0); }
  to { opacity: 1; transform: none; clip-path: inset(0 0 -20% 0); }
}
@keyframes hero-draw { to { stroke-dashoffset: 0; } }
@keyframes hero-stage {
  from { opacity: 0; transform: translateY(50px) rotateX(10deg) scale(0.96); }
  to { opacity: 1; transform: none; }
}
@keyframes appt-in { from { opacity: 0; transform: scale(0.82); } to { opacity: 1; transform: none; } }
@keyframes appt-drop {
  0% { opacity: 0; transform: translateY(-26px) scale(0.9); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}
@keyframes appt-flip { to { clip-path: inset(0 0 0 0); } }
@keyframes appt-ring {
  0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.45); }
  100% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
}
@keyframes cursor-tap {
  0% { opacity: 0; transform: translate(30px, 30px) scale(0.6); }
  55% { opacity: 1; transform: none; }
  75% { transform: scale(0.82); }
  100% { opacity: 0; transform: scale(1.3); }
}
@keyframes float-in-left { from { opacity: 0; transform: translate3d(-30px, 10px, 60px); } to { opacity: 1; transform: translate3d(0, 0, 60px); } }
@keyframes float-in-up { from { opacity: 0; transform: translateY(16px) scale(0.92); } to { opacity: 1; transform: none; } }
@keyframes bubble-in { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
@keyframes bob { 0%, 100% { translate: 0 0; } 50% { translate: 0 -8px; } }

/* Responsivo */
@media (max-width: 1080px) {
  .hero-inner { grid-template-columns: minmax(0, 1fr); text-align: center; }
  .hero-copy { display: flex; flex-direction: column; align-items: center; }
  .hero-sub { margin-left: auto; margin-right: auto; }
  .hero-ctas { justify-content: center; }
  .hero-stage { margin: 1rem auto 0; width: min(100%, 860px); }
  .hero-glow { right: 50%; transform: translateX(50%); top: 38%; }
}

@media (max-width: 720px) {
  .hero { padding-top: calc(80px + 1.5rem); padding-bottom: 3.5rem; }
  .hero-eyebrow { font-size: 0.72rem; margin-top: 1.3rem; }
  .hero-title { font-size: clamp(2.3rem, 10.4vw, 3rem); }
  .ht-mark { white-space: normal; }
  .hero-sub { margin: 1.2rem 0 1.6rem; font-size: 1.02rem; }
  .hero-ctas { flex-direction: column; width: 100%; }
  .hero-ctas :deep(.app-button) { width: 100%; }
  .win-body { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  .win-side { display: none; }
  .cal { --row: 30px; }
  .cal-head, .cal-grid { grid-template-columns: 30px repeat(5, 1fr); }
  .cal-head > :nth-child(2), .cal-head > :nth-child(3) { display: none; }
  .cal-head { grid-template-columns: 30px repeat(3, 1fr); }
  .cal-grid { grid-template-columns: 30px repeat(3, 1fr); }
  .cal-grid > .col-1, .cal-grid > .col-2 { display: none; }
  .cal-col { grid-column: calc(var(--d) - 1); }
  .appt { grid-column: calc(var(--col) - 1); }
  .cal-cursor { grid-column: 4; }
  .cal-legend { flex-wrap: wrap; gap: 8px; }
  .float-whats { left: -2%; bottom: -12%; width: 210px; }
  .float-confirm { right: -2%; top: auto; bottom: 44%; font-size: 0.68rem; }
  .float-new { right: 2%; top: -6%; }
  .hero-stage { margin-bottom: 3.5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .hero *, .hero *::before, .hero *::after {
    animation-duration: 0.001s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
