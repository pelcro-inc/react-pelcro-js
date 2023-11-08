import React from "react";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";

/**
 *
 */
export function PaymentMethodCreateView(props) {
  return (
    <div id="pelcro-payment-method-create-view">
      <PaymentMethodView
        type="createPaymentSource"
        showCoupon={false}
        showExternalPaymentMethods={false}
        showApplePayButton={false}
        onDisplay={props.onDisplay}
        onFailure={props.onFailure}
        onSuccess={props.onSuccess}
      />
    </div>
  );
}
