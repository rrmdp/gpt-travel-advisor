import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Article = {
  slug: string
  title: string
  summary: string
  heroImage: string
  intro: string
  sections: Array<{
    heading: string
    text: string[]
    image?: string
    alt?: string
  }>
  checklist: string[]
  whereToStay: string[]
  practicalTips: string[]
}

const articles: Record<string, Article> = {
  '4-day-mallorca-itinerary-for-first-time-visitors': {
    slug: '4-day-mallorca-itinerary-for-first-time-visitors',
    title: '4-day Mallorca itinerary for first-time visitors',
    summary:
      'A practical four-day Mallorca plan for first-timers, covering Palma, beach time, scenic villages, and a relaxed way to see the island without overloading the trip.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'A first trip to Mallorca works best when you balance one city day, one beach day, one mountain-village day, and one easy coastal or harbour day. This route keeps the island varied without forcing too much driving or tight timings.',
    sections: [
      {
        heading: 'Day 1: Palma and a slow first evening',
        text: [
          'Start in Palma, the best base for a first visit if you want walkable restaurants, historic streets, and quick airport access. Spend the afternoon around the old town, then walk through Plaça Major and along the seafront before dinner.',
          'The cathedral is the obvious starting point, but the real reward is wandering the side streets and stopping for lunch or tapas in one of the traditional bars. A relaxed evening is better than trying to cram in too much on the first day, especially after a flight.',
          'If you want a beach signal on day one, go to Cala Major or a nearby beach club for a few hours in the late afternoon, then head back into Palma for dinner.'
        ],
        image:
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
        alt: 'Palma old town and seafront in Mallorca',
      },
      {
        heading: 'Day 2: Beach day in the north or east coast',
        text: [
          'For most first-time visitors, beach time is one of the main reasons to come to Mallorca. Choose a base that matches how you want the day to feel: sandy and family-friendly in Alcudia or Playa de Muro, or a more polished beach-and-harbour feel around Cala d Or or Santa Ponsa.',
          'A simple formula works well: leave Palma early, spend the day by the sea, and return in the evening. That gives you a proper beach holiday feel without losing a city night.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Mallorca beach and turquoise water',
      },
      {
        heading: 'Day 3: Serra de Tramuntana villages and scenic roads',
        text: [
          'This is the day that gives Mallorca its character. The Serra de Tramuntana is the island’s most scenic zone, and the best route is not a huge checklist but a short loop through a few villages.' ,
          'A reliable first-timer loop is Palma to Valldemossa, then Deia, and finish with a lunch stop in Soller or Port de Soller. These are not just pretty photo stops; they are sensible places to slow down, have a proper lunch, and enjoy the mountain views.' ,
          'If you want to keep it simpler, do one scenic village plus one harbour stop. Do not try to cram in every viewpoint; the roads are winding and parking can be difficult in peak months.'
        ],
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        alt: 'Scenic mountain roads in Mallorca',
      },
      {
        heading: 'Day 4: Coastal harbour, food and a final easy afternoon',
        text: [
          'Use your final day for something low-pressure. Port de Soller, Puerto Portals, or a harbour area along the south-west coast is ideal for a relaxed finish. This gives you time for lunch, a last swim, and a slow walk before departure.',
          'If you have a late flight, keep the morning flexible and do a final beach or marina stroll. If you are leaving early, spend the morning in Palma and stop for one last local lunch before setting off.'
        ],
        image:
          'https://images.unsplash.com/photo-1493558103817-58b2924b5715?auto=format&fit=crop&w=1200&q=80',
        alt: 'Harbour and marina in Mallorca',
      },
    ],
    checklist: [
      'Base yourself in Palma for the first night if you want city access, or in Alcudia for a classic beach holiday with easier family logistics.',
      'Book your beach club, boat trip, or restaurant table early if you are visiting in July or August.',
      'A car helps for mountain villages and the west coast, but Palma itself is easy without one.',
      'Keep one day flexible for weather changes, especially if you plan a boat or beach day.',
    ],
    whereToStay: [
      'Palma if you want a city break with food, nightlife, and easy transit.',
      'Alcudia or Playa de Muro if your priority is a long sandy beach and family-friendly amenities.',
      'Port de Soller or a west-coast village if you want slower scenery and a more relaxed base.',
    ],
    practicalTips: [
      'May, June, September, and early October are often the easiest months for comfortable weather and less intensity in busy beach areas.',
      'Use a car for the west coast and mountain villages; otherwise, stick to Palma and one resort base.',
      'Try local dishes such as ensaïmada, pa amb oli, fresh grilled fish, and simple tapas in small neighbourhood bars rather than only resort restaurants.',
      'Carry water and start early in summer if you are visiting village viewpoints or hiking routes, as heat builds quickly.'
    ],
  },
  'family-friendly-things-to-do-in-mallorca': {
    slug: 'family-friendly-things-to-do-in-mallorca',
    title: 'Family-friendly things to do in Mallorca',
    summary:
      'A practical guide to family travel in Mallorca, with calm beaches, easy day trips, and low-stress activities that work well with children.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Mallorca is one of the easier Mediterranean island destinations for family holidays because many beaches are calm, transfers are manageable, and there are lots of straightforward activities for all ages.',
    sections: [
      {
        heading: 'Best family bases',
        text: [
          'For many families, the easiest approach is to stay in Alcudia, Playa de Muro, Santa Ponsa, or Cala d Or. These areas offer sandy beaches, family-friendly restaurants, and a good range of apartments or villas.',
          'If you would rather have a city feel with shorter walks and easy dining, Palma is also a good option for a few nights, but it is less convenient for daily beach time if you are traveling with young children.'
        ],
      },
      {
        heading: 'Calm beach days and simple activities',
        text: [
          'Choose beaches with shallow water and easy access to toilets, shade, and food. The north and east coasts are often popular for families because the water is usually calmer and the beach areas feel more spread out.'
        ],
      }
    ],
    checklist: ['Stay close to the beach', 'Book car seats if needed', 'Plan a quiet afternoon break'],
    whereToStay: ['Alcudia', 'Playa de Muro', 'Cala d Or'],
    practicalTips: ['Aim for early morning beach time', 'Pack sunscreen and water', 'Keep one easy day in the plan'],
  },
  'best-beaches-and-calas-in-majorca': {
    slug: 'best-beaches-and-calas-in-majorca',
    title: 'Best beaches and calas in Majorca',
    summary:
      'A useful shortlist of Mallorca beaches and coves for different trip styles, from long sandy family days to quiet swimming coves.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Mallorca’s beaches are varied. Families usually prefer wide sandy stretches, while couples and snorkellers may prefer smaller coves with clear water and a more relaxed atmosphere.',
    sections: [
      {
        heading: 'Best for easy family days',
        text: [
          'Playa de Muro and Alcudia beach are among the most practical choices because of their size, flat approach, and food options.'
        ],
      },
      {
        heading: 'Best for quieter coves',
        text: [
          'Cala S’Almunia, Cala Torta, and some coves near the west coast can feel calmer and less busy, especially outside the peak midday hours.'
        ],
      }
    ],
    checklist: ['Check water conditions', 'Bring cash for smaller beach bars', 'Arrive early in summer'],
    whereToStay: ['Alcudia', 'Santa Ponsa', 'Cala d Or'],
    practicalTips: ['Carry water', 'Use shaded beach beds', 'Book beach clubs early'],
  },
  'scenic-day-trips-soller-valldemossa-deia': {
    slug: 'scenic-day-trips-soller-valldemossa-deia',
    title: 'Scenic day trips: Soller, Valldemossa, and Deia',
    summary:
      'A realistic day-trip plan through some of Mallorca’s best-known villages, with practical advice on driving, parking, and timing.',
    heroImage:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    intro:
      'The west coast of Mallorca is where the island feels most distinct. These three villages are famous for a reason, but they work best when you keep the day simple and avoid too many stops.',
    sections: [
      {
        heading: 'Valldemossa',
        text: [
          'Valldemossa is an easy first stop for a short walk, a coffee, and time in the village lanes. It is compact and scenic, and it suits a slower pace.'
        ],
      },
      {
        heading: 'Deia',
        text: [
          'Deia is more dramatic and often quieter in the morning. It works well as a slower lunch stop or an afternoon pause before returning to Palma.'
        ],
      },
      {
        heading: 'Soller and Port de Soller',
        text: [
          'Soller is a good place to break up the day with a longer lunch or a short tram or train stop. Port de Soller adds a harbour atmosphere and works well for a final relaxed part of the route.'
        ],
      }
    ],
    checklist: ['Leave early', 'Expect narrow roads', 'Have lunch booked in high season'],
    whereToStay: ['Port de Soller', 'Deia', 'Soller'],
    practicalTips: ['Parking is limited in peak months', 'Roads are slower than they look', 'Start early to avoid traffic'],
  },
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articles[params.slug]

  if (!article) {
    return {
      title: 'Article not found',
    }
  }

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: `https://www.whattodoinmallorca.com/articles/${article.slug}`,
    },
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]

  if (!article) {
    notFound()
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px', color: '#ebf2ff' }}>
      <div style={{ marginBottom: 18 }}>
        <Link href="/" style={{ color: '#7dd3fc', textDecoration: 'underline' }}>
          ← Back to Mallorca guide
        </Link>
      </div>

      <article style={{ background: 'rgba(10, 26, 38, 0.78)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <img
          src={article.heroImage}
          alt={article.title}
          style={{ display: 'block', width: '100%', height: 360, objectFit: 'cover' }}
        />

        <div style={{ padding: '28px 24px 12px' }}>
          <p style={{ margin: '0 0 10px', color: '#8ddcf5', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Mallorca travel guide
          </p>
          <h1 style={{ margin: '0 0 14px', color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.15 }}>
            {article.title}
          </h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
            {article.summary}
          </p>
        </div>

        <div style={{ padding: '0 24px 30px' }}>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: 'rgba(255,255,255,0.92)', margin: '0 0 20px' }}>
            {article.intro}
          </p>

          {article.sections.map((section) => (
            <section key={section.heading} style={{ marginTop: 28 }}>
              <h2 style={{ margin: '0 0 14px', color: '#fff', fontSize: 'clamp(1.4rem, 2vw, 2rem)' }}>
                {section.heading}
              </h2>

              {section.image ? (
                <img
                  src={section.image}
                  alt={section.alt || section.heading}
                  style={{ width: '100%', borderRadius: 14, marginBottom: 16, objectFit: 'cover', height: 280 }}
                />
              ) : null}

              {section.text.map((paragraph) => (
                <p key={paragraph} style={{ margin: '0 0 14px', fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section style={{ marginTop: 32, paddingTop: 6 }}>
            <h2 style={{ margin: '0 0 12px', color: '#fff', fontSize: '1.6rem' }}>What to book before you go</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 1.8 }}>
              {article.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginTop: 32 }}>
            <h2 style={{ margin: '0 0 12px', color: '#fff', fontSize: '1.6rem' }}>Where to stay</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 1.8 }}>
              {article.whereToStay.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginTop: 32 }}>
            <h2 style={{ margin: '0 0 12px', color: '#fff', fontSize: '1.6rem' }}>Practical advice for holiday makers</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 1.8 }}>
              {article.practicalTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <Link href="/" style={{ display: 'inline-block', color: '#fff', textDecoration: 'underline', fontWeight: 700 }}>
              Return to the Mallorca planning page
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
