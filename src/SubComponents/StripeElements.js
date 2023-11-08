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

const StripeInputStyle = {
  base: "plc-w-full plc-p-3 plc-border plc-border-gray-300 plc-appearance-none plc-outline-none plc-rounded plc-bg-white pelcro-input-input",
  focus: "plc-ring-2 plc-ring-primary-400",
  invalid: "plc-ring-2 plc-ring-red-300 pelcro-input-invalid"
};

export const PelcroCardNumber = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <div className="plc-relative">
      <CardNumberElement
        id="pelcro-input-card-number"
        classes={StripeInputStyle}
        {...props}
      />
      <label
        htmlFor="pelcro-input-card-number"
        className="pelcro-input-card-number-label"
      >
        {t("labels.card")} *
      </label>
    </div>
  );
};

export const PelcroCardCVC = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <div className="plc-relative">
      <CardCVCElement
        id="pelcro-input-cvc-number"
        classes={StripeInputStyle}
        {...props}
      />
      <label
        htmlFor="pelcro-input-cvc-number"
        className="pelcro-input-cvc-number-label"
      >
        {t("labels.CVC")} *
      </label>
    </div>
  );
};

export const PelcroCardExpiry = (props) => {
  const { t } = useTranslation("checkoutForm");

  return (
    <div className="plc-relative">
      <CardExpiryElement
        id="pelcro-input-expiry-date"
        classes={StripeInputStyle}
        {...props}
      />
      <label
        htmlFor="pelcro-input-expiry-date"
        className="pelcro-input-expiry-date-label"
      >
        {t("labels.date")} *
      </label>
    </div>
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
            <MonthSelect store={store} placeholder="Exp Month" />
          </div>
          <div className="plc-w-6/12">
            <YearSelect store={store} placeholder="Exp Year" />
          </div>
        </div>
      </div>
    );
  }

  if (cardProcessor === "stripe") {
    return (
      <div className="plc-mt-4">
        <div className="plc-relative">
          <PelcroCardNumber autoFocus={true} />
          <div
            // alt="credit_cards"
            className="plc-w-auto plc-h-8 plc-absolute plc-right-2 plc-top-1 plc-flex"
            // src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
          >
            <svg
              className="plc-w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#1565C0"
                d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"
              />
              <path
                fill="#FFC107"
                d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"
              />
            </svg>
            <svg
              className="plc-w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#ff9800"
                d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
              />
              <path
                fill="#d50000"
                d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
              />
              <path
                fill="#ff3d00"
                d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
              />
            </svg>
            <svg
              className="plc-w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#1976D2"
                d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
              />
              <path
                fill="#FFF"
                d="M22.255 20l-2.113 4.683L18.039 20h-2.695v6.726L12.341 20h-2.274L7 26.981h1.815l.671-1.558h3.432l.682 1.558h3.465v-5.185l2.299 5.185h1.563l2.351-5.095v5.095H25V20H22.255zM10.135 23.915l1.026-2.44 1.066 2.44H10.135zM37.883 23.413L41 20.018h-2.217l-1.994 2.164L34.86 20H28v6.982h6.635l2.092-2.311L38.767 27h2.21L37.883 23.413zM33.728 25.516h-4.011v-1.381h3.838v-1.323h-3.838v-1.308l4.234.012 1.693 1.897L33.728 25.516z"
              />
            </svg>
          </div>
        </div>

        <div className="plc-flex plc-items-end plc-justify-between plc-my-4">
          <div className="plc-w-6/12 plc-pr-1">
            <PelcroCardExpiry />
          </div>

          <div className="plc-w-6/12 plc-pl-1">
            <PelcroCardCVC />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
