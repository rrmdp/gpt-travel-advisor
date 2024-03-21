import './globals.css'
import { AnalyticsWrapper } from './components/analytics';
//import { AnalyticsWrapper } from './components/GAnalytics';
// import { AnalyticsWrapper } from './components/GAnalyticsLib';
import Image from 'next/image'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <meta name="author" content="Rodrigo Rocco @rrmdp on Twitter"></meta>
      <head />
      
      <body>
        <div className="wrapper">
          {children}
          <AnalyticsWrapper />
        </div>
        <footer className="footer">
            <p>
            By <a className="sponsor" target="_blank" rel="no-opener" href="https://www.villasmediterranean.com/?ref=whattodoinmallorca">VillasMediterranean.com</a>
            </p>
        </footer>
      </body>
    </html>
  )
}
