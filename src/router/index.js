import HomeView from '../views/HomeView.vue'

const DEFAULT_APP_URL = 'http://localhost:5173'

function redirectToApp(path = '') {
    if (import.meta.env.SSR) return true

    const appUrl = import.meta.env.VITE_APP_URL || DEFAULT_APP_URL
    window.location.replace(`${appUrl}${path}`)
    return false
}

export const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Sistema para Clínicas e Consultórios | Agenda Doutor',
            description: 'Gerencie agenda, prontuário eletrônico, financeiro e confirmações pelo WhatsApp. Conheça o Agenda Doutor para clínicas e consultórios.',
        },
    },
    {
        path: '/termos',
        name: 'terms',
        component: () => import('../views/TermsView.vue'),
        meta: {
            title: 'Termos de Uso | Agenda Doutor',
            description: 'Consulte os termos de uso da plataforma Agenda Doutor para clínicas, consultórios e profissionais da saúde.',
        },
    },
    {
        path: '/privacidade',
        name: 'privacy',
        component: () => import('../views/PrivacyPolicyView.vue'),
        meta: {
            title: 'Política de Privacidade | Agenda Doutor',
            description: 'Saiba como o Agenda Doutor coleta, utiliza, armazena e protege dados pessoais em sua plataforma.',
        },
    },
    {
        path: '/lgpd',
        name: 'lgpd',
        component: () => import('../views/LgpdView.vue'),
        meta: {
            title: 'LGPD e Proteção de Dados | Agenda Doutor',
            description: 'Conheça as práticas do Agenda Doutor para proteção de dados pessoais e conformidade com a LGPD.',
        },
    },
    {
        path: '/atualizacao',
        name: 'changelog',
        component: () => import('../views/ChangelogView.vue'),
        meta: {
            title: 'Novidades e Atualizações | Agenda Doutor',
            description: 'Acompanhe as novidades, melhorias e funcionalidades mais recentes da plataforma Agenda Doutor.',
        },
    },
    {
        path: '/questionario',
        name: 'survey',
        component: () => import('../views/SurveyView.vue'),
        meta: {
            title: 'Avaliação do Sistema | Agenda Doutor',
            description: 'Questionário de avaliação para usuários do Agenda Doutor.',
            robots: 'noindex, nofollow',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => null,
        meta: {
            title: 'Entrar | Agenda Doutor',
            description: 'Acesse sua conta no Agenda Doutor.',
            robots: 'noindex, nofollow',
        },
        beforeEnter() {
            return redirectToApp('/login')
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => null,
        meta: {
            title: 'Criar conta | Agenda Doutor',
            description: 'Crie sua conta no Agenda Doutor.',
            robots: 'noindex, nofollow',
        },
        beforeEnter() {
            return redirectToApp('/register')
        },
    },
    {
        path: '/app/:pathMatch(.*)*',
        name: 'legacy-app',
        component: () => null,
        meta: {
            title: 'Agenda Doutor',
            description: 'Acesse a plataforma Agenda Doutor.',
            robots: 'noindex, nofollow',
        },
        beforeEnter(to) {
            const pathMatch = to.params.pathMatch
            const pathString = Array.isArray(pathMatch) ? pathMatch.join('/') : (pathMatch || '')
            const path = pathString ? `/${pathString}` : ''
            return redirectToApp(path)
        },
    },
]

export function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
}
