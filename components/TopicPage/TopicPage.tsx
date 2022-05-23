import styled from "@emotion/styled";
import { useRouter } from "next/router";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { headingStyle } from "../../styles/typography";
import { ArticleCard } from "../ArticleCard";
import { Layout } from "../Layout";

export const TopicPage = () => {
  const { query } = useRouter();
  const topicName = query.name as string;

  return (
    <Layout>
      <StyledMainContent>
        <StyledPageTitle>Articles about {topicName}</StyledPageTitle>

        <StyledTopicDescription>
          Architecture is important to consider in your applications. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          vulputate sapien vel risus sagittis, et scelerisque ex elementum.
          Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem.
        </StyledTopicDescription>
      </StyledMainContent>

      <StyledArticleCardsContainer>
        <ArticleCard
          readingDuration="14 minutes"
          createdDate="2022-05-01"
          tagNames={["blog", "architecture", "frontend"]}
          title="Blog hosting decisions"
          slug="blog-hosting-decisions"
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem."
          }
        />

        <ArticleCard
          readingDuration="14 minutes"
          createdDate="2022-05-01"
          tagNames={["blog", "architecture", "frontend"]}
          title="Blog hosting decisions"
          slug="blog-hosting-decisions"
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem."
          }
        />

        <ArticleCard
          readingDuration="14 minutes"
          createdDate="2022-05-01"
          tagNames={["blog", "architecture", "frontend"]}
          title="Blog hosting decisions"
          slug="blog-hosting-decisions"
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem."
          }
        />
      </StyledArticleCardsContainer>

      {/* TODO: Newer/Older buttons */}
    </Layout>
  );
};

const StyledMainContent = styled("main")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  pageContentMarginTop
);

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
