# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Heatmap e rastreamento de cliques

Esta landing está integrada com o Microsoft Clarity para gerar:

- mapa de calor;
- gravações de sessão;
- eventos de clique nos principais CTAs.

### Configuração

1. Crie um projeto no [Microsoft Clarity](https://clarity.microsoft.com/).
2. Copie o `Project ID`.
3. Preencha a variável `VITE_CLARITY_PROJECT_ID` no arquivo `.env`.

Sem o `VITE_CLARITY_PROJECT_ID`, o rastreamento fica desativado.
