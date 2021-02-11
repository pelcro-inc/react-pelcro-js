import React, { useContext } from "react";
import { Alert } from "./Alert";

export const AlertWithContext = ({ store, ...otherProps }) => {
  const {
    state: { alert }
  } = useContext(store);

  return (
    alert.content && (
      <Alert type={alert.type} {...otherProps}>
        {alert}
      </Alert>
    )
  );
};
