import styled from "@emotion/styled";
import Link from "next/link";
import { ComponentProps, ElementType, ReactNode } from "react";

import { rem, spacing } from "../../styles/theme";
import { articleTitleStyle } from "../../styles/typography";
import { ArticleMeta } from "../ArticleMeta";
import { StyledArticleParagraph } from "../ArticlePage";

interface ArticleCardProps extends ComponentProps<typeof ArticleMeta> {
  className?: string;
  title: string;
  summary: ReactNode;
  titleAs?: ElementType;
}

export const ArticleCard = ({
  title,
  titleAs,
  summary,
  className,
  tagNames,
  readingDuration,
  createdDate,
}: ArticleCardProps) => (
  <StyledArticleCardContainer className={className} as="article">
    <StyledArticleCardTitle as={titleAs}>{title}</StyledArticleCardTitle>

    <ArticleMeta
      readingDuration={readingDuration}
      createdDate={createdDate}
      tagNames={tagNames}
    />

    <StyledArticleCardSummary>{summary}</StyledArticleCardSummary>

    <Link href="/article/abc" passHref>
      <StyledButton>Read more</StyledButton>
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

const StyledButton = styled("a")(({ theme }) => ({
  // NOTE: instance-specific
  marginBlockStart: rem(spacing(1)),

  borderRadius: rem(spacing(0.5)),
  backgroundColor: theme.color.primary.main,
  color: theme.color.text.onDarkBackground,
  textTransform: "uppercase",
  textDecoration: "none",
  paddingBlock: rem(spacing(1)),
  paddingInline: rem(spacing(2)),
  transition: "background-color ease-in-out 200ms",
  fontSize: rem(14),
  lineHeight: 1.5,
  width: "fit-content",

  border: "none",

  ":hover": {
    backgroundColor: "#288FC8",
  },
}));

const StyledArticleCardTitle = styled("h2")(articleTitleStyle, { margin: 0 });
