import React, { useContext, useEffect } from "react";
import { DotLoader } from "react-fancy-loader";
import { useTranslation } from "react-i18next";
import { SET_COUNTRY, SET_COUNTRIES } from "../utils/action-types";
import { sortCountries } from "../utils/utils";
import { showError } from "../utils/showing-error";

/**
 *
 */
export function CountrySelect({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const {
    dispatch,
    state: { country, countries, loading }
  } = useContext(store);
  const { t } = useTranslation("address");

  const getCountryList = () => {
    window.Pelcro.geolocation.getCountryList(setCountries);
  };

  const setCountries = (error, tmp) => {
    if (error) {
      showError(error.message, "pelcro-error-address");
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

  const onCountryChange = e => {
    dispatch({ type: SET_COUNTRY, payload: e.target.value });
  };

  if (loading) {
    return (
      <div style={{ marginTop: 20 }}>
        <DotLoader size={4} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <select
        value={country}
        onChange={onCountryChange}
        className={className}
        autoComplete="country"
        {...otherProps}
      >
        <option></option>
        {createCountryItems()}
      </select>
    </React.Fragment>
  );
}
