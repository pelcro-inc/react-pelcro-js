import React, { useContext, useMemo } from "react";
import {
  SET_MONTH
} from "../utils/action-types";
import { Select } from "./Select";

export function MonthSelect({ placeholder, store, ...otherProps }) {
  const {
    dispatch,
    state: { month }
  } = useContext(store);

  const get2digits = (num) => num < 10 ? ("0" + num.toString()) : num.toString()

  const createMonthsItems = useMemo(() => {
    return [...Array.from({length: 12}, (_, i) => i + 1)].map(i => {
      return <option key={i} value={get2digits(i)}>
      {get2digits(i)}
    </option>
    });
  }, []);

  const handleInputChange = (value) => {
    dispatch({ type: SET_MONTH, payload: value });
  };

  return (
    <Select
      value={month}
      onChange={(e) => handleInputChange(e.target.value)}
      {...otherProps}
    >
      <option value="" disabled selected>
        {placeholder}
      </option>
      {createMonthsItems}
    </Select>
  );
}
