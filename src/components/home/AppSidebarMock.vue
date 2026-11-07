<script setup>
import {
  Calendar,
  CalendarSearch,
  ChevronDown,
  ClipboardList,
  DollarSign,
  LayoutGrid,
  Megaphone,
  MoreHorizontal,
  Package,
  Stethoscope,
  Users,
  Workflow,
} from 'lucide-vue-next'

// Réplica do menu lateral do app (crm-clinica/src/components/layout/Sidebar.vue):
// mesmas seções, itens e ordem. Item ativo só com fundo azul claro, sem barra
// lateral. Medidas em em: o tamanho vem de --sbm-size no contêiner.
defineProps({
  active: { type: String, default: 'Calendário' },
})

const sections = [
  { title: null, links: [
    { text: 'Resumo', icon: LayoutGrid },
    { text: 'Calendário', icon: CalendarSearch },
    { text: 'Atendimentos', icon: Calendar },
  ] },
  { title: 'Gestão', links: [
    { text: 'Pacientes', icon: Users },
    { text: 'Prontuário', icon: ClipboardList, children: true },
    { text: 'Procedimentos', icon: Stethoscope },
    { text: 'Financeiro', icon: DollarSign, children: true },
  ] },
  { title: 'Automação', links: [
    { text: 'Marketing', icon: Megaphone, children: true },
    { text: 'Workflows', icon: Workflow },
  ] },
  { title: 'Operações', links: [
    { text: 'Estoque', icon: Package, children: true },
  ] },
]
</script>

<template>
  <aside class="sbm" aria-hidden="true">
    <div class="sbm-head">
      <span class="sbm-logo">S</span>
      <strong>Sua Clínica</strong>
      <MoreHorizontal class="sbm-more" />
    </div>
    <div v-for="(s, si) in sections" :key="si" class="sbm-section">
      <span v-if="s.title" class="sbm-title">{{ s.title }}</span>
      <span
        v-for="l in s.links"
        :key="l.text"
        class="sbm-link"
        :class="{ 'is-active': l.text === active }"
      >
        <component :is="l.icon" class="sbm-icon" />
        <span class="sbm-text">{{ l.text }}</span>
        <ChevronDown v-if="l.children" class="sbm-chev" />
      </span>
    </div>
  </aside>
</template>

<style scoped>
.sbm {
  font-size: var(--sbm-size, 11px);
  display: flex;
  flex-direction: column;
  padding: 1em 0.8em;
  background: #ffffff;
  color: #525866;
  min-width: 0;
}
.sbm-head {
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.3em 0.4em;
  margin-bottom: 0.9em;
}
.sbm-logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.3em;
  height: 2.3em;
  border-radius: 0.45em;
  background: #eef2ff;
  border: 1px solid #e5e7eb;
  color: #0057ff;
  font-weight: 700;
  font-size: 1em;
}
.sbm-head strong {
  flex: 1;
  min-width: 0;
  color: #1e293b;
  font-size: 1.05em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sbm-more { width: 1.3em; height: 1.3em; color: #6b7281; flex: none; }
.sbm-section { display: flex; flex-direction: column; gap: 0.18em; margin-bottom: 0.2em; }
.sbm-title {
  padding: 0.55em 0.7em 0.3em;
  color: #9ca3af;
  font-size: 0.72em;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.sbm-link {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.48em 0.7em;
  border-radius: 0.5em;
  color: #525866;
  font-size: 0.92em;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.35s, color 0.35s;
}
.sbm-icon { width: 1.35em; height: 1.35em; flex: none; transition: color 0.35s; }
.sbm-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.sbm-chev { width: 1.05em; height: 1.05em; color: #9ca3af; flex: none; }
.sbm-link.is-active { background: #eef2ff; color: #0057ff; font-weight: 600; }
</style>
