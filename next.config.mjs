// @ts-check

import remarkFrontmatter from "remark-frontmatter";
import withMDXFactory from "@next/mdx";

const withMDX = withMDXFactory({
  // NOTE: these are only used when an MDX file is imported using ES imports or
  // dynamic import. These options are not used when serializing MDX with
  // `next-mdx-remote`.
  options: {
    remarkPlugins: [remarkFrontmatter],
  },
});

const matomoOrigin = process.env.MATOMO_ORIGIN;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  rewrites: async () => [
    {
      // Proxy Matomo requests in an attempt to work around ad blockers
      source: "/tr/mat.js",
      destination: `${matomoOrigin}/matomo.js`,
    },
  ],
};

export default withMDX(nextConfig);
