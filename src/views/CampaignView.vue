<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, Gift, Sparkles, X } from 'lucide-vue-next'
import HomeView from './HomeView.vue'

const CAMPAIGN_STORAGE_KEY = 'agenda_campaign_coupon'
const campaignNames = {
  milenakarla: 'Milena Karla',
  leonardoamaral: 'Leonardo Amaral',
}

const route = useRoute()
const router = useRouter()
const isOpen = ref(true)
const loading = ref(true)
const errorMessage = ref('')
const campaign = ref(null)

const slug = computed(() => String(route.params.slug || '').toLowerCase())
const campaignName = computed(() => campaignNames[slug.value] || 'Agenda Doutor')

function getStoredCampaign() {
  try {
    const stored = JSON.parse(localStorage.getItem(CAMPAIGN_STORAGE_KEY) || 'null')
    if (!stored?.token || !stored?.expiresAt) return null

    if (new Date(stored.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(CAMPAIGN_STORAGE_KEY)
      return null
    }

    return stored
  } catch (_error) {
    localStorage.removeItem(CAMPAIGN_STORAGE_KEY)
    return null
  }
}

function saveCampaign(data) {
  const payload = {
    slug: data.slug,
    name: data.name,
    token: data.token,
    claimedAt: data.claimedAt,
    expiresAt: data.expiresAt,
    setupFeeWaived: data.setupFeeWaived,
  }

  localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(payload))
  campaign.value = payload
}

async function claimCampaign() {
  loading.value = true
  errorMessage.value = ''

  const stored = getStoredCampaign()
  if (stored?.slug === slug.value) {
    campaign.value = stored
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.agendadoutor.com'}/campaigns/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug.value }),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result?.error?.message || result?.message || 'Nao foi possivel ativar o presente.')
    }

    saveCampaign(result.data || result)
  } catch (error) {
    errorMessage.value = error.message || 'Nao foi possivel ativar o presente.'
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  if (!campaign.value?.token) return

  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
  const target = new URL('/register', appUrl)
  target.searchParams.set('campaignToken', campaign.value.token)
  window.location.href = target.toString()
}

onMounted(() => {
  if (!campaignNames[slug.value]) {
    router.replace('/')
    return
  }

  claimCampaign()
})
</script>

<template>
  <HomeView />

  <Transition name="campaign-fade">
    <div v-if="isOpen" class="campaign-overlay" role="dialog" aria-modal="true">
      <div class="campaign-modal">
        <button class="close-button" type="button" aria-label="Fechar" @click="isOpen = false">
          <X :size="18" />
        </button>

        <div class="gift-stage" aria-hidden="true">
          <span class="spark spark-one"><Sparkles :size="16" /></span>
          <span class="spark spark-two"><Sparkles :size="14" /></span>
          <div class="gift-icon">
            <Gift :size="36" />
          </div>
        </div>

        <span class="campaign-kicker">{{ campaignName }}</span>
        <h1>Parabens, voce ganhou um presente.</h1>

        <p v-if="!errorMessage">
          Seu setup fica gratis pelos proximos 3 dias.
        </p>
        <p v-else class="error-copy">{{ errorMessage }}</p>

        <div class="campaign-actions">
          <button class="primary-action" type="button" :disabled="loading || !campaign?.token" @click="goToRegister">
            <span>{{ loading ? 'Ativando...' : 'Registrar' }}</span>
            <ArrowRight :size="17" />
          </button>
          <button class="ghost-action" type="button" @click="isOpen = false">Fechar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.campaign-overlay {
  align-items: center;
  background: rgba(15, 23, 42, 0.24);
  backdrop-filter: blur(10px);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 500;
}

.campaign-modal {
  animation: modal-rise 0.42s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
  max-width: 430px;
  padding: 2rem;
  position: relative;
  text-align: center;
  width: min(100%, 430px);
}

.close-button {
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  height: 34px;
  justify-content: center;
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 34px;
}

.gift-stage {
  display: grid;
  justify-items: center;
  margin: 0 auto 1rem;
  position: relative;
  width: 120px;
}

.gift-icon {
  align-items: center;
  animation: gift-pop 1.8s ease-in-out infinite;
  background: #eef2ff;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  color: var(--primary);
  display: flex;
  height: 76px;
  justify-content: center;
  width: 76px;
}

.spark {
  color: #2563eb;
  position: absolute;
}

.spark-one {
  animation: spark-float 1.9s ease-in-out infinite;
  left: 10px;
  top: 6px;
}

.spark-two {
  animation: spark-float 1.9s ease-in-out 0.4s infinite;
  right: 8px;
  top: 34px;
}

.campaign-kicker {
  color: var(--primary);
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 0.55rem;
  text-transform: uppercase;
}

.campaign-modal h1 {
  color: #0f172a;
  font-size: 1.75rem;
  letter-spacing: 0;
  line-height: 1.12;
  margin: 0;
}

.campaign-modal p {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.55;
  margin: 0.85rem auto 1.35rem;
  max-width: 320px;
}

.campaign-modal .error-copy {
  color: #dc2626;
}

.campaign-actions {
  display: grid;
  gap: 0.65rem;
  grid-template-columns: 1fr auto;
}

.primary-action,
.ghost-action {
  align-items: center;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  min-height: 46px;
  padding: 0 1.1rem;
}

.primary-action {
  background: var(--primary);
  border: none;
  color: #ffffff;
  gap: 0.45rem;
}

.primary-action:disabled {
  cursor: wait;
  opacity: 0.65;
}

.ghost-action {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.campaign-fade-enter-active,
.campaign-fade-leave-active {
  transition: opacity 0.2s ease;
}

.campaign-fade-enter-from,
.campaign-fade-leave-to {
  opacity: 0;
}

@keyframes modal-rise {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gift-pop {
  0%, 100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-4px) scale(1.03);
  }
}

@keyframes spark-float {
  0%, 100% {
    opacity: 0.35;
    transform: translateY(4px) scale(0.92);
  }

  50% {
    opacity: 1;
    transform: translateY(-4px) scale(1);
  }
}

@media (max-width: 520px) {
  .campaign-modal {
    border-radius: 16px;
    padding: 1.5rem;
  }

  .campaign-actions {
    grid-template-columns: 1fr;
  }
}
</style>
