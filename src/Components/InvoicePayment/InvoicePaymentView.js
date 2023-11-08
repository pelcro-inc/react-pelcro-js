import React from "react";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export const InvoicePaymentView = (props) => {
  return (
    <div id="pelcro-invoice-payment-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PaymentMethodView
          type="invoicePayment"
          showCoupon={false}
          showExternalPaymentMethods={true}
          showApplePayButton={true}
          {...props}
        />
      </form>
    </div>
  );
};
