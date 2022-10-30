import type { AppProps } from "next/app";
import Head from "next/head";
import { MatomoTrackingScript } from "../lib/matomo";
import { StylesProvider } from "../styles/provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider>
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
    </StylesProvider>
  );
}

export default MyApp;
