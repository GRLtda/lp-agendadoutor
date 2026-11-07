<script setup>
import { Check, CheckCheck } from 'lucide-vue-next'
import logoBrand from '@/assets/logo_brand.svg'
import logoWhatsapp from '@/assets/logo_whatsapp.svg'

// Cena fixada (pin + scrub, em useHomeMotion): mensagens pendentes se espalham,
// depois se alinham e viram as linhas do painel de confirmações. Sem movimento,
// a cena mostra direto o painel resolvido.
const words = 'Você ainda perde tempo confirmando cada consulta?'.split(' ')

// sx/sy: deslocamento da mensagem (em % do palco) no estado "bagunçado".
const messages = [
  { initial: 'N', name: 'Natália Ferreira', text: 'Oi! Minha consulta é amanhã mesmo? 🙂', at: '08:12', slot: '08:00', sx: -18, sy: -6, r: -5, unread: 2 },
  { initial: 'B', name: 'Bruno Lima', text: 'Consigo mudar pra tarde?', at: '08:31', slot: '08:30', sx: 22, sy: -14, r: 4, unread: 1 },
  { initial: 'H', name: 'Helena Martins', text: 'Esqueci o horário 😅', at: '08:40', slot: '09:00', sx: -26, sy: 4, r: 3, unread: 3 },
  { initial: 'C', name: 'Camila Souza', text: 'Que horas mesmo?', at: '09:02', slot: '09:30', sx: 16, sy: 10, r: -4, unread: 1 },
  { initial: 'P', name: 'Paula Prado', text: 'Ainda precisa confirmar?', at: '09:15', slot: '10:30', sx: -6, sy: 16, r: 6, unread: 2 },
]
</script>

<template>
  <section class="cs" data-confirm-story aria-labelledby="cs-title">
    <div class="cs-inner">
      <div class="cs-copy">
        <div class="cs-text cs-problem" data-cs-problem>
          <span class="cs-kicker">A rotina sem automação</span>
          <h2 id="cs-title" class="cs-headline" data-cs-words>
            <span v-for="(w, i) in words" :key="i" class="w">{{ w + ' ' }}</span>
          </h2>
          <p>Uma mensagem por vez, entre um paciente e outro, e sempre alguém sem resposta.</p>
        </div>
        <div class="cs-text cs-solution" data-cs-solution>
          <span class="cs-kicker is-blue">Com o Agenda Doutor</span>
          <p class="cs-headline">
            Seu tempo é para cuidar dos pacientes.
            <span class="cs-accent">As confirmações, deixa com a gente.</span>
          </p>
          <p>Lembretes automáticos pelo WhatsApp 24 horas e 2 horas antes da consulta. Quando o paciente confirma, a agenda já mostra.</p>
        </div>
      </div>

      <div class="cs-visual" data-cs-visual aria-hidden="true">
        <div class="cs-pending" data-cs-pending>
          <img :src="logoWhatsapp" alt="" width="14" height="14" />
          <span class="cs-pending-text"><b data-cs-count>0</b> mensagens sem resposta</span>
          <span class="cs-pending-ok"><Check :size="13" /> Tudo em dia</span>
        </div>

        <div class="cs-panel" data-cs-panel>
          <header class="cs-head" data-cs-chrome>
            <img :src="logoBrand" alt="" width="12" height="21" />
            <div>
              <strong>Confirmações de amanhã</strong>
              <small>Sexta, 17 · enviadas automaticamente</small>
            </div>
            <span class="cs-done"><b data-cs-done>5</b>/5</span>
          </header>
          <div class="cs-progress" data-cs-chrome><span data-cs-bar></span></div>

          <ul class="cs-list">
            <li
              v-for="m in messages"
              :key="m.name"
              class="cs-item"
              data-cs-item
              :data-sx="m.sx"
              :data-sy="m.sy"
              :data-r="m.r"
            >
              <div class="cs-bubble" data-cs-bubble>
                <span class="cs-avatar">{{ m.initial }}</span>
                <div class="cs-bubble-body">
                  <strong>{{ m.name }}</strong>
                  <p>{{ m.text }}</p>
                </div>
                <div class="cs-bubble-meta">
                  <small>{{ m.at }}</small>
                  <span class="cs-unread">{{ m.unread }}</span>
                </div>
              </div>

              <div class="cs-row" data-cs-row>
                <span class="cs-slot">{{ m.slot }}</span>
                <span class="cs-row-name">{{ m.name }}</span>
                <span class="cs-status">
                  <span class="st st-agendado" data-cs-from>Agendado</span>
                  <span class="st st-confirmado" data-cs-to><CheckCheck :size="12" /> Confirmado</span>
                </span>
              </div>
            </li>
          </ul>

          <footer class="cs-foot" data-cs-chrome>
            <span class="cs-foot-dot"></span>
            Lembrete 24h antes enviado pelo WhatsApp da clínica
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cs {
  --cs-bg: #ffffff;
  position: relative;
  background: var(--cs-bg);
  overflow: hidden;
}

.cs-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(4rem, 10vh, 7rem) 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
}

.cs-copy { display: flex; flex-direction: column; gap: 3rem; }

.cs-kicker {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--ad-muted);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.cs-kicker.is-blue { color: var(--ad-blue); }

