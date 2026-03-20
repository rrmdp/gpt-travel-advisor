import { getItineraryById } from '../../../lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  params: { id: string }
}

export default function ItineraryPage({ params }: Props) {
  const data = getItineraryById(params.id)

  if (!data) {
    notFound()
  }

  let days = data.itinerary.split('Day')
  if (days.length > 1) {
    days.shift()
  } else {
    days[0] = '1' + days[0]
  }

  return (
    <main>
      <div className="app-container">
        <div className="header">
          <h1 style={styles.header} className="hero-header">
            {data.days} days in {data.city} — {data.month}
          </h1>
        </div>
        <div className="results-container" style={{ marginTop: '30px' }}>
          {days.map((day, index) => (
            <div style={{ marginBottom: '30px' }} key={index}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => (
                    <a target="_blank" rel="noreferrer" href={props.href}>
                      {props.children}
                    </a>
                  ),
                }}
              >
                {`Day ${day}`}
              </ReactMarkdown>
            </div>
          ))}
          <div style={{ marginBottom: '30px' }}>
            If you are a family and would like to stay in a nice villa then check
            out{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.villasmediterranean.com/?ref=whattodoinmallorca"
            >
              Villas Mediterranean
            </a>
          </div>
          <div style={{ marginBottom: '40px' }}>
            <a href="/" style={styles.backLink}>
              ← Plan another trip
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as const,
    marginTop: '60px',
    color: '#fff',
    fontWeight: '900',
    fontFamily: 'Poppins',
    fontSize: '48px',
    textShadow: '0 0 3px #a5a5a5',
  },
  backLink: {
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'underline',
  },
}
