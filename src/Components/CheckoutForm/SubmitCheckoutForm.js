import React, { useContext, useEffect } from "react";
import Submit from "../common/Submit";
import { store } from "./CheckoutFormContainer";
import { SUBMIT_PAYMENT, CREATE_PAYMENT } from "../../utils/action-types";

export const SubmitCheckoutForm = ({ stripe, disableSubmit, name }) => {
  const {
    dispatch,
    state: { token }
  } = useContext(store);

  useEffect(() => {
    console.log({ token });
    if (token) {
      return dispatch({ actionType: CREATE_PAYMENT, payload: token });
    }
    return undefined;
  }, [token]);

  return (
    <Submit
      onClick={() => dispatch({ type: SUBMIT_PAYMENT })}
      text={name}
      disabled={disableSubmit}
    />
  );
};
