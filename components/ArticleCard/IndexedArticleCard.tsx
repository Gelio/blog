import styled from "@emotion/styled";
import { MDXProvider } from "@mdx-js/react";
import { task } from "fp-ts";
import { pipe } from "fp-ts/function";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { IndexedArticleMetadata } from "../../content-processing/indexes/schema";
import { baseMDXComponents } from "../mdx";
import { Paragraph } from "../text";
import { ArticleCard } from "./ArticleCard";

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
          p: StyledArticleCardSummary,
        }}
      >
        <MDXRemote {...metadata.summary} />
      </MDXProvider>
    }
  />
);

const StyledArticleCardSummary = styled(Paragraph)({
  margin: 0,
});

export const serializeSummaryInIndexedArticles = (
  articles: IndexedArticleMetadata[]
) =>
  pipe(
    articles.map((articleMetadata) => async () => ({
      ...articleMetadata,
      summary: await serialize(articleMetadata.summary),
    })),
    task.sequenceArray
  );
