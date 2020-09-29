import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";

export const PaymentCreateContainer = (props) => {
  return <PaymentMethodContainer type="paymentCreate" {...props} />;
};
