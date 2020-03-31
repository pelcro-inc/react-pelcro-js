import React, { useContext } from "react";
import { SET_TEXT_FIELD } from "../utils/action-types";

export function TextInput({
  placeholder,
  style,
  className,
  id,
  store,
  fieldName,
  ...otherProps
}) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = value => {
    dispatch({ type: SET_TEXT_FIELD, payload: { [fieldName]: value } });
  };

  return (
    <input
      type="text"
      id={id}
      style={{ ...style }}
      className={className}
      value={state[fieldName]}
      defaultValue={
        window.Pelcro.user.read().metadata &&
        window.Pelcro.user.read().metadata[fieldName]
      }
      onChange={e => handleInputChange(e.target.value)}
      placeholder={placeholder || fieldName}
      {...otherProps}
    ></input>
  );
}
