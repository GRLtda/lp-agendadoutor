<script setup>
import { Check, CheckCheck, FileText, Image, Paperclip, Receipt, StickyNote, Wallet } from 'lucide-vue-next'
import whatsappBg from '@/assets/imgs/whatsapp_bg.jpg'
import logoBrand from '@/assets/logo_brand.svg'
import calendarDesktop from '@/assets/tela_calendario.png?w=1400&format=webp&quality=86'
import calendarMobile from '@/assets/tela_calendario.png?w=820&format=webp&quality=84'
import prontuarioDesktop from '@/assets/imgs/Pronturario.png?w=1300&format=webp&quality=86'
import prontuarioMobile from '@/assets/imgs/Pronturario.png?w=820&format=webp&quality=84'

// Cenas com scroll: cada problema do consultório vira visualmente a solução.
// O movimento (pin + scrub) é montado em useEventMotion; sem ele, a página
// mostra direto a solução de cada cena (movimento reduzido ou JS desligado).
const words = (text) => text.split(' ')
</script>

<template>
  <div class="story" data-story>
    <!-- 01 · Confirmações -->
    <section class="scene" data-scene aria-labelledby="scene-1-title">
      <div class="scene-inner">
        <div class="scene-copy">
          <div class="copy copy-problem" data-copy-problem>
            <span class="kicker">01 · Confirmações</span>
            <h2 id="scene-1-title" class="headline" data-reveal>
              <span v-for="(w, i) in words('Cansado de perder tempo confirmando consultas pelo WhatsApp?')" :key="i" class="w">{{ w + ' ' }}</span>
            </h2>
            <p>Uma por uma, todo dia, entre um paciente e outro.</p>
          </div>
          <div class="copy copy-solution" data-copy-solution>
            <span class="kicker is-solution">Com o Agenda Doutor</span>
            <h2 class="headline">Deixa que o Agenda Doutor cuida disso enquanto você cuida dos seus pacientes.</h2>
            <p>A confirmação sai sozinha pelo WhatsApp e a resposta já atualiza a agenda.</p>
          </div>
        </div>

        <div class="scene-visual">
          <!-- Problema: WhatsApp manual -->
          <div class="problem-layer" data-problem>
            <div class="chat" data-p-item data-x="-40" data-r="-8">
              <header class="chat-head">
                <span class="chat-avatar">R</span>
                <div><strong>Recepção</strong><small>WhatsApp da clínica</small></div>
                <span class="pending-badge"><b data-count-up="27">0</b> sem resposta</span>
              </header>
              <div class="chat-body" :style="{ backgroundImage: `url(${whatsappBg})` }">
                <p class="bubble in" data-p-item data-x="-120" data-r="-14">Oi! Minha consulta é amanhã mesmo? 🙂<small>08:12</small></p>
                <p class="bubble out" data-p-item data-x="110" data-r="10">Bom dia! Confirmando sua consulta de quinta às 9h20, pode ser?<small>08:15 <Check :size="12" /></small></p>
                <p class="bubble in" data-p-item data-x="-90" data-r="-6">Consigo mudar pra tarde?<small>08:31</small></p>
                <p class="bubble in" data-p-item data-x="130" data-r="12">Esqueci o horário 😅<small>08:40</small></p>
                <p class="bubble out" data-p-item data-x="-110" data-r="-10">Vou verificar e já te retorno!<small>09:02 <Check :size="12" /></small></p>
              </div>
            </div>
          </div>

          <!-- Solução: agenda + confirmação automática -->
          <div class="solution-layer" data-solution>
            <div class="app-panel" data-s-frame>
              <header class="app-head">
                <img :src="logoBrand" alt="" width="12" height="21" />
                <strong>Calendário</strong>
                <span class="app-day">QUI <b>16</b></span>
              </header>
              <div class="app-slots">
                <div class="slot" data-s-item>
                  <span class="slot-time">09:00</span>
                  <div class="appt" data-status-card>
                    <strong>Natália Ferreira</strong><small>09:00 – 09:45</small>
                    <span class="status st-agendado" data-status-from>Agendado</span>
                    <span class="status st-confirmado" data-status-to>Confirmado</span>
                  </div>
                </div>
                <div class="slot" data-s-item>
                  <span class="slot-time">09:20</span>
                  <div class="appt" data-status-card>
                    <strong>Helena Martins</strong><small>09:20 – 10:35</small>
                    <span class="status st-agendado" data-status-from>Agendado</span>
                    <span class="status st-confirmado" data-status-to>Confirmado</span>
                  </div>
                </div>
                <div class="slot" data-s-item>
                  <span class="slot-time">10:40</span>
                  <div class="appt" data-status-card>
                    <strong>Ana Luiza Oliveira</strong><small>10:40 – 11:40</small>
                    <span class="status st-agendado" data-status-from>Agendado</span>
                    <span class="status st-confirmado" data-status-to>Confirmado</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="auto-msg" data-s-item>
              <span class="auto-label"><img :src="logoBrand" alt="" width="9" height="16" /> Mensagem automática</span>
              <p>Olá, Helena! Sua consulta é amanhã às 09:20. Responda <b>1</b> para confirmar.</p>
              <p class="auto-reply">1 <CheckCheck :size="14" /></p>
            </div>

            <div class="counter-chip" data-s-item>
              <span>Sem resposta</span>
              <b data-count-down="27">0</b>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 02 · Agenda -->
    <section class="scene" data-scene aria-labelledby="scene-2-title">
      <div class="scene-inner">
        <div class="scene-copy">
          <div class="copy copy-problem" data-copy-problem>
            <span class="kicker">02 · Agenda</span>
            <h2 id="scene-2-title" class="headline" data-reveal>
              <span v-for="(w, i) in words('Agenda no caderno, no WhatsApp e na cabeça?')" :key="i" class="w">{{ w + ' ' }}</span>
            </h2>
            <p>Horário duplicado, encaixe esquecido, paciente esperando.</p>
          </div>
          <div class="copy copy-solution" data-copy-solution>
            <span class="kicker is-solution">Agenda inteligente</span>
            <h2 class="headline">Uma agenda organizada muda muito mais do que seus horários.</h2>
            <p>Semana, mês, profissionais e status de cada consulta em uma tela.</p>
          </div>
        </div>

        <div class="scene-visual">
          <div class="problem-layer notes" data-problem>
            <div class="note" style="--x: 6%; --y: 6%; --r: -7deg" data-p-item data-x="-80" data-r="-20"><StickyNote :size="14" /> Bruno · 9h30?</div>
            <div class="note" style="--x: 48%; --y: 0%; --r: 5deg" data-p-item data-x="90" data-r="18"><StickyNote :size="14" /> Encaixe 10:15 ??</div>
            <div class="note is-alert" style="--x: 20%; --y: 30%; --r: 3deg" data-p-item data-x="-60" data-r="14"><StickyNote :size="14" /> Helena 9:20 <s>9:30</s></div>
            <div class="note" style="--x: 56%; --y: 38%; --r: -5deg" data-p-item data-x="100" data-r="-16"><StickyNote :size="14" /> Remarcar Paula</div>
            <div class="note is-alert" style="--x: 4%; --y: 62%; --r: -3deg" data-p-item data-x="-110" data-r="-12"><StickyNote :size="14" /> 2 pacientes às 11h!</div>
            <div class="note" style="--x: 46%; --y: 70%; --r: 6deg" data-p-item data-x="70" data-r="22"><StickyNote :size="14" /> Sexta fecha?</div>
          </div>

          <div class="solution-layer" data-solution>
            <figure class="device" data-s-frame>
              <div class="device-bar"><i></i><i></i><i></i><span>app.agendadoutor.com</span></div>
              <picture>
                <source media="(max-width: 700px)" :srcset="calendarMobile" />
                <img :src="calendarDesktop" alt="Calendário semanal do Agenda Doutor com consultas por status" width="1400" height="672" loading="lazy" decoding="async" />
              </picture>
            </figure>
            <div class="legend" data-s-item>
              <span><i class="dot d-agendado"></i>Agendado</span>
              <span><i class="dot d-confirmado"></i>Confirmado</span>
              <span><i class="dot d-realizado"></i>Realizado</span>
              <span><i class="dot d-cancelado"></i>Cancelado</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 03 · Prontuário -->
    <section class="scene" data-scene aria-labelledby="scene-3-title">
      <div class="scene-inner">
        <div class="scene-copy">
          <div class="copy copy-problem" data-copy-problem>
            <span class="kicker">03 · Prontuário</span>
            <h2 id="scene-3-title" class="headline" data-reveal>
              <span v-for="(w, i) in words('Exame no e-mail, foto no celular, anotação no papel.')" :key="i" class="w">{{ w + ' ' }}</span>
            </h2>
            <p>E o histórico do paciente nunca está onde você precisa.</p>
          </div>
          <div class="copy copy-solution" data-copy-solution>
            <span class="kicker is-solution">Prontuário digital</span>
            <h2 class="headline">Tudo do paciente em um só lugar, a um clique da consulta.</h2>
            <p>Anamnese, exames, prescrições, documentos e imagens juntos e salvos automaticamente.</p>
          </div>
        </div>

        <div class="scene-visual">
          <div class="problem-layer files" data-problem>
            <div class="file" style="--x: 4%; --y: 8%; --r: -6deg" data-p-item data-x="-90" data-r="-18"><FileText :size="18" /><span>anamnese_papel.jpg</span></div>
            <div class="file" style="--x: 50%; --y: 2%; --r: 4deg" data-p-item data-x="100" data-r="16"><Paperclip :size="18" /><span>exame_sangue.pdf</span></div>
            <div class="file" style="--x: 14%; --y: 38%; --r: 5deg" data-p-item data-x="-70" data-r="12"><Image :size="18" /><span>IMG_2048.HEIC</span></div>
            <div class="file" style="--x: 54%; --y: 44%; --r: -4deg" data-p-item data-x="110" data-r="-14"><StickyNote :size="18" /><span>“alergia a dipirona?”</span></div>
            <div class="file" style="--x: 22%; --y: 72%; --r: -2deg" data-p-item data-x="-60" data-r="-10"><FileText :size="18" /><span>receita_antiga.pdf</span></div>
          </div>

          <div class="solution-layer" data-solution>
            <figure class="device" data-s-frame>
              <div class="device-bar"><i></i><i></i><i></i><span>Novo Atendimento</span></div>
              <picture>
                <source media="(max-width: 700px)" :srcset="prontuarioMobile" />
                <img :src="prontuarioDesktop" alt="Tela de prontuário do Agenda Doutor durante o atendimento" width="1300" height="624" loading="lazy" decoding="async" />
              </picture>
            </figure>
            <div class="tabs" data-s-item>
              <span>Prontuário</span><span>Exames</span><span>Prescrições</span><span>Documentos</span><span>Imagens e Anexos</span>
            </div>
            <span class="saved-chip" data-s-item><Check :size="14" /> Salvo</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 04 · Financeiro -->
    <section class="scene" data-scene aria-labelledby="scene-4-title">
      <div class="scene-inner">
        <div class="scene-copy">
          <div class="copy copy-problem" data-copy-problem>
            <span class="kicker">04 · Financeiro</span>
            <h2 id="scene-4-title" class="headline" data-reveal>
              <span v-for="(w, i) in words('No fim do mês, quanto entrou de verdade?')" :key="i" class="w">{{ w + ' ' }}</span>
            </h2>
            <p>Pix sem nome, dinheiro na gaveta e convênio que ninguém lembra.</p>
          </div>
          <div class="copy copy-solution" data-copy-solution>
            <span class="kicker is-solution">Gestão financeira</span>
            <h2 class="headline">Cada pagamento no lugar certo. E o fim do mês sem susto.</h2>
            <p>Recebimentos ligados ao atendimento, com forma de pagamento e o que ainda falta entrar.</p>
          </div>
        </div>

        <div class="scene-visual">
          <div class="problem-layer receipts" data-problem>
            <div class="receipt" style="--x: 6%; --y: 6%; --r: -5deg" data-p-item data-x="-90" data-r="-16"><Receipt :size="16" /> Pix R$ 250,00 · de quem?</div>
            <div class="receipt" style="--x: 44%; --y: 24%; --r: 6deg" data-p-item data-x="100" data-r="14"><Wallet :size="16" /> Dinheiro · gaveta</div>
            <div class="receipt" style="--x: 10%; --y: 46%; --r: 3deg" data-p-item data-x="-70" data-r="10"><Receipt :size="16" /> Convênio a receber?</div>
            <div class="receipt" style="--x: 40%; --y: 68%; --r: -4deg" data-p-item data-x="90" data-r="-12"><Receipt :size="16" /> Repasse do Dr. Bruno?</div>
          </div>

          <div class="solution-layer" data-solution>
            <div class="fin-panel" data-s-frame>
              <div class="fin-totals">
                <div><span>Recebido hoje</span><strong>R$ 430,00</strong></div>
                <div><span>A receber</span><strong class="is-pending">R$ 420,00</strong></div>
              </div>
              <ul class="fin-list">
                <li data-s-item><div><strong>Ana Luiza Oliveira</strong><small>Consulta · Pix</small></div><span class="amt">R$ 250,00</span><span class="status st-realizado">Recebido</span></li>
                <li data-s-item><div><strong>Bruno Lima</strong><small>Retorno · Cartão</small></div><span class="amt">R$ 180,00</span><span class="status st-realizado">Recebido</span></li>
                <li data-s-item><div><strong>Helena Martins</strong><small>Procedimento · Convênio</small></div><span class="amt">R$ 420,00</span><span class="status st-agendado">A receber</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.story {
  --scene-bg: #ffffff;
}

