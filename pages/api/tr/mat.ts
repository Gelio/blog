import type { NextApiRequest } from "next";

export const config = {
  runtime: "experimental-edge",
};

export const matomoEncodedQueryParamName = "q";

const proxyDeobfuscatedQueryParamsToMatomo = (request: NextApiRequest) => {
  const url = new URL(
    // SAFETY: the URL will always be defined in Next.js API routes.
    // It is a TS false-positive.
    request.url!,
    process.env.MATOMO_ORIGIN
  );

  const encodedMatomoSearchParams = url.searchParams.get(
    matomoEncodedQueryParamName
  );
  if (!encodedMatomoSearchParams) {
    return new Response(
      JSON.stringify({
        error: `Missing query parameter ${matomoEncodedQueryParamName}`,
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const matomoSearchParams = atob(encodedMatomoSearchParams);
  const trackingUrl = new URL("/matomo.php", process.env.MATOMO_ORIGIN);
  trackingUrl.search = matomoSearchParams;

  return fetch(trackingUrl, {
    method: request.method!,
    redirect: "manual",
  });
};

export default proxyDeobfuscatedQueryParamsToMatomo;
