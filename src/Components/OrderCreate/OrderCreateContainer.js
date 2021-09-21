import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";
export const OrderCreateContainer = (props) => (
  <PaymentMethodContainer
    type="orderCreate"
    className="pelcro-order-create-container"
    {...props}
  />
);
