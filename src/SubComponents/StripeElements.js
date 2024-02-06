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
import { getSiteCardProcessor } from "../Components/common/Helpers";
import { MonthSelect } from "./MonthSelect";
import { YearSelect } from "./YearSelect";
import { Input } from "./Input";

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

export const CheckoutForm = ({ type }) => {
  const { selectedPaymentMethodId, paymentMethodToEdit } =
    usePelcro();
  const cardProcessor = getSiteCardProcessor();

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

  if (cardProcessor === "braintree") {
    return (
      <div className="plc-max-w-[50em]">
        <label htmlFor="card-number">Card Number</label>
        <div
          id="card-number"
          className="pelcro-input-field plc-h-12 plc-bg-white"
        ></div>

        <div className="plc-flex plc-items-start plc-space-x-3 plc-mb-4">
          <div>
            <label htmlFor="expiration-date">Expiration Date</label>
            <div
              id="expiration-date"
              className="pelcro-input-field plc-h-12 plc-bg-white"
            ></div>
          </div>
          <div>
            <label htmlFor="cvv">CVV</label>
            <div
              id="cvv"
              className="pelcro-input-field plc-h-12 plc-bg-white"
            ></div>
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
      <div>
        <PelcroCardNumber autoFocus={true} />
        <img
          alt="credit_cards"
          className="plc-w-auto plc-h-4 plc-mt-2"
          src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
        />

        <div className="plc-flex plc-items-end plc-justify-between plc-my-2">
          <div className="plc-w-6/12 plc-pr-4">
            <PelcroCardExpiry />
          </div>

          <div className="plc-w-6/12 plc-pl-4">
            <PelcroCardCVC />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
