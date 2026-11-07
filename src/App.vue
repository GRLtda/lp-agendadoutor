<script setup>
import { computed } from 'vue'
import { productDescription, productQuestions } from './seo/product'
import { useHead } from '@unhead/vue'
import { RouterView, useRoute } from 'vue-router'

const SITE_URL = 'https://www.agendadoutor.com'
const SOCIAL_IMAGE_URL = `${SITE_URL}/logo_brand.png`
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
      description: productDescription,
      alternateName: 'AgendaDoutor',
      audience: { '@type': 'Audience', audienceType: 'Clínicas, consultórios e profissionais de saúde' },
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
  const robots = route.meta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  const isIndexable = !robots.includes('noindex')
  const canonicalUrl = new URL(route.path || '/', SITE_URL).href

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      ...organizationSchema['@graph'],
      {
        '@type': 'WebPage', '@id': canonicalUrl + '#webpage',
        url: canonicalUrl, name: title, description, inLanguage: 'pt-BR',
        isPartOf: { '@id': SITE_URL + '/#website' },
        about: { '@id': SITE_URL + '/#software' },
        publisher: { '@id': SITE_URL + '/#organization' },
      },
      ...(route.path === '/' ? [{
        '@type': 'FAQPage', '@id': SITE_URL + '/#faq',
        isPartOf: { '@id': SITE_URL + '/#webpage' },
        mainEntity: productQuestions.map(({ question, answer }) => ({
          '@type': 'Question', name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }] : []),
    ],
  }

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
      { property: 'og:image:secure_url', content: SOCIAL_IMAGE_URL },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '512' },
      { property: 'og:image:height', content: '512' },
      { property: 'og:image:alt', content: 'Logo do Agenda Doutor' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:url', content: canonicalUrl },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: SOCIAL_IMAGE_URL },
      { name: 'twitter:image:alt', content: 'Logo do Agenda Doutor' },
    ],
    link: isIndexable ? [{ rel: 'canonical', href: canonicalUrl }] : [],
    script: isIndexable
      ? [{ key: 'public-structured-data', type: 'application/ld+json', innerHTML: JSON.stringify(schema).replace(/</g, '\u003c') }]
      : [],
  }
})

useHead(head)
</script>

<template>
  <RouterView />
</template>
