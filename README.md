# Landing Page (Vue 3 + Vite)

## Heatmap e rastreamento de cliques

Esta landing esta integrada com o Microsoft Clarity para gerar:

- mapa de calor;
- gravacoes de sessao;
- eventos de clique nos principais CTAs.

## Configuracao

1. Crie um projeto no [Microsoft Clarity](https://clarity.microsoft.com/).
2. Copie o `Project ID`.
3. Preencha `VITE_CLARITY_PROJECT_ID` no `.env`.
4. Defina `VITE_ANALYTICS_ALLOWED_HOSTS` com os dominios de producao.
5. Mantenha `VITE_ANALYTICS_ALLOW_BOTS=false` para ignorar bots/headless.

Sem `VITE_CLARITY_PROJECT_ID`, o rastreamento fica desativado.
