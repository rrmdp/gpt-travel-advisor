import type { NextApiRequest, NextApiResponse } from 'next'
import { getItineraryById, Itinerary } from '../../../lib/db'

type ErrorResponse = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Itinerary | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid id' })
  }

  try {
    const itinerary = await getItineraryById(id)
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' })
    }
    return res.status(200).json(itinerary)
  } catch (error) {
    console.error('Unable to fetch itinerary:', error)
    return res.status(500).json({ message: 'Unable to fetch itinerary' })
  }
}
