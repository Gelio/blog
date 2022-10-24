import styled from "@emotion/styled";
import { rem, spacing } from "../../styles/theme";

export const Paragraph = styled("p")({
  lineHeight: 1.5,
  marginBlockStart: 0,
  marginBlockEnd: rem(spacing(3)),
  fontSize: rem(18),
});

export const ParagraphLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.color.primary.main,
}));
