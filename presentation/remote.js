const encoder = new TextEncoder()
const decoder = new TextDecoder()
const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
const endpoint = (import.meta.env.VITE_API_URL || 'https://apiclinic.squareweb.app').replace(/\/$/, '').replace(/\/v1$/, '') + '/presentation/pdn'

export function createSecret() {
  return hex(crypto.getRandomValues(new Uint8Array(32)))
}

export async function connectRemote(secret, onMessage, onConnection) {
  const bytes = Uint8Array.from(secret.match(/.{2}/g), part => parseInt(part, 16))
  const key = await crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['encrypt', 'decrypt'])
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const room = hex(new Uint8Array(digest))
  const headers = { 'Content-Type': 'application/json', 'X-Presentation-Room': room }
  const seen = new Set()
  let stopped = false
  let since = 0
  let pollTimer
  let connected = null
  const activeRequests = new Set()

  function reportConnection(value) {
    if (connected === value || stopped) return
    connected = value
    onConnection(value)
  }

  async function request(options) {
    const abort = new AbortController()
    activeRequests.add(abort)
    const timeout = setTimeout(() => abort.abort(), 5000)
    try {
      const response = await fetch(endpoint + (options.method === 'GET' ? '?since=' + since : ''), {
        ...options, headers, cache: 'no-store', signal: abort.signal,
      })
      if (!response.ok) throw new Error('Presentation connection ' + response.status)
      return response
    } finally {
      clearTimeout(timeout)
      activeRequests.delete(abort)
    }
  }

  async function poll() {
    try {
      const response = await request({ method: 'GET' })
      const result = await response.json()
      since = result.now - 2000
      for (const packet of result.packets) {
        try {
          const iv = Uint8Array.from(atob(packet.iv), char => char.charCodeAt(0))
          const data = Uint8Array.from(atob(packet.data), char => char.charCodeAt(0))
          const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
          const message = JSON.parse(decoder.decode(clear))
          if (stopped || seen.has(message.id)) continue
          seen.add(message.id)
          if (seen.size > 1024) seen.delete(seen.values().next().value)
          onMessage(message)
        } catch { /* Ignore malformed or unauthenticated packets. */ }
      }
      reportConnection(true)
    } catch {
      reportConnection(false)
    } finally {
      if (!stopped) pollTimer = setTimeout(poll, document.hidden ? 700 : 220)
    }
  }
  poll()

  return {
    async send(message) {
      if (stopped) return
      try {
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key,
          encoder.encode(JSON.stringify({ ...message, id: createSecret() })))
        await request({ method: 'POST', body: JSON.stringify({
          iv: btoa(String.fromCharCode(...iv)),
          data: btoa(String.fromCharCode(...new Uint8Array(data))),
        }) })
      } catch {
        reportConnection(false)
      }
    },
    close() {
      stopped = true
      clearTimeout(pollTimer)
      activeRequests.forEach(abort => abort.abort())
    },
  }
}
