import React, { useContext } from "react";
import { Input } from "../../SubComponents/Input";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD,
  VALIDATE_FIELD
} from "../../utils/action-types";
import { store } from "./AddressUpdateContainer";

export function AddressUpdateCity(props) {
  const {
    dispatch,
    state: { city, cityError }
  } = useContext(store);

  const handleBlur = () => {
    return dispatch({
      type: VALIDATE_FIELD,
      payload: "city"
    });
  };

  const handleInputChange = (value) => {
    dispatch({
      type: SET_TEXT_FIELD,
      payload: { city: value }
    });
  };

  const handleFocus = () => {
    dispatch({ type: RESET_FIELD_ERROR, payload: "cityError" });
  };

  return (
    <Input
      type="text"
      autoComplete="address-level2"
      value={city}
      error={cityError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
