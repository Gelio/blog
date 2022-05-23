import type { AppProps } from "next/app";
import { StylesProvider } from "../styles/provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StylesProvider>
      <Component {...pageProps} />
    </StylesProvider>
  );
}

export default MyApp;
