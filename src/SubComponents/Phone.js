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
  const {
    dispatch,
    state: { phone: stateValue }
  } = useContext(store);
  const [value, setValue] = useState(stateValue);

  const handleInputChange = useCallback(
    value => {
      setValue(value);

      dispatch({ type: SET_PHONE, payload: value });
    },
    [dispatch, value]
  );

  return (
    <React.Fragment>
      <input
        type="text"
        id={id}
        style={{ ...style }}
        className={className}
        value={value || window.Pelcro.user.read().phone}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder || "Phone"}
        {...otherProps}
      ></input>
    </React.Fragment>
  );
}
