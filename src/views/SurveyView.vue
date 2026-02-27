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
})

const roles = ['Recepcionista', 'Médica', 'Dono']
const isSubmitting = ref(false)
const submitted = ref(false)

const submitSurvey = async () => {
  if (!formData.value.name || !formData.value.role || formData.value.npsScore === null) return

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
        <h2 class="title text-success">Muito Obrigado! 💖</h2>
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

        <div class="form-row">
          <!-- Nome -->
          <div class="form-group">
            <label class="form-label">Seu Nome *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              required
              class="form-input"
              placeholder="Ex: Maria Joana"
            />
          </div>

          <!-- Cargo -->
          <div class="form-group">
            <label class="form-label">Seu Cargo *</label>
            <select 
              v-model="formData.role"
              required
              class="form-select"
            >
              <option value="" disabled>Selecione um Cargo</option>
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
        </div>

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
