import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";

export const PaymentMethodUpdateContainer = (props) => {
  return (
    <PaymentMethodContainer
      type="updatePaymentSource"
      className="pelcro-payment-update-container"
      {...props}
    />
  );
};
