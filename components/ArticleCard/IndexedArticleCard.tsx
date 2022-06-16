import styled from "@emotion/styled";
import { task } from "fp-ts";
import { pipe } from "fp-ts/function";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { IndexedArticleMetadata } from "../../content-processing/indexes/schema";
import { StyledArticleParagraph } from "../ArticlePage/styled-components";
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
      <MDXRemote
        {...metadata.summary}
        components={{
          p: StyledArticleCardSummary,
        }}
      />
    }
  />
);

const StyledArticleCardSummary = styled(StyledArticleParagraph)({
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
