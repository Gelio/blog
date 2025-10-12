import "../styles/global.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MatomoTrackingScript } from "../lib/matomo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MatomoTrackingScript />
      <Head>
        <link
          key="rss-feed"
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for gregroz.me"
          href="/rss.xml"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
