import React, { useContext } from "react";
import { Loader } from "../SubComponents/Loader";
import {
  RESET_FIELD_ERROR,
  VALIDATE_FIELD,
  SET_TEXT_FIELD
} from "../utils/action-types";
import { Select } from "./Select";

export function CountrySelect({ placeholder, store, ...otherProps }) {
  const {
    dispatch,
    state: { country, countryError, countries, isCountryLoading }
  } = useContext(store);

  const createCountryItems = () => {
    if (countries.length) {
      return countries.map(([abbr, country]) => (
        <option key={abbr} value={abbr}>
          {country}
        </option>
      ));
    }
  };

  const handleInputChange = (value) => {
    dispatch({ type: SET_TEXT_FIELD, payload: { country: value } });
  };

  const handleBlur = () => {
    return dispatch({
      type: VALIDATE_FIELD,
      payload: "country"
    });
  };

  const handleFocus = () => {
    dispatch({
      type: RESET_FIELD_ERROR,
      payload: "countryError"
    });
  };

  if (isCountryLoading) {
    return <Loader />;
  }

  return (
    <Select
      className="plc-pr-8"
      value={country}
      error={countryError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      autoComplete="country"
      {...otherProps}
    >
      <option value="" disabled selected>
        {placeholder}
      </option>
      {createCountryItems()}
    </Select>
  );
}
