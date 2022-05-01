import styled from "@emotion/styled";

import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { Tags } from "../Tags";

interface ArticleHeaderProps {
  title: string;
  createdDate: string;
  readingDuration: string;
  tagNames: string[];
}

export const ArticleHeader = ({
  title,
  createdDate,
  readingDuration,
  tagNames,
}: ArticleHeaderProps) => (
  <StyledArticleHeader>
    <StyledArticleTitle>{title}</StyledArticleTitle>

    <StyledArticleMetaContainer>
      <StyledArticleMetaItem>{createdDate}</StyledArticleMetaItem>
      <StyledArticleMetaItem>{readingDuration}</StyledArticleMetaItem>
      <StyledArticleMetaItem>
        <Tags names={tagNames} />
      </StyledArticleMetaItem>
    </StyledArticleMetaContainer>
  </StyledArticleHeader>
);

const StyledArticleHeader = styled("div")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  {
    marginBlockEnd: rem(spacing(2)),
  }
);

const StyledArticleTitle = styled("h1")({
  fontWeight: "normal",
  fontSize: rem(28),
  // NOTE: reset the default margin-block-start
  marginBlockStart: 0,
  marginBlockEnd: rem(spacing(1)),
});

const StyledArticleMetaContainer = styled("div")({
  display: "flex",
  columnGap: rem(spacing(4)),
  rowGap: rem(spacing(1)),
  flexWrap: "wrap",
});

const StyledArticleMetaItem = styled("span")(({ theme }) => ({
  color: theme.color.text.desaturated,
  fontSize: rem(16),
}));
