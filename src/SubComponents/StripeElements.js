import React, { useContext, useEffect } from "react";
import {
  PaymentRequestButtonElement,
  PaymentElement
} from "@stripe/react-stripe-js";
import { store } from "../Components/PaymentMethod/PaymentMethodContainer";
import { usePelcro } from "../hooks/usePelcro";
import { getSiteCardProcessor } from "../Components/common/Helpers";
import { MonthSelect } from "./MonthSelect";
import { YearSelect } from "./YearSelect";
import { Input } from "./Input";
import { useStripe } from "../hooks/useStripe";
import {
  DISABLE_COUPON_BUTTON,
  DISABLE_SUBMIT,
  LOADING,
  SUBSCRIBE,
  SET_PAYMENT_REQUEST,
  SET_CAN_MAKE_PAYMENT
} from "../redux/actions/paymentActions";

export const PelcroPaymentRequestButton = (props) => {
  const stripe = useStripe();
  const {
    state: {
      canMakePayment,
      paymentRequest,
      currentPlan,
      updatedPrice
    },
    dispatch
  } = useContext(store);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: window.Pelcro.user.location.countryCode || "US",
        currency: currentPlan.currency,
        total: {
          label: currentPlan?.nickname || currentPlan?.description,
          amount: updatedPrice ?? currentPlan?.amount
        }
      });

      paymentRequest.on("source", ({ complete, source, ...data }) => {
        dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        dispatch({ type: LOADING, payload: true });
        complete("success");

        if (source?.card?.three_d_secure === "required") {
          return generate3DSecureSource(source).then(
            ({ source, error }) => {
              if (error) {
                return handlePaymentError(error);
              }

              toggleAuthenticationPendingView(true, source);
            }
          );
        }

        dispatch({
          type: SUBSCRIBE,
          payload: source
        });
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          dispatch({
            type: SET_PAYMENT_REQUEST,
            payload: pr
          });
          dispatch({ type: SET_CAN_MAKE_PAYMENT, payload: true });
        }
      });
    }
  }, [stripe]);

  // Don't render anything if payment request is not initialized
  // or if the device cannot make payments
  if (!paymentRequest || !canMakePayment) {
    return null;
  }

  const updatePaymentRequest = () => {
    if (!paymentRequest) return;

    paymentRequest.update({
      total: {
        label: currentPlan?.nickname || currentPlan?.description,
        amount: updatedPrice ?? currentPlan?.amount
      }
    });
  };
  if (paymentRequest) {
    return (
      <PaymentRequestButtonElement
        className="StripeElement stripe-payment-request-btn"
        onClick={updatePaymentRequest}
        paymentRequest={paymentRequest}
        style={{
          paymentRequestButton: {
            theme: "dark",
            height: "40px"
          }
        }}
        {...props}
      />
    );
  }
  return null;
};

export const CheckoutForm = ({ type }) => {
  const { selectedPaymentMethodId, paymentMethodToEdit } =
    usePelcro();
  const cardProcessor = getSiteCardProcessor();

  const billingDetails = {
    name: window?.Pelcro?.user?.read()?.name,
    email: window?.Pelcro?.user?.read()?.email,
    phone: window?.Pelcro?.user?.read()?.phone
  };

  const paymentElementOptions = {
    layout: {
      type: "tabs", // or accordion
      defaultCollapsed: false
    },
    defaultValues: {
      billingDetails: billingDetails
    },
    fields: {
      billingDetails: {
        name: "auto",
        email: "auto",
        phone: "auto",
        address: "never"
      }
    },
    terms: {
      applePay: "never",
      card: "never",
      googlePay: "never",
      paypal: "never"
    }
  };

  if (selectedPaymentMethodId) {
    return null;
  }

  if (cardProcessor === "vantiv") {
    return <div id="eProtectiframe"></div>;
  }

  if (cardProcessor === "tap") {
    return <div id="tapPaymentIframe"></div>;
  }

  if (cardProcessor === "cybersource") {
    return (
      <div>
        <div
          id="cybersourceCardNumber"
          className="pelcro-input-field plc-h-12"
        ></div>
        <div className="plc-flex plc-items-end plc-justify-between plc-my-2">
          <div className="plc-w-6/12 plc-pr-4">
            <MonthSelect store={store} placeholder="Exp Month *" />
          </div>
          <div className="plc-w-6/12">
            <YearSelect store={store} placeholder="Exp Year *" />
          </div>
        </div>
      </div>
    );
  }

  if (cardProcessor === "stripe") {
    if (type === "updatePaymentSource") {
      return (
        <div>
          {paymentMethodToEdit ? (
            <div>
              <Input
                className="plc-tracking-widest plc-flex-grow plc-text-center"
                value={`•••• •••• •••• ${paymentMethodToEdit?.properties?.last4}`}
                disabled
              />
            </div>
          ) : (
            <div>
              <Input className="plc-bg-gray-300 plc-animate-pulse" />
            </div>
          )}
          <div className="plc-flex plc-items-end plc-justify-between plc-my-2">
            <div className="plc-w-6/12 plc-pr-4">
              <MonthSelect store={store} placeholder="Exp Month *" />
            </div>
            <div className="plc-w-6/12">
              <YearSelect store={store} placeholder="Exp Year *" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
      />
    );
  }

  return null;
};
