import React, { useContext, useState } from "react";
import {
  PaymentRequestButtonElement,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { store } from "../Components/PaymentMethod/PaymentMethodContainer";
import { usePelcro } from "../hooks/usePelcro";
import { getSiteCardProcessor } from "../Components/common/Helpers";
import { MonthSelect } from "./MonthSelect";
import { YearSelect } from "./YearSelect";
import { Input } from "./Input";
import { useTranslation } from "react-i18next";

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
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation("checkoutForm");
  const { selectedPaymentMethodId, paymentMethodToEdit } =
    usePelcro();
  const cardProcessor = getSiteCardProcessor();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Get the payment element instance
      const paymentElement = elements.getElement("payment");
      const paymentMethod = await paymentElement.paymentMethod;

      // Special handling for Apple Pay
      if (paymentMethod?.type === "apple_pay") {
        return; // Let Stripe handle Apple Pay flow
      }

      // Regular payment flow
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              name: window?.Pelcro?.user?.read()?.name,
              email: window?.Pelcro?.user?.read()?.email
            }
          }
        }
      });

      if (confirmError) {
        throw confirmError;
      }
    } catch (error) {
      console.error("Payment error:", error);
      dispatch({
        type: "SHOW_ALERT",
        payload: {
          type: "error",
          content: error.message || t("errors.paymentFailed")
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const billingDetails = {
    name: window?.Pelcro?.user?.read()?.name,
    email: window?.Pelcro?.user?.read()?.email,
    phone: window?.Pelcro?.user?.read()?.phone
  };

  const paymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
      spacedAccordionItems: false
    },
    paymentMethodOrder: ["card", "apple_pay"],
    wallets: {
      applePay: {
        onlyShowIfAvailable: true,
        buttonType: "buy",
        buttonStyle: "black",
        buttonInit: () =>
          new Promise((resolve) => setTimeout(resolve, 50))
      }
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
      card: "never"
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
    return (
      <form onSubmit={handleSubmit}>
        <div className="pelcro-payment-container">
          {/* Bank redirection message */}
          <div className="plc-absolute plc-inset-0 plc-flex-col plc-items-center plc-justify-center plc-hidden plc-text-lg plc-bg-white plc-z-max plc-text-primary-500 card-authentication-container">
            {t("messages.bankRedirection")}
            <svg
              className="plc-w-10 plc-h-10 plc-mt-5 plc-animate-spin"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 19a7 7 0 100-14 7 7 0 000 14zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              />
              <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 00-7 7H2z" />
            </svg>
          </div>

          {/* Payment Element */}
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className="pelcro-button-solid plc-w-full plc-py-3 plc-mt-4"
          >
            <span className="plc-capitalize">
              {isProcessing
                ? t("messages.processing")
                : `${t("labels.pay")} ${formatPrice(
                    plan?.amount ||
                      order?.price ||
                      invoice?.amount_remaining
                  )}`}
            </span>
          </button>

          {/* Security Badge */}
          <div className="plc-text-center plc-text-gray-500 plc-text-sm plc-mt-4">
            {t("messages.youAreSafe")}{" "}
            <span className="plc-font-bold">Stripe</span>
          </div>
        </div>
      </form>
    );
  }

  return null;
};
