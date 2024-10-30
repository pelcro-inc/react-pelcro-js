import React, { useEffect, useContext } from "react";
import { Checkbox } from "../../SubComponents/Checkbox";
import {
  HANDLE_CHECKBOX_CHANGE,
  SET_IS_DEFAULT_PAYMENT_METHOD
} from "../../utils/action-types";
import { store } from "../PaymentMethod/PaymentMethodContainer";
import { usePelcro } from "../../hooks/usePelcro";

export function PaymentMethodUpdateSetDefault(props) {
  const {
    dispatch,
    state: { isDefault }
  } = useContext(store);

  const { paymentMethodToEdit } = usePelcro();

  useEffect(() => {
    if ( paymentMethodToEdit?.is_default ||props?.paymentMethodDefaultChecked ) {
      dispatch({
        type: SET_IS_DEFAULT_PAYMENT_METHOD,
        payload: { isDefault: true }
      });
    }
  }, [paymentMethodToEdit, props?.paymentMethodDefaultChecked]); // eslint-disable-line react-hooks/exhaustive-deps

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
      disabled={paymentMethodToEdit?.is_default}
    >
      {props.label}
    </Checkbox>
  );
}
