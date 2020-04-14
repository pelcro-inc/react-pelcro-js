import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SET_STATE } from "../utils/action-types";

export function StateSelect({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const {
    dispatch,
    state: { country, countries, state, states }
  } = useContext(store);
  const { t } = useTranslation("address");

  const createStateItems = () => {
    const items = [];

    for (const stateItem in states) {
      if (states[stateItem].selected_country === country) {
        if (Array.isArray(states[stateItem].states)) {
          for (const state in states[stateItem].states) {
            const tmp = states[stateItem].states[state];
            items.push(
              <option key={tmp.code} value={tmp.code}>
                {tmp.name}
              </option>
            );
          }
          return items;
        } else {
          for (const key in states[stateItem].states) {
            items.push(
              <option key={key} value={key}>
                {states[stateItem].states[key]}
              </option>
            );
          }
          return items;
        }
      }
    }
  };

  const onStateChange = e =>
    dispatch({ type: SET_STATE, payload: e.target.value });

  if (countries.includes(country)) {
    return (
      <select
        value={state}
        onChange={onStateChange}
        className={className}
        autoComplete="state"
        id="pelcro-input-state"
        {...otherProps}
      >
        <option>{t("region")}</option>
        {createStateItems()}
      </select>
    );
  } else
    return (
      <input
        type="text"
        value={state}
        onChange={onStateChange}
        className={className}
        autoComplete="country"
        id="pelcro-input-country"
        placeholder={t("labels.region")}
        {...otherProps}
      />
    );
}
