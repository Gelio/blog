import { css } from "@emotion/react";
import { containerWidth, rem, spacing } from "./theme";

export const responsiveContainer = css({
  width: "100%",
  maxWidth: `calc(${containerWidth} + ${rem(2 * spacing(1))})`,
  marginInline: "auto",
});

export const responsiveContainerInlinePadding = css({
  paddingInline: rem(spacing(2)),
});

export const pageContentMarginTop = css({
  marginBlockStart: rem(spacing(2)),
});
