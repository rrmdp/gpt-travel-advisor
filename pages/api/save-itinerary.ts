import type { NextApiRequest, NextApiResponse } from 'next'
import { saveItinerary } from '../../lib/db'

type Data = {
  id: string
}

type ErrorResponse = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const { city, days, month, itinerary } = body

  if (!city || !days || !month || !itinerary) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const id = await saveItinerary(city, Number(days), month, itinerary)
    return res.status(200).json({ id })
  } catch (error) {
    console.error('Unable to save itinerary:', error)
    return res.status(500).json({ message: 'Unable to save itinerary' })
  }
}
