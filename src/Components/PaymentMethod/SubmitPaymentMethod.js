import React, { useContext } from "react";
import { store } from "./PaymentMethodContainer";
import { SUBMIT_PAYMENT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";

export const SubmitPaymentMethod = ({ name, ...otherProps }) => {
  const {
    dispatch,
    state: { disableSubmit }
  } = useContext(store);

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: SUBMIT_PAYMENT })}
      disabled={disableSubmit}
      isFullWidth={true}
    >
      {name}
    </Button>
  );
};
