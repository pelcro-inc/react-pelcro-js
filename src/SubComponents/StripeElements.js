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
  StripeGateway,
  Payment,
  PAYMENT_TYPES
} from "../services/Subscription/Payment.service";
import { getErrorMessages } from "../Components/common/Helpers";
import {
  DISABLE_COUPON_BUTTON,
  DISABLE_SUBMIT,
  LOADING,
  SUBSCRIBE,
  SET_PAYMENT_REQUEST,
  SET_CAN_MAKE_PAYMENT,
  SHOW_ALERT,
  SUBMIT_PAYMENT,
  CREATE_ORDER
} from "../utils/action-types";
import { useTranslation } from "react-i18next";

export const PelcroPaymentRequestButton = ({
  type,
  onSuccess,
  onFailure,
  ...props
}) => {
  const stripe = useStripe();
  const [isInitializing, setIsInitializing] = useState(true);
  const [localPaymentRequest, setLocalPaymentRequest] =
    useState(null);
  const { state, dispatch } = useContext(store);
  const { canMakePayment, currentPlan, updatedPrice } = state;
  const { order, selectedAddressId } = usePelcro();
  const { t } = useTranslation("payment");

  // Error handler following the same pattern as in PaymentMethodContainer
  const handlePaymentError = (error) => {
    console.error("Payment error:", error);

    // Handle specific error types
    if (
      error.type === "invalid_request_error" &&
      error.param === "billing_details[address]" &&
      error.code === "parameter_missing"
    ) {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content:
            "Billing address is required to complete your purchase. Please provide your billing address."
        }
      });
    } else {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content:
            getErrorMessages(error) ||
            error?.message ||
            "Payment failed. Please try again."
        }
      });
    }

    // Reset UI state
    dispatch({ type: DISABLE_SUBMIT, payload: false });
    dispatch({ type: LOADING, payload: false });
    dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });

    // Call the failure callback if provided
    if (onFailure) {
      onFailure(error);
    }
  };

  // Get user's address ID for order processing
  const getAddressId = () => {
    const userAddresses =
      window?.Pelcro?.user?.read()?.addresses || [];
    const selectedShippingAddress = userAddresses.find((addr) => {
      return (
        addr.id === selectedAddressId ||
        (addr.type === "shipping" && addr.is_default)
      );
    });
    const fallbackAddress =
      userAddresses.length > 0 ? userAddresses[0] : null;

    return (
      selectedAddressId ||
      selectedShippingAddress?.id ||
      fallbackAddress?.id
    );
  };

  // Check if address exists for order creation
  const validateAddressForOrder = () => {
    const addressId = getAddressId();

    if (!addressId && type === "orderCreate") {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content:
            "Address is required to complete the order. Please add a shipping address."
        }
      });
      return false;
    }

    return true;
  };

  // Get order info first
  const getOrderInfo = () => {
    if (!order) {
      return {
        price: null,
        currency: null,
        label: null
      };
    }

    const isQuickPurchase = !Array.isArray(order);

    if (isQuickPurchase) {
      return {
        price: order.price * order.quantity,
        currency: order.currency,
        label: order.name
      };
    }

    if (order.length === 0) {
      return {
        price: null,
        currency: null,
        label: null
      };
    }

    const price = order.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return {
      price,
      currency: order[0].currency,
      label: "Order"
    };
  };
  const orderInfo = getOrderInfo();
  const orderPrice = orderInfo.price;
  const orderCurrency = orderInfo.currency;
  const orderLabel = orderInfo.label;

  // Add these functions at the component level
  const generate3DSecureSource = (source) => {
    const listenFor3DSecureCompletionMessage = () => {
      const retrieveSourceInfoFromIframe = (event) => {
        const { data } = event;
        if (data.message === "3DS-authentication-complete") {
          toggleAuthenticationPendingView(false);
          retrieveSource(
            data.sourceId,
            data.clientSecret,
            handlePayment
          );
          window.removeEventListener(
            "message",
            retrieveSourceInfoFromIframe
          );
        }
      };

      window.addEventListener(
        "message",
        retrieveSourceInfoFromIframe
      );
    };

    listenFor3DSecureCompletionMessage();

    return stripe.createSource({
      type: "three_d_secure",
      amount: Math.round(
        updatedPrice ?? currentPlan?.amount ?? orderPrice
      ),
      currency: (
        currentPlan?.currency || orderCurrency
      ).toLowerCase(),
      three_d_secure: {
        card: source?.id
      },
      redirect: {
        return_url: `${
          window.Pelcro.environment.domain
        }/webhook/stripe/callback/3dsecure?auth_token=${
          window.Pelcro.user.read().auth_token
        }`
      }
    });
  };

  const retrieveSource = async (
    sourceId,
    clientSecret,
    paymentHandler
  ) => {
    try {
      const { source } = await stripe.retrieveSource({
        id: sourceId,
        client_secret: clientSecret
      });

      if (source?.status === "failed") {
        return handlePaymentError({
          error: {
            message: t("messages.cardAuthFailed")
          }
        });
      }

      if (source?.status === "chargeable") {
        paymentHandler(source);
      }
    } catch (error) {
      handlePaymentError(error);
    }
  };
  const toggleAuthenticationPendingView = (show, source) => {
    const cardAuthContainer = document.querySelector(
      ".card-authentication-container"
    );

    if (show) {
      injectCardAuthenticationIframe(source);
      cardAuthContainer?.classList.remove("plc-hidden");
      cardAuthContainer?.classList.add("plc-flex");
    } else {
      cardAuthContainer?.classList.add("plc-hidden");
      cardAuthContainer?.classList.remove("plc-flex");
    }
  };

  const injectCardAuthenticationIframe = (source) => {
    const cardAuthContainer = document.querySelector(
      ".card-authentication-container"
    );

    const iframe = document.createElement("iframe");
    iframe.src = source?.redirect?.url;
    iframe.style =
      "position: absolute; width: 100%; height: 100%; left: 0; top: 0; bottom: 0; z-index: 10;";

    cardAuthContainer?.appendChild(iframe);
  };
  const handlePayment = (source) => {
    if (type === "orderCreate") {
      dispatch({
        type: CREATE_ORDER,
        payload: {
          id: source.id,
          isExistingSource: false
        }
      });
    } else {
      dispatch({
        type: SUBSCRIBE,
        payload: {
          id: source.id,
          isExistingSource: false
        }
      });
    }
  };
  useEffect(() => {
    if (!stripe) {
      setIsInitializing(false);
      return;
    }

    let mounted = true;

    const initializePaymentRequest = async () => {
      try {
        // Get the current price for initialization
        const currentAmount = Math.round(
          updatedPrice ?? currentPlan?.amount ?? orderPrice
        );

        const pr = stripe.paymentRequest({
          country: window.Pelcro.user.location.countryCode || "US",
          currency: (
            currentPlan?.currency || orderCurrency
          ).toLowerCase(),
          total: {
            label:
              currentPlan?.nickname ||
              currentPlan?.description ||
              orderLabel ||
              "Payment",
            amount: currentAmount,
            pending: false
          },
          requestPayerEmail: false,
          requestPayerName: false,
          requestShipping: false
        });

        pr.on("source", async (event) => {
          try {
            // Set loading states
            dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
            dispatch({ type: DISABLE_SUBMIT, payload: true });
            dispatch({ type: LOADING, payload: true });

            // For order creation, validate address
            if (
              type === "orderCreate" &&
              !validateAddressForOrder()
            ) {
              event.complete("fail");
              dispatch({
                type: DISABLE_COUPON_BUTTON,
                payload: false
              });
              dispatch({ type: DISABLE_SUBMIT, payload: false });
              dispatch({ type: LOADING, payload: false });
              return;
            }

            // Add 3D Secure check here
            if (event.source?.card?.three_d_secure === "required") {
              return generate3DSecureSource(event.source).then(
                ({ source, error }) => {
                  if (error) {
                    return handlePaymentError(error);
                  }

                  toggleAuthenticationPendingView(true, source);
                }
              );
            }

            event.complete("success");

            // Handle different payment types
            if (type === "orderCreate") {
              // Dispatch to CREATE_ORDER with the source ID to use common order payment logic
              dispatch({
                type: CREATE_ORDER,
                payload: {
                  id: event.source.id,
                  isExistingSource: false
                }
              });
            } else {
              // For subscriptions, use the SUBSCRIBE action
              dispatch({
                type: SUBSCRIBE,
                payload: {
                  id: event.source.id,
                  isExistingSource: false
                }
              });
            }
          } catch (error) {
            event.complete("fail");
            handlePaymentError(error);
          }
        });

        pr.on("cancel", () => {
          dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
        });

        const result = await pr.canMakePayment();

        if (mounted && result) {
          setLocalPaymentRequest(pr);
          dispatch({ type: SET_PAYMENT_REQUEST, payload: pr });
          dispatch({ type: SET_CAN_MAKE_PAYMENT, payload: true });
        } else if (mounted) {
          dispatch({ type: SET_CAN_MAKE_PAYMENT, payload: false });
        }
      } catch (error) {
        if (mounted) {
          dispatch({ type: SET_CAN_MAKE_PAYMENT, payload: false });
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
    };
  }, [stripe, currentPlan, dispatch, order, type]);

  // Simple effect to update the payment request when price changes
  useEffect(() => {
    // Only update if we have a valid payment request and are not initializing
    if (localPaymentRequest && !isInitializing) {
      try {
        // Get the current price to update
        const currentAmount = Math.round(
          updatedPrice ?? currentPlan?.amount ?? orderPrice
        );

        // Update the payment request with the new price
        localPaymentRequest.update({
          total: {
            label:
              currentPlan?.nickname ||
              currentPlan?.description ||
              orderLabel ||
              "Payment",
            amount: currentAmount,
            pending: false
          }
        });

        console.log(
          "Updated payment request with price:",
          currentAmount
        );
      } catch (error) {
        console.error("Failed to update payment request:", error);
      }
    }
  }, [updatedPrice, localPaymentRequest, isInitializing]);

  // If we have no payment request or Apple Pay is not available, return nothing
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
            buttonType: "plain"
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
      type: "tabs",
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
    wallets: {
      applePay: "never"
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
