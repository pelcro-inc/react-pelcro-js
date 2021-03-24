import React, { useContext } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD,
  VALIDATE_FIELD
} from "../../utils/action-types";
import { store } from "./AddressCreateContainer";

export function AddressCreateLastName(props) {
  const {
    dispatch,
    state: { lastName, lastNameError }
  } = useContext(store);

  const handleBlur = () => {
    return dispatch({
      type: VALIDATE_FIELD,
      payload: "lastName"
    });
  };

  const handleInputChange = (value) => {
    dispatch({ type: SET_TEXT_FIELD, payload: { lastName: value } });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "lastNameError" });
  };

  return (
    <Input
      type="text"
      autoComplete="family-name"
      value={lastName}
      error={lastNameError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
