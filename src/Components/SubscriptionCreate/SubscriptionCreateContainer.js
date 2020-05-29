import React from "react";
import { PaymentMethodContainer } from "../../components";

export const SubscriptionCreateContainer = props => {
  return (
    <PaymentMethodContainer
      type="createPayment"
      showCoupon={true}
      {...props}
    />
  );
};
