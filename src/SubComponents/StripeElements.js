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
  SHOW_ALERT
} from "../utils/action-types";

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
  const { order, set, selectedPaymentMethodId } = usePelcro();
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
  const orderPrice = getOrderInfo().price;

  const orderCurrency = getOrderInfo().currency;

  const orderLabel = getOrderInfo().label;
  const purchase = (
    gatewayService,
    gatewayToken,
    state,
    dispatch
  ) => {
    const isQuickPurchase = !Array.isArray(order);
    const mappedOrderItems = isQuickPurchase
      ? [{ sku_id: order.id, quantity: order.quantity }]
      : order.map((item) => ({
          sku_id: item.id,
          quantity: item.quantity
        }));

    const { couponCode } = state;

    const payment = new Payment(gatewayService);

    payment.execute(
      {
        type: PAYMENT_TYPES.PURCHASE_ECOMMERCE_ORDER,
        token: gatewayToken,
        isExistingSource: Boolean(selectedPaymentMethodId),
        items: mappedOrderItems,
        addressId: state.selectedAddressId,
        couponCode
      },
      (err, orderResponse) => {
        if (err) {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
          onFailure?.(err);
          return dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(err)
            }
          });
        }

        if (isQuickPurchase) {
          set({ order: null });
        } else {
          set({ order: null, cartItems: [] });
        }

        window.Pelcro.user.refresh(
          {
            auth_token: window.Pelcro?.user?.read()?.auth_token
          },
          (err, res) => {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
            if (err) {
              onFailure?.(err);
              return dispatch({
                type: SHOW_ALERT,
                payload: {
                  type: "error",
                  content: getErrorMessages(err)
                }
              });
            }
            onSuccess?.(orderResponse);
          }
        );
      }
    );
  };

  useEffect(() => {
    if (!stripe) {
      setIsInitializing(false);
      return;
    }

    let mounted = true;

    const initializePaymentRequest = async () => {
      try {
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
            amount: updatedPrice ?? currentPlan?.amount ?? orderPrice,
            pending: false
          },
          requestPayerEmail: false,
          requestPayerName: false,
          requestShipping: false
        });

        pr.on("source", async (event) => {
          try {
            dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
            dispatch({ type: DISABLE_SUBMIT, payload: true });
            dispatch({ type: LOADING, payload: true });

            event.complete("success");

            // Modern Stripe handles 3D Secure automatically

            // Handle different payment types
            if (type === "orderCreate") {
              purchase(
                new StripeGateway(),
                event.source.id,
                state,
                dispatch
              );
            } else {
              dispatch({
                type: SUBSCRIBE,
                payload: {
                  id: event.source.id,
                  isExistingSource: false
                }
              });
            }
          } catch (error) {
            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content:
                  error.message || "Payment failed. Please try again."
              }
            });

            event.complete("fail");

            dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
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
  }, [stripe, currentPlan, updatedPrice, dispatch, order, type]);

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
        address: "auto"
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

  if (cardProcessor === "braintree") {
    if (type === "updatePaymentSource") {
      return (
        <div>
          {paymentMethodToEdit ? (
            <div>
              <label htmlFor="card-number">Card Number *</label>
              <Input
                id="card-number"
                className="plc-tracking-widest plc-flex-grow plc-h-12 plc-text-center"
                value={`•••• •••• •••• ${paymentMethodToEdit?.properties?.last4}`}
                disabled
              />
              <div className="plc-flex plc-items-start plc-space-x-8 plc-my-6">
                <div>
                  <label htmlFor="expiration-month">
                    Expiration Month *
                  </label>
                  <div
                    id="expiration-month"
                    className="pelcro-input-field plc-h-12 plc-bg-white"
                  ></div>
                </div>
                <div>
                  <label htmlFor="expiration-year">
                    Expiration Year *
                  </label>
                  <div
                    id="expiration-year"
                    className="pelcro-input-field plc-h-12 plc-bg-white"
                  ></div>
                </div>
                <div>
                  <label htmlFor="cvv">CVV *</label>
                  <div
                    id="cvv"
                    className="pelcro-input-field plc-h-12 plc-bg-white"
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="plc-w-full plc-h-40 plc-bg-gray-300 plc-rounded plc-animate-pulse"></div>
          )}
        </div>
      );
    }
    return (
      <div>
        <div className="plc-max-w-[50em]">
          {/* Braintree Drop-in UI container */}
          <div
            id="dropin-container"
            className="plc-w-full plc-min-h-[300px]"
          ></div>
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
