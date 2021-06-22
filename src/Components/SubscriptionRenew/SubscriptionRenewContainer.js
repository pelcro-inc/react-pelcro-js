import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";

export const SubscriptionRenewContainer = (props) => {
  return <PaymentMethodContainer type="createPayment" {...props} />;
};