.scene {
  background: var(--scene-bg);
  position: relative;
}

.scene-inner {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1fr);
  margin: 0 auto;
  max-width: 1120px;
  padding: 4.5rem 1.25rem;
}

/* ---------- Texto ---------- */
.scene-copy {
  display: grid;
  min-width: 0;
}

.copy {
  grid-area: 1 / 1;
}

.kicker {
  color: #64748b;
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.kicker.is-solution {
  color: #0057ff;
}

.headline {
  color: #1c2035;
  font-size: clamp(1.55rem, 6.2vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 0.75rem;
}

.copy p {
  color: #475569;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  max-width: 460px;
}

/* ---------- Palco visual ---------- */
.scene-visual {
  display: grid;
  min-height: 340px;
  min-width: 0;
  position: relative;
}

.problem-layer,
.solution-layer {
  grid-area: 1 / 1;
  position: relative;
}

/* Sem animação: mostra a solução e o problema vira só o título de contexto */
.story:not(.is-animated) .problem-layer { display: none; }
.story:not(.is-animated) .copy-problem p,
.story:not(.is-animated) .copy-problem .w { display: none; }
.story:not(.is-animated) .copy-problem { position: static; }
.story:not(.is-animated) .scene-copy { display: flex; flex-direction: column; }
.story:not(.is-animated) [data-status-from] { display: none; }

.story.is-animated .scene-inner {
  align-content: stretch;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
  height: 100svh;
  padding-bottom: 1.5rem;
  padding-top: 96px;
}

.story.is-animated .scene-visual {
  min-height: 0;
}

/* ---------- 01 WhatsApp ---------- */
.chat {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 24px 50px -24px rgba(28, 32, 53, 0.35);
  margin: 0 auto;
  max-width: 380px;
  overflow: hidden;
  width: 100%;
}

.chat-head {
  align-items: center;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
}

.chat-head div { display: flex; flex: 1; flex-direction: column; }
.chat-head strong { color: #1c2035; font-size: 0.92rem; }
.chat-head small { color: #64748b; font-size: 0.75rem; }

.chat-avatar {
  align-items: center;
  background: #e8efff;
  border-radius: 50%;
  color: #0057ff;
  display: flex;
  font-weight: 700;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.pending-badge {
  background: #fee2e2;
  border-radius: 999px;
  color: #b91c1c;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.55rem;
  white-space: nowrap;
}

.chat-body {
  background-size: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.9rem;
}

.bubble {
  border-radius: 10px;
  box-shadow: 0 1px 1px rgba(15, 23, 42, 0.08);
  color: #1c2035;
  font-size: 0.86rem;
  line-height: 1.35;
  margin: 0;
  max-width: 82%;
  padding: 0.45rem 0.6rem 0.3rem;
}

.bubble small {
  align-items: center;
  color: #8696a0;
  display: flex;
  font-size: 0.66rem;
  gap: 2px;
  justify-content: flex-end;
  margin-top: 2px;
}

.bubble.in { align-self: flex-start; background: #ffffff; }
.bubble.out { align-self: flex-end; background: #d9fdd3; }

.app-panel,
.fin-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 30px 60px -30px rgba(28, 32, 53, 0.35);
  margin: 0 auto;
  max-width: 400px;
  overflow: hidden;
  width: 100%;
}

.app-head {
  align-items: center;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.app-head strong { color: #0057ff; flex: 1; font-size: 0.92rem; }
.app-day { color: #64748b; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; }
.app-day b { color: #0057ff; font-size: 1.1rem; margin-left: 0.2rem; }

.app-slots {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.85rem 1rem 1rem;
}

.slot {
  align-items: stretch;
  display: grid;
  gap: 0.6rem;
  grid-template-columns: 42px 1fr;
}

.slot-time {
  color: #94a3b8;
  font-size: 0.72rem;
  padding-top: 0.45rem;
}

.appt {
  background: #eff6ff;
  border-left: 3px solid #2563eb;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 0.55rem 0.7rem;
  position: relative;
  transition: background 0.4s, border-color 0.4s;
}

.appt strong { color: #1d4ed8; font-size: 0.84rem; grid-column: 1; }
.appt small { color: #3b82f6; font-size: 0.72rem; grid-column: 1; }
.appt .status { align-self: center; grid-column: 2; grid-row: 1 / span 2; }

.appt.is-confirmed { background: #fffbeb; border-color: #d97706; }
.appt.is-confirmed strong, .appt.is-confirmed small { color: #b45309; }

.status {
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;
}

.st-agendado { background: #dbeafe; color: #1d4ed8; }
.st-confirmado { background: #fef3c7; color: #b45309; }
.st-realizado { background: #dcfce7; color: #15803d; }

[data-status-to] { grid-column: 2; grid-row: 1 / span 2; }
.story.is-animated [data-status-to] { opacity: 0; }

.auto-msg {
  background: #d9fdd3;
  border-radius: 12px;
  bottom: 4%;
  box-shadow: 0 16px 30px -18px rgba(28, 32, 53, 0.4);
  max-width: 250px;
  padding: 0.6rem 0.75rem;
  position: absolute;
  right: 0;
}

.auto-label {
  align-items: center;
  color: #0057ff;
  display: flex;
  font-size: 0.68rem;
  font-weight: 700;
  gap: 0.3rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.auto-msg p { color: #1c2035; font-size: 0.8rem; line-height: 1.35; margin: 0.3rem 0 0; }

.auto-reply {
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  display: inline-flex !important;
  gap: 0.3rem;
  margin-top: 0.4rem !important;
  padding: 0.15rem 0.5rem;
}

.auto-reply svg { color: #53bdeb; }

.counter-chip {
  align-items: center;
  background: #1c2035;
  border-radius: 999px;
  box-shadow: 0 10px 24px -12px rgba(28, 32, 53, 0.6);
  color: #ffffff;
  display: flex;
  gap: 0.5rem;
  left: 0;
  margin: 0 auto;
  padding: 0.35rem 0.4rem 0.35rem 0.8rem;
  position: absolute;
  right: 0;
  top: -16px;
  width: max-content;
  white-space: nowrap;
  z-index: 2;
}

.counter-chip span { font-size: 0.68rem; letter-spacing: 0.05em; opacity: 0.75; text-transform: uppercase; }
.counter-chip b {
  background: #ffffff;
  border-radius: 999px;
  color: #1c2035;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  min-width: 2.2em;
  padding: 0.1rem 0.45rem;
  text-align: center;
}

/* ---------- 02 Notas / 03 Arquivos / 04 Recibos ---------- */
.notes,
.files,
.receipts {
  min-height: 300px;
}

.note,
.file,
.receipt {
  align-items: center;
  border-radius: 10px;
  display: inline-flex;
  font-size: 0.86rem;
  font-weight: 500;
  gap: 0.4rem;
  left: var(--x);
  padding: 0.65rem 0.8rem;
  position: absolute;
  top: var(--y);
  transform: rotate(var(--r));
  white-space: nowrap;
}

.note {
  background: #fefce8;
  border: 1px solid #fde68a;
  box-shadow: 0 10px 20px -12px rgba(120, 85, 0, 0.45);
  color: #713f12;
  font-family: var(--fonte-mono);
}

.note.is-alert { background: #fef2f2; border-color: #fecaca; color: #991b1b; }

.file {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 14px 28px -18px rgba(28, 32, 53, 0.45);
  color: #334155;
}

.file svg { color: #64748b; }

.receipt {
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  box-shadow: 0 12px 24px -18px rgba(28, 32, 53, 0.4);
  color: #334155;
  font-family: var(--fonte-mono);
  font-size: 0.8rem;
}

.device {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 36px 70px -34px rgba(28, 32, 53, 0.45);
  margin: 0;
  overflow: hidden;
}

.device-bar {
  align-items: center;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  gap: 5px;
  padding: 0.55rem 0.8rem;
}

.device-bar i { background: #e2e8f0; border-radius: 50%; height: 8px; width: 8px; }
.device-bar span { color: #94a3b8; font-size: 0.72rem; margin-left: 0.5rem; }

.device img {
  aspect-ratio: 1400 / 672;
  display: block;
  height: auto;
  object-fit: cover;
  object-position: left top;
  width: 100%;
}

.legend,
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
  margin-top: 0.9rem;
}

.legend span,
.tabs span {
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  color: #334155;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 500;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
}

.tabs span:first-child { background: #eff6ff; border-color: #bfdbfe; color: #0057ff; }

.dot { border-radius: 50%; display: inline-block; height: 7px; width: 7px; }
.d-agendado { background: #2563eb; }
.d-confirmado { background: #eab308; }
.d-realizado { background: #22c55e; }
.d-cancelado { background: #ef4444; }

.saved-chip {
  align-items: center;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 10px 24px -14px rgba(28, 32, 53, 0.4);
  color: #16a34a;
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 600;
  gap: 0.25rem;
  padding: 0.35rem 0.7rem;
  position: absolute;
  right: 4%;
  top: -4%;
}

.fin-totals {
  border-bottom: 1px solid #eef2f7;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.fin-totals div { display: flex; flex-direction: column; gap: 0.2rem; padding: 0.9rem 1rem; }
.fin-totals div + div { border-left: 1px solid #eef2f7; }
.fin-totals span { color: #64748b; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
.fin-totals strong { color: #15803d; font-size: 1.25rem; font-variant-numeric: tabular-nums; }
.fin-totals strong.is-pending { color: #1d4ed8; }

.fin-list { list-style: none; margin: 0; padding: 0.4rem 0; }

.fin-list li {
  align-items: center;
  display: grid;
  gap: 0.6rem;
  grid-template-columns: 1fr auto;
  padding: 0.65rem 1rem;
}

.fin-list li + li { border-top: 1px solid #f1f5f9; }
.fin-list div { display: flex; flex-direction: column; }
.fin-list strong { color: #1c2035; font-size: 0.86rem; }
.fin-list small { color: #64748b; font-size: 0.74rem; }
.fin-list .amt { color: #1c2035; font-size: 0.86rem; font-variant-numeric: tabular-nums; font-weight: 600; text-align: right; }
.fin-list .status { grid-column: 2; justify-self: end; }

/* ---------- Desktop ---------- */
@media (min-width: 900px) {
  .scene-inner {
    align-items: center;
    gap: 3.5rem;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }

  .story.is-animated .scene-inner {
    align-content: center;
    grid-template-rows: minmax(0, 1fr);
    padding-top: 80px;
  }

  .scene-visual { min-height: 440px; }
  .notes, .files, .receipts { min-height: 420px; }
  .note, .file, .receipt { font-size: 0.95rem; padding: 0.8rem 1rem; }
  .app-panel, .fin-panel, .chat { max-width: 440px; }
  .auto-msg { right: -4%; }

}

@media (max-width: 899px) {
  /* Espaço para o CTA fixo do celular não cobrir o fim da cena */
  .story.is-animated .scene-inner { padding-bottom: 5.5rem; }
  .story.is-animated .scene-copy { min-height: 13.5rem; }
  .story.is-animated .scene-visual { align-self: stretch; }
  .story.is-animated .device img { aspect-ratio: 5 / 4; object-position: 12% top; }
}

@media (max-width: 380px) {
  .headline { font-size: 1.4rem; }
  .story.is-animated .scene-copy { min-height: 12rem; }
  .bubble { font-size: 0.8rem; }
}
</style>
