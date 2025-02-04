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
  return (
    <form>
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
          paymentMethodOrder: ["apple_pay", "card"],
          wallets: {
            applePay: "auto"
          },
          defaultValues: {
            billingDetails: {
              name: window?.Pelcro?.user?.read()?.name,
              email: window?.Pelcro?.user?.read()?.email
            }
          },
          terms: {
            card: "never",
            applePay: "never"
          }
        }}
      />
    </form>
  );
};
