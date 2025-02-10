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
import { getSiteCardProcessor } from "../common/Helpers";
export const SubmitPaymentMethod = ({
  onClick,
  isSubmitDisabled,
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

  // Payment Element options
  const paymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false
    },
    paymentMethodOrder: ["apple_pay", "card"],
    wallets: {
      applePay: "auto"
    },
    defaultValues: {
      billingDetails: {
        name: window?.Pelcro?.user?.read()?.name,
        email: window?.Pelcro?.user?.read()?.email,
        phone: window?.Pelcro?.user?.read()?.phone
      }
    },
    payment_request: {
      country: "US",
      currency: plan?.currency?.toLowerCase(),
      total: {
        label: plan?.nickname || "Payment",
        amount: Math.round(price * 100),
        pending: false
      }
    }
  };
  useEffect(() => {
    if (!elements || !price) return;
    const element = elements.getElement(PaymentElement);
    if (element) {
      console.log(
        "Updating PaymentElement amount:",
        Math.round(price * 100)
      );
      element.update({
        business: {
          name: plan?.nickname || "Payment"
        },
        paymentMethodOrder: ["apple_pay", "card"],
        defaultValues: {
          billingDetails: {
            name: window?.Pelcro?.user?.read()?.name,
            email: window?.Pelcro?.user?.read()?.email,
            phone: window?.Pelcro?.user?.read()?.phone
          }
        }
      });
    }
  }, [price, plan?.currency, plan?.nickname, elements]);

  useEffect(() => {
    console.log("Price debug info:", {
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
    if (!stripe || !plan || !price) {
      console.log("Payment request prerequisites not met:", {
        hasStripe: !!stripe,
        hasPlan: !!plan,
        hasPrice: !!price,
        priceValue: price,
        planDetails: plan,
        stripeElement: !!elements?.getElement(PaymentElement)
      });
      return;
    }

    try {
      const priceInCents = Math.round(price * 100);
      const totalAmount = price * planQuantity;
      const totalAmountInCents = Math.round(totalAmount * 100);

      console.log("Creating payment request:", {
        amount: priceInCents,
        totalAmount: totalAmountInCents,
        currency: plan.currency?.toLowerCase(),
        originalPrice: price,
        planQuantity,
        label: plan.nickname || "Payment",
        billingDetails: {
          name: window?.Pelcro?.user?.read()?.name,
          email: window?.Pelcro?.user?.read()?.email
        }
      });

      const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: plan.currency.toLowerCase(),
        total: {
          label: plan.nickname || "Payment",
          amount: totalAmountInCents,
          pending: false
        }
      });

      paymentRequest.on("paymentmethod", (event) => {
        console.log(
          "Payment method selected:",
          event.paymentMethod.type
        );
      });

      paymentRequest.on("shippingaddresschange", (event) => {
        console.log(
          "Shipping address changed:",
          event.shippingAddress
        );
      });

      const element = elements?.getElement(PaymentElement);
      if (element) {
        console.log(
          "Updating element with amount:",
          totalAmountInCents
        );
        element.update({
          payment_request: {
            currency: plan.currency.toLowerCase(),
            total: {
              label: plan.nickname || "Payment",
              amount: totalAmountInCents,
              pending: false
            }
          }
        });
      }

      paymentRequest.canMakePayment().then((result) => {
        console.log("Can make payment result:", {
          canMakePayment: !!result,
          applePay: result?.applePay,
          googlePay: result?.googlePay
        });

        dispatch({
          type: "SET_CAN_MAKE_PAYMENT",
          payload: !!result
        });
        dispatch({
          type: "SET_PAYMENT_REQUEST",
          payload: paymentRequest
        });
      });
    } catch (error) {
      console.error("Payment request error:", {
        error,
        message: error.message,
        code: error.code,
        type: error.type,
        stripeState: {
          hasStripe: !!stripe,
          hasElements: !!elements
        }
      });
    }
  }, [
    stripe,
    plan?.currency,
    plan?.nickname,
    price,
    dispatch,
    elements,
    planQuantity
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
          elements,
          params: {
            billing_details: {
              name: window?.Pelcro?.user?.read()?.name,
              email: window?.Pelcro?.user?.read()?.email,
              phone: window?.Pelcro?.user?.read()?.phone
            }
          }
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
            return;
          }

          console.log("Payment source created successfully:", res);
          dispatch({ type: SUBMIT_PAYMENT });
          onClick?.();
        }
      );
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

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

  return (
    <>
      {/* Show PaymentElement only for Stripe */}
      {cardProcessor === "stripe" ? (
        <>
          {!selectedPaymentMethodId && (
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
          )}

          <Button
            role="submit"
            className="plc-w-full plc-py-3 plc-mt-4"
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
        </>
      ) : (
        // Show only button for non-Stripe processors
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
