# SEO e descoberta por plataformas de IA

A fonte pública de identificação do Agenda Doutor é a landing page em https://www.agendadoutor.com/. O aplicativo autenticado não faz parte desta indexação.

## Implementação

- Vite SSG gera HTML com conteúdo e metadados antes da execução de JavaScript pelo visitante.
- `src/seo/product.js` compartilha a descrição do produto e **todas** as perguntas do FAQ da home com o JSON-LD, evitando divergências. O FAQ visível e o `FAQPage` têm as mesmas 10 perguntas; links internos de uma resposta (campo `link`) aparecem só na interface. Estrutura da home: [home.md](home.md).
- `src/App.vue` publica Organization, WebSite, SoftwareApplication e WebPage nas páginas indexáveis. A home também publica FAQPage com as perguntas compartilhadas e acessíveis na interface. Não há preços, avaliações ou certificações adicionados ao schema.
- Cada rota pública tem título, descrição e canonical sem parâmetros de rastreamento. Páginas noindex não recebem canonical nem JSON-LD.
- `public/robots.txt` permite rastreamento público e explicita OAI-SearchBot. A política geral existente para outros robôs, incluindo treinamento, permanece permitida. Robots não substitui autenticação.
- `public/sitemap.xml` lista as páginas públicas; questionário e rotas de acesso ao app ficam fora dele.
- `public/llms.txt` resume identidade, recursos e fontes oficiais. É um arquivo auxiliar, sem garantia de adoção pelas plataformas e sem substituir HTML ou sitemap.

## Validação e publicação

Execute `npm run build` e confira em `dist/index.html` a descrição, canonical e JSON-LD. Verifique também as páginas legais e de atualizações. `dist/questionario/index.html` deve manter noindex e não conter JSON-LD. As perguntas do FAQ devem coincidir com as respostas estruturadas (10 botões `.faq-q` e 10 `Question`). A home tem um único `h1`; as telas demonstrativas das funcionalidades são criadas só no cliente, mas o texto de cada capítulo está no HTML gerado.

Depois do deploy, confirme HTTP 200 para home, sitemap, robots e llms.txt e ausência de bloqueios do CDN/WAF para robôs de busca. Envie o sitemap ao Google Search Console e ao Bing Webmaster Tools com a conta proprietária. Use o Rich Results Test para validar a sintaxe; FAQPage não garante resultado enriquecido para sites de software. Monitore indexação, acessos de robôs e referências ao domínio nas plataformas. A publicação e esses cadastros externos não são executados pelo build local.

Não há garantia de indexação, recomendação ou citação por IA. Dados estruturados devem refletir o conteúdo público e afirmações comerciais precisam ser comprováveis.

## Referências

- [Google: recursos de IA e seu site](https://developers.google.com/search/docs/appearance/ai-features)
- [OpenAI: rastreadores e OAI-SearchBot](https://developers.openai.com/api/docs/bots)