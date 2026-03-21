import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiErrorLog, listRecentApiErrors } from '../../lib/db'
import { requireAdminAuth } from '../../lib/admin-auth'

type ErrorResponse = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiErrorLog[] | ErrorResponse>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  if (!requireAdminAuth(req, res)) {
    return
  }

  const rawLimit = Number(req.query.limit)
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(200, Math.round(rawLimit)))
    : 50

  try {
    const logs = await listRecentApiErrors(limit)
    res.status(200).json(logs)
  } catch (error) {
    console.error('Unable to fetch image error logs:', error)
    res.status(500).json({ message: 'Unable to fetch image error logs' })
  }
}
