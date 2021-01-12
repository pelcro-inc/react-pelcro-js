import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { store } from "../PaymentMethod/PaymentMethodContainer";
import {
  HANDLE_PAYPAL_SUBSCRIPTION,
  DISABLE_SUBMIT
} from "../../utils/action-types";
import { PaypalClient } from "../../services/PayPal/PaypalCheckout.service";

/**
 * PaypalSubscribeButton component
 * @param {PaypalSubscribeButton.propTypes} props
 * @return {JSX}
 */
export const PaypalSubscribeButton = (props) => {
  const { dispatch, state } = useContext(store);

  useEffect(() => {
    // sometimes, price is updated. eg. Coupon codes.
    const updatedPrice = state.updatedPrice ?? props.plan.amount;

    // initialize paypal client, then render paypal button.
    const initializePaypal = async () => {
      const paypalCheckoutInstance = new PaypalClient({
        buttonElementID:
          props.buttonElementID ?? "pelcro-paypal-button",
        style: props.buttonStyle,
        enableShippingAddress: props.product.address_required,
        shippingAddressEditable: props.makeAddressEditable,
        displayName: props.merchantDisplayName,
        locale: props.locale,
        billingAgreementDescription: props.billingDescription
      });

      // Await building paypal instance
      await paypalCheckoutInstance.build();
      // Create paypal payment
      paypalCheckoutInstance.createPayment({
        product: props.plan,
        amount: updatedPrice,
        onButtonClick: () => {
          dispatch({ type: DISABLE_SUBMIT, payload: true });
        },
        onPaymentApprove: ({ nonce }) => {
          dispatch({
            type: HANDLE_PAYPAL_SUBSCRIPTION,
            payload: nonce
          });
        },
        onPaymentCancel: () => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
        }
      });

      // Render paypal button
      paypalCheckoutInstance.render();
    };

    if (PaypalClient.isPaypalEnabled()) {
      initializePaypal();
    }
  }, [state.updatedPrice]);

  return <div id="pelcro-paypal-button"></div>;
};

PaypalSubscribeButton.propTypes = {
  product: PropTypes.object,
  plan: PropTypes.object,
  makeAddressEditable: PropTypes.bool,
  merchantDisplayName: PropTypes.string,
  locale: PropTypes.string,
  billingDescription: PropTypes.string,
  buttonElementID: PropTypes.string,
  buttonStyle: PropTypes.object
};
