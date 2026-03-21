import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiErrorLog, listRecentApiErrors } from '../../lib/db'

type ErrorResponse = {
  message: string
}

const REALM = 'Protected Logs'

function parseBasicAuthHeader(headerValue: string | undefined): { username: string; password: string } | null {
  if (!headerValue || !headerValue.startsWith('Basic ')) return null

  const encoded = headerValue.slice('Basic '.length).trim()
  if (!encoded) return null

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8')
    const separatorIndex = decoded.indexOf(':')
    if (separatorIndex < 0) return null
    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    }
  } catch {
    return null
  }
}

function unauthorized(res: NextApiResponse<ApiErrorLog[] | ErrorResponse>) {
  res.setHeader('WWW-Authenticate', `Basic realm="${REALM}", charset="UTF-8"`)
  res.status(401).json({ message: 'Unauthorized' })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiErrorLog[] | ErrorResponse>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const requiredPassword = process.env.IMAGE_ERRORS_PASSWORD || process.env.ADMIN_PASSWORD
  if (!requiredPassword) {
    res.status(500).json({ message: 'Missing IMAGE_ERRORS_PASSWORD (or ADMIN_PASSWORD) configuration' })
    return
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization)
  if (!credentials || credentials.password !== requiredPassword) {
    unauthorized(res)
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
