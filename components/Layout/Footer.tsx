import styled from "@emotion/styled";
import { responsiveContainer } from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";

export const Footer = () => (
  <StyledFooterText>
    &copy; 2022-present Grzegorz Rozdzialik. All Rights Reserved.
  </StyledFooterText>
);

const StyledFooterText = styled("footer")(responsiveContainer, ({ theme }) => ({
  paddingInlineStart: spacing(1),
  color: theme.color.text.desaturated,
  fontSize: rem(10),
  paddingBlockEnd: spacing(1),
  height: rem(spacing(4)),

  display: "flex",
  alignItems: "end",
}));
