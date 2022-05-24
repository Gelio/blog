import styled from "@emotion/styled";
import { rem, spacing } from "../../styles/theme";

export const Button = styled("a")(({ theme }) => ({
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
