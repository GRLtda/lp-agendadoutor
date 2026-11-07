// Landing page do evento. As campanhas (código, nome, dias grátis, prazo) são
// criadas no admin em Campanhas e chegam pela URL /evento/<codigo>; aqui ficam
// só os padrões do HTML pré-renderizado.
// Documentação: docs/evento.md
export const eventConfig = {
  // Texto inicial; substituído pelos dias da campanha depois que a página carrega.
  trialDays: 30,
  installationFee: 'R$ 100',
  whatsappUrl: 'https://wa.me/5511921923978',
}

const DEFAULT_APP_URL = 'http://localhost:5173'
const DEFAULT_API_URL = 'http://localhost:3001'
const VISIT_STORAGE_PREFIX = 'ad_campaign_visit:'

const apiUrl = () => (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '')

export function appRegisterUrl() {
  return `${import.meta.env.VITE_APP_URL || DEFAULT_APP_URL}/register`
}

export function eventRegisterUrl(code) {
  return code ? `${appRegisterUrl()}?campanha=${encodeURIComponent(code)}` : appRegisterUrl()
}

// Dados públicos da campanha ({ valid, label, trialDays, endsAt }) ou null.
export async function loadEventCampaign(code) {
  if (import.meta.env.SSR) return null
  try {
    const response = await fetch(`${apiUrl()}/auth/signup-campaigns/${encodeURIComponent(code)}`)
    if (!response.ok) return null
    const body = await response.json()
    return body?.data || body
  } catch {
    return null
  }
}

// Conta um acesso ao link. O primeiro acesso deste navegador marca visitante único.
export function trackEventVisit(code) {
  if (import.meta.env.SSR || !code) return
  let firstVisit = true
  try {
    const key = `${VISIT_STORAGE_PREFIX}${code}`
    firstVisit = !localStorage.getItem(key)
    if (firstVisit) localStorage.setItem(key, new Date().toISOString())
  } catch {
    // Armazenamento bloqueado: conta como acesso novo.
  }
  fetch(`${apiUrl()}/auth/signup-campaigns/${encodeURIComponent(code)}/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstVisit }),
    keepalive: true,
  }).catch(() => {})
}
