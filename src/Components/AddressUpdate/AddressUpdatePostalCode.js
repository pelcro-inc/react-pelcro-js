import React, { useContext } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD,
  VALIDATE_FIELD
} from "../../utils/action-types";
import { store } from "./AddressUpdateContainer";

export function AddressUpdatePostalCode(props) {
  const {
    dispatch,
    state: { postalCode, postalCodeError }
  } = useContext(store);

  const handleBlur = () => {
    return dispatch({
      type: VALIDATE_FIELD,
      payload: "postalCode"
    });
  };

  const handleInputChange = (value) => {
    dispatch({
      type: SET_TEXT_FIELD,
      payload: { postalCode: value }
    });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "postalCodeError" });
  };

  return (
    <Input
      type="text"
      autoComplete="postal-code"
      value={postalCode}
      error={postalCodeError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
