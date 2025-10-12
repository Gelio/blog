import { MDXProvider } from "@mdx-js/react";
import { task } from "fp-ts";
import { pipe } from "fp-ts/function";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { IndexedArticleMetadata } from "../../content-processing/indexes/schema";
import { baseMDXComponents } from "../mdx/components";
import { ArticleCard } from "./ArticleCard";
import styles from "./IndexedArticleCard.module.css";
import type { ReactNode } from "react";

export type IndexedArticleMetadataWithSerializedSummary = Omit<
  IndexedArticleMetadata,
  "summary"
> & {
  summary: MDXRemoteSerializeResult;
};

interface IndexedArticleCardProps {
  metadata: IndexedArticleMetadataWithSerializedSummary;
}

export const IndexedArticleCard = ({ metadata }: IndexedArticleCardProps) => (
  <ArticleCard
    readingTimeMin={metadata.readingTimeMin}
    createdDate={metadata.date}
    tagNames={metadata.tags}
    title={metadata.title}
    slug={metadata.slug}
    summary={
      <MDXProvider
        components={{
          ...baseMDXComponents,
          p: ArticleCardSummary,
        }}
      >
        <MDXRemote {...metadata.summary} />
      </MDXProvider>
    }
  />
);

const ArticleCardSummary = ({ children }: { children: ReactNode }) => (
  <p className={styles["article-card-summary"]}>{children}</p>
);

export const serializeSummaryInIndexedArticles = (
  articles: IndexedArticleMetadata[],
) =>
  pipe(
    articles.map((articleMetadata) => async () => ({
      ...articleMetadata,
      summary: await serialize(articleMetadata.summary),
    })),
    task.sequenceArray,
  );
