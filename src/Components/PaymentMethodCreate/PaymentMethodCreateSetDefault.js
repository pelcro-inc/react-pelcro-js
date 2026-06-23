import React, { useEffect, useContext } from "react";
import { Checkbox } from "../../SubComponents/Checkbox";
import {
  HANDLE_CHECKBOX_CHANGE,
  SET_IS_DEFAULT_PAYMENT_METHOD
} from "../../utils/action-types";
import { store } from "../PaymentMethod/PaymentMethodContainer";

/**
 * Renders a "Set as default" checkbox in the Add Payment Method modal.
 *
 * Visibility is gated by `window.Pelcro.uiSettings.showSetAsDefaultOnCreate`
 * at the call site (PaymentMethodView). Initial checked state mirrors
 * `window.Pelcro.uiSettings.defaultCheckedSetAsDefaultOnCreate`.
 *
 * Both flags default to `false` so no behaviour change for tenants that
 * have not explicitly opted in.
 */
export function PaymentMethodCreateSetDefault(props) {
  const {
    dispatch,
    state: { isDefault }
  } = useContext(store);

  useEffect(() => {
    const defaultChecked = Boolean(
      window.Pelcro?.uiSettings?.defaultCheckedSetAsDefaultOnCreate
    );

    if (defaultChecked) {
      dispatch({
        type: SET_IS_DEFAULT_PAYMENT_METHOD,
        payload: { isDefault: true }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
