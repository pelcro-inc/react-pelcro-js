import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  PaymentRequestButtonElement,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement
} from "react-stripe-elements";
import { store } from "../Components/PaymentMethod/PaymentMethodContainer";

const StripeInputStyle = {
  base:
    "plc-w-full plc-p-3 plc-border plc-border-gray-300 plc-appearance-none plc-outline-none plc-rounded-sm plc-bg-gray-50 pelcro-input-input",
  focus: "plc-ring-2 plc-ring-primary-400",
  invalid: "plc-ring-2 plc-ring-red-400 pelcro-input-invalid"
};

export const PelcroCardNumber = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <>
      <label htmlFor="pelcro-input-card-number">
        {t("labels.card")} *
      </label>
      <CardNumberElement
        id="pelcro-input-card-number"
        classes={StripeInputStyle}
        {...props}
      />
    </>
  );
};

export const PelcroCardCVC = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <>
      <label htmlFor="pelcro-input-cvc-number">
        {t("labels.CVC")} *
      </label>
      <CardCVCElement
        id="pelcro-input-cvc-number"
        classes={StripeInputStyle}
        {...props}
      />
    </>
  );
};

export const PelcroCardExpiry = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <>
      <label htmlFor="pelcro-input-expiry-date">
        {t("labels.date")} *
      </label>
      <CardExpiryElement
        id="pelcro-input-expiry-date"
        classes={StripeInputStyle}
        {...props}
      />
    </>
  );
};

export const PelcroPaymentRequestButton = (props) => {
  const {
    state: { canMakePayment, paymentRequest }
  } = useContext(store);

  if (canMakePayment) {
    return (
      <PaymentRequestButtonElement
        id="pelcro-payment-submit-button"
        className="StripeElement stripe-payment-request-btn"
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
