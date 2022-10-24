import styled from "@emotion/styled";
import type { ComponentProps } from "react";

import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { articleTitleStyle } from "../../styles/typography";
import { ArticleMeta } from "../ArticleMeta";

interface ArticleHeaderProps extends ComponentProps<typeof ArticleMeta> {
  title: string;
}

export const ArticleHeader = ({
  title,
  createdDate,
  readingTimeMin: readingDuration,
  tagNames,
}: ArticleHeaderProps) => (
  <StyledArticleHeader>
    <StyledArticleTitle>{title}</StyledArticleTitle>

    <ArticleMeta
      createdDate={createdDate}
      readingTimeMin={readingDuration}
      tagNames={tagNames}
    />
  </StyledArticleHeader>
);

const StyledArticleHeader = styled("div")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  {
    marginBlockEnd: rem(spacing(2)),
  }
);

const StyledArticleTitle = styled("h1")(articleTitleStyle, {
  // NOTE: reset the default margin-block-start
  marginBlockStart: 0,
  marginBlockEnd: rem(spacing(1)),
});
