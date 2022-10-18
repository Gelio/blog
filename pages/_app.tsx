import type { AppProps } from "next/app";
import { MatomoTrackingScript } from "../lib/matomo";
import { StylesProvider } from "../styles/provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider>
      <MatomoTrackingScript />

      <Component {...pageProps} />
    </StylesProvider>
  );
}

export default MyApp;
