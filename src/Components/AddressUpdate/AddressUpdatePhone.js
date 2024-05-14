import React, { useContext } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD
} from "../../utils/action-types";
import { store } from "./AddressUpdateContainer";

export function AddressUpdatePhone(props) {
  const {
    dispatch,
    state: { phone, phoneError }
  } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({
      type: SET_TEXT_FIELD,
      payload: { phone: value }
    });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "phoneError" });
  };

  return (
    <Input
      type="tel"
      autoComplete="phone"
      minLength="5"
      maxLength="20"
      value={phone}
      error={phoneError}
      onChange={(e) => handleInputChange(e.target.value)}
      onFocus={handleFocus}
      {...props}
    />
  );
}
