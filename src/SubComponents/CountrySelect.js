import React, { useContext, useEffect } from "react";
import { Loader } from "../SubComponents/Loader";
import {
  SET_COUNTRY,
  SET_COUNTRIES,
  SHOW_ALERT
} from "../utils/action-types";
import { sortCountries } from "../utils/utils";
import { Select } from "./Select";

export function CountrySelect({ placeholder, store, ...otherProps }) {
  const {
    dispatch,
    state: { country, countries, loading }
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

  const onCountryChange = (e) => {
    dispatch({ type: SET_COUNTRY, payload: e.target.value });
  };

  if (loading) {
    return (
      <div className="state-select-loader">
        <Loader />
      </div>
    );
  }

  return (
    <Select
      value={country}
      onChange={onCountryChange}
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
