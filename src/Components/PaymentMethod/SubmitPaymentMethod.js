import React, { useContext, useState, useEffect } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { SUBMIT_PAYMENT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import {
  getSiteCardProcessor,
  getErrorMessages
} from "../common/Helpers";
import { StripeGateway } from "../../services/Subscription/Payment.service";

export const SubmitPaymentMethod = ({
  onClick,
  isSubmitDisabled,
  type = "createPaymentSource",
  product,
  selectedAddressId,
  ...otherProps
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { plan, selectedPaymentMethodId } = usePelcro();
  const { t } = useTranslation("checkoutForm");
  const cardProcessor = getSiteCardProcessor();

  const {
    dispatch,
    state: {
      firstNameError,
      lastNameError,
      phoneError,
      firstName,
      lastName,
      phone,
      disableSubmit,
      isLoading,
      updatedPrice,
      month,
      year
    }
  } = useContext(store);

  const planQuantity = plan?.quantity ?? 1;
  const price = updatedPrice ?? plan?.amount;
  const priceFormatted = getFormattedPriceByLocal(
    price * planQuantity,
    plan?.currency,
    getPageOrDefaultLanguage()
  );

  const supportsTap = Boolean(
    window.Pelcro.site.read()?.tap_gateway_settings
  );
  const supportsCybersource = Boolean(
    window.Pelcro.site.read()?.cybersource_gateway_settings
  );

  const isUserFirstName = Boolean(
    window.Pelcro.user.read().first_name
  );
  const isUserLastName = Boolean(window.Pelcro.user.read().last_name);
  const isUserPhone = Boolean(window.Pelcro.user.read().phone);

  const [isDisabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);

  // Payment Element options
  const paymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false
    },
    paymentMethodOrder: ["apple_pay", "card"],
    wallets: {
      applePay: "auto",
      googlePay: "never"
    },
    fields: {
      billingDetails: {
        name: "auto",
        email: "auto",
        phone: "auto",
        address: {
          country: "auto",
          postalCode: "auto",
          state: "auto",
          city: "auto",
          line1: "auto",
          line2: "auto"
        }
      }
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Payment component error:", error);
    }
  }, [error]);

  const handleError = (err) => {
    setError(err);
    console.error("Payment error:", err);
  };

  useEffect(() => {
    console.log("Component mounted with:", {
      cardProcessor,
      stripeLoaded: !!stripe,
      elementsLoaded: !!elements,
      selectedPaymentMethodId,
      plan,
      price
    });

    if (!elements || !price) {
      console.log("Missing required elements:", {
        hasElements: !!elements,
        hasPrice: !!price
      });
      return;
    }

    const element = elements.getElement(PaymentElement);
    console.log("PaymentElement status:", {
      elementFound: !!element,
      elementType: element?.type
    });

    if (element) {
      console.group("🔄 APPLE PAY PAYMENT FLOW");

      // Initial state logging
      console.log("Initial State:", {
        price,
        planQuantity,
        plan,
        updatedPrice,
        selectedPaymentMethodId,
        stripeReady: !!stripe,
        elementsReady: !!elements,
        domain: window.location.hostname
      });

      // Price calculation verification
      console.group("💰 Apple Pay Amount Debug");
      console.log("Raw Values:", {
        price,
        planQuantity,
        isInCents: true,
        planAmount: plan?.amount,
        updatedPrice,
        currency: plan?.currency
      });

      const finalAmount = price * planQuantity;
      const currency = plan?.currency?.toLowerCase() || "gbp";

      // Validate amount and currency before proceeding
      if (!finalAmount || finalAmount <= 0) {
        console.error("❌ Invalid amount for payment request:", {
          finalAmount,
          price,
          planQuantity
        });
        return;
      }

      if (!currency || currency.length !== 3) {
        console.error("❌ Invalid currency for payment request:", {
          currency,
          originalCurrency: plan?.currency
        });
        return;
      }

      const formattedAmount = new Intl.NumberFormat(
        navigator.language || "en",
        {
          style: "currency",
          currency
        }
      ).format(finalAmount / 100);

      console.log("Final Amount:", {
        calculatedAmount: finalAmount,
        currency,
        formattedDisplay: formattedAmount,
        inCents: true
      });
      console.groupEnd();

      // Verify final amount before payment request
      console.log("🔍 Payment Request Amount Verification:", {
        finalAmount,
        willDisplay: formattedAmount,
        isAmountValid: finalAmount > 0,
        isPending: false
      });

      // Create payment request with validated values
      const paymentRequest = stripe.paymentRequest({
        country: "GB",
        currency,
        total: {
          label: plan?.nickname || "Payment",
          amount: finalAmount,
          pending: false
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
        disableWallets: ["googlePay"]
      });

      // Validate payment request was created
      if (!paymentRequest) {
        console.error("❌ Failed to create payment request");
        return;
      }

      // Add immediate update to ensure amount is set
      try {
        // First update to ensure amount is set
        paymentRequest.update({
          total: {
            label: plan?.nickname || "Payment",
            amount: finalAmount,
            pending: false
          }
        });

        // Second update with final status
        setTimeout(() => {
          paymentRequest.update({
            total: {
              label: plan?.nickname || "Payment",
              amount: finalAmount,
              pending: false
            },
            status: "final"
          });
        }, 0);

        console.log("✅ Payment request updated successfully:", {
          amount: finalAmount,
          currency,
          label: plan?.nickname || "Payment",
          amountFormatted: formattedAmount,
          isPending: false
        });
      } catch (updateError) {
        console.error(
          "❌ Failed to update payment request:",
          updateError
        );

        // Attempt recovery update
        try {
          paymentRequest.update({
            total: {
              label: plan?.nickname || "Payment",
              amount: finalAmount,
              pending: false
            }
          });
        } catch (recoveryError) {
          console.error("❌ Recovery update failed:", recoveryError);
        }
      }

      // Add amount change listener
      paymentRequest.on("shippingaddresschange", (event) => {
        // Ensure amount stays fixed even if shipping address changes
        event.updateWith({
          status: "success",
          total: {
            label: plan?.nickname || "Payment",
            amount: finalAmount,
            pending: false
          }
        });
      });

      // Add amount validation before payment
      paymentRequest.on("paymentmethod", async (event) => {
        // Verify amount hasn't changed
        const currentAmount = event.paymentMethod?.amount;
        if (currentAmount && currentAmount !== finalAmount) {
          console.error("❌ Amount mismatch detected:", {
            expected: finalAmount,
            received: currentAmount
          });
          event.complete("fail");
          return;
        }

        console.group("💳 Payment Method Event");
        try {
          if (!event.paymentMethod?.id) {
            console.error("❌ Invalid payment method received");
            event.complete("fail");
            dispatch({
              type: "SHOW_ALERT",
              payload: {
                type: "error",
                content: "Invalid payment method"
              }
            });
            return;
          }

          console.log("Payment Method Details:", {
            type: event.paymentMethod.type,
            id: event.paymentMethod.id,
            complete: !!event.complete,
            billingDetails: event.paymentMethod.billing_details
          });

          console.log("🔄 Creating Pelcro Payment Source...");
          window.Pelcro.paymentMethods.create(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              token: event.paymentMethod.id
            },
            (err, res) => {
              if (err) {
                console.error("❌ Payment Source Creation Failed:", {
                  error: err,
                  message: err.message,
                  code: err.code,
                  type: err.type,
                  details: err.details
                });
                event.complete("fail");
                dispatch({
                  type: "SHOW_ALERT",
                  payload: {
                    type: "error",
                    content: getErrorMessages(err)
                  }
                });
                console.groupEnd();
                return;
              }

              console.log("✅ Payment Source Created:", {
                sourceId: res.data.id,
                response: res
              });

              const sourceId = res.data.id;

              if (type === "createPayment") {
                console.log("🔄 Creating Subscription:", {
                  sourceId,
                  planId: plan.id,
                  quantity: plan?.quantity || 1,
                  hasAddress: !!selectedAddressId
                });
                // Handle subscription creation
                window.Pelcro.subscription.create(
                  {
                    source_id: sourceId,
                    auth_token: window.Pelcro.user.read().auth_token,
                    plan_id: plan.id,
                    quantity: plan?.quantity || 1,
                    coupon_code: state?.couponCode,
                    campaign_key:
                      window.Pelcro.helpers.getURLParameter(
                        "campaign_key"
                      ),
                    address_id: product?.address_required
                      ? selectedAddressId
                      : null
                  },
                  (subErr, subRes) => {
                    if (subErr) {
                      console.error(
                        "❌ Subscription Creation Failed:",
                        {
                          error: subErr,
                          message: subErr.message,
                          code: subErr.code,
                          type: subErr.type,
                          raw: subErr
                        }
                      );
                      event.complete("fail");
                      dispatch({
                        type: "SHOW_ALERT",
                        payload: {
                          type: "error",
                          content: getErrorMessages(subErr)
                        }
                      });
                      console.groupEnd();
                      return;
                    }

                    console.log(
                      "✅ Subscription Created Successfully:",
                      {
                        subscriptionId: subRes.data?.id,
                        paymentIntent: subRes.data?.payment_intent,
                        setupIntent: subRes.data?.setup_intent,
                        status: subRes.data?.status,
                        response: subRes
                      }
                    );

                    event.complete("success");
                    dispatch({ type: SUBMIT_PAYMENT });
                    onClick?.();
                    console.groupEnd();
                    console.groupEnd();
                  }
                );
              } else if (type === "orderCreate") {
                console.log("Creating Order with Source:", {
                  sourceId,
                  gateway: "stripe"
                });
                // Handle order creation
                purchase(
                  new StripeGateway(),
                  sourceId,
                  state,
                  dispatch,
                  () => {
                    console.log("Order Creation Successful");
                    event.complete("success");
                  },
                  () => {
                    console.error("Order Creation Failed");
                    event.complete("fail");
                  }
                );
              }
            }
          );
        } catch (error) {
          console.error("Payment Flow Error:", error);
          event.complete("fail");
          dispatch({
            type: "SHOW_ALERT",
            payload: {
              type: "error",
              content: getErrorMessages(error)
            }
          });
        }
      });

      paymentRequest
        .canMakePayment()
        .then((result) => {
          console.log("🔍 Can Make Payment Check:", {
            canMakePayment: !!result,
            applePay: result?.applePay,
            googlePay: result?.googlePay,
            rawResult: result
          });

          if (result) {
            console.log("✅ Payment Method Available");
          } else {
            console.log("❌ Payment Method Not Available");
          }

          dispatch({
            type: "SET_CAN_MAKE_PAYMENT",
            payload: !!result
          });
          if (result) {
            dispatch({
              type: "SET_PAYMENT_REQUEST",
              payload: paymentRequest
            });
          }
          console.groupEnd();
        })
        .catch((err) => {
          console.error("❌ Can Make Payment Check Failed:", {
            error: err,
            message: err.message,
            code: err.code,
            type: err.type
          });
          console.groupEnd();
        });
    }
  }, [stripe, elements, price, plan?.currency, planQuantity]);

  useEffect(() => {
    console.log("Price/Plan Debug Info:", {
      updatedPrice,
      planAmount: plan?.amount,
      finalPrice: price,
      priceInCents: Math.round(price * 100),
      formattedPrice: priceFormatted,
      planCurrency: plan?.currency,
      planNickname: plan?.nickname,
      planQuantity,
      pelcroUser: window.Pelcro?.user?.read(),
      pelcroSite: window.Pelcro?.site?.read(),
      stripeReady: !!stripe,
      elementsReady: !!elements,
      isDisabled,
      disableSubmit,
      isLoading
    });

    if (!price || price <= 0) {
      console.error("Invalid price detected:", {
        price,
        updatedPrice,
        planAmount: plan?.amount
      });
    }

    if (plan?.currency && !/^[A-Za-z]{3}$/.test(plan.currency)) {
      console.error("Invalid currency format:", plan.currency);
    }

    if (price && Math.round(price * 100) <= 0) {
      console.error(
        "Price conversion to cents resulted in zero or negative:",
        {
          originalPrice: price,
          inCents: Math.round(price * 100)
        }
      );
    }
  }, [
    price,
    updatedPrice,
    plan,
    stripe,
    elements,
    isDisabled,
    disableSubmit,
    isLoading,
    priceFormatted,
    planQuantity
  ]);

  useEffect(() => {
    if (
      supportsTap &&
      isUserFirstName &&
      isUserLastName &&
      isUserPhone
    ) {
      setDisabled(disableSubmit);
    } else {
      setDisabled(
        disableSubmit ||
          (supportsTap && firstNameError) ||
          (supportsTap && lastNameError) ||
          (supportsTap && phoneError) ||
          (supportsTap && !firstName?.length) ||
          (supportsTap && !lastName?.length) ||
          (supportsTap && !phone?.length) ||
          (supportsCybersource &&
            !selectedPaymentMethodId &&
            !month?.length) ||
          (supportsCybersource &&
            !selectedPaymentMethodId &&
            !year?.length)
      );
    }
  }, [
    disableSubmit,
    firstNameError,
    lastNameError,
    phoneError,
    firstName,
    lastName,
    phone,
    month,
    year
  ]);

  const handleSubmit = async () => {
    if (cardProcessor !== "stripe") {
      dispatch({ type: SUBMIT_PAYMENT });
      onClick?.();
      return;
    }

    if (!stripe || !elements) return;

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Submit error:", submitError);
        return;
      }

      // Create the payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          elements
        });

      if (paymentMethodError) {
        console.error("Payment method error:", paymentMethodError);
        return;
      }

      // Create payment source with Pelcro
      window.Pelcro.paymentMethods.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          token: paymentMethod.id
        },
        (err, res) => {
          if (err) {
            console.error(
              "Pelcro payment method creation error:",
              err
            );
            dispatch({
              type: "SHOW_ALERT",
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
            return;
          }

          console.log("Payment source created successfully:", res);
          const sourceId = res.data.id;

          if (type === "createPayment") {
            // Handle subscription creation
            window.Pelcro.subscription.create(
              {
                source_id: sourceId,
                auth_token: window.Pelcro.user.read().auth_token,
                plan_id: plan.id,
                quantity: plan?.quantity || 1,
                coupon_code: state?.couponCode,
                campaign_key:
                  window.Pelcro.helpers.getURLParameter(
                    "campaign_key"
                  ),
                address_id: product?.address_required
                  ? selectedAddressId
                  : null
              },
              (subErr, subRes) => {
                if (subErr) {
                  dispatch({
                    type: "SHOW_ALERT",
                    payload: {
                      type: "error",
                      content: getErrorMessages(subErr)
                    }
                  });
                  return;
                }
                dispatch({ type: SUBMIT_PAYMENT });
                onClick?.();
              }
            );
          } else if (type === "orderCreate") {
            // Handle order creation
            purchase(
              new StripeGateway(),
              sourceId,
              state,
              dispatch,
              () => {
                dispatch({ type: SUBMIT_PAYMENT });
                onClick?.();
              },
              () => {
                console.error("Order Creation Failed");
              }
            );
          } else {
            dispatch({ type: SUBMIT_PAYMENT });
            onClick?.();
          }
        }
      );
    } catch (error) {
      console.error("Payment error:", error);
      dispatch({
        type: "SHOW_ALERT",
        payload: {
          type: "error",
          content: getErrorMessages(error)
        }
      });
    }
  };

  // Add this before the main useEffect
  useEffect(() => {
    if (!stripe) return;

    let mounted = true;
    let currentPaymentRequest = null;

    const verifyApplePayDomain = async () => {
      if (!mounted) return;

      try {
        // First check if we can make Apple Pay payments
        const paymentRequest = stripe.paymentRequest({
          country: "GB",
          currency: plan?.currency?.toLowerCase() || "gbp",
          total: {
            label: "Verification",
            amount: 1,
            pending: false
          },
          requestPayerName: true,
          requestPayerEmail: true
        });

        currentPaymentRequest = paymentRequest;

        const canMakePaymentResult =
          await paymentRequest.canMakePayment();

        if (!mounted) return;

        console.log("🍎 Apple Pay Initial Check:", {
          isAvailable: !!canMakePaymentResult?.applePay,
          details: canMakePaymentResult,
          domain: window.location.hostname
        });

        if (canMakePaymentResult?.applePay) {
          try {
            const response = await fetch(
              `${window.Pelcro.environment.domain}/api/v1/stripe/apple-pay/domains`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${
                    window.Pelcro.user.read().auth_token
                  }`
                },
                body: JSON.stringify({
                  domain: window.location.hostname,
                  stripe_account: window.Pelcro.site.read().account_id
                })
              }
            );

            if (!mounted) return;

            if (!response.ok) {
              throw new Error(
                `Domain registration failed: ${response.statusText}`
              );
            }

            const result = await response.json();
            console.log("✅ Apple Pay Domain Registration:", {
              success: true,
              domain: window.location.hostname,
              response: result
            });

            if (mounted) {
              dispatch({
                type: "SET_APPLE_PAY_READY",
                payload: true
              });
            }
          } catch (regError) {
            if (!mounted) return;
            console.error("❌ Domain Registration Failed:", {
              error: regError,
              domain: window.location.hostname
            });
          }
        } else {
          console.log(
            "⚠️ Apple Pay not available on this device/browser"
          );
        }
      } catch (err) {
        if (!mounted) return;
        console.error("❌ Apple Pay Setup Failed:", {
          error: err,
          domain: window.location.hostname
        });
      }
    };

    verifyApplePayDomain();

    // Cleanup function
    return () => {
      mounted = false;
      if (currentPaymentRequest) {
        try {
          // Clean up any listeners or state
          currentPaymentRequest = null;
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      }
    };
  }, [stripe, plan?.currency, dispatch]);

  return (
    <>
      {/* Show PaymentElement only for Stripe */}
      {cardProcessor === "stripe" && (
        <div className="plc-space-y-4">
          {!selectedPaymentMethodId && (
            <div className="plc-p-4 plc-bg-white plc-rounded-lg plc-shadow">
              <PaymentElement
                id="payment-element"
                options={paymentElementOptions}
                className="plc-w-full"
              />
            </div>
          )}

          <Button
            role="submit"
            className="plc-w-full plc-py-3"
            variant="solid"
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={
              disableSubmit ||
              isSubmitDisabled ||
              !stripe ||
              !elements
            }
            {...otherProps}
          >
            {plan ? (
              <span className="plc-capitalize">
                {t("labels.pay")} {priceFormatted && priceFormatted}
              </span>
            ) : (
              t("labels.submit")
            )}
          </Button>
        </div>
      )}

      {/* Show only button for non-Stripe processors */}
      {cardProcessor !== "stripe" && (
        <Button
          role="submit"
          className="plc-w-full plc-py-3 plc-mt-4"
          variant="solid"
          isLoading={isLoading}
          onClick={handleSubmit}
          disabled={disableSubmit || isSubmitDisabled}
          {...otherProps}
        >
          {plan ? (
            <span className="plc-capitalize">
              {t("labels.pay")} {priceFormatted && priceFormatted}
            </span>
          ) : (
            t("labels.submit")
          )}
        </Button>
      )}
    </>
  );
};
