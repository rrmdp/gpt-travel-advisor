import type { NextApiRequest, NextApiResponse } from 'next'
import { logApiError } from '../../lib/db'

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
const ENDPOINT_NAME = '/api/get-itinerary-images'

function truncateText(value: string, max = 1500) {
  return value.length > max ? `${value.slice(0, max)}...` : value
}

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
    await logApiError(
      ENDPOINT_NAME,
      500,
      'Missing Google API key. Set GOOGLE_API_KEY or GS_KEY.',
      JSON.stringify({ hasGoogleApiKey: Boolean(process.env.GOOGLE_API_KEY), hasGsKey: Boolean(process.env.GS_KEY) })
    ).catch(() => undefined)
    res.status(500).json({ message: 'Missing Google API key. Set GOOGLE_API_KEY or GS_KEY.' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const days: string[] = Array.isArray(body?.days) ? body.days : []
    const city = typeof body?.city === 'string' && body.city.trim() ? body.city.trim() : 'Mallorca'
    const limitedDays = days.slice(0, 8)

    if (limitedDays.length === 0) {
      await logApiError(
        ENDPOINT_NAME,
        400,
        'No day entries provided for image lookup',
        JSON.stringify({ city, daysCount: days.length })
      ).catch(() => undefined)
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
        const message = error instanceof Error ? error.message : 'Unknown Google CSE error'
        await logApiError(
          ENDPOINT_NAME,
          502,
          truncateText(message),
          JSON.stringify({ query, city, cx })
        ).catch(() => undefined)
        if (!firstGoogleError) {
          firstGoogleError = message
        }
      }

      images.push({ query, url: imageUrl })
    }

    if (firstGoogleError) {
      await logApiError(
        ENDPOINT_NAME,
        502,
        truncateText(`Google image lookup failed: ${firstGoogleError}`),
        JSON.stringify({ city, daysCount: limitedDays.length, cx })
      ).catch(() => undefined)
      res.status(502).json({ message: `Google image lookup failed: ${firstGoogleError}` })
      return
    }

    if (!images.some((image) => image.url)) {
      await logApiError(
        ENDPOINT_NAME,
        502,
        'Google image lookup returned no results',
        JSON.stringify({ city, daysCount: limitedDays.length, cx })
      ).catch(() => undefined)
      res.status(502).json({
        message:
          'Google image lookup returned no results. Verify GOOGLE_CSE_CX points to a valid Programmable Search Engine with Image Search enabled and that your API key has Custom Search API access.',
      })
      return
    }

    res.status(200).json({ message: 'success', images })
  } catch (error) {
    console.error('get-itinerary-images error:', error)
    const message = error instanceof Error ? error.message : 'Unable to fetch itinerary images'
    await logApiError(
      ENDPOINT_NAME,
      500,
      truncateText(message),
      JSON.stringify({ hasBody: Boolean(req.body), cx })
    ).catch(() => undefined)
    res.status(500).json({ message: 'Unable to fetch itinerary images' })
  }
}
