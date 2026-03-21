import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
  pointsOfInterestPrompt: string
  itinerary: string
}

type ErrorResponse = {
  message: string
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

function toSafeString(input: unknown, fallback: string, maxLength: number): string {
  if (typeof input !== 'string') return fallback
  const value = input.trim()
  if (!value) return fallback
  return value.slice(0, maxLength)
}

function toSafeDays(input: unknown, fallback = 4): number {
  const parsed = Number(input)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.min(15, Math.round(parsed)))
}

function normalizeDayHeadings(markdown: string): string {
  const cleaned = markdown
    .replace(/^#{1,6}\s*Day\s*(\d+)\s*[:\-]/gim, 'Day $1:')
    .replace(/^Day\s*(\d+)\s*-\s*/gim, 'Day $1: ')
    .trim()

  if (/^Day\s+1:/im.test(cleaned)) {
    return cleaned
  }

  return `Day 1:\n${cleaned}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!GPT_KEY) {
    return res.status(500).json({ message: 'Server is missing GPT_API_KEY' })
  }

  let body: Record<string, unknown>
  try {
    body = parseBody(req)
  } catch {
    return res.status(400).json({ message: 'Invalid request body JSON' })
  }

  const cityInput = toSafeString(body.city, 'Mallorca', 80)
  const cityWords = cityInput.split(/\s+/).filter(Boolean)
  const city = cityWords.length <= 5 ? cityInput : 'Mallorca'

  const month = toSafeString(body.month, 'March', 30)
  const days = toSafeDays(body.days, 4)

  const monthLower = month.toLowerCase()
  const seasonWords = new Set(['winter', 'spring', 'summer', 'autumn', 'fall'])
  const whenPrompt = seasonWords.has(monthLower)
    ? `in ${month}`
    : `in the month of ${month}`

  const userPrompt = [
    `Create a practical, high-quality ${days}-day holiday itinerary ${whenPrompt} in ${city}.`,
    '',
    'Formatting requirements (strict):',
    '- Markdown-friendly output only.',
    '- Each day heading must start exactly with: Day X:',
    '- For each day include: Morning, Afternoon, Evening. Night is optional.',
    '',
    'Quality requirements:',
    '- Keep realistic pacing with 2-4 major activities per day.',
    '- Group nearby places together and include approximate drive/transit times when moving areas.',
    '- Add reservation notes for popular places and indicate when to book ahead.',
    '- Make recommendations season-aware for Mallorca weather and daylight.',
    '- Provide indoor backup alternatives for poor weather.',
    '- Include family-friendly choices and budget-conscious alternatives.',
    '- Include local food suggestions and practical travel/safety tips each day.',
    '- Prefer accurate, specific advice over generic wording.',
  ].join('\n')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GPT_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert Mallorca travel planner. Provide realistic, practical, and accurate day-by-day holiday guidance with logistics, seasonality, safety, and family-aware options.',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    })

    const raw = await response.text()
    let parsed: ChatCompletionResponse

    try {
      parsed = JSON.parse(raw) as ChatCompletionResponse
    } catch {
      return res.status(502).json({ message: 'Invalid response from itinerary model' })
    }

    if (!response.ok) {
      const upstreamMessage = parsed?.error?.message?.trim() || 'Upstream model request failed'
      return res.status(502).json({ message: upstreamMessage })
    }

    const itineraryText = parsed?.choices?.[0]?.message?.content
    if (typeof itineraryText !== 'string' || !itineraryText.trim()) {
      return res.status(502).json({ message: 'Malformed itinerary response' })
    }

    const normalizedItinerary = normalizeDayHeadings(itineraryText)

    return res.status(200).json({
      message: 'success',
      pointsOfInterestPrompt: normalizedItinerary,
      itinerary: normalizedItinerary,
    })
  } catch {
    return res.status(500).json({ message: 'Failed to generate itinerary' })
  }
}
