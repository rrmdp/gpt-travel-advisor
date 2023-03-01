'use client';
import { GoogleAnalytics } from "nextjs-google-analytics";

export function AnalyticsWrapper() {
  return <GoogleAnalytics strategy="lazyOnload" gaMeasurementId={`G-C8TNC8YH0T`} trackPageViews />;
}