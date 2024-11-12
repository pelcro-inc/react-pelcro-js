import React from "react";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

export function PaymentMethodUpdateView(props) {
  return (
    <div id="pelcro-payment-method-update-view">
      <PaymentMethodView
        type="updatePaymentSource"
        showCoupon={false}
        showExternalPaymentMethods={false}
        showApplePayButton={false}
        onDisplay={props.onDisplay}
        onFailure={props.onFailure}
        onSuccess={props.onSuccess}
        {...props}
      />
    </div>
  );
}
