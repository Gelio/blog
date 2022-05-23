import { css } from "@emotion/react";

import { rem } from "./theme";

export const articleTitleStyle = css({
  fontSize: rem(28),
  fontWeight: "normal",
});

export const headingStyle = css({
  fontSize: rem(20),
  fontWeight: "normal",
});

export const decorationOnHoverLinkStyle = css({
  textDecoration: "none",
  [":hover"]: {
    textDecoration: "underline",
  },
});
