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

function formatDateUTC(dateString: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString))
}

export default function Home() {
  const router = useRouter()
  const [request, setRequest] = useState<{days?: string, city?: string, month?: string, travel_style?: string}>({})
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  let [itinerary, setItinerary] = useState<string>('')
  const [previousItineraries, setPreviousItineraries] = useState<ItinerarySummary[]>([])


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

  console.log('Developed by Rodrigo Rocco - @rrmdp on Twitter');

  async function hitAPI() {
    try {
      if (loading) return

      if (!request.month) {
        console.log('No month...');
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
          interests: selectedInterests,
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

      let pointsOfInterest = JSON.parse(json2.pointsOfInterest)
      let itinerary = json.itinerary

      pointsOfInterest.map(point => {
        // itinerary = itinerary.replace(point, `<a target="_blank" rel="no-opener" href="https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)}">${point}</a>`)
        itinerary = itinerary.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' Mallorca' )})`)
      })

     //itinerary += "\r\n\r\n\r\nIf you are a family and would like to stay in a nice villa then check out [Villas Mediterranean](https://www.villasmediterranean.com)"

      setItinerary(itinerary)
      setLoading(false)

      const saveResponse = await fetch('/api/save-itinerary', {
        method: 'POST',
        body: JSON.stringify({
          city: 'Mallorca',
          days: request.days,
          month: request.month,
          travel_style: request.travel_style,
          interests: selectedInterests.join(', '),
          itinerary,
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
  
  let days = itinerary.split('Day')

  if (days.length > 1) {
    days.shift()
  } else {
    days[0] = "1" + days[0]
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
            <option value="Relaxation & Beaches">Relaxation & Beaches</option>
            <option value="Adventure & Hiking">Adventure & Hiking</option>
            <option value="Culture & History">Culture & History</option>
            <option value="Food & Wine">Food & Wine</option>
            <option value="Family-Friendly">Family-Friendly</option>
          </select>

          <div style={styles.interestsContainer}>
            <p style={styles.interestsLabel}>Interests (optional):</p>
            <div style={styles.checkboxGroup}>
              {[
                'Water sports',
                'Local food tours',
                'Budget travel',
                'Luxury experiences',
                'Off-the-beaten-path',
                'Shopping',
                'Nightlife',
              ].map(interest => (
                <label key={interest} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInterests([...selectedInterests, interest])
                      } else {
                        setSelectedInterests(selectedInterests.filter(i => i !== interest))
                      }
                    }}
                    style={styles.checkbox}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>
 
         <input required style={styles.city}  placeholder="City" onChange={e => setRequest(request => ({
            ...request, city: e.target.value
          }))} />
          <select style={styles.input} onChange={e => setRequest(request => ({ ...request, month: e.target.value}))}>
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
            {previousItineraries.map((saved) => (
              <a key={saved.id} href={`/itinerary/${saved.id}`} style={styles.previousLink}>
                <span>{saved.days} days in {saved.city} ({saved.month})</span>
                <span style={styles.previousDate}>
                  {formatDateUTC(saved.created_at)}
                </span>
              </a>
            ))}
          </div>
        )}
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
        </section>
        <div className="results-container">
        {
          itinerary && days.map((day, index) => (
            // <p
            //   key={index}
            //   style={{marginBottom: '20px'}}
            //   dangerouslySetInnerHTML={{__html: `Day ${day}`}}
            // />
            <div
              style={{marginBottom: '30px'}}
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
          ))    
        }
          {itinerary && (<div
            style={{marginBottom: '30px'}}
          >
          If you are a family and would like to stay in a nice villa then check out <a target="_blank" href="https://www.villasmediterranean.com/?ref=whattodoinmallorca" >Villas Mediterranean</a>
          </div>)
        }

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
  subheader:{
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
    border:'none',
    color: '#727272'
  },
  city: {
    display:'none'
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
  interestsContainer: {
    width: '100%',
    marginBottom: '16px',
  },
  interestsLabel: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#666',
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
    color: '#666',
  },
  checkbox: {
    marginRight: '6px',
    cursor: 'pointer',
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
