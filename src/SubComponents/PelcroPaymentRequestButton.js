import React, { useContext } from "react";
import { PaymentRequestButtonElement } from "react-stripe-elements";
import { UPDATE_PAYMENT_REQUEST } from "../utils/action-types";
import { store } from "../Components/PaymentMethod/PaymentMethodContainer";

export const PelcroPaymentRequestButton = props => {
  const {
    state: { canMakePayment, paymentRequest, formattedPrice },
    dispatch
  } = useContext(store);

  if (canMakePayment) {
    return (
      <PaymentRequestButtonElement
        paymentRequest={paymentRequest}
        style={{
          paymentRequestButton: {
            theme: "dark",
            height: "40px"
          }
        }}
        {...props}
      />
    );
  }

  return null;
};
