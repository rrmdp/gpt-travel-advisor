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
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
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
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
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
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
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
  'best-time-to-visit-mallorca': {
    slug: 'best-time-to-visit-mallorca',
    title: 'Best time to visit Mallorca',
    summary:
      'A practical guide to the best months to visit Mallorca, including warm-weather advice, crowd levels, beach conditions, and the easiest time for families, couples, and first-time visitors.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Mallorca works well across much of the year, but the best time to visit depends on what kind of holiday you want. Some travellers want hot beach days and long swims, while others prefer easier sightseeing, lower hotel prices, and less crowded villages and beaches.',
    sections: [
      {
        heading: 'Best months for beach weather and easy holiday planning',
        text: [
          'For most holiday makers, the sweet spot is late May, June, September, and early October. The weather is usually warm enough for swimming and outdoor days, but the island is usually less intense than the peak-summer months. This is the time when beaches, restaurants, and scenic drives tend to feel more manageable.',
          'July and August are the hottest and busiest months. They are ideal if you want the fullest beach holiday experience and do not mind busy centres, higher prices, and more crowded coastal spots. If you plan to travel then, book early and keep your days simple.'
        ],
        image:
          'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
        alt: 'Beach weather and summer conditions in Mallorca',
      },
      {
        heading: 'Spring: best for walking, villages and city breaks',
        text: [
          'April, May and early June are excellent if you prefer sunny conditions without the full intensity of peak summer. This is a very good period for Palma, historic streets, village walks, and scenic drives. It also suits people who want to travel without fighting for beach loungers or restaurant tables.',
          'Sea temperatures are still not at their warmest in spring, but the island is very pleasant for exploring and for shorter, more comfortable sightseeing days.'
        ],
      },
      {
        heading: 'Summer: best for full beach holidays and families',
        text: [
          'From mid-June to late August, Mallorca is at its classic holiday mode. Beaches are busy, waters are warm, and resort areas feel lively. This is often the easiest time for families who want a conventional beach trip with lots of swimming, boat days, and easy dining nearby.',
          'The downside is heat, crowds and higher prices. If you visit in summer, start early, book restaurants in advance, and keep your schedule flexible on the hottest afternoons.'
        ],
      },
      {
        heading: 'Autumn: best all-round balance for many travellers',
        text: [
          'September and early October are often the best months for a well-balanced Mallorca trip. The sea is still warm, the weather is usually very good, and the island feels less crowded than July and August. It is one of the easiest choices for couples, families and first-time visitors who want beaches and scenery without the peak-season rush.',
          'This is also a strong period for hiking, day trips, and slower travel because it is easier to enjoy village walks and coastal drives without the busiest conditions.'
        ],
      },
      {
        heading: 'Winter: best for quieter stays and city breaks',
        text: [
          'Mallorca is not a classic winter-sun destination in the same way as some other Mediterranean islands, but it can still be a very pleasant place to visit outside peak season. December to February is quieter and often more relaxed, which works well for people who want a calmer city break or a slower coastal stay.',
          'The weather is usually mild rather than hot, and many travellers use this as a time to explore Palma, take local walks, and enjoy a more relaxed pace without the summer crowds.'
        ],
      },
    ],
    checklist: [
      'Choose late May to early June for warm weather, lower crowd levels, and a comfortable first trip.',
      'Choose September or early October for the best mix of beach weather and fewer peak-season pressures.',
      'Choose July or August if you want the fullest beach holiday and do not mind busier resort areas.',
      'Choose winter if you prefer quieter streets, lower prices, and a more relaxed pace over hot-weather beach time.',
    ],
    whereToStay: [
      'Palma for city walks, restaurants and shorter day trips in spring or autumn.',
      'Alcudia or Playa de Muro for long beach days in summer.',
      'Port de Soller or west-coast villages for slower scenery in shoulder season.',
      'Cala d Or or Santa Ponsa for a classic family holiday in the warmest months.',
    ],
    practicalTips: [
      'Book ahead if you are visiting in July and August, especially for beach clubs, villa stays and restaurants near the coast.',
      'For the easiest holiday rhythm, aim for shoulder season if you want beaches without peak-summer intensity.',
      'Check the sea temperature and wind conditions before planning boat trips or swimming-heavy days.',
      'In any month, keep one flexible day in case the weather changes or the beaches become too crowded.',
    ],
  },
  'best-beaches-in-mallorca': {
    slug: 'best-beaches-in-mallorca',
    title: 'Best beaches in Mallorca',
    summary:
      'A practical guide to Mallorca’s best beaches, from long family-friendly sands to quiet coves, with advice on where to go by trip style and travel season.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Mallorca is known for having a wide range of beaches, from huge sandy stretches to small coves with clear water and a much quieter feel. The best beach for you depends on whether you want a full family beach day, a romantic cove, or a resort area with easy food and facilities nearby.',
    sections: [
      {
        heading: 'The best beaches for easy family holidays',
        text: [
          'Playa de Muro and Alcúdia beach are two of the strongest choices for families. They offer long stretches of sand, easier swimming, and lots of nearby services. These are often the simplest beach bases if you want to spend time by the water without needing to move around too much during the day.',
          'For families with children, a beach with shallow water, shade, and quick access to restaurants is usually more useful than a more scenic but harder-to-reach cove.'
        ],
        image:
          'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
        alt: 'Long sandy beaches in Mallorca',
      },
      {
        heading: 'The best beaches for couples and relaxed swimming',
        text: [
          'If you prefer a quieter beach feel, look toward small coves along the west or north coast. These beaches are less dramatic in size but often feel more atmospheric and peaceful. They work well for couples, slow afternoons, and people who want a more relaxed swimming day rather than a busy resort-style beach scene.',
          'In many cases, the most enjoyable beaches are the ones where you can arrive early, settle in, and spend the day without feeling like you need to leave as soon as the sun gets intense.'
        ],
      },
      {
        heading: 'The best beach areas by travel style',
        text: [
          'For a classic beach holiday: Alcúdia, Playa de Muro, Santa Ponsa, and Cala d Or are among the most practical bases.',
          'For a quieter, less resort-style trip: smaller coves and west-coast beaches around the Tramuntana area can be much more peaceful.',
          'For a family-first plan: choose beaches with easy parking, toilet access, and lots of nearby food options.'
        ],
      },
      {
        heading: 'Beaches to consider for first-time visitors',
        text: [
          'A first trip to Mallorca usually works best if you choose one large sandy beach and one quieter cove or harbour area. This gives you both the classic holiday feeling and a more scenic side of the island. A day on a wide beach gives you the full Mallorca experience, while a smaller cove often feels more memorable and less crowded.',
          'The better approach is not to chase every famous beach in one week, but to choose two or three that suit your travel style and fit the area where you are staying.'
        ],
      },
    ],
    checklist: [
      'Choose a wide sandy beach if you want a classic holiday with easy swimming and family logistics.',
      'Choose a smaller cove if you want a quieter day and a more relaxed pace.',
      'Get there early in the summer if you want shade, parking, and a calmer beach experience.',
      'Check the wind and sea conditions before booking beach clubs or boat trips.',
    ],
    whereToStay: [
      'Alcúdia or Playa de Muro for long sandy stretches and family-friendly beaches.',
      'Cala d Or or Santa Ponsa for a resort-style beach holiday with easy services.',
      'West-coast or smaller cove areas for quieter swimming and a slower atmosphere.',
    ],
    practicalTips: [
      'Carry water and sunscreen, especially during the hottest summer months.',
      'The busiest beach periods are usually midday and July or August weekends.',
      'For the easiest beach days, stay in a location with restaurant access close to the shore.',
      'If you want a calmer day, plan beach time early or later in the afternoon rather than midday.',
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
  'south-west-mallorca-short-term-rentals': {
    slug: 'south-west-mallorca-short-term-rentals',
    title: 'South West Mallorca short-term rentals guide',
    summary:
      'A practical guide to finding and booking short-term rentals in south-west Mallorca, including Santa Ponsa, Palmanova, Magaluf, Port d\'Andratx, and Puerto Portals for families, couples, and groups.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'The south-west coast of Mallorca is one of the most popular areas for short-term rentals because it combines accessible beaches, busy marina areas, and practical logistics for travellers who want flexibility and independence. Whether you are looking for a beachfront apartment, a villa with a pool, or a family-friendly townhouse, the south-west offers a wide range of rental options at different price points and with varying levels of resort facilities.',
    sections: [
      {
        heading: 'Why short-term rentals work well in south-west Mallorca',
        text: [
          'Short-term rentals are especially popular in the south-west because the region is designed for tourism and holiday accommodation. Areas like Santa Ponsa, Palmanova, and Puerto Portals have abundant apartment blocks, villa communities, and townhouses that accept weekly or monthly bookings. This means you have more choice than you might find in quieter regions, and you can often find properties with specific amenities such as pools, sea views, or close beach access.',
          'Renting a property in the south-west also gives you independence from hotel schedules and the ability to self-cater or have more flexible dining options. For families, groups, or longer stays, this often works out as better value than hotels, and it gives you more control over your holiday rhythm.'
        ],
        image:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        alt: 'Modern apartment building in coastal Mallorca',
      },
      {
        heading: 'Santa Ponsa: family-friendly rentals and long beaches',
        text: [
          'Santa Ponsa is one of the most established resort areas on the south-west coast, with a wide range of rental properties from simple apartments to larger villas. The area suits families because it has calm, sandy beaches, a good selection of restaurants and shops within walking distance, and properties that often include pool access.',
          'Short-term rentals in Santa Ponsa tend to be moderately priced compared to more upscale areas, and many are suitable for families who want convenience without paying premium prices. The main beach is busy in summer, but the area remains practical for a straightforward coastal holiday.'
        ],
        image:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        alt: 'Santa Ponsa beach and resort area',
      },
      {
        heading: 'Palmanova and Magaluf: compact beachfront rentals',
        text: [
          'Palmanova and Magaluf are compact, walkable resort areas with many short-term rental options close to the beach. Palmanova is slightly quieter and more family-focused, while Magaluf has a more energetic nightlife scene. Both areas work well for travellers who want beachfront or near-beach properties with easy access to restaurants, bars, and water activities.',
          'Rentals in these areas are often located in apartment blocks with shared facilities such as pools or communal gardens. They are ideal if you want a simple, convenient base and do not need the exclusivity or space of a standalone villa. Walkability is a major advantage here, especially if you do not want to hire a car.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Beach and resort apartments in Palmanova',
      },
      {
        heading: 'Port d\'Andratx and Camp de Mar: upscale villa rentals',
        text: [
          'Port d\'Andratx and Camp de Mar are more upscale locations on the south-west coast, known for stylish villas, waterfront properties, and a more premium holiday atmosphere. Short-term rentals here tend to be larger, more expensive, and often include private pools, sea views, and higher-end finishes.',
          'These areas suit couples and groups who prioritize quality, privacy, and scenic surroundings over budget or walkable convenience. Many villas are set back from the main beach areas but offer greater seclusion and are ideal for longer stays where you want a more exclusive experience.'
        ],
        image:
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
        alt: 'Luxury villa and marina in Port d\'Andratx',
      },
      {
        heading: 'Puerto Portals and Portals Nous: marina-side rentals',
        text: [
          'Puerto Portals (also known as Puerto Portals or Portals Nous) is a stylish marina village close to Palma, with upscale restaurants, yacht clubs, and high-end rental properties. Short-term rentals here often come with marina views, waterfront dining access, and a cosmopolitan atmosphere.',
          'This area is especially popular with couples and affluent groups who enjoy the mix of seafood, yacht culture, and easy access to Palma. Rentals tend to be premium-priced, but the location offers excellent convenience and a lively evening scene with good restaurants and beach clubs.'
        ],
        image:
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Puerto Portals marina and upscale dining',
      },
      {
        heading: 'What to look for in a south-west Mallorca short-term rental',
        text: [
          'When booking a short-term rental in the south-west, consider distance to the beach, parking availability, and whether the property includes air conditioning (essential for summer). Many properties advertise pool access, but confirm whether that is a private pool, a shared complex pool, or just nearby pool access.',
          'Check the property description for Wi-Fi, washing facilities, and kitchen equipment if you plan to self-cater. For families, ground-floor properties or those with direct beach access are often more convenient. For couples or groups, verify the number and type of beds, and read recent reviews to understand the property condition and neighbourhood atmosphere.'
        ],
      },
      {
        heading: 'Booking platforms and rental seasons',
        text: [
          'The main platforms for south-west Mallorca rentals are Airbnb, Booking.com, Vrbo, and holiday-specific sites such as VillasMediterranean. Many properties also have their own websites or can be booked through local property management companies.',
          'Peak season is June through September, with July and August being the most expensive and busiest. If you are flexible with dates, May, June, and September often offer better value and fewer crowds. Many properties require minimum stays of a week in summer, but off-season bookings (November to April) may be more flexible.'
        ],
      },
      {
        heading: 'Car hire and getting around from your rental',
        text: [
          'Many short-term rentals in the south-west do not require a car if you want to stay close to your property and use local beaches and restaurants. However, a car gives you much more freedom to explore other parts of the island and to escape the busier resort areas when you want.',
          'If your rental includes off-street parking, that simplifies car hire significantly. If parking is street-only or uncertain, ask the property manager before booking. During summer peak season, parking can be difficult in the busiest resort areas, so this is worth clarifying in advance.'
        ],
      },
      {
        heading: 'Holiday Villas in the South West of Mallorca',
        text: [
          'For travellers looking for premium villa properties in the south-west, Holiday Villas offer a curated selection of high-quality short-term rental villas across Santa Ponsa, Port d\'Andratx, Puerto Portals, and other sought-after locations. Their collection includes properties with private pools, sea views, and exclusive amenities tailored for families, couples, and groups seeking a luxurious Mallorca experience.',
          'Holiday Villas specializes in vetted properties that meet high standards for comfort and service, making it easier to find the right villa for your south-west Mallorca stay without spending hours comparing listings on multiple platforms.'
        ],
      },
    ],
    checklist: [
      'Confirm the exact location and distance to the beach or sea access before booking.',
      'Check whether the property has air conditioning and whether it is included in the rental price or charged separately.',
      'Verify pool access (private, shared, or communal) and any associated rules or times of use.',
      'Confirm parking arrangements and whether parking is included in the rental cost.',
      'Read recent guest reviews and check the cancellation policy before committing.',
      'Ask about Wi-Fi, washing machine, dryer, and kitchen equipment if these matter for your stay.'
    ],
    whereToStay: [
      'Santa Ponsa for family-friendly rentals with good value and long sandy beaches.',
      'Palmanova for walkable, beachfront apartments and a quieter resort atmosphere.',
      'Magaluf for compact rentals with easy beach access and a lively evening scene.',
      'Port d\'Andratx for upscale villas and a more exclusive, scenic experience.',
      'Puerto Portals for marina-side rentals and high-end dining and beach clubs.'
    ],
    practicalTips: [
      'Book early if you are visiting during July or August; availability drops quickly and prices rise.',
      'May, June, and September offer better value and fewer crowds while still having good beach weather.',
      'Consider staying for a minimum of 3-4 nights to avoid splitting the booking fees and cleaning costs.',
      'Many properties have strict check-in times; plan your arrival accordingly to avoid early fees.',
      'Request cleaning service details if the property has a weekly or mid-stay cleaning option.',
      'Ask for a detailed damage deposit policy and photo documentation of the property condition at check-in.',
      'Join local expat or holiday-maker Facebook groups to get recommendations and insider tips from recent visitors.'
    ],
  },
  'santa-ponsa-mallorca': {
    slug: 'santa-ponsa-mallorca',
    title: 'Santa Ponsa Mallorca: family-friendly beach destination',
    summary:
      'A practical guide to Santa Ponsa, one of the most established and family-friendly resort areas on the south-west coast, with long sandy beaches, good restaurants, and convenient short-term rentals.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Santa Ponsa is one of the most popular and practical beach destinations on the south-west coast of Mallorca. It combines long, calm sandy beaches with a well-developed resort infrastructure, making it ideal for families, couples, and groups who want a straightforward beach holiday without needing to explore remote areas.',
    sections: [
      {
        heading: 'Why Santa Ponsa works for a beach holiday',
        text: [
          'Santa Ponsa is one of the oldest and best-established resort areas on the south-west coast. The main beach is long, sandy, and gently sloping, which makes it safe for children and comfortable for relaxation. The area has a full range of water sports, beach clubs, and rental equipment, so a beach day here does not require extensive planning.',
          'The town centre is walkable and has good shops, restaurants, and local services. This means you can stay self-catering in an apartment and still have easy access to dining, supplies, and activities without needing a car for every errand.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Santa Ponsa main beach and calm waters',
      },
      {
        heading: 'Short-term rentals in Santa Ponsa',
        text: [
          'Santa Ponsa has a wide range of short-term rental properties, from simple beachfront apartments to larger family villas with pools. Many rental properties are located in apartment complexes with shared facilities such as pools, gardens, and parking. Prices tend to be moderate compared to more upscale areas like Puerto Portals or Port d\'Andratx.',
          'Most rentals in Santa Ponsa are on or near the beach, so proximity to swimming and water activities is rarely a concern. For families booking a week or more, the area offers good value and consistent quality across a range of budget levels.'
        ],
        image:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        alt: 'Modern apartment complex in Santa Ponsa',
      },
      {
        heading: 'Beaches and water activities',
        text: [
          'The main Santa Ponsa beach is about 1.5 km long and is lined with sunbed rentals, water sports operators, and beach clubs. During summer, the beach fills up by mid-morning, so an early start is recommended if you want prime sun-bed positions. The water is usually calm and clear, making it ideal for swimming and snorkeling.',
          'Water sports available include jet skis, paddleboards, kayaking, and parasailing. Several beach clubs serve lunch and drinks directly on the sand, so you can order food without leaving your lounger.'
        ],
      },
      {
        heading: 'Restaurants and dining',
        text: [
          'Santa Ponsa has a good mix of beachfront restaurants and cafés that range from casual to mid-range pricing. Most beach clubs serve fish, paella, and Mediterranean fare during the day. In the town centre, you will find a wider range of cuisines including international restaurants, pizzerias, and tapas bars.',
          'For evening dining, beachfront restaurants offer sunset views and are popular for romantic dinners. During peak summer, booking ahead is advisable if you want to dine at the most popular spots.'
        ],
      },
      {
        heading: 'Getting around Santa Ponsa',
        text: [
          'Santa Ponsa is compact and walkable, so you can easily reach the beach, shops, and restaurants on foot. If you want to explore other parts of the south-west coast or visit the Serra de Tramuntana, a car rental is useful but not essential for staying within Santa Ponsa.',
          'Public buses connect Santa Ponsa to Palma and other resort areas, so you can take a day trip without a car if you plan ahead. Parking in Santa Ponsa is generally straightforward, with both street parking and paid car parks near the beach and town centre.'
        ],
      },
      {
        heading: 'Best time to visit Santa Ponsa',
        text: [
          'May, June, September, and early October are ideal for visiting Santa Ponsa. The weather is warm, the sea is swimmable, and the beach is less crowded than in July and August. During peak summer, the beach can be very busy and restaurant tables hard to find.',
          'If you prefer a quieter experience but still want good beach weather, avoid July and August and visit in May or September instead.'
        ],
      },
    ],
    checklist: [
      'Book your beach club or water sports activity in advance during summer.',
      'Bring sun protection and plan for mid-day shade during July and August.',
      'Book restaurants ahead if you want to dine at popular beachfront spots in peak season.',
      'Confirm your apartment has air conditioning, especially if visiting in summer.',
      'Check whether your rental includes beach towels and sun beds or if you need to rent them separately.'
    ],
    whereToStay: [
      'Beachfront apartments for direct beach access and sea views.',
      'Town-centre apartments for walkable access to restaurants and shops.',
      'Family villas with private pools for more space and privacy.',
      'Resort-style hotels with shared facilities for convenience and service.'
    ],
    practicalTips: [
      'The main beach fills up by mid-morning in summer; arrive early for best sun-bed spots.',
      'Many apartments require a one-week minimum stay in summer; negotiate for shorter stays in shoulder seasons.',
      'Parking near the beach is metered during summer; check signage or use paid car parks.',
      'The water is warmest in August and September; June and May are cooler but pleasant.',
      'Consider renting a parasol or beach club lounger to avoid bringing your own shade.'
    ],
  },
  'palmanova-magaluf-mallorca': {
    slug: 'palmanova-magaluf-mallorca',
    title: 'Palmanova and Magaluf Mallorca: compact resort beaches',
    summary:
      'A guide to Palmanova and Magaluf, two walkable beach resort areas on the south-west coast known for compact centres, beachfront apartments, and lively evening scenes.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Palmanova and Magaluf are neighbouring compact resort towns on the south-west coast. Palmanova is quieter and more family-focused, while Magaluf has a more energetic nightlife scene. Both are ideal for travellers who want walkable beach access, easy restaurant options, and straightforward logistics without needing a car.',
    sections: [
      {
        heading: 'Palmanova: family-friendly and quieter',
        text: [
          'Palmanova is a small, well-organised resort town with a crescent-shaped beach that is protected and calm. The town centre is entirely walkable, with restaurants, shops, and services all within a short stroll of the beach. Palmanova suits families and couples who want convenience without the intensity of busier resort areas.',
          'The main beach is sandy, clean, and gently sloping, making it ideal for children. The town is compact enough that you can go from your apartment to the beach in under 5 minutes on foot.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Palmanova crescent beach and calm waters',
      },
      {
        heading: 'Magaluf: lively nightlife and water sports',
        text: [
          'Magaluf is next to Palmanova but larger and more energetic. It is known for a wide range of water sports, beach clubs, and a lively evening scene with bars and clubs. If you want beach days combined with an active nightlife, Magaluf is a stronger choice than Palmanova.',
          'Magaluf also has more beachfront development, with a full range of water activities including banana boats, jet skis, and diving schools. The town is busier and noisier than Palmanova, especially in the evening and at night.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Magaluf main beach and resort development',
      },
      {
        heading: 'Short-term rentals in Palmanova and Magaluf',
        text: [
          'Both areas have many short-term rental apartments, most located in multi-storey apartment blocks with shared pools, common areas, and parking. Rentals are typically smaller and more affordable than standalone villas in other areas. Many have direct beach access or are only a few minutes walk from the shore.',
          'Because both towns are compact, being slightly back from the beach is less of a concern here than in larger resort areas. You can still reach the beach in a short walk from any rental.'
        ],
        image:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        alt: 'Apartment buildings in Palmanova resort area',
      },
      {
        heading: 'Dining and entertainment',
        text: [
          'Both towns have a good range of restaurants and cafés, from casual beachfront eateries to more formal dining. Palmanova tends to have more family-oriented restaurants, while Magaluf has more international options and beach clubs with DJs and evening entertainment.',
          'Magaluf is particularly known for beach clubs and evening bars along the seafront. If nightlife is a priority, Magaluf offers more options than Palmanova.'
        ],
      },
      {
        heading: 'Walkability and logistics',
        text: [
          'The main advantage of both Palmanova and Magaluf is their compact size. Everything is within walking distance, so a car is optional rather than essential. This makes both towns ideal for travellers who prefer not to hire a car or who want to avoid driving on unfamiliar roads.',
          'Public buses connect both towns to Palma and other nearby areas, so day trips are possible without a car. However, distances to other south-west destinations like Santa Ponsa or Port d\'Andratx require either a car or a longer bus journey.'
        ],
      },
    ],
    checklist: [
      'Choose Palmanova if you prefer a quieter, family-focused atmosphere.',
      'Choose Magaluf if nightlife and water sports are priorities.',
      'Book water sports or beach clubs in advance if visiting during peak summer.',
      'Confirm your apartment includes air conditioning and parking.',
      'Note that apartment buildings can be tall and tightly packed; request a higher floor or sea view if these matter to you.'
    ],
    whereToStay: [
      'Beachfront or near-beach apartments for walkable access to the shore.',
      'Apartments with shared pools and communal areas for added facilities.',
      'Town-centre apartments for proximity to restaurants and shops.',
      'Quieter residential apartments slightly back from the beach if you prefer a calmer setting.'
    ],
    practicalTips: [
      'Both towns are very compact; a car is not necessary if you plan to stay within the town.',
      'The beaches fill up early in summer; aim for a morning or late-afternoon swim to avoid crowds.',
      'Palmanova is better for families; Magaluf is livelier for young adults and groups.',
      'Many restaurants close between 3 and 7 PM during shoulder seasons; plan your siesta time accordingly.',
      'Book restaurants in advance during peak summer if you want specific dining times.'
    ],
  },
  'port-andratx-camp-de-mar-mallorca': {
    slug: 'port-andratx-camp-de-mar-mallorca',
    title: 'Port d\'Andratx and Camp de Mar: upscale coastal villages',
    summary:
      'A guide to Port d\'Andratx and Camp de Mar, premium destinations on the south-west coast known for luxury villas, scenic surroundings, and exclusive upscale dining.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Port d\'Andratx and Camp de Mar are neighbouring upscale coastal villages on the south-west coast. Both are known for scenic beauty, luxury villa rentals, and a more polished, quieter atmosphere than the busier resort areas. They appeal to travellers who value exclusivity, natural surroundings, and premium dining.',
    sections: [
      {
        heading: 'Port d\'Andratx: scenic harbour village',
        text: [
          'Port d\'Andratx is a charming small harbour town built around a protected cove. The main village is compact, with waterfront restaurants, boutique shops, and a marina full of private boats. The scenery is dramatic, with steep hillsides coming down to the water, making it one of the most visually striking locations on the south-west coast.',
          'Unlike larger resort areas, Port d\'Andratx does not have a main beach; instead, it has small rocky coves and areas with sun beds on platforms. The focus here is on harbour walks, waterfront dining, and scenic beauty rather than on a classic sand-and-sea beach day.'
        ],
        image:
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Port d\'Andratx harbour and waterfront',
      },
      {
        heading: 'Camp de Mar: exclusive cove and village',
        text: [
          'Camp de Mar is a very exclusive, small settlement centred around a beautiful cove with a small beach and a historic watchtower. The village is even more remote and exclusive than Port d\'Andratx, with limited commercial development and a more private feel. Most accommodation is high-end villa rentals rather than apartment blocks.',
          'Camp de Mar is ideal for travellers seeking seclusion, privacy, and a more authentic small-village atmosphere. The main activities are swimming, walking, and dining at the small number of local restaurants.'
        ],
        image:
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
        alt: 'Camp de Mar exclusive cove and beach',
      },
      {
        heading: 'Villa rentals and accommodation',
        text: [
          'Both Port d\'Andratx and Camp de Mar are known for luxury villa rentals rather than apartment blocks. Properties typically feature private pools, sea views, and high-end finishes. Rental prices are higher than in the busier resort areas, but the exclusivity and privacy justify the cost for many travellers.',
          'Many villas are set back from the main villages, offering privacy while still providing easy access to village restaurants and shops. For couples or groups seeking a premium experience, the villa rental options here are among the best in Mallorca.'
        ],
        image:
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
        alt: 'Luxury villa with pool and sea views',
      },
      {
        heading: 'Dining and local character',
        text: [
          'Port d\'Andratx has several excellent waterfront restaurants known for fresh fish and Mediterranean cuisine. The harbour setting makes evening dining particularly atmospheric. During summer, booking ahead is essential if you want a good table with a sea view.',
          'Camp de Mar has fewer restaurant options but those available tend to be high-quality. The small size of the village means you are never far from dining, but the range is more limited than in larger resort areas.'
        ],
      },
      {
        heading: 'Scenic walks and activities',
        text: [
          'Both villages are excellent bases for scenic coastal walks. The hills around Port d\'Andratx offer hiking trails with views down to the water and across to surrounding coves. Camp de Mar is smaller but equally scenic, with walks along the cliffs and down to quieter neighbouring coves.',
          'If you enjoy hiking, scenic photography, and exploring small villages, these areas offer much more appeal than the larger resort beaches. Swimming is possible at designated coves, but this is not a beach-focused destination.'
        ],
      },
    ],
    checklist: [
      'Book villa rentals well in advance; availability is limited.',
      'Confirm your villa has the amenities you need (private pool, sea view, garden, etc.).',
      'Book restaurants in Port d\'Andratx ahead of time if you want a specific waterfront table.',
      'Plan for a car; both villages are remote and not easily accessible by public transport.',
      'Bring comfortable walking shoes if you plan to explore the coastal paths.'
    ],
    whereToStay: [
      'Luxury villas with private pools and sea views in Port d\'Andratx.',
      'Exclusive villas in Camp de Mar for the most private setting.',
      'Waterfront properties in Port d\'Andratx for harbour views and easy restaurant access.',
      'Hillside villas overlooking the coast for scenic views and seclusion.'
    ],
    practicalTips: [
      'A car is essential; public transport is limited.',
      'The area is quieter and less touristy than larger resorts; plan accordingly if you want nightlife or shopping.',
      'Hiking and walking are strong activities here; bring appropriate footwear.',
      'The waterfront restaurants are excellent but pricey; book ahead.',
      'Consider visiting in May or June for fewer crowds and pleasant weather without peak summer heat.'
    ],
  },
  'puerto-portals-portals-nous-mallorca': {
    slug: 'puerto-portals-portals-nous-mallorca',
    title: 'Puerto Portals and Portals Nous: upscale marina village',
    summary:
      'A guide to Puerto Portals, an exclusive marina village close to Palma known for yacht culture, high-end dining, luxury beach clubs, and premium short-term rentals.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Puerto Portals (also known as Portals Nous or Puerto Portals) is an upscale marina village located between Palma and the main resort areas of the south-west coast. It is known for its yacht marina, luxury beach clubs, high-end restaurants, and exclusive boutique shopping. Puerto Portals attracts affluent travellers and yacht enthusiasts who value style and cosmopolitan atmosphere.',
    sections: [
      {
        heading: 'The Puerto Portals experience: yachts and beach clubs',
        text: [
          'Puerto Portals is built around a working yacht marina where luxury sailing boats are moored. The waterfront is lined with restaurants, beach clubs, and designer shops, creating a sophisticated, Mediterranean atmosphere. The area attracts a more cosmopolitan crowd than typical beach resort towns.',
          'The main beach is small and exclusive, with private beach clubs where guests can rent sunbeds, order food, and enjoy premium service. This is not a traditional public beach but rather a curated experience designed for affluent visitors.'
        ],
        image:
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Puerto Portals marina and yacht boats',
      },
      {
        heading: 'Premium villa and apartment rentals',
        text: [
          'Rentals in Puerto Portals are predominantly high-end apartments and villas with sea views, private terraces, and access to exclusive facilities. Many properties overlook the marina or the small beach. Prices are at the premium end of the Mallorca rental market, but the quality and location justify the cost.',
          'Unlike the apartment blocks of busier resort areas, Puerto Portals rentals tend to be in smaller, more exclusive developments or standalone properties. Many include concierge services, private parking, and access to beach clubs.'
        ],
        image:
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
        alt: 'Modern luxury apartment in Puerto Portals',
      },
      {
        heading: 'Upscale dining and beach clubs',
        text: [
          'Puerto Portals is known for its collection of high-end restaurants and beach clubs with trained chefs and comprehensive wine lists. The waterfront setting makes evening dining especially appealing. Prices are higher than in other resort areas, but the quality of food and service reflects this.',
          'The beach clubs are particularly popular for relaxed daytime dining with sea views. Many offer signature cocktails, fresh seafood, and DJ entertainment in the afternoons and evenings.'
        ],
      },
      {
        heading: 'Proximity to Palma and the south-west',
        text: [
          'Puerto Portals is located conveniently between Palma and the main south-west resort areas. It is about 15 minutes by car from Palma\'s old town, making it ideal for travellers who want beach access and resort facilities while maintaining easy connection to Palma\'s culture and restaurants.',
          'The location also makes Puerto Portals a good base for exploring both Palma and the broader south-west coast. You can have a beach day in Puerto Portals and visit Palma or other destinations the same evening.'
        ],
      },
      {
        heading: 'Boutique shopping and local character',
        text: [
          'The marina area has a range of designer shops, galleries, and boutiques catering to affluent visitors. While selection is smaller than in Palma, the quality is high and the browsing experience is relaxed and uncrowded.',
          'Unlike large resort centres, Puerto Portals maintains an air of exclusivity and calm. The atmosphere is more similar to an upscale Mediterranean harbour village than to a typical beach resort.'
        ],
      },
    ],
    checklist: [
      'Book restaurants and beach clubs in advance; popular spots fill quickly.',
      'Confirm your apartment has premium amenities and beach club access.',
      'Budget for higher meal prices; this is a premium dining destination.',
      'Book water sports or yacht excursions in advance if these interest you.',
      'Note that parking can be limited; check parking availability with your rental.'
    ],
    whereToStay: [
      'Marina-view apartments for direct yacht and waterfront views.',
      'Exclusive villas with private pools and sea access.',
      'Beach club properties with guaranteed beach and restaurant access.',
      'Town-centre apartments within walking distance of shops and restaurants.'
    ],
    practicalTips: [
      'Puerto Portals is more upscale and quieter than busier resort areas; this is by design.',
      'A car is useful but not essential; Palma is accessible by bus and there is local transport.',
      'The area attracts a mature, affluent clientele; the atmosphere is sophisticated rather than party-focused.',
      'Restaurant reservations are essential during peak season.',
      'If you prefer a lively nightlife scene, other resort areas like Magaluf may suit you better.'
    ],
  },
  'cala-vinyes-mallorca': {
    slug: 'cala-vinyes-mallorca',
    title: 'Cala Vinyes Mallorca: calm cove resort area',
    summary:
      'A guide to Cala Vinyes, a quieter cove-style resort area on the south-west coast known for calm waters, family-friendly atmosphere, and peaceful accommodation options.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'Cala Vinyes is a small, calm cove-style resort area on the south-west coast, offering a more relaxed and peaceful alternative to the busier beach resort centres. The cove is protected and the waters are typically calm, making it ideal for families who want a quiet, easy beach day without the crowds and energy of larger resort towns.',
    sections: [
      {
        heading: 'Why Cala Vinyes: calm waters and quieter atmosphere',
        text: [
          'Cala Vinyes is one of the quieter beach areas on the south-west coast. The small cove is naturally protected, so the waters are very calm and clear. Unlike the long public beaches of Santa Ponsa or Palmanova, Cala Vinyes feels more intimate and less crowded.',
          'The area is ideal for families with young children, couples seeking a relaxed beach day, and travellers who prefer not to compete for sun-bed space or navigate busy beach scenes.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cala Vinyes calm cove and clear waters',
      },
      {
        heading: 'Beach character and facilities',
        text: [
          'Cala Vinyes is a small sandy beach surrounded by low-rise holiday homes and villas. The beach has limited commercial facilities compared to larger resort areas, but basic sun-bed rentals and a small beach bar are available. The relaxed atmosphere means there is no high-pressure sales or crowded nightlife scene.',
          'The small size means you can rent sun-beds easily without needing to arrive very early. The water is exceptionally clear and calm, making it one of the best areas on the south-west coast for swimming with children.'
        ],
        image:
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        alt: 'Small sandy beach in Cala Vinyes',
      },
      {
        heading: 'Accommodation and local rentals',
        text: [
          'Cala Vinyes is predominantly made up of holiday villas and low-rise apartment blocks rather than tall resort hotels. Many rentals are spacious family villas with private pools, making them excellent for groups or families wanting more independence than a hotel provides.',
          'The area is less developed for tourism than Santa Ponsa or Palmanova, which is both a strength (quieter, more authentic) and a limitation (fewer services and restaurants immediately on-site).'
        ],
        image:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        alt: 'Holiday villas in Cala Vinyes',
      },
      {
        heading: 'Dining and local services',
        text: [
          'Cala Vinyes has a small number of local restaurants and cafés near the beach and in the surrounding area. Options are more limited than in larger resort centres, but this contributes to the quieter, less touristy character. Most visitors self-cater or eat at nearby restaurants in Santa Ponsa or other nearby areas.',
          'A small supermarket and basic shops serve the local area, so you can buy supplies without needing to travel far.'
        ],
      },
      {
        heading: 'Getting to and around Cala Vinyes',
        text: [
          'Cala Vinyes is a short drive from Santa Ponsa and other south-west resort areas. Without a car, public transport is limited, so a rental vehicle is recommended if you want flexibility to explore beyond your accommodation.',
          'Within Cala Vinyes itself, everything is close together and easily walkable, so once you have driven to the area, you can explore on foot.'
        ],
      },
    ],
    checklist: [
      'Book a villa rental with a private pool if you want maximum comfort and independence.',
      'Bring groceries or plan to eat at nearby restaurants; on-site dining options are limited.',
      'Hire a car if you want to explore other parts of the south-west coast.',
      'Arrive early for good sun-bed spots during peak summer.',
      'Confirm your rental is near the beach; some villas are set back from the cove.'
    ],
    whereToStay: [
      'Family villas with private pools for space and independence.',
      'Beachfront or near-beach apartments for direct cove access.',
      'Low-rise residential properties for a quieter, more authentic setting.',
      'Holiday homes suitable for groups or multi-family stays.'
    ],
    practicalTips: [
      'Cala Vinyes is perfect for families seeking a calm, relaxed beach day.',
      'The small cove and clear water make it ideal for snorkeling and swimming with children.',
      'On-site dining is minimal; consider self-catering or planning trips to Santa Ponsa for restaurant choices.',
      'The area is quieter than larger resorts; plan accordingly if nightlife is important.',
      'Peak summer crowds are minimal compared to Santa Ponsa, even during July and August.',
      'The calm water and small size make Cala Vinyes less suitable for water sports enthusiasts.'
    ],
  },
  'el-toro-port-adriano-mallorca': {
    slug: 'el-toro-port-adriano-mallorca',
    title: 'El Toro and Port Adriano Mallorca: modern marina resort',
    summary:
      'A guide to El Toro and Port Adriano, a modern upscale marina development on the south-west coast known for contemporary design, luxury villas, and exclusive waterfront dining.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    intro:
      'El Toro and Port Adriano are modern, upscale developments on the south-west coast. Port Adriano is a contemporary marina village with designer shops, luxury restaurants, and waterfront promenades. El Toro is the residential area surrounding the marina, known for high-end villa rentals and a sophisticated, contemporary atmosphere.',
    sections: [
      {
        heading: 'Port Adriano: ultra-modern marina village',
        text: [
          'Port Adriano is a recently developed marina complex designed by renowned architect Philippe Starck. The design is contemporary, with clean lines, modern materials, and careful attention to aesthetics. It is one of the most architecturally distinctive locations on Mallorca.',
          'The marina hosts a mix of private yachts and commercial boats. The surrounding promenade has high-end restaurants, bars, and boutique shops. The overall atmosphere is sophisticated and upscale, designed to appeal to affluent visitors and yacht owners.'
        ],
        image:
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Port Adriano modern marina and waterfront',
      },
      {
        heading: 'Contemporary villas and rentals',
        text: [
          'El Toro is a residential area with modern villas designed to complement Port Adriano\'s contemporary aesthetic. Most villas are spacious, with private pools, terraces, and high-end finishes. The architecture is distinctly modern, with clean lines and minimalist design.',
          'Villa rentals in El Toro are expensive but offer cutting-edge comfort and design. Many properties are suitable for groups or multi-family stays and come with premium amenities such as home cinemas, smart home systems, and designer kitchens.'
        ],
        image:
          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
        alt: 'Modern villa with pool in El Toro',
      },
      {
        heading: 'Upscale dining and shopping',
        text: [
          'Port Adriano is known for its selection of high-end restaurants and bars with Michelin stars and celebrity chefs. The waterfront dining experience is excellent, with sea views and sophisticated menus. Prices are premium, but the quality justifies the cost.',
          'The small marina area also has designer shops and galleries catering to affluent visitors. The selection is curated rather than extensive, maintaining the exclusive feel of the development.'
        ],
      },
      {
        heading: 'Beach access and water activities',
        text: [
          'El Toro and Port Adriano are marina-focused rather than beach-focused destinations. The main waterfront is paved marina promenade rather than a sandy beach. However, small beach areas and rocky coves nearby provide swimming options.',
          'Water activities such as boat rentals, yacht charters, and water sports are available through the marina. This is particularly appealing for travellers with boating interests or those seeking a yacht-based holiday.'
        ],
      },
      {
        heading: 'Contemporary atmosphere and lifestyle',
        text: [
          'The overall character of El Toro and Port Adriano is contemporary and cosmopolitan. The focus is on design, cuisine, and lifestyle rather than on traditional beach resort activities. This appeals to design-conscious travellers and those seeking a sophisticated Mediterranean experience.',
          'The area attracts affluent travellers, yacht owners, and international visitors. English is widely spoken, and the cultural atmosphere is diverse and worldly.'
        ],
      },
    ],
    checklist: [
      'Book restaurants well in advance; popular spots fill quickly.',
      'Book villa rentals early; demand is high for the best properties.',
      'Budget for premium prices across dining, shopping, and accommodation.',
      'Confirm your villa has the specific modern amenities you desire.',
      'Consider arranging boat charters or yacht rentals in advance.'
    ],
    whereToStay: [
      'Ultra-modern villas with private pools and high-end finishes.',
      'Spacious properties suitable for groups or multi-family stays.',
      'Waterfront apartments in Port Adriano for marina and restaurant views.',
      'Residential villas in El Toro with access to Port Adriano amenities.'
    ],
    practicalTips: [
      'This is one of the most upscale and contemporary destinations on the south-west coast.',
      'The area is ideal for design enthusiasts and those seeking sophisticated dining and lifestyle.',
      'Public transport is limited; a car is recommended for exploring beyond the immediate marina area.',
      'The atmosphere is more cosmopolitan and less Spanish-focused than traditional resort towns.',
      'If you have an interest in sailing or yachting, Port Adriano offers excellent marina facilities and boat charter options.',
      'Book restaurants in advance; popular spots have limited capacity.'
    ],
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

              {section.heading === 'Holiday Villas in the South West of Mallorca' ? (
                <div>
                  {section.text.map((paragraph, index) => (
                    <p key={index} style={{ margin: '0 0 14px', fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                      {index === 0 ? (
                        <>
                          For travellers looking for premium villa properties in the south-west,{' '}
                          <a
                            href="https://www.villasmediterranean.com/villas-in-the-south-west-of-mallorca"
                            rel="dofollow"
                            style={{ color: '#7dd3fc', textDecoration: 'underline', fontWeight: 500 }}
                          >
                            Holiday Villas
                          </a>
                          {' '}offer a curated selection of high-quality short-term rental villas across Santa Ponsa, Port d&apos;Andratx, Puerto Portals, and other sought-after locations. Their collection includes properties with private pools, sea views, and exclusive amenities tailored for families, couples, and groups seeking a luxurious Mallorca experience.
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
              ) : (
                <>
                  {section.text.map((paragraph) => (
                    <p key={paragraph} style={{ margin: '0 0 14px', fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                      {paragraph}
                    </p>
                  ))}
                </>
              )}
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
