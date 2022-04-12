export const blogTheme = {
  color: {
    primary: {
      main: "#1D6891",
    },
    text: {
      main: "#2B2118",
      desaturated: "#777777",
    },
    background: {
      main: "#E7F3F6",
    },
  },
};

type BlogTheme = typeof blogTheme;

declare module "@emotion/react" {
  export interface Theme extends BlogTheme {}
}

export const htmlFontSizePx = 16;
/** Converts pixels (used in the mockups) into rems (used for accessible font scaling) */
export const rem = (px: number) => `${px / htmlFontSizePx}rem`;
/** Returns the number of pixels for consistent whitespace (margins, paddings) */
export const spacing = (multiple: number) => multiple * 8;

export const containerWidth = rem(800);
