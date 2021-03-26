import React, { useContext, useEffect } from "react";
import { Loader } from "../SubComponents/Loader";
import {
  SET_COUNTRIES,
  SHOW_ALERT,
  RESET_FIELD_ERROR,
  VALIDATE_FIELD,
  SET_TEXT_FIELD
} from "../utils/action-types";
import { sortCountries } from "../utils/utils";
import { Select } from "./Select";

export function CountrySelect({ placeholder, store, ...otherProps }) {
  const {
    dispatch,
    state: { country, countryError, countries, loading }
  } = useContext(store);

  const getCountryList = () => {
    window.Pelcro.geolocation.getCountryList(setCountries);
  };

  const setCountries = (error, tmp) => {
    if (error) {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: error.message
        }
      });
    } else if (tmp) {
      dispatch({
        type: SET_COUNTRIES,
        payload: sortCountries(tmp.countries)
      });
    }
  };

  useEffect(() => {
    if (!countries.length) {
      getCountryList();
    }
  }, []);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <Select
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
