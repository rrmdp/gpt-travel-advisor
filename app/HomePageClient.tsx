'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRouter } from 'next/navigation'

type ItinerarySummary = {
  id: string
  city: string
  days: number
  month: string
  travel_style?: string
  interests?: string
  created_at: string
}

const travelStyles = [
  'Relaxation & Beaches',
  'Adventure & Hiking',
  'Culture & History',
  'Food & Wine',
  'Family-Friendly',
  'Luxury Escape',
  'Romantic Getaway',
  'Nightlife & Beach Clubs',
  'Road Trip & Scenic Drives',
  'Wellness & Spa',
  'Cycling & Outdoor Sport',
  'Slow Travel & Villages',
]

const interestOptions = [
  'Water sports',
  'Boat trips',
  'Local food tours',
  'Budget travel',
  'Luxury experiences',
  'Off-the-beaten-path',
  'Shopping',
  'Nightlife',
  'Beach clubs',
  'Scenic villages',
  'Sunset spots',
  'Art & museums',
  'Family attractions',
  'Wellness',
]

function formatDateUTC(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString))
}

export default function HomePageClient() {
  const router = useRouter()
  const [request, setRequest] = useState<{
    days?: string
    city?: string
    month?: string
    travel_style?: string
    trip_pace?: string
    transport_mode?: string
  }>({})
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [itinerary, setItinerary] = useState<string>('')
  const [previousItineraries, setPreviousItineraries] = useState<ItinerarySummary[]>([])
  const [visibleItineraryCount, setVisibleItineraryCount] = useState(10)
  const [showOptionalPreferences, setShowOptionalPreferences] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadPreviousItineraries() {
      try {
        const response = await fetch('/api/itineraries')
        if (!response.ok) return
        const data = await response.json()
        setPreviousItineraries(data)
      } catch (err) {
        console.log('error loading itineraries: ', err)
      }
    }

    loadPreviousItineraries()
  }, [])

  console.log('Developed by Rodrigo Rocco - @rrmdp on Twitter')

  const tripPreferences = [
    ...selectedInterests,
    request.trip_pace ? `Trip pace: ${request.trip_pace}` : '',
    request.transport_mode ? `Transport: ${request.transport_mode}` : '',
  ].filter(Boolean)

  async function hitAPI() {
    try {
      if (loading) return

      if (!request.month) {
        console.log('No month...')
        setMessage('Please select an arrival month!')
        return
      }

      if (!request.days) {
        setMessage('Please enter your stay length!')
        return
      }

      if (!request.travel_style) {
        setMessage('Please select a travel style!')
        return
      }

      setMessage('Getting suggestions...')
      setLoading(true)
      setItinerary('')

      setTimeout(() => {
        if (!loading) return
        setMessage('Just a minute ...')
      }, 7000)

      setTimeout(() => {
        if (!loading) return
        setMessage('Almost there ...')
      }, 15000)

      const response = await fetch('/api/get-itinerary', {
        method: 'POST',
        body: JSON.stringify({
          days: request.days,
          city: 'Mallorca',
          month: request.month,
          travel_style: request.travel_style,
          interests: tripPreferences,
        })
      })
      const json = await response.json()

      if (!response.ok) {
        const serverMessage = typeof json?.message === 'string' ? json.message : 'Unable to generate itinerary right now.'
        setMessage(serverMessage)
        setLoading(false)
        return
      }

      const response2 = await fetch('/api/get-points-of-interest', {
        method: 'POST',
        body: JSON.stringify({
          pointsOfInterestPrompt: json.pointsOfInterestPrompt,
        })
      })
      const json2 = await response2.json()

      if (!response2.ok) {
        setMessage('Too many requests right now. Please wait a bit and try again.')
        setLoading(false)
        return
      }

      const pointsOfInterest = JSON.parse(json2.pointsOfInterest)
      let nextItinerary = json.itinerary

      pointsOfInterest.map((point: string) => {
        nextItinerary = nextItinerary.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' Mallorca')})`)
        return point
      })

      setItinerary(nextItinerary)
      setLoading(false)

      const saveResponse = await fetch('/api/save-itinerary', {
        method: 'POST',
        body: JSON.stringify({
          city: 'Mallorca',
          days: request.days,
          month: request.month,
          travel_style: request.travel_style,
          interests: tripPreferences.join(', '),
          itinerary: nextItinerary,
        })
      })
      if (!saveResponse.ok) {
        setMessage('Unable to save itinerary right now. Please try again.')
        return
      }
      const { id } = await saveResponse.json()
      router.push(`/itinerary/${id}`)
    } catch (err) {
      console.log('error: ', err)
      setMessage('')
      setLoading(false)
    }
  }

  const days = itinerary.split('Day')

  if (days.length > 1) {
    days.shift()
  } else {
    days[0] = `1${days[0]}`
  }

  return (
    <main>
      <div className="app-container">
        <div className="header">
          <h1 style={styles.header} className="hero-header">What to do in Mallorca?</h1>
        </div>
        <div style={styles.formContainer} className="form-container">
          <select
            style={styles.input}
            onChange={e => setRequest(request => ({ ...request, travel_style: e.target.value }))}
            value={request.travel_style || ''}
          >
            <option value="">What&apos;s your travel style?</option>
            {travelStyles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>

          <div style={styles.optionalPanel}>
            <button
              type="button"
              onClick={() => setShowOptionalPreferences((open) => !open)}
              style={styles.optionalToggle}
              aria-expanded={showOptionalPreferences}
              aria-controls="optional-preferences"
            >
              <span>Optional preferences</span>
              <span style={styles.optionalToggleMeta}>
                {tripPreferences.length > 0 ? `${tripPreferences.length} selected` : 'Add extra filters'}
              </span>
            </button>

            {showOptionalPreferences && (
              <div id="optional-preferences" style={styles.optionalContent}>
                <div style={styles.interestsContainer}>
                  <p style={styles.interestsLabel}>Interests</p>
                  <div style={styles.checkboxGroup}>
                    {interestOptions.map((interest) => (
                      <label key={interest} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedInterests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInterests((current) => [...current, interest])
                            } else {
                              setSelectedInterests((current) => current.filter((item) => item !== interest))
                            }
                          }}
                          style={styles.checkbox}
                        />
                        {interest}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={styles.optionalFieldGrid}>
                  <div style={styles.optionalField}>
                    <label style={styles.optionalLabel} htmlFor="trip-pace">Trip pace</label>
                    <select
                      id="trip-pace"
                      style={styles.input}
                      value={request.trip_pace || ''}
                      onChange={(e) => setRequest((current) => ({ ...current, trip_pace: e.target.value }))}
                    >
                      <option value="">No preference</option>
                      <option value="Relaxed">Relaxed</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Packed with sightseeing">Packed with sightseeing</option>
                    </select>
                  </div>

                  <div style={styles.optionalField}>
                    <label style={styles.optionalLabel} htmlFor="transport-mode">Getting around</label>
                    <select
                      id="transport-mode"
                      style={styles.input}
                      value={request.transport_mode || ''}
                      onChange={(e) => setRequest((current) => ({ ...current, transport_mode: e.target.value }))}
                    >
                      <option value="">No preference</option>
                      <option value="Rental car">Rental car</option>
                      <option value="Public transport">Public transport</option>
                      <option value="Mostly walkable areas">Mostly walkable areas</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <input required style={styles.city} placeholder="City" onChange={e => setRequest(request => ({
            ...request, city: e.target.value
          }))} />
          <select style={styles.input} onChange={e => setRequest(request => ({ ...request, month: e.target.value }))}>
            <option value="">When are you arriving?</option>
            <option value="summer">Summer</option>
            <option value="spring">Spring</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          <input type="number" style={styles.input} placeholder="How many days are you staying?" onChange={e => setRequest(request => ({
            ...request, days: e.target.value
          }))} />
          <button
            className="input-button"
            onClick={hitAPI}
            disabled={loading}
            aria-disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Generating itinerary...' : 'Suggest things to do 💡'}
          </button>
          {message && (
            <p
              role="status"
              aria-live="polite"
              style={loading ? styles.formMessageInfo : styles.formMessageError}
            >
              {message}
            </p>
          )}
        </div>
        {previousItineraries.length > 0 && (
          <div style={styles.previousContainer}>
            <h2 style={styles.previousTitle}>Previously generated itineraries</h2>
            {previousItineraries.slice(0, visibleItineraryCount).map((saved) => {
              const linkText = [
                `${saved.days} days in ${saved.city}`,
                saved.travel_style || 'itinerary',
                saved.month
              ].filter(Boolean).join(' · ')
              return (
                <a key={saved.id} href={`/itinerary/${saved.id}`} style={styles.previousLink}>
                  <span>{linkText}</span>
                  <span style={styles.previousDate}>
                    {formatDateUTC(saved.created_at)}
                  </span>
                </a>
              )
            })}
            {visibleItineraryCount < previousItineraries.length && (
              <button
                type="button"
                onClick={() => setVisibleItineraryCount((count) => count + 10)}
                style={styles.loadMoreButton}
              >
                Load more itineraries
              </button>
            )}
          </div>
        )}
        <div style={styles.promoCard}>
          <span style={styles.promoEmoji}>🏡</span>
          <p style={styles.promoText}>
            Travelling as a family? Check out{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.villasmediterranean.com/?ref=whattodoinmallorca"
              style={styles.promoLink}
            >
              Villas Mediterranean
            </a>{' '}
            for beautiful short-term villa rentals.
          </p>
        </div>
        <section style={styles.seoSection}>
          <h2 style={styles.seoTitle}>Best things to do in Mallorca</h2>
          <p style={styles.seoText}>
            Looking for the best things to do in Mallorca? This AI Mallorca itinerary
            planner creates day-by-day travel plans based on your arrival month and
            trip length. Explore beaches, mountain villages, old town walks, local
            markets, family activities, and hidden gems across Majorca.
          </p>
          <h3 style={styles.seoSubTitle}>Popular Mallorca trip ideas</h3>
          <ul style={styles.seoList}>
            <li style={styles.seoListItem}>4-day Mallorca itinerary for first-time visitors</li>
            <li style={styles.seoListItem}>Family-friendly things to do in Mallorca</li>
            <li style={styles.seoListItem}>Best beaches and calas in Majorca</li>
            <li style={styles.seoListItem}>Scenic day trips: Soller, Valldemossa, and Deia</li>
          </ul>

          <h3 style={styles.seoSubTitle}>Where to stay in Mallorca by holiday type</h3>
          <p style={styles.seoText}>
            Choosing the right base can make a big difference in Mallorca. Some
            areas are better for beaches and families, some for nightlife, and
            others for scenic mountain views or a walkable city break.
          </p>
          <div style={styles.areaGrid}>
            <div style={styles.areaCard}>
              <h4 style={styles.areaTitle}>Palma</h4>
              <p style={styles.areaText}>
                Best for short breaks, food lovers, shopping, culture, and visitors
                who want to explore Mallorca without relying heavily on a car.
              </p>
            </div>
            <div style={styles.areaCard}>
              <h4 style={styles.areaTitle}>Alcudia and Playa de Muro</h4>
              <p style={styles.areaText}>
                Strong choice for families, long sandy beaches, shallow water,
                bike-friendly routes, and easy resort-style holidays.
              </p>
            </div>
            <div style={styles.areaCard}>
              <h4 style={styles.areaTitle}>Port de Soller</h4>
              <p style={styles.areaText}>
                Ideal for scenic stays, couples, mountain views, hiking access,
                and a slower pace near the Serra de Tramuntana.
              </p>
            </div>
            <div style={styles.areaCard}>
              <h4 style={styles.areaTitle}>Cala d&apos;Or</h4>
              <p style={styles.areaText}>
                Good for pretty coves, boat days, marina restaurants, and relaxed
                east-coast beach holidays with easy swimming spots.
              </p>
            </div>
            <div style={styles.areaCard}>
              <h4 style={styles.areaTitle}>Santa Ponsa and Palmanova</h4>
              <p style={styles.areaText}>
                Practical for families and mixed groups who want beaches,
                restaurants, golf nearby, and quick transfers from the airport.
              </p>
            </div>
            <div style={styles.areaCard}>
              <h4 style={styles.areaTitle}>Deia and Valldemossa</h4>
              <p style={styles.areaText}>
                Better for romantic trips, boutique stays, mountain villages,
                viewpoints, and a more premium, quieter Mallorca experience.
              </p>
            </div>
          </div>

          <h3 style={styles.seoSubTitle}>Mallorca holiday planning tips</h3>
          <ul style={styles.seoList}>
            <li style={styles.seoListItem}>Renting a car gives the most flexibility for beaches, villages, and scenic drives, especially outside Palma.</li>
            <li style={styles.seoListItem}>May, June, September, and early October are often the best months for warm weather without the peak-summer intensity.</li>
            <li style={styles.seoListItem}>Popular restaurants, boat trips, and beach clubs should be booked ahead in summer.</li>
            <li style={styles.seoListItem}>If you stay in Palma, you can cover a lot by foot, train, bus, and organised day trips.</li>
            <li style={styles.seoListItem}>For family holidays, look for areas with calm water and shorter transfer times such as Playa de Muro, Alcudia, and Santa Ponsa.</li>
          </ul>

          <h3 style={styles.seoSubTitle}>Mallorca month by month</h3>
          <p style={styles.seoText}>
            Mallorca changes a lot through the year. Beach weather, hiking
            conditions, prices, family demand, and how far ahead you need to book
            all depend on the month you travel.
          </p>
          <div style={styles.monthGrid}>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>January</h4>
              <p style={styles.monthText}>Quiet island atmosphere, city breaks, scenic walks, and cooler weather.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>February</h4>
              <p style={styles.monthText}>Good for almond blossom views, cycling, hiking, and lower hotel rates.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>March</h4>
              <p style={styles.monthText}>Spring starts to arrive, with pleasant sightseeing weather and greener landscapes.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>April</h4>
              <p style={styles.monthText}>One of the best months for hiking, road trips, villages, and active holidays.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>May</h4>
              <p style={styles.monthText}>Warm, bright, and less crowded than summer, making it ideal for mixed trips.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>June</h4>
              <p style={styles.monthText}>Excellent for beaches, boat trips, and family holidays before peak summer pressure.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>July</h4>
              <p style={styles.monthText}>Hot, busy, and best for sea days, resort stays, and nightlife-focused trips.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>August</h4>
              <p style={styles.monthText}>Peak beach season with the warmest sea, highest demand, and busiest resorts.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>September</h4>
              <p style={styles.monthText}>A favourite month for many visitors: warm sea, sunny weather, and fewer crowds.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>October</h4>
              <p style={styles.monthText}>Great for scenic drives, food trips, city breaks, and comfortable outdoor exploring.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>November</h4>
              <p style={styles.monthText}>Quieter and cooler, better for relaxed stays, Palma visits, and low-key walking.</p>
            </div>
            <div style={styles.monthCard}>
              <h4 style={styles.monthTitle}>December</h4>
              <p style={styles.monthText}>Best for winter city breaks, festive Palma, and peaceful off-season Mallorca.</p>
            </div>
          </div>

          <h3 style={styles.seoSubTitle}>Mallorca with kids</h3>
          <p style={styles.seoText}>
            Mallorca is one of the easiest Mediterranean islands for family
            holidays because transfers are short, beaches are varied, and there
            are plenty of calm resorts, villas, and day trips that work well with
            younger children.
          </p>
          <div style={styles.familyGrid}>
            <div style={styles.familyCard}>
              <h4 style={styles.familyTitle}>Best family areas</h4>
              <p style={styles.familyText}>Playa de Muro, Alcudia, Santa Ponsa, and Palmanova are often the easiest bases for family stays.</p>
            </div>
            <div style={styles.familyCard}>
              <h4 style={styles.familyTitle}>Calm beaches</h4>
              <p style={styles.familyText}>Families usually look for shallow water, easy parking, toilets, and nearby food, which makes Playa de Muro especially popular.</p>
            </div>
            <div style={styles.familyCard}>
              <h4 style={styles.familyTitle}>Good day trips</h4>
              <p style={styles.familyText}>Boat trips, Palma Aquarium, Alcudia Old Town, Sóller train rides, and easy beach-hopping days work well for mixed ages.</p>
            </div>
            <div style={styles.familyCard}>
              <h4 style={styles.familyTitle}>Where villas help</h4>
              <p style={styles.familyText}>For longer stays, many families prefer villas or apartments for extra space, kitchens, nap flexibility, and pool time.</p>
            </div>
          </div>
          <ul style={styles.seoList}>
            <li style={styles.seoListItem}>Choose one main base rather than changing hotels too often if you are travelling with young children.</li>
            <li style={styles.seoListItem}>In high summer, plan beaches early in the day and keep shaded or indoor options for the hottest afternoon hours.</li>
            <li style={styles.seoListItem}>If you want easier logistics, stay within a reasonable transfer distance of Palma airport.</li>
            <li style={styles.seoListItem}>Look for accommodation with parking if you plan to explore different calas and villages by car.</li>
          </ul>

          <h3 style={styles.seoSubTitle}>Mallorca travel FAQ</h3>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>What are the best things to do in Mallorca?</h4>
            <p style={styles.faqAnswer}>
              Popular choices include Palma Cathedral, old town tapas routes,
              beaches around Alcudia and Cala d Or, mountain drives in Serra de
              Tramuntana, and boat excursions along the coast.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>How many days should I spend in Mallorca?</h4>
            <p style={styles.faqAnswer}>
              Four to seven days gives enough time to combine city highlights,
              beaches, and at least one mountain-village day trip.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Is Mallorca good for families?</h4>
            <p style={styles.faqAnswer}>
              Yes. Mallorca offers calm beaches, walkable towns, short transfers,
              and many villa and apartment options for family stays.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Where should I stay in Mallorca for a beach holiday?</h4>
            <p style={styles.faqAnswer}>
              Alcudia, Playa de Muro, Cala d Or, Palmanova, and Santa Ponsa are
              popular for easy beach access, plenty of restaurants, and a wide
              choice of hotels and apartments.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Which part of Mallorca is best without a car?</h4>
            <p style={styles.faqAnswer}>
              Palma is the easiest base without a car because you can walk to
              restaurants, shops, and sights, then use buses, trains, and guided
              tours for day trips around the island.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>What is the best area in Mallorca for couples?</h4>
            <p style={styles.faqAnswer}>
              Couples often choose Palma Old Town, Port de Soller, Deia, or
              Valldemossa for scenic stays, boutique hotels, sunset dinners, and
              a more relaxed atmosphere.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Which part of Mallorca is best for nightlife?</h4>
            <p style={styles.faqAnswer}>
              Palma offers the broadest nightlife mix, while Magaluf suits
              travellers looking for late bars and clubs. For a more polished
              evening scene, many visitors prefer Santa Catalina in Palma.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Is Mallorca good for hiking and outdoor trips?</h4>
            <p style={styles.faqAnswer}>
              Yes. The Serra de Tramuntana is one of the island&apos;s biggest draws,
              with routes around Soller, Deia, Lluc, and Pollensa offering sea
              views, mountain villages, and excellent spring and autumn walking.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>What are the best beaches in Mallorca?</h4>
            <p style={styles.faqAnswer}>
              Frequently recommended beaches include Playa de Muro for families,
              Cala Agulla for clear water, Cala Mondrago for nature, Es Trenc for
              long white sand, and Cala Llombards for a classic cala setting.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>When is the best time to visit Mallorca?</h4>
            <p style={styles.faqAnswer}>
              May, June, September, and early October are ideal for many holiday
              makers because the weather is warm, the sea is pleasant, and the
              island is usually less intense than peak summer.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Is Mallorca better for luxury trips or budget travel?</h4>
            <p style={styles.faqAnswer}>
              It works for both. Mallorca has luxury fincas, boutique hotels, and
              beach clubs, but also affordable resorts, self-catering apartments,
              local bakeries, and public beaches that keep costs manageable.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>What can food lovers do in Mallorca?</h4>
            <p style={styles.faqAnswer}>
              Food-focused visitors usually enjoy Palma tapas bars, seaside rice
              dishes, winery visits, village markets, and local specialities such
              as ensaimada, tumbet, sobrasada, and fresh seafood.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>What are good Mallorca day trips for first-time visitors?</h4>
            <p style={styles.faqAnswer}>
              First-timers often choose Palma, Valldemossa, Deia, Soller, Sa
              Calobra, Cap de Formentor, and Alcudia Old Town to combine beaches,
              scenery, and cultural highlights in one trip.
            </p>
          </div>
        </section>
        <div className="results-container">
          {itinerary && days.map((day, index) => (
            <div
              style={{ marginBottom: '30px' }}
              key={index}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: props => {
                    return <a target="_blank" rel="no-opener" href={props.href}>{props.children}</a>
                  }
                }}
              >
                {`Day ${day}`}
              </ReactMarkdown>
            </div>
          ))}
          {itinerary && (
            <div style={{ marginBottom: '30px' }}>
              If you are a family and would like to stay in a nice villa then check out <a target="_blank" href="https://www.villasmediterranean.com/?ref=whattodoinmallorca">Villas Mediterranean</a>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as 'center',
    marginTop: '60px',
    color: '#fff',
    fontWeight: '900',
    fontFamily: 'Poppins',
    fontSize: '68px',
    textShadow: '0 0 3px #a5a5a5'
  },
  subheader: {
    right: '15px',
    bottom: '-14px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '500'
  },
  input: {
    padding: '10px 14px',
    marginBottom: '4px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    color: '#727272'
  },
  city: {
    display: 'none'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '35px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(5, 105, 135, .5)',
    borderRadius: '10px'
  },
  formMessageInfo: {
    marginTop: '10px',
    marginBottom: '0',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #91d5ff',
    background: '#e6f7ff',
    color: '#003a8c',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  formMessageError: {
    marginTop: '10px',
    marginBottom: '0',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ffa39e',
    background: '#fff1f0',
    color: '#a8071a',
    fontSize: '14px',
    lineHeight: '1.4',
    fontWeight: 600,
  },
  optionalPanel: {
    width: '100%',
    marginBottom: '16px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.12)',
  },
  optionalToggle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  optionalToggleMeta: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: '13px',
    fontWeight: 500,
  },
  optionalContent: {
    padding: '0 14px 14px',
  },
  interestsContainer: {
    width: '100%',
    marginBottom: '16px',
  },
  interestsLabel: {
    marginBottom: '8px',
    marginTop: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.88)',
  },
  checkbox: {
    marginRight: '6px',
    cursor: 'pointer',
  },
  optionalFieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  optionalField: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  optionalLabel: {
    marginBottom: '6px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '13px',
    fontWeight: 600,
  },
  result: {
    color: 'white'
  },
  previousContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '30px auto 0px',
    maxWidth: '540px',
    width: '100%',
    gap: '8px',
    padding: '16px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.12)'
  },
  previousTitle: {
    color: '#fff',
    fontSize: '18px',
    marginBottom: '6px'
  },
  previousLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '12px',
    color: '#fff',
    textDecoration: 'underline',
    lineHeight: '1.7',
    fontSize: '14px',
  },
  previousDate: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: '12px',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as 'nowrap',
    flexShrink: 0,
  },
  loadMoreButton: {
    marginTop: '10px',
    alignSelf: 'center',
    padding: '10px 14px',
    borderRadius: '999px',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    background: 'transparent',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  promoCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    maxWidth: '760px',
    margin: '24px auto 0px',
    padding: '16px 18px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.12)',
  },
  promoEmoji: {
    fontSize: '24px',
    lineHeight: 1,
  },
  promoText: {
    margin: 0,
    color: 'rgba(255,255,255,0.95)',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  promoLink: {
    color: '#fff',
    fontWeight: 700,
    textDecoration: 'underline',
  },
  seoSection: {
    maxWidth: '760px',
    margin: '36px auto 0px',
    background: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    padding: '18px 18px 14px',
  },
  seoTitle: {
    color: '#fff',
    fontSize: '28px',
    marginBottom: '10px',
    fontFamily: 'Poppins',
  },
  seoText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: '14px',
    lineHeight: '1.7',
    marginBottom: '14px',
  },
  seoSubTitle: {
    color: '#fff',
    fontSize: '18px',
    marginBottom: '8px',
    marginTop: '10px',
  },
  seoList: {
    paddingLeft: '18px',
    marginBottom: '14px',
  },
  seoListItem: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '5px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  areaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  areaCard: {
    padding: '14px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  areaTitle: {
    color: '#fff',
    fontSize: '16px',
    marginTop: 0,
    marginBottom: '6px',
  },
  areaText: {
    margin: 0,
    color: 'rgba(255,255,255,0.88)',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '10px',
    marginBottom: '16px',
  },
  monthCard: {
    padding: '12px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  monthTitle: {
    color: '#fff',
    fontSize: '15px',
    marginTop: 0,
    marginBottom: '6px',
  },
  monthText: {
    margin: 0,
    color: 'rgba(255,255,255,0.86)',
    fontSize: '12px',
    lineHeight: '1.5',
  },
  familyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginBottom: '14px',
  },
  familyCard: {
    padding: '14px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  familyTitle: {
    color: '#fff',
    fontSize: '16px',
    marginTop: 0,
    marginBottom: '6px',
  },
  familyText: {
    margin: 0,
    color: 'rgba(255,255,255,0.88)',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  faqItem: {
    marginBottom: '10px',
  },
  faqQuestion: {
    color: '#fff',
    fontSize: '15px',
    marginBottom: '2px',
  },
  faqAnswer: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '13px',
    lineHeight: '1.6',
  }
}