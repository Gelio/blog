import styled from "@emotion/styled";
import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";
import { rem, spacing } from "../../styles/theme";

export const Footer = () => (
  <StyledFooterText>
    &copy; 2022-present Grzegorz Rozdzialik. All Rights Reserved.
  </StyledFooterText>
);

const StyledFooterText = styled("footer")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  ({ theme }) => ({
    color: theme.color.text.desaturated,
    fontSize: rem(14),
    paddingBlockEnd: rem(spacing(2)),
    height: rem(spacing(5)),

    display: "flex",
    alignItems: "end",
  })
);
