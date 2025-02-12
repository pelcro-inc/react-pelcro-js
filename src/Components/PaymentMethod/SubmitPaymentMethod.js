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

      // Price calculation verification
      console.group("💰 Amount Verification");
      console.log("Initial Amount Setup:", {
        price,
        planQuantity,
        currency: plan?.currency,
        finalAmount: price * planQuantity
      });

      const finalAmount = price * planQuantity;
      const currency = plan?.currency?.toLowerCase() || "gbp";

      // Validate amount and currency before proceeding
      if (!finalAmount || finalAmount <= 0) {
        console.error("❌ Amount Error:", {
          finalAmount,
          price,
          planQuantity
        });
        return;
      }

      console.log("✅ Final Amount Ready:", {
        amount: finalAmount,
        currency,
        isPending: false
      });
      console.groupEnd();

      // Create payment request with validated values
      const paymentRequest = stripe.paymentRequest({
        country: "GB",
        currency,
        total: {
          label: plan?.nickname || "Payment",
          amount: finalAmount
        },
        displayItems: [
          {
            amount: finalAmount,
            label: plan?.nickname || "Payment",
            pending: false
          }
        ],
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
        disableWallets: ["googlePay"]
      });

      // Add immediate update to ensure amount is set
      try {
        paymentRequest.update({
          currency,
          total: {
            amount: finalAmount,
            label: plan?.nickname || "Payment",
            pending: false
          },
          displayItems: [
            {
              amount: finalAmount,
              label: plan?.nickname || "Payment",
              pending: false
            }
          ]
        });

        console.log("✅ Payment Request Status:", {
          amount: finalAmount,
          currency,
          isUpdated: true,
          isPending: false
        });
      } catch (updateError) {
        console.error(
          "❌ Payment Request Update Failed:",
          updateError
        );
      }

      paymentRequest
        .canMakePayment()
        .then((result) => {
          console.log("🔍 Apple Pay Availability:", {
            isAvailable: !!result?.applePay,
            canMakePayment: !!result
          });

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
          console.error("❌ Apple Pay Check Failed:", err);
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
              `${window.Pelcro.environment.domain}/api/v1/stripe/register-domain`,
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
