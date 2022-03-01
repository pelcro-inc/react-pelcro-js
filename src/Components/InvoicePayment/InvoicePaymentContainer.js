import React from "react";
import { PaymentMethodContainer } from "../PaymentMethod/PaymentMethodContainer";
export const InvoicePaymentContainer = (props) => (
  <PaymentMethodContainer
    type="invoicePayment"
    className="pelcro-invoice-payment-container"
    {...props}
  />
);
