import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdminAuth } from '../../../../lib/admin-auth'
import { deleteStoredItinerary } from '../../../../lib/db'

type ErrorResponse = {
  message: string
}

type SuccessResponse = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  if (!requireAdminAuth(req, res)) {
    return
  }

  const { id } = req.query
  if (typeof id !== 'string' || !id.trim()) {
    res.status(400).json({ message: 'Invalid itinerary id' })
    return
  }

  try {
    const deleted = await deleteStoredItinerary(id)
    if (!deleted) {
      res.status(404).json({ message: 'Itinerary not found' })
      return
    }

    res.status(200).json({ message: 'Itinerary deleted' })
  } catch (error) {
    console.error('Unable to delete itinerary:', error)
    res.status(500).json({ message: 'Unable to delete itinerary' })
  }
}