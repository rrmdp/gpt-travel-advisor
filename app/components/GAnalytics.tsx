'use client';

export function AnalyticsWrapper() {
  return (
  <>
  <script async src={`https://www.googletagmanager.com/gtag/js?id=G-C8TNC8YH0T`} />
  <script
  dangerouslySetInnerHTML={{
    __html:`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-C8TNC8YH0T', {
      page_path:window.location.pathname,        
    });   
    `   
  }}
    />
  </>
)}