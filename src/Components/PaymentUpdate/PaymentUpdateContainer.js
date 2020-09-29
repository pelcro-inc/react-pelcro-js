import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";

export const PaymentUpdateContainer = (props) => {
  return <PaymentMethodContainer type="paymentUpdate" {...props} />;
};
