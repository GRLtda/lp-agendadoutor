import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import { initBehaviorAnalytics, trackRouteView } from './services/behaviorAnalytics'

// Estilos
import './assets/css/normalize.css'
import './assets/css/global.css'
import './assets/css/custom-toast.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior,
  },
  ({ router }) => {
    if (import.meta.env.SSR) return

    initBehaviorAnalytics()

    router.afterEach((to) => {
      trackRouteView(to.fullPath)
    })
  },
)

export function includedRoutes() {
  return [
    '/',
    '/termos',
    '/privacidade',
    '/lgpd',
    '/atualizacao',
    '/questionario',
  ]
}
