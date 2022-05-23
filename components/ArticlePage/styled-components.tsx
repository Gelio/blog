import styled from "@emotion/styled";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";
import { headingStyle } from "../../styles/typography";

export const StyledArticleSection = styled("section")(
  responsiveContainer,
  responsiveContainerInlinePadding
);

export const StyledArticleParagraph = styled("p")({
  lineHeight: 1.5,
  marginBlockStart: 0,
});

export const StyledArticleSectionHeading = styled("h2")(headingStyle, {
  marginBlockStart: rem(spacing(4)),
  marginBlockEnd: rem(spacing(1)),
});

export const StyledArticleParagraphLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.color.primary.main,
}));

export const StyledArticleContainer = styled("article")(pageContentMarginTop);
