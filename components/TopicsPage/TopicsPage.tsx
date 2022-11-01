import styled from "@emotion/styled";
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import Link from "next/link";
import type { readTopicsSummaryIndex } from "../../content-processing/indexes/per-topic";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import {
  decorationOnHoverLinkStyle,
  headingStyle,
} from "../../styles/typography";
import {
  DevOnlyErrorDetails,
  ErrorAlert,
  ErrorAlertContainer,
} from "../ErrorAlert";
import { HeadDocumentTitle, HeadMetaDescription } from "../../seo";
import { Layout } from "../Layout";
import { getTopicPagePath } from "../TopicPage";

interface TopicsPageProps {
  topicsResult: Awaited<ReturnType<typeof readTopicsSummaryIndex>>;
}

export const TopicsPage = ({ topicsResult }: TopicsPageProps) => {
  return (
    <Layout>
      <HeadDocumentTitle>Topics</HeadDocumentTitle>
      <HeadMetaDescription>
        A list of topics that I write about on my blog.
      </HeadMetaDescription>

      <StyledMainContent>
        <StyledMainHeading>Topics I write about</StyledMainHeading>
      </StyledMainContent>

      {pipe(
        topicsResult,
        either.match(
          (error) => (
            <ErrorAlertContainer>
              <ErrorAlert>Could not read topics index file.</ErrorAlert>
              <DevOnlyErrorDetails error={error} />
            </ErrorAlertContainer>
          ),
          (topics) => (
            <TopicsContainer>
              {topics.map((topic) => (
                <TopicLink href={getTopicPagePath(topic)} key={topic}>
                  {topic}
                </TopicLink>
              ))}
            </TopicsContainer>
          )
        )
      )}
    </Layout>
  );
};

const StyledMainContent = styled("div")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  pageContentMarginTop
);

const StyledMainHeading = styled("h1")(headingStyle);

const TopicsContainer = styled("main")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  ({ theme }) => ({
    marginTop: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(2),
  })
);

const TopicLink = styled(Link)(decorationOnHoverLinkStyle, ({ theme }) => ({
  color: theme.color.primary.main,
  fontSize: theme.pxToRem(18),
}));
