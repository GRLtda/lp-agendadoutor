<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { RouterView, useRoute } from 'vue-router'

const SITE_URL = 'https://www.agendadoutor.com'
const SOCIAL_IMAGE_URL = `${SITE_URL}/og-image.png`
const route = useRoute()

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Agenda Doutor',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo_brand.png`,
      sameAs: ['https://instagram.com/agendadoutor'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+55-11-92192-3978',
        contactType: 'customer support',
        availableLanguage: 'Portuguese',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Agenda Doutor',
      alternateName: 'AgendaDoutor',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'pt-BR',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'Agenda Doutor',
      url: `${SITE_URL}/`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'pt-BR',
      description: 'Sistema de gestão para clínicas e consultórios com agenda, prontuário eletrônico, financeiro e confirmações pelo WhatsApp.',
      provider: { '@id': `${SITE_URL}/#organization` },
      featureList: [
        'Agenda médica online',
        'Prontuário eletrônico',
        'Gestão financeira',
        'Confirmação de consultas pelo WhatsApp',
        'Anamnese online',
      ],
    },
  ],
}

const head = computed(() => {
  const title = route.meta.title || 'Agenda Doutor'
  const description = route.meta.description || 'Sistema de gestão para clínicas e consultórios.'
  const robots = route.meta.robots || 'index, follow'
  const isIndexable = !robots.includes('noindex')
  const canonicalUrl = new URL(route.path || '/', SITE_URL).href

  return {
    htmlAttrs: { lang: 'pt-BR' },
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'og:site_name', content: 'Agenda Doutor' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: SOCIAL_IMAGE_URL },
      { property: 'og:image:width', content: '1913' },
      { property: 'og:image:height', content: '832' },
      { property: 'og:image:alt', content: 'Agenda Doutor — sistema para clínicas e consultórios' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: canonicalUrl },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: SOCIAL_IMAGE_URL },
      { name: 'twitter:image:alt', content: 'Agenda Doutor — sistema para clínicas e consultórios' },
    ],
    link: isIndexable ? [{ rel: 'canonical', href: canonicalUrl }] : [],
    script: route.path === '/'
      ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(organizationSchema) }]
      : [],
  }
})

useHead(head)
</script>

<template>
  <RouterView />
</template>
