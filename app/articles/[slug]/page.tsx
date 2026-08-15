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
      'A practical 4-day Mallorca plan for a first visit, built around Palma, one beach day, one scenic mountain-village day, and one easy coastal finish that works well for real holiday makers.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Mallorca is one of the easiest Mediterranean islands to visit for a short break because it combines a compact capital city, long sandy beaches, and a dramatic mountain region in a relatively small area. The best first-timer plan is not to chase every famous stop, but to spread the trip across a city day, a beach day, a village-and-viewpoint day, and one more relaxed coastal day.',
    sections: [
      {
        heading: 'Why this route works for a first visit',
        text: [
          'Most visitors arrive in Mallorca expecting a mix of sea, food, and scenery. The island delivers that best when you keep your itinerary simple and base yourself sensibly. If you stay in Palma, you get city culture, restaurants, and easy airport access. If you add one beach base such as Alcúdia, Playa de Muro, or Cala d Or, you also get a proper holiday feel without needing to move hotels every night.',
          'The easiest first-time trip is to split the island into four clear themes: one city day, one beach day, one mountain-road day, and one final easy coastal day. That gives you enough of Mallorca without turning the trip into a long drive every time you want to eat or swim.'
        ],
        image:
          'https://images.unsplash.com/photo-1544551763-46a013bb70b5?auto=format&fit=crop&w=1200&q=80',
        alt: 'Aerial view of Mallorca coastline and sea',
      },
      {
        heading: 'Day 1: Palma old town, seafront and the evening meal',
        text: [
          'Start in Palma, where the old town is compact enough to enjoy on foot but varied enough to feel like a real city break. Spend the late morning and early afternoon around the central streets, squares and cathedral area rather than trying to do everything in one rush.',
          'The cathedral is the obvious highlight, but the best part of the first day is usually walking slowly through the old lanes and stopping for a long lunch or a coffee. Palma is a strong first-night base because it gives you good food, a walkable centre, and easy access back if you are tired after travel.',
          'In the evening, head to the seafront or a central square for dinner. A relaxed first night is more useful than a packed sightseeing day, especially if you landed earlier that morning or arrived late the night before.'
        ],
        image:
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
        alt: 'Palma old town and seafront in Mallorca',
      },
      {
        heading: 'Day 2: Beach day along the north or east coast',
        text: [
          'Mallorca is famous for its beaches, and a first trip should include a proper beach day. For most holiday makers, the easiest choices are Alcúdia or Playa de Muro on the north coast, or a resort area such as Cala d Or or Santa Ponsa on the east or south-west coast.',
          'The north coast is especially practical for a first beach day because it offers long sandy stretches, easier family logistics, and lots of places to sit, swim, or eat close to the water. Playa de Muro and Alcúdia are good for a classic Mallorca beach experience: easy access, shallow water, and no need to over-plan the day.',
          'The key is to book a beach club or parking early if you are travelling in July or August, and to keep the day simple. In summer, beaches can fill up quickly, so an early start often makes everything more pleasant.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Mallorca beach and turquoise water',
      },
      {
        heading: 'Day 3: Serra de Tramuntana villages and scenic driving',
        text: [
          'The west side of Mallorca is where the island feels most dramatic. This is the day to explore the Serra de Tramuntana, the mountain range that shapes many of the island’s best-known villages and views. A short route works better than a long checklist here, because the roads are steep, the villages are small, and parking can be awkward in high season.',
          'A good first-timer route is Palma to Valldemossa, then on to Deià, and finally to Soller or Port de Soller for lunch and a harbour stroll. Valldemossa and Deià are very different in feel: Valldemossa is compact and classic, while Deià is more atmospheric and tucked into the mountain slopes. Soller is a useful stop for an easy lunch and a break from mountain driving.',
          'The roads are scenic but not always quick. If you only want to do one scenic loop, keep it to two or three places rather than trying to visit every lookout and village in the day. This is one of the best ways to enjoy Mallorca without turning the trip into a forced road trip.'
        ],
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        alt: 'Scenic mountain roads in Mallorca',
      },
      {
        heading: 'Day 4: Harbour lunch, one last swim, and a gentle finish',
        text: [
          'Use your final day for something low-pressure. Port de Soller, Puerto Portals, or another harbour area on the west or south-west coast is ideal because it gives you a nice finish without requiring another big drive. Take a slow morning, have a beach or harbour lunch, then decide whether you want one last swim or just a walk and coffee.',
          'This is especially useful if you are leaving the island later in the day. It lets you enjoy Mallorca’s slower pace rather than rushing to the airport and losing the last afternoon. If your departure is early, simply spend the morning in Palma and enjoy one final local lunch before you leave.'
        ],
        image:
          'https://images.unsplash.com/photo-1493558103817-58b2924b5715?auto=format&fit=crop&w=1200&q=80',
        alt: 'Harbour and marina in Mallorca',
      },
      {
        heading: 'Best areas to stay for a first trip',
        text: [
          'The best base depends on what kind of holiday you want. Palma works well for a city-first trip or a short break with restaurants and heritage. Alcúdia and Playa de Muro are among the strongest choices for a classic beach holiday with long sandy beaches and easy logistics. Port de Soller and nearby west-coast villages work better if you value scenery and a slower rhythm over nightlife or resort conveniences.',
          'If you prefer a more polished beach-and-harbour holiday, Cala d Or, Santa Ponsa, or Palmanova can work very well. These areas are practical for families, couples, and groups who want a beach base without needing to drive every day.'
        ],
      },
      {
        heading: 'How to travel around Mallorca without losing time',
        text: [
          'A car gives you the most flexibility, especially if you want to visit the west coast and mountain villages. Without a car, Mallorca is still manageable, but it is easier to keep your trip centred around Palma and one resort or beach base. For anyone combining city time with a few day trips, a car often makes the difference between a smooth trip and a rushed one.',
          'Avoid trying to cram in all the famous villages in a single day. Mallorca rewards a slower rhythm, especially in the Tramuntana and in the smaller coastal towns. It is better to have one strong day trip and a relaxed beach day than to spend the holiday moving from place to place every few hours.'
        ],
      },
    ],
    checklist: [
      'Stay in Palma for one or two nights if you want a city break and easy airport access, or choose a beach base such as Alcúdia or Cala d Or for a more classic holiday.',
      'Keep one full day for beach time and one full day for the mountain villages; this gives you the best balance of Mallorca’s biggest strengths.',
      'Book your beach club, dinner reservation, or car rental early if you are visiting during the summer peak.',
      'Plan for narrow roads and limited parking in the west coast villages, especially around Valldemossa, Deià, and Soller.',
      'If you are traveling with children, base yourselves near a calm beach and avoid a very busy day trip schedule.'
    ],
    whereToStay: [
      'Palma for a city base with restaurants, heritage, and easy day-to-day walking.',
      'Alcúdia or Playa de Muro for long sandy beaches and a classic family-friendly holiday feel.',
      'Port de Soller or a west-coast village if you want mountain scenery, a slower pace, and a more local atmosphere.',
      'Cala d Or or Santa Ponsa if you want a convenient beach-and-harbour base with a wider range of restaurants and tourist services.'
    ],
    practicalTips: [
      'May, June, September, and early October are often the most comfortable months for a first trip, with warm weather but less peak-season intensity.',
      'Summer heat can build quickly in the mountain villages, so leave early and carry water if you plan to explore by car or on foot.',
      'Keep a simple lunch plan for west-coast days, because good options can be limited if you arrive too late or during midday peaks.',
      'For a more local experience, mix tourist beach days with small neighbourhood restaurants in Palma or along the coast rather than only choosing resort dining.',
      'If you are only staying four days, do not try to see the entire island in one move. Mallorca is easiest to appreciate when you build in a slower rhythm.'
    ],
  },
  'best-area-to-stay-in-mallorca': {
    slug: 'best-area-to-stay-in-mallorca',
    title: 'Best area to stay in Mallorca for first-time visitors',
    summary:
      'A practical guide to choosing where to stay in Mallorca, including the best areas for beaches, families, couples, nightlife, and low-stress first-time trips.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'The best area to stay in Mallorca depends on what kind of holiday you want. Mallorca is not one single type of destination: some travellers want a sandy beach resort, others want a walkable city, and many prefer the quiet villages and mountain scenery of the west coast. The right base can make a big difference to how easy and enjoyable the trip feels.',
    sections: [
      {
        heading: 'The first decision: beach holiday or city break?',
        text: [
          'A lot of first-time visitors choose their Mallorca base based on whether they want beach time or cultural sightseeing. If your priority is sea, sand, and easy swimming, the north and east coasts are usually the simplest choice. If your priority is restaurants, historic streets, and a compact city base, Palma is the strongest option.',
          'That decision matters because the island feels very different depending on where you stay. A resort-style base can feel relaxed and practical, while a small village base can feel slower and more atmospheric, but less convenient for night life or daily errands.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Beach holiday in Mallorca',
      },
      {
        heading: 'Palma: best for culture, food and easy city access',
        text: [
          'Palma is the best area for travellers who want a city break with a strong food scene, historic architecture, and easy airport access. It works especially well for couples, short stays, and visitors who do not want to hire a car for the whole trip.',
          'Palma is also a good base if you want to mix beach time with a bit of urban exploring. You can spend a morning in the old town, have lunch in a local restaurant, and then head to a nearby beach in the afternoon. It is not the easiest area for a classic resort-style holiday, but it is one of the most practical bases for a flexible first trip.'
        ],
        image:
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
        alt: 'Palma city and cathedral area',
      },
      {
        heading: 'Alcúdia and Playa de Muro: best for families and classic beach days',
        text: [
          'If you are travelling with children or want a straightforward beach holiday, Alcúdia and Playa de Muro are among the strongest choices. They offer long sandy beaches, easy access to restaurants, and a relaxed family-friendly atmosphere.',
          'This is one of the easiest areas to plan a low-stress trip around because you can stay close to the beach and not spend every day in the car. The north coast also tends to feel a little less intense than the busiest west-coast resort zones during peak summer.'
        ],
        image:
          'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
        alt: 'Sandy beach in Mallorca',
      },
      {
        heading: 'Cala d Or, Santa Ponsa and Palmanova: best for resort convenience',
        text: [
          'For holiday makers who want a settled beach base with plenty of restaurants, shops, and straightforward logistics, Cala d Or, Santa Ponsa and Palmanova are all very practical. These areas suit families, couples, and mixed groups who prefer fewer transfers and a more polished resort feel.',
          'They are particularly good for travellers who want to spend much of the trip by the sea without constantly moving around the island. If your plan is to swim, relax, and have dinner nearby, this kind of base often makes the holiday feel simpler and less tiring.'
        ],
        image:
          'https://images.unsplash.com/photo-1493558103817-58b2924b5715?auto=format&fit=crop&w=1200&q=80',
        alt: 'Harbour and beach resort area in Mallorca',
      },
      {
        heading: 'Port de Soller and the west coast: best for scenery and a slower rhythm',
        text: [
          'The west coast of Mallorca is ideal if you want scenic drives, mountain views, and a more atmospheric holiday. Port de Soller is one of the best bases for this kind of trip because it combines harbour charm, easy access to the Tramuntana, and a slower pace.',
          'This style of stay suits couples and travellers who enjoy strolling, day trips, and scenic lunch stops. It is less convenient if you want a big resort, nightlife, or very easy beach access every day, but it is excellent for a more memorable and quieter Mallorca holiday.'
        ],
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
        alt: 'Mallorca west coast and Tramuntana scenery',
      },
      {
        heading: 'What is best without a car?',
        text: [
          'Without a car, Palma is the easiest option by far. It is walkable, well served by public transport, and close to restaurants, beaches, and day-trip options. If you want to stay outside Palma but avoid hiring a car, look for a resort area with restaurants and good local access, such as Palmanova or a beach zone close to a bus route.',
          'A car makes a huge difference for the west coast, mountain villages, and the best scenic routes. Without one, you should aim for a simpler trip and avoid planning too many day trips in different directions.'
        ],
      },
      {
        heading: 'Best area by traveller type',
        text: [
          'For families: Alcúdia, Playa de Muro, Santa Ponsa, and Cala d Or are all practical choices because they combine beaches, restaurants, and easy logistics.',
          'For couples: Palma, Port de Soller, and more scenic west-coast villages work beautifully if you want restaurants, walks, and a more romantic atmosphere.',
          'For first-time visitors: Palma plus one beach base is usually the easiest and most balanced option if you have just a few days.',
          'For a quieter stay: Deia, Valldemossa, or a smaller west-coast village offer a more relaxed feel, although they are less convenient for daily beach access.'
        ],
      },
    ],
    checklist: [
      'Choose Palma if you want a walkable city break and easier access to restaurants without a car.',
      'Choose Alcúdia or Playa de Muro if your main priority is a beach holiday with children or a simple family base.',
      'Choose Port de Soller or the west coast if you want scenery, slower days, and mountain-village exploration.',
      'Choose Cala d Or or Santa Ponsa if you want a resort-style beach base with straightforward dining and swimming logistics.',
      'If you are staying only a few days, avoid moving hotels and keep your base simple.'
    ],
    whereToStay: [
      'Palma for culture, food, and easy city living.',
      'Alcúdia or Playa de Muro for family beaches and low-stress coastal days.',
      'Port de Soller for scenic mountain-town vibes and slower travel.',
      'Cala d Or or Santa Ponsa for a resort-style beach holiday with a range of dining and services.'
    ],
    practicalTips: [
      'May, June, September and early October are often easier for comfortable weather and fewer crowds than peak July and August.',
      'A car is the most useful if you plan to explore the west coast or the Serra de Tramuntana.',
      'Remember that parking can be difficult in the most scenic villages, especially in high season.',
      'For a first trip, a simple two-base plan often feels better than trying to move hotels every few nights.',
      'Book your accommodation early if you are visiting in summer and want a beach property or a good villa close to the sea.'
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
