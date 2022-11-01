import styled from "@emotion/styled";

export const ArticleHeading2 = styled("h2")(({ theme }) => ({
  fontWeight: "normal",
  fontSize: theme.pxToRem(30),
  marginBlockStart: "3em",
  marginBlockEnd: "1em",
}));

export const ArticleHeading3 = styled("h3")(({ theme }) => ({
  fontWeight: "normal",
  fontSize: theme.pxToRem(24),
  marginBlockStart: "3em",
  marginBlockEnd: "1em",
}));
