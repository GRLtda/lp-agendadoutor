import { onBeforeUnmount, onMounted } from 'vue'

// Movimento da landing page do evento (GSAP + ScrollTrigger).
// Carregado sob demanda depois da montagem para não atrasar a oferta na tela.
// Com "reduzir movimento" ativo, nada é montado e a página fica estática.
export function useEventMotion(rootRef) {
  let ctx = null
  let onLoad = null
  let ScrollTrigger = null

  onMounted(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const [{ gsap }, { ScrollTrigger: ST }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)
    // Evita recalcular tudo quando a barra de endereço do celular aparece/some.
    ScrollTrigger.config({ ignoreMobileResize: true })

    const isMobile = window.matchMedia('(max-width: 899px)').matches
    // No celular, o scroll por toque "engasga" nas cenas com pin por causa do
    // momentum nativo brigando com o recálculo do pin a cada frame.
    // normalizeScroll troca o scroll do touch por um equivalente sintético e
    // consistente, eliminando essa paradinha.
    if (isMobile) ScrollTrigger.normalizeScroll(true)

    const root = rootRef.value
    if (!root) return
    root.querySelector('[data-story]')?.classList.add('is-animated')

    ctx = gsap.context(() => {

      // Abertura: o ingresso recua e perde destaque quando a história começa.
      gsap.to('[data-intro-stage]', {
        yPercent: -10,
        scale: 0.9,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: '[data-intro]', start: 'top top', end: 'bottom top', scrub: true },
      })

      gsap.utils.toArray('[data-scene]').forEach((scene) => buildScene(gsap, scene, isMobile))

      // Manifesto: as palavras acendem acompanhando o scroll.
      gsap.utils.toArray('[data-manifesto]').forEach((block) => {
        gsap.fromTo(block.querySelectorAll('.w'), { opacity: 0.14 }, {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: block, start: 'top 78%', end: 'bottom 42%', scrub: true },
        })
      })

      // Contador: iluminação acompanha o scroll e os blocos entram em sequência.
      const countdown = root.querySelector('[data-countdown]')
      if (countdown) {
        gsap.fromTo(countdown.querySelector('.cd-light'), { xPercent: -30 }, {
          xPercent: 30,
          ease: 'none',
          scrollTrigger: { trigger: countdown, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.from(countdown.querySelectorAll('[data-cd-reveal]'), {
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: countdown, start: 'top 70%' },
        })
        gsap.from(countdown.querySelectorAll('[data-cd-unit]'), {
          y: 40,
          rotateX: -55,
          transformPerspective: 600,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: countdown, start: 'top 60%' },
        })
      }
    }, root)

    onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    ScrollTrigger.refresh()
  })

  onBeforeUnmount(() => {
    if (onLoad) window.removeEventListener('load', onLoad)
    ctx?.revert()
    ScrollTrigger?.normalizeScroll(false)
  })
}

// Só escreve no DOM quando o valor muda (evita layout a cada frame do scrub).
function setText(el, value) {
  const text = String(value)
  if (el.textContent !== text) el.textContent = text
}

// Cena fixada (pin) com scrub: problema entra, se desfaz e vira a solução.
function buildScene(gsap, scene, isMobile) {
  const q = gsap.utils.selector(scene)
  const words = q('[data-reveal] .w')
  const problemItems = q('[data-problem] [data-p-item]')
  const copyProblem = q('[data-copy-problem]')
  const copySolution = q('[data-copy-solution]')
  const frame = q('[data-s-frame]')
  const solutionItems = q('[data-s-item]')
  const tint = q('[data-scene-tint]')

  gsap.set(copySolution, { autoAlpha: 0, y: 30 })
  gsap.set(frame, { autoAlpha: 0, y: 90, scale: 0.9, rotateX: 14, transformPerspective: 1000, transformOrigin: '50% 100%' })
  gsap.set(solutionItems, { autoAlpha: 0, y: 24 })
  gsap.set(problemItems, { autoAlpha: 0, y: 40, scale: 0.92 })

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * (isMobile ? 2.1 : 2.5))}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })

  // 1. Problema: título se revela e a bagunça vai se acumulando.
  tl.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.08, duration: 0.4 }, 0)
    .to(tint, { opacity: 1, duration: 1.2 }, 0.2)
    .to(problemItems, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.28, duration: 0.6 }, 0.3)

  q('[data-count-up]').forEach((el) => {
    const counter = { value: 0 }
    tl.to(counter, {
      value: Number(el.dataset.countUp),
      duration: 2.2,
      ease: 'none',
      onUpdate: () => setText(el, Math.round(counter.value)),
    }, 0.3)
  })

  // 2. A bagunça sai da tela e o fundo clareia.
  tl.to(problemItems, {
    x: (i, el) => Number(el.dataset.x || 0) * (isMobile ? 1.6 : 2.4),
    y: (i) => -70 - i * 14,
    rotation: (i, el) => Number(el.dataset.r || 0),
    autoAlpha: 0,
    stagger: 0.04,
    duration: 0.9,
    ease: 'power2.in',
  }, 3.4)
    .to(copyProblem, { autoAlpha: 0, y: -30, duration: 0.6 }, 3.6)
    .to(tint, { opacity: 0, duration: 0.8 }, 3.9)

  // 3. O Agenda Doutor entra e resolve.
  tl.to(copySolution, { autoAlpha: 1, y: 0, duration: 0.7 }, 4.2)
    .to(frame, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 1.1, ease: 'power3.out' }, 4.3)
    .to(solutionItems, { autoAlpha: 1, y: 0, stagger: 0.3, duration: 0.6 }, 5.1)

  q('[data-count-down]').forEach((el) => {
    const start = Number(el.dataset.countDown)
    const counter = { value: start }
    el.textContent = String(start)
    tl.to(counter, {
      value: 0,
      duration: 1.6,
      ease: 'power1.inOut',
      onUpdate: () => setText(el, Math.round(counter.value)),
    }, 5.6)
  })

  // Status muda de Agendado para Confirmado, como no calendário real.
  q('[data-status-card]').forEach((card, i) => {
    const from = card.querySelector('[data-status-from]')
    const to = card.querySelector('[data-status-to]')
    const at = 6 + i * 0.45
    gsap.set(to, { autoAlpha: 0, y: 8 })
    tl.to(from, { autoAlpha: 0, y: -8, duration: 0.3 }, at)
      .to(to, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.1)
      .to(card, { backgroundColor: '#fffbeb', borderLeftColor: '#d97706', duration: 0.3 }, at)
      .to(card.querySelectorAll('strong, small'), { color: '#b45309', duration: 0.3 }, at)
  })

  // Respiro antes de soltar a cena.
  tl.to({}, { duration: 1.2 })
}
