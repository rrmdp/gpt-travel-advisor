import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'itineraries.db')
    db = new Database(dbPath)
    db.exec(`
      CREATE TABLE IF NOT EXISTS itineraries (
        id TEXT PRIMARY KEY,
        city TEXT NOT NULL,
        days INTEGER NOT NULL,
        month TEXT NOT NULL,
        itinerary TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }
  return db
}

export interface Itinerary {
  id: string
  city: string
  days: number
  month: string
  itinerary: string
  created_at: string
}

export function saveItinerary(city: string, days: number, month: string, itinerary: string): string {
  const id = crypto.randomUUID()
  const db = getDb()
  db.prepare(
    'INSERT INTO itineraries (id, city, days, month, itinerary) VALUES (?, ?, ?, ?, ?)'
  ).run(id, city, days, month, itinerary)
  return id
}

export function getItineraryById(id: string): Itinerary | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM itineraries WHERE id = ?').get(id)
  return (row as Itinerary) ?? null
}
