import styled from "@emotion/styled";

import { ArticleCard } from "../ArticleCard";
import { Layout } from "../Layout";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";

export const HomePage = () => {
  return (
    <Layout>
      <StyledMainContent>
        Hey, I&apos;m Greg, welcome to my blog!
      </StyledMainContent>

      <StyledArticleCardsContainer>
        <ArticleCard
          readingTimeMin={14}
          createdDate="2022-05-01"
          tagNames={["blog", "architecture", "frontend"]}
          title="Blog hosting decisions"
          slug="blog-hosting-decisions"
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem."
          }
        />

        <ArticleCard
          readingTimeMin={14}
          createdDate="2022-05-01"
          tagNames={["blog", "architecture", "frontend"]}
          title="Blog hosting decisions"
          slug="blog-hosting-decisions"
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem."
          }
        />

        <ArticleCard
          readingTimeMin={14}
          createdDate="2022-05-01"
          tagNames={["blog", "architecture", "frontend"]}
          title="Blog hosting decisions"
          slug="blog-hosting-decisions"
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate sapien vel risus sagittis, et scelerisque ex elementum. Aliquam non porttitor justo, eu bibendum tortor. Vivamus a turpis sem."
          }
        />
      </StyledArticleCardsContainer>
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
