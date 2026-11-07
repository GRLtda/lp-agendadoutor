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

Sem `VITE_CLARITY_PROJECT_ID`, o rastreamento fica desativado. Desenvolvimento e testes tambem desativam o Clarity, mesmo com ID configurado. Consulte [controle por ambiente](docs/analytics.md).

## SEO e descoberta por IA

Consulte [SEO e descoberta por plataformas de IA](docs/seo-geo.md) para arquitetura, limites e validação após publicação.

## Landing page do evento

Consulte [Landing page do evento (`/evento/<código>`)](docs/evento.md) para a experiência do ingresso, cenas com scroll, contador, contrato `?campanha=<código>`, analytics e verificação.

## Página inicial

Consulte [Home da landing page](docs/home.md) para a narrativa com scroll, seções, movimento (GSAP sob demanda e movimento reduzido), fontes dos textos do FAQ, CTAs, analytics e verificação.
