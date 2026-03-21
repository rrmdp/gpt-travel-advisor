import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedImageUrls, logApiError, upsertCachedImageUrls } from '../../lib/db'

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

type GoogleImageMetadata = {
  width?: number
  height?: number
  thumbnailLink?: string
}

type GoogleSearchResponse = {
  items?: Array<{
    link?: string
    image?: GoogleImageMetadata
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
const BLOCKED_IMAGE_HOSTS = new Set(['unsplash.com', 'images.unsplash.com', 'source.unsplash.com'])
const MIN_IMAGE_WIDTH = 1200
const MIN_IMAGE_HEIGHT = 800
const GOOGLE_FETCH_TIMEOUT_MS = 4500
const IMAGE_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7
const EMPTY_IMAGE_CACHE_TTL_SECONDS = 60 * 60 * 12

// Google CSE error reasons that indicate a permanent configuration/credential failure,
// as opposed to per-query issues (no results, safe-search filtered, etc.)
const FATAL_GOOGLE_REASONS = new Set([
  'keyInvalid',
  'accessNotConfigured',
  'forbidden',
  'badRequest',
  'invalidArgument',
])

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

function isBlockedImageHost(candidateUrl: string) {
  try {
    const host = new URL(candidateUrl).hostname.toLowerCase()
    if (BLOCKED_IMAGE_HOSTS.has(host)) return true
    for (const blockedHost of Array.from(BLOCKED_IMAGE_HOSTS)) {
      if (host.endsWith(`.${blockedHost}`)) return true
    }
    return false
  } catch {
    return true
  }
}

type FetchResult =
  | { url: string | null; error?: undefined }
  | { url: null; error: string; fatal: boolean }

function isErrorFetchResult(result: FetchResult): result is Extract<FetchResult, { error: string }> {
  return typeof (result as { error?: unknown }).error === 'string'
}

function isHighQualityImageResult(image?: GoogleImageMetadata) {
  const width = typeof image?.width === 'number' ? image.width : 0
  const height = typeof image?.height === 'number' ? image.height : 0
  return width >= MIN_IMAGE_WIDTH && height >= MIN_IMAGE_HEIGHT
}

function hasKnownImageDimensions(image?: GoogleImageMetadata) {
  return typeof image?.width === 'number' && typeof image?.height === 'number'
}

function hasImageLikeExtension(candidateUrl: string) {
  try {
    const pathname = new URL(candidateUrl).pathname.toLowerCase()
    return /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(pathname)
  } catch {
    return false
  }
}

async function fetchImageUrl(apiKey: string, cx: string, query: string): Promise<FetchResult> {
  let response: Response
  try {
    const url = `${GOOGLE_CSE_URL}?q=${encodeURIComponent(query)}&key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&searchType=image&num=10&safe=active`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), GOOGLE_FETCH_TIMEOUT_MS)
    try {
      response = await fetch(url, { signal: controller.signal })
    } finally {
      clearTimeout(timeout)
    }
  } catch (networkError) {
    const msg = networkError instanceof Error ? networkError.message : 'Network error reaching Google CSE'
    return { url: null, error: msg, fatal: false }
  }

  const json = (await response.json().catch(() => ({}))) as GoogleSearchResponse

  if (!response.ok) {
    const reason = json?.error?.errors?.[0]?.reason ?? ''
    const message =
      json?.error?.message ||
      json?.error?.errors?.[0]?.message ||
      `Google CSE request failed with HTTP ${response.status}`
    const isFatal = FATAL_GOOGLE_REASONS.has(reason) || response.status === 400 || response.status === 403
    return { url: null, error: reason ? `${reason}: ${message}` : message, fatal: isFatal }
  }

  const items = Array.isArray(json.items) ? json.items : []
  const rankedItems = [
    ...items.filter((item) => isHighQualityImageResult(item.image)),
    ...items.filter((item) => !isHighQualityImageResult(item.image) && !hasKnownImageDimensions(item.image)),
  ]

  const candidatePool = rankedItems
    .map((item) => item.link)
    .filter((candidate): candidate is string => (
      typeof candidate === 'string' && /^https?:\/\//i.test(candidate) && !isBlockedImageHost(candidate)
    ))

  for (const candidate of candidatePool) {
    if (hasImageLikeExtension(candidate)) {
      return { url: candidate }
    }
  }

  if (candidatePool.length > 0) {
    return { url: candidatePool[0] }
  }

  return { url: null }
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

    const queries = limitedDays.map((day) => normalizeQuery(day, city))

    let cachedByQuery = new Map<string, string | null>()
    try {
      cachedByQuery = await getCachedImageUrls(queries)
    } catch {
      // Fail open if cache storage is temporarily unavailable.
    }

    const missingQueries = queries.filter((query) => !cachedByQuery.has(query))

    const fetchedByQuery = new Map<string, FetchResult>()
    if (missingQueries.length > 0) {
      const fetchedResults = await Promise.all(missingQueries.map((query) => fetchImageUrl(apiKey, cx, query)))
      for (let index = 0; index < missingQueries.length; index += 1) {
        fetchedByQuery.set(missingQueries[index], fetchedResults[index])
      }

      const cacheableWithUrl: Array<{ query: string; url: string | null }> = []
      const cacheableEmpty: Array<{ query: string; url: string | null }> = []

      for (let index = 0; index < missingQueries.length; index += 1) {
        const query = missingQueries[index]
        const result = fetchedResults[index]
        if (isErrorFetchResult(result)) continue

        if (result.url) {
          cacheableWithUrl.push({ query, url: result.url })
        } else {
          cacheableEmpty.push({ query, url: null })
        }
      }

      try {
        await Promise.all([
          upsertCachedImageUrls(cacheableWithUrl, IMAGE_CACHE_TTL_SECONDS),
          upsertCachedImageUrls(cacheableEmpty, EMPTY_IMAGE_CACHE_TTL_SECONDS),
        ])
      } catch {
        // Fail open if cache write fails.
      }
    }

    const results: FetchResult[] = queries.map((query) => {
      if (cachedByQuery.has(query)) {
        return { url: cachedByQuery.get(query) ?? null }
      }

      return fetchedByQuery.get(query) ?? { url: null }
    })

    const images: ImageResult[] = results.map((result, index) => ({
      query: queries[index],
      url: result.url,
    }))

    const logTasks: Array<Promise<void>> = []
    let fatalResult: Extract<FetchResult, { error: string }> | null = null

    for (let index = 0; index < results.length; index += 1) {
      const result = results[index]
      if (!isErrorFetchResult(result)) continue

      if (result.fatal && !fatalResult) {
        fatalResult = result
      }

      logTasks.push(
        logApiError(
          ENDPOINT_NAME,
          result.fatal ? 403 : 502,
          truncateText(result.error),
          JSON.stringify({ query: queries[index], city, cx, fatal: result.fatal })
        ).catch(() => undefined)
      )
    }

    await Promise.all(logTasks)

    // Only hard-fail if there was a credential/config level error
    if (fatalResult?.error) {
      await logApiError(
        ENDPOINT_NAME,
        403,
        truncateText(`Fatal Google CSE error: ${fatalResult.error}`),
        JSON.stringify({ city, daysCount: limitedDays.length, cx })
      ).catch(() => undefined)
      res.status(502).json({ message: `Google image API configuration error: ${fatalResult.error}` })
      return
    }

    // Return whatever we got — some urls may be null (no Google result for that day)
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
