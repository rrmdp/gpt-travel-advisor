import type { NextApiRequest, NextApiResponse } from 'next'
import { ItinerarySummary, listRecentItineraries } from '../../lib/db'

type ErrorResponse = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ItinerarySummary[] | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const itineraries = listRecentItineraries(30)
    return res.status(200).json(itineraries)
  } catch (error) {
    console.error('Unable to load itineraries:', error)
    return res.status(200).json([])
  }
}
