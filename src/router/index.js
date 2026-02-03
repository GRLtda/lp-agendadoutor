import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
            path: '/login',
            name: 'login',
            component: () => null,
            beforeEnter() {
                window.location.href = `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/login`
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () => null,
            beforeEnter() {
                window.location.href = `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/register`
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
