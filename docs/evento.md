# Landing page do evento (`/evento/<código>`)

Página para quem chega pelo QR code da palestra **Posicionamento no Digital**.
A oferta é de **1 mês grátis com cartão obrigatório**: nada é cobrado no
cadastro, e a primeira fatura (mensalidade + taxa de instalação de R$ 100) vem
depois dos dias grátis. Pensada primeiro para celular.

## Link e campanha

- O link divulgado é `agendadoutor.com/evento/<código>`, com o código da campanha criada em **Admin → Campanhas** ([painel](../../crm-clinica-admin/docs/CAMPANHAS.md)).
- Não existe campanha padrão. `/evento` sem código volta para a home: no navegador pelo `beforeEnter` da rota e, em produção, por um redirecionamento temporário na `vercel.json`.
- Depois de montar, a página:
  1. registra o acesso (`POST /auth/signup-campaigns/<código>/visit`, com marcador de visitante único no `localStorage`);
  2. consulta a campanha (`GET /auth/signup-campaigns/<código>`) e aplica o **nome do evento** (mostrado no ingresso), os **dias grátis** e o **prazo** reais. Até a resposta chegar, o ingresso fica sem nome de evento.
- Todos os CTAs levam a `${VITE_APP_URL}/register?campanha=<código>`. O cadastro grava a campanha e o checkout do onboarding cria a assinatura com teste na Stripe. Mudar o nome do parâmetro `campanha` quebra o benefício. Fluxo completo: [Assinatura e teste gratuito](../../api-clinic/docs/ASSINATURA_E_TRIAL.md#campanha-de-autocadastro-com-teste-na-stripe).
- Estados da oferta:

  | Estado | Quando | O que muda |
  | --- | --- | --- |
  | `unknown` | API indisponível | Mantém a oferta com os textos padrão. A API decide no cadastro. |
  | `open` | Campanha aberta | Dias e prazo reais, contador ativo. |
  | `ended` | Campanha inexistente, pausada, fora do prazo, ou quando o contador zera | Ingresso marcado como encerrado, contador vira "O período do presente terminou." e os CTAs levam a `/register` sem campanha. |

`src/config/event.js` guarda só os padrões do HTML pré-renderizado (dias, taxa e
WhatsApp) e as funções `eventRegisterUrl`,
`appRegisterUrl`, `loadEventCampaign` e `trackEventVisit`. Usa `VITE_API_URL` e
`VITE_APP_URL`.

## Estrutura e movimento

Identidade da home: azul `#0057FF` → `#1B69FF` (gradiente do logo), tinta
`#1C2035`, DM Sans, grade sutil e as telas reais do sistema
(`tela_calendario.png`, `Pronturario.png`, fundo `whatsapp_bg.jpg`). As cores de
status seguem o calendário: Agendado em azul, Confirmado em âmbar, Realizado em
verde.

| Seção | Arquivo | Movimento |
| --- | --- | --- |
| Header | `AppHeader` com `register-href` | Igual ao site; o **Começar agora** leva ao cadastro com campanha. |
| Abertura | `components/event/EventIntro.vue` | Envelope da marca se abre (selo, aba em 3D) e o ingresso sai do bolso, gira e para no centro. É CSS puro: começa antes da hidratação, e a oferta e o CTA **Ativar meu mês grátis** aparecem em cerca de 2,6 s. Depois, inclinação 3D seguindo o ponteiro (desktop) e flutuação leve. |
| Ponte | `EventView.vue` | Frase de transição. |
| Cenas | `components/event/EventStory.vue` | Quatro cenas fixadas (pin) com scrub: confirmações no WhatsApp → confirmação automática (status Agendado → Confirmado, contador de pendências zerando); agenda em bilhetes → calendário real; arquivos espalhados → prontuário real; recibos soltos → lançamentos organizados. O problema se acumula, sai da tela, o fundo clareia e a interface entra. |
| Manifesto | `EventView.vue` | Palavras acendem com o scroll. Logo depois vem o contador: não há seção de passo a passo (conta e cartão) para não desestimular a assinatura. A exigência do cartão continua explicada nas perguntas frequentes. |
| Contador | `components/event/EventCountdown.vue` | "Seu presente está liberado. Mas não para sempre." Dias, horas, minutos e segundos até o **Fim** da campanha, com rolagem dos dígitos e faixa de luz que acompanha o scroll. CTA **Garantir meu mês grátis**. Sem prazo configurado, mostra só o texto de exclusividade. |
| Perguntas | `EventView.vue` | Acordeão com altura animada. |
| CTA final | `EventView.vue` | Fechamento com o CTA. |
| CTA fixo (celular) | `EventView.vue` | Aparece fora da abertura, do contador e do CTA final. |

O movimento de scroll fica em `src/composables/useEventMotion.js`. GSAP e
ScrollTrigger são importados sob demanda depois da montagem, em pedaços
separados. `ScrollTrigger.config({ ignoreMobileResize: true })` evita saltos com a
barra de endereço do celular. No celular, as cenas usam `100svh`, título em cima e
interface embaixo, com espaço reservado para o CTA fixo.

**Movimento reduzido** (`prefers-reduced-motion`): não há envelope nem pin. O
ingresso aparece pronto e cada cena mostra direto a solução.

O contador usa o relógio do aparelho. Um relógio errado mostra outro tempo
restante, mas o prazo vale na API, que recusa o benefício depois do fim.

## SEO e rotas

- Rota `/evento/:code?` com `noindex, nofollow` e header `X-Robots-Tag` na Vercel (`/evento(/.*)?`). Fora do `sitemap.xml`.
- O SSG gera `dist/evento/index.html` como casca. A `vercel.json` reescreve `/evento/:code` para esse arquivo e redireciona `/evento` para `/`.

## Analytics

Cliques rastreados por `data-track-click` (ver [analytics](analytics.md)):
`event_lp_cta_hero`, `event_lp_cta_countdown`, `event_lp_cta_countdown_ended`,
`event_lp_cta_final`, `event_lp_cta_sticky`, `event_lp_whatsapp_faq` e
`event_lp_faq_<n>`. O header usa os mesmos nomes da home
(`header_register_comecar_agora`, `mobile_menu_register_comecar_agora`). Os
acessos ao link são contados pela API e aparecem no admin.

## Como verificar

1. `npm run build` e conferir `dist/evento/index.html`.
2. `npm run dev`, abrir `/evento/<código>` em 375 × 812 e no desktop:
   - envelope abre, ingresso sai e o CTA aparece;
   - cada cena troca do problema para a solução com o scroll, sem rolagem horizontal nem conteúdo atrás do CTA fixo;
   - contador com o prazo da campanha; ao zerar, a página passa para "encerrada".
3. Com movimento reduzido ativo no sistema, conferir a versão estática.
4. Conferir que os CTAs apontam para `/register?campanha=<código>`, que o cadastro mostra a faixa de dias grátis e que o acesso foi contado no detalhe da campanha no admin.
