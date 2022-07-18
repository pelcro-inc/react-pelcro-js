import React, { useContext } from "react";
import { store } from "./AddressCreateContainer";
import { Checkbox } from "../../SubComponents/Checkbox";
import { HANDLE_CHECKBOX_CHANGE } from "../../utils/action-types";

export const AddressCreateSetDefault = (props) => {
  const { dispatch, state } = useContext(store);

  const handleCheckboxChange = (e) => {
    dispatch({
      type: HANDLE_CHECKBOX_CHANGE,
      payload: { isDefault: e.target.checked }
    });
  };

  return (
    <Checkbox onChange={(e) => handleCheckboxChange(e)} id={props.id}>
      {props.label}
    </Checkbox>
  );
};
