import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import type { ReadTopicIndexError } from "../../content-processing/indexes";
import { ContentMetadata } from "../../content-processing/indexes/utils";
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

type ContentMetadataWithSerializedSummary = Omit<ContentMetadata, "summary"> & {
  summary: MDXRemoteSerializeResult;
};
interface TopicPageProps {
  topicName: string;
  postsResult: either.Either<
    ReadTopicIndexError,
    readonly ContentMetadataWithSerializedSummary[]
  >;
}

export const TopicPage = ({ topicName, postsResult }: TopicPageProps) => {
  return (
    <Layout>
      <StyledMainContent>
        <StyledPageTitle>Articles about {topicName}</StyledPageTitle>

        {/* TODO: add topic description to indexes */}
        <StyledTopicDescription>
          {topicName} is important to consider in your applications. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate
          sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non
          porttitor justo, eu bibendum tortor. Vivamus a turpis sem.
        </StyledTopicDescription>
      </StyledMainContent>

      {pipe(
        postsResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <ErrorAlert>Could not read topic index.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          (posts) => (
            <>
              <StyledArticleCardsContainer>
                {posts.map((postMetadata) => (
                  <ArticleCard
                    key={postMetadata.slug}
                    readingTimeMin={postMetadata.readingTimeMin}
                    createdDate={postMetadata.date}
                    tagNames={postMetadata.tags}
                    title={postMetadata.title}
                    slug={postMetadata.slug}
                    summary={
                      <MDXRemote
                        {...postMetadata.summary}
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
