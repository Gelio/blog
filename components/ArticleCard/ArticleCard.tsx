import styled from "@emotion/styled";
import Link from "next/link";
import { ComponentProps, ElementType, ReactNode } from "react";

import { rem, spacing } from "../../styles/theme";
import { articleTitleStyle } from "../../styles/typography";
import { ArticleMeta } from "../ArticleMeta";
import { getArticlePagePath } from "../ArticlePage/route";
import { StyledArticleParagraph } from "../ArticlePage/styled-components";
import { Button } from "../Button";

interface ArticleCardProps extends ComponentProps<typeof ArticleMeta> {
  className?: string;
  title: string;
  slug: string;
  summary: ReactNode;
  titleAs?: ElementType;
}

export const ArticleCard = ({
  title,
  slug,
  titleAs,
  summary,
  className,
  tagNames,
  readingTimeMin,
  createdDate,
}: ArticleCardProps) => (
  <StyledArticleCardContainer className={className} as="article">
    <StyledArticleCardTitle as={titleAs}>{title}</StyledArticleCardTitle>

    <ArticleMeta
      readingTimeMin={readingTimeMin}
      createdDate={createdDate}
      tagNames={tagNames}
    />

    <StyledArticleCardSummary>{summary}</StyledArticleCardSummary>

    <Link href={getArticlePagePath(slug)} passHref>
      <Button>Read more</Button>
    </Link>
  </StyledArticleCardContainer>
);

const StyledArticleCardContainer = styled("div")(({ theme }) => ({
  borderRadius: rem(spacing(1)),
  backgroundColor: theme.color.primary.light,
  display: "flex",
  flexDirection: "column",
  gap: rem(spacing(1)),
  padding: rem(spacing(2)),
}));

const StyledArticleCardSummary = styled(StyledArticleParagraph)({
  margin: 0,
});

const StyledArticleCardTitle = styled("h2")(articleTitleStyle, { margin: 0 });
