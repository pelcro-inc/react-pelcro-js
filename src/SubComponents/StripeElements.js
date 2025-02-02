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
      const paymentElement = elements.getElement("payment");
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
          <div className="plc-inline-flex plc-items-center">
            <div className="pelcro-alert-content">{walletError}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
        />

        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="pelcro-button-solid plc-w-full plc-py-3 plc-mt-4"
        >
          <span className="plc-capitalize">
            {isProcessing
              ? "Processing..."
              : `pay ${formatPrice(plan?.amount)}`}
          </span>
        </button>
      </form>
    </div>
  );
};
