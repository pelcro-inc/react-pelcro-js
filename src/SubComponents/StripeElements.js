import React, { useContext, useEffect, useState } from "react";
import {
  PaymentRequestButtonElement,
  PaymentElement,
  useStripe
} from "@stripe/react-stripe-js";
import { store } from "../Components/PaymentMethod/PaymentMethodContainer";
import { usePelcro } from "../hooks/usePelcro";
import { getSiteCardProcessor } from "../Components/common/Helpers";
import { MonthSelect } from "./MonthSelect";
import { YearSelect } from "./YearSelect";
import { Input } from "./Input";
import {
  DISABLE_COUPON_BUTTON,
  DISABLE_SUBMIT,
  LOADING,
  SUBSCRIBE,
  SET_PAYMENT_REQUEST,
  SET_CAN_MAKE_PAYMENT,
  SHOW_ALERT
} from "../utils/action-types";

export const PelcroPaymentRequestButton = (props) => {
  const stripe = useStripe();
  const [isInitializing, setIsInitializing] = useState(true);
  const [localPaymentRequest, setLocalPaymentRequest] =
    useState(null);
  const {
    state: { canMakePayment, currentPlan, updatedPrice },
    dispatch
  } = useContext(store);

  useEffect(() => {
    // Log initial conditions
    console.log("[Apple Pay] Initialization:", {
      hasStripe: !!stripe,
      plan: currentPlan,
      price: updatedPrice,
      currency: currentPlan?.currency
    });

    if (!stripe || !currentPlan?.currency) {
      console.log("[Apple Pay] Missing required data:", {
        stripe: !!stripe,
        currency: currentPlan?.currency
      });
      setIsInitializing(false);
      return;
    }

    let mounted = true;

    const initializePaymentRequest = async () => {
      try {
        console.log("[Apple Pay] Creating payment request with:", {
          country: window.Pelcro.user.location.countryCode || "US",
          currency: currentPlan.currency.toLowerCase(),
          amount: updatedPrice ?? currentPlan?.amount ?? 0
        });

        const pr = stripe.paymentRequest({
          country: window.Pelcro.user.location.countryCode || "US",
          currency: currentPlan.currency.toLowerCase(),
          total: {
            label:
              currentPlan?.nickname ||
              currentPlan?.description ||
              "Payment",
            amount: updatedPrice ?? currentPlan?.amount ?? 0,
            pending: false
          },
          requestPayerEmail: false,
          requestPayerName: false,
          requestShipping: false
        });

        // Handle source event for Apple Pay
        pr.on("source", async (event) => {
          try {
            console.log("[Apple Pay] Source event received:", {
              type: event.source.type,
              id: event.source.id,
              card: event.source.card
            });

            dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
            dispatch({ type: DISABLE_SUBMIT, payload: true });
            dispatch({ type: LOADING, payload: true });

            event.complete("success");

            // Check if 3D Secure is required
            if (event.source?.card?.three_d_secure === "required") {
              console.log(
                "[Apple Pay] 3D Secure authentication required"
              );
              return generate3DSecureSource(event.source).then(
                ({ source, error }) => {
                  if (error) {
                    console.error(
                      "[Apple Pay] 3D Secure error:",
                      error
                    );
                    return handlePaymentError(error);
                  }

                  console.log(
                    "[Apple Pay] 3D Secure source generated:",
                    source
                  );
                  toggleAuthenticationPendingView(true, source);
                }
              );
            }

            // Format source data to match subscription requirements
            const sourceData = {
              id: event.source.id,
              isExistingSource: false
            };

            console.log(
              "[Apple Pay] Formatted source data:",
              sourceData
            );

            dispatch({
              type: SUBSCRIBE,
              payload: sourceData
            });
          } catch (error) {
            console.error("[Apple Pay] Source error:", {
              message: error.message,
              code: error.code,
              type: error.type
            });

            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content:
                  error.message || "Payment failed. Please try again."
              }
            });

            event.complete("fail");

            // Reset loading states
            dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
          }
        });

        // Handle cancel event
        pr.on("cancel", () => {
          console.log("[Apple Pay] Payment cancelled by user");
          dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
        });

        const result = await pr.canMakePayment();
        console.log("[Apple Pay] Can make payment result:", result);

        if (mounted && result) {
          setLocalPaymentRequest(pr);
          dispatch({ type: SET_PAYMENT_REQUEST, payload: pr });
          dispatch({ type: SET_CAN_MAKE_PAYMENT, payload: true });
          console.log(
            "[Apple Pay] Payment request initialized successfully"
          );
        } else {
          console.log(
            "[Apple Pay] Cannot make payment or component unmounted",
            {
              mounted,
              canMakePayment: !!result
            }
          );

          if (mounted) {
            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content:
                  "Apple Pay is not available. Please use a different payment method."
              }
            });
          }
        }
      } catch (error) {
        console.error("[Apple Pay] Initialization error:", {
          message: error.message,
          code: error.code,
          type: error.type,
          stack: error.stack
        });

        if (mounted) {
          dispatch({ type: SET_CAN_MAKE_PAYMENT, payload: false });
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content:
                "Failed to initialize Apple Pay. Please try again or use a different payment method."
            }
          });
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    initializePaymentRequest();

    return () => {
      mounted = false;
      console.log("[Apple Pay] Component cleanup");
    };
  }, [stripe, currentPlan, updatedPrice, dispatch]);

  // Log render conditions
  console.log("[Apple Pay] Render state:", {
    isInitializing,
    canMakePayment,
    hasPaymentRequest: !!localPaymentRequest
  });

  if (isInitializing || !canMakePayment || !localPaymentRequest) {
    return null;
  }

  return (
    <PaymentRequestButtonElement
      className="StripeElement stripe-payment-request-btn"
      options={{
        paymentRequest: localPaymentRequest,
        style: {
          paymentRequestButton: {
            theme: "dark",
            height: "40px",
            type: "buy" // Use 'buy' type for clearer user intent
          }
        }
      }}
      {...props}
    />
  );
};

export const CheckoutForm = ({ type }) => {
  const { selectedPaymentMethodId, paymentMethodToEdit } =
    usePelcro();
  const cardProcessor = getSiteCardProcessor();

  const billingDetails = {
    name: window?.Pelcro?.user?.read()?.name,
    email: window?.Pelcro?.user?.read()?.email,
    phone: window?.Pelcro?.user?.read()?.phone
  };

  const paymentElementOptions = {
    layout: {
      type: "tabs", // or accordion
      defaultCollapsed: false
    },
    defaultValues: {
      billingDetails: billingDetails
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
      card: "never",
      googlePay: "never",
      paypal: "never"
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
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
      />
    );
  }

  return null;
};
