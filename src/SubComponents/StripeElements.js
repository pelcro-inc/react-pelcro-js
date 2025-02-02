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

const formatAmount = (amount, currency = "USD") => {
  if (!amount) return "0.00";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
      minimumFractionDigits: 2
    }).format(amount / 100);
  } catch (error) {
    console.error("Price formatting error:", error);
    return `${amount / 100} ${currency?.toUpperCase() || "USD"}`;
  }
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
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const { plan } = usePelcro();
  const { t } = useTranslation("checkoutForm");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe not initialized");
      return;
    }

    try {
      setIsProcessing(true);
      setWalletError(null);

      // Just submit directly - no getValue needed
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

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
      setWalletError(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pelcro-payment-form">
      {walletError && (
        <div className="pelcro-alert-error plc-mb-2">
          <div className="pelcro-alert-content">{walletError}</div>
        </div>
      )}

      <PaymentElement
        id="payment-element"
        options={{
          paymentMethodOrder: ["apple_pay", "card"],
          wallets: {
            applePay: "auto"
          }
        }}
      />

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="pelcro-button-solid plc-w-full plc-py-3 plc-mt-4"
      >
        <span className="plc-capitalize">
          {isProcessing
            ? t("processing")
            : `${t("pay")} ${formatAmount(
                plan?.amount,
                plan?.currency
              )}`}
        </span>
      </button>
    </form>
  );
};
