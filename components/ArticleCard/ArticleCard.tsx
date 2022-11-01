import styled from "@emotion/styled";
import Link from "next/link";
import type { ComponentProps, ElementType, ReactNode } from "react";

import { articleTitleStyle } from "../../styles/typography";
import { ArticleMeta } from "../ArticleMeta";
import { getArticlePagePath } from "../ArticlePage/route";
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
  <StyledArticleCardContainer className={className}>
    <StyledArticleCardTitle as={titleAs}>{title}</StyledArticleCardTitle>

    <ArticleMeta
      readingTimeMin={readingTimeMin}
      createdDate={createdDate}
      tagNames={tagNames}
    />

    <div>{summary}</div>

    <Link href={getArticlePagePath(slug)} passHref>
      <Button aria-label={`Read the article "${title}"`}>Read more</Button>
    </Link>
  </StyledArticleCardContainer>
);

const StyledArticleCardContainer = styled("article")(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: theme.color.primary.light,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

const StyledArticleCardTitle = styled("h2")(articleTitleStyle, { margin: 0 });
