import React, { useContext, useState, useEffect } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { SUBMIT_PAYMENT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";

export const SubmitPaymentMethod = ({ onClick, ...otherProps }) => {
  const {
    plan,
    selectedDonationAmount,
    customDonationAmount,
    selectedPaymentMethodId
  } = usePelcro();
  const { t } = useTranslation("checkoutForm");
  const {
    dispatch,
    state: {
      firstNameError,
      lastNameError,
      phoneError,
      emailError,
      passwordError,
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

  const priceFormatted =
    plan?.type === "donation" &&
    (selectedDonationAmount || customDonationAmount)
      ? getFormattedPriceByLocal(
          selectedDonationAmount
            ? selectedDonationAmount *
                plan?.amount *
                (plan?.quantity ?? 1)
            : customDonationAmount *
                plan?.amount *
                (plan?.quantity ?? 1),
          plan?.currency,
          getPageOrDefaultLanguage()
        )
      : getFormattedPriceByLocal(
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
          emailError ||
          passwordError ||
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
    emailError,
    passwordError,
    month,
    year
  ]);

  return (
    <Button
      role="submit"
      className="plc-w-full plc-py-3"
      variant="solid"
      isLoading={isLoading}
      onClick={() => {
        dispatch({ type: SUBMIT_PAYMENT });
        onClick?.();
      }}
      disabled={isDisabled}
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
