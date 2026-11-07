import { onBeforeUnmount, onMounted } from 'vue'

// Movimento da home (GSAP + ScrollTrigger), carregado sob demanda depois da
// montagem para não atrasar a primeira dobra. Com "reduzir movimento", nada é
// montado: as cenas ficam no estado final (solução visível) e o FAQ, as abas e
// os benefícios continuam funcionando sem animação de scroll.
//
// Ordem importa: os gatilhos são criados na ordem do documento para que os
// espaçadores das cenas fixadas (pin) sejam calculados corretamente.
export function useHomeMotion(rootRef) {
  let mm = null
  let onLoad = null
  let ScrollTriggerRef = null

  onMounted(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    gsap.registerPlugin(ScrollTrigger)
    ScrollTriggerRef = ScrollTrigger
    // Evita recalcular tudo quando a barra de endereço do celular aparece/some.
    ScrollTrigger.config({ ignoreMobileResize: true })

    const root = rootRef.value
    if (!root) return

    mm = gsap.matchMedia()
    mm.add(
      { isDesktop: '(min-width: 900px)', isMobile: '(max-width: 899px)' },
      (context) => {
        const { isDesktop } = context.conditions
        const cleanups = [
          heroScene(gsap, root, isDesktop),
          confirmScene(gsap, root, isDesktop),
          featuresScene(gsap, root, isDesktop),
          beforeAfterScene(gsap, root, isDesktop),
          faqScene(gsap, root),
          finalScene(gsap, root, isDesktop),
        ]
        return () => cleanups.forEach((fn) => typeof fn === 'function' && fn())
      },
      root,
    )

    onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    ScrollTrigger.refresh()
  })

  onBeforeUnmount(() => {
    if (onLoad) window.removeEventListener('load', onLoad)
    mm?.revert()
    ScrollTriggerRef?.refresh()
  })
}

function scrubCounter(tl, el, from, to, duration, at, ease = 'none') {
  if (!el) return
  const state = { v: from }
  tl.fromTo(state, { v: from }, {
    v: to,
    duration,
    ease,
    onUpdate: () => { el.textContent = String(Math.round(state.v)) },
  }, at)
}

// Posição de um elemento relativa a um ancestral posicionado (ignora transforms).
function offsetWithin(el, ancestor) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return { x, y }
}

// 1 · Abertura: a interface recua quando a história começa e acompanha o ponteiro.
function heroScene(gsap, root, isDesktop) {
  const hero = root.querySelector('[data-hero]')
  if (!hero) return null
  const stage = hero.querySelector('[data-hero-stage]')
  const copy = hero.querySelector('[data-hero-copy]')
  const tilt = hero.querySelector('[data-hero-tilt]')

  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to(stage, { yPercent: isDesktop ? -8 : -4, scale: 0.94, ease: 'none', scrollTrigger: st })
  gsap.to(copy, { y: isDesktop ? -70 : -30, autoAlpha: 0.15, ease: 'none', scrollTrigger: { ...st } })

  if (!isDesktop || !tilt || !window.matchMedia('(hover: hover)').matches) return null

  gsap.set(tilt, { transformPerspective: 1600 })
  const rotY = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' })
  const rotX = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' })
  const onMove = (e) => {
    const r = hero.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rotY(px * 7)
    rotX(py * -5)
  }
  const onLeave = () => { rotY(0); rotX(0) }
  hero.addEventListener('pointermove', onMove)
  hero.addEventListener('pointerleave', onLeave)
  return () => {
    hero.removeEventListener('pointermove', onMove)
    hero.removeEventListener('pointerleave', onLeave)
  }
}

