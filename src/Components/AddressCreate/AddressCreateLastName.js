import React, { useContext, useEffect } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD
} from "../../utils/action-types";
import { store } from "./AddressCreateContainer";

export function AddressCreateLastName({
  initWithUserLastName = true,
  ...props
}) {
  const {
    dispatch,
    state: { lastName, lastNameError }
  } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_TEXT_FIELD, payload: { lastName: value } });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "lastNameError" });
  };

  // Initialize first name field with user's first name
  const loadLastNameIntoField = () => {
    handleInputChange(window.Pelcro?.user?.read()?.last_name);
  };

  useEffect(() => {
    if (initWithUserLastName) {
      loadLastNameIntoField();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Input
      type="text"
      autoComplete="family-name"
      value={lastName}
      error={lastNameError}
      onChange={(e) => handleInputChange(e.target.value)}
      onFocus={handleFocus}
      {...props}
    />
  );
}
