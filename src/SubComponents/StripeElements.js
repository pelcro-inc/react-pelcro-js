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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      // Submit form first to validate
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      // Get payment element and method
      const paymentElement = elements.getElement("payment");
      const { paymentMethod } = await paymentElement.getValue();

      // Special handling for Apple Pay
      if (paymentMethod?.type === "apple_pay") {
        // Let the Payment Element handle the flow
        return;
      }

      // Regular payment flow
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href
        }
      });

      if (confirmError) throw confirmError;
    } catch (error) {
      console.error("Payment error:", error);
      setWalletError(error.message);
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
    wallets: {
      applePay: {
        onlyShowIfAvailable: true,
        buttonType: "buy",
        buttonStyle: "black",
        // Remove buttonInit delay as it causes timing issues
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
    <form onSubmit={handleSubmit}>
      {walletError && (
        <div className="pelcro-alert-error plc-mb-2">
          <div className="plc-inline-flex plc-items-center">
            {/* ... error icon ... */}
            <div className="pelcro-alert-content">{walletError}</div>
          </div>
        </div>
      )}

      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
      />

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="pelcro-button-solid plc-w-full plc-py-3"
      >
        <span className="plc-capitalize">
          {isProcessing
            ? "Processing..."
            : `pay ${formatPrice(plan?.amount)}`}
        </span>
      </button>
    </form>
  );
};
