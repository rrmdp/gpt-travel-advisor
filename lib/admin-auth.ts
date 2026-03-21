import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorResponse = {
  message: string
}

const REALM = 'Protected Admin'

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

export function getAdminPassword() {
  return process.env.IMAGE_ERRORS_PASSWORD || process.env.ADMIN_PASSWORD || null
}

export function unauthorized<T>(res: NextApiResponse<T | ErrorResponse>) {
  res.setHeader('WWW-Authenticate', `Basic realm="${REALM}", charset="UTF-8"`)
  res.status(401).json({ message: 'Unauthorized' })
}

export function requireAdminAuth<T>(req: NextApiRequest, res: NextApiResponse<T | ErrorResponse>) {
  const requiredPassword = getAdminPassword()
  if (!requiredPassword) {
    res.status(500).json({ message: 'Missing IMAGE_ERRORS_PASSWORD (or ADMIN_PASSWORD) configuration' })
    return false
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization)
  if (!credentials || credentials.password !== requiredPassword) {
    unauthorized(res)
    return false
  }

  return true
}
