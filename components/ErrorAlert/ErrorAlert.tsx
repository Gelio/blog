import { type ReactNode, useEffect } from "react";
import styles from "./ErrorAlert.module.css";

export const ErrorAlert = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export const ErrorAlertContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`responsive-container responsive-container-inline-padding ${styles.container}`}
    >
      {children}
    </div>
  );
};

export const DevOnlyErrorDetails = ({ error }: { error: unknown }) => {
  useEffect(() => {
    // NOTE: log the error regardless of whether it is development or production.
    // Assumes there will be no confidential information in the error itself.
    console.log("Error occurred", error);
  });

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <pre className={styles["serialized-error"]}>
      {JSON.stringify(error, null, 2)}
    </pre>
  );
};
