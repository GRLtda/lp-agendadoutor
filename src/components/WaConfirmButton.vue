<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CornerUpLeft, Pointer } from 'lucide-vue-next'

// Botão de resposta rápida do WhatsApp ("Confirmar consulta") com o toque do
// paciente: o dedo chega, aperta, o botão afunda e solta uma onda e faíscas.
// `play` dispara a animação (após `delay`); `loop` repete a cada `period` ms.
const props = defineProps({
  label: { type: String, default: 'Confirmar consulta' },
  play: { type: Boolean, default: true },
  delay: { type: String, default: '0.6s' },
  loop: { type: Boolean, default: false },
  period: { type: Number, default: 4200 },
})

const cycle = ref(0)
let timer = null

onMounted(() => {
  if (!props.loop) return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => { cycle.value++ }, props.period)
})
onBeforeUnmount(() => clearInterval(timer))

// Faíscas na borda do botão (x/y em % da caixa), cada uma voando para fora.
const sparks = [
  { x: 12, y: 0, a: -30 }, { x: 35, y: 0, a: -10 }, { x: 65, y: 0, a: 10 }, { x: 88, y: 0, a: 30 },
  { x: 100, y: 50, a: 90 },
  { x: 88, y: 100, a: 150 }, { x: 65, y: 100, a: 170 }, { x: 35, y: 100, a: 190 }, { x: 12, y: 100, a: 210 },
  { x: 0, y: 50, a: 270 },
]
</script>

<template>
  <span
    :key="cycle"
    class="wcb"
    :class="{ 'is-play': play }"
    :style="{ '--tap': delay }"
    aria-hidden="true"
  >
    <span class="wcb-btn">
      <CornerUpLeft class="wcb-icon" />
      {{ label }}
      <span class="wcb-ripple"></span>
    </span>
    <span class="wcb-ring"></span>
    <span class="wcb-burst">
      <i
        v-for="(p, n) in sparks"
        :key="n"
        :style="{ left: `${p.x}%`, top: `${p.y}%`, '--a': `${p.a}deg` }"
      ></i>
    </span>
    <Pointer class="wcb-finger" />
  </span>
</template>

<style scoped>
.wcb {
  position: relative;
  display: block;
  margin-top: 0.5em;
  font-size: 1em;
}
.wcb-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  padding: 0.55em 0.8em;
  overflow: hidden;
  border-radius: 0.6em;
  background: #fff;
  color: #027eb5;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
}
.wcb-icon { width: 1.1em; height: 1.1em; flex: none; }

.wcb-ripple {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2em;
  height: 2em;
  margin: -1em 0 0 -1em;
  border-radius: 50%;
  background: rgba(2, 126, 181, 0.22);
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
.wcb-ring {
  position: absolute;
  inset: 0;
  border-radius: 0.6em;
  opacity: 0;
  pointer-events: none;
}
.wcb-burst {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.wcb-burst i {
  position: absolute;
  width: 0.22em;
  height: 0.65em;
  margin: -0.325em 0 0 -0.11em;
  border-radius: 1em;
  background: #25d366;
  opacity: 0;
  transform: rotate(var(--a)) translateY(0);
}
.wcb-burst i:nth-child(even) { background: #027eb5; height: 0.5em; }
.wcb-finger {
  position: absolute;
  left: 55%;
  top: 55%;
  width: 1.7em;
  height: 1.7em;
  color: #1c2035;
  fill: #fff;
  stroke-width: 1.6;
  opacity: 0;
  pointer-events: none;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
}

.is-play .wcb-finger { animation: wcb-finger 1.1s calc(var(--tap) - 0.55s) ease-in-out both; }
.is-play .wcb-btn { animation: wcb-press 0.45s var(--tap) ease-out; }
.is-play .wcb-ripple { animation: wcb-ripple 0.6s var(--tap) ease-out; }
.is-play .wcb-ring { animation: wcb-ring 0.7s var(--tap) ease-out; }
.is-play .wcb-burst i { animation: wcb-spark 0.65s calc(var(--tap) + 0.04s) cubic-bezier(0.2, 0.7, 0.3, 1); }

@keyframes wcb-finger {
  0% { opacity: 0; transform: translate(1.6em, 1.4em); }
  35% { opacity: 1; transform: translate(0, 0); }
  50% { opacity: 1; transform: translate(0, 0) scale(0.82); }
  62% { opacity: 1; transform: translate(0, 0); }
  100% { opacity: 0; transform: translate(1.2em, 1.6em); }
}
@keyframes wcb-press {
  0% { transform: none; }
  30% { transform: scale(0.93); background: #e7f3fa; }
  100% { transform: none; background: #fff; }
}
@keyframes wcb-ripple {
  0% { opacity: 1; transform: scale(0); }
  100% { opacity: 0; transform: scale(14); }
}
@keyframes wcb-ring {
  0% { opacity: 1; box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
  100% { opacity: 1; box-shadow: 0 0 0 0.9em rgba(37, 211, 102, 0); }
}
@keyframes wcb-spark {
  0% { opacity: 0; transform: rotate(var(--a)) translateY(-0.2em) scaleY(0.3); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-1.5em) scaleY(1); }
}

@media (prefers-reduced-motion: reduce) {
  .is-play .wcb-finger,
  .is-play .wcb-btn,
  .is-play .wcb-ripple,
  .is-play .wcb-ring,
  .is-play .wcb-burst i { animation: none; }
}
</style>
