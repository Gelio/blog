import { css } from "@emotion/react";
import { htmlFontSizePx } from "./theme";

export const globalStyle = css({
  "html, body": {
    padding: 0,
    margin: 0,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(", "),
  },

  html: {
    fontSize: htmlFontSizePx,
  },

  a: {
    color: "inherit",
  },

  "*": {
    boxSizing: "border-box",
  },
});
