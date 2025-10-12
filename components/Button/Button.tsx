import type { HTMLAttributes } from "react";
import styles from "./Button.module.css";

export const Button = (props: HTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={`${styles.button} ${props.className}`} />
);
