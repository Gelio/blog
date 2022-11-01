import styled from "@emotion/styled";

export const Button = styled("a")(({ theme }) => ({
  // NOTE: instance-specific
  marginBlockStart: theme.spacing(1),

  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.color.primary.main,
  color: theme.color.text.onDarkBackground,
  textTransform: "uppercase",
  textDecoration: "none",
  paddingBlock: theme.spacing(1),
  paddingInline: theme.spacing(2),
  transition: "all ease-in-out 200ms",
  fontSize: theme.pxToRem(14),
  lineHeight: 1.5,
  width: "fit-content",
  boxShadow: `${theme.shadow(0.25)} ${theme.color.shadow(0.25)}`,

  border: "none",

  ":hover": {
    backgroundColor: "#288FC8",
    boxShadow: `${theme.shadow(0.5)} ${theme.color.shadow(0.25)}`,
  },
}));
