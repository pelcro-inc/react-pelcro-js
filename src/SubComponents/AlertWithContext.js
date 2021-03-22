import React, { useContext } from "react";
import { SHOW_ALERT } from "../utils/action-types";
import { Alert } from "./Alert";

export const AlertWithContext = ({ store, ...otherProps }) => {
  const {
    state: { alert },
    dispatch
  } = useContext(store);

  return (
    <>
      {alert.content && (
        <Alert
          type={alert.type}
          onClose={() =>
            dispatch({
              type: SHOW_ALERT,
              payload: { type: "error", content: "" }
            })
          }
          {...otherProps}
        >
          {alert.content}
        </Alert>
      )}
    </>
  );
};
