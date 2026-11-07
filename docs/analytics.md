# Microsoft Clarity

A configuracao esta no [README](../README.md#configuracao). O modulo src/services/behaviorAnalytics.js bloqueia inicializacao e envio de eventos quando import.meta.env.DEV e verdadeiro ou MODE e dev, development ou test, mesmo com Project ID configurado ou window.clarity existente. Nesses ambientes nao injeta script, cria fila ou registra listeners de cliques.

Nos demais ambientes, exige VITE_CLARITY_PROJECT_ID e preserva os filtros de dominio e bots existentes.

Validacao: em npm run dev, conferir ausencia de script e requisicoes clarity.ms ao navegar e clicar; em producao com ID, dominio permitido e navegador comum, conferir carregamento e eventos.
