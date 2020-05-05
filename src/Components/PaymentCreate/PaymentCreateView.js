import React from "react";
import { PaymentMethodView } from "../../components";

export const PaymentCreateView = (props) => {
  return <PaymentMethodView type="createPayment" {...props} />;
};
