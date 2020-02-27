import React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from "react-stripe-elements";
import { CheckoutFormContainer, SubmitCheckoutForm } from "../components";

export function CustomUpdatePayment({ ReactGA }) {
  return (
    <CheckoutFormContainer
      successMessage="Your payment method has been updated!"
      ReactGA={ReactGA}
    >
      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label className="pelcro-prefix-label">Credit Card Number*</label>
            <CardNumberElement />
          </div>

          <div className="col-md-6">
            <label className="pelcro-prefix-label">Expiration Date*</label>
            <CardExpiryElement />
          </div>

          <div className="col-md-6">
            <label className="pelcro-prefix-label">Card Security Code*</label>
            <CardCVCElement />
          </div>

          <div className="col-md-12">
            <SubmitCheckoutForm
              style={{ backgroundColor: "red" }}
              name="Update Payment Method"
            />
          </div>
        </div>
      </div>
    </CheckoutFormContainer>
  );
}
