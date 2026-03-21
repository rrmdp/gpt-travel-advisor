'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  params: { id: string }
}

type StoredItinerary = {
  id: string
  city: string
  days: number
  month: string
  itinerary: string
  created_at: string
}

type DayImage = {
  query: string
  url: string | null
}

function formatDateUTC(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString))
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} style={styles.copyBtn}>
      {copied ? '✓ Copied!' : '🔗 Share'}
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <main style={styles.main}>
      <div style={styles.hero}>
        <div style={{ ...styles.skeletonBlock, width: '60%', height: 44, margin: '0 auto 12px' }} />
        <div style={{ ...styles.skeletonBlock, width: '30%', height: 20, margin: '0 auto' }} />
      </div>
      <div style={styles.content}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={styles.card}>
            <div style={{ ...styles.skeletonBlock, width: '25%', height: 28, marginBottom: 16 }} />
            <div style={{ ...styles.skeletonBlock, width: '100%', height: 14, marginBottom: 8 }} />
            <div style={{ ...styles.skeletonBlock, width: '90%', height: 14, marginBottom: 8 }} />
            <div style={{ ...styles.skeletonBlock, width: '80%', height: 14 }} />
          </div>
        ))}
      </div>
    </main>
  )
}

export default function ItineraryPage({ params }: Props) {
  const [data, setData] = useState<StoredItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [dayImages, setDayImages] = useState<DayImage[]>([])
  const [imagesError, setImagesError] = useState<string>('')

  useEffect(() => {
    async function loadItinerary() {
      try {
        const response = await fetch('/api/itineraries')
        if (!response.ok) { setData(null); return }
        const itineraries: StoredItinerary[] = await response.json()
        setData(itineraries.find((item) => item.id === params.id) ?? null)
      } catch (error) {
        console.error('Unable to load itinerary:', error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    loadItinerary()
  }, [params.id])

  const days = useMemo(() => {
    if (!data) return []
    const split = data.itinerary.split('Day')
    if (split.length > 1) { split.shift(); return split }
    return ['1' + split[0]]
  }, [data])

  useEffect(() => {
    async function loadImages() {
      if (!data || days.length === 0) return
      try {
        setImagesError('')
        const response = await fetch('/api/get-itinerary-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            city: data.city,
            days: days.map((day) => day.replace(/^\s*\d+\s*/, '')),
          }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Unable to load images' }))
          setImagesError(error.message || 'Unable to load images')
          setDayImages([])
          return
        }

        const json = await response.json()
        setDayImages(Array.isArray(json.images) ? json.images : [])
      } catch (error) {
        console.error('Unable to load itinerary images:', error)
        setImagesError('Unable to load images')
        setDayImages([])
      }
    }

    loadImages()
  }, [data, days])

  if (loading) return <LoadingSkeleton />

  if (!data) {
    return (
      <main style={styles.main}>
        <div style={{ textAlign: 'center', paddingTop: 120 }}>
          <p style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>Itinerary not found.</p>
          <a href="/" style={styles.backLink}>← Back to home</a>
        </div>
      </main>
    )
  }

  const formattedDate = formatDateUTC(data.created_at)

  return (
    <main style={styles.main}>
      {/* Hero header */}
      <div style={styles.hero}>
        <p style={styles.heroEyebrow}>Your Mallorca itinerary</p>
        <h1 style={styles.heroTitle}>
          {data.days} days in {data.city}
        </h1>
        <p style={styles.heroMeta}>
          <span style={styles.badge}>{data.month}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.heroMetaText}>{data.days} days</span>
          <span style={styles.dot}>·</span>
          <span style={styles.heroMetaText}>Created {formattedDate}</span>
        </p>
        <div style={styles.heroActions}>
          <CopyLinkButton />
          <a href="/" style={styles.newTripBtn}>+ New itinerary</a>
        </div>
      </div>

      {/* Day cards */}
      <div style={styles.content}>
        {imagesError && <p style={styles.imagesError}>{imagesError}</p>}
        {days.map((day, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.dayBadge}>Day {index + 1}</div>
            <div style={styles.cardBody}>
              {dayImages[index]?.url && (
                <div style={styles.dayImageWrap}>
                  <img
                    src={dayImages[index].url as string}
                    alt={dayImages[index].query}
                    style={styles.dayImage}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h2 style={styles.mdH2}>{children}</h2>,
                  h2: ({ children }) => <h2 style={styles.mdH2}>{children}</h2>,
                  h3: ({ children }) => <h3 style={styles.mdH3}>{children}</h3>,
                  p: ({ children }) => <p style={styles.mdP}>{children}</p>,
                  ul: ({ children }) => <ul style={styles.mdUl}>{children}</ul>,
                  ol: ({ children }) => <ol style={styles.mdOl}>{children}</ol>,
                  li: ({ children }) => <li style={styles.mdLi}>{children}</li>,
                  strong: ({ children }) => <strong style={styles.mdStrong}>{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer" style={styles.mdLink}>
                      {children}
                    </a>
                  ),
                }}
              >
                {day.replace(/^\s*\d+\s*/, '')}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Promo card */}
        <div style={styles.promoCard}>
          <span style={styles.promoEmoji}>🏡</span>
          <p style={styles.promoText}>
            Travelling as a family? Check out{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.villasmediterranean.com/?ref=whattodoinmallorca"
              style={styles.promoLink}
            >
              Villas Mediterranean
            </a>{' '}
            for beautiful short-term villa rentals.
          </p>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <a href="/" style={styles.backLink}>← Plan another trip</a>
        </div>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
  },
  /* ── Hero ── */
  hero: {
    textAlign: 'center',
    padding: '60px 20px 50px',
    background: 'linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    marginBottom: 40,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 900,
    fontSize: 'clamp(32px, 6vw, 62px)',
    color: '#fff',
    textShadow: '0 2px 12px rgba(0,0,0,0.25)',
    lineHeight: 1.1,
    marginBottom: 18,
  },
  heroMeta: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  heroMetaText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  badge: {
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
    borderRadius: 20,
    padding: '3px 12px',
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.35)',
  },
  dot: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  heroActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  copyBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 50,
    padding: '9px 22px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(6px)',
    transition: 'background 0.2s',
    fontFamily: 'Roboto Mono, monospace',
  },
  newTripBtn: {
    background: '#fff',
    color: '#2f88ee',
    border: 'none',
    borderRadius: 50,
    padding: '9px 22px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: 'Roboto Mono, monospace',
  },
  /* ── Content ── */
  content: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '0 20px',
  },
  /* ── Day card ── */
  card: {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  },
  dayBadge: {
    background: 'linear-gradient(90deg, #2f88ee, #00c6ff)',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 800,
    fontSize: 15,
    letterSpacing: '0.05em',
    padding: '10px 22px',
  },
  cardBody: {
    padding: '22px 26px 26px',
  },
  dayImageWrap: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 6px 18px rgba(0,0,0,0.14)',
  },
  dayImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
    maxHeight: 320,
  },
  /* ── Markdown elements ── */
  mdH2: {
    color: '#1a3a5c',
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10,
    marginTop: 4,
  },
  mdH3: {
    color: '#1a3a5c',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 14,
  },
  mdP: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 1.75,
    marginBottom: 12,
  },
  mdUl: {
    paddingLeft: 20,
    marginBottom: 12,
  },
  mdOl: {
    paddingLeft: 20,
    marginBottom: 12,
  },
  mdLi: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 6,
  },
  mdStrong: {
    color: '#111827',
    fontWeight: 700,
  },
  mdLink: {
    color: '#2f88ee',
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
    fontWeight: 500,
  },
  /* ── Promo ── */
  promoCard: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 16,
    padding: '20px 26px',
    marginBottom: 32,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  promoEmoji: {
    fontSize: 32,
    flexShrink: 0,
  },
  promoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 1.6,
    margin: 0,
  },
  promoLink: {
    color: '#fff',
    fontWeight: 700,
    textDecoration: 'underline',
  },
  /* ── Misc ── */
  backLink: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
  },
  skeletonBlock: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    display: 'block',
  },
  imagesError: {
    color: '#fff',
    background: 'rgba(0,0,0,0.18)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: 10,
    padding: '10px 12px',
    marginBottom: 16,
    fontSize: 13,
  },
}
