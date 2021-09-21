import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";

export const SubscriptionRenewContainer = (props) => {
  return (
    <PaymentMethodContainer
      type="createPayment"
      className="pelcro-subscription-renew-container"
      pelcro-subscription-create-
      {...props}
    />
  );
};
