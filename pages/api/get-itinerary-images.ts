import type { NextApiRequest, NextApiResponse } from 'next'

type ImageResult = {
  query: string
  url: string | null
}

type Success = {
  message: string
  images: ImageResult[]
}

type ErrorResponse = {
  message: string
}

type GoogleSearchResponse = {
  items?: Array<{
    link?: string
    image?: {
      thumbnailLink?: string
    }
  }>
  error?: {
    code?: number
    message?: string
    errors?: Array<{
      reason?: string
      message?: string
    }>
  }
}

const GOOGLE_CSE_URL = 'https://www.googleapis.com/customsearch/v1'
const DEFAULT_CX = 'b2fe726dc3f3d4348'

function normalizeQuery(dayText: string, city: string) {
  const clean = dayText
    .replace(/\[[^\]]+\]\([^\)]+\)/g, ' ')
    .replace(/[#*_`>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const firstChunk = clean.split(/[.!?\n]/).find((part) => part.trim().length > 0) ?? clean
  const trimmed = firstChunk.replace(/^\d+\s*[:.-]?\s*/, '').trim()
  const short = trimmed.slice(0, 90)

  if (!short) return `${city} travel`
  return `${short} ${city}`.trim()
}

async function fetchImageUrl(apiKey: string, cx: string, query: string) {
  const url = `${GOOGLE_CSE_URL}?q=${encodeURIComponent(query)}&key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&searchType=image&num=1&safe=active`
  const response = await fetch(url)
  const json = (await response.json().catch(() => ({}))) as GoogleSearchResponse

  if (!response.ok) {
    const reason = json?.error?.errors?.[0]?.reason
    const message =
      json?.error?.message ||
      json?.error?.errors?.[0]?.message ||
      `Google CSE request failed with status ${response.status}`
    throw new Error(reason ? `${reason}: ${message}` : message)
  }

  const first = Array.isArray(json.items) && json.items.length > 0 ? json.items[0] : null
  if (!first) return null

  const thumbnail = first.image?.thumbnailLink
  if (typeof thumbnail === 'string' && /^https?:\/\//i.test(thumbnail)) {
    return thumbnail
  }

  if (typeof first.link === 'string' && /^https?:\/\//i.test(first.link)) {
    return first.link
  }

  return null
}

function fallbackImageUrl(query: string) {
  // No-key fallback so day cards still get images when Google CSE is unavailable.
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Success | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GS_KEY
  const cx = process.env.GOOGLE_CSE_CX || DEFAULT_CX

  if (!apiKey) {
    res.status(500).json({ message: 'Missing Google API key. Set GOOGLE_API_KEY or GS_KEY.' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const days: string[] = Array.isArray(body?.days) ? body.days : []
    const city = typeof body?.city === 'string' && body.city.trim() ? body.city.trim() : 'Mallorca'
    const limitedDays = days.slice(0, 8)

    if (limitedDays.length === 0) {
      res.status(400).json({ message: 'No day entries provided for image lookup' })
      return
    }

    const images: ImageResult[] = []
    let firstGoogleError = ''
    for (const day of limitedDays) {
      const query = normalizeQuery(day, city)
      let imageUrl: string | null = null

      try {
        imageUrl = await fetchImageUrl(apiKey, cx, query)
      } catch (error) {
        if (!firstGoogleError) {
          firstGoogleError = error instanceof Error ? error.message : 'Unknown Google CSE error'
        }
      }

      images.push({ query, url: imageUrl })
    }

    const withFallback = images.map((image) => ({
      query: image.query,
      url: image.url ?? fallbackImageUrl(image.query),
    }))

    if (!withFallback.some((image) => image.url) && firstGoogleError) {
      res.status(502).json({ message: `Google image lookup failed: ${firstGoogleError}` })
      return
    }

    res.status(200).json({ message: 'success', images: withFallback })
  } catch (error) {
    console.error('get-itinerary-images error:', error)
    res.status(500).json({ message: 'Unable to fetch itinerary images' })
  }
}
