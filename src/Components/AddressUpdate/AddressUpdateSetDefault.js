import React, { useContext } from "react";
import { Checkbox } from "../../SubComponents/Checkbox";
import { HANDLE_CHECKBOX_CHANGE } from "../../utils/action-types";
import { store } from "./AddressUpdateContainer";

export function AddressUpdateSetDefault(props) {
  const {
    dispatch,
    state: { isDefault }
  } = useContext(store);

  const handleCheckboxChange = (e) => {
    dispatch({
      type: HANDLE_CHECKBOX_CHANGE,
      payload: { isDefault: e.target.checked }
    });
  };

  return (
    <Checkbox
      onChange={(e) => handleCheckboxChange(e)}
      id={props.id}
      checked={isDefault}
    >
      {props.label}
    </Checkbox>
  );
}
