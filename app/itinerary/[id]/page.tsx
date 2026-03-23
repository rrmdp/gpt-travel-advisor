import type { Metadata } from 'next'
import ItineraryClientPage from './ItineraryClientPage'
import { getItineraryById, Itinerary } from '../../../lib/db'

const SITE_URL = 'https://www.whattodoinmallorca.com'
const SITE_NAME = 'What to Do in Mallorca'

function toPlainText(value: string): string {
  return value
    .replace(/\[[^\]]+\]\([^\)]+\)/g, ' ')
    .replace(/[`*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildDescription(itineraryText: string, city: string, days: number, month: string, travelStyle?: string, interests?: string): string {
  const summary = toPlainText(itineraryText).slice(0, 120)
  const styleText = travelStyle ? ` for ${travelStyle.toLowerCase()}` : ''
  const interestsText = interests ? ` with ${interests.toLowerCase()}` : ''
  if (!summary) {
    return `Explore a ${days}-day ${city} itinerary for ${month}${styleText}${interestsText}. Practical day-by-day plans, highlights, and local tips.`
  }
  return `${summary}. ${days}-day ${city} trip${styleText}${interestsText} for ${month} with curated recommendations.`
}

function buildJsonLd(itinerary: Itinerary) {
  const canonicalUrl = `${SITE_URL}/itinerary/${itinerary.id}`
  const description = buildDescription(itinerary.itinerary, itinerary.city, itinerary.days, itinerary.month, itinerary.travel_style, itinerary.interests)

  // Split the itinerary into per-day chunks and build itinerary steps
  const dayChunks = itinerary.itinerary.split(/(?=^Day\s+\d+)/im).filter(Boolean)
  const itineraryItems = dayChunks.map((chunk, index) => {
    const lines = chunk.split('\n').filter(Boolean)
    const header = lines[0] ?? `Day ${index + 1}`
    const body = toPlainText(lines.slice(1).join(' ')).slice(0, 250)
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: toPlainText(header),
      description: body || undefined,
    }
  })

  const headlineStylePart = itinerary.travel_style ? ` – ${itinerary.travel_style}` : ''

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${itinerary.days}-Day ${itinerary.city} Itinerary for ${itinerary.month}${headlineStylePart}`,
    description,
    url: canonicalUrl,
    datePublished: itinerary.created_at,
    dateModified: itinerary.created_at,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'TouristDestination',
      name: itinerary.city,
    },
    hasPart: itineraryItems.length > 0
      ? {
          '@type': 'ItemList',
          name: `${itinerary.days}-Day itinerary`,
          numberOfItems: itineraryItems.length,
          itemListElement: itineraryItems,
        }
      : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const itinerary = await getItineraryById(params.id).catch(() => null)

  if (!itinerary) {
    return {
      title: `Itinerary Not Found | ${SITE_NAME}`,
      description:
        'This itinerary could not be found. Browse Mallorca itinerary ideas and generate a personalized trip plan.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const styleInTitle = itinerary.travel_style ? ` (${itinerary.travel_style})` : ''
  const title = `${itinerary.days}-Day ${itinerary.city} Itinerary for ${itinerary.month}${styleInTitle} | ${SITE_NAME}`
  const description = buildDescription(itinerary.itinerary, itinerary.city, itinerary.days, itinerary.month, itinerary.travel_style, itinerary.interests)
  const canonicalUrl = `${SITE_URL}/itinerary/${itinerary.id}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ItineraryPage({ params }: { params: { id: string } }) {
  const itinerary = await getItineraryById(params.id).catch(() => null)
  const jsonLd = itinerary ? buildJsonLd(itinerary) : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ItineraryClientPage params={params} />
    </>
  )
}
