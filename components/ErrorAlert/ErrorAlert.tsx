import styled from "@emotion/styled";
import { ReactNode, useEffect } from "react";
import {
  responsiveContainer,
  responsiveContainerInlinePadding,
} from "../../styles/layout";

export const ErrorAlert = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export const ErrorAlertContainer = styled("div")(
  responsiveContainer,
  responsiveContainerInlinePadding,
  ({ theme }) => ({
    backgroundColor: theme.color.error.background,
    border: `solid 1px ${theme.color.error.border}`,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  })
);

export const DevOnlyErrorDetails = ({ error }: { error: unknown }) => {
  useEffect(() => {
    // NOTE: log the error regardless of whether it is development or production.
    // Assumes there will be no confidential information in the error itself.
    console.log("Error occurred", error);
  });

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return <SerializedError>{JSON.stringify(error, null, 2)}</SerializedError>;
};

const SerializedError = styled("pre")(({ theme }) => ({
  backgroundColor: theme.color.background.light,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  border: `solid 1px ${theme.color.text.main}`,
  marginBlockStart: theme.spacing(2),
  marginBlockEnd: 0,
}));
