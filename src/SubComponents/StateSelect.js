import React, { useContext } from "react";
import { Loader } from "../SubComponents/Loader";
import {
  RESET_FIELD_ERROR,
  SET_TEXT_FIELD,
  VALIDATE_FIELD
} from "../utils/action-types";
import { Select } from "./Select";

export function StateSelect({
  placeholder = "",
  store,
  ...otherProps
}) {
  const {
    dispatch,
    state: { country, state, stateError, states, isStateLoading }
  } = useContext(store);

  const createStateItems = () => {
    const items = [];
    if (states.selected_country === country) {
      if (Array.isArray(states.states)) {
        for (const state in states.states) {
          const tmp = states.states[state];
          items.push(
            <option key={tmp.code} value={tmp.code}>
              {tmp.name}
            </option>
          );
        }
        return items;
      } else {
        for (const key in states.states) {
          items.push(
            <option key={key} value={key}>
              {states.states[key]}
            </option>
          );
        }
        return items;
      }
    }
  };

  const handleInputChange = (value) => {
    dispatch({ type: SET_TEXT_FIELD, payload: { state: value } });
  };

  const handleBlur = () => {
    return dispatch({
      type: VALIDATE_FIELD,
      payload: "state"
    });
  };

  const handleFocus = () => {
    dispatch({
      type: RESET_FIELD_ERROR,
      payload: "stateError"
    });
  };

  if (isStateLoading || (!createStateItems() && country)) {
    return <Loader />;
  }

  return (
    <Select
      value={state}
      error={stateError}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      autoComplete="address-level1"
      {...otherProps}
    >
      <option value="" disabled selected>
        {placeholder}
      </option>
      {createStateItems()}
    </Select>
  );
}
