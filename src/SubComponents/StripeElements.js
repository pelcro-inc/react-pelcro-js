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
    "w-full p-3 border border-gray-300 appearance-none outline-none rounded-sm bg-gray-50 pelcro-input-input",
  focus: "ring-1 ring-blue-400",
  invalid: "ring-1 ring-red-300 pelcro-input-invalid"
};

export const PelcroCardNumber = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <label>
      {t("labels.card")} *
      <CardNumberElement
        id="pelcro-input-card-number"
        classes={StripeInputStyle}
        {...props}
      />
    </label>
  );
};

export const PelcroCardCVC = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <label>
      {t("labels.CVC")} *
      <CardCVCElement
        id="pelcro-input-cvc-number"
        classes={StripeInputStyle}
        {...props}
      />
    </label>
  );
};

export const PelcroCardExpiry = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <label>
      {t("labels.date")} *
      <CardExpiryElement
        id="pelcro-input-expiry-date"
        classes={StripeInputStyle}
        {...props}
      />
    </label>
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
