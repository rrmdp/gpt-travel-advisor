import { listAllItinerarySummaries } from '../lib/db'

const SITE_URL = 'https://www.whattodoinmallorca.com'

export default async function sitemap() {
  const itineraries = await listAllItinerarySummaries().catch(() => [])

  const itineraryEntries = itineraries.map((it) => ({
    url: `${SITE_URL}/itinerary/${it.id}`,
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
    ...itineraryEntries,
  ]
}
