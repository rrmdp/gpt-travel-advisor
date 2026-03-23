import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

const siteUrl = 'https://www.whattodoinmallorca.com'
const pageTitle = 'What to Do in Mallorca: Things to Do in Mallorca, AI Trip Planner and Itineraries'
const pageDescription = 'Discover what to do in Mallorca with personalized ideas for the best things to do in Mallorca, including beaches, day trips, hiking routes, food spots, and practical holiday planning by month.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'things to do in Mallorca',
    'Mallorca itinerary planner',
    'Mallorca holiday planner',
    'Mallorca day trips',
    'best places to visit in Mallorca',
    'Mallorca family holiday ideas',
    'Majorca itinerary',
    'Mallorca beaches and villages',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: siteUrl,
    type: 'website',
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: 'summary_large_image',
  },
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: pageTitle,
  description: pageDescription,
  url: siteUrl,
  inLanguage: 'en',
  about: {
    '@type': 'Place',
    name: 'Mallorca',
  },
  mainEntity: {
    '@type': 'TouristDestination',
    name: 'Mallorca',
    description: 'Mediterranean island destination known for beaches, mountain villages, scenic drives, local food, family holidays, and outdoor activities.',
    touristType: ['Families', 'Couples', 'Adventure travelers', 'Food lovers', 'Beach holiday makers'],
  },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Popular Mallorca trip ideas',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '4-day Mallorca itinerary for first-time visitors' },
    { '@type': 'ListItem', position: 2, name: 'Family-friendly things to do in Mallorca' },
    { '@type': 'ListItem', position: 3, name: 'Best beaches and calas in Majorca' },
    { '@type': 'ListItem', position: 4, name: 'Scenic day trips to Soller, Valldemossa, and Deia' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the best things to do in Mallorca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Popular choices include Palma Cathedral, old town tapas routes, beaches around Alcudia and Cala d Or, mountain drives in Serra de Tramuntana, and boat excursions along the coast.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many days should I spend in Mallorca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Four to seven days gives enough time to combine city highlights, beaches, and at least one mountain-village day trip.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Mallorca good for families?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Mallorca offers calm beaches, walkable towns, short transfers, and many villa and apartment options for family stays.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where should I stay in Mallorca for a beach holiday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alcudia, Playa de Muro, Cala d Or, Palmanova, and Santa Ponsa are popular for easy beach access, plenty of restaurants, and a wide choice of hotels and apartments.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the best time to visit Mallorca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'May, June, September, and early October are ideal for many holiday makers because the weather is warm, the sea is pleasant, and the island is usually less intense than peak summer.',
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <HomePageClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
