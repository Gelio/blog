import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  /**
   * Matomo API
   * @see https://developer.matomo.org/guides/tracking-javascript-guide
   * @see https://developer.matomo.org/api-reference/tracking-javascript
   */
  var _paq: unknown[];
}

const scriptUrl = "/tr/mat.js";
const trackerUrl = "/tr/mat";

const initializeMatomo = () => {
  const _paq = (window._paq = window._paq || []);

  // NOTE: disable cookies to avoid having to ask for consent before setting
  // cookies.
  // We trade some data accuracy for a friendlier UX.
  // @see https://matomo.org/faq/new-to-piwik/how-do-i-use-matomo-analytics-without-consent-or-cookie-banner/
  _paq.push(["disableCookies"]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);
  _paq.push(["setTrackerUrl", trackerUrl]);
  _paq.push(["setSiteId", "1"]);
};

const useMatomo = () => {
  const router = useRouter();

  useEffect(() => {
    initializeMatomo();
    const onRouteChangeComplete = (url: string) => {
      window._paq.push(["setCustomUrl", url]);
      window._paq.push(["setDocumentTitle", document.title]);
      window._paq.push(["trackPageView"]);
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () =>
      router.events.off("routeChangeComplete", onRouteChangeComplete);
  }, [router.events]);
};

export const MatomoTrackingScript = () => {
  useMatomo();

  return (
    <Script
      id="mtm"
      src={scriptUrl}
      defer
      async
      onError={(error) => {
        console.log("Failed to load Matomo", error);
      }}
    />
  );
};
