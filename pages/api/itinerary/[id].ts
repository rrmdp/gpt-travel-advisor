import type { NextApiRequest, NextApiResponse } from 'next'
import { getItineraryById, Itinerary } from '../../../lib/db'

type ErrorResponse = {
  message: string
}

export default function handler(
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

  const itinerary = getItineraryById(id)
  if (!itinerary) {
    return res.status(404).json({ message: 'Itinerary not found' })
  }

  res.status(200).json(itinerary)
}
