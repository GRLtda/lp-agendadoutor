<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import { productQuestions } from '@/seo/product'
import logoBrand from '@/assets/logo_brand.svg'
import logoWhatsapp from '@/assets/logo_whatsapp.svg'

// Acordeão acessível: botão com aria-expanded/aria-controls e região rotulada.
// As respostas ficam no HTML (SSG) para SEO; fechadas, ficam inertes.
const openIndex = ref(0)

function toggle(index) {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <section id="faq" class="faq" data-faq aria-labelledby="faq-title">
    <div class="faq-inner">
      <div class="faq-aside">
        <div class="faq-intro" data-faq-intro>
          <span class="faq-kicker">Perguntas frequentes</span>
          <h2 id="faq-title" class="faq-title">
            Dúvidas?
            <span>A gente simplifica.</span>
          </h2>
          <p class="faq-lead">Encontre as respostas que precisa para começar a transformar a rotina da sua clínica.</p>

          <div class="support-wrap">
          <div class="support-card">
            <div class="support-head">
              <span class="support-avatar"><img :src="logoBrand" alt="" width="13" height="22" /></span>
              <div>
                <strong>Equipe Agenda Doutor</strong>
                <small><i></i> Atendimento pelo WhatsApp</small>
              </div>
            </div>
            <div class="support-chat" aria-hidden="true">
              <p class="support-bubble">Oi! Como podemos ajudar a sua clínica? 🙂</p>
              <p class="support-typing"><i></i><i></i><i></i></p>
            </div>
            <a
              href="https://wa.me/5511921923978"
              target="_blank"
              rel="noopener noreferrer"
              class="support-cta"
              data-track-click="faq_whatsapp_contato"
            >
              <img :src="logoWhatsapp" alt="" width="18" height="18" />
              Falar com o suporte
              <ArrowUpRight :size="16" />
            </a>
          </div>
          </div>
        </div>
      </div>

      <div class="faq-list" data-faq-list>
        <div
          v-for="(item, i) in productQuestions"
          :key="item.question"
          class="faq-item"
          :class="{ 'is-open': openIndex === i }"
          data-faq-item
        >
          <h3 class="faq-h">
            <button
              :id="`faq-q-${i}`"
              type="button"
              class="faq-q"
              :aria-expanded="openIndex === i"
              :aria-controls="`faq-a-${i}`"
              :data-track-click="`faq_pergunta_${i + 1}`"
              @click="toggle(i)"
            >
              <span class="faq-n">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="faq-text">{{ item.question }}</span>
              <span class="faq-icon" aria-hidden="true"><i></i><i></i></span>
            </button>
          </h3>
          <div
            :id="`faq-a-${i}`"
            class="faq-a"
            role="region"
            :aria-labelledby="`faq-q-${i}`"
            :inert="openIndex !== i"
          >
            <div class="faq-a-inner">
              <p>{{ item.answer }}</p>
              <RouterLink v-if="item.link" :to="item.link.to" class="faq-link">
                {{ item.link.label }} <ArrowRight :size="14" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  position: relative;
  padding: clamp(5rem, 13vh, 8rem) 0;
  background:
    radial-gradient(ellipse 50% 40% at 0% 20%, rgba(0, 87, 255, 0.08), transparent 70%),
    linear-gradient(180deg, #ffffff 0%, #eef4ff 100%);
  overflow: hidden;
}

.faq-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: start;
}

.faq-aside { position: sticky; top: 110px; }
.faq-kicker {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--ad-blue);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.faq-title {
  margin: 0 0 1.2rem;
  color: var(--ad-ink);
  font-size: clamp(2.4rem, 4.6vw, 3.8rem);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.04em;
}
.faq-title span { display: block; color: var(--ad-blue); }
.faq-lead { max-width: 26rem; margin: 0 0 2rem; color: var(--ad-ink-soft); font-size: 1.08rem; line-height: 1.6; }

