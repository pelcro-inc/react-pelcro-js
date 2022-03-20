import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  PaymentRequestButtonElement,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement
} from "react-stripe-elements";
import { store } from "../Components/PaymentMethod/PaymentMethodContainer";
import { usePelcro } from "../hooks/usePelcro";

const StripeInputStyle = {
  base: "plc-w-full plc-p-3 plc-border plc-border-gray-300 plc-appearance-none plc-outline-none plc-rounded-sm plc-bg-gray-50 pelcro-input-input",
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

export const CheckoutForm = () => {
  const { selectedPaymentMethodId } = usePelcro();

  return (
    !selectedPaymentMethodId && (
      <div>
        <PelcroCardNumber autoFocus={true} />
        <img
          alt="credit_cards"
          className="plc-h-4 plc-w-auto plc-mt-2"
          src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
        />

        <div className="plc-flex plc-justify-between plc-my-2 plc-items-end">
          <div className="plc-w-6/12 plc-pr-4">
            <PelcroCardExpiry />
          </div>

          <div className="plc-w-6/12 plc-pl-4">
            <PelcroCardCVC />
          </div>
        </div>
      </div>
    )
  );
};
