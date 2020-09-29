import React from "react";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const PaymentCreateView = (props) => {
  return <PaymentMethodView type="createPayment" {...props} />;
};
