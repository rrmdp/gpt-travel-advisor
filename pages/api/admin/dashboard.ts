import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdminAuth } from '../../../lib/admin-auth'
import {
  ApiErrorLog,
  PdfDownloadLead,
  StoredItinerary,
  listRecentApiErrors,
  listRecentPdfDownloadLeads,
  listRecentStoredItineraries,
} from '../../../lib/db'

type DashboardResponse = {
  errors: ApiErrorLog[]
  itineraries: StoredItinerary[]
  leads: PdfDownloadLead[]
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

  const rawLeadsLimit = Number(req.query.leadsLimit)
  const leadsLimit = Number.isFinite(rawLeadsLimit)
    ? Math.max(1, Math.min(1000, Math.round(rawLeadsLimit)))
    : 200

  try {
    const [errors, itineraries, leads] = await Promise.all([
      listRecentApiErrors(errorsLimit),
      listRecentStoredItineraries(itinerariesLimit),
      listRecentPdfDownloadLeads(leadsLimit),
    ])

    res.status(200).json({ errors, itineraries, leads })
  } catch (error) {
    console.error('Unable to load admin dashboard data:', error)
    res.status(500).json({ message: 'Unable to load admin dashboard data' })
  }
}