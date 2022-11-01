import { css } from "@emotion/react";
import { containerWidth, spacing } from "./theme";

export const responsiveContainer = css({
  width: "100%",
  maxWidth: `calc(${containerWidth} + ${2 * spacing(1)}px)`,
  marginInline: "auto",
});

export const responsiveContainerInlinePadding = css({
  paddingInline: spacing(2),
});

export const pageContentMarginTop = css({
  marginBlockStart: spacing(2),
});
