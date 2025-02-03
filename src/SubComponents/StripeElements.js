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
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const { plan } = usePelcro();
  const { t } = useTranslation("checkoutForm");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !isChecked) {
      console.error("Payment requirements not met");
      return;
    }

    try {
      setIsProcessing(true);
      setWalletError(null);

      // Submit for both Apple Pay and card payments
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

  useEffect(() => {
    const showCorrectButtons = () => {
      // Get only the payment button within this form
      const regularButtons = document.querySelectorAll(
        "form .pelcro-button-solid"
      );
      const applePayButton = document.querySelector(
        ".StripeElement.stripe-payment-request-btn"
      );
      const paymentRequestButton = document.querySelector(
        ".PaymentRequestButton"
      );

      console.log("Regular buttons found:", regularButtons.length);

      // First, hide all regular buttons in this form
      regularButtons.forEach((button) => {
        if (button.closest("form")) {
          button.style.display = "none";
        }
      });

      // If Apple Pay exists, make sure it's visible
      if (applePayButton) {
        applePayButton.style.display = "";
      }
      if (paymentRequestButton) {
        paymentRequestButton.style.display = "";
      }

      // If no Apple Pay, show the regular button
      if (
        !applePayButton &&
        !paymentRequestButton &&
        regularButtons.length > 0
      ) {
        regularButtons[0].style.display = "";
      }
    };

    // Run immediately
    showCorrectButtons();

    // Run again after a short delay
    const timeoutId = setTimeout(showCorrectButtons, 500);

    // Also set up an interval to keep checking
    const intervalId = setInterval(showCorrectButtons, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {walletError && (
        <div className="pelcro-alert-error plc-mb-2">
          <div className="pelcro-alert-content">{walletError}</div>
        </div>
      )}

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

      <div className="ms-mt-8 ms-mb-6">
        <div className="plc-flex plc-items-center">
          <input
            type="checkbox"
            className="pelcro-checkbox ms-w-[1.3rem] ms-h-[1.3rem] ms-rounded ms-border-gray-300 ms-mb-3"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label className="pelcro-checkbox-label ms-text-xs ms-text-[#6D6E78] ms-font-normal">
            Please check to confirm you've read and accepted Motor
            Sport magazine's{" "}
            <a
              className="pelcro-link ms-underline"
              href="https://www.motorsportmagazine.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms and conditions
            </a>{" "}
            and agree to our{" "}
            <a
              className="pelcro-link ms-underline"
              href="https://www.motorsportmagazine.com/privacy-cookies/"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>
          </label>
        </div>
      </div>

      {!document.querySelector(
        ".StripeElement.stripe-payment-request-btn"
      ) &&
        !document.querySelector(".PaymentRequestButton") && (
          <button
            type="submit"
            disabled={
              isProcessing || !stripe || !elements || !isChecked
            }
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
        )}
    </form>
  );
};
