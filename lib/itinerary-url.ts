type ItineraryRouteInput = {
  id: string
  city: string
  days: number
  month: string
  travel_style?: string
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const UUID_AT_END_PATTERN = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i

function slugifyPart(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value)
}

export function extractItineraryIdFromSegment(segment: string): string | null {
  const trimmed = segment.trim()

  if (isUuid(trimmed)) {
    return trimmed
  }

  const match = trimmed.match(UUID_AT_END_PATTERN)
  return match ? match[1] : null
}

export function buildItinerarySlug(input: Omit<ItineraryRouteInput, 'id'>): string {
  const parts = [
    `${input.days}-day`,
    input.city,
    input.month,
    input.travel_style,
  ]
    .map((value) => slugifyPart(String(value ?? '')))
    .filter(Boolean)

  return parts.join('-') || 'itinerary'
}

export function buildItinerarySegment(input: ItineraryRouteInput): string {
  return `${buildItinerarySlug(input)}-${input.id}`
}

export function buildItineraryPath(input: ItineraryRouteInput): string {
  return `/itinerary/${buildItinerarySegment(input)}`
}