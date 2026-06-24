import type { NextApiRequest, NextApiResponse } from 'next'
import { upsertPdfDownloadLead } from '../../lib/db'

type Data = {
  ok: true
}

type ErrorResponse = {
  message: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const itineraryId = typeof body?.itineraryId === 'string' ? body.itineraryId.trim() : ''

  if (!name || !email || !itineraryId) {
    return res.status(400).json({ message: 'Name, email, and itineraryId are required' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' })
  }

  try {
    await upsertPdfDownloadLead(name, email, itineraryId)
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Unable to save PDF download lead:', error)
    return res.status(500).json({ message: 'Unable to save lead details' })
  }
}
