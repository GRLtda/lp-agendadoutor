<script setup>
import { ref } from 'vue'
import { Check, Reply } from 'lucide-vue-next'
import AppButton from '@/components/global/AppButton.vue'

// Local interaction in the LP illustration; no appointment or message is sent.
const confirmed = ref(false)
</script>

<template>
  <AppButton
    variant="ghost"
    size="sm"
    class="whatsapp-confirm-action"
    :aria-pressed="confirmed"
    aria-label="Confirmar consulta na demonstração"
    @click="confirmed = !confirmed"
  >
    <Check v-if="confirmed" :size="14" aria-hidden="true" />
    <Reply v-else :size="14" aria-hidden="true" />
    {{ confirmed ? 'Confirmado' : 'Confirmar consulta' }}
  </AppButton>
</template>

<style scoped>
.whatsapp-confirm-action {
  display: flex;
  width: 100%;
  height: auto;
  min-height: 44px;
  margin-top: 0.6em;
  padding: 0.5em 0.25em;
  border: 0;
  border-top: 1px solid #b9d7c7;
  border-radius: 0;
  background: transparent;
  color: #087b63;
  font-size: inherit;
  font-weight: 600;
  white-space: normal;
  transition: background-color 160ms ease;
}
.whatsapp-confirm-action:hover {
  background: #c7e9d7;
  color: #065f4d;
}
.whatsapp-confirm-action:focus-visible {
  outline: 2px solid #087b63;
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  .whatsapp-confirm-action { transition: none; }
}
</style>
