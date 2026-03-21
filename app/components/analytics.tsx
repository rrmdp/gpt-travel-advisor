'use client'

import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from 'nextjs-google-analytics'

export function AnalyticsWrapper() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <>
      {gaMeasurementId ? (
        <GoogleAnalytics
          strategy="afterInteractive"
          gaMeasurementId={gaMeasurementId}
          trackPageViews
        />
      ) : null}
      <Analytics />
    </>
  )
}