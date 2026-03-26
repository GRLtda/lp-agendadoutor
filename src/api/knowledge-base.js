const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const API_ROOT = API_BASE_URL.replace(/\/v1$/, '')

const KNOWLEDGE_BASE_URLS = Array.from(
  new Set([`${API_ROOT}/knowledge-base`, `${API_ROOT}/v1/knowledge-base`])
)

async function safeJson(response) {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) return null
  return response.json()
}

async function requestKnowledgeBase(pathname, fallbackMessage) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  let lastError = null

  for (const baseUrl of KNOWLEDGE_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${normalizedPath}`)

      if (response.ok) {
        return safeJson(response)
      }

      const payload = await safeJson(response)
      lastError = new Error(payload?.message || fallbackMessage)

      // Tenta o proximo endpoint em erros de rota/autenticacao.
      if ([401, 403, 404].includes(response.status)) {
        continue
      }

      throw lastError
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(fallbackMessage)
    }
  }

  throw lastError || new Error(fallbackMessage)
}

export async function fetchKnowledgeTree() {
  return requestKnowledgeBase('/tree', 'Nao foi possivel carregar a Central de Ajuda.')
}

export async function fetchKnowledgePageBySlug(slug) {
  return requestKnowledgeBase(
    `/pages/${encodeURIComponent(slug)}`,
    'Nao foi possivel carregar o artigo.'
  )
}
