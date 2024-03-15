import React, { useContext } from "react";
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

export const PelcroPaymentRequestButton = (props) => {
  const {
    state: {
      canMakePayment,
      paymentRequest,
      currentPlan,
      updatedPrice
    }
  } = useContext(store);

  const updatePaymentRequest = () => {
    // Make sure payment request is up to date, eg. user added a coupon code.
    paymentRequest?.update({
      total: {
        label: currentPlan?.nickname || currentPlan?.description,
        amount: updatedPrice ?? currentPlan?.amount
      }
    });
  };

  if (canMakePayment) {
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
