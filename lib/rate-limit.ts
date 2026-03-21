import type { NextApiRequest } from 'next'
import { neon } from '@neondatabase/serverless'

type RateLimitConfig = {
  bucket: string
  maxRequests: number
  windowMs: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
  limit: number
}

let ensureTablePromise: Promise<void> | null = null

function getClient() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  if (!url) throw new Error('No database connection string set (DATABASE_URL or POSTGRES_URL)')
  return neon(url)
}

function getClientIdentifier(req: NextApiRequest): string {
  const forwardedFor = req.headers['x-forwarded-for']
  const realIp = req.headers['x-real-ip']

  const forwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0]
      : undefined

  const ip = (forwardedIp || (Array.isArray(realIp) ? realIp[0] : realIp) || req.socket.remoteAddress || 'unknown')
    .trim()
    .slice(0, 120)

  return ip || 'unknown'
}

async function ensureRateLimitTable(): Promise<void> {
  if (ensureTablePromise) return ensureTablePromise

  const sql = getClient()
  ensureTablePromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS api_rate_limit_hits (
        id BIGSERIAL PRIMARY KEY,
        bucket TEXT NOT NULL,
        identifier TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_api_rate_limit_hits_lookup
      ON api_rate_limit_hits (bucket, identifier, created_at DESC)
    `
  })()

  return ensureTablePromise
}

export async function enforceRateLimit(
  req: NextApiRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const sql = getClient()
  await ensureRateLimitTable()

  const identifier = getClientIdentifier(req)
  const now = Date.now()
  const windowStart = new Date(now - config.windowMs)

  // Keep table size under control by removing records outside any active window.
  await sql`
    DELETE FROM api_rate_limit_hits
    WHERE bucket = ${config.bucket}
      AND created_at < ${windowStart}
  `

  await sql`
    INSERT INTO api_rate_limit_hits (bucket, identifier)
    VALUES (${config.bucket}, ${identifier})
  `

  const countRows = await sql`
    SELECT COUNT(*)::int AS count
    FROM api_rate_limit_hits
    WHERE bucket = ${config.bucket}
      AND identifier = ${identifier}
      AND created_at >= ${windowStart}
  `

  const count = Number(countRows[0]?.count ?? 0)
  const remaining = Math.max(0, config.maxRequests - count)

  if (count <= config.maxRequests) {
    return {
      allowed: true,
      remaining,
      retryAfterSeconds: 0,
      limit: config.maxRequests,
    }
  }

  const oldestRows = await sql`
    SELECT MIN(created_at) AS first_hit
    FROM api_rate_limit_hits
    WHERE bucket = ${config.bucket}
      AND identifier = ${identifier}
      AND created_at >= ${windowStart}
  `

  const firstHitRaw = oldestRows[0]?.first_hit
  const firstHitMs = firstHitRaw ? new Date(firstHitRaw as string).getTime() : now
  const retryAfterMs = Math.max(0, config.windowMs - (now - firstHitMs))

  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    limit: config.maxRequests,
  }
}
