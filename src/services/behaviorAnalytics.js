const IS_DEVELOPMENT = import.meta.env.DEV || ['dev', 'development', 'test'].includes(import.meta.env.MODE)
const CLARITY_PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID || '').trim()
const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim()
const UTM_STORAGE_KEY = 'ad_attribution'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
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
  if (IS_DEVELOPMENT || !isBrowser() || typeof window.clarity !== 'function') return
  window.clarity('event', sanitizeEventName(eventName))
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
  }
}

function classifyReferrer(referrer) {
  if (!referrer) return 'direct'
  let host = ''
  try {
    host = new URL(referrer).hostname.toLowerCase()
  } catch {
    return 'direct'
  }
  if (host.endsWith('agendadoutor.com') || host.endsWith('agendadoutor.com.br')) return 'internal'
  if (/(google|bing|duckduckgo|yahoo|ecosia|brave)\./.test(host)) return 'organic_search'
  if (/(chatgpt|openai|perplexity|claude|gemini|copilot|you\.com|phind)/.test(host)) return 'ai_assistant'
  if (/(instagram|facebook|linkedin|t\.co|twitter|x\.com|youtube|tiktok|whatsapp|wa\.me)/.test(host)) return 'social'
  return 'referral'
}

// Guarda a origem (UTM / referrer) da primeira página da sessão, para atribuir
// o engajamento do blog à campanha ou canal correto.
function captureAttribution() {
  if (!isBrowser()) return {}
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY)
    const params = new URLSearchParams(window.location.search)
    const hasUtm = UTM_KEYS.some((key) => params.get(key))
    if (stored && !hasUtm) return JSON.parse(stored)

    const attribution = { channel: hasUtm ? 'campaign' : classifyReferrer(document.referrer) }
    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) attribution[key] = value.slice(0, 100)
    }
    if (document.referrer && attribution.channel !== 'internal') {
      try {
        attribution.referrer_host = new URL(document.referrer).hostname
      } catch {
        /* referrer inválido */
      }
    }
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(attribution))
    return attribution
  } catch {
    return {}
  }
}

function sendGaEvent(eventName, params = {}) {
  if (IS_DEVELOPMENT || !isBrowser() || !GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return
  window.gtag('event', sanitizeEventName(eventName), params)
}

/**
 * Evento de engajamento enviado ao GA4 (com parâmetros) e ao Clarity (nome).
 * Parâmetros devem ser escalares e não conter dados pessoais.
 */
export function trackEvent(eventName, params = {}) {
  if (!analyticsInitialized) return
  const attribution = captureAttribution()
  sendGaEvent(eventName, { ...params, traffic_channel: attribution.channel })
  sendClarityEvent(eventName)
}

export function setClarityTags(tags = {}) {
  if (IS_DEVELOPMENT || !isBrowser() || typeof window.clarity !== 'function') return
  for (const [key, value] of Object.entries(tags)) {
    if (value) window.clarity('set', sanitizeEventName(key), String(value).slice(0, 100))
  }
}

function handleTrackedClick(event) {
  if (!(event.target instanceof Element)) return

  const trackedElement = event.target.closest(TRACKED_CLICK_SELECTOR)
  if (!trackedElement) return

  const eventName = trackedElement.getAttribute('data-track-click')
  if (!eventName) return

  sendClarityEvent(`click_${eventName}`)
  sendGaEvent('select_content', {
    content_type: 'tracked_click',
    item_id: sanitizeEventName(eventName),
    link_url: trackedElement.getAttribute('href') || undefined,
  })
}

function attachTrackedClickEvents() {
  if (IS_DEVELOPMENT || !isBrowser() || clickTrackingAttached) return

  document.addEventListener('click', handleTrackedClick, { capture: true })
  clickTrackingAttached = true
}

export function initBehaviorAnalytics() {
  if (IS_DEVELOPMENT || !isBrowser() || analyticsInitialized || (!CLARITY_PROJECT_ID && !GA_MEASUREMENT_ID) || shouldSkipAnalytics()) return false

  const attribution = captureAttribution()

  if (CLARITY_PROJECT_ID) {
    ensureClarityQueue()
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
    script.referrerPolicy = 'strict-origin-when-cross-origin'
    document.head.appendChild(script)
    setClarityTags({ traffic_channel: attribution.channel, utm_source: attribution.utm_source, utm_campaign: attribution.utm_campaign })
  }

  if (GA_MEASUREMENT_ID) {
    ensureGtag()
    const gaScript = document.createElement('script')
    gaScript.async = true
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
    document.head.appendChild(gaScript)
    window.gtag('js', new Date())
    // Page views são enviados manualmente (SPA); sem sinais de anúncios.
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
  }

  attachTrackedClickEvents()
  analyticsInitialized = true

  return true
}

export function trackRouteView(routePath) {
  if (!routePath) return
  sendClarityEvent(`page_${routePath}`)
  sendGaEvent('page_view', {
    page_path: routePath,
    page_location: window.location.href,
    page_title: document.title,
    traffic_channel: captureAttribution().channel,
  })
}
