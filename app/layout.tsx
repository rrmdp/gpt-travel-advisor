import './globals.css'
import { AnalyticsWrapper } from './components/analytics';
import type { Metadata } from 'next';

const siteUrl = 'https://www.whattodoinmallorca.com'
const title = 'Things to Do in Mallorca: AI Trip Planner and Day-by-Day Itineraries'
const description =
  'Plan the best things to do in Mallorca with an AI-powered itinerary builder. Get personalized day-by-day Mallorca travel plans by season, month, and trip length.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords:
    'things to do in Mallorca, Mallorca itinerary, Mallorca travel guide, Mallorca trip planner, what to do in Majorca, Mallorca vacation planner',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: { google: 'BKOrUF74-QvCNriJNcT5bsRdJU_zMwrsZKTz97QSQaU' },
  authors: [{ name: 'Rodrigo Rocco' }],
  alternates: { canonical: siteUrl },
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    siteName: 'What to Do in Mallorca',
    title,
    description,
    url: siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'What to Do in Mallorca',
  url: siteUrl,
  description,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="wrapper">
          {children}
          <AnalyticsWrapper />
        </div>
        <footer className="footer">
          <p>
            By{' '}
            <a
              className="sponsor"
              target="_blank"
              rel="noopener"
              href="https://www.villasmediterranean.com/?ref=whattodoinmallorca"
            >
              VillasMediterranean.com
            </a>
          </p>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  )
}
