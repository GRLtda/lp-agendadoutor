import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const CAMPAIGN_STORAGE_KEY = 'agenda_campaign_coupon'

function getStoredCampaignToken() {
    if (typeof window === 'undefined') return null

    try {
        const stored = JSON.parse(window.localStorage.getItem(CAMPAIGN_STORAGE_KEY) || 'null')
        if (!stored?.token || !stored?.expiresAt) return null

        if (new Date(stored.expiresAt).getTime() <= Date.now()) {
            window.localStorage.removeItem(CAMPAIGN_STORAGE_KEY)
            return null
        }

        return stored.token
    } catch (_error) {
        window.localStorage.removeItem(CAMPAIGN_STORAGE_KEY)
        return null
    }
}

function buildAppUrl(path) {
    const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
    const target = new URL(path, appUrl)
    const campaignToken = getStoredCampaignToken()

    if (path === '/register' && campaignToken) {
        target.searchParams.set('campaignToken', campaignToken)
    }

    return target.toString()
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { title: 'Agenda Doutor' }
        },
        {
            path: '/termos',
            name: 'terms',
            component: () => import('../views/TermsView.vue'),
            meta: { title: 'Termos de Uso - Agenda Doutor' }
        },
        {
            path: '/privacidade',
            name: 'privacy',
            component: () => import('../views/PrivacyPolicyView.vue'),
            meta: { title: 'Política de Privacidade - Agenda Doutor' }
        },
        {
            path: '/lgpd',
            name: 'lgpd',
            component: () => import('../views/LgpdView.vue'),
            meta: { title: 'LGPD - Agenda Doutor' }
        },
        {
            path: '/atualizacao',
            name: 'changelog',
            component: () => import('../views/ChangelogView.vue'),
            meta: { title: 'Novidades - Agenda Doutor' }
        },
        {
            path: '/questionario',
            name: 'survey',
            component: () => import('../views/SurveyView.vue'),
            meta: { title: 'Avaliação - Agenda Doutor' }
        },
        {
            path: '/c/:slug',
            name: 'campaign',
            component: () => import('../views/CampaignView.vue'),
            meta: { title: 'Presente - Agenda Doutor' }
        },
        {
            path: '/login',
            name: 'login',
            component: () => null,
            beforeEnter() {
                window.location.href = buildAppUrl('/login')
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () => null,
            beforeEnter() {
                window.location.href = buildAppUrl('/register')
            }
        },
        // Legacy Redirect
        {
            path: '/app/:pathMatch(.*)*',
            name: 'legacy-app',
            component: () => null,
            beforeEnter(to) {
                const targetUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
                const pathMatch = to.params.pathMatch
                const pathString = Array.isArray(pathMatch) ? pathMatch.join('/') : (pathMatch || '')
                const path = pathString ? `/${pathString}` : ''
                window.location.href = `${targetUrl}${path}`
            }
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Agenda Doutor'
    next()
})

export default router
