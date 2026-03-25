'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import html2canvas from 'html2canvas'
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

function PDFDownloadButton({ contentRef, fileName }: { contentRef: React.RefObject<HTMLDivElement>; fileName: string }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const sanitizeColorsInElement = (element: Element) => {
    // Get all elements in the tree
    const allElements = [element as HTMLElement, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[]
    
    allElements.forEach((htmlEl) => {
      // Get computed style
      const style = window.getComputedStyle(htmlEl)
      
      // Check all color-related properties and override with safe colors if needed
      const colorProperties = [
        { prop: 'backgroundColor', css: 'background-color', fallback: '#ffffff' },
        { prop: 'color', css: 'color', fallback: '#000000' },
        { prop: 'borderColor', css: 'border-color', fallback: '#cccccc' },
        { prop: 'borderTopColor', css: 'border-top-color', fallback: '#cccccc' },
        { prop: 'borderRightColor', css: 'border-right-color', fallback: '#cccccc' },
        { prop: 'borderBottomColor', css: 'border-bottom-color', fallback: '#cccccc' },
        { prop: 'borderLeftColor', css: 'border-left-color', fallback: '#cccccc' },
        { prop: 'outlineColor', css: 'outline-color', fallback: '#cccccc' },
      ]
      
      colorProperties.forEach(({ prop, css, fallback }) => {
        const value = style.getPropertyValue(css)
        
        // Check if the value contains oklch or other unsupported color functions
        if (value && (value.includes('oklch') || value.includes('lch(') || value.includes('lab('))) {
          // Force set the inline style to the fallback color
          htmlEl.style.setProperty(css, fallback, 'important')
        }
      })
      
      // Also handle inline style attributes that might have oklch
      const inlineStyle = htmlEl.getAttribute('style')
      if (inlineStyle && inlineStyle.includes('oklch')) {
        const newStyle = inlineStyle
          .replace(/oklch\([^)]*\)/g, '#ffffff')
          .replace(/lch\([^)]*\)/g, '#ffffff')
          .replace(/lab\([^)]*\)/g, '#ffffff')
        htmlEl.setAttribute('style', newStyle)
      }
    })
  }

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return
    
    setIsDownloading(true)
    try {
      // Clone the element to avoid modifying the original
      const clonedElement = contentRef.current.cloneNode(true) as HTMLDivElement
      
      // Create a temporary container
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'fixed'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '-9999px'
      tempContainer.style.width = contentRef.current.offsetWidth + 'px'
      tempContainer.style.backgroundColor = '#ffffff'
      tempContainer.style.zIndex = '-9999'
      tempContainer.appendChild(clonedElement)
      document.body.appendChild(tempContainer)

      try {
        // Wait for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 150))
        
        // First pass: sanitize visible styles
        sanitizeColorsInElement(clonedElement)
        
        // Wait again after sanitization
        await new Promise(resolve => setTimeout(resolve, 100))

        const canvas = await html2canvas(clonedElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          removeContainer: false,
          onclone: (clonedDoc) => {
            // Additional sanitization in the html2canvas clone
            const allEls = clonedDoc.querySelectorAll('*') as NodeListOf<HTMLElement>
            allEls.forEach((el) => {
              const style = el.getAttribute('style') || ''
              if (style.includes('oklch') || style.includes('lch(') || style.includes('lab(')) {
                const cleaned = style
                  .replace(/oklch\([^)]*\)/g, '#ffffff')
                  .replace(/lch\([^)]*\)/g, '#ffffff')
                  .replace(/lab\([^)]*\)/g, '#ffffff')
                el.setAttribute('style', cleaned)
              }
            })
          }
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        })

        const imgWidth = 210 - 20 // A4 width minus margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight
        let position = 10 // Top margin

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= 297 - 20 // A4 height minus margins

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
          heightLeft -= 297 - 20
        }

        pdf.save(`${fileName}.pdf`)
      } finally {
        // Clean up temporary container
        document.body.removeChild(tempContainer)
      }
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
          <PDFDownloadButton contentRef={contentRef} fileName={`${data.city}-itinerary-${data.days}days-by-VillasMediterranean.com`} />
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
