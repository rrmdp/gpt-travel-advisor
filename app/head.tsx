import { AnalyticsWrapper } from './components/GAnalyticsLib';

export default function Head() {
  const title = 'Things to Do in Mallorca: AI Trip Planner and Day-by-Day Itineraries'
  const description = 'Plan the best things to do in Mallorca with an AI-powered itinerary builder. Get personalized day-by-day Mallorca travel plans by season, month, and trip length.'
  const siteUrl = 'https://www.whattodoinmallorca.com'

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
    description: 'Mediterranean island destination known for beaches, mountain villages, old towns, and local cuisine.',
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

  return (
    <>
      <title>{title}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={description} />
      <meta name="keywords" content="things to do in Mallorca, Mallorca itinerary, Mallorca travel guide, Mallorca trip planner, what to do in Majorca, Mallorca vacation planner" />
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <link rel="icon" href="/favicon.ico" /> 
      <AnalyticsWrapper /> 
      <meta name="google-site-verification" content="BKOrUF74-QvCNriJNcT5bsRdJU_zMwrsZKTz97QSQaU" />        
      <meta name="author" content="Rodrigo Rocco @rrmdp on Twitter"></meta>
      <link rel="canonical" href={siteUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="What to Do in Mallorca" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

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
    </>
  )
}
