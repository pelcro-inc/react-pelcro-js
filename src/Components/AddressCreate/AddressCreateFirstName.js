import React, { useContext, useEffect } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD
} from "../../utils/action-types";
import { store } from "./AddressCreateContainer";

export function AddressCreateFirstName({
  initWithUserFirstName = true,
  ...props
}) {
  const {
    dispatch,
    state: { firstName, firstNameError }
  } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_TEXT_FIELD, payload: { firstName: value } });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "firstNameError" });
  };

  // Initialize first name field with user's first name
  const loadFirstNameIntoField = () => {
    handleInputChange(window.Pelcro?.user?.read()?.first_name);
  };

  useEffect(() => {
    if (initWithUserFirstName) {
      loadFirstNameIntoField();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Input
      type="text"
      autoComplete="given-name"
      value={firstName}
      error={firstNameError}
      onChange={(e) => handleInputChange(e.target.value)}
      // onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
