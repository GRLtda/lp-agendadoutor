# Navegação da landing page

O botão **Começar agora** no cabeçalho, tanto no desktop quanto no menu mobile, leva à rota `/register`. Essa rota redireciona para o cadastro do aplicativo usando `VITE_APP_URL` (ou a URL local padrão em desenvolvimento). Em produção, `vercel.json` também redireciona `/register` para `https://app.agendadoutor.com/register`.

Os cliques desses botões são identificados por `header_register_comecar_agora` e `mobile_menu_register_comecar_agora`. Os links de contato pelo WhatsApp continuam disponíveis nos pontos dedicados a atendimento.

Para verificar, abra a página em desktop e mobile, acione **Começar agora** e confira se o destino final é a tela de cadastro do aplicativo.
