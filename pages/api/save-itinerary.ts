import type { NextApiRequest, NextApiResponse } from 'next'
import { saveItinerary } from '../../lib/db'

type Data = {
  id: string
}

type ErrorResponse = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { city, days, month, itinerary } = JSON.parse(req.body)

  if (!city || !days || !month || !itinerary) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const id = saveItinerary(city, Number(days), month, itinerary)
  res.status(200).json({ id })
}
