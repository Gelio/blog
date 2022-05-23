import type { PropsWithChildren } from "react";
import { css, Global, ThemeProvider } from "@emotion/react";
import { blogTheme } from "../styles/theme";
import { globalStyle } from "../styles/global";

export const StylesProvider = ({ children }: PropsWithChildren<unknown>) => (
  <ThemeProvider theme={blogTheme}>
    <Global styles={globalStyle} />
    <Global
      styles={css({
        body: {
          backgroundColor: blogTheme.color.background.main,
          color: blogTheme.color.text.main,
        },
      })}
    />

    {children}
  </ThemeProvider>
);
