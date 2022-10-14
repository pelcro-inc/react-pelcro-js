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

  const isTaxInclusive = window.Pelcro.site?.read()?.tax_inclusive;

  if (taxAmount) {
    return (
      <div className="plc-text-center pelcro-tax-amount">
        {isTaxInclusive && "("}
        {isTaxInclusive
          ? `Includes ${t("labels.tax")}`
          : `+ ${t("labels.tax")}`}{" "}
        <span className="plc-font-bold">{priceFormatted}</span>
        {isTaxInclusive && ")"}
      </div>
    );
  }

  return null;
};
