import React, { useContext } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD,
  VALIDATE_FIELD
} from "../../utils/action-types";
import { store } from "./AddressUpdateContainer";

export function AddressUpdateFirstName(props) {
  const {
    dispatch,
    state: { firstName, firstNameError }
  } = useContext(store);

  const handleBlur = () => {
    return dispatch({
      type: VALIDATE_FIELD,
      payload: "firstName"
    });
  };

  const handleInputChange = (value) => {
    dispatch({ type: SET_TEXT_FIELD, payload: { firstName: value } });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "firstNameError" });
  };

  return (
    <Input
      type="text"
      autoComplete="given-name"
      value={firstName}
      error={firstNameError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
