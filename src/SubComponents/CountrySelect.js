import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SET_COUNTRY } from "../utils/action-types";

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
    state: { country, countries }
  } = useContext(store);
  const { t } = useTranslation("address");

  const createCountryItems = () => {
    if (countries) {
      const items = [];

      countries.forEach(([abbr, country]) =>
        items.push(
          <option key={abbr} value={abbr}>
            {country}
          </option>
        )
      );

      return items;
    }
  };

  const onCountryChange = e =>
    dispatch({ type: SET_COUNTRY, payload: e.trarget.value });

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
