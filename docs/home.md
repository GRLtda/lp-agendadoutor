# Home da landing page (`/`)

Documento canônico da página inicial institucional. A página conta uma
história com o scroll: **problema → transformação → solução → benefício**.
A identidade é a do Agenda Doutor: azul do logo `#0057FF` → `#1B69FF`, tinta
`#1C2035`, DM Sans e as cores de status do calendário do app (Agendado azul,
Confirmado amarelo, Realizado verde, Cancelado vermelho, Em Atendimento roxo).

## Demos do app

As telas demonstrativas seguem o visual atual do app (`crm-clinica`):

- **Menu lateral**: `components/home/AppSidebarMock.vue` replica
  `crm-clinica/src/components/layout/Sidebar.vue` com todas as seções e itens
  (Resumo, Calendário, Atendimentos · Gestão: Pacientes, Prontuário,
  Procedimentos, Financeiro · Automação: Marketing, Workflows · Operações:
  Estoque). O item ativo tem só fundo `#eef2ff` e texto azul, sem barra
  lateral. É usado na abertura e no aparelho das funcionalidades; o tamanho vem
  de `--sbm-size`.
- **Agendamentos**: como os eventos de `crm-clinica/src/views/pages/calendario.vue`:
  fundo suave do status, borda fina interna, marcador vertical arredondado
  dentro do card e texto alinhado à esquerda. Sem borda lateral. Cores:
  Agendado `#3b82f6`/`#eef2ff`, Confirmado `#a16207`/`#fefce8` (marcador
  `#eab308`), Realizado `#16a34a`/`#f0fdf4`, Cancelado `#dc2626`/`#fef2f2`
  riscado, Em Atendimento `#7c3aed`/`#f5f3ff`.
- **Atendimento**: abas reais do prontuário (Informações, Prontuario,
  Planejamento Facial, Procedimentos, Termos, Imagens e Anexos).

Ao mudar o menu, as cores de status ou as abas no app, atualize as réplicas.

## Estrutura

`src/views/HomeView.vue` só monta as seções, define os tokens de cor e
movimento (`--ad-*`, `--ease-*`) e liga o movimento de scroll.

| Ordem | Seção | Arquivo | O que acontece |
| --- | --- | --- | --- |
| 1 | Abertura | `components/home/HomeHero.vue` | Título "Sua clínica mais organizada. Seu tempo mais valorizado.", CTAs e réplica da tela de Calendário. Em CSS (antes da hidratação), as consultas entram em sequência, uma nova consulta cai na sexta, chega a mensagem automática do WhatsApp, o paciente responde "1" e o status de Helena passa de Agendado para Confirmado. No desktop, a interface inclina levemente seguindo o ponteiro. Com o scroll, recua e o texto perde destaque. |
| 2 | Confirmações | `components/home/HomeConfirmStory.vue` | Cena fixada (pin + scrub). "Você ainda perde tempo confirmando cada consulta?" acende palavra por palavra, mensagens pendentes se espalham e o contador sobe até 27. Depois as mensagens se alinham e viram as linhas do painel "Confirmações de amanhã", cada status vira Confirmado, a barra enche e o texto passa para "Seu tempo é para cuidar dos pacientes. As confirmações, deixa com a gente." |
| 3 | Funcionalidades (`#funcionalidades`) | `components/home/HomeFeatures.vue` + `FeatureScreen.vue` | Seção escura que abre como máscara (clip-path) e fecha ao sair. Seis capítulos: agenda, confirmação pelo WhatsApp, prontuário, financeiro, anamnese e automação de marketing. No desktop, um único "app" fica fixo (sticky) e troca de tela, URL e item ativo do menu lateral a cada capítulo; as abas abaixo levam ao capítulo. Enquanto a seção escura cobre o topo da janela, o header some (evento `cover-top` → prop `hidden` do `AppHeader`); se a pessoa rolar para cima, ele reaparece, e volta a sumir ao descer. No celular, cada capítulo traz a própria tela, sem prender o scroll. Cada tela tem animação própria, que roda quando o capítulo cruza o meio da janela. |
| 4 | Antes e depois (`#beneficios`) | `components/home/HomeBeforeAfter.vue` + `BenefitTiles.vue` | Cena fixada: bilhetes, recibos, arquivos, alertas e mensagens espalhados ("Antes · Rotina sobrecarregada") são absorvidos pelo módulo certo do painel "Resumo do dia" (agenda, confirmações, financeiro, prontuário), e o seletor passa para "Depois · Rotina organizada". O elemento fixado (`.ba-scene`) ocupa a largura toda, sem margens, e o conteúdo centralizado fica em `.ba-scene-inner` com altura de uma tela; isso evita o pulo ao fixar e ao soltar a cena. Em seguida, os quatro benefícios, cada um com entrada e microinteração próprias (ver abaixo). |
| 5 | FAQ (`#faq`) | `components/home/HomeFaq.vue` | Duas colunas no desktop: composição "Dúvidas? A gente simplifica." com cartão de atendimento fixo (sticky) e acordeão personalizado (item aberto com fundo branco, sombra e ícone que vira "menos"; sem borda lateral). No celular, uma coluna com áreas de toque de pelo menos 68 px. |
| 6 | Fechamento | `components/home/HomeFinalCta.vue` | Cartão azul que se expande com o scroll (máscara), símbolo da marca desenhado em traço, chips de status flutuando e título que sobe palavra por palavra. "Pronto para ter uma rotina mais leve?" |
| — | CTA fixo (celular) | `components/home/HomeStickyCta.vue` | Barra com **Começar agora** e WhatsApp. Some enquanto a abertura, o fechamento ou o rodapé estão visíveis (elementos com `data-hide-sticky` e `#footer`). |

