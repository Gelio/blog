import { css } from "@emotion/react";
import { containerWidth } from "./theme";

export const responsiveContainer = css({
  width: "100%",
  maxWidth: containerWidth,
  marginInline: "auto",
});
