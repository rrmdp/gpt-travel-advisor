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
  if (!response.ok) return null

  const json = await response.json()
  const first = Array.isArray(json.items) && json.items.length > 0 ? json.items[0] : null
  if (!first || typeof first.link !== 'string') return null
  return first.link
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

    const images: ImageResult[] = []
    for (const day of limitedDays) {
      const query = normalizeQuery(day, city)
      const imageUrl = await fetchImageUrl(apiKey, cx, query)
      images.push({ query, url: imageUrl })
    }

    const withFallback = images.map((image) => ({
      query: image.query,
      url: image.url ?? fallbackImageUrl(image.query),
    }))

    res.status(200).json({ message: 'success', images: withFallback })
  } catch (error) {
    console.error('get-itinerary-images error:', error)
    res.status(500).json({ message: 'Unable to fetch itinerary images' })
  }
}
