import React, { useContext } from "react";
import { SET_PHONE } from "../utils/action-types";
import { Input } from "./Input";

export function Phone({ store, ...otherProps }) {
  const {
    dispatch,
    state: { phone }
  } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_PHONE, payload: value });
  };

  return (
    <Input
      type="tel"
      value={phone}
      onChange={(e) => handleInputChange(e.target.value)}
      {...otherProps}
    />
  );
}
