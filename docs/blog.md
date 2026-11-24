# Blog na landing page

O blog pertence à LP `lp-agendadoutor`, no mesmo domínio e nas rotas `/blog`
e `/blog/:slug`. Não é uma página do aplicativo `agenda-doutor`.

`BlogView.vue` usa diretamente os componentes reais `AppHeader`, `AppFooter`
e `AppButton`. A logo é o mesmo SVG importado pelo header da home. O blog é
sempre claro, inclusive quando o sistema operacional prefere tema escuro.
`HomeBlog.vue` adiciona uma seção de artigos à home, com link e até três
publicações reais. Header e footer compartilhados também oferecem acesso ao blog.

## Renderização e SEO

O conteúdo vem de `/v1/blog/posts` e `/v1/blog/posts/:slug`. A API fornece
Markdown renderizado com sanitização, autoria, fontes, imagens e metadados.
Não existe outro header/footer em um template HTML da API.

Para cada requisição pública, `api/blog.js` consulta a API e renderiza a própria
aplicação Vue da LP, por `src/blog/entry-server.js`. O documento inicial já
contém o artigo, os componentes compartilhados e os metadados. O cliente usa
o estado inicial e o mesmo bundle da LP para menu, navegação e interação.

Canonical, description, Open Graph, Twitter Card, BlogPosting e BreadcrumbList
são definidos em `src/blog/data.js`, sobre a infraestrutura Unhead existente.
Buscas/filtros são noindex; artigo inexistente e paginação fora da faixa dão
404 real. Falhas de serviço dão 503, sem cache de HTML editorial.

Os rewrites `/blog` e `/blog/*` foram adicionados ao `vercel.json` existente.
RSS, sitemap e imagens são encaminhados à API por esse mesmo gateway. As regras
anteriores de domínio, login, cadastro, eventos e páginas legais permanecem.
O robots existente foi preservado, com a descoberta do sitemap do blog.

## Configuração

- Na hospedagem da LP, o servidor usa a origem de `VITE_API_URL`, assim como
  o restante da LP. `BLOG_API_ORIGIN` é um override opcional para a função,
  com protocolo e sem `/v1` ou `/admin`.
- No cliente da LP: `VITE_API_URL`, configuração existente usada para
  carregar o feed da seção da home e para navegação local do blog.
  `VITE_API_BASE_URL` é aceito como alias para instalações anteriores.
- Na API: `BLOG_PUBLIC_ORIGIN=https://www.agendadoutor.com`, para URLs estáveis
  de imagens, RSS e sitemap no domínio público.
- A API inicializa os índices pelo `autoIndex` existente. Para conferência
  aditiva com o mesmo banco/TLS: `npm.cmd run blog:create-indexes` na API.

`npm.cmd run build` preserva o pré-render das oito rotas estáticas e cria
também `dist/server/entry-server.js` e o manifesto de assets. A função Vercel
inclui esses arquivos no empacotamento. Credenciais AWS continuam apenas na API.
A publicação usa os deploys automáticos das branches principais já configurados.

## Demonstrações do WhatsApp

As mensagens da abertura, funcionalidades, benefícios e evento usam
`WhatsAppConfirmAction`, composto pelo `AppButton` existente. O botão
"Confirmar consulta" substitui "Responda 1", incluindo as respostas ilustradas.
Pode ser acionado por clique ou teclado; o estado é apenas local à demonstração
e não envia mensagens nem altera consultas. As ilustrações continuam responsivas.

## Painel e testes

A publicação fica em `crm-clinic-admin`, opção **Blog** no menu Gestão, com
sessão, guarda de rotas, sidebar, topbar e componentes do painel existente.
Não há outro login editorial nem painel separado na aplicação do cliente.

O teste `npm.cmd run test:blog:browser` da API sobe a LP compilada, o painel e
MongoDB temporário, com S3 em memória e dados fictícios. Ele compara a logo e
os links do footer da home com os do blog, testa SEO sem JavaScript, menu
móvel, larguras 320–1440, preferência escura mantendo o visual claro, login do
painel existente, rascunho, upload, prévia, publicação e edição concorrente.
As evidências ficam em `artifacts/blog`. Fontes e serviços externos são
bloqueados no teste; o bucket real e o ambiente de hospedagem não são acessados.
