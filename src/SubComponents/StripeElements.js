import React, { useContext, useState, useEffect } from "react";
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

// Add this utility function at the top of the file
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

  // Add initialization check
  useEffect(() => {
    if (!stripe || !elements) {
      console.warn("Stripe or Elements not initialized");
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe not initialized");
      setWalletError(
        "Payment system not initialized. Please try again."
      );
      return;
    }

    if (!plan?.amount) {
      console.error("Plan amount not found");
      setWalletError("Invalid plan amount");
      return;
    }

    try {
      setIsProcessing(true);
      setWalletError(null);

      const paymentElement = elements.getElement("payment");
      if (!paymentElement) {
        throw new Error("Payment element not initialized");
      }

      const { paymentMethod } = await paymentElement.getValue();

      if (paymentMethod?.type === "apple_pay") {
        return;
      }

      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

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

      if (confirmError) throw confirmError;
    } catch (error) {
      console.error("Payment error:", error);
      setWalletError(
        error.message || "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false
    },
    paymentMethodOrder: ["card", "apple_pay"],
    fields: {
      billingDetails: {
        name: "auto",
        email: "auto",
        phone: "auto",
        address: "never"
      }
    },
    terms: {
      card: "never",
      applePay: "never"
    },
    wallets: {
      applePay: {
        onlyShowIfAvailable: true,
        buttonType: "buy",
        buttonStyle: "black",
        paymentRequest: {
          country: window.Pelcro.site.read()?.country || "US",
          currency: plan?.currency?.toLowerCase() || "usd",
          total: {
            label: "Total",
            amount: plan?.amount || 0
          }
        }
      }
    }
  };

  return (
    <div className="pelcro-payment-container">
      {walletError && (
        <div className="pelcro-alert-error plc-mb-2">
          <div className="pelcro-alert-content">{walletError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
        />

        <button
          type="submit"
          disabled={
            isProcessing || !stripe || !elements || !plan?.amount
          }
          className="pelcro-button-solid plc-w-full plc-py-3 plc-mt-4"
        >
          <span className="plc-capitalize">
            {isProcessing
              ? t("processing") || "Processing..."
              : `${t("pay")} ${formatAmount(
                  plan?.amount,
                  plan?.currency
                )}`}
          </span>
        </button>
      </form>
    </div>
  );
};
