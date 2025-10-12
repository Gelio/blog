import type { PropsWithChildren } from "react";
import styles from "./Layout.module.css";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: PropsWithChildren<unknown>) => (
  <div className={styles["layout-container"]}>
    <Header />
    <main className={styles["main-container"]}>{children}</main>
    <Footer />
  </div>
);