// 2 · Confirmações: mensagens pendentes se acumulam, se alinham e viram as
// linhas do painel com status Agendado → Confirmado.
function confirmScene(gsap, root, isDesktop) {
  const scene = root.querySelector('[data-confirm-story]')
  if (!scene) return null
  scene.classList.add('is-motion')

  const q = gsap.utils.selector(scene)
  const visual = q('[data-cs-visual]')[0]
  const words = q('[data-cs-words] .w')
  const problem = q('[data-cs-problem]')
  const solution = q('[data-cs-solution]')
  const panel = q('[data-cs-panel]')
  const chrome = q('[data-cs-chrome]')
  const items = q('[data-cs-item]')
  const bubbles = q('[data-cs-bubble]')
  const rows = q('[data-cs-row]')
  const froms = q('[data-cs-from]')
  const tos = q('[data-cs-to]')
  const bar = q('[data-cs-bar]')
  const ok = q('.cs-pending-ok')
  const factor = isDesktop ? 1 : 0.6

  const sx = (el) => (Number(el.dataset.sx) / 100) * visual.offsetWidth * factor
  const sy = (el) => (Number(el.dataset.sy) / 100) * visual.offsetHeight * factor

  gsap.set(solution, { autoAlpha: 0, y: 30 })
  gsap.set(chrome, { autoAlpha: 0 })
  gsap.set(rows, { autoAlpha: 0 })
  gsap.set(tos, { autoAlpha: 0, scale: 0.8 })
  gsap.set(bar, { scaleX: 0 })
  gsap.set(ok, { autoAlpha: 0 })
  gsap.set(panel, {
    backgroundColor: 'rgba(255,255,255,0)',
    borderColor: 'rgba(28,32,53,0)',
    boxShadow: '0 40px 80px -36px rgba(28,45,90,0)',
  })
  gsap.set(scene, { '--cs-bg': '#f3f6fc' })

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * (isDesktop ? 2.6 : 2.2))}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  })

  // Problema: a pergunta acende e as mensagens se acumulam espalhadas.
  tl.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.08, duration: 0.4 }, 0)
    .fromTo(items,
      { autoAlpha: 0, x: (i, el) => sx(el), y: (i, el) => sy(el) + 40, rotation: (i, el) => Number(el.dataset.r) * 2, scale: 0.85 },
      { autoAlpha: 1, x: (i, el) => sx(el), y: (i, el) => sy(el), rotation: (i, el) => Number(el.dataset.r), scale: 1, stagger: 0.3, duration: 0.6, ease: 'back.out(1.5)' },
      0.3)
  scrubCounter(tl, q('[data-cs-count]')[0], 0, 27, 1.8, 0.3)

  // Transformação: o fundo clareia, as mensagens se alinham e viram linhas.
  tl.to(problem, { autoAlpha: 0, y: -30, duration: 0.5 }, 2.7)
    .to(scene, { '--cs-bg': '#ffffff', duration: 0.8 }, 2.7)
    .to(items, { x: 0, y: 0, rotation: 0, duration: 1, stagger: 0.06, ease: 'power3.inOut' }, 2.8)
    .to(panel, {
      backgroundColor: '#ffffff',
      borderColor: 'rgba(28,32,53,0.07)',
      boxShadow: '0 40px 80px -36px rgba(28,45,90,0.4)',
      duration: 0.8,
    }, 3.1)
    .to(chrome, { autoAlpha: 1, duration: 0.5, stagger: 0.1 }, 3.3)
    .to(bubbles, { autoAlpha: 0, duration: 0.35, stagger: 0.06 }, 3.35)
    .to(rows, { autoAlpha: 1, duration: 0.35, stagger: 0.06 }, 3.4)
    .to(solution, { autoAlpha: 1, y: 0, duration: 0.7 }, 3.7)

  // Solução: cada consulta é confirmada e as pendências zeram.
  froms.forEach((from, i) => {
    const at = 4.5 + i * 0.3
    tl.to(from, { autoAlpha: 0, y: -6, duration: 0.25 }, at)
      .to(tos[i], { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, at + 0.05)
  })
  scrubCounter(tl, q('[data-cs-done]')[0], 0, 5, 1.5, 4.5)
  scrubCounter(tl, q('[data-cs-count]')[0], 27, 0, 1.5, 4.5, 'power1.inOut')
  tl.to(bar, { scaleX: 1, duration: 1.6, ease: 'none' }, 4.5)
    .to(ok, { autoAlpha: 1, duration: 0.3 }, 6)
    .to({}, { duration: 1 })

  return () => scene.classList.remove('is-motion')
}

// 3 · Funcionalidades: a seção escura abre como uma máscara, o título acende
// palavra por palavra e o aparelho entra em perspectiva.
function featuresScene(gsap, root, isDesktop) {
  const section = root.querySelector('[data-features]')
  if (!section) return null
  const shell = section.querySelector('[data-ft-shell]')
  const words = section.querySelectorAll('[data-ft-words] .w')
  const device = section.querySelector('.ft-device')
  const inset = isDesktop ? '3.5%' : '2.5%'
  const radius = isDesktop ? '40px' : '24px'

  gsap.fromTo(shell,
    { clipPath: `inset(0% ${inset} 0% ${inset} round ${radius})` },
    { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 15%', scrub: true } })
  gsap.fromTo(shell,
    { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
    { clipPath: `inset(0% ${inset} 0% ${inset} round ${radius})`, ease: 'none', immediateRender: false, scrollTrigger: { trigger: section, start: 'bottom 85%', end: 'bottom top', scrub: true } })

  gsap.fromTo(words, { opacity: 0.16 }, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: section.querySelector('[data-ft-words]'), start: 'top 85%', end: 'bottom 45%', scrub: true },
  })

  if (isDesktop && device) {
    gsap.fromTo(device,
      { y: 90, rotationX: 14, scale: 0.92, autoAlpha: 0.3, transformPerspective: 1400, transformOrigin: '50% 100%' },
      { y: 0, rotationX: 0, scale: 1, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: section.querySelector('.ft-body'), start: 'top 95%', end: 'top 35%', scrub: true } })
  }
  return null
}

