// Fonte compartilhada entre a página e os dados estruturados.
// Todas as perguntas abaixo aparecem no FAQ da home e no JSON-LD FAQPage,
// então as respostas devem refletir apenas condições reais do produto.
export const productDescription = 'O Agenda Doutor é um sistema de gestão online para clínicas e consultórios, com agenda médica, prontuário digital, financeiro, anamnese online e confirmação de consultas pelo WhatsApp.'

export const productQuestions = [
  { question: 'O que é o Agenda Doutor?', answer: productDescription },
  { question: 'Para quem é o Agenda Doutor?', answer: 'Para clínicas, consultórios e profissionais de saúde que precisam organizar agendamentos, registros de atendimento e a rotina financeira em uma plataforma online.' },
  { question: 'Posso acessar o sistema de qualquer lugar?', answer: 'Sim. O Agenda Doutor funciona online, direto no navegador. Você acessa com seu login pelo computador, tablet ou celular, de onde estiver.' },
  { question: 'O sistema envia lembretes automáticos?', answer: 'Sim. Com o WhatsApp da clínica conectado, a plataforma envia mensagens automáticas, como os lembretes 24 horas e 2 horas antes da consulta, e você personaliza os modelos dessas mensagens. Também há mensagens de aniversário e de envio de anamnese.' },
  { question: 'Posso personalizar os modelos de prontuário?', answer: 'Você cria e edita seus próprios modelos de anamnese e de termos de consentimento. No atendimento, o prontuário oferece modelos prontos, como Anamnese Geral, Retorno e Avaliação Inicial, e o texto pode ser ajustado livremente em cada registro.' },
  { question: 'É seguro armazenar os dados dos pacientes?', answer: 'O Agenda Doutor adota controle de acesso, criptografia, monitoramento de incidentes e boas práticas de desenvolvimento seguro. Os detalhes estão na página de LGPD e na Política de Privacidade.', link: { to: '/lgpd', label: 'Ver práticas de LGPD' } },
  { question: 'Há limite de armazenamento?', answer: 'Sim. Cada plano inclui uma capacidade de armazenamento para prontuários, exames, imagens e anexos, e você acompanha o uso pela plataforma. Fale com a nossa equipe para conhecer a capacidade de cada plano.' },
  { question: 'Como funciona o suporte?', answer: 'O suporte é feito pela nossa equipe no WhatsApp. É só chamar pelo botão desta página para tirar dúvidas e aproveitar melhor o sistema.' },
  { question: 'Existe fidelidade ou multa de cancelamento?', answer: 'Não. Você pode cancelar a sua assinatura quando quiser, sem multa de cancelamento.' },
  { question: 'Como conhecer o sistema e consultar condições comerciais?', answer: 'Fale com a equipe pelo WhatsApp disponível nesta página para conhecer o Agenda Doutor e consultar as condições comerciais. Quem já tem uma conta pode usar o link Entrar na conta.' },
]
