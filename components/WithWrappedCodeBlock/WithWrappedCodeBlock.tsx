import type { ReactNode } from "react";
import styles from "./WithWrappedCodeBlock.module.css";

export const WithWrappedCodeBlock = ({ children }: { children: ReactNode }) => {
  return <div className={styles["code-block"]}>{children}</div>;
};
