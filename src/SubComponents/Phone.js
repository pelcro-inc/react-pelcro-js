import React, { useContext, useState, useCallback } from "react";
import { SET_PHONE } from "../utils/action-types";

/**
 *
 */
export function Phone({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = useCallback(
    (value) => {
      dispatch({ type: SET_PHONE, payload: value });
    },
    [dispatch]
  );

  return (
    <React.Fragment>
      <input
        type="text"
        id={id}
        style={{ ...style }}
        className={className}
        value={state.phone}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder || "Phone"}
        {...otherProps}
      ></input>
    </React.Fragment>
  );
}
