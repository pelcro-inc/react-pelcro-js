import React, { useContext } from "react";
import Submit from "../common/Submit";
import { store } from "./CheckoutFormContainer";
import { SUBMIT_PAYMENT } from "../../utils/action-types";

export const SubmitCheckoutForm = ({ name, style, className }) => {
  const {
    dispatch,
    state: { disableSubmit }
  } = useContext(store);

  return (
    <Submit
      onClick={() => dispatch({ type: SUBMIT_PAYMENT })}
      text={name}
      disabled={disableSubmit}
      style={style}
      className={className}
    />
  );
};
