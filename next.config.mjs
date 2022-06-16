import remarkFrontmatter from "remark-frontmatter";
import withMDXFactory from "@next/mdx";

const withMDX = withMDXFactory({
  options: {
    remarkPlugins: [remarkFrontmatter],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default withMDX(nextConfig);
