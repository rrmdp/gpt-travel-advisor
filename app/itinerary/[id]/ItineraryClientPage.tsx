'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import jsPDF from 'jspdf'

interface Props {
  params: { id: string }
}

type StoredItinerary = {
  id: string
  city: string
  days: number
  month: string
  travel_style?: string
  interests?: string
  itinerary: string
  created_at: string
}

type DayImage = {
  query: string
  url: string | null
}

function stripTitlePreamble(text: string) {
  return text
    .replace(/^\s*(?:#{1,6}\s*)?(?:holiday\s+itinerary|travel\s+itinerary|itinerary)[^\n]*\n+/i, '')
    .trim()
}

function parseItineraryDays(itinerary: string) {
  const normalized = itinerary.replace(/\r\n/g, '\n').trim()
  const headingRegex = /^#{0,6}\s*Day\s+\d+\s*[:\-]?\s*/gim
  const matches = Array.from(normalized.matchAll(headingRegex))

  if (matches.length === 0) {
    const cleaned = stripTitlePreamble(normalized)
    return cleaned ? [cleaned] : []
  }

  const sections = matches
    .map((match, index) => {
      const start = match.index ?? 0
      const end = index + 1 < matches.length ? (matches[index + 1].index ?? normalized.length) : normalized.length
      return normalized.slice(start, end).trim()
    })
    .map((section) => section.replace(/^#{0,6}\s*Day\s+\d+\s*[:\-]?\s*/i, '').trim())
    .map((section, index) => (index === 0 ? stripTitlePreamble(section) : section))
    .filter(Boolean)

  return sections
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

function stripMarkdownForPdf(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/^>\s?/gm, '')
    .trim()
}

async function loadImageAsDataUrl(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Unable to load image for PDF export')
  }

  const blob = await response.blob()
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Unable to read image for PDF export'))
    reader.readAsDataURL(blob)
  })
}

function PDFDownloadButton({
  fileName,
  itinerary,
  dayImages,
}: {
  fileName: string
  itinerary: StoredItinerary
  dayImages: DayImage[]
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const marginX = 16
      const marginTop = 18
      const marginBottom = 18
      const contentWidth = pageWidth - marginX * 2
      let cursorY = marginTop

      const addPageIfNeeded = (requiredHeight: number) => {
        if (cursorY + requiredHeight <= pageHeight - marginBottom) return
        pdf.addPage()
        cursorY = marginTop
      }

      const addWrappedText = (
        text: string,
        options: { fontSize: number; color: [number, number, number]; lineHeight: number; bold?: boolean }
      ) => {
        const lines = pdf.splitTextToSize(text, contentWidth)
        const blockHeight = Math.max(lines.length, 1) * options.lineHeight
        addPageIfNeeded(blockHeight)
        pdf.setFont('helvetica', options.bold ? 'bold' : 'normal')
        pdf.setFontSize(options.fontSize)
        pdf.setTextColor(...options.color)
        pdf.text(lines, marginX, cursorY)
        cursorY += blockHeight
      }

      pdf.setFillColor(16, 84, 122)
      pdf.roundedRect(marginX, cursorY, contentWidth, 30, 5, 5, 'F')
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(22)
      pdf.setTextColor(255, 255, 255)
      pdf.text(`${itinerary.days} days in ${itinerary.city}`, marginX + 6, cursorY + 11)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text(`Month: ${itinerary.month}    Created: ${formatDateUTC(itinerary.created_at)}`, marginX + 6, cursorY + 19)
      if (itinerary.travel_style) {
        pdf.text(`Travel style: ${itinerary.travel_style}`, marginX + 6, cursorY + 25)
      }
      cursorY += 38

      if (itinerary.interests) {
        addWrappedText(`Interests: ${itinerary.interests}`, {
          fontSize: 11,
          color: [55, 65, 81],
          lineHeight: 6,
          bold: true,
        })
        cursorY += 2
      }

      const daySections = parseItineraryDays(itinerary.itinerary)

      for (let index = 0; index < daySections.length; index += 1) {
        const dayText = stripMarkdownForPdf(daySections[index].replace(/^\s*\d+\s*/, ''))

        addPageIfNeeded(18)
        pdf.setFillColor(239, 246, 255)
        pdf.setDrawColor(147, 197, 253)
        pdf.roundedRect(marginX, cursorY, contentWidth, 12, 3, 3, 'FD')
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(13)
        pdf.setTextColor(30, 64, 175)
        pdf.text(`Day ${index + 1}`, marginX + 5, cursorY + 8)
        cursorY += 16

        const imageUrl = dayImages[index]?.url
        if (imageUrl) {
          try {
            const imageDataUrl = await loadImageAsDataUrl(imageUrl)
            const imageHeight = 42
            addPageIfNeeded(imageHeight + 4)
            pdf.addImage(imageDataUrl, 'JPEG', marginX, cursorY, contentWidth, imageHeight)
            cursorY += imageHeight + 5
          } catch (imageError) {
            console.error('Unable to embed itinerary image in PDF:', imageError)
          }
        }

        const paragraphs = dayText.split(/\n\s*\n/).filter(Boolean)
        for (const paragraph of paragraphs) {
          addWrappedText(paragraph.trim(), {
            fontSize: 11,
            color: [31, 41, 55],
            lineHeight: 5.5,
          })
          cursorY += 1.5
        }

        cursorY += 4
      }

      addPageIfNeeded(24)
      pdf.setFillColor(255, 247, 237)
      pdf.setDrawColor(251, 191, 36)
      pdf.roundedRect(marginX, cursorY, contentWidth, 18, 4, 4, 'FD')
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(12)
      pdf.setTextColor(146, 64, 14)
      pdf.text('Stay Recommendation', marginX + 5, cursorY + 7)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text('VillasMediterranean.com for stylish short-term Mallorca villa rentals.', marginX + 5, cursorY + 13)

      pdf.save(`${fileName}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Unable to generate PDF. Please try again or check your browser console for details.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button onClick={handleDownloadPDF} disabled={isDownloading} style={styles.downloadBtn}>
      {isDownloading ? '⏳ Generating...' : '📥 Download PDF'}
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

export default function ItineraryClientPage({ params }: Props) {
  const [data, setData] = useState<StoredItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [dayImages, setDayImages] = useState<DayImage[]>([])
  const [hiddenImageIndexes, setHiddenImageIndexes] = useState<number[]>([])
  const [loadedImageIndexes, setLoadedImageIndexes] = useState<number[]>([])
  const contentRef = useRef<HTMLDivElement>(null)

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
    return parseItineraryDays(data.itinerary)
  }, [data])

  useEffect(() => {
    async function loadImages() {
      if (!data || days.length === 0) return
      try {
        setHiddenImageIndexes([])
        setLoadedImageIndexes([])
        const response = await fetch('/api/get-itinerary-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            city: data.city,
            days,
          }),
        })

        if (!response.ok) {
          setHiddenImageIndexes([])
          setLoadedImageIndexes([])
          setDayImages([])
          return
        }

        const json = await response.json()
        setHiddenImageIndexes([])
        setLoadedImageIndexes([])
        setDayImages(Array.isArray(json.images) ? json.images : [])
      } catch (error) {
        console.error('Unable to load itinerary images:', error)
        setHiddenImageIndexes([])
        setLoadedImageIndexes([])
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
          {data.travel_style && <span style={{ fontSize: '0.7em', opacity: 0.9 }}> · {data.travel_style}</span>}
        </h1>
        <p style={styles.heroMeta}>
          <span style={styles.badge}>{data.month}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.heroMetaText}>{data.days} days</span>
          <span style={styles.dot}>·</span>
          {data.travel_style && (
            <>
              <span style={styles.heroMetaText}>{data.travel_style}</span>
              <span style={styles.dot}>·</span>
            </>
          )}
          <span style={styles.heroMetaText}>Created {formattedDate}</span>
        </p>
        {data.interests && (
          <p style={styles.heroSubtext}>
            <strong>Interests:</strong> {data.interests}
          </p>
        )}
        <div style={styles.heroActions}>
          <CopyLinkButton />
          <PDFDownloadButton
            fileName={`${data.city}-itinerary-${data.days}days-by-VillasMediterranean.com`}
            itinerary={data}
            dayImages={dayImages}
          />
          <a href="/" style={styles.newTripBtn}>+ New itinerary</a>
        </div>
      </div>

      {/* Day cards */}
      <div style={styles.content} ref={contentRef}>
        {days.map((day, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.dayBadge}>Day {index + 1}</div>
            <div style={styles.cardBody}>
              {dayImages[index]?.url && !hiddenImageIndexes.includes(index) && (
                <div style={styles.dayImageWrap}>
                  {!loadedImageIndexes.includes(index) && (
                    <div style={styles.dayImageSkeleton} aria-hidden="true" />
                  )}
                  <img
                    src={dayImages[index].url as string}
                    alt={dayImages[index].query}
                    style={{
                      ...styles.dayImage,
                      opacity: loadedImageIndexes.includes(index) ? 1 : 0,
                    }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onLoad={() => {
                      setLoadedImageIndexes((current) => (
                        current.includes(index) ? current : [...current, index]
                      ))
                    }}
                    onError={() => {
                      setHiddenImageIndexes((current) => (
                        current.includes(index) ? current : [...current, index]
                      ))
                    }}
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
  heroSubtext: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 0,
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
  downloadBtn: {
    background: 'linear-gradient(135deg, #2f88ee 0%, #00c6ff 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 50,
    padding: '9px 22px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: 'Roboto Mono, monospace',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(47, 136, 238, 0.3)',
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
    margin: '0 auto 16px',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: '16 / 9',
    maxHeight: 320,
    background: '#d6e4f5',
    boxShadow: '0 6px 18px rgba(0,0,0,0.14)',
  },
  dayImage: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
    transition: 'opacity 0.35s ease',
  },
  dayImageSkeleton: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(100deg, rgba(255,255,255,0.35) 10%, rgba(255,255,255,0.72) 45%, rgba(255,255,255,0.35) 80%) #c8dcf4',
    backgroundSize: '220% 100%',
    animation: 'itineraryImageShimmer 1.3s ease-in-out infinite',
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
    background: 'linear-gradient(135deg, rgba(47, 136, 238, 0.15) 0%, rgba(0, 198, 255, 0.1) 100%)',
    border: '2px solid rgba(47, 136, 238, 0.4)',
    borderRadius: 16,
    padding: '24px 26px',
    marginBottom: 32,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 8px 32px rgba(47, 136, 238, 0.12)',
    backdropFilter: 'blur(8px)',
  },
  promoEmoji: {
    fontSize: 48,
    flexShrink: 0,
    lineHeight: 1,
  },
  promoText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    lineHeight: 1.7,
    margin: 0,
    fontWeight: 500,
  },
  promoLink: {
    color: '#fff',
    fontWeight: 700,
    textDecoration: 'underline',
    transition: 'opacity 0.2s',
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
}
