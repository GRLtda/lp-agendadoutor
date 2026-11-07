# Navegação da landing page

## Status dos serviços no footer

O footer incorpora o badge público de
`https://status.agendadoutor.com/badge?theme=light` em iframe de 250 × 30 px,
com tema claro, sem borda ou rolagem e título acessível. Em telas estreitas,
a largura fica limitada ao espaço disponível. O badge substitui a mensagem
fixa de sistemas operacionais; seu conteúdo e disponibilidade dependem da
página externa de status, sem autenticação ou consulta às APIs pela landing.

Para verificar, abrir o footer no desktop e no celular e conferir o carregamento
do badge, ausência de rolagem e de overflow horizontal. Conferir que a frase
fixa e o ponto verde antigo não aparecem mais. Executar `npm run build` para
validar a compilação e o HTML gerado pelo SSG.

O botão **Começar agora** no cabeçalho, tanto no desktop quanto no menu mobile, leva à rota `/register`. Essa rota redireciona para o cadastro do aplicativo usando `VITE_APP_URL` (ou a URL local padrão em desenvolvimento). Em produção, `vercel.json` também redireciona `/register` para `https://app.agendadoutor.com/register`.

Os cliques desses botões são identificados por `header_register_comecar_agora` e `mobile_menu_register_comecar_agora`. Os links de contato pelo WhatsApp continuam disponíveis nos pontos dedicados a atendimento.

Para verificar, abra a página em desktop e mobile, acione **Começar agora** e confira se o destino final é a tela de cadastro do aplicativo.

## Rota de suporte

`/suporte` redireciona para `https://web.whatsapp.com/`, sem número de telefone
ou mensagem predefinida. O destino é fixo: parâmetros da URL não escolhem outro
endereço e a rota não exige autenticação na landing page.

Na Vercel, `vercel.json` aplica um redirecionamento temporário HTTP 307 antes
de servir a aplicação. No desenvolvimento e na navegação pelo Vue Router,
`window.location.replace` abre o mesmo destino, sem manter `/suporte` no histórico.
O SSG gera `dist/suporte/index.html` para permitir acesso direto no preview
e em hospedagens estáticas que resolvem diretórios. Nesses ambientes, o
redirecionamento depende de JavaScript. A rota tem `noindex, nofollow` e fica
fora do sitemap. Não altera os links de contato existentes com número de suporte.

Para verificar, executar `npm run build`, conferir `dist/suporte/index.html`
e abrir `/suporte` em `npm run dev` ou `npm run preview`; o navegador deve
abrir o WhatsApp Web. Após o deploy, `curl -I https://www.agendadoutor.com/suporte`
deve retornar HTTP 307 e `Location: https://web.whatsapp.com/` sem executar Vue.

## Landing page do evento

`/evento/<código>` usa o mesmo cabeçalho, mas o **Começar agora** recebe `register-href` e leva a `/register?campanha=<código>` em vez de `/register`. A rota fica fora do menu e do sitemap. Detalhes: [evento.md](evento.md).
