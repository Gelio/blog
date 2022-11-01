import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import type { ReadTopicIndexError } from "../../content-processing/indexes";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { headingStyle } from "../../styles/typography";
import {
  IndexedArticleMetadataWithSerializedSummary,
  IndexedArticleCard,
} from "../ArticleCard";
import { Button } from "../Button";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";
import { Layout } from "../Layout";
import { Paragraph } from "../text";

interface TopicPageProps {
  topicName: string;
  articlesResult: either.Either<
    ReadTopicIndexError,
    {
      articles: readonly IndexedArticleMetadataWithSerializedSummary[];
      description: string;
    }
  >;
}

export const TopicPage = ({ topicName, articlesResult }: TopicPageProps) => {
  return (
    <Layout>
      <HeadDocumentTitle>{topicName} articles</HeadDocumentTitle>

      <StyledMainContent>
        <StyledPageTitle>Articles about {topicName}</StyledPageTitle>

        <Paragraph>
          {pipe(
            articlesResult,
            either.match(
              // NOTE: error is shown below
              () => null,
              ({ description }) => description
            )
          )}
        </Paragraph>
      </StyledMainContent>

      {pipe(
        articlesResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <HeadMetaDescription>
                Articles about {topicName}.
              </HeadMetaDescription>
              <ErrorAlert>Could not read topic index.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          ({ articles, description }) => (
            <>
              <HeadMetaDescription>
                Articles about {topicName}. {description}
              </HeadMetaDescription>

              <StyledArticleCardsContainer>
                {articles.map((article) => (
                  <IndexedArticleCard metadata={article} key={article.slug} />
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

const StyledPageTitle = styled("h1")(headingStyle, ({ theme }) => ({
  marginBlockStart: theme.spacing(3),
  marginBlockEnd: theme.spacing(2),
}));

const StyledArticleCardsContainer = styled("div")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  })
);

const maxButtonsGap = "200px";
const StyledPaginationContainer = styled("div")(
  responsiveContainer,
  ({ theme }) => ({
    marginBlock: theme.spacing(3),
    paddingInline: theme.spacing(2),

    display: "grid",
    // NOTE: the gap must shrink if there is not enough space.
    // Using `column-gap` is not possible, because it does not allow using
    // `minmax`
    gridTemplateColumns: `1fr minmax(min-content, ${maxButtonsGap}) 1fr`,
  })
);

const NavigationButton = styled(Button)({
  marginBlockStart: 0,
});

const LeftButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
});
