import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { matomoEncodedQueryParamName } from "../pages/api/tr/mat";

declare global {
  /**
   * Matomo API
   * @see https://developer.matomo.org/guides/tracking-javascript-guide
   * @see https://developer.matomo.org/api-reference/tracking-javascript
   */
  var _paq: unknown[];
}

const scriptPathname = "/tr/mat.js";
const trackerPathname = "/api/tr/mat";

const obfuscateMatomoSearchParams = (searchParams: string): string => {
  const trackerUrl = new URL(trackerPathname, window.location.origin);
  trackerUrl.searchParams.set(
    matomoEncodedQueryParamName,
    window.btoa(searchParams)
  );
  return (
    trackerUrl.search
      // NOTE: `search` returns the leading `?` as well.
      // We need to strip it because Matomo adds it itself.
      .slice(1)
  );
};

const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
if (!siteId) {
  throw new Error(
    "Site ID not specified. Please provide a valid Matomo site ID in NEXT_PUBLIC_MATOMO_SITE_ID environment variable"
  );
}

const initializeMatomo = () => {
  const _paq = (window._paq = window._paq || []);

  // NOTE: disable cookies to avoid having to ask for consent before setting
  // cookies.
  // We trade some data accuracy for a friendlier UX.
  // @see https://matomo.org/faq/new-to-piwik/how-do-i-use-matomo-analytics-without-consent-or-cookie-banner/
  _paq.push(["disableCookies"]);
  _paq.push(["setCustomRequestProcessing", obfuscateMatomoSearchParams]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);
  _paq.push(["setTrackerUrl", trackerPathname]);
  _paq.push(["setSiteId", siteId]);
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
      src={scriptPathname}
      defer
      async
      onError={(error) => {
        console.log("Failed to load Matomo", error);
      }}
    />
  );
};
