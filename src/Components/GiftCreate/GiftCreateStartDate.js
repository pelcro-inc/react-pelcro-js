import React, { useContext } from "react";
import { store } from "./GiftCreateContainer";
import { Loader } from "../../SubComponents/Loader";
import { DatePicker } from "../../SubComponents/DatePicker";
import { SET_START_DATE } from "../../utils/action-types";

const nowDate = new Date().toISOString().substr(0, 10);
export const GiftCreateStartDate = (props) => {
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_START_DATE, payload: value });
  };

  if (state.loading) {
    return <Loader />;
  }

  return (
    <DatePicker
      min={nowDate}
      value={state.startDate}
      onChange={(e) => handleInputChange(e.target.value)}
      {...props}
    />
  );
};
