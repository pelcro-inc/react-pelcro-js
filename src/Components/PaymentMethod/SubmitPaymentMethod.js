import React, { useContext, useState, useEffect } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { SUBMIT_PAYMENT, SHOW_ALERT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";

export const SubmitPaymentMethod = ({
  onClick,
  isSubmitDisabled,
  ...otherProps
}) => {
  const { plan, selectedPaymentMethodId } = usePelcro();
  const { t } = useTranslation("checkoutForm");
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

  const handlePayment = async (event) => {
    // CRITICAL: Must be at the top of the handler
    event?.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Get payment element FIRST before any async operations
      const paymentElement = elements.getElement(PaymentElement);
      if (!paymentElement) {
        throw new Error("Payment element not initialized");
      }

      // Submit the form first - this handles Apple Pay properly
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // For regular card payment
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

      // Only dispatch SUBMIT_PAYMENT after successful submission
      dispatch({ type: SUBMIT_PAYMENT });
      onClick?.();
    } catch (error) {
      console.error("Payment error:", error);
      dispatch({
        type: SHOW_ALERT,
        payload: { type: "error", content: error.message }
      });
    }
  };

  return (
    <Button
      role="submit"
      className="plc-w-full plc-py-3"
      variant="solid"
      isLoading={isLoading}
      onClick={handlePayment}
      disabled={disableSubmit || isSubmitDisabled}
      {...otherProps}
    >
      {/* Show price on button only if there's a selected plan */}
      {plan ? (
        <span className="plc-capitalize ">
          {t("labels.pay")} {priceFormatted && priceFormatted}
        </span>
      ) : (
        t("labels.submit")
      )}
    </Button>
  );
};
