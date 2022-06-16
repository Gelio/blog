import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import type { ReadTopicIndexError } from "../../content-processing/indexes";
import { IndexedArticleMetadata } from "../../content-processing/indexes/schema";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { headingStyle } from "../../styles/typography";
import { ArticleCard } from "../ArticleCard";
import { StyledArticleParagraph } from "../ArticlePage/styled-components";
import { Button } from "../Button";
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
interface TopicPageProps {
  topicName: string;
  articlesResult: either.Either<
    ReadTopicIndexError,
    {
      articles: readonly ArticleMetadataWithSerializedSummary[];
      description: string;
    }
  >;
}

export const TopicPage = ({ topicName, articlesResult }: TopicPageProps) => {
  return (
    <Layout>
      <StyledMainContent>
        <StyledPageTitle>Articles about {topicName}</StyledPageTitle>

        <StyledTopicDescription>
          {pipe(
            articlesResult,
            either.match(
              // NOTE: error is shown below
              () => null,
              ({ description }) => description
            )
          )}
        </StyledTopicDescription>
      </StyledMainContent>

      {pipe(
        articlesResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <ErrorAlert>Could not read topic index.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          ({ articles }) => (
            <>
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
              </StyledArticleCardsContainer>

              {/* TODO: enable pagination after it works */}
              {false && (
                <StyledPaginationContainer>
                  <LeftButtonContainer>
                    <NavigationButton>Older</NavigationButton>
                  </LeftButtonContainer>

                  {/* NOTE: filler between the buttons */}
                  <div />

                  <NavigationButton>Newer</NavigationButton>
                </StyledPaginationContainer>
              )}
            </>
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

const StyledPageTitle = styled("h1")(headingStyle, {
  marginBlock: 0,
});

const StyledTopicDescription = styled("p")({
  marginBlockStart: rem(spacing(1)),
  marginBlockEnd: rem(spacing(2)),
});

const StyledArticleCardsContainer = styled("div")(responsiveContainer, {
  display: "flex",
  flexDirection: "column",
  gap: rem(spacing(2)),
});

const maxButtonsGap = rem(200);
const StyledPaginationContainer = styled("div")(responsiveContainer, {
  marginBlock: rem(spacing(3)),
  paddingInline: rem(spacing(2)),

  display: "grid",
  // NOTE: the gap must shrink if there is not enough space.
  // Using `column-gap` is not possible, because it does not allow using
  // `minmax`
  gridTemplateColumns: `1fr minmax(min-content, ${maxButtonsGap}) 1fr`,
});

const NavigationButton = styled(Button)({
  marginBlockStart: 0,
});

const LeftButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
});
