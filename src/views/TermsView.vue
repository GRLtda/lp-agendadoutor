<script setup>
import { marked } from 'marked'
import AppHeader from '@/components/global/AppHeader.vue'
import AppFooter from '@/components/global/AppFooter.vue'

const markdownContent = `# Termos de Uso  
**Agenda Doutor**  
Última atualização: 20 de dezembro de 2025

---

## 1. Aceitação dos Termos
Ao acessar, criar uma conta ou utilizar a plataforma **Agenda Doutor**, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição aqui prevista, o uso da plataforma deve ser imediatamente interrompido.

Estes Termos constituem um contrato legalmente vinculante entre o usuário e o Agenda Doutor.

---

## 2. Descrição da Plataforma
O Agenda Doutor é uma plataforma digital destinada à gestão de clínicas e consultórios, oferecendo funcionalidades como:
- agendamento de atendimentos;
- prontuário eletrônico;
- gestão administrativa e financeira;
- organização de dados de pacientes;
- comunicação interna e operacional.

---

## 3. Elegibilidade e Cadastro
Para utilizar a plataforma, o usuário declara que:
- possui capacidade legal para contratar;
- fornece informações verdadeiras, completas e atualizadas;
- é responsável por manter seus dados corretos.

O Agenda Doutor poderá suspender ou cancelar contas que contenham informações falsas ou incompletas.

---

## 4. Responsabilidades do Usuário
O usuário é integralmente responsável por:
- manter a confidencialidade de suas credenciais de acesso;
- todas as atividades realizadas em sua conta;
- garantir que o uso da plataforma esteja em conformidade com a legislação vigente.

O Agenda Doutor não se responsabiliza por acessos não autorizados decorrentes de negligência do usuário.

---

## 5. Uso Proibido
É expressamente proibido:
- utilizar a plataforma para fins ilegais;
- violar direitos de terceiros;
- tentar acessar áreas restritas sem autorização;
- inserir códigos maliciosos ou realizar engenharia reversa;
- comprometer a segurança, integridade ou disponibilidade do sistema.

O descumprimento poderá resultar em suspensão imediata da conta, sem prejuízo de medidas legais.

---

## 6. Planos, Pagamentos e Cancelamento
Algumas funcionalidades podem estar sujeitas à contratação de planos pagos.

- Valores, condições e funcionalidades poderão ser alterados mediante aviso prévio;
- o cancelamento poderá ser solicitado conforme as regras do plano contratado;
- tributos eventualmente incidentes são de responsabilidade do usuário.

---

## 7. Propriedade Intelectual
Todo o conteúdo da plataforma, incluindo software, marcas, layout, textos e funcionalidades, é de propriedade exclusiva do **Agenda Doutor**, sendo protegido pela legislação brasileira e internacional.

Nenhuma licença é concedida, exceto para uso regular da plataforma.

---

## 8. Limitação de Responsabilidade
O Agenda Doutor não se responsabiliza por:
- danos indiretos, lucros cessantes ou perda de dados;
- falhas decorrentes de fatores externos;
- uso inadequado da plataforma pelo usuário.

---

## 9. Alterações dos Termos
Os Termos poderão ser atualizados periodicamente. O uso contínuo da plataforma após alterações indica aceitação automática das novas condições.

---

## 10. Contato
Dúvidas relacionadas a estes Termos poderão ser encaminhadas pelos canais oficiais de suporte da plataforma.`

const compiledMarkdown = marked(markdownContent)
</script>

<template>
  <div class="page-container landing-theme">
    <AppHeader />
    
    <!-- Background Blobs -->
    <div class="hero-bg-blobs"></div>

    <main class="content-wrapper">
      <div class="document-container glass-panel animate-slide-up">
        <div class="markdown-body" v-html="compiledMarkdown"></div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesLight.ttf') format('ttf');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesRegular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesMedium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Oakes';
  src: url('@/assets/fonts/OakesSemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

.landing-theme {
  font-family: 'Inter', sans-serif;
  --primary: #2563eb;
  --glass-bg: rgba(255, 255, 255, 0.7);
}

.page-container {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.hero-bg-blobs {
  position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 60%);
  border-radius: 50%; z-index: 0; pointer-events: none;
}

.content-wrapper {
  flex: 1;
  padding-top: 120px; /* Mais espaço para o header */
  position: relative;
  z-index: 1;
}

.document-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Estilização do Markdown Renderizado */
.markdown-body {
  color: #374151;
  line-height: 1.8;
}

:deep(h1) {
  font-family: 'Oakes', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

:deep(h2) {
  font-family: 'Oakes', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

:deep(p) {
  margin-bottom: 1.25rem;
  color: #475569;
  font-size: 1.05rem;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
  color: #475569;
}

:deep(li) {
  margin-bottom: 0.5rem;
}

:deep(strong) {
  font-weight: 600;
  color: #0f172a;
}

/* CSS removed as it is now in AppFooter */

/* Animation */
.animate-slide-up { animation: slideUp 0.8s ease forwards; opacity: 0; transform: translateY(20px); }
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .document-container {
    padding: 2rem;
    margin: 0 1rem;
  }
  
  :deep(h1) {
    font-size: 2rem;
  }
}
</style>
