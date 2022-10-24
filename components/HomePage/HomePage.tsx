import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import type { ReadAllArticlesIndexError } from "../../content-processing/indexes";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";

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
import { Layout } from "../Layout";
import { Paragraph } from "../text";

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
      <HeadMetaDescription>
        A list of the most recent articles published on Greg&apos;s blog.
      </HeadMetaDescription>

      <StyledMainContent>
        <Paragraph>Hey, I&apos;m Greg, welcome to my blog!</Paragraph>
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
