import type { NextApiRequest, NextApiResponse } from 'next'
import { StoredItinerary, listRecentStoredItineraries } from '../../lib/db'

type ErrorResponse = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoredItinerary[] | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const itineraries = await listRecentStoredItineraries(30)
    return res.status(200).json(itineraries)
  } catch (error) {
    console.error('Unable to load itineraries:', error)
    return res.status(200).json([])
  }
}
