import styled from "@emotion/styled";
import type { PropsWithChildren } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: PropsWithChildren<unknown>) => (
  <LayoutContainer>
    <Header />
    <MainContainer>{children}</MainContainer>
    <Footer />
  </LayoutContainer>
);

const LayoutContainer = styled("div")({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

// NOTE: places the footer at the bottom of the screen even if the content is
// shorter than 100vh
const MainContainer = styled("main")({
  flexGrow: 1,
});
