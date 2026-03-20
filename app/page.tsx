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
  created_at: string
}

export default function Home() {
  const router = useRouter()
  const [request, setRequest] = useState<{days?: string, city?: string, month?: string}>({})
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

      if (!request.month) {
        console.log('No month...');
        setMessage('Please select an arrival month!')
        return
      }

      if (!request.days) {
        setMessage('Please your stay lenght')
        return
      }

      // if (!request.month ||!request.days) return
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
          month: request.month
        })
      })
      const json = await response.json()
      
      const response2 = await fetch('/api/get-points-of-interest', {
        method: 'POST',
        body: JSON.stringify({
          pointsOfInterestPrompt: json.pointsOfInterestPrompt,
        })
      })
      const json2 = await response2.json()

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
          <button className="input-button"  onClick={hitAPI}>Suggest things to do 💡</button>
        </div>
        {previousItineraries.length > 0 && (
          <div style={styles.previousContainer}>
            <h2 style={styles.previousTitle}>Previously generated itineraries</h2>
            {previousItineraries.map((saved) => (
              <a key={saved.id} href={`/itinerary/${saved.id}`} style={styles.previousLink}>
                {saved.days} days in {saved.city} ({saved.month})
              </a>
            ))}
          </div>
        )}
        <div className="results-container">
        {
      loading && (
            <p>{message}</p>
          )
        }
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
    color: '#fff',
    textDecoration: 'underline',
    lineHeight: '1.5'
  }
}
