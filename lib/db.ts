import { neon } from '@neondatabase/serverless'

function getClient() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  if (!url) throw new Error('No database connection string set (DATABASE_URL or POSTGRES_URL)')
  return neon(url)
}

export interface Itinerary {
  id: string
  city: string
  days: number
  month: string
  travel_style?: string
  interests?: string
  itinerary: string
  created_at: string
}

export interface ItinerarySummary {
  id: string
  city: string
  days: number
  month: string
  travel_style?: string
  interests?: string
  created_at: string
}

export interface StoredItinerary extends ItinerarySummary {
  itinerary: string
}

export interface ApiErrorLog {
  id: string
  endpoint: string
  status_code: number
  error_message: string
  context: string | null
  created_at: string
}

export interface CachedImageQueryRow {
  query: string
  url: string | null
  expires_at: string
  updated_at: string
}

async function ensureTable(): Promise<void> {
  const sql = getClient()
  await sql`
    CREATE TABLE IF NOT EXISTS itineraries (
      id TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      days INTEGER NOT NULL,
      month TEXT NOT NULL,
      travel_style TEXT,
      interests TEXT,
      itinerary TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    ALTER TABLE itineraries
    ADD COLUMN IF NOT EXISTS travel_style TEXT
  `

  await sql`
    ALTER TABLE itineraries
    ADD COLUMN IF NOT EXISTS interests TEXT
  `
}

async function ensureApiErrorLogTable(): Promise<void> {
  const sql = getClient()
  await sql`
    CREATE TABLE IF NOT EXISTS api_error_logs (
      id TEXT PRIMARY KEY,
      endpoint TEXT NOT NULL,
      status_code INTEGER NOT NULL,
      error_message TEXT NOT NULL,
      context TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

async function ensureImageQueryCacheTable(): Promise<void> {
  const sql = getClient()
  await sql`
    CREATE TABLE IF NOT EXISTS image_query_cache (
      query TEXT PRIMARY KEY,
      url TEXT,
      expires_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  await sql`
    CREATE INDEX IF NOT EXISTS idx_image_query_cache_expires_at
    ON image_query_cache (expires_at)
  `
}

export async function saveItinerary(
  city: string,
  days: number,
  month: string,
  travelStyle: string = '',
  interests: string = '',
  itinerary: string
): Promise<string> {
  const sql = getClient()
  const id = crypto.randomUUID()
  await ensureTable()
  await sql`
    INSERT INTO itineraries (id, city, days, month, travel_style, interests, itinerary)
    VALUES (${id}, ${city}, ${days}, ${month}, ${travelStyle}, ${interests}, ${itinerary})
  `
  return id
}

export async function getItineraryById(id: string): Promise<Itinerary | null> {
  const sql = getClient()
  await ensureTable()
  const rows = await sql`
    SELECT * FROM itineraries WHERE id = ${id}
  `
  return (rows[0] as Itinerary) ?? null
}

export async function listRecentStoredItineraries(
  limit = 30
): Promise<StoredItinerary[]> {
  const sql = getClient()
  await ensureTable()
  const safeLimit = Math.max(1, Math.min(500, Math.round(limit)))
  const rows = await sql`
    SELECT id, city, days, month, itinerary, created_at
    FROM itineraries
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `
  return rows as StoredItinerary[]
}

export async function deleteStoredItinerary(id: string): Promise<boolean> {
  const sql = getClient()
  await ensureTable()
  const rows = await sql`
    DELETE FROM itineraries
    WHERE id = ${id}
    RETURNING id
  `
  return rows.length > 0
}

export async function listAllItinerarySummaries(): Promise<ItinerarySummary[]> {
  const sql = getClient()
  await ensureTable()
  const rows = await sql`
    SELECT id, city, days, month, created_at
    FROM itineraries
    ORDER BY created_at DESC
  `
  return rows as ItinerarySummary[]
}

export async function logApiError(
  endpoint: string,
  statusCode: number,
  errorMessage: string,
  context: string | null = null
): Promise<void> {
  const sql = getClient()
  const id = crypto.randomUUID()
  await ensureApiErrorLogTable()
  await sql`
    INSERT INTO api_error_logs (id, endpoint, status_code, error_message, context)
    VALUES (${id}, ${endpoint}, ${statusCode}, ${errorMessage}, ${context})
  `
}

export async function listRecentApiErrors(limit = 50): Promise<ApiErrorLog[]> {
  const sql = getClient()
  await ensureApiErrorLogTable()
  const safeLimit = Math.max(1, Math.min(200, Math.round(limit)))
  const rows = await sql`
    SELECT id, endpoint, status_code, error_message, context, created_at
    FROM api_error_logs
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `
  return rows as ApiErrorLog[]
}

export async function getCachedImageUrls(
  queries: string[]
): Promise<Map<string, string | null>> {
  const sql = getClient()
  await ensureImageQueryCacheTable()

  const cleaned = Array.from(new Set(queries.map((value) => value.trim()).filter(Boolean)))
  if (cleaned.length === 0) return new Map()

  await sql`
    DELETE FROM image_query_cache
    WHERE expires_at < NOW()
  `

  const rows = await sql`
    SELECT query, url
    FROM image_query_cache
    WHERE query = ANY(${cleaned})
      AND expires_at >= NOW()
  `

  const result = new Map<string, string | null>()
  for (const row of rows as Array<{ query: string; url: string | null }>) {
    result.set(row.query, row.url)
  }

  return result
}

export async function upsertCachedImageUrls(
  entries: Array<{ query: string; url: string | null }>,
  ttlSeconds: number
): Promise<void> {
  const sql = getClient()
  await ensureImageQueryCacheTable()

  const safeTtlSeconds = Math.max(60, Math.min(60 * 60 * 24 * 30, Math.round(ttlSeconds)))
  const expiresAt = new Date(Date.now() + safeTtlSeconds * 1000)

  const cleaned = entries
    .map((entry) => ({ query: entry.query.trim(), url: entry.url }))
    .filter((entry) => Boolean(entry.query))

  if (cleaned.length === 0) return

  await Promise.all(
    cleaned.map((entry) => (
      sql`
        INSERT INTO image_query_cache (query, url, expires_at, updated_at)
        VALUES (${entry.query}, ${entry.url}, ${expiresAt}, NOW())
        ON CONFLICT (query)
        DO UPDATE
          SET url = EXCLUDED.url,
              expires_at = EXCLUDED.expires_at,
              updated_at = NOW()
      `
    ))
  )
}
