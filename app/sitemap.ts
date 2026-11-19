import { listAllItinerarySummaries } from '../lib/db'
import { buildItineraryPath } from '../lib/itinerary-url'
import { generateStaticParams as generateArticleParams } from './articles/[slug]/page'

const SITE_URL = 'https://www.whattodoinmallorca.com'

export default async function sitemap() {
  const itineraries = await listAllItinerarySummaries().catch(() => [])

  const articleEntries = generateArticleParams().map(({ slug }) => ({
    url: `${SITE_URL}/articles/${slug}`,
  }))

  const itineraryEntries = itineraries.map((it) => ({
    url: `${SITE_URL}${buildItineraryPath(it)}`,
    lastModified: new Date(it.created_at),
    changeFrequency: 'never' as const,
    priority: 0.7,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...articleEntries,
    ...itineraryEntries,
  ]
}
