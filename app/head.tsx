import { AnalyticsWrapper } from './components/GAnalyticsLib';

export default function Head() {
  return (
    <>
      <title>What to do in Mallorca? Tourist itineraries by VillasMediterranean.com</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="What to do in Majorca? Build your custom tourist itinerary in Mallorca powered by AI" />
      <link rel="icon" href="/favicon.ico" /> 
      <AnalyticsWrapper /> 
      <meta name="google-site-verification" content="BKOrUF74-QvCNriJNcT5bsRdJU_zMwrsZKTz97QSQaU" />        
      <meta name="author" content="Rodrigo Rocco @rrmdp on Twitter"></meta>
      <link rel="canonical" href="https://www.whattodoinmallorca.com" />
    </>
  )
}
