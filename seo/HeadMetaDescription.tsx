import Head from "next/head";

interface HeadMetaDescriptionProps {
  children: string | string[];
}

export const HeadMetaDescription = ({ children }: HeadMetaDescriptionProps) => (
  <Head>
    <meta
      // NOTE: `key` prevents creating multiple `meta description` tags in the `head`
      key="meta-description"
      name="description"
      content={Array.isArray(children) ? children.join("") : children}
    />
  </Head>
);
