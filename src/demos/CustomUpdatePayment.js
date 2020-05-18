import React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from "react-stripe-elements";
import {
  CheckoutFormContainer,
  SubmitCheckoutForm,
  ErrMessage,
  AlertSuccess
} from "../components";

/**
 *
 */
export function CustomUpdatePayment({ ReactGA }) {
  return (
    <div style={{ marginTop: 200, marginBottom: 200 }}>
      <div className="pelcro-prefix-title-block">
        <h4>Select Payment</h4>
      </div>

      <ErrMessage name="payment-create" />
      <AlertSuccess name="payment-create" />
      <CheckoutFormContainer
        successMessage="Your payment method has been updated!"
        ReactGA={ReactGA}
      >
        <div className="pelcro-prefix-form">
          <div className="pelcro-prefix-row">
            <div className="col-md-6">
              <label className="pelcro-prefix-label">
                Credit Card Type*
              </label>
              <div>
                <select>
                  <option>Select One</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <label className="pelcro-prefix-label">
                Credit Card Number*
              </label>
              <CardNumberElement />
            </div>

            <div className="col-md-6">
              <label className="pelcro-prefix-label">
                Expiration Date*
              </label>
              <CardExpiryElement />
            </div>

            <div className="col-md-6">
              <label className="pelcro-prefix-label">
                Card Security Code*
              </label>
              <CardCVCElement />
            </div>

            <div className="col-md-12">
              <SubmitCheckoutForm
                style={{ backgroundColor: "red" }}
                name="Update Payment Method"
                className="custom-submit-button"
              />
            </div>
          </div>
        </div>
      </CheckoutFormContainer>
    </div>
  );
}
