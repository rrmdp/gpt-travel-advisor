import type { NextApiRequest, NextApiResponse } from 'next'
import { enforceRateLimit } from '../../lib/rate-limit'

type Data = {
  pointsOfInterest: string
}

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

const GPT_KEY = process.env.GPT_API_KEY
const EMPTY_POINTS = JSON.stringify([])

function parseBody(req: NextApiRequest): Record<string, unknown> {
  if (!req.body) return {}

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>
    } catch {
      throw new Error('Invalid JSON body')
    }
  }

  if (typeof req.body === 'object') {
    return req.body as Record<string, unknown>
  }

  return {}
}

function normalizeName(name: string): string {
  return name
    .replace(/^[\s\-*•\d.)(:]+/, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[.,;:\s]+$/, '')
    .trim()
}

function extractJsonArray(text: string): unknown[] | null {
  try {
    const direct = JSON.parse(text)
    if (Array.isArray(direct)) return direct
  } catch {
    // Continue with fallback.
  }

  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return null

  try {
    const parsed = JSON.parse(match[0])
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function fallbackExtractFromPrompt(prompt: string): string[] {
  const candidates = new Set<string>()
  const lines = prompt.split('\n')

  for (const line of lines) {
    const cleanedLine = line.replace(/^#{1,6}\s*/, '').trim()
    if (!cleanedLine) continue

    const commaParts = cleanedLine.split(',')
    for (const part of commaParts) {
      const piece = normalizeName(part)
      if (piece.length < 3) continue
      candidates.add(piece)
    }
  }

  return Array.from(candidates)
}

function toUniqueCleanStrings(values: unknown[]): string[] {
  const map = new Map<string, string>()

  for (const value of values) {
    if (typeof value !== 'string') continue

    const cleaned = normalizeName(value)
    if (!cleaned) continue

    const key = cleaned.toLowerCase()
    if (!map.has(key)) {
      map.set(key, cleaned)
    }
  }

  return Array.from(map.values())
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ pointsOfInterest: EMPTY_POINTS })
  }

  if (!GPT_KEY) {
    return res.status(500).json({ pointsOfInterest: EMPTY_POINTS })
  }

  try {
    const limit = await enforceRateLimit(req, {
      bucket: 'get-points-of-interest',
      maxRequests: 20,
      windowMs: 60 * 60 * 1000,
    })

    res.setHeader('X-RateLimit-Limit', String(limit.limit))
    res.setHeader('X-RateLimit-Remaining', String(limit.remaining))

    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSeconds))
      return res.status(429).json({ pointsOfInterest: EMPTY_POINTS })
    }
  } catch {
    // Fail open to avoid blocking valid users when DB is temporarily unavailable.
  }

  let body: Record<string, unknown>
  try {
    body = parseBody(req)
  } catch {
    return res.status(400).json({ pointsOfInterest: EMPTY_POINTS })
  }

  const pointsOfInterestPrompt =
    typeof body.pointsOfInterestPrompt === 'string' ? body.pointsOfInterestPrompt.trim() : ''

  if (!pointsOfInterestPrompt) {
    return res.status(200).json({ pointsOfInterest: EMPTY_POINTS })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GPT_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'Extract only place names from the provided Mallorca itinerary text. Return only a strict JSON array of strings. No prose, no markdown, no object keys.',
          },
          {
            role: 'user',
            content: pointsOfInterestPrompt,
          },
        ],
      }),
    })

    const raw = await response.text()
    let parsed: ChatCompletionResponse

    try {
      parsed = JSON.parse(raw) as ChatCompletionResponse
    } catch {
      return res.status(200).json({ pointsOfInterest: EMPTY_POINTS })
    }

    if (!response.ok) {
      return res.status(502).json({ pointsOfInterest: EMPTY_POINTS })
    }

    const content = parsed?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(200).json({ pointsOfInterest: EMPTY_POINTS })
    }

    const parsedArray = extractJsonArray(content)
    const fromModel = parsedArray ? toUniqueCleanStrings(parsedArray) : []

    const finalPoints =
      fromModel.length > 0
        ? fromModel
        : toUniqueCleanStrings(fallbackExtractFromPrompt(pointsOfInterestPrompt))

    return res.status(200).json({
      pointsOfInterest: JSON.stringify(finalPoints),
    })
  } catch {
    return res.status(500).json({ pointsOfInterest: EMPTY_POINTS })
  }
}
