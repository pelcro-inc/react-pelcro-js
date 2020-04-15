import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SET_COUNTRY, SET_COUNTRIES } from "../utils/action-types";
import { sortCountries } from "../utils/utils";
import { showError } from "../utils/showing-error";

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
    state: { country, countries },
  } = useContext(store);
  const { t } = useTranslation("address");

  const getCountryList = () => {
    window.Pelcro.geolocation.getCountryList(setCountries);
  };

  const setCountries = (error, tmp) => {
    if (error) {
      showError(error.message, "pelcro-error-address");
    } else if (tmp) {
      dispatch({ type: SET_COUNTRIES, payload: sortCountries(tmp.countries) });
    }
  };

  useEffect(() => {
    if (!countries.length) {
      getCountryList();
    }
  }, []);

  const createCountryItems = () => {
    if (countries.length) {
      console.log("createCountryItems -> countries", countries);

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

  return (
    <React.Fragment>
      <select
        value={country}
        onChange={onCountryChange}
        className={className}
        autoComplete="country"
        {...otherProps}
      >
        <option> {t("country")} </option>
        {createCountryItems()}
      </select>
    </React.Fragment>
  );
}
