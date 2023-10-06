import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";

export const PaymentMethodCreateContainer = (props) => {
  return (
    <PaymentMethodContainer
      type="createPaymentSource"
      className="pelcro-payment-create-container"
      {...props}
    />
  );
};
