import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import { ReadAllArticlesIndexError } from "../../content-processing/indexes";

import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import {
  IndexedArticleMetadataWithSerializedSummary,
  IndexedArticleCard,
} from "../ArticleCard";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { HeadDocumentTitle } from "../HeadDocumentTitle";
import { Layout } from "../Layout";

interface HomePageProps {
  allArticlesResult: either.Either<
    ReadAllArticlesIndexError,
    readonly IndexedArticleMetadataWithSerializedSummary[]
  >;
}

export const HomePage = ({ allArticlesResult }: HomePageProps) => {
  return (
    <Layout>
      <HeadDocumentTitle>Greg Rozdzialik</HeadDocumentTitle>

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
                <IndexedArticleCard metadata={article} key={article.slug} />
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
