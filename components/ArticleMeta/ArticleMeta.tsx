import styled from "@emotion/styled";

import { rem, spacing } from "../../styles/theme";
import { Tags } from "../Tags";

interface ArticleMetaProps {
  createdDate: string;
  readingTimeMin: number;
  tagNames: string[];
}

export const ArticleMeta = ({
  createdDate,
  readingTimeMin,
  tagNames,
}: ArticleMetaProps) => (
  <StyledArticleMetaContainer>
    <StyledArticleMetaItem>
      {formatDateString(createdDate)}
    </StyledArticleMetaItem>
    <StyledArticleMetaItem>
      {formatReadingTime(readingTimeMin)}
    </StyledArticleMetaItem>
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

const formatDateString = (dateString: string) => {
  const date = new Date(dateString);

  return `${date.getFullYear()}-${padDateElement(
    date.getMonth() + 1
  )}-${padDateElement(date.getDate())}`;
};

const padDateElement = (value: number) => value.toString().padStart(2, "0");

const formatReadingTime = (readingTimeMin: number) => {
  const roundedReadingTimeMin = Math.ceil(readingTimeMin);

  return `${roundedReadingTimeMin} minute${
    roundedReadingTimeMin === 1 ? "" : "s"
  }`;
};
