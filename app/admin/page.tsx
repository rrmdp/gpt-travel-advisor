'use client'

import React, { useMemo, useState } from 'react'
import { buildItineraryPath } from '../../lib/itinerary-url'

type ApiErrorLog = {
  id: string
  endpoint: string
  status_code: number
  error_message: string
  context: string | null
  created_at: string
}

type StoredItinerary = {
  id: string
  city: string
  days: number
  month: string
  itinerary: string
  created_at: string
}

type PdfDownloadLead = {
  id: string
  name: string
  email: string
  itinerary_ids: string[]
  created_at: string
  updated_at: string
}

type DashboardResponse = {
  errors: ApiErrorLog[]
  itineraries: StoredItinerary[]
  leads: PdfDownloadLead[]
}

function isDashboardResponse(value: DashboardResponse | { message: string }): value is DashboardResponse {
  return 'errors' in value && 'itineraries' in value && 'leads' in value
}

function toBasicAuth(password: string) {
  return `Basic ${btoa(`admin:${password}`)}`
}

function formatDateUTC(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(dateString))
}

function safePreview(itinerary: string) {
  return itinerary
    .replace(/\[[^\]]+\]\([^\)]+\)/g, ' ')
    .replace(/[#*_`>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)
}

function formatContext(context: string | null) {
  if (!context) return 'No context'
  try {
    const parsed = JSON.parse(context) as Record<string, unknown>
    return Object.entries(parsed)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(' | ')
  } catch {
    return context
  }
}

export default function AdminDashboardPage() {
  const [password, setPassword] = useState('')
  const [submittedPassword, setSubmittedPassword] = useState('')
  const [errors, setErrors] = useState<ApiErrorLog[]>([])
  const [itineraries, setItineraries] = useState<StoredItinerary[]>([])
  const [leads, setLeads] = useState<PdfDownloadLead[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [message, setMessage] = useState('Enter the admin password to load dashboard data.')

  const authHeader = useMemo(() => {
    if (!submittedPassword) return ''
    return toBasicAuth(submittedPassword)
  }, [submittedPassword])

  async function loadDashboard(nextPassword: string) {
    setLoading(true)
    setMessage('Loading admin data...')

    try {
      const response = await fetch('/api/admin/dashboard?errorsLimit=100&itinerariesLimit=200&leadsLimit=500', {
        headers: {
          Authorization: toBasicAuth(nextPassword),
        },
      })

      const json = (await response.json().catch(() => ({ message: 'Unable to load admin data' }))) as
        | DashboardResponse
        | { message: string }

      if (!response.ok) {
        setErrors([])
        setItineraries([])
        setLeads([])
        setMessage('message' in json ? json.message : 'Unable to load admin data')
        return
      }

      if (!isDashboardResponse(json)) {
        setErrors([])
        setItineraries([])
        setLeads([])
        setMessage('Unable to load admin data')
        return
      }

      setSubmittedPassword(nextPassword)
      setErrors(json.errors)
      setItineraries(json.itineraries)
      setLeads(json.leads)
      setMessage(`Loaded ${json.errors.length} errors, ${json.itineraries.length} itineraries, and ${json.leads.length} leads.`)
    } catch (error) {
      console.error('Unable to load admin dashboard:', error)
      setMessage('Unable to load admin dashboard.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteItinerary(id: string) {
    if (!authHeader || deletingId) return
    const confirmed = window.confirm('Delete this itinerary permanently?')
    if (!confirmed) return

    setDeletingId(id)
    setMessage('Deleting itinerary...')

    try {
      const response = await fetch(`/api/admin/itineraries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
        },
      })

      const json = (await response.json().catch(() => ({ message: 'Unable to delete itinerary' }))) as {
        message: string
      }

      if (!response.ok) {
        setMessage(json.message || 'Unable to delete itinerary')
        return
      }

      setItineraries((current) => current.filter((item) => item.id !== id))
      setMessage('Itinerary deleted.')
    } catch (error) {
      console.error('Unable to delete itinerary:', error)
      setMessage('Unable to delete itinerary.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>Admin</p>
          <h1 style={styles.title}>Diagnostics Dashboard</h1>
          <p style={styles.subtitle}>
            Review API failures, inspect stored itinerary records, and delete bad entries without touching the database directly.
          </p>
          <div style={styles.authRow}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={styles.passwordInput}
            />
            <button
              onClick={() => loadDashboard(password)}
              disabled={loading || !password.trim()}
              style={styles.primaryButton}
            >
              {loading ? 'Loading...' : 'Open dashboard'}
            </button>
          </div>
          <p style={styles.message}>{message}</p>
        </section>

        <section style={styles.grid}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Recent Errors</h2>
              <span style={styles.counter}>{errors.length}</span>
            </div>
            <div style={styles.list}>
              {errors.length === 0 ? (
                <p style={styles.emptyState}>No errors loaded.</p>
              ) : (
                errors.map((error) => (
                  <article key={error.id} style={styles.errorCard}>
                    <div style={styles.errorMetaRow}>
                      <span style={styles.endpointBadge}>{error.endpoint}</span>
                      <span style={styles.statusBadge(error.status_code)}>{error.status_code}</span>
                    </div>
                    <p style={styles.errorText}>{error.error_message}</p>
                    <p style={styles.contextText}>{formatContext(error.context)}</p>
                    <p style={styles.timestamp}>{formatDateUTC(error.created_at)}</p>
                  </article>
                ))
              )}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Generated Itineraries</h2>
              <span style={styles.counter}>{itineraries.length}</span>
            </div>
            <div style={styles.list}>
              {itineraries.length === 0 ? (
                <p style={styles.emptyState}>No itineraries loaded.</p>
              ) : (
                itineraries.map((itinerary) => (
                  <article key={itinerary.id} style={styles.itineraryCard}>
                    <div style={styles.itineraryHeader}>
                      <div>
                        <h3 style={styles.itineraryTitle}>
                          {itinerary.days} days in {itinerary.city}
                        </h3>
                        <p style={styles.itineraryMeta}>
                          {itinerary.month} | {formatDateUTC(itinerary.created_at)}
                        </p>
                      </div>
                      <div style={styles.cardActions}>
                        <a href={buildItineraryPath(itinerary)} target="_blank" rel="noreferrer" style={styles.linkButton}>
                          Open
                        </a>
                        <button
                          onClick={() => handleDeleteItinerary(itinerary.id)}
                          disabled={deletingId === itinerary.id}
                          style={styles.deleteButton}
                        >
                          {deletingId === itinerary.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    <p style={styles.preview}>{safePreview(itinerary.itinerary)}</p>
                    <p style={styles.idText}>{itinerary.id}</p>
                  </article>
                ))
              )}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>PDF Download Leads</h2>
              <span style={styles.counter}>{leads.length}</span>
            </div>
            <div style={styles.list}>
              {leads.length === 0 ? (
                <p style={styles.emptyState}>No leads loaded.</p>
              ) : (
                leads.map((lead) => (
                  <article key={lead.id} style={styles.leadCard}>
                    <div style={styles.leadHeader}>
                      <h3 style={styles.leadName}>{lead.name}</h3>
                      <span style={styles.leadTimestamp}>Updated {formatDateUTC(lead.updated_at)}</span>
                    </div>
                    <p style={styles.leadEmail}>{lead.email}</p>
                    <p style={styles.leadLabel}>Itinerary IDs ({lead.itinerary_ids.length})</p>
                    {lead.itinerary_ids.length === 0 ? (
                      <p style={styles.emptyState}>No itinerary IDs recorded.</p>
                    ) : (
                      <div style={styles.idList}>
                        {lead.itinerary_ids.map((id) => (
                          <p key={`${lead.id}-${id}`} style={styles.idPill}>{id}</p>
                        ))}
                      </div>
                    )}
                    <p style={styles.leadCreated}>Created {formatDateUTC(lead.created_at)}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #7cc7e8 0%, #3a92dd 42%, #133d75 100%)',
    padding: '32px 20px 48px',
  },
  shell: {
    maxWidth: 1280,
    margin: '0 auto',
  },
  hero: {
    background: 'rgba(255,255,255,0.14)',
    border: '1px solid rgba(255,255,255,0.22)',
    backdropFilter: 'blur(12px)',
    borderRadius: 24,
    padding: '28px 28px 24px',
    marginBottom: 24,
    color: '#fff',
    boxShadow: '0 18px 60px rgba(8, 30, 71, 0.18)',
  },
  eyebrow: {
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.18em',
    fontSize: 12,
    opacity: 0.78,
  },
  title: {
    margin: '10px 0 8px',
    fontSize: 'clamp(32px, 5vw, 56px)',
    lineHeight: 1,
    fontWeight: 900,
  },
  subtitle: {
    margin: '0 0 20px',
    maxWidth: 780,
    fontSize: 16,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.92)',
  },
  authRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap' as const,
  },
  passwordInput: {
    flex: '1 1 280px',
    minWidth: 240,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.92)',
    padding: '14px 16px',
    fontSize: 15,
    color: '#13233e',
  },
  primaryButton: {
    border: 'none',
    borderRadius: 14,
    padding: '14px 18px',
    background: '#102749',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
  message: {
    margin: '14px 0 0',
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
  },
  panel: {
    background: 'rgba(248, 251, 255, 0.96)',
    borderRadius: 24,
    padding: 22,
    boxShadow: '0 18px 48px rgba(8, 30, 71, 0.16)',
    minHeight: 520,
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  panelTitle: {
    margin: 0,
    color: '#13233e',
    fontSize: 24,
    fontWeight: 800,
  },
  counter: {
    borderRadius: 999,
    background: '#dcecff',
    color: '#17406b',
    padding: '6px 10px',
    fontWeight: 700,
    fontSize: 13,
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 14,
  },
  errorCard: {
    borderRadius: 18,
    border: '1px solid #f1d7d6',
    background: '#fff7f7',
    padding: 16,
  },
  errorMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  endpointBadge: {
    borderRadius: 999,
    background: '#eef4ff',
    color: '#1f4670',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 700,
  },
  statusBadge: (statusCode: number) => ({
    borderRadius: 999,
    background: statusCode >= 500 ? '#fbd3cf' : '#ffe6a8',
    color: '#6b1f14',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 800,
  }),
  errorText: {
    margin: '0 0 8px',
    color: '#57231d',
    fontWeight: 700,
    lineHeight: 1.5,
  },
  contextText: {
    margin: '0 0 10px',
    color: '#6c4c49',
    fontSize: 13,
    lineHeight: 1.5,
  },
  timestamp: {
    margin: 0,
    color: '#7b6c6a',
    fontSize: 12,
  },
  itineraryCard: {
    borderRadius: 18,
    border: '1px solid #dfe7f5',
    background: '#ffffff',
    padding: 16,
  },
  leadCard: {
    borderRadius: 18,
    border: '1px solid #dfe7f5',
    background: '#ffffff',
    padding: 16,
  },
  itineraryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  leadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap' as const,
    marginBottom: 8,
  },
  leadName: {
    margin: 0,
    color: '#13233e',
    fontSize: 18,
    fontWeight: 800,
  },
  leadTimestamp: {
    margin: 0,
    color: '#617086',
    fontSize: 12,
  },
  leadEmail: {
    margin: '0 0 8px',
    color: '#144772',
    fontSize: 14,
    fontWeight: 700,
    wordBreak: 'break-all' as const,
  },
  leadLabel: {
    margin: '0 0 8px',
    color: '#617086',
    fontSize: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    fontWeight: 700,
  },
  idList: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
    marginBottom: 10,
  },
  idPill: {
    margin: 0,
    borderRadius: 999,
    border: '1px solid #dce9fa',
    background: '#eef4ff',
    color: '#355578',
    padding: '4px 9px',
    fontSize: 12,
    fontWeight: 700,
    maxWidth: '100%',
    overflowWrap: 'anywhere' as const,
  },
  leadCreated: {
    margin: 0,
    color: '#7a8da7',
    fontSize: 12,
  },
  itineraryTitle: {
    margin: 0,
    color: '#13233e',
    fontSize: 18,
    fontWeight: 800,
  },
  itineraryMeta: {
    margin: '6px 0 0',
    color: '#617086',
    fontSize: 13,
  },
  cardActions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  linkButton: {
    textDecoration: 'none',
    borderRadius: 10,
    padding: '9px 12px',
    background: '#e8f3ff',
    color: '#144772',
    fontWeight: 700,
    fontSize: 13,
  },
  deleteButton: {
    border: 'none',
    borderRadius: 10,
    padding: '9px 12px',
    background: '#8f2331',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
  preview: {
    margin: '0 0 10px',
    color: '#39495f',
    fontSize: 14,
    lineHeight: 1.6,
  },
  idText: {
    margin: 0,
    color: '#8090a8',
    fontSize: 12,
    wordBreak: 'break-all' as const,
  },
  emptyState: {
    margin: 0,
    color: '#617086',
    fontSize: 14,
  },
}
