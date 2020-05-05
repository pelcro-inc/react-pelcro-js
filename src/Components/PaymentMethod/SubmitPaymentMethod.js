import React, { useContext, useEffect, useMemo } from "react";
import Submit from "../common/Submit";
import { store } from "./PaymentMethodViewContainer";
import { SUBMIT_PAYMENT } from "../../utils/action-types";

export const SubmitPaymentMethod = ({ name, style, className }) => {
  const {
    dispatch,
    state: { disableSubmit },
  } = useContext(store);

  useEffect(() => console.log("SubmitCheckoutForm mounted"), []);

  return useMemo(
    () => (
      <Submit
        onClick={() => dispatch({ type: SUBMIT_PAYMENT })}
        text={name}
        disabled={disableSubmit}
        style={style}
        className={className}
      />
    ),
    [className, name, disableSubmit, style]
  );
};