/* Cartão de atendimento */
.support-card {
  position: relative;
  max-width: 360px;
  padding: 1.1rem;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid var(--ad-line);
  box-shadow: 0 40px 70px -50px rgba(28, 45, 90, 0.6);
  animation: support-bob 7s ease-in-out infinite;
}
.support-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.9rem; }
.support-avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eef4ff;
  box-shadow: 0 0 0 4px #f6f9ff;
}
.support-head strong { display: block; color: var(--ad-ink); font-size: 0.92rem; font-weight: 600; }
.support-head small { display: inline-flex; align-items: center; gap: 6px; color: var(--ad-muted); font-size: 0.78rem; }
.support-head small i { width: 7px; height: 7px; border-radius: 50%; background: #25d366; }
.support-chat {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
  padding: 0.8rem;
  border-radius: 14px;
  background: #f6f8fc;
}
.support-bubble { margin: 0; align-self: flex-start; padding: 0.55rem 0.8rem; border-radius: 12px; border-top-left-radius: 3px; background: #fff; color: var(--ad-ink); font-size: 0.86rem; box-shadow: 0 1px 2px rgba(28, 32, 53, 0.06); }
.support-typing { display: flex; gap: 4px; margin: 0; align-self: flex-start; padding: 0.6rem 0.75rem; border-radius: 12px; background: #fff; }
.support-typing i { width: 6px; height: 6px; border-radius: 50%; background: #a3acbd; animation: typing 1.2s infinite; }
.support-typing i:nth-child(2) { animation-delay: 0.15s; }
.support-typing i:nth-child(3) { animation-delay: 0.3s; }
.support-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 48px;
  border-radius: 999px;
  background: #1c2035;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.25s, transform 0.25s var(--ease-out), box-shadow 0.25s;
}
.support-cta img { filter: brightness(0) invert(1); }
.support-cta:hover { background: #25d366; transform: translateY(-1px); box-shadow: 0 14px 28px -14px rgba(37, 211, 102, 0.8); }
.support-cta:focus-visible { outline: 2px solid var(--ad-blue); outline-offset: 3px; }
.support-cta svg { transition: transform 0.25s var(--ease-out); }
.support-cta:hover svg { transform: translate(2px, -2px); }

/* Acordeão */
.faq-list { display: flex; flex-direction: column; gap: 0.7rem; }

.faq-item {
  position: relative;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(28, 32, 53, 0.07);
  transition: background 0.4s, border-color 0.4s, box-shadow 0.5s var(--ease-out), translate 0.35s var(--ease-out);
  overflow: hidden;
}
.faq-item::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 120% at 0% 0%, rgba(0, 87, 255, 0.06), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}
.faq-item:hover { border-color: #d3e0fb; background: rgba(255, 255, 255, 0.9); translate: 0 -1px; }
.faq-item.is-open {
  background: #ffffff;
  border-color: #d3e0fb;
  box-shadow: 0 30px 60px -40px rgba(0, 87, 255, 0.45);
  translate: none;
}
.faq-item.is-open::after { opacity: 1; }

.faq-h { margin: 0; font: inherit; }
.faq-q {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  min-height: 72px;
  padding: 1.1rem 1.25rem 1.1rem 1.4rem;
  border: 0;
  background: none;
  color: var(--ad-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  border-radius: 20px;
}
.faq-q:focus-visible { outline: 2px solid var(--ad-blue); outline-offset: -2px; }
.faq-n {
  flex: none;
  color: #a3acbd;
  font-family: var(--fonte-mono);
  font-size: 0.8rem;
  transition: color 0.35s;
}
.faq-text { flex: 1; font-size: 1.06rem; font-weight: 500; line-height: 1.35; letter-spacing: -0.01em; transition: color 0.35s; }
.faq-item.is-open .faq-n { color: var(--ad-blue); }

.faq-icon {
  position: relative;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f1f4f9;
  transition: background 0.4s, transform 0.55s var(--ease-in-out), box-shadow 0.4s;
}
.faq-icon i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 1.75px;
  margin: -0.875px 0 0 -6px;
  border-radius: 2px;
  background: var(--ad-ink);
  transition: transform 0.55s var(--ease-in-out), background 0.4s;
}
.faq-icon i:last-child { transform: rotate(90deg); }
.faq-q:hover .faq-icon { background: #e6edfb; }
.faq-item.is-open .faq-icon { background: var(--ad-blue); transform: rotate(180deg); box-shadow: 0 8px 18px -8px rgba(0, 87, 255, 0.8); }
.faq-item.is-open .faq-icon i { background: #fff; }
.faq-item.is-open .faq-icon i:last-child { transform: rotate(0deg); }

.faq-a {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.55s var(--ease-in-out);
}
.faq-item.is-open .faq-a { grid-template-rows: 1fr; }
.faq-a-inner {
  min-height: 0;
  overflow: hidden;
  padding: 0 1.4rem 0 calc(1.4rem + 1rem + 1.4em);
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.35s, transform 0.5s var(--ease-out), padding 0.55s var(--ease-in-out);
}
.faq-item.is-open .faq-a-inner { padding-bottom: 1.4rem; opacity: 1; transform: none; transition-delay: 0.12s, 0.12s, 0s; }
.faq-a-inner p { max-width: 38rem; margin: 0; color: var(--ad-ink-soft); font-size: 1rem; line-height: 1.7; }
.faq-link { display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 0.8rem; color: var(--ad-blue); font-size: 0.92rem; font-weight: 600; text-decoration: none; }
.faq-link:hover svg { transform: translateX(3px); }
.faq-link svg { transition: transform 0.25s var(--ease-out); }

@keyframes typing { 0%, 60%, 100% { transform: none; opacity: 0.5; } 30% { transform: translateY(-3px); opacity: 1; } }
@keyframes support-bob { 0%, 100% { transform: translateY(0) rotate(-0.4deg); } 50% { transform: translateY(-6px) rotate(0.4deg); } }

@media (max-width: 899px) {
  .faq { padding: 4.5rem 0; }
  .faq-inner { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
  .faq-aside { position: static; }
  .faq-title { font-size: clamp(2.3rem, 10vw, 3rem); }
  .faq-lead { margin-bottom: 1.5rem; font-size: 1rem; }
  .support-card { max-width: none; animation: none; }
  .support-chat { display: none; }
  .faq-q { min-height: 68px; padding: 1rem 1rem 1rem 1.15rem; gap: 0.8rem; }
  .faq-text { font-size: 1rem; }
  .faq-n { display: none; }
  .faq-a-inner { padding-left: 1.15rem; padding-right: 1.15rem; }
  .faq-item.is-open .faq-a-inner { padding-bottom: 1.2rem; }
  .faq-a-inner p { font-size: 0.96rem; }
  .faq-item:hover { translate: none; }
}

@media (prefers-reduced-motion: reduce) {
  .support-card, .support-typing i { animation: none; }
  .faq-item, .faq-item::after, .faq-icon, .faq-icon i, .faq-a, .faq-a-inner { transition-duration: 0.01s !important; transition-delay: 0s !important; }
}
</style>