.cs-headline {
  margin: 0 0 1.1rem;
  color: var(--ad-ink);
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -0.035em;
}
.cs-accent { color: var(--ad-blue); }
.cs-text > p:last-child {
  max-width: 30rem;
  margin: 0;
  color: var(--ad-ink-soft);
  font-size: 1.08rem;
  line-height: 1.6;
}

/* Palco */
.cs-visual { position: relative; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

.cs-pending {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid var(--ad-line);
  box-shadow: 0 10px 24px -12px rgba(28, 32, 53, 0.25);
  color: var(--ad-ink-soft);
  font-size: 0.82rem;
}
.cs-pending b { color: #dc2626; font-variant-numeric: tabular-nums; }
.cs-pending-text { display: none; }
.cs-pending-ok { display: inline-flex; align-items: center; gap: 4px; color: #16a34a; font-weight: 600; }

.cs-panel {
  position: relative;
  width: min(100%, 470px);
  padding: 18px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(28, 32, 53, 0.07);
  box-shadow: 0 40px 80px -36px rgba(28, 45, 90, 0.4);
}

.cs-head { display: flex; align-items: center; gap: 12px; }
.cs-head div { flex: 1; display: flex; flex-direction: column; }
.cs-head strong { color: var(--ad-ink); font-size: 0.98rem; font-weight: 600; }
.cs-head small { color: var(--ad-muted); font-size: 0.76rem; }
.cs-done {
  padding: 4px 10px;
  border-radius: 999px;
  background: #fefce8;
  color: #a16207;
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.cs-progress {
  height: 4px;
  margin: 14px 0 12px;
  border-radius: 999px;
  background: #f1f4f9;
  overflow: hidden;
}
.cs-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f59e0b, #eab308);
  transform-origin: left;
}

.cs-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.cs-item { display: grid; }
.cs-item > * { grid-area: 1 / 1; }

.cs-bubble {
  display: none;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(28, 32, 53, 0.08);
  box-shadow: 0 16px 34px -16px rgba(28, 45, 90, 0.35);
}
.cs-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  height: 34px;
  border-radius: 50%;
  background: #e8efff;
  color: var(--ad-blue);
  font-weight: 600;
  font-size: 0.85rem;
}
.cs-bubble-body { flex: 1; min-width: 0; }
.cs-bubble-body strong { display: block; color: var(--ad-ink); font-size: 0.8rem; font-weight: 600; }
.cs-bubble-body p { margin: 1px 0 0; color: #5b6478; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cs-bubble-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.cs-bubble-meta small { color: #25a35a; font-size: 0.68rem; font-weight: 600; }
.cs-unread {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #25d366;
  color: #fff;
  font-size: 0.64rem;
  font-weight: 700;
}

.cs-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 12px;
  background: #fafbfd;
  border: 1px solid #eef1f6;
}
.cs-slot { color: var(--ad-muted); font-family: var(--fonte-mono); font-size: 0.76rem; }
.cs-row-name { flex: 1; color: var(--ad-ink); font-size: 0.86rem; font-weight: 500; }
.cs-status { display: grid; justify-items: end; }
.cs-status > * { grid-area: 1 / 1; }
.st {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}
.st-agendado { background: #eef2ff; color: #3b82f6; visibility: hidden; }
.st-confirmado { background: #fefce8; color: #a16207; border: 1px solid #fde68a; }

.cs-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: var(--ad-muted);
  font-size: 0.76rem;
}
.cs-foot-dot { width: 7px; height: 7px; border-radius: 50%; background: #25d366; box-shadow: 0 0 0 4px rgba(37, 211, 102, 0.15); }

/* Com movimento: palco fixo de uma tela, textos sobrepostos e bolhas visíveis. */
.cs.is-motion .cs-inner { min-height: 100vh; min-height: 100svh; padding-top: 80px; padding-bottom: 2rem; }
.cs.is-motion .cs-copy { display: grid; }
.cs.is-motion .cs-text { grid-area: 1 / 1; }
.cs.is-motion .cs-bubble { display: flex; }
.cs.is-motion .st-agendado { visibility: visible; }
.cs.is-motion .cs-pending-text { display: inline; }
.cs.is-motion .cs-pending-ok { position: absolute; inset: 0; justify-content: center; border-radius: inherit; background: #f0fdf4; }

@media (max-width: 899px) {
  .cs-inner { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; padding-top: 4rem; padding-bottom: 4rem; }
  .cs-copy { gap: 2rem; text-align: center; align-items: center; }
  .cs-text > p:last-child { margin: 0 auto; font-size: 0.98rem; }
  .cs-headline { font-size: clamp(1.7rem, 7.4vw, 2.3rem); margin-bottom: 0.7rem; }
  .cs-kicker { margin-bottom: 0.6rem; font-size: 0.7rem; }
  .cs-panel { padding: 14px; }
  .cs-row { padding: 9px 10px; }
  .cs-row-name { font-size: 0.8rem; }
  .cs-list { gap: 6px; }
  .cs-foot { display: none; }

  .cs.is-motion .cs-inner {
    align-content: start;
    padding-top: calc(60px + 1.25rem);
    padding-bottom: 5.5rem;
    gap: 1.25rem;
  }
  .cs.is-motion .cs-text > p:last-child { display: none; }
}

@media (max-width: 899px) and (min-height: 760px) {
  .cs.is-motion .cs-text > p:last-child { display: block; }
}
</style>
