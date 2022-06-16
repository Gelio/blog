import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import {
  ArticleMetadata,
  IndexReadError,
} from "../../content-processing/indexes/utils";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { ArticleCard } from "../ArticleCard";
import { StyledArticleParagraph } from "../ArticlePage";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { Layout } from "../Layout";

type ArticleMetadataWithSerializedSummary = Omit<ArticleMetadata, "summary"> & {
  summary: MDXRemoteSerializeResult;
};
interface HomePageProps {
  allPostsResult: either.Either<
    IndexReadError,
    readonly ArticleMetadataWithSerializedSummary[]
  >;
}

export const HomePage = ({ allPostsResult }: HomePageProps) => {
  return (
    <Layout>
      <StyledMainContent>
        Hey, I&apos;m Greg, welcome to my blog!
      </StyledMainContent>

      {pipe(
        allPostsResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <ErrorAlert>Could not read articles metadata.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          (posts) => (
            <StyledArticleCardsContainer>
              {posts.map((post) => (
                <ArticleCard
                  key={post.slug}
                  readingTimeMin={post.readingTimeMin}
                  createdDate={post.date}
                  tagNames={post.tags}
                  title={post.title}
                  slug={post.slug}
                  summary={
                    <MDXRemote
                      {...post.summary}
                      components={{
                        p: StyledArticleCardSummary,
                      }}
                    />
                  }
                />
              ))}
              {/* TODO: add pagination */}
            </StyledArticleCardsContainer>
          )
        )
      )}
    </Layout>
  );
};

const StyledMainContent = styled("main")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  pageContentMarginTop
);

const StyledArticleCardSummary = styled(StyledArticleParagraph)({
  margin: 0,
});

const StyledArticleCardsContainer = styled("div")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  {
    display: "flex",
    flexDirection: "column",
    gap: rem(spacing(2)),
    marginBlockStart: rem(spacing(2)),
  }
);
