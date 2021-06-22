import React, { useContext } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { getFormattedPriceByLocal } from "../../utils/utils";
import { store } from "./PaymentMethodContainer";

export const DiscountedPrice = () => {
  const {
    state: { updatedPrice, percentOff }
  } = useContext(store);
  const { default_locale } = Pelcro.site.read();

  const { order, plan } = usePelcro();

  const ecommOrderCurrency = order?.currency ?? order?.[0]?.currency;

  const planQuantity = plan?.quantity ?? 1;

  const priceFormatted = getFormattedPriceByLocal(
    order ? updatedPrice : updatedPrice * planQuantity,
    ecommOrderCurrency ?? plan?.currency,
    default_locale
  );

  if (percentOff) {
    return (
      <div className="plc-my-2">
        (-{percentOff}) {priceFormatted}
      </div>
    );
  }

  return "";
};
