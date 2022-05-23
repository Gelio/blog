import styled from "@emotion/styled";

import { rem, spacing } from "../../styles/theme";
import { Tags } from "../Tags";

interface ArticleMetaProps {
  createdDate: string;
  readingDuration: string;
  tagNames: string[];
}

export const ArticleMeta = ({
  createdDate,
  readingDuration,
  tagNames,
}: ArticleMetaProps) => (
  <StyledArticleMetaContainer>
    <StyledArticleMetaItem>{createdDate}</StyledArticleMetaItem>
    <StyledArticleMetaItem>{readingDuration}</StyledArticleMetaItem>
    <StyledArticleMetaItem>
      <Tags names={tagNames} />
    </StyledArticleMetaItem>
  </StyledArticleMetaContainer>
);

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
