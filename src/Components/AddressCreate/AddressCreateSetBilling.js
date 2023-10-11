import React, { useContext } from "react";
import { store } from "./AddressCreateContainer";
import { Checkbox } from "../../SubComponents/Checkbox";
import { HANDLE_CHECKBOX_CHANGE } from "../../utils/action-types";

export const AddressCreateSetBilling = (props) => {
  const { dispatch } = useContext(store);

  const handleCheckboxChange = (e) => {
    dispatch({
      type: HANDLE_CHECKBOX_CHANGE,
      payload: { isBilling: e.target.checked }
    });
  };

  return (
    <Checkbox onChange={(e) => handleCheckboxChange(e)} id={props.id}>
      {props.label}
    </Checkbox>
  );
};