### Benefícios

| Benefício | Representação | Interação |
| --- | --- | --- |
| Mais tempo | Tarefas do dia que passam de "Manual" para "Automático" (marcação em sequência e faixa de varredura) e medidor circular "tempo para cuidar dos seus pacientes" | Interruptor "Automação" liga sozinho ao aparecer e pode ser alternado (`role="switch"`). Entrada por máscara da esquerda para a direita. |
| Menos faltas | Conversa do WhatsApp com "Responda 1 para confirmar" → "1" → Agendado vira Confirmado | Botão **Ver de novo** repete a conversa. Entrada em perspectiva. |
| Mais controle | Ocupação da semana e evolução da receita | Abas **Agenda / Financeiro** (`aria-pressed`). Entrada com escala. |
| Mais segurança | Termo de consentimento sendo assinado (aceite, confirmação de identidade, assinatura desenhada, selo "Assinado" e registros: data/hora, IP e dispositivo, PDF pelo WhatsApp) e lista: termos com validade jurídica, anamnese com consentimento, proteção de dados, histórico de atividades | Botão **Assinar de novo** repete a assinatura; hover nos itens. Link **Ver práticas de LGPD**. Entrada em subida. |

Os quatro blocos têm a mesma estrutura: cabeçalho (ícone, título, texto) e
um painel no estilo do app.

## Movimento

- `src/composables/useHomeMotion.js` importa GSAP e ScrollTrigger sob demanda
  depois da montagem (pedaços separados do bundle). Os gatilhos são criados na
  ordem do documento para que os espaçadores das cenas fixadas fiquem corretos.
- `gsap.matchMedia` separa desktop (`min-width: 900px`) e celular; ao mudar de
  faixa, tudo é revertido e recriado. No celular as cenas fixadas são mais
  curtas e os deslocamentos menores. `ScrollTrigger.config({ ignoreMobileResize: true })`
  evita saltos com a barra de endereço.
- As cenas fixadas só ganham a aparência "bagunçada" quando o movimento é
  montado: o composable adiciona `is-motion` em `[data-confirm-story]` e
  `[data-before-after]`. Sem essa classe, as duas cenas mostram direto a solução.
- Troca de capítulos, FAQ, benefícios e CTA fixo usam Vue +
  IntersectionObserver e transições CSS. Não dependem de GSAP.
- As telas demonstrativas das funcionalidades são decorativas
  (`aria-hidden`) e só são criadas no cliente, apenas para o layout em uso.
  Isso reduz o HTML pré-renderizado; o texto dos capítulos continua no HTML.
- **Movimento reduzido** (`prefers-reduced-motion: reduce`): o composable não
  monta nada, as cenas ficam no estado final, as animações CSS terminam
  imediatamente e as transições ficam instantâneas. FAQ, abas, interruptor e
  "Ver de novo" continuam funcionando.

## Conteúdo e fatos

- Telas e textos usam só recursos que existem no app: visão semana/mês,
  filtro por profissional e status no calendário; lembretes automáticos 24 h e
  2 h antes, mensagens de aniversário e de envio de anamnese (gatilhos de
  Marketing → Mensagens); prontuário com modelos prontos (Anamnese Geral,
  Retorno, Avaliação Inicial), cronômetro e as abas do atendimento; modelos de anamnese e de termos de consentimento
  personalizáveis; financeiro com receita, lucro, margem, evolução da receita e
  entradas/saídas em 7 dias; Workflows.
- "Validade jurídica" no bloco Mais segurança segue o próprio sistema: o PDF
  do termo assinado traz "Este documento possui validade legal conforme Lei
  Geral de Proteção de Dados (LGPD)" (`api-clinic/src/api/consent-terms/consent-term-pdf.service.js`).
  O termo é assinado pelo link com desenho, nome digitado ou imagem, aceite e
  confirmação de identidade, e grava data/hora, IP e dispositivo
  ([assinatura de termos](../../api-clinic/docs/CONSENT_TERMS.md)). A anamnese
  respondida pelo paciente grava o consentimento LGPD com IP, navegador e
  data/hora. Se o texto do PDF mudar, revise o bloco.
