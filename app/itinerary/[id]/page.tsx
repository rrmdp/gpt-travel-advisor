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

export default function ItineraryPage({ params }: Props) {
  const [data, setData] = useState<StoredItinerary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadItinerary() {
      try {
        const response = await fetch('/api/itineraries')
        if (!response.ok) {
          setData(null)
          return
        }

        const itineraries: StoredItinerary[] = await response.json()
        const match = itineraries.find((item) => item.id === params.id)
        setData(match ?? null)
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

    const splitDays = data.itinerary.split('Day')
    if (splitDays.length > 1) {
      splitDays.shift()
      return splitDays
    }

    return ['1' + splitDays[0]]
  }, [data])

  if (loading) {
    return (
      <main>
        <div className="app-container">
          <div className="results-container" style={{ marginTop: '80px' }}>
            <p>Loading itinerary...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main>
        <div className="app-container">
          <div className="results-container" style={{ marginTop: '80px' }}>
            <p>Itinerary not found.</p>
            <a href="/" style={styles.backLink}>← Back to home</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="app-container">
        <div className="header">
          <h1 style={styles.header} className="hero-header">
            {data.days} days in {data.city} - {data.month}
          </h1>
        </div>
        <div className="results-container" style={{ marginTop: '30px' }}>
          {days.map((day, index) => (
            <div style={{ marginBottom: '30px' }} key={index}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => (
                    <a target="_blank" rel="noreferrer" href={props.href}>
                      {props.children}
                    </a>
                  ),
                }}
              >
                {`Day ${day}`}
              </ReactMarkdown>
            </div>
          ))}
          <div style={{ marginBottom: '30px' }}>
            If you are a family and would like to stay in a nice villa then check
            out{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.villasmediterranean.com/?ref=whattodoinmallorca"
            >
              Villas Mediterranean
            </a>
          </div>
          <div style={{ marginBottom: '40px' }}>
            <a href="/" style={styles.backLink}>
              ← Plan another trip
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as const,
    marginTop: '60px',
    color: '#fff',
    fontWeight: '900',
    fontFamily: 'Poppins',
    fontSize: '48px',
    textShadow: '0 0 3px #a5a5a5',
  },
  backLink: {
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'underline',
  },
}
