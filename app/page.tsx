'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [request, setRequest] = useState<{days?: string, city?: string, month?: string}>({})
  let [itinerary, setItinerary] = useState<string>('')

  useEffect(() => {
    //checkRedirect()
  }, [])

  function checkRedirect() {
    if (window.location.hostname === 'gpt-travel-advisor.vercel.app') {
      window.location.replace('https://www.roamaround.io/')
    }
  }

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  async function hitAPI() {
    try {
      if (/*!request.city ||*/ !request.days) return
      setMessage('Building itinerary...')
      setLoading(true)
      setItinerary('')

      setTimeout(() => {
        if (!loading) return
        setMessage('Getting closer ...')
      }, 7000)

      setTimeout(() => {
        if (!loading) return
        setMessage('Almost there ...')
      }, 15000)

      const response = await fetch('/api/get-itinerary', {
        method: 'POST',
        body: JSON.stringify({
          days: request.days,
          city: 'mallorca',
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
        itinerary = itinerary.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)})`)
      })

      setItinerary(itinerary)
      setLoading(false)
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
          <h2 style={styles.subheader} className="hero-subheader">by VillasMediterranean.com</h2>
        </div>
        <div style={styles.formContainer} className="form-container">
         <input style={styles.city}  placeholder="City" onChange={e => setRequest(request => ({
            ...request, city: e.target.value
          }))} />
          <select style={styles.input} onChange={e => setRequest(request => ({ ...request, month: e.target.value}))}>
          <option value="">Your arrival month is?</option>
          <option value="january">January</option>
        <option value="february">February</option>
        <option value="march">March</option>
        <option value="april">April</option>
        <option value="may">May</option>
        <option value="june">June</option>
        <option value="july">July</option>
        <option value="august">August</option>
        <option value="september">September</option>
        <option value="october">October</option>
        <option value="november">November</option>
        <option value="december">December</option>
          </select>
          <input style={styles.input} placeholder="How many days are you staying ?" onChange={e => setRequest(request => ({
            ...request, days: e.target.value
          }))} />
          <button className="input-button"  onClick={hitAPI}>Suggest Itinerary</button>
        </div>
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
    bottom: '-5px',
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
    border:'none'
  },
  city: {
    display:'none'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '20px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(5, 105, 135, .5)',
    borderRadius: '10px'
  },
  result: {
    color: 'white'
  }
}
