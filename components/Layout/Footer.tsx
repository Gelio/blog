import styled from "@emotion/styled";
import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";

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
    fontSize: theme.pxToRem(14),
    paddingBlockEnd: theme.spacing(2),
    height: theme.spacing(5),

    display: "flex",
    alignItems: "end",
  })
);
