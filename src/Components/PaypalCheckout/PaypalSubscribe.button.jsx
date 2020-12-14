import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { store } from "../PaymentMethod/PaymentMethodContainer";
import {
  CREATE_PAYPAL_SUBSCRIPTION,
  DISABLE_SUBMIT
} from "../../utils/action-types";
import { PaypalClient } from "./PaypalCheckout.service";

export const PaypalSubscribeButton = ({ product, plan }) => {
  const { dispatch } = useContext(store);

  useEffect(() => {
    // initialize paypal client, then render paypal button.
    const initializePaypal = async () => {
      const paypalCheckoutInstance = new PaypalClient({
        buttonElementID: "pelcro-paypal-button",
        enableShippingAddress: product.address_required
      });

      await paypalCheckoutInstance.build();

      paypalCheckoutInstance.createPayment({
        product: plan,
        onButtonClick: () => {
          dispatch({ type: DISABLE_SUBMIT, payload: true });
        },
        onPaymentApprove: ({ nonce }) => {
          dispatch({
            type: CREATE_PAYPAL_SUBSCRIPTION,
            payload: nonce
          });
        },
        onPaymentCancel: () => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
        }
      });

      paypalCheckoutInstance.render();
    };

    initializePaypal();
  }, []);

  return <div id="pelcro-paypal-button"></div>;
};

PaypalSubscribeButton.propTypes = {
  enableShippingAddress: PropTypes.bool,
  product: PropTypes.object
};
