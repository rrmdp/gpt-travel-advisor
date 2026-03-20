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

const destinationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Mallorca',
  description:
    'Mediterranean island destination known for beaches, mountain villages, old towns, and local cuisine.',
  touristType: ['Families', 'Couples', 'Solo travelers', 'Adventure travelers'],
  url: siteUrl,
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the best things to do in Mallorca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Top things to do in Mallorca include Palma Old Town, Serra de Tramuntana villages like Valldemossa and Soller, beach days at Cala d Or and Alcudia, boat trips, local markets, and sunset viewpoints such as Cap de Formentor.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many days do I need in Mallorca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most travelers enjoy Mallorca in 4 to 7 days. A shorter trip focuses on Palma and nearby beaches, while 7 days allows mountain villages, hidden coves, and day trips across the island.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the best time to visit Mallorca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spring and early autumn are ideal for warm weather and fewer crowds. Summer is best for beaches and nightlife. Winter is quieter and great for city breaks, cycling, and hiking.',
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </body>
    </html>
  )
}
