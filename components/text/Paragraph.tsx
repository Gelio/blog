import styled from "@emotion/styled";

export const Paragraph = styled("p")(({ theme }) => ({
  lineHeight: 1.5,
  marginBlockStart: 0,
  marginBlockEnd: theme.spacing(3),
  fontSize: theme.pxToRem(18),
}));

export const ParagraphLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.color.primary.main,
}));
