import styled from "@emotion/styled";
import Link from "next/link";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import {
  decorationOnHoverLinkStyle,
  headingStyle,
} from "../../styles/typography";
import { Layout } from "../Layout";
import { getTopicPagePath } from "../TopicPage";

export const TopicsPage = () => {
  const topics = [
    "architecture",
    "css",
    "blog",
    "rust",
    "frontend",
    "golang",
    "personal-projects",
    "pr-reviews",
    "today-i-learned",
  ];

  return (
    <Layout>
      <StyledMainContent>
        <StyledMainHeading>Topics I write about</StyledMainHeading>
      </StyledMainContent>

      <TopicsContainer>
        {topics.map((topic) => (
          <Link href={getTopicPagePath(topic)} passHref key={topic}>
            <TopicLink>{topic}</TopicLink>
          </Link>
        ))}
      </TopicsContainer>
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
  {
    marginTop: rem(spacing(2)),
    display: "flex",
    flexWrap: "wrap",
    columnGap: rem(spacing(3)),
    rowGap: rem(spacing(2)),
  }
);

const TopicLink = styled("a")(decorationOnHoverLinkStyle, ({ theme }) => ({
  color: theme.color.primary.main,
}));
