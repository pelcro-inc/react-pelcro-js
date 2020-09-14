import React, { useContext, useEffect } from "react";
import { SET_SELECT } from "../utils/action-types";

/**
 *
 */
export function Select({
  options = [],
  fieldName,
  placeholder = "",
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const { dispatch, state } = useContext(store);

  const createSelectItems = () => {
    return options.map((option) => (
      <option key={option.key} value={option.value}>
        {option.value}
      </option>
    ));
  };

  const onSelect = (e) => {
    dispatch({
      type: SET_SELECT,
      payload: { [fieldName]: e.target.value }
    });
  };

  return (
    <select
      value={state[fieldName]}
      onChange={onSelect}
      className={className}
      autoComplete="state"
      id="pelcro-input-state"
      {...otherProps}
    >
      {" "}
      (placeholder &&
      <option value="" disabled selected>
        {placeholder}
      </option>
      ){createSelectItems()}
    </select>
  );
}
