export const htmlFontSizePx = 16;

/** Converts pixels (used in the mockups) into rems (used for accessible font scaling) */
export const pxToRem = (px: number) => `${px / htmlFontSizePx}rem`;

/** Returns the number of pixels for consistent whitespace (margins, paddings) */
export const spacing = (multiple: number) => multiple * 8;

export const blogTheme = {
  color: {
    primary: {
      main: "#1D6891",
      light: "#BFE0F2",
    },
    text: {
      main: "#2B2118",
      desaturated: "#777777",
      onDarkBackground: "#ECF0F1",
    },
    background: {
      main: "#E7F3F6",
      light: "#FCFEFF",
    },
    error: {
      background: "#FFECEC",
      border: "rgba(43, 33, 24, 0.3)",
    },
    shadow: (alpha = 1) => `hsl(201, 67%, 34%, ${alpha})`,
  },
  spacing,
  pxToRem,
  /** The lengths used to define a box-shadow. Does not contain the color */
  shadow: (elevation: number) => {
    // Technique similar to
    // https://www.joshwcomeau.com/css/designing-shadows/#creating-a-consistent-environment
    const distance = spacing(elevation);
    return `${distance}px ${distance * 2}px ${distance * 2}px`;
  },
} as const;

type BlogTheme = typeof blogTheme;

declare module "@emotion/react" {
  export interface Theme extends BlogTheme {}
}

export const containerWidth = "800px";
