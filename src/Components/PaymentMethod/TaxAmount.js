import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { store } from "./PaymentMethodContainer";

export const TaxAmount = () => {
  const { t } = useTranslation("checkoutForm");
  const {
    state: { taxAmount }
  } = useContext(store);
  const { plan } = usePelcro();

  const planQuantity = plan?.quantity ?? 1;
  const priceFormatted = getFormattedPriceByLocal(
    taxAmount * planQuantity,
    plan?.currency,
    getPageOrDefaultLanguage()
  );

  if (taxAmount) {
    return (
      <div className="plc-text-center pelcro-tax-amount">
        {t("labels.tax")}{" "}
        <span className="plc-font-bold">{priceFormatted}</span>
      </div>
    );
  }

  return null;
};
