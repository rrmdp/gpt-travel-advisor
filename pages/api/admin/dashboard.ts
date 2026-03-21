import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdminAuth } from '../../../lib/admin-auth'
import { ApiErrorLog, StoredItinerary, listRecentApiErrors, listRecentStoredItineraries } from '../../../lib/db'

type DashboardResponse = {
  errors: ApiErrorLog[]
  itineraries: StoredItinerary[]
}

type ErrorResponse = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  if (!requireAdminAuth(req, res)) {
    return
  }

  const rawErrorsLimit = Number(req.query.errorsLimit)
  const errorsLimit = Number.isFinite(rawErrorsLimit)
    ? Math.max(1, Math.min(200, Math.round(rawErrorsLimit)))
    : 50

  const rawItinerariesLimit = Number(req.query.itinerariesLimit)
  const itinerariesLimit = Number.isFinite(rawItinerariesLimit)
    ? Math.max(1, Math.min(500, Math.round(rawItinerariesLimit)))
    : 100

  try {
    const [errors, itineraries] = await Promise.all([
      listRecentApiErrors(errorsLimit),
      listRecentStoredItineraries(itinerariesLimit),
    ])

    res.status(200).json({ errors, itineraries })
  } catch (error) {
    console.error('Unable to load admin dashboard data:', error)
    res.status(500).json({ message: 'Unable to load admin dashboard data' })
  }
}