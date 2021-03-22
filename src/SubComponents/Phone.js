import React, { useContext, useState } from "react";
import { SET_PHONE } from "../utils/action-types";
import { Input } from "./Input";

export function Phone({ store, ...otherProps }) {
  const {
    dispatch,
    state: { phone: stateValue }
  } = useContext(store);
  const [value, setValue] = useState(stateValue);

  const handleInputChange = (value) => {
    setValue(value);
    dispatch({ type: SET_PHONE, payload: value });
  };

  return (
    <Input
      type="tel"
      value={value || window.Pelcro.user.read().phone}
      onChange={(e) => handleInputChange(e.target.value)}
      {...otherProps}
    />
  );
}
