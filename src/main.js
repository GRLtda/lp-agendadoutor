import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Estilos
import './assets/css/normalize.css'
import './assets/css/global.css'
import './assets/css/custom-toast.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
