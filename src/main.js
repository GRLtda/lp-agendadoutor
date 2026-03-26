import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initBehaviorAnalytics, trackRouteView } from './services/behaviorAnalytics'

// Estilos
import './assets/css/normalize.css'
import './assets/css/global.css'
import './assets/css/custom-toast.css'

const app = createApp(App)

app.use(router)

initBehaviorAnalytics()

router.afterEach((to) => {
  trackRouteView(to.fullPath)
})

app.mount('#app')
