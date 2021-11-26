import React, { useContext } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { store } from "./PaymentMethodContainer";

export const DiscountedPrice = (props) => {
  const {
    state: { updatedPrice, taxAmount, percentOff }
  } = useContext(store);
  const { order, plan } = usePelcro();

  const ecommOrderCurrency = order?.currency ?? order?.[0]?.currency;
  const planQuantity = plan?.quantity ?? 1;
  const discountedPriceWithoutTax = updatedPrice - taxAmount;

  const priceFormatted = getFormattedPriceByLocal(
    order ? updatedPrice : discountedPriceWithoutTax * planQuantity,
    ecommOrderCurrency ?? plan?.currency,
    getPageOrDefaultLanguage()
  );

  if (percentOff) {
    return (
      <div
        className="plc-flex plc-justify-center plc-mt-2 pelcro-discount"
        {...props}
      >
        (-{percentOff}){" "}
        <span className="plc-font-bold pelcro-discounted-price">
          {priceFormatted}
        </span>
      </div>
    );
  }

  return "";
};
