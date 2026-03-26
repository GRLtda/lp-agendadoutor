const CLARITY_PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID || 'w1l1yt6dvk').trim()
const TRACKED_CLICK_SELECTOR = '[data-track-click]'

let analyticsInitialized = false
let clickTrackingAttached = false

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function sanitizeEventName(value) {
  const safeValue = (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return safeValue || 'unknown'
}

function ensureClarityQueue() {
  if (typeof window.clarity === 'function') return

  window.clarity = function clarity() {
    ;(window.clarity.q = window.clarity.q || []).push(arguments)
  }
}

function sendClarityEvent(eventName) {
  if (!isBrowser() || typeof window.clarity !== 'function') return
  window.clarity('event', sanitizeEventName(eventName))
}

function handleTrackedClick(event) {
  if (!(event.target instanceof Element)) return

  const trackedElement = event.target.closest(TRACKED_CLICK_SELECTOR)
  if (!trackedElement) return

  const eventName = trackedElement.getAttribute('data-track-click')
  if (!eventName) return

  sendClarityEvent(`click_${eventName}`)
}

function attachTrackedClickEvents() {
  if (!isBrowser() || clickTrackingAttached) return

  document.addEventListener('click', handleTrackedClick, { capture: true })
  clickTrackingAttached = true
}

export function initBehaviorAnalytics() {
  if (!isBrowser() || analyticsInitialized || !CLARITY_PROJECT_ID) return false

  ensureClarityQueue()

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
  script.referrerPolicy = 'strict-origin-when-cross-origin'
  document.head.appendChild(script)

  attachTrackedClickEvents()
  analyticsInitialized = true

  return true
}

export function trackRouteView(routePath) {
  if (!routePath) return
  sendClarityEvent(`page_${routePath}`)
}
