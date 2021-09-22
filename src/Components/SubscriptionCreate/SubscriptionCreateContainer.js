import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";

export const SubscriptionCreateContainer = (props) => {
  return (
    <PaymentMethodContainer
      type="createPayment"
      className="pelcro-subscription-create-container"
      {...props}
    />
  );
};
