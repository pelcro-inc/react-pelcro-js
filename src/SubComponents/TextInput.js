import React, { useContext } from "react";
import { Loader } from "../SubComponents/Loader";
import { SET_TEXT_FIELD } from "../utils/action-types";
import { Input } from "./Input";

export function TextInput({ store, fieldName, ...otherProps }) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({
      type: SET_TEXT_FIELD,
      payload: { [fieldName]: value }
    });
  };

  if (state.loading) {
    return <Loader />;
  }

  return (
    <Input
      type="text"
      value={state[fieldName]}
      defaultValue={window.Pelcro.user.read()?.metadata?.[fieldName]}
      onChange={(e) => handleInputChange(e.target.value)}
      {...otherProps}
    />
  );
}
