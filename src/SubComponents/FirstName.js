import React, { useContext } from "react";
import { Loader } from "../SubComponents/Loader";
import { SET_FIRST_NAME } from "../utils/action-types";
import { Input } from "./Input";

export function FirstName({ store, ...otherProps }) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_FIRST_NAME, payload: value });
  };

  if (state.loading) {
    return (
      <div className="pelcro-loader-wrapper">
        <Loader />
      </div>
    );
  }

  return (
    <Input
      type="text"
      value={state.firstName}
      onChange={(e) => handleInputChange(e.target.value)}
      {...otherProps}
    />
  );
}
