import React, { useContext, useMemo } from "react";
import {
  SET_YEAR
} from "../utils/action-types";
import { Select } from "./Select";

export function YearSelect({ placeholder, store, ...otherProps }) {
  const {
    dispatch,
    state: { year }
  } = useContext(store);

  const createYearsItems = useMemo(() => {
    return Array.from(
      { length: 10 },
      (_, i) => i + new Date().getFullYear()
    ).map((i) => {
      return (
        <option key={i} value={i}>
          {i}
        </option>
      );
    });
  }, []);

  const handleInputChange = (value) => {
    dispatch({ type: SET_YEAR, payload: value });
  };

  return (
    <Select
      value={year}
      onChange={(e) => handleInputChange(e.target.value)}
      {...otherProps}
    >
      <option value="" disabled selected>
        {placeholder}
      </option>
      {createYearsItems}
    </Select>
  );
}
