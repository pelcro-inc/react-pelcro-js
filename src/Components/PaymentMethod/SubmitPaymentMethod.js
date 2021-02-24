import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { SUBMIT_PAYMENT } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { getFormattedPriceByLocal } from "../../utils/utils";

export const SubmitPaymentMethod = ({ children }) => {
  const { t } = useTranslation("checkoutForm");
  const {
    dispatch,
    state: { disableSubmit, isLoading, updatedPrice, currentPlan }
  } = useContext(store);

  const { default_locale } = Pelcro.site.read();
  const priceFormatted = getFormattedPriceByLocal(
    updatedPrice ?? currentPlan?.amount,
    currentPlan?.currency,
    default_locale
  );

  return (
    <Button
      className="py-3"
      variant="solid"
      isLoading={isLoading}
      isFullWidth={true}
      onClick={() => dispatch({ type: SUBMIT_PAYMENT })}
      disabled={disableSubmit}
    >
      {/* Show price on button only if there's a selected plan */}
      {currentPlan ? (
        <span className="capitalize ">
          {t("labels.pay")} {priceFormatted && priceFormatted}
        </span>
      ) : (
        t("labels.submit")
      )}
    </Button>
  );
};
