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
      defaultCollapsed: false,
      radios: false
    },
    paymentMethodOrder: ["apple_pay", "card"],
    wallets: {
      applePay: "auto",
      googlePay: "never"
    },
    defaultValues: {
      billingDetails: {
        name: window?.Pelcro?.user?.read()?.name,
        email: window?.Pelcro?.user?.read()?.email,
        phone: window?.Pelcro?.user?.read()?.phone
      }
    },
    business: {
      name: "Motor Sport Magazine"
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
    if (!stripe || !elements || !price) {
      console.log("⚠️ Payment Setup:", {
        hasStripe: !!stripe,
        hasElements: !!elements,
        hasPrice: !!price,
        price,
        updatedPrice,
        planAmount: plan?.amount
      });
      return;
    }

    const setupApplePay = async () => {
      try {
        // Calculate final amount in smallest currency unit (e.g., cents)
        const rawAmount = price * planQuantity;
        const finalAmount = Math.round(rawAmount);
        const currency = plan?.currency?.toLowerCase() || "gbp";

        // Strict amount validation
        if (
          !finalAmount ||
          finalAmount <= 0 ||
          !Number.isInteger(finalAmount)
        ) {
          console.error("❌ Payment Validation Failed:", {
            finalAmount,
            currency,
            rawAmount,
            price,
            planQuantity
          });
          return;
        }

        // Register domain with Stripe for Apple Pay
        try {
          const response = await fetch(
            `${window.Pelcro.environment.domain}/api/v1/stripe/apple-domains/register`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${
                  window.Pelcro.user.read().auth_token
                }`,
                "Content-Type": "application/json",
                Origin: window.location.origin
              },
              credentials: "include",
              mode: "cors"
            }
          );

          if (!response.ok) {
            throw new Error(
              `Domain registration failed: ${response.status} - ${response.statusText}`
            );
          }
        } catch (err) {
          console.error("❌ Apple Pay Domain Registration Failed:", {
            error: err.message,
            status: err.response?.status,
            domain: window.location.hostname
          });
          // Continue anyway as domain might be already registered
        }

        // Single payment request initialization
        const paymentRequest = stripe.paymentRequest({
          country: "GB",
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
          ],
          requestPayerName: true,
          requestPayerEmail: true,
          requestShipping: false,
          disableWallets: ["googlePay"]
        });

        // Check if Apple Pay is available
        const result = await paymentRequest.canMakePayment();

        if (result?.applePay) {
          console.log("✅ Apple Pay Setup Complete:", {
            amount: finalAmount,
            formattedAmount: getFormattedPriceByLocal(
              finalAmount / 100,
              currency,
              getPageOrDefaultLanguage()
            ),
            currency,
            label: plan?.nickname || "Payment"
          });

          dispatch({ type: "SET_CAN_MAKE_PAYMENT", payload: true });
          dispatch({
            type: "SET_PAYMENT_REQUEST",
            payload: paymentRequest
          });

          // Set up payment request handler
          paymentRequest.on("paymentmethod", async (event) => {
            try {
              const { paymentMethod } = event;

              window.Pelcro.paymentMethods.create(
                {
                  auth_token: window.Pelcro.user.read().auth_token,
                  token: paymentMethod.id,
                  gateway: "stripe"
                },
                (err, res) => {
                  if (err) {
                    console.error(
                      "❌ Payment Method Creation Failed:",
                      {
                        error: err.message,
                        code: err.code,
                        type: paymentMethod.type,
                        details: err.details
                      }
                    );
                    event.complete("fail");
                    return;
                  }

                  event.complete("success");
                  handlePayment(res.data);
                }
              );
            } catch (error) {
              console.error("❌ Payment Processing Error:", {
                error: error.message,
                code: error.code,
                stack: error.stack
              });
              event.complete("fail");
            }
          });
        } else {
          console.log("⚠️ Apple Pay Not Available:", {
            device: navigator.platform,
            browser: navigator.userAgent,
            location: window.location.hostname
          });
        }
      } catch (error) {
        console.error("❌ Payment Setup Error:", {
          error: error.message,
          code: error.code,
          type: error.type,
          stack: error.stack
        });
      }
    };

    setupApplePay();
  }, [stripe, elements, price, plan?.currency, planQuantity]);

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
