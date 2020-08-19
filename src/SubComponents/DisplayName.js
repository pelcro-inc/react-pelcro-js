import React, { useContext } from "react";
import { DotLoader } from "react-fancy-loader";
import { SET_DISPLAY_NAME } from "../utils/action-types";

/**
 *
 */
export function DisplayName({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_DISPLAY_NAME, payload: value });
  };

  if (state.loading) {
    return (
      <div style={{ marginTop: 20 }}>
        <DotLoader size={4} />
      </div>
    );
  }

  return (
    <input
      type="text"
      id={id}
      style={{ ...style }}
      className={className}
      value={state.displayName || null}
      onChange={(e) => handleInputChange(e.target.value)}
      placeholder={placeholder || "Enter Your Display Name"}
      {...otherProps}
    ></input>
  );
}
