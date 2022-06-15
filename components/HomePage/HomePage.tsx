import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";

import { readAllContentIndex } from "../../content-processing/indexes";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { ArticleCard } from "../ArticleCard";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { Layout } from "../Layout";

interface HomePageProps {
  allPostsResult: Awaited<ReturnType<typeof readAllContentIndex>>;
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
                  key={post.contentMetadata.slug}
                  readingTimeMin={post.contentMetadata.readingTimeMin}
                  createdDate={post.contentMetadata.date}
                  tagNames={post.contentMetadata.tags}
                  title={post.contentMetadata.title}
                  slug={post.contentMetadata.slug}
                  summary={
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem."
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
