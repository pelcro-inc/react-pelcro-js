import React, { useContext, useEffect } from "react";
import { Loader } from "../SubComponents/Loader";
import { SET_STATE, SET_STATES } from "../utils/action-types";
import { showError } from "../utils/showing-error";
import { Select } from "./Select";

export function StateSelect({
  placeholder = "",
  store,
  ...otherProps
}) {
  const {
    dispatch,
    state: { country, state, states, loading }
  } = useContext(store);

  useEffect(() => {
    const setStates = (error, tmp) => {
      if (error) {
        showError(error.message, "pelcro-error-address");
      } else if (tmp) {
        dispatch({ type: SET_STATES, payload: tmp });
      }
    };

    const getStateList = () => {
      window.Pelcro.geolocation.getStatesForCountry(
        country,
        setStates
      );
    };

    if (country) {
      getStateList();
    }
  }, [country]);

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

  const onStateChange = (e) => {
    dispatch({ type: SET_STATE, payload: e.target.value });
  };

  if (loading || (!createStateItems() && country)) {
    return <Loader />;
  }

  return (
    <Select
      value={state}
      onChange={onStateChange}
      autoComplete="state"
      {...otherProps}
    >
      <option value="" disabled selected>
        {placeholder}
      </option>
      {createStateItems()}
    </Select>
  );
}
