import React, { useContext } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD,
  VALIDATE_FIELD
} from "../../utils/action-types";
import { store } from "./AddressUpdateContainer";

export function AddressUpdateLine1(props) {
  const {
    dispatch,
    state: { line1, line1Error }
  } = useContext(store);

  const handleBlur = () => {
    return dispatch({
      type: VALIDATE_FIELD,
      payload: "line1"
    });
  };

  const handleInputChange = (value) => {
    dispatch({ type: SET_TEXT_FIELD, payload: { line1: value } });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "line1Error" });
  };

  return (
    <Input
      type="text"
      autoComplete="street-address"
      value={line1}
      error={line1Error}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
