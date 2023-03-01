import './globals.css'
//import { AnalyticsWrapper } from './components/analytics';
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
      
      <head />
      
      <body>
        <div className="wrapper">
          {children}
          
        </div>
        <footer className="footer">
            <p>
            Built by <a target="_blank" rel="no-opener" href="https://twitter.com/rrmdp">@rrmdp</a> • <a className="sponsor" target="_blank" rel="no-opener" href="https://www.villasmediterranean.com/?ref=whattodoinmallorca">VillasMediterranean.com</a>
            </p>
        </footer>
      </body>
    </html>
  )
}
