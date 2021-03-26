import React, { useContext } from "react";
import { Loader } from "../SubComponents/Loader";
import { Input } from "../SubComponents/Input";
import { SET_DISPLAY_NAME } from "../utils/action-types";

export function DisplayName({ store, ...otherProps }) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_DISPLAY_NAME, payload: value });
  };

  if (state.loading) {
    return <Loader />;
  }

  return (
    <Input
      type="text"
      value={state.displayName || null}
      onChange={(e) => handleInputChange(e.target.value)}
      {...otherProps}
    />
  );
}