// 4 · Antes e depois: os itens soltos voam para o módulo certo da plataforma.
function beforeAfterScene(gsap, root, isDesktop) {
  const section = root.querySelector('[data-before-after]')
  if (!section) return null
  section.classList.add('is-motion')

  const q = gsap.utils.selector(section)
  const scene = q('[data-ba-scene]')[0]
  const stage = q('[data-ba-stage]')[0]
  const words = q('[data-ba-words] .w')
  const bits = q('[data-ba-bit]')
  const board = q('[data-ba-board]')
  const rows = q('[data-ba-row]')
  const modules = q('[data-ba-module]')
  const moduleOf = (name) => modules.find((m) => m.dataset.baModule === name)

  const delta = (el, axis) => {
    const target = moduleOf(el.dataset.target)
    if (!target) return 0
    const a = offsetWithin(el, stage)
    const b = offsetWithin(target, stage)
    return axis === 'x'
      ? b.x + target.offsetWidth / 2 - (a.x + el.offsetWidth / 2)
      : b.y + target.offsetHeight / 2 - (a.y + el.offsetHeight / 2)
  }

  gsap.set(board, { autoAlpha: 0, scale: 0.86, y: 30 })

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * (isDesktop ? 2.4 : 2))}`,
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  })

  tl.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, duration: 0.3 }, 0)
    .fromTo(bits,
      { autoAlpha: 0, scale: 0.6, rotation: (i, el) => Number(el.dataset.r) * 2.5 },
      { autoAlpha: 1, scale: 1, rotation: (i, el) => Number(el.dataset.r), stagger: 0.08, duration: 0.5, ease: 'back.out(1.6)' },
      0.1)
    // Sobrecarga: tudo se mexe um pouco, sem lugar certo.
    .to(bits, {
      x: (i) => (i % 2 ? 1 : -1) * (isDesktop ? 14 : 8),
      y: (i) => ((i % 3) - 1) * 10,
      rotation: (i, el) => Number(el.dataset.r) * 1.6,
      duration: 0.8,
      ease: 'sine.inOut',
    }, 1)
    // Organização: a plataforma aparece e absorve cada item no módulo certo.
    .to(board, { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.7)
    .to(bits, {
      x: (i, el) => delta(el, 'x'),
      y: (i, el) => delta(el, 'y'),
      rotation: 0,
      scale: 0.3,
      autoAlpha: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'power3.in',
    }, 1.9)
    .fromTo(rows, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.4 }, 2.7)
    .to(q('[data-ba-knob]'), { xPercent: 100, duration: 0.4, ease: 'power3.inOut' }, 2.6)
    .to(q('[data-ba-before-label]'), { color: '#8a94a8', duration: 0.3 }, 2.6)
    .to(q('[data-ba-after-label]'), { color: '#0057FF', duration: 0.3 }, 2.6)
    .to(q('[data-ba-cap-before]'), { autoAlpha: 0, duration: 0.3 }, 2.6)
    .fromTo(q('[data-ba-cap-after]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.7)

  modules.forEach((m, i) => {
    tl.fromTo(m, { backgroundColor: '#fafbfd' }, { backgroundColor: '#eef4ff', duration: 0.25, yoyo: true, repeat: 1 }, 2.4 + i * 0.1)
  })
  tl.to({}, { duration: 0.8 })

  return () => section.classList.remove('is-motion')
}

// 5 · FAQ: o texto sobe em sequência e as perguntas entram pela direita.
function faqScene(gsap, root) {
  const faq = root.querySelector('[data-faq]')
  if (!faq) return null
  gsap.from(faq.querySelectorAll('[data-faq-intro] > *'), {
    y: 34,
    autoAlpha: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: faq, start: 'top 72%' },
  })
  gsap.from(faq.querySelectorAll('[data-faq-item]'), {
    x: 48,
    autoAlpha: 0,
    stagger: 0.06,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: { trigger: faq.querySelector('[data-faq-list]'), start: 'top 78%' },
  })
  return null
}

// 6 · Fechamento: o cartão azul se expande e o símbolo da marca é desenhado.
function finalScene(gsap, root, isDesktop) {
  const section = root.querySelector('[data-final-cta]')
  if (!section) return null
  const card = section.querySelector('[data-fc-card]')

  gsap.fromTo(card,
    { clipPath: isDesktop ? 'inset(9% 7% 9% 7% round 48px)' : 'inset(4% 3% 4% 3% round 32px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 32px)', ease: 'none', scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 25%', scrub: true } })

  gsap.fromTo(section.querySelectorAll('[data-fc-path]'), { strokeDashoffset: 1 }, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top 75%', end: 'center 55%', scrub: true },
  })

  gsap.from(section.querySelectorAll('[data-fc-title] .w'), {
    yPercent: 110,
    stagger: 0.06,
    duration: 0.9,
    ease: 'power4.out',
    scrollTrigger: { trigger: card, start: 'top 65%' },
  })
  gsap.from(section.querySelectorAll('[data-fc-reveal]'), {
    y: 24,
    autoAlpha: 0,
    stagger: 0.12,
    duration: 0.8,
    delay: 0.35,
    ease: 'power3.out',
    scrollTrigger: { trigger: card, start: 'top 65%' },
  })
  return null
}