- Não há "arrastar e soltar" no calendário, por isso a promessa foi removida.
  Valores, nomes e horários das telas são ilustrativos.
- O FAQ e o JSON-LD `FAQPage` vêm da mesma lista, `src/seo/product.js`
  (`productQuestions`), com 10 perguntas. Itens com `link` mostram um link
  interno abaixo da resposta; o texto estruturado não inclui o link.
- Correções em relação à versão anterior: o armazenamento **não** é ilimitado
  (cada plano tem uma capacidade, ver [cotas](../../api-clinic/docs/STORAGE_QUOTAS.md));
  segurança descrita com as práticas da página de LGPD, sem "criptografia de
  ponta a ponta" nem "backups diários"; suporte pela equipe no WhatsApp, sem
  "prioritário"; removida a promessa de redução de faltas em percentual.
- A resposta sobre fidelidade ("pode cancelar quando quiser, sem multa") e o
  selo "Mais de 100 profissionais" mantêm o que já estava publicado. Qualquer
  mudança comercial deve ser refletida aqui e em `product.js`.

## CTAs e analytics

Todos os cliques usam `data-track-click` ([analytics](analytics.md)):

| Ponto | Destino | Identificador |
| --- | --- | --- |
| Abertura · Começar agora | `/register` | `hero_register_comecar_agora` |
| Abertura · Fale com nossa equipe | WhatsApp | `hero_whatsapp_fale_com_equipe` |
| Abertura · Entrar na conta | `/login` | `hero_login` |
| Benefícios · Ver práticas de LGPD | `/lgpd` | `beneficios_lgpd` |
| Benefícios · Quero modernizar minha agenda | WhatsApp | `beneficios_whatsapp_quero_modernizar` |
| FAQ · Falar com o suporte | WhatsApp | `faq_whatsapp_contato` |
| FAQ · pergunta *n* | abre/fecha | `faq_pergunta_<n>` |
| Fechamento · Começar agora | `/register` | `final_cta_register_comecar_agora` |
| Fechamento · Fale com nossa equipe | WhatsApp | `final_cta_whatsapp_fale_com_equipe` |
| CTA fixo · Começar agora | `/register` | `sticky_register_comecar_agora` |
| CTA fixo · WhatsApp | WhatsApp | `sticky_whatsapp_fale_com_equipe` |

O header e o rodapé não mudaram ([navegação](navegacao.md)). As âncoras
`#funcionalidades`, `#beneficios` e `#faq` continuam existindo.

## Acessibilidade e SEO

- Um `h1` ("Sua clínica mais organizada. Seu tempo mais valorizado."), com a
  linha "Sistema de gestão para clínicas e consultórios" logo acima. Título e
  descrição da rota continuam em `src/router/index.js`.
- Mockups são `aria-hidden` ou `role="img"` com descrição. Textos que mudam
  com o scroll estão no HTML nos dois estados.
- Acordeão: `button` com `aria-expanded`/`aria-controls`, região rotulada e
  resposta fechada `inert` (fora da ordem de foco), mas presente no HTML.
- Foco visível em botões, abas e links. Sem rolagem horizontal: `overflow-x: clip`
  na página, que mantém o `position: sticky` funcionando.

## Como verificar

1. `npm run build` e conferir em `dist/index.html`: o `h1`, as 10 perguntas
   do FAQ e as 10 `Question` do JSON-LD, os links `/register`, `/login`,
   `/lgpd` e do WhatsApp.
2. `npm run dev` no desktop (1440 × 900): a abertura anima sozinha; ao rolar,
   a cena de confirmações vai do problema à solução; a seção escura abre em
   máscara e o app troca de tela a cada capítulo (as abas levam ao capítulo);
   o header some na seção escura, volta ao rolar para cima e some de novo ao
   descer; a cena antes/depois fixa e solta sem pulo, absorve os itens e muda
   para "Depois"; os benefícios entram e respondem ao interruptor, às abas, a
   **Ver de novo** e **Assinar de novo**; o FAQ abre um item por vez; o cartão
   final se expande. Na abertura e no aparelho, conferir que o menu lateral e os
   cards de agendamento estão iguais ao app (sem barra lateral).
3. No celular (390 × 844): nada cortado e sem rolagem horizontal; as cenas
   fixadas cabem acima do CTA fixo; cada capítulo mostra a própria tela; o CTA
   fixo some na abertura, no fechamento e no rodapé.
4. Com "reduzir movimento" ativo no sistema: nenhuma cena fixada, solução
   visível direto, FAQ e interações funcionando.
5. Teclado: Tab percorre CTAs, abas das funcionalidades, interruptor, abas de
   controle, **Ver de novo** e perguntas do FAQ; Enter/Espaço abre e fecha.

## Limitações conhecidas

- As cenas fixadas aumentam a altura de rolagem; quem usa a âncora
  `#beneficios` chega ao início da cena antes/depois.
- Em abas em segundo plano o navegador desacelera as animações; ao voltar, o
  estado se ajusta ao scroll.
