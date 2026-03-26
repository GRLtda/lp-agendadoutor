const CLARITY_PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID || '').trim()
const TRACKED_CLICK_SELECTOR = '[data-track-click]'
const ALLOWED_HOSTS = (import.meta.env.VITE_ANALYTICS_ALLOWED_HOSTS || '')
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean)
const ALLOW_BOT_TRAFFIC = String(import.meta.env.VITE_ANALYTICS_ALLOW_BOTS || 'false').toLowerCase() === 'true'

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

function isAllowedHost() {
  if (!ALLOWED_HOSTS.length) return true
  return ALLOWED_HOSTS.includes(window.location.hostname.toLowerCase())
}

function isLikelyBotTraffic() {
  if (ALLOW_BOT_TRAFFIC) return false

  const ua = (navigator.userAgent || '').toLowerCase()
  const botSignatures = [
    'bot',
    'crawler',
    'spider',
    'headlesschrome',
    'lighthouse',
    'google-inspectiontool',
    'bingpreview',
    'uptimerobot',
    'pingdom',
    'datadog',
    'newrelic',
    'curl/',
    'wget/',
    'python-requests',
    'postmanruntime',
    'vercel'
  ]

  const matchesUa = botSignatures.some((signature) => ua.includes(signature))
  const webdriverFlag = navigator.webdriver === true

  return matchesUa || webdriverFlag
}

function shouldSkipAnalytics() {
  if (!isAllowedHost()) return true
  if (isLikelyBotTraffic()) return true
  return false
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
  if (!isBrowser() || analyticsInitialized || !CLARITY_PROJECT_ID || shouldSkipAnalytics()) return false

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
