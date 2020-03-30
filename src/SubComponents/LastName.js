import React, { useContext } from "react";
import { SET_LAST_NAME } from "../utils/action-types";

export function LastName({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = value => {
    dispatch({ type: SET_LAST_NAME, payload: value });
  };

  return (
    <input
      type="text"
      id={id}
      style={{ ...style }}
      className={className}
      value={state.lastName || window.Pelcro.user.read().last_name}
      onChange={e => handleInputChange(e.target.value)}
      placeholder={placeholder || "Enter Your Last Name"}
      {...otherProps}
    ></input>
  );
}
