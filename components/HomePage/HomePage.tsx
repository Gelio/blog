import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { ReadAllArticlesIndexError } from "../../content-processing/indexes";
import { IndexedArticleMetadata } from "../../content-processing/indexes/schema";

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

type ArticleMetadataWithSerializedSummary = Omit<
  IndexedArticleMetadata,
  "summary"
> & {
  summary: MDXRemoteSerializeResult;
};
interface HomePageProps {
  allArticlesResult: either.Either<
    ReadAllArticlesIndexError,
    readonly ArticleMetadataWithSerializedSummary[]
  >;
}

export const HomePage = ({ allArticlesResult }: HomePageProps) => {
  return (
    <Layout>
      <StyledMainContent>
        Hey, I&apos;m Greg, welcome to my blog!
      </StyledMainContent>

      {pipe(
        allArticlesResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <ErrorAlert>Could not read articles metadata.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          (articles) => (
            <StyledArticleCardsContainer>
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  readingTimeMin={article.readingTimeMin}
                  createdDate={article.date}
                  tagNames={article.tags}
                  title={article.title}
                  slug={article.slug}
                  summary={
                    <MDXRemote
                      {...article.summary}
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
