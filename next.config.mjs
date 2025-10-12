// @ts-check

import remarkFrontmatter from "remark-frontmatter";
import createMDX from "@next/mdx";

const withMDX = createMDX({
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
  typedRoutes: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  /**
   * Globs pointing to files that are necessary during Incremental Static
   * Generation of content resources.
   *
   * Globs are relative to the root of the repository.
   *
   * They are needed because otherwise Next will exclude these files from the runtime environment of ISG.
   *
   * @see https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#caveats
   */
  outputFileTracingIncludes: {
    "/article/*": [
      // NOTE: the `*.*` is mandatory so that minimatch returns only files (with an
      // extension) and not directories. Otherwise, Next logs an EISDIR when
      // processing matches.
      "content-indexes/**/*.*",
      "content/**/*.*",
      // NOTE: static content is inspected by rehype-img-size to determine image dimensions
      "public/static-content/**/*.*",
    ],
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
