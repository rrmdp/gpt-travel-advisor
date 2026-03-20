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
  itinerary: string
  created_at: string
}

export interface ItinerarySummary {
  id: string
  city: string
  days: number
  month: string
  created_at: string
}

export interface StoredItinerary extends ItinerarySummary {
  itinerary: string
}

async function ensureTable(): Promise<void> {
  const sql = getClient()
  await sql`
    CREATE TABLE IF NOT EXISTS itineraries (
      id TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      days INTEGER NOT NULL,
      month TEXT NOT NULL,
      itinerary TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function saveItinerary(
  city: string,
  days: number,
  month: string,
  itinerary: string
): Promise<string> {
  const sql = getClient()
  const id = crypto.randomUUID()
  await ensureTable()
  await sql`
    INSERT INTO itineraries (id, city, days, month, itinerary)
    VALUES (${id}, ${city}, ${days}, ${month}, ${itinerary})
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
  const rows = await sql`
    SELECT id, city, days, month, itinerary, created_at
    FROM itineraries
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return rows as StoredItinerary[]
}
