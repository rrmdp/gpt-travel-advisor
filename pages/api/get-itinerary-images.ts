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

type PreflightResult =
  | { ok: true }
  | { ok: false; message: string; statusCode: number }

async function validateImageCandidate(candidateUrl: string): Promise<boolean> {
  const requestHeaders = {
    Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (compatible; GPTTravelAdvisorImageBot/1.0)',
  }

  for (const method of ['HEAD', 'GET'] as const) {
    try {
      const response = await fetch(candidateUrl, {
        method,
        headers: requestHeaders,
        redirect: 'follow',
      })

      const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
      if (response.ok && contentType.startsWith('image/')) {
        if (method === 'GET') {
          await response.body?.cancel().catch(() => undefined)
        }
        return true
      }

      if (method === 'GET') {
        await response.body?.cancel().catch(() => undefined)
      }
    } catch {
      // Try the fallback method before giving up on this candidate.
    }
  }

  return false
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
    response = await fetch(url)
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

  let fallbackCandidate: string | null = null

  for (const item of rankedItems) {
    const candidate = item.link
    if (typeof candidate !== 'string' || !/^https?:\/\//i.test(candidate) || isBlockedImageHost(candidate)) {
      continue
    }

    if (!fallbackCandidate && hasImageLikeExtension(candidate)) {
      fallbackCandidate = candidate
    }

    if (await validateImageCandidate(candidate)) {
      return { url: candidate }
    }
  }

  if (fallbackCandidate) {
    return { url: fallbackCandidate }
  }

  return { url: null }
}

async function preflightGoogleAccess(apiKey: string, cx: string): Promise<PreflightResult> {
  const probeQuery = 'Mallorca travel'
  const result = await fetchImageUrl(apiKey, cx, probeQuery)

  if (!result.error) {
    return { ok: true }
  }

  const lower = result.error.toLowerCase()
  if (result.fatal && lower.includes('ip address restriction')) {
    return {
      ok: false,
      statusCode: 403,
      message:
        'Google image API key is blocked by IP restriction. This app runs on changing serverless egress IPs, so either remove IP restriction from this key or use static egress and allowlist those IPs. Keep API restriction to Custom Search API.',
    }
  }

  if (result.fatal) {
    return {
      ok: false,
      statusCode: 403,
      message: `Google image API configuration error: ${result.error}`,
    }
  }

  return { ok: true }
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

    const preflight = await preflightGoogleAccess(apiKey, cx)
    if (!preflight.ok) {
      await logApiError(
        ENDPOINT_NAME,
        preflight.statusCode,
        truncateText(preflight.message),
        JSON.stringify({ city, daysCount: limitedDays.length, cx })
      ).catch(() => undefined)
      res.status(502).json({ message: preflight.message })
      return
    }

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
    let fatalError = ''

    for (const day of limitedDays) {
      const query = normalizeQuery(day, city)
      const result = await fetchImageUrl(apiKey, cx, query)

      if (result.error) {
        await logApiError(
          ENDPOINT_NAME,
          result.fatal ? 403 : 502,
          truncateText(result.error),
          JSON.stringify({ query, city, cx, fatal: result.fatal })
        ).catch(() => undefined)

        // A fatal error (bad key, API not enabled) will affect every day — bail early
        if (result.fatal && !fatalError) {
          fatalError = result.error
        }
      }

      images.push({ query, url: result.url })
    }

    // Only hard-fail if there was a credential/config level error
    if (fatalError) {
      await logApiError(
        ENDPOINT_NAME,
        403,
        truncateText(`Fatal Google CSE error: ${fatalError}`),
        JSON.stringify({ city, daysCount: limitedDays.length, cx })
      ).catch(() => undefined)
      res.status(502).json({ message: `Google image API configuration error: ${fatalError}` })
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
