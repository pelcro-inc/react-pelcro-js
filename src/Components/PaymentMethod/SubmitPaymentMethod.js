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
    }
  };

  const handleSubmit = async () => {
    if (cardProcessor === "stripe" && (!stripe || !elements)) {
      return;
    }

    // For non-Stripe processors, dispatch immediately
    if (cardProcessor !== "stripe") {
      dispatch({ type: SUBMIT_PAYMENT });
      onClick?.();
      return;
    }

    // For Stripe, ensure elements are ready before dispatching
    try {
      // Submit the PaymentElement first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Submit error:", submitError);
        return;
      }

      // Only dispatch after successful element submission
      dispatch({ type: SUBMIT_PAYMENT });
      onClick?.();
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
