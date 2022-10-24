import styled from "@emotion/styled";
import {
  pageContentMarginTop,
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";

export const StyledArticleSection = styled("section")(
  responsiveContainer,
  responsiveContainerInlinePadding
);

export const StyledArticleContainer = styled("article")(pageContentMarginTop);
