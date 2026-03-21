import type { Metadata } from 'next'
import ItineraryClientPage from './ItineraryClientPage'
import { getItineraryById } from '../../../lib/db'

const SITE_URL = 'https://www.whattodoinmallorca.com'
const SITE_NAME = 'What to Do in Mallorca'

function toPlainText(value: string): string {
  return value
    .replace(/\[[^\]]+\]\([^\)]+\)/g, ' ')
    .replace(/[`*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildDescription(itineraryText: string, city: string, days: number, month: string): string {
  const summary = toPlainText(itineraryText).slice(0, 150)
  if (!summary) {
    return `Explore a ${days}-day ${city} itinerary for ${month} with practical day-by-day plans, highlights, and local tips.`
  }
  return `${summary}. Plan your ${days}-day ${city} trip for ${month} with curated daily recommendations.`
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

  const title = `${itinerary.days}-Day ${itinerary.city} Itinerary for ${itinerary.month} | ${SITE_NAME}`
  const description = buildDescription(itinerary.itinerary, itinerary.city, itinerary.days, itinerary.month)
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

export default function ItineraryPage({ params }: { params: { id: string } }) {
  return <ItineraryClientPage params={params} />
}
