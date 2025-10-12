import styles from "./Footer.module.css";

export const Footer = () => (
  <footer
    className={`responsive-container responsive-container-inline-padding ${styles.footer}`}
  >
    &copy; 2022-present Grzegorz Rozdzialik. All Rights Reserved.
  </footer>
);
