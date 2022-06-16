import Head from "next/head";

interface HeadDocumentTitleProps {
  children: string | string[];
}

export const HeadDocumentTitle = ({ children }: HeadDocumentTitleProps) => (
  <Head>
    {/* NOTE: `key` prevents creating multiple `title` tags in the `head` */}
    <title key="title">{children}</title>
  </Head>
);
