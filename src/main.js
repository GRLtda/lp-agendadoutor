import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ---- FORÇA LIMPEZA DE CACHE E SERVICE WORKERS ANTIGOS ----
// Desregistra qualquer Service Worker (PWA) ativo ou preso no navegador do usuário
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
            registration.unregister()
                .then(() => console.log('Service Worker desregistrado com sucesso no app principal.'))
                .catch((err) => console.error('Erro ao desregistrar SW:', err))
        }
    })
}

// Deleta todos os Caches armazenados no navegador (incluindo HTML/CSS/JS velhos)
if ('caches' in window) {
    caches.keys().then((names) => {
        for (const name of names) {
            caches.delete(name)
                .then(() => console.log(`Cache ${name} deletado com sucesso.`))
                .catch((err) => console.error('Erro ao limpar cache:', err))
        }
    })
}
// ------------------------------------------------------------

// Estilos
import './assets/css/normalize.css'
import './assets/css/global.css'
import './assets/css/custom-toast.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
