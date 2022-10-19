import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { store } from "./PaymentMethodContainer";
import { REMOVE_APPLIED_COUPON } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";

export const DiscountedPrice = (props) => {
  const { t } = useTranslation("checkoutForm");
  const {
    dispatch,
    state: { updatedPrice, taxAmount, percentOff }
  } = useContext(store);
  const { order, plan } = usePelcro();

  const isTaxInclusive = window.Pelcro.site?.read()?.tax_inclusive;

  const ecommOrderCurrency = order?.currency ?? order?.[0]?.currency;
  const planQuantity = plan?.quantity ?? 1;

  const discountedPriceWithoutTax = isTaxInclusive
    ? updatedPrice
    : updatedPrice - taxAmount;

  const priceFormatted = getFormattedPriceByLocal(
    order ? updatedPrice : discountedPriceWithoutTax * planQuantity,
    ecommOrderCurrency ?? plan?.currency,
    getPageOrDefaultLanguage()
  );

  const onCouponRemove = () => {
    dispatch({ type: REMOVE_APPLIED_COUPON });
  };

  if (percentOff) {
    return (
      <div
        className="plc-flex plc-items-center plc-justify-center plc-mt-2 pelcro-discount"
        {...props}
      >
        (-{percentOff})
        <span className="plc-ml-1 plc-font-bold pelcro-discounted-price">
          {priceFormatted}
        </span>
        <Button
          variant="ghost"
          className="plc-ml-2 plc-text-red-500 focus:plc-ring-red-500 pelcro-dashboard-sub-cancel-button"
          onClick={onCouponRemove}
        >
          ✕ {t("labels.removeCoupon")}
        </Button>
      </div>
    );
  }

  return "";
};
