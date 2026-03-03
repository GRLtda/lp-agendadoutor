<script setup>
import { ref, onMounted } from 'vue'

const formData = ref({
  name: '',
  role: '',
  npsScore: null,
  newFeatures: '',
  biggestDifficulty: '',
  favoriteFeature: '',
  usageFrequency: '',
  isAnonymous: false,
})

const roles = ['Recepcionista', 'Médica', 'Dono']
const isSubmitting = ref(false)
const submitted = ref(false)

const submitSurvey = async () => {
  const { name, role, npsScore, isAnonymous } = formData.value
  
  if (!isAnonymous && (!name || !role)) return
  if (npsScore === null) return

  isSubmitting.value = true
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api.agendadoutor.com' // Ajuste conforme seu ambiente
    const response = await fetch(`${apiUrl}/v1/surveys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value)
    })

    if (response.ok) {
        submitted.value = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
        alert("Ocorreu um erro ao enviar a avaliação.")
    }
  } catch (err) {
    console.error(err)
    alert("Erro de conexão ao enviar a avaliação.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="survey-page">
    <div class="survey-card">
      
      <!-- Cabeçalho -->
      <div class="survey-header">
        <img 
          src="@/assets/logo_brand.svg" 
          alt="Agenda Doutor" 
          class="logo"
        />
      </div>

      <!-- Animação de Sucesso -->
      <div v-if="submitted" class="success-screen">
        <div class="success-icon-container">
          <svg class="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="title text-success">Muito Obrigado!</h2>
        <p class="subtitle text-center">
           Ficamos muito contentes em ter você usando o sistema Agenda Doutor. Suas respostas são fundamentais para evoluirmos!
        </p>
      </div>

      <!-- Formulário -->
      <form v-else @submit.prevent="submitSurvey" class="survey-form">
        <div class="form-header">
          <h2 class="title">Avaliação de Sistema</h2>
          <p class="subtitle">Queremos entender o que você mais gosta e como podemos melhorar!</p>
        </div>

        <!-- Modo Anônimo Toggle -->
        <div class="anonymous-toggle-container">
          <label class="anonymous-label">
            <div class="toggle-wrapper">
              <input 
                type="checkbox" 
                v-model="formData.isAnonymous" 
                class="toggle-input"
              />
              <div class="toggle-slider"></div>
            </div>
            <span class="toggle-text">Responder de forma anônima</span>
          </label>
          <p class="toggle-hint" v-if="formData.isAnonymous">
            Seus dados de identificação não serão enviados.
          </p>
        </div>

        <transition name="fade">
          <div v-if="!formData.isAnonymous" class="form-row">
            <!-- Nome -->
            <div class="form-group">
              <label class="form-label">Seu Nome *</label>
              <input 
                v-model="formData.name" 
                type="text" 
                :required="!formData.isAnonymous"
                class="form-input"
                placeholder="Ex: Maria Joana"
              />
            </div>

            <!-- Cargo -->
            <div class="form-group">
              <label class="form-label">Seu Cargo *</label>
              <select 
                v-model="formData.role"
                :required="!formData.isAnonymous"
                class="form-select"
              >
                <option value="" disabled>Selecione um Cargo</option>
                <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>
          </div>
        </transition>

        <!-- Pergunta 1: NPS -->
        <div class="form-group pt-divider">
          <label class="form-label">
            1. De 0 a 10, qual é a probabilidade de você recomendar o Agenda Doutor? *
          </label>
          <div class="nps-group">
            <label 
              v-for="n in 11" 
              :key="n-1" 
              class="nps-label"
            >
              <input 
                type="radio" 
                name="nps" 
                :value="n-1" 
                v-model="formData.npsScore" 
                class="hidden-radio"
                required
              />
              <div class="nps-button">
                {{ n-1 }}
              </div>
            </label>
          </div>
          <div class="nps-legend">
            <span>0 - Pouco provável</span>
            <span>10 - Muito provável</span>
          </div>
        </div>

        <!-- Pergunta 2: Frequencia -->
        <div class="form-group pt-divider">
          <label class="form-label">
            2. Com que frequência você utiliza o sistema?
          </label>
          <select 
            v-model="formData.usageFrequency"
            class="form-select"
          >
            <option value="" disabled>Selecione...</option>
            <option value="Todos os dias">Todos os dias</option>
            <option value="Algumas vezes na semana">Algumas vezes na semana</option>
            <option value="Raramente">Raramente</option>
          </select>
        </div>

        <!-- Pergunta 3: Maior Dificuldade -->
        <div class="form-group pt-divider">
          <label class="form-label">
            3. Qual é sua maior dificuldade atualmente com o Agenda Doutor?
          </label>
          <textarea 
            v-model="formData.biggestDifficulty"
            rows="3"
            class="form-textarea"
            placeholder="Ex: Acho difícil agendar retornos ou localizar pacientes antigos..."
          ></textarea>
        </div>

        <!-- Pergunta 4: Favorite feature -->
        <div class="form-group pt-divider">
          <label class="form-label">
            4. O que você mais gosta no sistema hoje?
          </label>
          <textarea 
            v-model="formData.favoriteFeature"
            rows="3"
            class="form-textarea"
            placeholder="Ex: Gosto muito do prontuário digital e da agilidade do sistema..."
          ></textarea>
        </div>

        <!-- Pergunta 5: Novas funcionalidades -->
        <div class="form-group pt-divider">
          <label class="form-label">
            5. Quais funcionalidades novas o Agenda Doutor poderia ter?
          </label>
          <textarea 
            v-model="formData.newFeatures"
            rows="3"
            class="form-textarea"
            placeholder="Ex: Gostaria que tivesse integração com WhatsApp para lembretes..."
          ></textarea>
        </div>

        <!-- Submit -->
        <div class="form-actions">
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="btn-primary"
          >
            <svg v-if="isSubmitting" class="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="isSubmitting">Enviando...</span>
            <span v-else>Enviar Avaliação</span>
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<style scoped>
/* Anonymous Toggle */
.anonymous-toggle-container {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.anonymous-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-wrapper {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.1rem;
  width: 1.1rem;
  left: 0.2rem;
  bottom: 0.2rem;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--azul-principal);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(1.25rem);
}

.toggle-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
}

.toggle-hint {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
  margin-left: 3.5rem;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Page & Container */
.survey-page {
  min-height: 100vh;
  background-color: var(--cinza-claro);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .survey-page {
    padding: 1.5rem;
  }
}

.survey-card {
  max-width: 42rem;
  width: 100%;
  background-color: var(--branco);
  border-radius: 0;
  box-shadow: none;
  border: none;
  padding: 1.5rem;
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 768px) {
  .survey-card {
    border-radius: var(--dp-border-radius);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    padding: 2rem;
    min-height: auto;
    display: block;
  }
}

/* Typography */
.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--preto);
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  font-size: 0.95rem;
  color: var(--cinza-texto);
  margin-bottom: 1.5rem;
}

.text-center {
  text-align: center;
}

.text-success {
  color: #059669; /* emerald-600 */
}

/* Header */
.survey-header {
  text-align: center;
  margin-bottom: 2rem;
}

.survey-header .logo {
  height: 3rem;
  margin: 0 auto;
}

/* Form Layout */
.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.survey-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.pt-divider {
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151; /* gray-700 */
}

/* Inputs */
.form-input, .form-select, .form-textarea {
  width: 100%;
  background-color: var(--branco);
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem;
  padding: 0.625rem 1rem;
  color: #111827; /* gray-900 */
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.form-textarea {
  resize: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--azul-principal);
  box-shadow: 0 0 0 3px rgba(0, 87, 255, 0.2);
}

.form-input::placeholder, .form-textarea::placeholder {
  color: #9ca3af; /* gray-400 */
}

/* NPS Radio Group */
.nps-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  padding: 0.5rem 0;
}

.nps-label {
  cursor: pointer;
}

.hidden-radio {
  display: none;
}

.nps-button {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  color: #4b5563; /* gray-600 */
  background-color: var(--branco);
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.hidden-radio:checked + .nps-button {
  background-color: var(--azul-principal);
  color: var(--branco);
  border-color: var(--azul-principal);
}

.nps-button:hover {
  background-color: #f9fafb;
}

.hidden-radio:checked + .nps-button:hover {
  background-color: var(--azul-escuro);
}

.nps-legend {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-top: 0.25rem;
  padding: 0 0.5rem;
}

/* Submit Button */
.form-actions {
  padding-top: 1.5rem;
}

.btn-primary {
  width: 100%;
  background-color: var(--azul-principal);
  color: var(--branco);
  font-weight: 600;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--azul-escuro);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-icon {
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Success Animation */
.success-screen {
  text-align: center;
  padding: 3rem 0;
  animation: fadeInOut 0.5s ease-out;
}

.success-icon-container {
  width: 6rem;
  height: 6rem;
  background-color: #d1fae5; /* emerald-100 */
  color: #059669; /* emerald-600 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.success-icon {
  width: 3rem;
  height: 3rem;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

.opacity-25 { opacity: 0.25; }
.opacity-75 { opacity: 0.75; }
</style>
