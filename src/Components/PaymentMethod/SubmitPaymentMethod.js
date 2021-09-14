import React, { useContext } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { SUBMIT_PAYMENT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { getFormattedPriceByLocal } from "../../utils/utils";

export const SubmitPaymentMethod = ({ onClick, ...otherProps }) => {
  const { plan } = usePelcro();
  const { t } = useTranslation("checkoutForm");
  const {
    dispatch,
    state: { disableSubmit, isLoading, updatedPrice }
  } = useContext(store);
  const { default_locale } = Pelcro.site.read();

  const planQuantity = plan?.quantity ?? 1;
  const price = updatedPrice ?? plan?.amount;
  const priceFormatted = getFormattedPriceByLocal(
    price * planQuantity,
    plan?.currency,
    default_locale
  );

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
      disabled={disableSubmit}
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
