import { css } from "@emotion/react";
import { pxToRem } from "./theme";

export const articleTitleStyle = css({
  fontSize: pxToRem(28),
  fontWeight: "normal",
});

export const headingStyle = css({
  fontSize: pxToRem(28),
  fontWeight: "normal",
});

export const decorationOnHoverLinkStyle = css({
  textDecoration: "none",
  [":hover"]: {
    textDecoration: "underline",
  },
});
